# Designs

## Augmentation

> Why augmenting `jest` instead of `vitest`?

In the [vitest guide](https://vitest.dev/guide/extending-matchers.html),
it extends custom matchers by augmenting the `vitest` module:

```ts
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
```

However, we need the methods to be available on `@storybook/test` too.
That's why augmenting only `vitest` is not enough.
