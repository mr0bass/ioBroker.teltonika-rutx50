# RUTX50 API Implementation Update Summary

## Overview
This document summarizes the major changes made to fix the authentication issues and implement the correct RUTX50 API integration based on the actual RUTX50 firmware specification.

## Problem
The original implementation was based on assumptions about the RUTX50 API structure and used incorrect authentication methods and endpoints that don't exist in the actual router firmware.

## Solution
Complete rewrite of the RUTX50 API client using the actual RUTX50_7.16.3_v1.8.3.json API specification from Teltonika.

## Key Changes Made

### 1. Authentication Method
- **Before**: Session-based authentication using `/cgi-bin/luci/rpc/auth` with JSON-RPC format
- **After**: Bearer token authentication using `/login` endpoint with username/password JSON payload
- **Why**: The actual RUTX50 uses Vuci (Vue.js based) web interface with REST API and Bearer token authentication

### 2. SMS Sending Endpoint
- **Before**: Assumed `/cgi-bin/luci/rpc/sms` with JSON-RPC format
- **After**: Uses `/messages/actions/send` endpoint with structured data payload
- **Format**: 
  ```json
  {
    "data": {
      "number": "+1234567890",
      "message": "Your message text",
      "modem": "3-1.4"
    }
  }
  ```

### 3. Signal Status Endpoint
- **Before**: Assumed UCI-based configuration API
- **After**: Uses `/network/mobile/simcards/status` for real SIM card and signal information
- **Benefits**: Provides actual signal strength, operator, network type, and SIM status

### 4. API Call Structure
- **Before**: All API calls used JSON-RPC format with session ID in params array
- **After**: REST API calls with Bearer token in Authorization header
- **Headers**: All requests include `Authorization: Bearer <token>`

## Updated Files

### lib/rutx50-api.js
- Complete rewrite of authentication logic
- Updated all API endpoints to match real RUTX50 specification  
- Bearer token session management
- Improved error handling with proper RUTX50 error response parsing
- Real signal status parsing from SIM card data

### diagnose-rutx50.js
- Updated to use new API client
- Enhanced diagnostic output showing token expiry, protocol detection
- Better error reporting and troubleshooting guidance
- Optional SMS sending test with safety confirmation

## API Compatibility

### Supported RUTX50 Firmware
- Requires RUTX50 with Vuci web interface (newer firmware versions)
- Tested against API specification version 1.8.3
- Should work with RUT955_R_00.07.06 and newer

### Required Configuration
1. **Router Access**: Admin username/password for web interface
2. **Network Access**: HTTP/HTTPS access to router on local network
3. **SIM Card**: Active SIM card installed in router for SMS functionality
4. **Modem**: Cellular modem configured and operational

## Testing

### Connection Test
```bash
node diagnose-rutx50.js
```

### SMS Test (with actual sending)
```bash
RUTX50_HOST=192.168.1.1 RUTX50_USERNAME=admin RUTX50_PASSWORD=yourpass TEST_PHONE_NUMBER=+1234567890 node diagnose-rutx50.js --send-sms
```

### Environment Variables
- `RUTX50_HOST`: Router IP address (default: 192.168.1.1)
- `RUTX50_USERNAME`: Router username (default: admin) 
- `RUTX50_PASSWORD`: Router password (default: admin01)
- `TEST_PHONE_NUMBER`: Phone number for SMS testing

## Troubleshooting

### Common Issues
1. **Authentication Failed**: Check username/password, verify web interface access
2. **Connection Timeout**: Verify router IP address and network connectivity
3. **SMS Send Failed**: Ensure SIM card is active and has SMS capability
4. **Wrong API Version**: Update router firmware to support Vuci interface

### Debugging
The diagnostic script provides detailed debugging output including:
- Protocol detection (HTTP vs HTTPS)
- Authentication token status and expiry
- Signal strength and SIM card status
- SMS sending capability verification

## ioBroker Integration

The updated API client maintains the same interface for the main ioBroker adapter, so existing configurations and Blockly blocks continue to work. The changes are internal to improve reliability and compatibility with actual RUTX50 hardware.

### State Objects
- Connection status now includes token expiry information
- Signal strength data is more accurate from real SIM status
- SMS status includes segment count for long messages

## Future Enhancements

### Potential Improvements
1. **Modem Detection**: Auto-detect available modems instead of hardcoding "3-1.4"
2. **Multi-SIM Support**: Handle routers with multiple SIM cards
3. **Message History**: Access sent/received message history from router
4. **Signal Monitoring**: Continuous signal strength monitoring and alerts

### Configuration Options
- Configurable modem ID selection
- Custom API timeout settings  
- Protocol preference (HTTP vs HTTPS)
- Signal strength polling intervals