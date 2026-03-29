import type { IncomingMessageType } from './incoming-message-type.js';

export type BaseIncomingMessage<T extends IncomingMessageType, D = unknown> = {
	id: 0;
	type: T;
	data: D;
};
