import { WebSocket } from 'ws';
import type { WSOutgoingMessage } from '../types/websocket/ws-messages';
import { colorLog } from './color-log';

export const sendTo = {
	one: ({ ws, message }: { ws: WebSocket; message: WSOutgoingMessage }) => {
		colorLog.cyan(`   -→ [to one]: ${message.type}`);
		const stringMessage = JSON.stringify(message);
		if (ws.readyState === ws.OPEN) {
			ws.send(stringMessage);
		}
	},

	many: ({ sockets, message }: { sockets: WebSocket[]; message: WSOutgoingMessage }) => {
		colorLog.cyan(`   -→ [to many]: ${message.type}`);
		const stringMessage = JSON.stringify(message);
		sockets.forEach((socket) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(stringMessage);
			}
		});
	},
};
