import { type ClassValue, clsx } from "cnfast";
import { twMerge } from "cnfast";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function upperCaseFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
