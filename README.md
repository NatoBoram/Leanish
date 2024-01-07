# Leanish

[![Android CI](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml) [![Docker CI](https://github.com/NatoBoram/Leanish/actions/workflows/docker.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/docker.yaml) [![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml) [![GitHub Pages](https://github.com/NatoBoram/Leanish/actions/workflows/github-pages.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/github-pages.yaml) [![Docker Pulls](https://img.shields.io/docker/pulls/natoboram/leanish?logo=docker)](https://hub.docker.com/repository/docker/natoboram/leanish) [![GitHub Downloads](https://img.shields.io/github/downloads/NatoBoram/Leanish/total?logo=github)](https://github.com/NatoBoram/Leanish/releases) [![NPM Downloads](https://img.shields.io/npm/dt/%40natoboram/leanish?logo=npm)](https://www.npmjs.com/package/@natoboram/leanish) [![Play Store Downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fplay.cuzi.workers.dev%2Fplay%3Fi%3Dcom.natoboram.leanish%26m%3D%24installs&logo=Google%20Play&label=downloads)](https://play.google.com/store/apps/details?id=com.natoboram.leanish) [![Lemmy](https://img.shields.io/lemmy/leanish%40lemmy.world?logo=lemmy&label=leanish%40lemmy.world)](https://natoboram.github.io/Leanish/lemm.ee/c/leanish@lemmy.world)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/20940830-92be-4a61-8f44-3a85efec0ac8)

## Usage

Leanish is currently in alpha. The roadmap to beta is in [the Beta milestone](https://github.com/NatoBoram/Leanish/milestone/1).

There is a client-side rendered deployment at [natoboram.github.io/Leanish](https://natoboram.github.io/Leanish). It can be installed as a Progressive Web App.

Android builds are available in the [Releases](https://github.com/NatoBoram/Leanish/releases) tab. For a more cutting-edge experience, CI builds are available in the [Actions](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml) tab.

<div style="text-align: center">
	<a href="https://github.com/ImranR98/Obtainium">
		<img
			align="center"
			alt="Get it on Obtainium"
			height="50"
			hspace="6"
			src="https://github.com/NatoBoram/Leanish/assets/10495562/ff726d91-8065-483b-a277-57b3c237f9a9"
		/>
	</a>
	<a href="https://play.google.com/store/apps/details?id=com.natoboram.leanish">
		<img
			align="center"
			alt="Get it on Google Play"
			height="50"
			hspace="6"
			src="https://github.com/NatoBoram/Leanish/assets/10495562/f2139ad0-397f-4259-86e5-f24f86ea7e63"
		/>
	</a>
</div>

## Deploy

A [docker image](https://hub.docker.com/repository/docker/natoboram/leanish) and a [`npm` package](https://www.npmjs.com/package/@natoboram/leanish) are available for deployment.

```sh
docker pull natoboram/leanish
docker run -p 3000:3000 natoboram/leanish
```

```sh
pnpm install -g @natoboram/leanish
leanish
```

## Build from source

### Docker

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
BUILD_BASE= pnpm run docker:build
pnpm run docker:run
```

### Web

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm install
BUILD_ADAPTER=node pnpm run build
node ./build/index.js
```

This gives you access to a local server at <http://localhost:3000> that you can access from your mobile device.

### Android

You need a signing key to make a release build. You can generate it with `keytool`:

```sh
keytool -alias key -genkey -keyalg RSA -keysize 7680 -keystore keystore.pkcs12 -v -validity 36525
```

Move the keystore somewhere safe and create a file `android/key.properties` with the following content:

```properties
keyAlias=key
keyPassword=
storeFile=keystore.pkcs12
storePassword=
```

Don't forget to put the full path and actual passwords in the file. You can find more information about signing keys in <https://docs.flutter.dev/deployment/android#signing-the-app>.

To make a release build:

```sh
(yes || true) | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --install "build-tools;33.0.2" "platforms;android-33"
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm install
pnpm run build:apk
pnpm run install:apk
```

This will create a release build at `android/app/build/outputs/apk/release/app-release.apk` and install it on your phone.

## Signatures

Files in the [Releases](https://github.com/NatoBoram/Leanish/releases) tab are signed with a SSH key. You can verify the files' signature with the following commands:

```sh
ssh-keygen -Y verify -f ./.github/allowed_signers.txt -I '41898282+github-actions[bot]@users.noreply.github.com' -n file -s app-release.apk.sig < app-release.apk
ssh-keygen -Y verify -f ./.github/allowed_signers.txt -I '41898282+github-actions[bot]@users.noreply.github.com' -n file -s natoboram-leanish-*.tgz.sig < natoboram-leanish-*.tgz
```

These signatures are only there to indicate that the files were built by GitHub Actions.

## Legal

_Google Play and the Google Play logo are trademarks of Google LLC._
