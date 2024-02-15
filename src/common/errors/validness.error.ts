import util from 'util';

export class ValidnessError extends Error {
    constructor(message: string, upstream?: unknown) {
        super(`${message}${upstream ? `\n${util.inspect(upstream)}` : ''}`);
        this.name = ValidnessError.name;
    }
}
