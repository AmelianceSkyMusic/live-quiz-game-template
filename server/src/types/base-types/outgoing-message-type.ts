import { WS_MESSAGE_TYPE } from '../../constants/ws-message-type.js';

export type OutgoingMessageType = (typeof WS_MESSAGE_TYPE.OUT)[keyof typeof WS_MESSAGE_TYPE.OUT];
