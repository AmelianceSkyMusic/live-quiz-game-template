import { markLog } from './mark-log.js';

export const colorLog = {
	white: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'W' })),
	red: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'R' })),
	green: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'G' })),
	blue: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'B' })),
	cyan: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'C' })),
	magenta: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'M' })),
	yellow: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'Y' })),
	black: (...arg: unknown[]) => console.log(markLog({ text: arg.join(' '), color: 'K' })),

	error: (...arg: unknown[]) =>
		console.error(markLog({ text: arg.join(' '), color: 'R', style: 'BOLD' })),
	warn: (...arg: unknown[]) =>
		console.warn(markLog({ text: arg.join(' '), color: 'Y', style: 'BOLD' })),
	info: (...arg: unknown[]) =>
		console.info(markLog({ text: arg.join(' '), color: 'B', style: 'BOLD' })),
};
