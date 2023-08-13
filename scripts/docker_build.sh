#!/bin/sh

DESCRIBE="$(git describe --always)"

DOCKER_BUILDKIT=1 docker build --secret id=BUILD_BASE --tag leanish .
docker tag leanish:latest "leanish:$DESCRIBE"
