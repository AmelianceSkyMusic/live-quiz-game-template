import { BaseIncomingMessage } from './base-incoming-message.js';
import { BaseOutgoingMessage } from './base-outgoing-message.js';
import type { IncomingMessageType } from './incoming-message-type.js';
import type { OutgoingMessageType } from './outgoing-message-type.js';

export type BaseMessage =
	| BaseOutgoingMessage<OutgoingMessageType, unknown>
	| BaseIncomingMessage<IncomingMessageType, unknown>;
