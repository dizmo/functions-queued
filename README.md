[![NPM version](https://badge.fury.io/js/%40dizmo%2Ffunctions-queued.svg)](https://npmjs.org/package/@dizmo/functions-queued)
[![Build Status](https://travis-ci.com/dizmo/functions-queued.svg?branch=master)](https://travis-ci.com/dizmo/functions-queued)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/functions-queued/badge.svg?branch=master)](https://coveralls.io/github/dizmo/functions-queued?branch=master)

# @dizmo/functions-queued

Provides two functions `queued` and `auto`, where the latter can *also* be accessed via `queued.auto`. The `queued` function takes as argument another function e.g. `fn`, which is then queued for execution. During its invocation `fn` receives an *extra* argument &ndash; a `next` function &ndash; which needs to be invoked within the body of `fn` to continue processing the queue.

The `queued` function creates a *separate* queue defined by the *name* of the provided function: This means that if multiple functions e.g. `f1` and `f2` need to be queued together, then they need to be *wrapped* with functions using the *same* name (e.g. `fn`). If *only* anonymous functions are provided then the internal queue is named with a random identifier.

> Functions with the *same* name will be put into the *same* queue, and class methods with the *same* class plus method name will also be put into the *same* queue!

The `auto` function takes a boolean flag and returns then a queue e.g. `qn` (for the provided function). If the flag is set to `true` then the queue start dequeueing immediately, and otherwise `qn.next` is required to be invoked to trigger dequeueing; by default `queued` starts dequeueing immediately.

Both the `queued` and `auto` functions accepts options, which enable dequeueing (a)synchronously and also support a mechanism to aquire and release (global) locks. By default dequeueing is performed synchronously without the usage of a lock.

Further, by using a `@queued.decorator`, class methods can be decorated to turn them into queues, where the same naming rules as explained above apply. However, each method name is prepended with the corresponding class name; i.e. two methods with the same name but from to differently named classes will be put into to different queues.

Instead of using the provided `next` function to continue dequeueing, the wrapped function can also return a promise for a truthy value. Also, the returned value can be accessed upon awaiting the promise returned by the invocation of the wrapped function.

## Usage

### Install

```sh
npm install @dizmo/functions-queued --save
```

### Require

```javascript
const { queued } = require('@dizmo/functions-queued');
```

### Examples (functions)

```typescript
import { queued } from '@dizmo/functions-queued';
```

#### Dequeue with `next` (and `auto=true`):
```typescript
const fn = queued(function fn(
    n: number, next: Function
) {
    setTimeout(next, 200);
});
```

```typescript
fn(1); fn(2); const result = await fn(3);
```

#### Dequeue with `next` (and `auto=false`):
```typescript
const qn = queued.auto(false)((
    ...args: any[]
) => {
    const next = args.pop() as Function;
    setTimeout(next, 200);
});
```

```typescript
qn(1); qn(1, 2); qn(1, 2, 3); qn.next();
```

#### Dequeue with `Promise` (and `auto=true`):
```typescript
const gn = queued(function gn(
    n: number
) {
    return Promise.resolve(true);
});
```

```typescript
gn(1); gn(2); const result = await gn(3);
```

#### Dequeue with `Promise` (and `auto=false`):
```typescript
const qn = queued.auto(false)((
    ...args: any[]
) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 200);
    });
});
```

```typescript
qn(1); qn(1, 2); qn(1, 2, 3); qn.next();
```

### Examples (functions) with locking

#### Dequeue with `next` (and `auto=true`) plus a lock:
```typescript
const fn = queued(function fn(
    n: number, next: Function
) {
    setTimeout(next, 200);
}, {
    sync: true, // dequeue synchronously [default]
    lock: {
        // aquire (pseudo) lock [default]
        aquire: () => Promise.resolve(true),
        // release (pseudo) lock [default]
        release: () => Promise.resolve(true)
    }
});
```

```typescript
fn(1); fn(2); const result = await fn(3);
```

#### Dequeue with `Promise` (and `auto=false`) plus a lock:
```typescript
const qn = queued.auto(false)((
    ...args: any[]
) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 200);
    });
}, {
    sync: false, // dequeue asynchronously [*not* default]
    lock: {
        // aquire (pseudo) lock [default]
        aquire: () => Promise.resolve(true),
        // release (pseudo) lock [default]
        release: () => Promise.resolve(true)
    }
});
```

```typescript
qn(1); qn(1, 2); qn(1, 2, 3); qn.next();
```

### Examples (class methods)

```typescript
import { queued } from '@dizmo/functions-queued';
```

#### Dequeue with `next` (and `auto=true`):
```typescript
class AClass {
    @queued.decorator
    public method(
        n: number, next?: Function
    ) {
        if (next) setTimeout(next, 200);
    }
}
```

```typescript
const obj = new AClass();
```

```typescript
obj.method(1); obj.method(2); const result = await obj.method(3);
```

#### Dequeue with `next` (and `auto=false`):
```typescript
class BClass {
    @queued.decorator(false)
    public method(
        n: number, next?: Function
    ) {
        if (next) setTimeout(next, 200);
    }
}
```

```typescript
const obj = new BClass();
```

```typescript
obj.method(1); obj.method(2); obj.method(3); obj.method.next();
```

..where in **TypeScript** casting `obj.method` to `any` might be required to access the `next` method.

#### Dequeue with `Promise` (and `auto=true`):
```typescript
class CClass {
    @queued.decorator
    public method(
        n: number
    ) {
        return Promise.resolve(true);
    }
}
```

```typescript
const obj = new CClass();
```

```typescript
obj.method(1); obj.method(2); const result = await obj.method(3);
```

#### Dequeue with `Promise` (and `auto=false`):
```typescript
class DClass {
    @queued.decorator(false)
    public method(
        n: number
    ) {
        return Promise.resolve(true);
    }
}
```

```typescript
const obj = new DClass();
```

```typescript
obj.method(1); obj.method(2); obj.method(3); obj.method.next();
```

..where in **TypeScript** casting `obj.method` to `any` might be required to access the `next` method.

## Development

### Clean

```sh
npm run clean
```

### Build

```sh
npm run build
```

#### without linting and cleaning:

```sh
npm run -- build --no-lint --no-clean
```

#### with UMD bundling (incl. minimization):

```sh
npm run -- build --prepack
```

#### with UMD bundling (excl. minimization):

```sh
npm run -- build --prepack --no-minify
```

### Lint

```sh
npm run lint
```

#### with auto-fixing:

```sh
npm run -- lint --fix
```

### Test

```sh
npm run test
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- test --no-lint --no-clean --no-build
```

### Cover

```sh
npm run cover
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- cover --no-lint --no-clean --no-build
```

## Documentation

```sh
npm run docs
```

## Publish

```sh
npm publish
```

#### initially (if public):

```sh
npm publish --access=public
```

## Copyright

 © 2021 [dizmo AG](http://dizmo.com/), Switzerland
