# Teltonika RUTX50 SMS Adapter - Deployment Guide

## Version 1.0.13 - Configurable Modem & Blockly Fix

This package contains the complete ioBroker adapter for Teltonika RUTX50 SMS functionality using the proven REST API endpoints.

## What's New in v1.0.13

- **Configurable Modem Parameter**: Added "Modem Identifier" setting in admin interface for multi-SIM routers
- **Enhanced Admin UI**: New field in advanced settings to configure modem (default: "1-1")  
- **Fixed Blockly Registration**: Changed from blockyList to "sendto: true" for proper block discovery
- **Proper Block Structure**: Created admin/blockly.js with correct sendTo block definition
- **Dynamic Configuration**: SMS API now uses user-configured modem parameter

## What's New in v1.0.12

- **HTTP 422 Error Fixed**: Corrected SMS API payload format that was causing request validation failures  
- **Proper API Parameters**: Changed 'phone' to 'number' parameter as required by RUTX50 API
- **Added Modem Parameter**: Added required 'modem: "1-1"' parameter for router identification
- **API Documentation Compliance**: Now uses exact payload structure from Teltonika documentation

## What's New in v1.0.11

- **Fixed Blockly SendTo Block**: Added proper "teltonika_rutx50_send_sms" block to Blockly sendTo category
- **Simplified Block Interface**: Single block with "number" and "message" parameters as requested
- **Proper Block Registration**: Added blockyList to io-package.json for proper block discovery
- **Enhanced Block Definition**: Created custom.html and blockly_sendto.js for proper block integration
- **SendTo Message Handler**: Ensures sendTo commands from Blockly are properly handled

## What's New in v1.0.10

- **REST API Authentication**: Fixed to use proven /api/login endpoint
- **API SMS Sending**: Uses /api/messages/actions/send endpoint with Bearer token
- **Token-Based Auth**: Replaced web-based authentication with API token authentication
- **Improved Compatibility**: Direct API calls work with all router firmware versions
- **Better Error Handling**: Enhanced error reporting for API authentication and SMS sending

## Previous Updates

**v1.0.6 - Complete Web Authentication Rewrite**: 
- Complete web-based authentication to handle routers without REST API support
- Browser simulation with proper headers, cookies, and session management
- CSRF token support and session-based SMS sending

## Package Contents

### Core Files
- `main.js` - Main adapter implementation
- `io-package.json` - ioBroker adapter configuration (v1.0.5)
- `package.json` - Node.js dependencies and metadata
- `package-iobroker.json` - ioBroker-specific package configuration
- `package-github.json` - GitHub-specific package configuration

### Libraries
- `lib/rutx50-api.js` - Enhanced API client with multi-authentication support
- `lib/blockly.js` - Blockly visual scripting integration

### Admin Interface
- `admin/index.html` - Configuration web interface
- `admin/index.js` - Admin interface JavaScript
- `admin/words.js` - Multi-language translations
- `admin/teltonika-rutx50.png` - Adapter icon

### Documentation & Tools
- `README.md` - Complete installation and usage guide
- `docs/` - Additional documentation
- `diagnose-rutx50.js` - Diagnostic tool for troubleshooting
- `test-auth-methods.js` - Authentication testing utility
- `RUTX50_7.16.3_v1.8.3.json` - Official API specification

## Installation Methods

### Method 1: Direct ioBroker Installation
1. Copy all files to your ioBroker adapters directory
2. Run: `iobroker add teltonika-rutx50`
3. Configure via ioBroker admin interface

### Method 2: Manual Installation
1. Extract all files to: `/opt/iobroker/node_modules/iobroker.teltonika-rutx50/`
2. Install dependencies: `npm install`
3. Register with ioBroker: `iobroker upload teltonika-rutx50`

### Method 3: Development Installation
1. Clone or extract to development directory
2. Link to ioBroker: `iobroker install ./`
3. Upload configuration: `iobroker upload teltonika-rutx50`

## Configuration

1. Open ioBroker Admin interface
2. Navigate to Adapters → teltonika-rutx50
3. Configure router settings:
   - **Router IP/Domain**: Your RUTX50 IP address
   - **Username**: Router admin username
   - **Password**: Router admin password
   - **Protocol**: Auto (recommended) or specify HTTPS/HTTP
   - **Timeout**: Connection timeout in milliseconds

## Testing Authentication

Use the included test script to verify authentication:

```bash
node test-auth-methods.js
```

Edit the script to match your router configuration.

## Troubleshooting

### Authentication Issues
1. Run diagnostic script: `node diagnose-rutx50.js`
2. Check router web interface accessibility
3. Verify credentials and network connectivity
4. Review adapter logs in ioBroker

### Common Solutions
- **HTML Login Pages**: Adapter now handles web-based authentication
- **Different Firmware**: Tries multiple authentication endpoints automatically
- **SSL Issues**: Uses auto-detection for HTTPS/HTTP protocols
- **Session Expiry**: Automatic token renewal implemented

## Support

For issues and updates, refer to:
- Project documentation in `docs/` folder
- Diagnostic tools: `diagnose-rutx50.js` and `test-auth-methods.js`
- ioBroker community forums
- GitHub issues (if applicable)

---

**Package Version**: 1.0.5  
**Build Date**: $(date)  
**Compatibility**: ioBroker 4.0+, Node.js 16+