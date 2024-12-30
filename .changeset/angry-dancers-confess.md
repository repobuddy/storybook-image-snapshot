---
"storybook-addon-vis": patch
---

Change to use `ImageData(data, w, h, o)` constructor instead of `ImageData(w, h, o)` as `firefox` does not support it.
