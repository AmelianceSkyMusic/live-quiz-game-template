import type { BaseIncomingMessage } from '../base-types/base-incoming-message.js';
import type { BaseOutgoingMessage } from '../base-types/base-outgoing-message.js';

type Question = {
	text: string;
	options: string[];
	correctIndex: number;
	timeLimitSec: number;
};

export type CreateGameIncoming = BaseIncomingMessage<
	'create_game',
	{
		questions: Question[];
	}
>;

export type GameCreatedOutgoing = BaseOutgoingMessage<
	'game_created',
	{
		gameId: string;
		code: string;
	}
>;
export type GameJoinedOutgoing = BaseOutgoingMessage<
	'game_joined',
	{
		gameId: string;
	}
>;

export type GameIncoming = CreateGameIncoming;

export type GameOutgoing = GameCreatedOutgoing | GameJoinedOutgoing;
