import type { BaseIncomingMessage } from '../base-types/base-incoming-message.js';
import type { BaseOutgoingMessage } from '../base-types/base-outgoing-message.js';

export type RegIncoming = BaseIncomingMessage<
	'reg',
	{
		name: string;
		password: string;
	}
>;

export type RegOutgoing = BaseOutgoingMessage<
	'reg',
	{
		name: string;
		index: number | string;
		error: boolean;
		errorText: string;
	}
>;
