import type { WebSocket } from 'ws';
import { Game } from '../../types/db/game/game';
import { User } from '../../types/db/user/user';

export type GameActions = {
	games: {
		getAll: () => (Omit<Game, 'players'> & {
			players: (Omit<Game['players'][number], 'ws'> & { ws: boolean })[];
		})[];
		getAllPlayers: () => (Omit<Game['players'][number], 'ws'> & { ws: boolean })[];

		add: ({
			userIndex,
			questions,
		}: {
			userIndex: User['index'];
			questions: Game['questions'];
		}) => Game;
		addPlayer: ({
			ws,
			user,
			code,
		}: {
			ws: WebSocket;
			user: User;
			code: Game['code'];
		}) => Game | null;

		getById: ({ id }: { id: Game['id'] }) => Game | null;
		getByCode: ({ code }: { code: Game['code'] }) => Game | null;
		getByHostId: ({ hostId }: { hostId: Game['hostId'] }) => Game | null;
		getByPlayerIndex: ({ playerIndex }: { playerIndex: User['index'] }) => Game | null;

		updateById: ({
			id,
			game,
		}: {
			id: Game['id'];
			game: Partial<Omit<Game, 'id'>>;
		}) => Game | null;

		updatePlayerByIndex: ({
			gameId,
			playerIndex,
			player,
		}: {
			gameId: Game['id'];
			playerIndex: User['index'];
			player: Partial<Game['players'][number]>;
		}) => Game | null;

		deletePlayerByIndex: ({
			gameId,
			playerIndex,
		}: {
			gameId: Game['id'];
			playerIndex: User['index'];
		}) => Game | null;

		addPlayerAnswer: ({
			gameId,
			playerIndex,
			answerIndex,
		}: {
			gameId: Game['id'];
			playerIndex: User['index'];
			answerIndex: number;
		}) => Game | null;

		clearPlayerAnswers: ({ gameId }: { gameId: Game['id'] }) => Game | null;
	};
};
