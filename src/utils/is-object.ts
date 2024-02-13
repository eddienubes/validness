export const isObject = (candidate: unknown): candidate is object => {
    return (
        typeof candidate === 'object' &&
        candidate !== null &&
        !Array.isArray(candidate)
    );
};
