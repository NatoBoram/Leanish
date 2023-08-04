# Leanish

[![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/20940830-92be-4a61-8f44-3a85efec0ac8)

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
