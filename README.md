## How to start
- IDE to install :  Visual studio code
- Clone project into local folder
- Install appium-desktop and configure the jdk in java home in appium
- Open the emulator and run the command ```adb devices``` for android
- Open terminal in visual code and install ```npm install```
- Start the appium server


## Run for iOS
- Checking config/wdio.ios.app.conf.js, make sure capability is correct
- App is stored in "apps" folder
- xcode should be installed to access the Simulator
- Run by command ```npm run ios.app```

## Run for Android
- Checking config/wdio.android.app.conf.js, make sure capability is correct
- App is stored in "apps" folder
- Android studio should be installed and open the emulator
- Run by command ```npm run android.app```

## Notes:
- apps folder is included in gitignore, therefore it will not be pushed into repository

This document is under construction, will be kept updating in future.
