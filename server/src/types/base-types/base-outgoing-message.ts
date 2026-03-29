import type { OutgoingMessageType } from './outgoing-message-type.js';

export type BaseOutgoingMessage<T extends OutgoingMessageType, D = unknown> = {
	id: 0;
	type: T;
	data: D;
};
