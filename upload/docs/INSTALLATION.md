# Installation Guide

This guide covers different methods to install the Teltonika RUTX50 SMS Adapter for ioBroker.

## Prerequisites

Before installing the adapter, ensure you have:

- ioBroker system running (js-controller >= 4.0.0)
- Node.js 16.x or higher
- Access to a Teltonika RUTX50 router on your local network
- Admin credentials for the router
- Active SIM card in the router with SMS capability

## Installation Methods

### Method 1: ioBroker Admin Interface (Recommended)

This is the easiest method for most users:

1. **Open ioBroker Admin**
   - Navigate to your ioBroker admin interface (usually http://your-iobroker-ip:8081)
   - Log in with your admin credentials

2. **Go to Adapters**
   - Click on the "Adapters" tab in the left sidebar
   - This will show all available adapters

3. **Search for the Adapter**
   - Click the "+" (Install) button at the top
   - In the search box, type "teltonika-rutx50"
   - The adapter should appear in the search results

4. **Install the Adapter**
   - Click "Install" on the Teltonika RUTX50 SMS Adapter
   - Wait for the installation to complete
   - You'll see a success message when done

5. **Create an Instance**
   - After installation, go to the "Instances" tab
   - Find "teltonika-rutx50" in the list
   - Click the "+" button to create a new instance
   - The instance will be created and started automatically

### Method 2: npm Installation

For advanced users or custom installations:

1. **Access ioBroker Directory**
   ```bash
   cd /opt/iobroker
   # or wherever your ioBroker is installed
   ```

2. **Install via npm**
   ```bash
   npm install iobroker.teltonika-rutx50
   ```

3. **Upload to ioBroker**
   ```bash
   iobroker upload teltonika-rutx50
   ```

4. **Create Instance**
   ```bash
   iobroker add teltonika-rutx50
   ```

### Method 3: GitHub Installation

To install the latest development version:

1. **Download from GitHub**
   ```bash
   cd /opt/iobroker
   npm install https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/tarball/main
   ```

2. **Upload and Create Instance**
   ```bash
   iobroker upload teltonika-rutx50
   iobroker add teltonika-rutx50
   ```

### Method 4: Manual Installation

For development or troubleshooting:

1. **Clone Repository**
   ```bash
   git clone https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50.git
   cd ioBroker.teltonika-rutx50
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Copy to ioBroker**
   ```bash
   # Copy the adapter files to your ioBroker installation
   cp -r . /opt/iobroker/node_modules/iobroker.teltonika-rutx50/
   ```

4. **Install in ioBroker**
   ```bash
   cd /opt/iobroker
   iobroker upload teltonika-rutx50
   iobroker add teltonika-rutx50
   ```

## Post-Installation Configuration

After successful installation:

### 1. Access Configuration

- Go to "Instances" in ioBroker Admin
- Find your teltonika-rutx50 instance
- Click the wrench/settings icon to configure

### 2. Router Connection Settings

Configure the following required settings:

- **Router IP Address**: Your RUTX50's IP (e.g., 192.168.1.1)
- **Username**: Router admin username (usually "admin")
- **Password**: Router admin password
- **Connection Timeout**: API timeout in milliseconds (default: 30000)

### 3. Advanced Settings (Optional)

- **Status Update Interval**: How often to check router status (default: 60000ms)

### 4. Test Connection

- Click "Test Connection" to verify settings
- You should see a success message if everything is configured correctly
- If the test fails, check your network connection and credentials

### 5. Save Configuration

- Click "Save" to apply your settings
- The adapter will restart automatically
- Check the log for any startup messages

## Verification

### Check Instance Status

1. Go to "Instances" tab
2. Your teltonika-rutx50 instance should show:
   - Green light (running)
   - No error messages in the log

### Check Objects

1. Go to "Objects" tab
2. Expand "teltonika-rutx50.0"
3. You should see folders for:
   - `info` (connection status)
   - `sms` (SMS controls and status)
   - `signal` (signal information)

### Test SMS Functionality

1. Go to "Objects" tab
2. Navigate to `teltonika-rutx50.0.sms`
3. Set values for:
   - `recipient`: Your phone number (e.g., +1234567890)
   - `message`: A test message
   - `send`: Set to `true`
4. Check the `lastSendResult` to see if it was successful

## Troubleshooting Installation

### Common Issues

**1. "Cannot find module" errors**
```bash
# Reinstall dependencies
cd /opt/iobroker/node_modules/iobroker.teltonika-rutx50
npm install
```

**2. Permission errors**
```bash
# Fix permissions
sudo chown -R iobroker:iobroker /opt/iobroker/
```

**3. Adapter not appearing in admin**
```bash
# Force refresh adapter list
iobroker restart
```

**4. Installation timeout**
- Check internet connection
- Try installing manually via npm
- Check available disk space

### Log Files

Check these log files for installation issues:

- ioBroker main log: `/opt/iobroker/log/iobroker.YYYY-MM-DD.log`
- Adapter log: Look for "teltonika-rutx50" entries
- System logs: `journalctl -u iobroker` (on systemd systems)

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](../README.md#troubleshooting)
2. Review the [GitHub Issues](https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/issues)
3. Ask in the ioBroker community forums
4. Create a new GitHub issue with:
   - Your ioBroker version
   - Node.js version
   - Installation method used
   - Complete error messages
   - Log file contents

## Next Steps

After successful installation:

1. [Configure the adapter](../README.md#configuration)
2. [Learn about usage](../README.md#usage)
3. [Explore Blockly integration](../README.md#blockly-visual-scripting)
4. [Check out example scripts](../README.md#javascript-example)