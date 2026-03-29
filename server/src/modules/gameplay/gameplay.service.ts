import type { WebSocket } from 'ws';
import { ERROR } from '../../constants/error';
import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import { db } from '../../store/db';
import { Game } from '../../types/db/game/game';
import { AnswerIncoming } from '../../types/websocket/gameplay';
import { colorLog } from '../../utils/color-log';
import { sendTo } from '../../utils/send-to';
import { authService } from '../auth/auth.service';

export const gameplayService = {
	startGame: ({ ws, gameId, messageId }: { ws: WebSocket; gameId: Game['id']; messageId: 0 }) => {
		const game = db.games.getById({ id: gameId });
		if (!game) {
			colorLog.error(ERROR.GAME_NOT_FOUND);
			authService.goToStartPage({ ws, errorText: ERROR.GAME_NOT_FOUND });
			return;
		}

		const user = db.users.getByWs({ ws });
		if (!user) {
			colorLog.error(ERROR.USER_NOT_FOUND);
			authService.goToStartPage({ ws, errorText: ERROR.USER_NOT_FOUND });
			return;
		}

		if (game.hostId !== user.index) {
			colorLog.error(ERROR.HOST_NOT_FOUND);
			authService.goToStartPage({ ws, errorText: ERROR.HOST_NOT_FOUND });
			return;
		}

		const updatedGame = db.games.updateById({
			id: gameId,
			game: {
				currentQuestion: 1,
				status: 'in_progress',
			},
		});
		if (!updatedGame) {
			colorLog.error(ERROR.GAME_NOT_FOUND);
			return;
		}

		gameplayService.showQuestion({ gameId, messageId });
	},

	showQuestion: ({ gameId, messageId }: { gameId: Game['id']; messageId: 0 }) => {
		const validatedGame = gameplayService.validateGame({ gameId });
		if (!validatedGame) return;
		const { game, hostWs, playerSockets, currentQuestion } = validatedGame;

		sendTo.many({
			sockets: [...playerSockets, hostWs].filter((ws) => ws !== undefined),
			message: {
				type: WS_MESSAGE_TYPE.OUT.QUESTION,
				data: {
					questionNumber: game.currentQuestion,
					totalQuestions: game.questions.length,
					text: currentQuestion.text,
					options: currentQuestion.options,
					timeLimitSec: currentQuestion.timeLimitSec,
				},
				id: messageId,
			},
		});

		const timeLimitMs = currentQuestion.timeLimitSec * 1000;
		const questionTimer = setTimeout(() => {
			const result = gameplayService.showQuestionResult({ gameId, messageId });
			if (!result) return;
		}, timeLimitMs);

		db.games.updateById({ id: gameId, game: { questionTimer, questionStartTime: Date.now() } });
	},

	showQuestionResult: ({ gameId, messageId }: { gameId: Game['id']; messageId: 0 }) => {
		const validatedGame = gameplayService.validateGame({ gameId });
		if (!validatedGame) return;
		const { game, hostWs, playerSockets, currentQuestion } = validatedGame;

		const playerResults = game.players.map((player) => {
			const answer = game.playerAnswers.get(player.index);
			if (!answer) {
				return {
					name: player.name,
					answered: false,
					correct: false,
					pointsEarned: 0,
					totalScore: player.score,
				};
			}

			const BASE_POINTS = 1000;
			let pointsEarned = 0;

			if (game.questionStartTime && player.answeredCorrectly) {
				const timeSpentMs = answer.timestamp - game.questionStartTime;
				const timeLimitInMs = currentQuestion.timeLimitSec * 1000;
				const timeRemainingMs = Math.max(0, timeLimitInMs - timeSpentMs);
				pointsEarned = Math.round(BASE_POINTS * (timeRemainingMs / timeLimitInMs));
			}

			const totalScore = player.score + pointsEarned;

			return {
				name: player.name,
				answered: player.hasAnswered ?? false,
				correct: player.answeredCorrectly ?? false,
				pointsEarned,
				totalScore,
			};
		});

		const updatedPlayers = game.players.map((player) => {
			const playerResult = playerResults.find((result) => result.name === player.name);
			if (!playerResult) return player;

			return {
				...player,
				score: playerResult.totalScore,
			};
		});

		db.games.updateById({
			id: game.id,
			game: { players: updatedPlayers },
		});

		sendTo.many({
			sockets: [...playerSockets, hostWs].filter((ws) => ws !== undefined),
			message: {
				type: WS_MESSAGE_TYPE.OUT.QUESTION_RESULT,
				data: {
					questionIndex: game.currentQuestion - 1,
					correctIndex: currentQuestion.correctIndex,
					playerResults,
				},
				id: messageId,
			},
		});

		clearTimeout(game.questionTimer);

		const showNextQuestionTimer = setTimeout(() => {
			if (game.questions.length === game.currentQuestion) {
				clearTimeout(game.questionTimer);

				gameplayService.finishGame({ gameId, messageId });
				return;
			}

			const nextQuestion = game.currentQuestion + 1;
			db.games.updateById({ id: gameId, game: { currentQuestion: nextQuestion } });

			db.games.clearPlayerAnswers({ gameId });

			gameplayService.showQuestion({ gameId, messageId });
		}, 5000);

		db.games.updateById({ id: gameId, game: { questionTimer: showNextQuestionTimer } });
		return true;
	},

	finishGame: ({ gameId, messageId }: { gameId: Game['id']; messageId: 0 }) => {
		const validatedGame = gameplayService.validateGame({ gameId });
		if (!validatedGame) return;
		const { game, hostWs, playerSockets } = validatedGame;

		db.games.updateById({ id: gameId, game: { status: 'finished' } });

		sendTo.many({
			sockets: [...playerSockets, hostWs].filter((ws) => ws !== undefined),
			message: {
				type: WS_MESSAGE_TYPE.OUT.GAME_FINISHED,
				data: {
					scoreboard: game.players
						.sort((a, b) => b.score - a.score)
						.map((player, i) => ({
							name: player.name,
							score: player.score,
							rank: i + 1,
						})),
				},
				id: messageId,
			},
		});
	},

	answer: ({
		ws,
		answer,
		messageId,
	}: {
		ws: WebSocket;
		answer: AnswerIncoming['data'];
		messageId: 0;
	}) => {
		const user = db.users.getByWs({ ws });
		if (!user) {
			colorLog.error(ERROR.USER_NOT_FOUND);
			return;
		}

		let gameId = answer.gameId;

		const updatedGame = db.games.addPlayerAnswer({
			gameId,
			playerIndex: user.index,
			answerIndex: answer.answerIndex,
		});

		if (!updatedGame) {
			colorLog.error(ERROR.GAME_NOT_FOUND);
			return;
		}

		db.games.updatePlayerByIndex({
			gameId,
			playerIndex: user.index,
			player: {
				hasAnswered: true,
				answeredCorrectly:
					answer.answerIndex === updatedGame.questions[answer.questionIndex].correctIndex,
				answerTime: Date.now(),
			},
		});

		const host = db.users.getByIndex({ index: updatedGame.hostId });

		if (updatedGame.playerAnswers.size === updatedGame.players.length) {
			clearTimeout(updatedGame.questionTimer);
			gameplayService.showQuestionResult({ gameId, messageId });
		}

		return {
			hostWs: host?.ws,
			gameInfo: {
				questionIndex: answer.questionIndex,
			},
		};
	},

	validateGame: ({ gameId }: { gameId: Game['id'] }) => {
		const game = db.games.getById({ id: gameId });
		if (!game) {
			colorLog.error(ERROR.GAME_NOT_FOUND);
			return;
		}

		const currentQuestion = game.questions[game.currentQuestion - 1];
		if (!currentQuestion) {
			clearTimeout(game.questionTimer);
			colorLog.error(ERROR.QUESTION_NOT_FOUND);
			return;
		}

		const host = db.users.getByIndex({ index: game.hostId });

		const playerSockets = game.players
			.map((player) => {
				const user = db.users.getByIndex({ index: player.index });
				return user?.ws;
			})
			.filter((ws) => ws !== undefined);

		if (!playerSockets.length) {
			clearTimeout(game.questionTimer);
			colorLog.error(ERROR.NO_PLAYERS_IN_GAME);
			return;
		}

		return { game, hostWs: host?.ws, playerSockets, currentQuestion };
	},
};
