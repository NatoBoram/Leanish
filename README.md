# Leanish

[![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/4b502a00-4239-4ff7-9d51-3d5763b32c9b)

## Usage

There is an alpha build at <https://natoboram.github.io/Leanish>.

## Build from source

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm i
BUILD_ADAPTER=node pnpm build
node ./build/index.js
```

This gives you access to a local server at <http://localhost:3000> that you can even access from your mobile device.
