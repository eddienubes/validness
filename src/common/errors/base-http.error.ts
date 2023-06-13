export class BaseHttpError extends Error {
    private statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }

    public toJSON(): string {
        return `[${this.name}]: ${this.message}`;
    }
}
