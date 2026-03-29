import type { WebSocket } from 'ws';

export type User = {
	name: string;
	password: string;
	index: string;
	ws?: WebSocket;
};
