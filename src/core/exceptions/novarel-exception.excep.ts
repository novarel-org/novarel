export class NovarelException extends Error {
    status: string | number | undefined;
    code?: string | number | undefined;
    override cause?: unknown;

    constructor(
        message?: string,
        status?: string | number,
        cause?: unknown,
        code?: string | number,
    ) {
        super(message);
        this.name = 'NovarelException';
        this.status = status;
        this.cause = cause;
        this.code = code;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            cause: this.serializeCause(),
            code: this.code,
        };
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }

    private serializeCause(): any {
        if (!this.cause) return undefined;
        if (this.cause instanceof Error) {
            return {
                name: this.cause.name,
                message: this.cause.message,
                stack: this.cause.stack,
            };
        }
        return this.cause;
    }

    static wrap(
        err: unknown,
        message = 'An error occurred',
        status?: number | string,
        code?: string | number,
    ): NovarelException {
        if (err instanceof NovarelException) return err;
        return new NovarelException(message, status, err, code);
    }

    static is(err: unknown): err is NovarelException {
        return err instanceof NovarelException;
    }
}
