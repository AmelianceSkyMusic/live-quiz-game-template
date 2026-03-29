import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import type { ControllerProps } from '../../types/controller-props';
import { sendTo } from '../../utils/send-to';
import { playerService } from './players.service';

export const playerController = {
	joinGame: ({ ws, message }: ControllerProps) => {
		if (message.type !== WS_MESSAGE_TYPE.IN.JOIN_GAME) return;

		const { code } = message.data;

		const result = playerService.joinGame({ ws, code });
		if (!result) return;

		sendTo.many({
			sockets: [result.hostWs, ...result.playerSockets].filter((ws) => ws !== undefined),
			message: {
				type: WS_MESSAGE_TYPE.OUT.PLAYER_JOINED,
				data: result.playerInfo,
				id: message.id,
			},
		});

		sendTo.many({
			sockets: [result.hostWs, ...result.playerSockets].filter((ws) => ws !== undefined),
			message: {
				type: WS_MESSAGE_TYPE.OUT.UPDATE_PLAYERS,
				data: result.playersScore,
				id: message.id,
			},
		});

		setTimeout(() => {
			sendTo.one({
				ws,
				message: {
					type: WS_MESSAGE_TYPE.OUT.GAME_JOINED,
					data: { gameId: result.gameId },
					id: message.id,
				},
			});
		}, 50);
	},
};
