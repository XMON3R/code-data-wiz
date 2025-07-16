/**
 * A generic debounce function.
 *
 * @param func The function to debounce.
 * @param wait The delay in milliseconds.
 * @returns A new debounced function.
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        // The use of 'this' is intentional here to preserve the context
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
