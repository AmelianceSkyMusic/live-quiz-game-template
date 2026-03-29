import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import type { ControllerProps } from '../../types/controller-props';
import { sendTo } from '../../utils/send-to';
import { gameplayService } from './gameplay.service';

export const gameplayController = {
	startGame: ({ ws, message }: ControllerProps) => {
		if (message.type !== WS_MESSAGE_TYPE.IN.START_GAME) return;

		const { id, data } = message;
		const { gameId } = data;

		gameplayService.startGame({ ws, gameId, messageId: id });
	},

	answer: ({ ws, message }: ControllerProps) => {
		if (message.type !== WS_MESSAGE_TYPE.IN.ANSWER) return;
		const { gameId, questionIndex, answerIndex } = message.data;
		const result = gameplayService.answer({
			ws,
			answer: { gameId, questionIndex, answerIndex },
			messageId: message.id,
		});
		if (!result) return;

		sendTo.one({
			ws,
			message: {
				type: WS_MESSAGE_TYPE.OUT.ANSWER_ACCEPTED,
				data: result.gameInfo,
				id: message.id,
			},
		});
	},
};
