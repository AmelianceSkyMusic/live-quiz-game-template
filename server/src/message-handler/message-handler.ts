import { WS_MESSAGE_TYPE } from '../constants/ws-message-type';
import { authController } from '../modules/auth/auth.controller';
import { gameplayController } from '../modules/gameplay/gameplay.controller';
import { gameController } from '../modules/games/games.controller';
import { playerController } from '../modules/players/players.controller';
import type { ControllerProps } from '../types/controller-props';
import { colorLog } from '../utils/color-log';
import { getMatch } from '../utils/helpers/get-match';

export function messageHandler({ ws, message }: ControllerProps) {
	colorLog.magenta(`> [${message.type.toUpperCase()}]: `);
	colorLog.blue(`   ←- ${message.type}`);

	const action = getMatch(message.type, {
		[WS_MESSAGE_TYPE.IN.REG]: authController.reg,
		[WS_MESSAGE_TYPE.IN.CREATE_GAME]: gameController.createGame,
		[WS_MESSAGE_TYPE.IN.JOIN_GAME]: playerController.joinGame,
		[WS_MESSAGE_TYPE.IN.START_GAME]: gameplayController.startGame,
		[WS_MESSAGE_TYPE.IN.ANSWER]: gameplayController.answer,
	});
	if (action) {
		try {
			action({ ws, message });
		} catch (error) {
			if (error instanceof Error) {
				console.error('>>> ERROR |', error.message);
			} else {
				console.error('>>> UNKNOWN ERROR |', error);
			}
		}
	}
}
