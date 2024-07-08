export class ErrorField {
    constructor(
        public readonly field: string,
        public readonly violations: string[],
        /**
         * Context passed to the error field from class-validator decorators.
         * Empty object if nothing was passed.
         */
        public readonly contexts: Record<string, any> = {}
    ) {}
}
