export const generateSixCharCode = (): string => {
	return crypto.randomUUID().slice(0, 6).toUpperCase();
};
