export type CreateStore<D> = {
	get: () => Readonly<D>;
	set: (updater: (prev: D) => D) => void;
};

export type StoreActions<D, A> = (store: CreateStore<D>) => A;

export function createStore<D, A>(initData: D, actions: StoreActions<D, A>): A {
	let state = initData;

	const get = () => state;

	const set = (updater: (prev: D) => D) => {
		const next = updater(state);

		state = next;
	};

	return actions({ get, set });
}
