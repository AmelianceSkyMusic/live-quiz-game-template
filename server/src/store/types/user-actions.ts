import type { WebSocket } from 'ws';
import type { User } from '../../types/db/user/user';

export type UserActions = {
	users: {
		getAll: () => (Omit<User, 'ws'> & { ws: boolean })[];
		add: ({
			ws,
			name,
			password,
		}: {
			ws: WebSocket;
			name: User['name'];
			password: User['password'];
		}) => User | null;
		getByIndex: ({ index }: { index: User['index'] }) => User | null;
		getByWs: ({ ws }: { ws: WebSocket }) => User | null;
		getByName: ({ name }: { name: User['name'] }) => User | null;
		updateByWs: ({
			ws,
			data,
		}: {
			ws: WebSocket;
			data: { ws?: User['ws']; name?: User['name'] };
		}) => User | null;
		updateByName: ({
			name,
			data,
		}: {
			name: User['name'];
			data: { ws?: User['ws']; name?: User['name'] };
		}) => User | null;
	};
};
