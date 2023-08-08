# Leanish

[![Node.js CI](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml/badge.svg)](https://github.com/NatoBoram/Leanish/actions/workflows/node.js.yaml)

A lean-ish web client for Lemmy.

![screenshot](https://github.com/NatoBoram/Leanish/assets/10495562/20940830-92be-4a61-8f44-3a85efec0ac8)

## Usage

There is an alpha build at <https://natoboram.github.io/Leanish>.

## Build from source

### Web

```sh
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm install
BUILD_ADAPTER=node pnpm run build
node ./build/index.js
```

This gives you access to a local server at <http://localhost:3000> that you can even access from your mobile device.

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
yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --install "build-tools;33.0.2" "platforms;android-33"
git clone https://github.com/NatoBoram/Leanish.git
cd Leanish
pnpm install
pnpm run build:apk
pnpm run install:apk
```

This will create a release build at `android/app/build/outputs/apk/release/app-release.apk` and install it on your phone.
