import type { WebSocket } from 'ws';
import { ERROR } from '../../constants/error';
import { db } from '../../store/db';
import type { CreateGameIncoming, GameCreatedOutgoing } from '../../types/websocket/game';
import { colorLog } from '../../utils/color-log';

export const gameService = {
	createGame: ({
		ws,
		questions,
	}: { ws: WebSocket } & CreateGameIncoming['data']):
		| {
				hostWs: WebSocket;
				gameInfo: GameCreatedOutgoing['data'];
		  }
		| undefined => {
		const user = db.users.getByWs({ ws });
		if (!user) {
			colorLog.error(ERROR.USER_NOT_FOUND);
			return;
		}

		const game = db.games.add({ userIndex: user.index, questions });

		const host = db.users.getByIndex({ index: game.hostId });
		if (!host || !host.ws) {
			colorLog.error(ERROR.USER_NOT_FOUND);
			return;
		}

		return {
			hostWs: host.ws,
			gameInfo: { gameId: game.id, code: game.code },
		};
	},
};
