# Leanish

[![Android CI](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml) [![GitHub Pages](https://github.com/NatoBoram/Leanish/actions/workflows/github-pages.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/github-pages.yaml) [![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/20940830-92be-4a61-8f44-3a85efec0ac8)

## Usage

Leanish is currently in alpha. The roadmap to beta is in [the Beta milestone](https://github.com/NatoBoram/Leanish/milestone/1).

There is a CSR deployment at [natoboram.github.io/Leanish](https://natoboram.github.io/Leanish). It can be installed as a Progressive Web App.

Android builds are available in the [Releases](https://github.com/NatoBoram/Leanish/releases) tab.

For a more cutting-edge experience, the CI builds are available in [the Actions tab](https://github.com/NatoBoram/Leanish/actions/workflows/android.yaml).

[![Get it on Obtainium](https://github.com/NatoBoram/Leanish/assets/10495562/928ae711-a01c-4496-97f2-50dc1740f370)](https://github.com/ImranR98/Obtainium)

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
