import type { WebSocket } from 'ws';
import { WSIncomingMessage } from '../../types/websocket/ws-messages';

export function prepareMessage(message: WebSocket.RawData): WSIncomingMessage {
	const dataString = message.toString();
	const requestMessage = JSON.parse(dataString);

	return requestMessage;
}
