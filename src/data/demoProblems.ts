import { ProblemItem } from '../types';

export const DEFAULT_AVATAR_URL =
  '/src/assets/images/user_profile_avatar_1795407144070.jpg';

export const DEMO_HOME_PROBLEMS: ProblemItem[] = [
  {
    id: 'home-1',
    number: 1,
    label: 'Problem 1',
    title: 'Phone Slow Chaltay (Phone Running Slow & Lagging)',
    imageUrl: '/src/assets/images/phone_slow_demo_1795407143369.jpg',
    imageAlt: 'Smartphone displaying high memory usage and loading spinner',
    solutionShort:
      'Clear app cache, close heavy background apps, and keep at least 20% internal storage free for smooth performance.',
    solutionFull: [
      'Open Settings > Storage and clear cached data from heavy apps like Chrome, Instagram, and YouTube.',
      'Restart your phone once a week to clear stuck background RAM processes.',
      'Uninstall unused apps and disable auto-sync for accounts you rarely check.',
      'Turn off heavy live wallpapers and reduce animation scale in Developer Options to 0.5x.',
    ],
    likes: 24,
    likedByMe: false,
    comments: [
      {
        id: 'c-1',
        author: 'Rohan',
        text: 'Clearing cache and restarting made my phone noticeably faster.',
        createdAt: '2h ago',
      },
    ],
    createdAt: 'Today',
    section: 'home',
  },
  {
    id: 'home-2',
    number: 2,
    label: 'Problem 2',
    title: 'Wi-Fi Connected But No Internet Access',
    imageUrl: '/src/assets/images/wifi_issue_demo_1795407142583.jpg',
    imageAlt: 'Smartphone beside Wi-Fi router showing no internet warning',
    solutionShort:
      'Restart your router for 30 seconds, forget and reconnect to the Wi-Fi network, and set DNS to 1.1.1.1 or 8.8.8.8.',
    solutionFull: [
      'Unplug your Wi-Fi router power cable, wait 30 full seconds, and plug it back in.',
      'On your phone, go to Settings > Wi-Fi, tap your network, and select Forget.',
      'Reconnect by entering the Wi-Fi password fresh to renew the IP lease.',
      'If pages still fail to load, change Private DNS to dns.google or one.one.one.one.',
    ],
    likes: 18,
    likedByMe: false,
    comments: [],
    createdAt: 'Today',
    section: 'home',
  },
  {
    id: 'home-3',
    number: 3,
    label: 'Problem 3',
    title: 'Phone Battery Draining Very Fast',
    imageUrl: '/src/assets/images/battery_drain_demo_1795407141520.jpg',
    imageAlt: 'Smartphone showing 7 percent low red battery warning next to charger cable',
    solutionShort:
      'Check Battery Usage in Settings to restrict background drainers, enable Adaptive Battery, and lower screen brightness.',
    solutionFull: [
      'Go to Settings > Battery > Battery Usage to spot apps consuming power in the background.',
      'Set high-drain apps to Restricted battery mode.',
      'Turn on Adaptive Battery and switch screen refresh rate to Standard (60Hz) when needed.',
      'Disable Bluetooth, GPS location, and 5G scanning when not actively using them.',
    ],
    likes: 31,
    likedByMe: false,
    comments: [],
    createdAt: 'Yesterday',
    section: 'home',
  },
  {
    id: 'home-4',
    number: 4,
    label: 'Problem 4',
    title: 'App Keeps Crashing or Not Responding on Open',
    imageUrl: '/src/assets/images/app_crash_demo_1795407149497.jpg',
    imageAlt: 'Smartphone held over desk showing App Not Responding dialog',
    solutionShort:
      'Force stop the app, clear its cache in App Settings, and update both the app and Android System WebView.',
    solutionFull: [
      'Open Settings > Apps, select the crashing app, and tap Force Stop.',
      'Go to Storage & Cache inside that app and tap Clear Cache.',
      'Open Google Play Store and update the app along with Android System WebView.',
      'If the crash still continues, back up your app data and reinstall the latest version.',
    ],
    likes: 15,
    likedByMe: false,
    comments: [],
    createdAt: '2 days ago',
    section: 'home',
  },
  {
    id: 'home-5',
    number: 5,
    label: 'Problem 5',
    title: 'Phone Storage Almost Full Warning',
    imageUrl: '/src/assets/images/storage_full_demo_1795407142995.jpg',
    imageAlt: 'Smartphone displaying storage chart at 93.6 percent capacity',
    solutionShort:
      'Empty Trash/Bin in Gallery, clean WhatsApp forwarded videos, and move large media files to cloud backup.',
    solutionFull: [
      'Open Gallery / Google Photos and empty the Trash or Recently Deleted folder immediately.',
      'Open WhatsApp > Settings > Storage and Data > Manage Storage to delete duplicate forwarded videos.',
      'Open Files app and remove old APK installers and large files from the Downloads folder.',
      'Back up older photos to cloud storage and tap Free up space on device.',
    ],
    likes: 27,
    likedByMe: false,
    comments: [],
    createdAt: '3 days ago',
    section: 'home',
  },
];

export const DEMO_PENDING_PROBLEMS: ProblemItem[] = [
  {
    id: 'pending-1',
    number: 1,
    label: 'Problem 1',
    title: 'Phone Heating While Charging Fast',
    imageUrl: '/src/assets/images/battery_drain_demo_1795407141520.jpg',
    imageAlt: 'Smartphone next to USB-C charging cable',
    solutionShort:
      'Remove thick phone cover while charging, use original adapter, and avoid gaming while plugged in.',
    solutionFull: [
      'Take off thick rubber or leather cases during fast charging so heat dissipates evenly.',
      'Verify you are using the original certified cable and power brick.',
      'Close camera or heavy gaming apps while the battery is charging.',
    ],
    likes: 9,
    likedByMe: false,
    comments: [],
    createdAt: 'Today',
    section: 'pending',
    pendingStatus: 'working',
  },
  {
    id: 'pending-2',
    number: 2,
    label: 'Problem 2',
    title: 'Mobile Hotspot Keeps Disconnecting Automatically',
    imageUrl: '/src/assets/images/wifi_issue_demo_1795407142583.jpg',
    imageAlt: 'Smartphone showing Wi-Fi connectivity issue',
    solutionShort:
      'Disable "Turn off hotspot automatically" in Hotspot settings and exclude Hotspot from battery saver.',
    solutionFull: [
      'Open Settings > Network & Internet > Hotspot & Tethering > Wi-Fi Hotspot.',
      'Disable the option "Turn off hotspot automatically when no device is connected".',
      'Switch AP Band from 5 GHz to 2.4 GHz if older laptops keep dropping off.',
    ],
    likes: 6,
    likedByMe: false,
    comments: [],
    createdAt: 'Today',
    section: 'pending',
    pendingStatus: 'pending',
  },
];

export const DEMO_USER_PROBLEMS: ProblemItem[] = [
  {
    id: 'user-1',
    number: 1,
    label: 'Problem 1',
    title: 'Phone Slow Chaltay After Software Update',
    imageUrl: '/src/assets/images/phone_slow_demo_1795407143369.jpg',
    imageAlt: 'Smartphone showing high memory usage',
    solutionShort:
      'Wipe cache from heavy apps, restart device once, and wait 24 hours for background indexing to finish.',
    solutionFull: [
      'Restart the phone cleanly after installing an OS update.',
      'Open Google Play Store and update all installed apps for compatibility with the new OS.',
      'Clear cache from Settings > Storage to free memory immediately.',
    ],
    likes: 11,
    likedByMe: false,
    comments: [],
    createdAt: 'Yesterday',
    section: 'user',
    userFeedback: 'working',
  },
  {
    id: 'user-2',
    number: 2,
    label: 'Problem 2',
    title: 'WhatsApp Media Not Downloading on Mobile Data',
    imageUrl: '/src/assets/images/app_crash_demo_1795407149497.jpg',
    imageAlt: 'Smartphone app notification screen',
    solutionShort:
      'Check WhatsApp Storage & Data auto-download settings and verify Background Data is allowed.',
    solutionFull: [
      'Open WhatsApp > Settings > Storage and Data > When using mobile data, select Photos and Documents.',
      'Go to Phone Settings > Apps > WhatsApp > Mobile Data & Wi-Fi and enable Background Data.',
      'Verify internal storage has at least 1 GB free space.',
    ],
    likes: 4,
    likedByMe: false,
    comments: [],
    createdAt: '2 days ago',
    section: 'user',
    userFeedback: 'working',
  },
];
