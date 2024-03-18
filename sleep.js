/**
 * 
 * @param {number} ms 
 * @returns 
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}