import type { BaseIncomingMessage } from '../base-types/base-incoming-message.js';
import type { BaseOutgoingMessage } from '../base-types/base-outgoing-message.js';

export type JoinGameIncoming = BaseIncomingMessage<
	'join_game',
	{
		code: string;
	}
>;

export type PlayerJoinedOutgoing = BaseOutgoingMessage<
	'player_joined',
	{
		playerName: string;
		playerCount: number;
	}
>;

export type UpdatePlayersOutgoing = BaseOutgoingMessage<
	'update_players',
	{
		name: string;
		index: number | string;
		score: number;
	}[]
>;

export type PlayerIncoming = JoinGameIncoming;

export type PlayerOutgoing = PlayerJoinedOutgoing | UpdatePlayersOutgoing;
