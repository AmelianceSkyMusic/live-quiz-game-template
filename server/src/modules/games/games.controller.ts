import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import type { ControllerProps } from '../../types/controller-props';
import { sendTo } from '../../utils/send-to';
import { gameService } from './games.service';

export const gameController = {
	createGame: ({ ws, message }: ControllerProps) => {
		if (message.type !== WS_MESSAGE_TYPE.IN.CREATE_GAME) return;

		const { questions } = message.data;

		const result = gameService.createGame({ ws, questions });
		if (!result) return;

		sendTo.one({
			ws: result.hostWs,
			message: {
				type: WS_MESSAGE_TYPE.OUT.GAME_CREATED,
				data: result.gameInfo,
				id: message.id,
			},
		});
	},
};
