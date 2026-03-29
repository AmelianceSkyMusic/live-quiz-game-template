import { Game } from '../types/db/game/game';
import { User } from '../types/db/user/user';

export type InitDbData = {
	users: User[];
	games: Game[];
};

export const initDbData: InitDbData = {
	users: [],
	games: [],
};
