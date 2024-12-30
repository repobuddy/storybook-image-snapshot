# Vitest Visual Testing Plugin

Vitest visual testing plugin allowing you to capture and compare image snapshots automatically and manually.

It requires [Vitest Browser Mode][vitest-browser-mode] to work.

This plugin is inspired by [`jest-image-snapshot`][jest-image-snapshot],
and extracted from [`storybook-addon-vis`][storybook-addon-vis] for better modularity.

## Install

```sh
npm install --save-dev vitest-plugin-vis

pnpm add --save-dev vitest-plugin-vis

yarn add --save-dev vitest-plugin-vis
```

## Config

Vitest visual testing plugin supports zero-config setup.

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { vis } from 'vitest-plugin-vis/config'

export default defineConfig({
  plugins: [vis()],
  test: {
    browser: {
      // typical browser config
      enabled: true,
      provider: 'playwright',
      name: 'chromium'
    }
  }
})
```

This default configuration will:

- Use the `auto` preset, taking image snapshot at the end on each rendering test.
- Set config to compare image snapshot with a failure threshold of `0 pixels`.
- Local (non-CI) image snapshots are saved in the `<root>/__vis__/local` directory.
- CI image snapshots are saved in the `<root>/__vis__/<process.platform>` directory.
- Image snapshots of the current test run are saved in the `<root>/__vis__/__results__` directory.
- Diff images are saved in the `<root>/__vis__/__diffs__` directory.

You can customize the configuration:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { vis } from 'vitest-plugin-vis/config'

export default defineConfig({
  plugins: [
    vis({
      preset: 'auto', // preset is disabled by default when you provide a custom config
      snapshotRootDir: '__vis__',
      customizeSnapshotSubpath: (subpath) => subpath,
      customizeSnapshotId: (id, index) => `${id}-${index}`,
      diffOptions: undefined, // pixelmatch options
      failureThresholdType: 'pixel',
      failureThreshold: 0,
      timeout: 5000 // 30000 on CI
    })
  ],
  test:{
    browser:{/* ... */}
  }
})
```

If you want to do a custom snapshot at the end of each test,
such as taking a snapshot for each theme,
you can set it up using a custom setup file:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { vis } from 'vitest-plugin-vis/config'

export default defineConfig({
  plugins: [
    // preset is disabled by default when you provide a custom config
    vis({}) // or vis({ preset: 'none' })
  ],
  test:{
    browser:{/* ... */},
    setupFiles: ['vitest.setup.ts']
  }
})

// vitest.setup.ts
import { vis } from 'vitest-plugin-vis/setup'

vis.presets.theme({
  light() { document.body.classList.remove('dark') },
  dark() { document.body.classList.add('dark') },
})
```

## Usage

### Auto Snapshot

By default, the plugin will use the `auto` preset, which will take a snapshot at the end of each test.

You can control how the auto snapshot is taken using the `setAutoSnapshotOptions` function:

```ts
import { setAutoSnapshotOptions } from 'vitest-plugin-vis'
import { beforeEach, it } from 'vitest'

beforeEach(({ task }) => {
  // Apply options to all tests in the current file
  setAutoSnapshotOptions(task, {/* options */})
})

it('disable snapshot per test', async ({ task }) => {
  // Apply options to this test only
  setAutoSnapshotOptions(task, { enable: false })
})
```

### Manual Snapshot

You can also set the preset to `manual` and compare snapshots manually:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vis({ preset: 'manual' })
  ],
  test:{
    browser:{/* ... */}
  }
})

// some.test.ts
import 'vitest-browser-react' // do this in your setup file to get `page.render`
import { page } from '@vitest/browser/context'
import { expect, it } from 'vitest'

it('manual snapshot', async () => {
  page.render(<div data-testid="subject">hello world</div>)
  await expect(document.body).toMatchImageSnapshot()
  // or
  const subject = page.getByTestId('subject')
  await expect(subject).toMatchImageSnapshot()
})
```

You can customize the snapshot comparison options per assertion:

```ts
// some.test.ts
import 'vitest-browser-react' // do this in your setup file to get `page.render`
import { page } from '@vitest/browser/context'
import { expect, it } from 'vitest'

it('manual snapshot with options', async () => {
  page.render(<div data-testid="subject">hello world</div>)
  const subject = page.getByTestId('subject')
  await expect(subject).toMatchImageSnapshot({
    customizeSnapshotId: (id, index) => `${id}-${index}`,
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
    diffOptions: {
      threshold: 0.1
    },
    timeout: 15000
  })
})
```

### Has Snapshot

While less common, you can also check if a snapshot exists:

```ts
import { page } from '@vitest/browser/context'
import { expect, it } from 'vitest'

it('Has Snapshot', async () => {
  const hasSnapshot = await page.hasImageSnapshot()
  if (!hasSnapshot) {
    // do something
  }
  else {
    // do something else
  }
})
```

This is useful when you are performing some negative test.

## Vitest Browser Mode

Vitest visual testing plugin runs on [Vitest Browser Mode][vitest-browser-mode].
Please follow its guide to set up your environment.

Bonus note, if you want to install [Firefox] on WSL,
you can follow these steps: [Install Firefox on Ubuntu 22.04](https://askubuntu.com/a/1444967).

## Git Ignore

The local snapshots, current run results, and diffs should be ignored by git.
Add the following lines to your `.gitignore` file:

```sh
**/__vis__/__diffs__
**/__vis__/__results__
**/__vis__/local
```

## FAQ

> feature X in [`jest-image-snapshot`][jest-image-snapshot] is missing

Some features in [`jest-image-snapshot`][jest-image-snapshot] are not implemented in [`vitest-plugin-vis`][vitest-plugin-vis] yet.
This is because through our own usage, we do not found a good use case for them.
For example, the `ssim` comparison method is not implemented in [`vitest-plugin-vis`][vitest-plugin-vis],
because we found that figuring out what is the delta using `ssim` is quite difficult.

If you have a good use case for these features, please open an issue or PR.

[firefox]: https://www.mozilla.org/en-US/firefox/
[jest-image-snapshot]: https://github.com/americanexpress/jest-image-snapshot
[storybook-addon-vis]: https://github.com/repobuddy/storybook-addon-vis
[vitest-browser-mode]: https://vitest.dev/guide/browser/
[vitest-plugin-vis]: https://www.npmjs.com/package/vitest-plugin-vis
