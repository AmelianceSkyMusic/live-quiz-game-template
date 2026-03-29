import type { WebSocket } from 'ws';

export type Player = {
	name: string;
	index: string;
	score: number;
	ws?: WebSocket;
	hasAnswered?: boolean;
	answerTime?: number;
	answeredCorrectly?: boolean;
};
