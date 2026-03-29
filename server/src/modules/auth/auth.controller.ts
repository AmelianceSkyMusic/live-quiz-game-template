import type { WebSocket } from 'ws';
import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type';
import type { ControllerProps } from '../../types/controller-props';
import { sendTo } from '../../utils/send-to';
import { authService } from './auth.service';

export const authController = {
	reg: ({ ws, message }: ControllerProps) => {
		if (message.type !== WS_MESSAGE_TYPE.IN.REG) return;

		const { name, password } = message.data;

		const result = authService.reg({ ws, name, password });

		if (result.error) {
			sendTo.one({
				ws,
				message: {
					type: WS_MESSAGE_TYPE.OUT.REG,
					data: result,
					id: message.id,
				},
			});
			return;
		}

		sendTo.one({
			ws,
			message: {
				type: WS_MESSAGE_TYPE.OUT.REG,
				data: result,
				id: message.id,
			},
		});
	},

	logout: ({ ws }: { ws: WebSocket }) => {
		authService.logout({ ws });
	},
};
