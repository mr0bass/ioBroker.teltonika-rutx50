// Blockly sendTo blocks for teltonika-rutx50 adapter
'use strict';

if (typeof goog !== 'undefined') {
    goog.provide('Blockly.JavaScript.Sendto');
    goog.require('Blockly.JavaScript');
}

// sendTo block for RUTX50 SMS
Blockly.Words['teltonika_rutx50_send_sms'] = {
    'en': 'send SMS via RUTX50 to %1 message %2',
    'de': 'SMS über RUTX50 senden an %1 Nachricht %2'
};

Blockly.Blocks['teltonika_rutx50_send_sms'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('send SMS via RUTX50');
        this.appendValueInput('PHONE')
            .setCheck('String')
            .appendField('to number');
        this.appendValueInput('MESSAGE') 
            .setCheck('String')
            .appendField('message');
        this.appendStatementInput('CALLBACK')
            .appendField('then');
            
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6B35');
        this.setTooltip('Send SMS message via Teltonika RUTX50 router');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['teltonika_rutx50_send_sms'] = function(block) {
    var phone = Blockly.JavaScript.valueToCode(block, 'PHONE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var callback = Blockly.JavaScript.statementToCode(block, 'CALLBACK');
    
    var code = 'sendTo("teltonika-rutx50.0", "sendSMS", {\n' +
               '    recipient: ' + phone + ',\n' +
               '    message: ' + message + '\n' +
               '}, function(result) {\n' +
               '    console.log("SMS Result:", result);\n' +
               callback +
               '});\n';
    return code;
};