import { Player } from './player';
import { Question } from './question';

export type Game = {
	id: string;
	code: string;
	hostId: string;
	questions: Question[];
	players: Player[];
	currentQuestion: number;
	status: 'waiting' | 'in_progress' | 'finished';
	questionStartTime?: number;
	questionTimer?: NodeJS.Timeout;
	playerAnswers: Map<string, { answerIndex: number; timestamp: number }>;
};
