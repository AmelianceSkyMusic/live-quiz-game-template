import type { WebSocket } from 'ws';
import type { WSIncomingMessage } from './websocket/ws-messages';

export type ControllerProps = {
	ws: WebSocket;
	message: WSIncomingMessage;
};
