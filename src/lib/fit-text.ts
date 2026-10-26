export type FitOptions = {
	fontFamily: string;
	weight?: number;
	/** Letter spacing as a fraction of the font size (e.g. -0.04). */
	tracking?: number;
	lineHeight?: number;
	minSize: number;
	maxSize: number;
};

let context: CanvasRenderingContext2D | null = null;

function measurer(fontFamily: string, weight: number, tracking: number) {
	context ??= document.createElement("canvas").getContext("2d");
	const ctx = context;
	if (!ctx) return null;
	return (text: string, size: number) => {
		ctx.font = `${weight} ${size}px ${fontFamily}`;
		ctx.letterSpacing = `${tracking * size}px`;
		return ctx.measureText(text).width;
	};
}

function wrap(
	words: string[],
	maxWidth: number,
	measure: (text: string) => number,
) {
	const lines: string[] = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (line && measure(next) > maxWidth) {
			lines.push(line);
			line = word;
		} else {
			line = next;
		}
	}
	if (line) lines.push(line);
	return lines;
}

/**
 * Finds the largest font size at which `text` fits the box, and returns the
 * text with balanced, explicit line breaks. Torph keeps its text on one line,
 * so breaking the lines ourselves lets it morph multi-line prompts.
 */
export function fitText(
	text: string,
	width: number,
	height: number,
	{
		fontFamily,
		weight = 600,
		tracking = -0.04,
		lineHeight = 1.1,
		minSize,
		maxSize,
	}: FitOptions,
) {
	const measureAt = measurer(fontFamily, weight, tracking);
	if (!measureAt || width <= 0 || height <= 0) return null;
	const words = text.split(/\s+/).filter(Boolean);
	const usable = width * 0.97;

	for (let size = maxSize; size >= minSize; size -= 2) {
		const measure = (value: string) => measureAt(value, size);
		if (words.some((word) => measure(word) > usable)) continue;
		let lines = wrap(words, usable, measure);
		if (lines.length * lineHeight * size > height) continue;

		// Narrow the measure while the line count holds, so lines are even.
		const count = lines.length;
		for (let trial = usable * 0.96; trial > usable * 0.4; trial *= 0.96) {
			const narrower = wrap(words, trial, measure);
			if (narrower.length !== count) break;
			lines = narrower;
		}
		return { fontSize: size, text: lines.join("\n"), lineHeight };
	}

	// Smallest size still does not fit; show it as readable as we can.
	const measure = (value: string) => measureAt(value, minSize);
	return {
		fontSize: minSize,
		text: wrap(words, usable, measure).join("\n"),
		lineHeight,
	};
}
