import { createStore } from '../utils/create-store';
import { createGameActions } from './create-game-actions';
import { createUserActions } from './create-user-actions';
import { initDbData, InitDbData } from './init-db-data';
import { GameActions } from './types/game-actions';
import { UserActions } from './types/user-actions';

export type Actions = UserActions & GameActions;

export const createDb = () =>
	createStore<InitDbData, Actions>(initDbData, (store) => ({
		...createUserActions(store),
		...createGameActions(store),
	}));
