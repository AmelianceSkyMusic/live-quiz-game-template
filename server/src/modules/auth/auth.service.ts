import type { WebSocket } from 'ws';
import { ERROR } from '../../constants/error';
import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import { db } from '../../store/db';
import type { RegIncoming, RegOutgoing } from '../../types/websocket/auth';
import { sendTo } from '../../utils/send-to';
import { gameplayService } from '../gameplay/gameplay.service';

export const authService = {
	reg: ({ ws, name, password }: { ws: WebSocket } & RegIncoming['data']): RegOutgoing['data'] => {
		const existingUser = db.users.getByName({ name });
		if (existingUser) {
			if (existingUser.password !== password) {
				return { name, index: 0, error: true, errorText: ERROR.WRONG_PASSWORD };
			}
			if (existingUser?.ws) {
				return { name, index: 0, error: true, errorText: ERROR.USER_ALREADY_LOGGED_IN };
			}

			const user = db.users.updateByName({ name, data: { ws, name } });
			if (!user) return { name, index: 0, error: true, errorText: ERROR.UNKNOWN_ERROR };
			return { name: user.name, index: user.index, error: false, errorText: '' };
		}

		const user = db.users.add({ ws, name, password });
		if (!user) return { name, index: 0, error: true, errorText: ERROR.UNKNOWN_ERROR };

		return { name: user.name, index: user.index, error: false, errorText: '' };
	},

	logout: ({ ws }: { ws: WebSocket }) => {
		const messageId = 0;
		const user = db.users.getByWs({ ws });
		if (!user) return;

		db.users.updateByWs({ ws, data: { ws: undefined } });

		const game = db.games.getByHostId({ hostId: user.index });

		if (game) {
			if (game.status === 'in_progress') return;

			game.players.forEach((player) => {
				const user = db.users.getByIndex({ index: player.index });

				if (!user?.ws) return;

				authService.goToStartPage({ ws: user.ws, errorText: ERROR.HOST_DISCONNECTED });
			});

			return;
		}

		const playerGame = db.games.getByPlayerIndex({ playerIndex: user.index });
		if (!playerGame) return;

		const gameAfterDeleting = db.games.deletePlayerByIndex({
			gameId: playerGame.id,
			playerIndex: user.index,
		});
		if (!gameAfterDeleting) return;

		if (
			gameAfterDeleting.status === 'in_progress' &&
			gameAfterDeleting.playerAnswers.size === gameAfterDeleting.players.length
		) {
			gameplayService.showQuestionResult({ gameId: playerGame.id, messageId });
		}

		const host = db.users.getByIndex({ index: gameAfterDeleting.hostId });
		if (!host || !host.ws) {
			clearTimeout(gameAfterDeleting.questionTimer);
			return;
		}

		const playerSockets = gameAfterDeleting.players
			.map((player) => {
				const user = db.users.getByIndex({ index: player.index });
				return user?.ws;
			})
			.filter((ws) => ws !== undefined);

		if (!playerSockets.length) {
			clearTimeout(gameAfterDeleting.questionTimer);
			return;
		}

		sendTo.many({
			sockets: [host.ws, ...playerSockets],
			message: {
				type: WS_MESSAGE_TYPE.OUT.UPDATE_PLAYERS,
				data: gameAfterDeleting.players,
				id: messageId,
			},
		});
	},

	goToStartPage: ({ ws, errorText }: { ws: WebSocket; errorText: string }) => {
		const messageId = 0;
		const user = db.users.getByWs({ ws });
		if (!user) return;

		sendTo.one({
			ws: ws,
			message: {
				type: WS_MESSAGE_TYPE.OUT.REG,
				data: {
					name: user.name,
					index: user.index,
					error: false,
					errorText: '',
				},
				id: messageId,
			},
		});

		authService.showError({ ws, errorText });
	},

	showError: ({ ws, errorText }: { ws: WebSocket; errorText: string }) => {
		const messageId = 0;
		const user = db.users.getByWs({ ws });
		if (!user) return;

		setTimeout(
			(ws) => {
				if (!ws) return;
				sendTo.one({
					ws,
					message: {
						type: WS_MESSAGE_TYPE.OUT.REG,
						data: {
							name: user.name,
							index: user.index,
							error: true,
							errorText,
						},
						id: messageId,
					},
				});
			},
			100,
			ws,
		);
	},
};
