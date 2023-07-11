#!/bin/sh

FOUND=$(find src/routes -name '+*.server.*')
echo $FOUND | xargs rm

BUILD_ADAPTER='static' pnpm build
echo $FOUND | xargs git checkout --

svelte-kit sync
