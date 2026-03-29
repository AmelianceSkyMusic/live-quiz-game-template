import { Game } from '../types/db/game/game';
import { Player } from '../types/db/game/player';
import { CreateStore } from '../utils/create-store';
import { generateSixCharCode } from '../utils/generate-six-char-code';
import { InitDbData } from './init-db-data';
import { GameActions } from './types/game-actions';

export const createGameActions = ({ get, set }: CreateStore<InitDbData>): GameActions => ({
	games: {
		getAll: () => {
			return get().games.map((game) => ({
				...game,
				players: game.players.map((player) => ({
					...player,
					ws: player.ws ? true : false,
				})),
			}));
		},
		getAllPlayers: () => {
			return get().games.flatMap((game) =>
				game.players.map((player) => ({
					...player,
					ws: player.ws ? true : false,
				})),
			);
		},
		add: ({ userIndex, questions }) => {
			const newGame: Game = {
				id: String(crypto.randomUUID()),
				code: generateSixCharCode(),
				hostId: userIndex,
				questions,
				players: [],
				currentQuestion: -1,
				status: 'waiting',
				playerAnswers: new Map(),
			};

			set((prev) => ({ ...prev, games: [...prev.games, newGame] }));

			return newGame;
		},

		addPlayer: ({ ws, user, code }) => {
			const games = get().games;
			const game = games.find((g) => g.code === code);
			if (!game) return null;

			const isAlreadyInGame = game.players.some((player) => player.index === user.index);
			if (isAlreadyInGame) return null;

			const newPlayer: Player = {
				name: user.name,
				index: user.index,
				score: 0,
				ws,
			};

			const updatedGame = {
				...game,
				players: [...game.players, newPlayer],
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.code === code ? updatedGame : game)),
			}));

			return updatedGame;
		},

		getById: ({ id }) => {
			return get().games.find((game) => game.id === id) || null;
		},

		getByCode: ({ code }) => {
			return get().games.find((game) => game.code === code) || null;
		},

		getByHostId: ({ hostId }) => {
			return get().games.find((game) => game.hostId === hostId) || null;
		},
		getByPlayerIndex: ({ playerIndex }) => {
			return (
				get().games.find((game) =>
					game.players.some((player) => player.index === playerIndex),
				) || null
			);
		},

		updateById: ({ id, game }) => {
			const games = get().games;
			const currentGame = games.find((game) => game.id === id);
			if (!currentGame) return null;

			const updatedGame: Game = {
				...currentGame,
				...game,
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.id === id ? updatedGame : game)),
			}));

			return updatedGame;
		},

		updatePlayerByIndex: ({ gameId, playerIndex, player }) => {
			const games = get().games;
			const currentGame = games.find((game) => game.id === gameId);
			if (!currentGame) return null;

			const updatedGame: Game = {
				...currentGame,
				players: currentGame.players.map((p) =>
					p.index === playerIndex ? { ...p, ...player } : p,
				),
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.id === gameId ? updatedGame : game)),
			}));

			return updatedGame;
		},

		deletePlayerByIndex: ({ gameId, playerIndex }) => {
			const games = get().games;
			const currentGame = games.find((game) => game.id === gameId);
			if (!currentGame) return null;

			const updatedPlayerAnswers = new Map(currentGame.playerAnswers);
			updatedPlayerAnswers.delete(playerIndex);

			const updatedGame: Game = {
				...currentGame,
				players: currentGame.players.filter((p) => p.index !== playerIndex),
				playerAnswers: updatedPlayerAnswers,
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.id === gameId ? updatedGame : game)),
			}));

			return updatedGame;
		},

		addPlayerAnswer: ({ gameId, playerIndex, answerIndex }) => {
			const games = get().games;
			const currentGame = games.find((game) => game.id === gameId);
			if (!currentGame) return null;

			const updatedGame: Game = {
				...currentGame,
				playerAnswers: new Map(currentGame.playerAnswers).set(playerIndex, {
					answerIndex: answerIndex,
					timestamp: Date.now(),
				}),
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.id === gameId ? updatedGame : game)),
			}));

			return updatedGame;
		},

		clearPlayerAnswers: ({ gameId }) => {
			const games = get().games;
			const currentGame = games.find((game) => game.id === gameId);
			if (!currentGame) return null;

			const updatedGame: Game = {
				...currentGame,
				players: currentGame.players.map((player) => ({
					...player,
					hasAnswered: undefined,
					answerTime: undefined,
					answeredCorrectly: undefined,
				})),
				playerAnswers: new Map(),
			};

			set((prev) => ({
				...prev,
				games: prev.games.map((game) => (game.id === gameId ? updatedGame : game)),
			}));

			return updatedGame;
		},
	},
});
