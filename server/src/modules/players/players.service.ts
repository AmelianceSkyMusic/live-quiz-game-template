import type { WebSocket } from 'ws';
import { ERROR } from '../../constants/error';
import { db } from '../../store/db';
import {
	JoinGameIncoming,
	PlayerJoinedOutgoing,
	UpdatePlayersOutgoing,
} from '../../types/websocket/player';
import { colorLog } from '../../utils/color-log';
import { authService } from '../auth/auth.service';

export const playerService = {
	joinGame: ({
		ws,
		code,
	}: { ws: WebSocket } & JoinGameIncoming['data']):
		| {
				hostWs: WebSocket | undefined;
				playerSockets: WebSocket[];
				playerInfo: PlayerJoinedOutgoing['data'];
				playersScore: UpdatePlayersOutgoing['data'];
				gameId: string;
		  }
		| undefined => {
		const user = db.users.getByWs({ ws });
		if (!user) {
			colorLog.error(ERROR.USER_NOT_FOUND);
			authService.showError({ ws, errorText: ERROR.USER_NOT_FOUND });
			return;
		}

		const gameBeforeJoin = db.games.getByCode({ code });
		if (!gameBeforeJoin) {
			colorLog.error(ERROR.GAME_NOT_FOUND);
			authService.showError({ ws, errorText: ERROR.GAME_NOT_FOUND });
			return;
		}

		if (gameBeforeJoin.status === 'in_progress') {
			colorLog.error(ERROR.GAME_ALREADY_STARTED);
			authService.goToStartPage({ ws, errorText: ERROR.GAME_ALREADY_STARTED });
			return;
		}
		if (gameBeforeJoin.status === 'finished') {
			colorLog.error(ERROR.GAME_ALREADY_FINISHED);
			authService.goToStartPage({ ws, errorText: ERROR.GAME_ALREADY_FINISHED });
			return;
		}

		const game = db.games.addPlayer({ ws, user, code });
		if (!game) {
			colorLog.error(ERROR.UNKNOWN_ERROR);
			return;
		}

		const host = db.users.getByIndex({ index: game.hostId });

		const playerSockets = game.players
			.map((player) => player.ws)
			.filter((ws) => ws !== undefined);

		if (!playerSockets.length) {
			colorLog.error(ERROR.NO_PLAYERS_IN_GAME);
			return;
		}

		const playersScore = game.players.map((player) => ({
			name: player.name,
			index: player.index,
			score: player.score,
		}));

		return {
			hostWs: host?.ws,
			playerSockets,
			playerInfo: {
				playerName: user.name,
				playerCount: game.players.length,
			},
			playersScore,
			gameId: game.id,
		};
	},
};
