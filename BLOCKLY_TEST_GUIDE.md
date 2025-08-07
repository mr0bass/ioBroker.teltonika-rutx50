# Blockly Functionality Test Guide

## Version 1.1.2 Fixes Applied

### Fixed Issues
✅ **Corrected sendTo JavaScript Generation**: Fixed parameter order in Blockly block
✅ **Enhanced Debugging**: Added comprehensive logging to track Blockly communication
✅ **Proper Callback Handling**: Fixed callback function format
✅ **Message Validation**: Improved error handling and responses

## Generated JavaScript Code

When you use the SMS Blockly block, it now generates proper JavaScript:

```javascript
sendTo('teltonika-rutx50.0', 'sendSMS', {
    recipient: "436641234567",
    message: "Hello from ioBroker!"
}, function (result) {
    if (result && result.error) {
        console.log('SMS error: ' + result.error);
    } else {
        console.log('SMS sent successfully: ' + JSON.stringify(result));
    }
});
```

## Testing the Blockly Block

### 1. Install the Adapter
- Install version 1.1.2 in ioBroker
- Configure router IP, username, and password
- Test connection in admin interface

### 2. Use Blockly Block
- Open Blockly editor in ioBroker
- Find "SMS via RUTX50" block in SendTo category
- Configure:
  - Phone number: 436641234567
  - Message: "Test message from Blockly"
  - Log level: info
- Save and run the script

### 3. Check Logs
You should see detailed logging like this:

```
2025-08-07 10:30:15.123 - info: teltonika-rutx50.0 === BLOCKLY MESSAGE RECEIVED ===
2025-08-07 10:30:15.124 - info: teltonika-rutx50.0 Command: sendSMS
2025-08-07 10:30:15.125 - info: teltonika-rutx50.0 Processing sendSMS command from Blockly
2025-08-07 10:30:15.126 - info: teltonika-rutx50.0 SMS recipient: 436641234567
2025-08-07 10:30:15.127 - info: teltonika-rutx50.0 SMS message: Test message from Blockly
2025-08-07 10:30:15.128 - info: teltonika-rutx50.0 Sending SMS to 436641234567 via RUTX50 API...
```

### 4. Verify Results
- Check adapter states for SMS status
- Verify SMS was sent via router
- Check console output for callback messages

## Key Improvements in v1.1.2

1. **Fixed sendTo Format**: Now uses correct parameter order
2. **Enhanced Logging**: Comprehensive debugging for troubleshooting
3. **Proper Callbacks**: Correct callback function generation
4. **Better Validation**: Improved message and error handling

## If Issues Persist

Check the adapter log with debug level enabled to see the full communication flow between Blockly and the adapter.