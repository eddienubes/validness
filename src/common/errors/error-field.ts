export class ErrorField {
    constructor(
        public readonly field: string,
        public readonly violations: string[],
        /**
         * Context passed to the error field from class-validator decorators.
         * Empty object if nothing was passed.
         * Empty object if rejected by content-type, since content-type validation happens before field validation.
         */
        public readonly contexts: Record<string, any> = {}
    ) {}
}
