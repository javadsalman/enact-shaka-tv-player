# Cross-Platform TV Video Player

A cross-platform video player application designed for Samsung Tizen and LG webOS TV platforms. Built with React/Enact.js framework and Shaka Player for advanced streaming capabilities.

## 🚀 Features

### Core Video Capabilities
- **HLS Streaming Support** - HTTP Live Streaming for adaptive bitrate streaming
- **DRM Protection** - Widevine and PlayReady DRM support for protected content
- **Multi-Quality Video** - Adaptive bitrate streaming with manual quality selection
- **Live Streaming** - Support for live video streams
- **Audio Track Selection** - Multiple audio language support
- **Subtitle Support** - Multiple subtitle tracks with language selection

### TV-Optimized UX
- **TV Remote Control** - Full support for TV remote navigation
- **Spotlight Navigation** - Enact.js Spotlight for D-pad navigation
- **TV-Specific UI** - Optimized for large screen viewing distances
- **Background Key Handling** - Support for TV-specific hardware keys

### Cross-Platform Support
- **Samsung Tizen** - Native Tizen TV app support
- **LG webOS** - Native webOS TV app support
- **Automatic Sync** - copier.js utility for syncing builds between platforms

### Development Features
- **ES5 Compilation** - Babel/Webpack setup for older TV browser compatibility
- **iframe Integration** - Vue.js demo app showing iframe integration
- **Modern Development** - Hot reload, debugging, and testing capabilities

## 📁 Project Structure

```
player/
├── src/                          # Main application source
│   ├── App/                      # Main app component
│   ├── components/               # Reusable UI components
│   ├── container/
│   │   └── Player/               # Video player container
│   │       ├── Player.js         # Main player component
│   │       ├── playerContrib.js  # DRM & utility functions
│   │       └── SelectPanel.js    # Quality/Audio/Subtitle selection
│   ├── pages/                    # Application pages
│   │   └── PlayerPage.js         # Player page with sample content
│   └── views/                    # View components
├── tizen/                        # Tizen-specific build output
│   ├── config.xml               # Tizen app configuration
│   ├── main.js                  # Compiled application
│   ├── main.css                 # Compiled styles
│   └── index.html               # Tizen HTML template
├── vue-app/                     # iframe integration demo
│   ├── src/App.vue              # Vue.js iframe demo
│   └── package.json             # Vue app dependencies
├── dist/                        # webOS build output
├── resources/                   # App resources and assets
├── copier.js                    # Sync utility for Tizen
├── webpack.config.js            # ES5 compilation config
├── .babelrc                     # Babel transpilation config
├── html-template.html           # HTML template with Shaka Player
└── appinfo.json                 # webOS app metadata
```

## 🛠️ Prerequisites

### Development Environment
- **Node.js** >= 16.0.0
- **npm** >= 6.9.0
- **@enact/cli** - Enact development tools

### TV Platform SDKs

#### Samsung Tizen Studio
1. Download and install [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download)
2. Install TV Extensions: `Tools > Package Manager > Extension SDK > TV Extensions`
3. Set up Certificate Manager for app signing

#### LG webOS SDK
1. Download and install [webOS TV SDK](https://webostv.developer.lge.com/sdk/download/)
2. Install CLI tools: `npm install -g @webosose/ares-cli`
3. Set up target device for testing

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd player
npm install
```

### 2. Install Vue Demo App Dependencies
```bash
cd vue-app
npm install
cd ..
```

### 3. Install Enact CLI (if not already installed)
```bash
npm install -g @enact/cli
```

## 📱 Development Commands

### Main Application
```bash
# Development server with hot reload
npm run serve

# Development build (unminified)
npm run pack

# Production build (minified)
npm run pack-p

# Watch mode for development
npm run watch

# Clean previous builds
npm run clean

# Run linter
npm run lint

# Run tests
npm run test

# Build and compile to ES5
npm run build
```

### Vue.js Demo App
```bash
cd vue-app

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## 🔧 Platform-Specific Build Commands

### Samsung Tizen

#### Building for Tizen
```bash
# 1. Build the main application
npm run build

# 2. Sync files to Tizen project
node copier.js

# 3. Navigate to Tizen directory
cd tizen

# 4. Build Tizen package (.wgt)
tizen build-web

# 5. Package for installation (.tpk)
tizen package -t wgt -s <certificate-profile-name>

# 6. Install on device/emulator
tizen install -n <package-name>.tpk -t <device-name>

# 7. Launch application
tizen run -p <app-id> -t <device-name>
```

#### Tizen Certificate Setup
```bash
# Create certificate profile
tizen certificate -a <alias> -p <password> -c <country> -s <state> -ct <city> -o <organization> -n <name> -e <email>

# Create security profile
tizen security-profiles add -n <profile-name> -a <alias>
```

### LG webOS

#### Building for webOS
```bash
# 1. Build the main application
npm run build

# 2. Package webOS app (.ipk)
ares-package dist

# 3. Install on device
ares-install <package-name>.ipk -d <device-name>

# 4. Launch application
ares-launch <app-id> -d <device-name>

# 5. Debug application
ares-inspect <app-id> -d <device-name>
```

#### webOS Device Setup
```bash
# Add target device
ares-setup-device

# List devices
ares-device-info -D

# Enable developer mode on TV
# Settings > General > Developer Mode Options > Developer Mode: On
```

## ⚙️ Configuration

### DRM Configuration
The player supports Widevine and PlayReady DRM. Configure DRM in `PlayerPage.js`:

```javascript
const isDRM = true;
const drmType = 'widevine'; // or 'playready'
const drmLicenseKey = 'https://your-license-server.com/widevine';
```

### Video Sources
Configure video sources in `PlayerPage.js`:

```javascript
// HLS Stream
const HLS_VIDEO_URL = "https://example.com/playlist.m3u8";

// Live Stream
const HLS_LIVE_URL = "https://example.com/live/stream.m3u8";

// DRM Protected Content
const WIDEVINE_VIDEO_URL = "https://example.com/protected/playlist.m3u8";
```

### App Metadata

#### webOS (`appinfo.json`)
```json
{
  "id": "com.yourcompany.player",
  "version": "1.0.0",
  "vendor": "Your Company",
  "type": "web",
  "main": "index.html",
  "title": "Your Player App",
  "icon": "icon.png"
}
```

#### Tizen (`config.xml`)
Key configurations for Samsung TV:
- App ID and version
- Required Tizen version (2.3+)
- TV-specific privileges
- Hardware key support
- Background support settings

## 🎮 TV Remote Control Support

### Supported Keys
- **Directional Pad** - Navigation
- **Enter/OK** - Selection
- **Back** - Navigation back
- **Play/Pause** - Media control
- **Rewind/Forward** - Seek controls
- **Volume** - Audio control

### Key Handling
TV remote events are handled in the Player component with platform-specific key codes:
- Samsung: Key code 10009
- LG: Key code 461

## 🔧 Technical Implementation

### Shaka Player Integration
- **Version**: 4.12.6 (CDN)
- **Polyfills**: Automatic installation for TV browser compatibility
- **ABR**: Adaptive bitrate streaming enabled by default
- **DRM**: Widevine and PlayReady support

### Enact.js Framework
- **Theme**: Sandstone UI kit for TV interfaces
- **Spotlight**: TV-optimized focus management
- **VideoPlayer**: TV-optimized video player component
- **MediaControls**: TV remote-friendly media controls

### ES5 Compatibility
Webpack and Babel configuration ensures compatibility with older TV browsers:
- **Babel**: ES6+ to ES5 transpilation
- **Core-js**: Polyfills for modern JavaScript features
- **Target**: Legacy TV browser support

## 📊 iframe Integration

The included Vue.js demo app (`vue-app/`) demonstrates how to integrate the player as an iframe in other applications:

```vue
<iframe 
  src="/dist/index.html"
  width="100%"
  height="100%"
  frameborder="0"
>
</iframe>
```

## 🧪 Testing

### Development Testing
```bash
# Unit tests
npm run test

# Watch mode testing
npm run test-watch

# Linting
npm run lint
```

### Device Testing
1. **webOS Simulator**: Use LG webOS SDK simulator
2. **Tizen Emulator**: Use Samsung Tizen Studio emulator
3. **Real Devices**: Deploy to actual Samsung/LG TV devices

## 🔒 Security Considerations

### Content Security Policy
The HTML template includes CSP headers for secure media loading:
```html
<meta http-equiv="Content-Security-Policy" content="media-src 'self' blob: http: https:;">
```

### DRM Implementation
- Secure license key management
- Browser DRM support detection
- Fallback handling for unsupported DRM systems

## 📈 Performance Optimization

### Build Optimization
- Production builds are minified and optimized
- ES5 compilation for legacy browser support
- CSS and JS bundling for reduced network requests

### Streaming Optimization
- Adaptive bitrate streaming
- Buffer management
- Quality selection based on network conditions
- Live streaming support

## 🐛 Troubleshooting

### Common Issues

1. **Video not playing**
   - Check network connectivity
   - Verify HLS/DASH stream format
   - Check DRM configuration

2. **Remote control not working**
   - Verify TV is in developer mode
   - Check key event listeners
   - Ensure Spotlight navigation is properly configured

3. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify platform SDK installation

### Debug Tools
- Browser developer tools (for webOS)
- Tizen Studio debugger (for Samsung)
- Console logging in player components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## 📄 License

This project is licensed under UNLICENSED - see the package.json file for details.

## 🔗 Resources

### Documentation
- [Enact.js Documentation](https://enactjs.com/docs/)
- [Shaka Player Documentation](https://shaka-player-demo.appspot.com/docs/api/tutorial-welcome.html)
- [Samsung Tizen TV Guide](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html)
- [LG webOS TV Guide](https://webostv.developer.lge.com/develop/getting-started/setting-up-sdk/)

### Sample Content
- HLS Test Streams: [https://developer.apple.com/streaming/examples/](https://developer.apple.com/streaming/examples/)
- Shaka Player Demo Assets: [https://shaka-player-demo.appspot.com/](https://shaka-player-demo.appspot.com/)

---

**Note**: This player is optimized for Samsung Tizen and LG webOS TV platforms. For other platforms, additional configuration may be required.