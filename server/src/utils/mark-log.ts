const COLORS = {
	R: '31',
	G: '32',
	B: '34',
	C: '36',
	M: '35',
	Y: '33',
	K: '30',
	W: '37',
};

const BG_COLORS = {
	R: '41',
	G: '42',
	B: '44',
	C: '46',
	M: '45',
	Y: '43',
	K: '40',
	W: '47',
};

const TEXT_STYLES = {
	RESET: '0',
	BOLD: '1',
	FAINT: '2',
	ITALIC: '3',
	UNDERLINE: '4',
};

const NC = '\x1b[0m';

type MarkLog = {
	text: string;
	color?: keyof typeof COLORS;
	bgColor?: keyof typeof BG_COLORS;
	style?: keyof typeof TEXT_STYLES;
};

export function markLog({ text, color, bgColor, style }: MarkLog) {
	const textStyle = style ? TEXT_STYLES[style] : '';
	const textColor = color ? COLORS[color] : '';
	const textBgColor = bgColor ? BG_COLORS[bgColor] : '';

	const styles = [textStyle, textColor, textBgColor].filter(Boolean).join(';');

	if (!styles) return text;
	return `\x1b[${styles}m${text}${NC}`;
}
