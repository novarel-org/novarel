/**
 * All the constants related to the package `@novarel/reflect`
 * will bhe define here.
 */


/**
 * A unique symbol used to mark and identify a service in the container.
 */
export const SERVICE = Symbol("novarel:service");

/**
 * The key used by TypeScript's design-time reflection
 * to store constructor parameter type information.
 */
export const DESIGN_PARAM = "design:paramtypes";

/**
 * A unique symbol used as a general-purpose metadata storage key.
 */
export const METADATA = Symbol("novarel:metadata");
