## Create new
- npx @react-native-community/cli init WlanControl --pm npm

## check the emulators
- emulator -list-avds

## Run the app
- npx react-native run-android

## debug the app
- npx react-native doctor

## check problems

## Projektin rakennusta
cd android
./gradlew assembleRelease
./gradlew assembleDebug tää ei vaadi salasanaa mutta vaatii decv apin luuriin  joten ei

apk: android/app/build/outputs/apk/release/app-release.apk

## välimuistin siivous
cd android
./gradlew clean

##
pakettien linkitystä HUOM, nää pitää itte konffata filuu react-native.config.js ja sitten vasta loitsu:
npx react-native link

