# Leanish

[![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![image](https://github.com/NatoBoram/Leanish/assets/10495562/35a918aa-4196-42c6-9a54-3ff70d359657)

## Usage

Not ready for general usage. The build at <https://natoboram.github.io/Leanish> will _not_ work; it is there to test when <https://github.com/LemmyNet/lemmy/pull/3421> will get merged, published and deployed. Until then, you can build it from source.

## Build from source

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm i
pnpm build
pnpm preview --host
```

This gives you access to a local server at <http://localhost:4173> that you can even access from your mobile device.
