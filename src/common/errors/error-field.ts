export class ErrorField {
    constructor(
        public readonly field: string,
        public readonly violations: string[]
    ) {}
}
