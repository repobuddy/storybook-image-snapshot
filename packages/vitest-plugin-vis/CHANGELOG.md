# vitest-plugin-vis

## 2.0.1

### Patch Changes

- [`24621e0`](https://github.com/repobuddy/storybook-addon-vis/commit/24621e0683bebc08d112d93c99e58d28e0dffb67) Thanks [@unional](https://github.com/unional)! - Update `type-plus`.

## 2.0.0

### Major Changes

- [#204](https://github.com/repobuddy/storybook-addon-vis/pull/204) [`020121f`](https://github.com/repobuddy/storybook-addon-vis/commit/020121f04d08feaf071db0beb65236e79feb695d) Thanks [@unional](https://github.com/unional)! - Change the `customizeSnapshotId` to accept `context` object.

  This is a breaking change.
  Feature-wise, it is the same as before.
  We will enable better customization by passing `viewport` to the `customizeSnapshotId` function in the future.

- [#204](https://github.com/repobuddy/storybook-addon-vis/pull/204) [`76b09cc`](https://github.com/repobuddy/storybook-addon-vis/commit/76b09cc00c5fc94026e2a5ab6283300325716675) Thanks [@unional](https://github.com/unional)! - Add support to customize `snapshotRootDir` with a function.
  Deprecate `platform` option.

## 1.7.0

### Minor Changes

- [#195](https://github.com/repobuddy/storybook-addon-vis/pull/195) [`972db1b`](https://github.com/repobuddy/storybook-addon-vis/commit/972db1bb1f511d9073a2600afa030ff9c46e864f) Thanks [@unional](https://github.com/unional)! - Allow `setAutoSnapshotOptions` to specify additional properties.
  Each theme in `vis.presets.theme()` and `vis.afterEach.matchPerTheme()` will receive the options.

  ```ts
  vis.presets.theme({
  	theme1(options) { ... }
  })
  ```

## 1.6.5

### Patch Changes

- [#190](https://github.com/repobuddy/storybook-addon-vis/pull/190) [`be483d4`](https://github.com/repobuddy/storybook-addon-vis/commit/be483d412358158c4016eba573bf035252f6cbb5) Thanks [@unional](https://github.com/unional)! - Support `customizeSnapshotId` option during theme auto snapshot.

## 1.6.4

### Patch Changes

- [#188](https://github.com/repobuddy/storybook-addon-vis/pull/188) [`78b117f`](https://github.com/repobuddy/storybook-addon-vis/commit/78b117fef0510c993aad33ff92114d9a786b41d8) Thanks [@unional](https://github.com/unional)! - Use bounded `expect`.

## 1.6.3

### Patch Changes

- [#185](https://github.com/repobuddy/storybook-addon-vis/pull/185) [`c5296a1`](https://github.com/repobuddy/storybook-addon-vis/commit/c5296a15933cb26bb1792701c691f7ca67c5a4ee) Thanks [@unional](https://github.com/unional)! - Export `AutoSnapshotOptions` under `/client`.

## 1.6.2

### Patch Changes

- [#183](https://github.com/repobuddy/storybook-addon-vis/pull/183) [`49e8fbc`](https://github.com/repobuddy/storybook-addon-vis/commit/49e8fbc60a9e9e07e700a5d61164cf954186ce2d) Thanks [@unional](https://github.com/unional)! - Export `AutoSnapshotOptions` to fix the inferred type cannot be named error.

## 1.6.1

### Patch Changes

- [#182](https://github.com/repobuddy/storybook-addon-vis/pull/182) [`537cf83`](https://github.com/repobuddy/storybook-addon-vis/commit/537cf83b7cd6120876f46fc4bd5d51391128cab4) Thanks [@unional](https://github.com/unional)! - Should not take snapshot when the test failed.
  Ensure the theme is awaited before taking the snapshot.

## 1.6.0

### Minor Changes

- [#171](https://github.com/repobuddy/storybook-addon-vis/pull/171) [`5335011`](https://github.com/repobuddy/storybook-addon-vis/commit/5335011f32b59604cd0a3b653c04ac690b6ca5fa) Thanks [@unional](https://github.com/unional)! - Support default subject using `data-testid` attribute.

## 1.5.1

### Patch Changes

- [#166](https://github.com/repobuddy/storybook-addon-vis/pull/166) [`611e0cc`](https://github.com/repobuddy/storybook-addon-vis/commit/611e0cca505bfea0fe67ce10e45af2946a7cc578) Thanks [@unional](https://github.com/unional)! - Use `config.root` instead of `runner.root`.
  `runner.root` is protected in Vitest v3.

## 1.5.0

### Minor Changes

- [#162](https://github.com/repobuddy/storybook-addon-vis/pull/162) [`995140f`](https://github.com/repobuddy/storybook-addon-vis/commit/995140f0bda8c389a24f143f744dabe6d682a8ce) Thanks [@unional](https://github.com/unional)! - Support customizing `platform` by @joekrump.

  For example, with `vis({ platform: 'ci' })`,
  Instead of saving the snapshots to `<root>/__vis__/{local or process.platform}`,
  the snapshots will be saved to `<root>/__vis__/ci`.

### Patch Changes

- [#156](https://github.com/repobuddy/storybook-addon-vis/pull/156) [`72959a6`](https://github.com/repobuddy/storybook-addon-vis/commit/72959a6bd2bea3d9c1cff652b8ff384c10e017f2) Thanks [@unional](https://github.com/unional)! - Add top level `types` field to `package.json` for project not using ESM module resolution.

- [#160](https://github.com/repobuddy/storybook-addon-vis/pull/160) [`d2fdcbe`](https://github.com/repobuddy/storybook-addon-vis/commit/d2fdcbe023917ea9dc85ac332dfd8b46f6936f20) Thanks [@unional](https://github.com/unional)! - Remove `expectToFail` from `VisOptions`.
  It should not have that property.

- [#161](https://github.com/repobuddy/storybook-addon-vis/pull/161) [`43fc2ce`](https://github.com/repobuddy/storybook-addon-vis/commit/43fc2ce3385c0086de567816a1a1328ea4df336f) Thanks [@unional](https://github.com/unional)! - Change default timeout to 30s.
  The initial timeout of 1s was set by Vitest.
  It is causing tests to fail with `TimeoutError`,
  even when getting `Locator` like `getByRole`.

  This timeout will be removed in Vitest 3.

  The underlying provider (`playwright`) does not have a default timeout.

  Setting to 30s should be a good default for most cases.

  It could still be too short for slow CI or when it is running scripts in parallel.
  That was the case for `storybook-test-runner` but could be improved in Vitest browser mode.

  If timeout is still an issue, we can further default it to 60s or even 120s.

- [#158](https://github.com/repobuddy/storybook-addon-vis/pull/158) [`a020417`](https://github.com/repobuddy/storybook-addon-vis/commit/a02041770b32ca52baa35326ff77a39fe4b249c2) Thanks [@unional](https://github.com/unional)! - Add a blank line to separate the theme error messages.

- [#160](https://github.com/repobuddy/storybook-addon-vis/pull/160) [`ee4ef14`](https://github.com/repobuddy/storybook-addon-vis/commit/ee4ef1492a0444bf1b24d2614c8365154038b351) Thanks [@unional](https://github.com/unional)! - Fix the global setting not being applied.

## 1.4.0

### Minor Changes

- [#150](https://github.com/repobuddy/storybook-addon-vis/pull/150) [`da95b08`](https://github.com/repobuddy/storybook-addon-vis/commit/da95b08e496d1f8a8b1663e55681510803e41082) Thanks [@unional](https://github.com/unional)! - Add `ssim` support.

## 1.3.2

### Patch Changes

- [`1b22d2d`](https://github.com/repobuddy/storybook-addon-vis/commit/1b22d2d290a1fb18156cda3b846a402ad51481a2) Thanks [@unional](https://github.com/unional)! - Misc update to error message

## 1.3.1

### Patch Changes

- [#145](https://github.com/repobuddy/storybook-addon-vis/pull/145) [`3ebc865`](https://github.com/repobuddy/storybook-addon-vis/commit/3ebc8655f3364a59de1d87930af53554dd9b4faa) Thanks [@unional](https://github.com/unional)! - Fix `expectToFail` during snapshot update.

## 1.3.0

### Minor Changes

- [#139](https://github.com/repobuddy/storybook-addon-vis/pull/139) [`17510d3`](https://github.com/repobuddy/storybook-addon-vis/commit/17510d32272730ebf4677ed2c4b177f636e75cc2) Thanks [@unional](https://github.com/unional)! - Add `expectToFail` support.
  This is useful to test where the visual should be changed beyond the threshold.

- [#144](https://github.com/repobuddy/storybook-addon-vis/pull/144) [`f642dbf`](https://github.com/repobuddy/storybook-addon-vis/commit/f642dbfbb6a715ef14a944c50e656b79c926b5d4) Thanks [@unional](https://github.com/unional)! - Change `import { matchImageSnapshot } from 'vitest-plugin-vis/client'` to `import { imageSnapshotMatcher } from 'vitest-plugin-vis/client'`.

  This is a bug in 1.2.0 because `matchImageSnapshot` is hard loading `@vitest/browser/context`, which causes storybook to fail to load.

### Patch Changes

- [#144](https://github.com/repobuddy/storybook-addon-vis/pull/144) [`2d4f1c0`](https://github.com/repobuddy/storybook-addon-vis/commit/2d4f1c02394ca4fd8880452a98399c825e686ee5) Thanks [@unional](https://github.com/unional)! - Extends `expect` and `page` in presets.

- [#144](https://github.com/repobuddy/storybook-addon-vis/pull/144) [`78cc195`](https://github.com/repobuddy/storybook-addon-vis/commit/78cc195e1ae9afe2fe102e0e916cffff406e0ebd) Thanks [@unional](https://github.com/unional)! - Augment `expect` and `page` in main so that consumer can load the types:

  ```json
  {
    "compilerOptions": {
      "types": ["vitest-plugin-vis"]
    }
  }
  ```

## 1.2.0

### Minor Changes

- [#137](https://github.com/repobuddy/storybook-addon-vis/pull/137) [`e4bef32`](https://github.com/repobuddy/storybook-addon-vis/commit/e4bef32a897015f5f84407610ef184eb3872f424) Thanks [@unional](https://github.com/unional)! - Assert `context.testPath` on `setupVisSuite` command.

  Add `stubBrowserCommandContext` to `/testing`.

### Patch Changes

- [#137](https://github.com/repobuddy/storybook-addon-vis/pull/137) [`e0fec8e`](https://github.com/repobuddy/storybook-addon-vis/commit/e0fec8edf7c082bf31b10ea6040b216836740ab2) Thanks [@unional](https://github.com/unional)! - Remove import of `vitest-browser-react` in the presets.
  The plugin is not React specific.

- [#137](https://github.com/repobuddy/storybook-addon-vis/pull/137) [`a3e3c89`](https://github.com/repobuddy/storybook-addon-vis/commit/a3e3c89341183a8ced5339290cc74d172b78f82d) Thanks [@unional](https://github.com/unional)! - Update `writeImageSnapshot` signature.

- [#137](https://github.com/repobuddy/storybook-addon-vis/pull/137) [`eaa3bbe`](https://github.com/repobuddy/storybook-addon-vis/commit/eaa3bbe91076d42b7eb8b773c404b2e62d6c4930) Thanks [@unional](https://github.com/unional)! - Improve `testPath` assertion message.

## 1.1.0

### Minor Changes

- [`0360253`](https://github.com/repobuddy/storybook-addon-vis/commit/03602536b5ebf67b7d898f95d6511e5b05da96a9) Thanks [@unional](https://github.com/unional)! - Depreacate `toTaskId`.

- [#133](https://github.com/repobuddy/storybook-addon-vis/pull/133) [`badf227`](https://github.com/repobuddy/storybook-addon-vis/commit/badf2273828ad883763e1e328b4e180c07b4960a) Thanks [@unional](https://github.com/unional)! - Perform image comparison on the client side.
  This is similar to `storybook-addon-vis@0.13.0`, but the image taking is still done on the server side.

  Try to address the issue of the slower image comparison on the server side.

  Export `matchImageSnapshot` function on the client side.
  Mark `parseImageSnapshotSubject` as deprecated as it is not needed anymore.

### Patch Changes

- [#136](https://github.com/repobuddy/storybook-addon-vis/pull/136) [`176d28f`](https://github.com/repobuddy/storybook-addon-vis/commit/176d28fc459cb0823f3fda94ad4e3372690dbd8d) Thanks [@unional](https://github.com/unional)! - Update error message during threshold conversion.

- [#135](https://github.com/repobuddy/storybook-addon-vis/pull/135) [`6912ad7`](https://github.com/repobuddy/storybook-addon-vis/commit/6912ad73041f7e46757f0f364dcaa6594a35ce9d) Thanks [@unional](https://github.com/unional)! - Improve options message.

## 1.0.5

### Patch Changes

- [#130](https://github.com/repobuddy/storybook-addon-vis/pull/130) [`e242444`](https://github.com/repobuddy/storybook-addon-vis/commit/e242444908766274014b5fc94afaf31392627c88) Thanks [@unional](https://github.com/unional)! - Add update snapshot back to the server implementation.

## 1.0.4

### Patch Changes

- [#128](https://github.com/repobuddy/storybook-addon-vis/pull/128) [`d695c4f`](https://github.com/repobuddy/storybook-addon-vis/commit/d695c4fb0b0be80ce53e38884fcb7a6340a8e52d) Thanks [@unional](https://github.com/unional)! - Avoid buffer conversion.

## 1.0.3

### Patch Changes

- [#125](https://github.com/repobuddy/storybook-addon-vis/pull/125) [`1068941`](https://github.com/repobuddy/storybook-addon-vis/commit/1068941b1495966cb3ee15a53dd5937e37365373) Thanks [@unional](https://github.com/unional)! - Try to improve the performance of the plugin by skipping the rescale step and not checking the CRC of the image.

  This should be safe because the image is generated by the browser, or it is a base64 string (not 100% sure on this), and the CRC is not used for anything.

  If not performance improvement is seen, we can revert this change.

## 1.0.2

### Patch Changes

- [#123](https://github.com/repobuddy/storybook-addon-vis/pull/123) [`a8fcd75`](https://github.com/repobuddy/storybook-addon-vis/commit/a8fcd75a056cb5b16006c52190453f19e41ab182) Thanks [@unional](https://github.com/unional)! - Avoid resizing images when not necessary.

## 1.0.1

### Patch Changes

- [#117](https://github.com/repobuddy/storybook-addon-vis/pull/117) [`ae98ec4`](https://github.com/repobuddy/storybook-addon-vis/commit/ae98ec47df104c80723892345946aebb65cb361c) Thanks [@unional](https://github.com/unional)! - Proxy `vitest/suite`.

  This fix the warning message `Module "util" has been externalized for browser compatibility.` when it is loaded in the browser.

  Fixes [#101](https://github.com/repobuddy/storybook-addon-vis/issues/101).

## 1.0.0

### Major Changes

- [#102](https://github.com/repobuddy/storybook-addon-vis/pull/102) [`03893ab`](https://github.com/repobuddy/storybook-addon-vis/commit/03893ab4efae5f2d243bad67f40bc5cb4ad4d623) Thanks [@unional](https://github.com/unional)! - Initial Release.

  [`vitest-plugin-vis`](https://www.npmjs.com/package/vitest-plugin-vis) is a visual testing plugin for [Vitest](https://vitest.dev/), running on [Vitest Browser Mode](https://vitest.dev/guide/browser/).
