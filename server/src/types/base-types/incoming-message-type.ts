import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type.js';

export type IncomingMessageType = (typeof WS_MESSAGE_TYPE.IN)[keyof typeof WS_MESSAGE_TYPE.IN];
