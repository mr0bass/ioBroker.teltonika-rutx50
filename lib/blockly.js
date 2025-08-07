'use strict';

/**
 * Blockly definitions for Teltonika RUTX50 SMS adapter
 * This file defines custom Blockly blocks for SMS functionality
 */

// Define the blocks for Blockly
const blocks = {
    // Send SMS block
    'teltonika_rutx50_send_sms': {
        "type": "teltonika_rutx50_send_sms",
        "message0": "%1",
        "args0": [
            {
                "type": "field_label_serializable",
                "name": "NAME",
                "text": "Send SMS via RUTX50"
            }
        ],
        "message1": "to %1",
        "args1": [
            {
                "type": "input_value",
                "name": "RECIPIENT",
                "check": "String"
            }
        ],
        "message2": "message %1",
        "args2": [
            {
                "type": "input_value",
                "name": "MESSAGE", 
                "check": "String"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Send SMS message via Teltonika RUTX50 router",
        "helpUrl": ""
    },

    // Get SMS status block
    'teltonika_rutx50_sms_status': {
        "type": "teltonika_rutx50_sms_status",
        "message0": "SMS send status %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "STATUS_TYPE",
                "options": [
                    ["was successful", "SUCCESS"],
                    ["last message", "LAST_MESSAGE"],
                    ["last recipient", "LAST_RECIPIENT"],
                    ["last error", "LAST_ERROR"],
                    ["send time", "SEND_TIME"]
                ]
            }
        ],
        "output": null,
        "colour": 230,
        "tooltip": "Get SMS status information",
        "helpUrl": ""
    },

    // Get signal status block
    'teltonika_rutx50_signal_status': {
        "type": "teltonika_rutx50_signal_status",
        "message0": "Signal %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SIGNAL_TYPE",
                "options": [
                    ["strength", "STRENGTH"],
                    ["operator", "OPERATOR"]
                ]
            }
        ],
        "output": null,
        "colour": 120,
        "tooltip": "Get mobile signal information",
        "helpUrl": ""
    },

    // Connection status block
    'teltonika_rutx50_connection': {
        "type": "teltonika_rutx50_connection",
        "message0": "RUTX50 is connected",
        "output": "Boolean",
        "colour": 120,
        "tooltip": "Check if RUTX50 router is connected",
        "helpUrl": ""
    }
};

// JavaScript code generators for each block
const javascript = {
    'teltonika_rutx50_send_sms': function(block) {
        const recipient = Blockly.JavaScript.valueToCode(block, 'RECIPIENT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        
        const code = `
// Send SMS via Teltonika RUTX50
(function() {
    const recipient = ${recipient};
    const message = ${message};
    
    if (!recipient || !message) {
        console.warn('RUTX50: Recipient and message are required for SMS');
        return;
    }
    
    // Send command to adapter
    sendTo('teltonika-rutx50', 'sendSMS', {
        recipient: recipient,
        message: message
    }, function(result) {
        if (result && result.success) {
            console.log('RUTX50: SMS sent successfully to ' + recipient);
        } else {
            console.error('RUTX50: SMS send failed: ' + (result ? result.error : 'Unknown error'));
        }
    });
})();
`;
        return code;
    },

    'teltonika_rutx50_sms_status': function(block) {
        const statusType = block.getFieldValue('STATUS_TYPE');
        let stateId;
        
        switch(statusType) {
            case 'SUCCESS':
                stateId = 'sms.lastSendResult';
                break;
            case 'LAST_MESSAGE':
                stateId = 'sms.lastMessage';
                break;
            case 'LAST_RECIPIENT':
                stateId = 'sms.lastRecipient';
                break;
            case 'LAST_ERROR':
                stateId = 'sms.lastError';
                break;
            case 'SEND_TIME':
                stateId = 'sms.lastSendTime';
                break;
            default:
                stateId = 'sms.lastSendResult';
        }
        
        const code = `getState('teltonika-rutx50.0.${stateId}').val`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    },

    'teltonika_rutx50_signal_status': function(block) {
        const signalType = block.getFieldValue('SIGNAL_TYPE');
        const stateId = signalType === 'STRENGTH' ? 'signal.strength' : 'signal.operator';
        
        const code = `getState('teltonika-rutx50.0.${stateId}').val`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    },

    'teltonika_rutx50_connection': function(block) {
        const code = `getState('teltonika-rutx50.0.info.connection').val`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
};

// Export for ioBroker
const getBlocks = function() {
    return {
        blocks: blocks,
        javascript: javascript
    };
};

// Category definition for Blockly toolbox
const getCategory = function() {
    return {
        "name": "RUTX50 SMS",
        "colour": "230",
        "blocks": [
            {
                "type": "teltonika_rutx50_send_sms"
            },
            {
                "type": "teltonika_rutx50_sms_status"
            },
            {
                "type": "teltonika_rutx50_signal_status"  
            },
            {
                "type": "teltonika_rutx50_connection"
            }
        ]
    };
};

// Register blocks with ioBroker
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getBlocks: getBlocks,
        getCategory: getCategory,
        blocks: blocks,
        javascript: javascript
    };
}

// Register with global Blockly if available (for browser environment)
if (typeof window !== 'undefined' && window.Blockly) {
    // Define blocks
    Object.keys(blocks).forEach(blockType => {
        window.Blockly.Blocks[blockType] = {
            init: function() {
                this.jsonInit(blocks[blockType]);
            }
        };
    });
    
    // Define JavaScript generators
    Object.keys(javascript).forEach(blockType => {
        window.Blockly.JavaScript[blockType] = javascript[blockType];
    });
}
