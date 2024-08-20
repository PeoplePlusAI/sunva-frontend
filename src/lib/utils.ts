import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(time: number) {
    const currentDate = new Date(time);

    const day = String(currentDate.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month with leading zero (months are 0-indexed)
    const year = currentDate.getFullYear(); // Full year

    return `${day}-${month}-${year}`;
}

const tempDiv = document.createElement('div');
/**
 * Takes a string and sanitizes it (Uses the inbuilt html sanitizer)
 * @param str
 */
export function sanitizeHTML(str: string) {
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}
