import type { Abstract, Concrete } from '../types/index.js';
import { injectable } from '../decorators/index.js';
import type { Container } from './container.cont.js';

@injectable()
export class ContextualContextBuilder {
    protected container: Container;
    protected abs: Abstract<any>;
    protected _needs!: Abstract<any>;

    constructor(container: Container, abstract: Abstract<any>) {
        this.container = container;
        this.abs = abstract;
    }

    needs<T>(abstract: Abstract<T>): this {
        this._needs = abstract;
        return this;
    }

    give<T>(implementations: Concrete<T>): void {
        this.container.addContextualBinding(
            this.abs,
            this._needs,
            implementations,
        );
    }
}
