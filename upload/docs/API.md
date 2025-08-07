# API Reference

This document provides detailed information about the Teltonika RUTX50 SMS Adapter API, including all available methods, state objects, and integration options.

## Adapter Messages

The adapter supports direct messaging for programmatic control:

### sendSMS

Send an SMS message directly via adapter messaging.

**Parameters:**
- `recipient` (string): Phone number including country code (e.g., "+1234567890")
- `message` (string): SMS text content (max 160 characters recommended)

**Response:**
- `success` (boolean): Whether the SMS was sent successfully
- `error` (string): Error message if sending failed
- `messageId` (number): Unique identifier for the message
- `recipient` (string): The recipient phone number
- `message` (string): The message content

**Example:**
```javascript
sendTo('teltonika-rutx50.0', 'sendSMS', {
    recipient: '+1234567890',
    message: 'Hello from ioBroker!'
}, function(result) {
    if (result.success) {
        console.log('SMS sent successfully, ID:', result.messageId);
    } else {
        console.error('SMS failed:', result.error);
    }
});
```

### testConnection

Test the connection to the RUTX50 router.

**Parameters:** None

**Response:**
- `success` (boolean): Whether the connection test succeeded

**Example:**
```javascript
sendTo('teltonika-rutx50.0', 'testConnection', {}, function(result) {
    console.log('Connection test result:', result.success);
});
```

## State Objects

The adapter creates several state objects for monitoring and control:

### SMS Control States

#### teltonika-rutx50.0.sms.recipient
- **Type:** string
- **Role:** text.phone
- **Read:** true, **Write:** true
- **Description:** Phone number for SMS recipient
- **Format:** Include country code (e.g., "+1234567890")

#### teltonika-rutx50.0.sms.message
- **Type:** string
- **Role:** text
- **Read:** true, **Write:** true
- **Description:** SMS message content
- **Limit:** 160 characters recommended for standard SMS

#### teltonika-rutx50.0.sms.send
- **Type:** boolean
- **Role:** button
- **Read:** true, **Write:** true
- **Description:** Trigger to send SMS (set to true)
- **Behavior:** Automatically resets to false after sending

### SMS Status States

#### teltonika-rutx50.0.sms.lastMessage
- **Type:** string
- **Role:** text
- **Read:** true, **Write:** false
- **Description:** Content of the last sent SMS

#### teltonika-rutx50.0.sms.lastRecipient
- **Type:** string
- **Role:** text.phone
- **Read:** true, **Write:** false
- **Description:** Recipient of the last sent SMS

#### teltonika-rutx50.0.sms.lastSendResult
- **Type:** boolean
- **Role:** indicator
- **Read:** true, **Write:** false
- **Description:** Success status of last SMS send attempt

#### teltonika-rutx50.0.sms.lastSendTime
- **Type:** string
- **Role:** date
- **Read:** true, **Write:** false
- **Description:** ISO timestamp of last SMS send attempt

#### teltonika-rutx50.0.sms.lastError
- **Type:** string
- **Role:** text
- **Read:** true, **Write:** false
- **Description:** Error message from last failed SMS attempt

### Connection Status States

#### teltonika-rutx50.0.info.connection
- **Type:** boolean
- **Role:** indicator.connected
- **Read:** true, **Write:** false
- **Description:** Router connection status

### Signal Information States

#### teltonika-rutx50.0.signal.strength
- **Type:** number
- **Role:** value
- **Unit:** dBm
- **Read:** true, **Write:** false
- **Description:** Cellular signal strength
- **Range:** Typically -50 (excellent) to -120 (no signal)

#### teltonika-rutx50.0.signal.operator
- **Type:** string
- **Role:** text
- **Read:** true, **Write:** false
- **Description:** Mobile network operator name

## JavaScript Integration

### Basic SMS Sending

```javascript
// Method 1: Using state objects
setState('teltonika-rutx50.0.sms.recipient', '+1234567890');
setState('teltonika-rutx50.0.sms.message', 'Test message');
setState('teltonika-rutx50.0.sms.send', true);

// Method 2: Using adapter messaging
sendTo('teltonika-rutx50.0', 'sendSMS', {
    recipient: '+1234567890',
    message: 'Test message'
}, function(result) {
    console.log('Send result:', result);
});
```

### Status Monitoring

```javascript
// Monitor SMS send results
on({id: 'teltonika-rutx50.0.sms.lastSendResult', change: 'any'}, function(obj) {
    if (obj.state.val) {
        log('SMS sent successfully at ' + 
            getState('teltonika-rutx50.0.sms.lastSendTime').val);
    } else {
        log('SMS failed: ' + 
            getState('teltonika-rutx50.0.sms.lastError').val);
    }
});

// Monitor connection status
on({id: 'teltonika-rutx50.0.info.connection', change: 'any'}, function(obj) {
    if (obj.state.val) {
        const signal = getState('teltonika-rutx50.0.signal.strength').val;
        const operator = getState('teltonika-rutx50.0.signal.operator').val;
        log(`Router connected - Signal: ${signal} dBm, Operator: ${operator}`);
    } else {
        log('Router disconnected');
    }
});
```

### Advanced Examples

#### Conditional SMS Based on Signal Strength

```javascript
function sendConditionalSMS(recipient, message) {
    const connected = getState('teltonika-rutx50.0.info.connection').val;
    const signalStrength = getState('teltonika-rutx50.0.signal.strength').val;
    
    if (!connected) {
        log('Cannot send SMS: Router not connected');
        return false;
    }
    
    if (signalStrength < -100) {
        log('Cannot send SMS: Signal too weak (' + signalStrength + ' dBm)');
        return false;
    }
    
    sendTo('teltonika-rutx50.0', 'sendSMS', {
        recipient: recipient,
        message: message
    }, function(result) {
        if (result.success) {
            log('SMS sent successfully');
        } else {
            log('SMS failed: ' + result.error);
        }
    });
    
    return true;
}

// Usage
sendConditionalSMS('+1234567890', 'System alert: Temperature high');
```

#### SMS Queue Implementation

```javascript
let smsQueue = [];
let sending = false;

function queueSMS(recipient, message) {
    smsQueue.push({
        recipient: recipient,
        message: message,
        timestamp: new Date().toISOString()
    });
    
    processSMSQueue();
}

function processSMSQueue() {
    if (sending || smsQueue.length === 0) {
        return;
    }
    
    const sms = smsQueue.shift();
    sending = true;
    
    sendTo('teltonika-rutx50.0', 'sendSMS', {
        recipient: sms.recipient,
        message: sms.message
    }, function(result) {
        sending = false;
        
        if (result.success) {
            log('Queued SMS sent to ' + sms.recipient);
        } else {
            log('Queued SMS failed for ' + sms.recipient + ': ' + result.error);
            // Optionally re-queue failed messages
        }
        
        // Process next SMS in queue after delay
        setTimeout(processSMSQueue, 2000);
    });
}

// Usage
queueSMS('+1234567890', 'Message 1');
queueSMS('+1234567891', 'Message 2');
queueSMS('+1234567892', 'Message 3');
```

## Blockly Integration

### Available Blocks

#### Send SMS Block
- **Category:** RUTX50 SMS
- **Inputs:** 
  - Recipient (text/variable)
  - Message (text/variable)
- **Function:** Sends SMS via router
- **Returns:** None (action block)

#### SMS Status Blocks
- **Category:** RUTX50 SMS
- **Options:**
  - "was successful" → boolean
  - "last message" → string
  - "last recipient" → string
  - "last error" → string
  - "send time" → string
- **Returns:** Value based on selection

#### Signal Status Blocks
- **Category:** RUTX50 SMS
- **Options:**
  - "strength" → number (dBm)
  - "operator" → string
- **Returns:** Value based on selection

#### Connection Status Block
- **Category:** RUTX50 SMS
- **Returns:** boolean (connection status)

### Blockly Examples

#### Simple SMS Alert
```
IF (temperature > 25)
  THEN:
    Send SMS via RUTX50
      to "+1234567890"
      message "Temperature alert: " + temperature + "°C"
```

#### Conditional SMS with Signal Check
```
IF (RUTX50 is connected)
  AND (Signal strength > -90)
  THEN:
    Send SMS via RUTX50
      to "+1234567890"
      message "System is operational"
  ELSE:
    Log "Cannot send SMS: Poor connection"
```

## Error Handling

### Common Error Messages

- **"Recipient and message are required"**: Missing or empty recipient/message
- **"Invalid phone number format"**: Phone number doesn't match expected format
- **"Authentication failed"**: Router credentials are incorrect
- **"Connection timeout"**: Router is not responding
- **"Network timeout"**: SMS sending timed out
- **"Invalid session"**: Authentication session expired

### Best Practices

1. **Always check connection status** before sending SMS
2. **Validate phone numbers** include country code
3. **Handle errors gracefully** in your scripts
4. **Implement retry logic** for failed sends
5. **Monitor signal strength** for reliability
6. **Keep messages under 160 characters** for standard SMS

### Debugging

Enable debug logging in adapter configuration to see:
- API request/response details
- Authentication status
- Session management
- Error details with stack traces

## Rate Limiting

The adapter implements automatic rate limiting to prevent overwhelming the router:

- **Maximum concurrent requests:** 1
- **Minimum interval between SMS:** 2 seconds
- **Session renewal:** Automatic when needed
- **Connection testing:** Maximum once per minute

## Security Considerations

- **Credentials storage:** Router passwords are encrypted in ioBroker
- **Local communication:** All traffic stays on local network
- **Session management:** Automatic logout on adapter stop
- **SSL verification:** Disabled for local self-signed certificates
- **Access control:** Use ioBroker's built-in user management

## Performance Tips

1. **Cache signal status** instead of checking repeatedly
2. **Use adapter messaging** for better performance than state changes
3. **Implement queuing** for multiple SMS messages
4. **Monitor connection status** to avoid unnecessary API calls
5. **Set appropriate timeouts** based on your network conditions