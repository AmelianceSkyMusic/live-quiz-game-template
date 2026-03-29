export function getMatch<C extends PropertyKey, M>(
	code: C | undefined | null,
	values: Partial<Record<C, M>> & { _?: M },
): M | null {
	if (code === undefined || code === null || !(code in values)) return values._ ?? null;
	return values[code] ?? values._ ?? null;
}
