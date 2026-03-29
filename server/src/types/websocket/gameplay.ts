import type { BaseIncomingMessage } from '../base-types/base-incoming-message.js';
import type { BaseOutgoingMessage } from '../base-types/base-outgoing-message.js';

export type StartGameIncoming = BaseIncomingMessage<
	'start_game',
	{
		gameId: string;
	}
>;
export type AnswerIncoming = BaseIncomingMessage<
	'answer',
	{
		gameId: string;
		questionIndex: number;
		answerIndex: number;
	}
>;

export type QuestionOutgoing = BaseOutgoingMessage<
	'question',
	{
		questionNumber: number;
		totalQuestions: number;
		text: string;
		options: string[];
		timeLimitSec: number;
	}
>;
export type AnswerAcceptedOutgoing = BaseOutgoingMessage<
	'answer_accepted',
	{
		questionIndex: number;
	}
>;
export type QuestionResultOutgoing = BaseOutgoingMessage<
	'question_result',
	{
		questionIndex: number;
		correctIndex: number;
		playerResults: {
			name: string;
			answered: boolean;
			correct: boolean;
			pointsEarned: number;
			totalScore: number;
		}[];
	}
>;
export type GameFinishedOutgoing = BaseOutgoingMessage<
	'game_finished',
	{
		scoreboard: {
			name: string;
			score: number;
			rank: number;
		}[];
	}
>;

export type GameplayIncoming = StartGameIncoming | AnswerIncoming;
export type GameplayOutgoing =
	| QuestionOutgoing
	| AnswerAcceptedOutgoing
	| QuestionResultOutgoing
	| GameFinishedOutgoing;
