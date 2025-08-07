# Teltonika RUTX50 SMS Adapter for ioBroker

![Logo](admin/teltonika-rutx50.png)
[![NPM version](http://img.shields.io/npm/v/iobroker.teltonika-rutx50.svg)](https://www.npmjs.com/package/iobroker.teltonika-rutx50)
[![Downloads](https://img.shields.io/npm/dm/iobroker.teltonika-rutx50.svg)](https://www.npmjs.com/package/iobroker.teltonika-rutx50)
![Number of Installations (latest)](http://iobroker.live/badges/teltonika-rutx50-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/teltonika-rutx50-stable.svg)
[![Dependency Status](https://img.shields.io/david/iobroker-community-adapters/iobroker.teltonika-rutx50.svg)](https://david-dm.org/iobroker-community-adapters/iobroker.teltonika-rutx50)

[![NPM](https://nodei.co/npm/iobroker.teltonika-rutx50.png?downloads=true)](https://nodei.co/npm/iobroker.teltonika-rutx50/)

**Tests:** ![Test and Release](https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/workflows/Test%20and%20Release/badge.svg)

## Teltonika RUTX50 SMS adapter for ioBroker

This adapter enables SMS sending functionality through a Teltonika RUTX50 router via its local REST API. The adapter provides both programmatic and visual (Blockly) interfaces for sending SMS messages, allowing users to integrate SMS capabilities into their home automation workflows.

## Features

- **SMS Sending**: Send SMS messages through the RUTX50's cellular connection
- **Local Processing**: All communication happens locally with your router - no external dependencies or cloud services
- **Blockly Integration**: Visual scripting blocks for easy automation within ioBroker
- **Status Monitoring**: Real-time monitoring of connection status, signal strength, and message delivery
- **Secure Authentication**: Session-based authentication with automatic renewal
- **Error Handling**: Comprehensive error reporting and status tracking
- **Signal Information**: Monitor cellular signal strength and network operator

## Requirements

- ioBroker installation (js-controller >= 4.0.0)
- Teltonika RUTX50 router with latest firmware
- Router must be accessible on local network
- Valid admin credentials for the router
- Active SIM card with SMS capability in the router

## Installation

### Via ioBroker Admin (Recommended)
1. Open ioBroker Admin interface
2. Go to "Adapters" tab
3. Click the "+" button and search for "teltonika-rutx50"
4. Click "Install" and wait for installation to complete
5. Create an instance and configure settings

### Via npm
```bash
npm install iobroker.teltonika-rutx50
```

### From GitHub
```bash
cd /opt/iobroker
npm install https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/tarball/main
```

## Configuration

### Router Connection Settings

Navigate to the adapter configuration in ioBroker Admin:

- **Router IP Address or Domain**: The IP address or domain name of your RUTX50 router (e.g., `192.168.1.1`)
- **Username**: Admin username for router access (typically `admin`)
- **Password**: Admin password for router access
- **Connection Timeout**: Timeout for API requests in milliseconds (5000-120000ms, default: 30000)

### Advanced Settings

- **Status Update Interval**: How often to check router status in milliseconds (30000-300000ms, default: 60000)

### Testing Connection

Use the "Test Connection" button in the configuration interface to verify that the adapter can successfully connect to your router.

## Usage

### State Objects

The adapter creates the following state objects:

#### SMS Control States
- `teltonika-rutx50.0.sms.recipient` - Set the phone number for SMS
- `teltonika-rutx50.0.sms.message` - Set the message text
- `teltonika-rutx50.0.sms.send` - Trigger SMS sending (set to `true`)

#### SMS Status States
- `teltonika-rutx50.0.sms.lastMessage` - Last sent message text
- `teltonika-rutx50.0.sms.lastRecipient` - Last recipient phone number  
- `teltonika-rutx50.0.sms.lastSendResult` - Whether last SMS was sent successfully (boolean)
- `teltonika-rutx50.0.sms.lastSendTime` - Timestamp of last SMS attempt
- `teltonika-rutx50.0.sms.lastError` - Error message if sending failed

#### Connection & Signal Status
- `teltonika-rutx50.0.info.connection` - Router connection status (boolean)
- `teltonika-rutx50.0.signal.strength` - Mobile signal strength (dBm)
- `teltonika-rutx50.0.signal.operator` - Mobile network operator name

### JavaScript Example

```javascript
// Send SMS via script
setState('teltonika-rutx50.0.sms.recipient', '+1234567890');
setState('teltonika-rutx50.0.sms.message', 'Hello from ioBroker!');
setState('teltonika-rutx50.0.sms.send', true);

// Check if SMS was sent successfully
on({id: 'teltonika-rutx50.0.sms.lastSendResult', change: 'any'}, function(obj) {
    if (obj.state.val) {
        console.log('SMS sent successfully!');
    } else {
        console.log('SMS failed:', getState('teltonika-rutx50.0.sms.lastError').val);
    }
});

// Monitor connection status
on({id: 'teltonika-rutx50.0.info.connection', change: 'any'}, function(obj) {
    if (obj.state.val) {
        console.log('RUTX50 router is connected');
        // Get signal information
        const signalStrength = getState('teltonika-rutx50.0.signal.strength').val;
        const operator = getState('teltonika-rutx50.0.signal.operator').val;
        console.log(`Signal: ${signalStrength} dBm, Operator: ${operator}`);
    } else {
        console.log('RUTX50 router is disconnected');
    }
});
```

### Blockly Visual Scripting

The adapter provides the following Blockly blocks in the "RUTX50 SMS" category:

#### SMS Sending Block
```
Send SMS via RUTX50
  to [phone number]
  message [message text]
```

#### Status Check Blocks
```
SMS send status [dropdown: was successful / last message / last recipient / last error / send time]
Signal [dropdown: strength / operator]
RUTX50 is connected
```

#### Example Blockly Script
```
IF (RUTX50 is connected)
  AND (Signal strength > -80)
  THEN:
    Send SMS via RUTX50
      to "+1234567890"
      message "System alert: Temperature exceeded threshold"
```

## API Reference

### Adapter Messages

You can send commands directly to the adapter:

```javascript
// Send SMS via adapter message
sendTo('teltonika-rutx50.0', 'sendSMS', {
    recipient: '+1234567890',
    message: 'Hello from ioBroker!'
}, function(result) {
    if (result.success) {
        console.log('SMS sent successfully');
    } else {
        console.log('SMS failed:', result.error);
    }
});

// Test connection
sendTo('teltonika-rutx50.0', 'testConnection', {}, function(result) {
    console.log('Connection test result:', result.success);
});
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify router IP address and credentials
   - Ensure router is accessible on the network
   - Check if HTTPS is enabled on the router

2. **SMS Not Sending**
   - Verify SIM card is inserted and has credit
   - Check signal strength (should be > -100 dBm)
   - Ensure phone number format is correct (include country code)

3. **Authentication Errors**
   - Double-check username and password
   - Verify admin access to router
   - Try logging in via web interface first

### Debug Logging

Enable debug logging in the adapter configuration to get detailed information about API calls and responses.

## Changelog

### 1.0.0 (2025-08-07)
- Initial release
- SMS sending via Teltonika RUTX50 router
- Blockly integration for visual scripting
- Connection and signal status monitoring
- Session-based authentication with auto-renewal
- Comprehensive error handling and status tracking

## License

MIT License

Copyright (c) 2025 ioBroker Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
