import 'reflect-metadata';
if (!Reflect || !Reflect.defineMetadata) {
  throw new Error(
    'reflect-metadata is required and must be imported before @novarel/reflection is imported.'
  );
}
export * from './types/index.js';
export * from './services/container.js';
export * from './constants.js';
export * from './decorators/decorators.js';
