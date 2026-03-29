import { WebSocketServer } from 'ws';
import { messageHandler } from './message-handler/message-handler';
import { authController } from './modules/auth/auth.controller';
import { prepareMessage } from './utils/helpers/prepare-message';
import { colorLog } from './utils/color-log';

type WS = {
	start({ port }: { port: number }): void;
};

export const ws: WS = {
	start({ port }: { port: number }) {
		const wss = new WebSocketServer({ port });

		wss.on('connection', (ws) => {
			ws.on('message', (data) => {
				const message = prepareMessage(data);

				messageHandler({ ws, message });
			});

			ws.on('close', () => {
				authController.logout({ ws });
			});

			ws.on('error', colorLog.error);
		});
	},
};
