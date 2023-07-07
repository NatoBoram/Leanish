# Leanish

[![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/40ed33e9-49bd-4201-9067-e408f1452d60)

## Usage

Not ready for general usage. The build at <https://natoboram.github.io/Leanish> will _not_ work; it is there to test when <https://github.com/LemmyNet/lemmy/pull/3421> will get merged, published and deployed. Until then, you can build it from source.

## Build from source

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm i
BUILD_ADAPTER=node pnpm build
node ./build/index.js
```

This gives you access to a local server at <http://localhost:3000> that you can even access from your mobile device.
