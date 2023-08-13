#!/bin/sh

DESCRIBE=$(git describe --always)
docker build . -t leanish
docker tag leanish:latest leanish:$DESCRIBE
