import { CreateStore } from '../utils/create-store';
import { InitDbData } from './init-db-data';
import { UserActions } from './types/user-actions';

export const createUserActions = ({ get, set }: CreateStore<InitDbData>): UserActions => ({
	users: {
		getAll: () => {
			return get().users.map((user) => ({
				...user,
				ws: user.ws ? true : false,
			}));
		},
		add: ({ ws, name, password }) => {
			const users = get().users;
			const user = users.find((user) => user.name === name);

			if (user?.ws) return null;

			const newUser = {
				ws,
				index: String(crypto.randomUUID()),
				name,
				password,
			};

			set((prev) => ({ ...prev, users: [...prev.users, newUser] }));
			return newUser;
		},

		getByIndex({ index }) {
			return get().users.find((user) => user.index === index) || null;
		},

		getByWs({ ws }) {
			return get().users.find((user) => user.ws === ws) || null;
		},

		getByName({ name }) {
			return get().users.find((user) => user.name === name) || null;
		},

		updateByWs({ ws, data }) {
			const user = get().users.find((user) => user.ws === ws);
			if (!user) return null;

			const updatedUser = { ...user, ...data };

			set((prev) => ({
				...prev,
				users: prev.users.map((user) => (user.ws === ws ? updatedUser : user)),
			}));

			return updatedUser;
		},

		updateByName: ({ name, data }) => {
			const user = get().users.find((user) => user.name === name);
			if (!user) return null;

			const updatedUser = { ...user, ...data };

			set((prev) => ({
				...prev,
				users: prev.users.map((user) => (user.name === name ? updatedUser : user)),
			}));

			return updatedUser;
		},
	},
});
