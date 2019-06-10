[![NPM version](https://badge.fury.io/js/%40dizmo%2Ffunctions-queued.svg)](https://npmjs.org/package/@dizmo/functions-queued)
[![Build Status](https://travis-ci.org/dizmo/functions-queued.svg?branch=master)](https://travis-ci.org/dizmo/functions-queued)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/functions-queued/badge.svg?branch=master)](https://coveralls.io/github/dizmo/functions-queued?branch=master)

# @dizmo/functions-queued

Provides two functions `queued` and `auto`, where the latter can *also* be accessed via `queued.auto`. The `queued` function takes as argument another function e.g. `fn`, which is then queued for execution. During its invocation `fn` receives an *extra* argument &ndash; a `next` function &ndash; which needs to be invoked within the body of `fn` to continue processing the queue. It's also possible to enqueue more than one function in one go, by providing more functions as arguments to `queued`.

The `queued` function creates a *separate* queue defined by the *name* of the *first* provided function: This means that if multiple functions e.g. `f1` and `f2` need to be queued together, then they *either* need to be queued in one go, *or* they need to be *wrapped* with functions all with the *same* name (e.g. `fn`). If *only* anonymous functions are provided then the internal queue is named with a random identifier.

The `auto` function takes a boolean flag and returns then a queue e.g. `qn` (for the provided functions). If the flag is set to `true` then the queue start dequeueing immediately, and otherwise `qn.next` is required to be invoked to trigger dequeueing; by default `queued` starts dequeueing immediately.

## Usage

### Install

```sh
npm install @dizmo/functions-queued --save
```

### Require

```javascript
const { queued } = require('@dizmo/functions-queued');
```

### Examples

```typescript
import { queued } from '@dizmo/functions-queued';
```

```typescript
const fn = queued(function fn(
    n: number, next: Function
) {
    console.log("[fn]", n);
    setTimeout(next, 200);
});
```

```typescript
fn(1); fn(2); fn(3);
```

```typescript
const qn = queued.auto(false)(
    (...args: any[]) => {
        const next = args.pop() as Function;
        console.log("[qn/a]", ...args);
        setTimeout(next, 200);
    },
    (...args: any[]) => {
        const next = args.pop() as Function;
        console.log("[qn/b]", ...args);
        setTimeout(next, 200);
    }
);
```

```typescript
qn(1); qn(1, 2); qn(1, 2, 3); qn.next();
```

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

## Publish

```sh
npm publish
```

#### initially (if public):

```sh
npm publish --access=public
```

## Copyright

 © 2019 [dizmo AG](http://dizmo.com/), Switzerland
