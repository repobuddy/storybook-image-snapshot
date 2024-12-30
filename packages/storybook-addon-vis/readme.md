# storybook-addon-vis

Storybook Vitest Image Snapshot add-on.

Captures and compare image snapshot automatically and manually.

This add-on is inspired by [jest-image-snapshot].

Starting from [storybook] 8.3,
you can run Storybook stories with [vitest] browser mode.

Since it is running in actual browser, [jest-image-snapshot] does not work.
This add-on provides similar functionality to [jest-image-snapshot].
In addition, you can capture image snapshot manually.

## Install

```sh
npm install --save-dev storybook-addon-vis

pnpm add --save-dev storybook-addon-vis

yarn add --save-dev storybook-addon-vis
```

## Config

This add-on provides features on both [storybook] and [vitest],
thus you need to add it to both [storybook] and [vitest].

On [vitest], you need to add `storybook-addon-vis/vitest-plugin` plugin in `vitest.config.ts`.

```ts
// vite.config.ts or vitest.config.ts
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'
import { storybookVis } from 'storybook-addon-vis/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [
        storybookTest(),
        storybookVis()
    ],
    test: {
        browser: {
            // ...
        },
        global: false, // recommend to set to false
        setupFiles: ['./vitest.setup.ts'],
    }
})
```

Note that we recommend to set `global` to `false`.
Setting `global` to `true` actually works ok during test,
although you need to access the functions from the `globalThis` or `window` object is the story files.

However, the problem is when the story is run within [storybook].
In [storybook], the `global` field has no effect.
And in fact, you need to import the functions from `@storybook/test` instead:

```ts
// some.test.ts
import { expect } from 'vitest'

// some.stories.ts
import { expect } from '@storybook/test'
```

Therefore, the story will crash when run in [storybook] because those functions are `undefined`.

In `vitest.setup.ts`, you can use one of the presets to do the setup for you.
You can also use the provided hooks to set up the test environment manually.

```ts
// vitest.setup.ts
import { setProjectAnnotations } from '@storybook/react'
import { createVisConfig } from 'storybook-addon-vis/vitest-setup'
import * as projectAnnotations from './preview'

const project = setProjectAnnotations([projectAnnotations])

// capture image snapshot for all stories with `snapshot` tag
createVisConfig(/* options */).presets.basic()

// capture image snapshot for all stories with `snapshot` tag,
// for both light and dark themes
createVisConfig(/* options */).presets.theme({
    light() { document.body.classList.remove('dark') },
    dark() { document.body.classList.add('dark') },
})
```

On [storybook], you need to register the `beforeEach` hook in `.storybook/preview.ts`.

```ts
// .storybook/preview.tsx
import { storybookPreviewVis } from 'storybook-addon-vis'

export default {
    // ...
    beforeEach: storybookPreviewVis.beforeEach
}
```

## Usage - automatic snapshot

With the `basic` preset, [storybook-addon-vis] automatically captures image snapshot for stories with `snapshot` tag.

As with how tags work in [storybook], you can add the tag globally, per story file, or per story.

```ts
// .storybook/preview.tsx
export default {
    // Enable image snapshot for all stories
    tags: ['snapshot']
}

// story.tsx
export default {
    title: 'Button',
    // Take image snapshot automatically for all stories in this file
    tags: ['snapshot']
}

export const MyStory = {
    // Take image snapshot automatically for this story
    tags: ['snapshot'],
    // ...
}
```

You can disable snapshot capturing with the `!snapshot` tag,
much like `!test`.

```ts
export default {
    title: 'Button',
    // Enable image snapshot for all stories in this file
    tags: ['snapshot']
}

export const MyStory = {
    // Disable image snapshot for this story
    tags: ['!snapshot'],
    // ...
}
```

You can provide options to the `toMatchImageSnapshot` matcher using parameters.

```ts
import { defineSnapshotParam } from 'storybook-addon-vis'

export const MyStory = {
    parameters: defineSnapshotParam({
        failureThreshold: 70,
    })
    // ...
}
```

## Usage - manual snapshot

Besides automatic snapshot, you can capture image snapshot manually.

```ts
import { expect } from '@storybook/test'

// `page` and the like are proxies of `@vitest/browser/context` to work within storybook
import { page } from 'storybook-addon-vis'

export const PageSnapshot = {
    // typically you want to disable automatic snapshot when using manual snapshot
    tags: ['!snapshot'],
    // ...
    async play() {
        await expect(page.imageSnapshot()).toMatchImageSnapshot()
    }
}

export const ElementSnapshot = {
    // typically you want to disable automatic snapshot when using manual snapshot
    tags: ['!snapshot'],
    // ...
    async play({ canvas }) {
        const element = await canvas.getByTestid('subject')
        await expect(page.imageSnapshot({ element })).toMatchImageSnapshot()
    }
}
```

## Snapshot folder

By default, the snapshots are stored under the `__vis__` folder at the root of the project:

```ini
v __vis__
    ˃ __diff_output__ # where the diff images are stored
    ˃ __result__ # where the resulting snapshot of the current run are stored
    ˃ darwin # snapshot generated on macos by CI
    ˃ linux # snapshot generated on linux by CI
    v local # snapshot generated on local machine
        v button.stories.tsx
            snapshot-1.png
            snapshot-2.png
v src
    button.stories.tsx
```

You can change the snapshot folder by providing the `snapshotRootDir` option to the `createVisConfig` function.

```ts
import { createVisConfig } from 'storybook-addon-vis/vitest-setup'

createVisConfig({
    snapshotRootDir: 'path/to/snapshot'
})
```

Typically, you place your test files either in a dedicated `tests` folder or in the `src` folder along with your source code.
By default, [storybook-addon-vis] removes that folder to reduces nesting.

If you place your test files in multiple folders,
such as in both `tests` and `src` folders,
you can use `customizeSnapshotSubpath` to customize the snapshot sub-path to avoid conflicts.

```ts
import { createVisConfig } from 'storybook-addon-vis/vitest-setup'

createVisConfig({
    // keep the folder structure
    customizeSnapshotSubpath: (subpath) => subpath
})
```

With the above configuration, the snapshot folder structure will look like this:

```ini
v __vis__
    > # ...
    v local # snapshot generated on local machine
        v examples
            v button.stories.tsx
                snapshot-1.png
                snapshot-2.png
        v src
            v button.stories.tsx
                snapshot-1.png
                snapshot-2.png
        v tests
            v button.stories.tsx
                snapshot-1.png
                snapshot-2.png
v examples
    button.stories.tsx
v src
    button.stories.tsx
v tests
    button.stories.tsx
```

### Ignore snapshot folders

Some snapshot folders should be ignored by git.

With the default snapshot folder structure, you should add the following to your `.gitignore`:

```ini
# .gitignore
**/__vis__/__diff_output__
**/__vis__/__results__
**/__vis__/local
```

## Troubleshooting

> Internal server error: Failed to resolve import "pathe"

This is likely [a compatibility issue with `pnpm` and `vite` in monorepo](https://discord.com/channels/917386801235247114/1305110710229008435/1305325581839368202).

To work around this, you can add [`shamefully-hoist`](https://pnpm.io/npmrc#shamefully-hoist) to your `.npmrc`:

```sh
# .npmrc

shamefully-hoist=true
```

[jest-image-snapshot]: https://github.com/americanexpress/jest-image-snapshot
[storybook-addon-vis]: https://github.com/repobuddy/storybook-addon-vis
[storybook]: https://storybook.js.org
[vitest]: https://vitest.dev/
