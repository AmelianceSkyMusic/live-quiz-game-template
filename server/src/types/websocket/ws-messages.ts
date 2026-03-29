import type { RegIncoming, RegOutgoing } from './auth.js';
import type { GameIncoming, GameOutgoing } from './game.js';
import type { GameplayIncoming, GameplayOutgoing } from './gameplay.js';
import type { PlayerIncoming, PlayerOutgoing } from './player.js';

export type WSIncomingMessage = RegIncoming | GameIncoming | GameplayIncoming | PlayerIncoming;

export type WSOutgoingMessage = RegOutgoing | GameOutgoing | GameplayOutgoing | PlayerOutgoing;
