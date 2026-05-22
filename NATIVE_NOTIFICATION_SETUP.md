# Native Notification Setup Guide

Preparation
Before you begin, ensure you have your Adhan sound file in two formats:
- `adhan.wav` (for Android)
- `adhan.caf` (for iOS)
Keep these files handy on your desktop.

## Android Studio Steps

**Step 1: Open the Android Project**
Open Android Studio, select "Open", and navigate to your project's `android` folder. Wait for the Gradle sync to finish completely.

**Step 2: Create the Raw Directory**
In the left-hand project panel, make sure you are in the "Android" view. Navigate to `app > res`. Right-click the `res` folder, go to **New > Android Resource Directory**. In the "Resource type" dropdown, select `raw` and click OK.

**Step 3: Add the Audio File**
Drag and drop your `adhan.wav` file directly from your computer into that newly created `raw` folder inside Android Studio. Verify that the file is named exactly `adhan.wav` in lowercase.

**Step 4: Verify the Notification Icon**
Your Capacitor config specifies an icon named `ic_stat_icon_config_sample`. You need to ensure this icon actually exists. Still inside the `res` folder, open the `drawable` folder. Look for a file named `ic_stat_icon_config_sample.png` or `.xml`. If it is missing, you must generate a transparent white silhouette icon and place it in the `drawable` folder, naming it exactly as specified in your config. Without this, Android notifications will crash or appear as empty white squares.

## Xcode Steps

**Step 1: Open the iOS Workspace**
Navigate to your project's `ios` folder and open the `App.xcworkspace` file in Xcode. Do not open the standard project file; you must use the workspace file for Capacitor projects.

**Step 2: Add the Audio File to the Bundle**
In the left-hand Project Navigator, locate the top-level "App" folder (it usually sits above the Pods folder). Drag and drop your `adhan.caf` file from your computer directly into this "App" folder.

**Step 3: Configure Target Membership**
When you drop the file, a configuration window will pop up. This is the most critical step. You must:
- Check the box that says "Copy items if needed".
- Under "Add to targets", ensure the checkbox next to "App" is checked.
Click Finish.

**Step 4: Verify Bundle Resources**
Click on the blue "App" project icon at the very top of the left panel. In the main window, select the "App" target, and click the "Build Phases" tab. Expand the section called "Copy Bundle Resources". Scroll through the list to confirm that `adhan.caf` is listed there. If it is, iOS will recognize it when triggering the notification.

## Final Sync

After completing the steps in both IDEs, open your terminal, navigate to your root project directory, and run the command: 
`npx cap sync`
