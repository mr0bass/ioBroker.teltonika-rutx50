'use strict';

const utils = require('@iobroker/adapter-core');
const axios = require('axios');
const https = require('https');
const RUTX50API = require('./lib/rutx50-api');

class TeltonikaRutx50 extends utils.Adapter {
    constructor(options) {
        super({
            ...options,
            name: 'teltonika-rutx50',
        });

        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.on('message', this.onMessage.bind(this));

        this.rutx50Api = null;
        this.connectionStatus = false;
        this.lastMessageId = 0;
        this.updateTimer = null;
    }

    async onReady() {
        this.log.info('Teltonika RUTX50 adapter starting...');

        // Check configuration
        if (!this.config.routerIp || !this.config.username || !this.config.password) {
            this.log.error('Router IP, username and password must be configured in adapter settings');
            return;
        }

        // Initialize API client
        this.rutx50Api = new RUTX50API({
            host: this.config.routerIp,
            username: this.config.username,
            password: this.config.password,
            timeout: this.config.timeout || 30000,
            protocol: this.config.protocol || 'auto',
            modem: this.config.modem || '2-1',
            logger: this.log
        });

        // Create state objects
        await this.createStates();

        // Test connection
        await this.testConnection();

        // Subscribe to control states
        this.subscribeStates('sms.send');
        this.subscribeStates('sms.message');
        this.subscribeStates('sms.recipient');

        // Start periodic status updates
        this.startStatusUpdates();

        this.log.info('Teltonika RUTX50 adapter started successfully');
    }

    async createStates() {
        // Connection status
        await this.setObjectNotExistsAsync('info.connection', {
            type: 'state',
            common: {
                name: 'Router connection status',
                type: 'boolean',
                role: 'indicator.connected',
                read: true,
                write: false,
                def: false
            },
            native: {}
        });

        // SMS controls
        await this.setObjectNotExistsAsync('sms', {
            type: 'channel',
            common: {
                name: 'SMS Functions'
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.recipient', {
            type: 'state',
            common: {
                name: 'SMS recipient phone number',
                type: 'string',
                role: 'text.phone',
                read: true,
                write: true,
                def: ''
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.message', {
            type: 'state',
            common: {
                name: 'SMS message text',
                type: 'string',
                role: 'text',
                read: true,
                write: true,
                def: ''
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.send', {
            type: 'state',
            common: {
                name: 'Send SMS trigger',
                type: 'boolean',
                role: 'button',
                read: true,
                write: true,
                def: false
            },
            native: {}
        });

        // SMS status
        await this.setObjectNotExistsAsync('sms.lastMessage', {
            type: 'state',
            common: {
                name: 'Last sent SMS message',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
                def: ''
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.lastRecipient', {
            type: 'state',
            common: {
                name: 'Last SMS recipient',
                type: 'string',
                role: 'text.phone',
                read: true,
                write: false,
                def: ''
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.lastSendResult', {
            type: 'state',
            common: {
                name: 'Last SMS send result',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
                def: false
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.lastSendTime', {
            type: 'state',
            common: {
                name: 'Last SMS send timestamp',
                type: 'string',
                role: 'date',
                read: true,
                write: false,
                def: ''
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('sms.lastError', {
            type: 'state',
            common: {
                name: 'Last SMS error message',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
                def: ''
            },
            native: {}
        });

        // Signal status
        await this.setObjectNotExistsAsync('signal', {
            type: 'channel',
            common: {
                name: 'Mobile Signal Status'
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('signal.strength', {
            type: 'state',
            common: {
                name: 'Signal strength',
                type: 'number',
                role: 'value',
                unit: 'dBm',
                read: true,
                write: false,
                def: 0
            },
            native: {}
        });

        await this.setObjectNotExistsAsync('signal.operator', {
            type: 'state',
            common: {
                name: 'Mobile operator',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
                def: ''
            },
            native: {}
        });
    }

    async testConnection() {
        try {
            this.log.debug('Testing connection to RUTX50...');
            const result = await this.rutx50Api.testConnection();
            
            this.connectionStatus = result.success;
            await this.setStateAsync('info.connection', this.connectionStatus, true);
            
            if (result.success) {
                this.log.info(`Connected to RUTX50 at ${this.config.routerIp}`);
                // Update signal information
                await this.updateSignalStatus();
            } else {
                this.log.error(`Connection failed: ${result.error}`);
            }
        } catch (error) {
            this.log.error(`Connection test error: ${error.message}`);
            this.connectionStatus = false;
            await this.setStateAsync('info.connection', false, true);
        }
    }

    async updateSignalStatus() {
        try {
            const signalInfo = await this.rutx50Api.getSignalStatus();
            if (signalInfo) {
                await this.setStateAsync('signal.strength', signalInfo.strength || 0, true);
                await this.setStateAsync('signal.operator', signalInfo.operator || '', true);
            }
        } catch (error) {
            this.log.warn(`Failed to update signal status: ${error.message}`);
        }
    }

    async onStateChange(id, state) {
        if (!state || state.ack) return;

        const stateName = id.split('.').pop();
        
        if (stateName === 'send' && state.val === true) {
            await this.sendSMS();
            // Reset the trigger
            await this.setStateAsync('sms.send', false, true);
        }
    }

    async sendSMS() {
        try {
            // Get message and recipient
            const recipientState = await this.getStateAsync('sms.recipient');
            const messageState = await this.getStateAsync('sms.message');

            if (!recipientState || !messageState) {
                throw new Error('Recipient and message must be set');
            }

            const recipient = recipientState.val;
            const message = messageState.val;

            if (!recipient || !message) {
                throw new Error('Recipient and message cannot be empty');
            }

            this.log.info(`Sending SMS to ${recipient}: ${message}`);

            // Send SMS via API
            const result = await this.rutx50Api.sendSMS(recipient, message);
            
            // Update status states
            await this.setStateAsync('sms.lastMessage', message, true);
            await this.setStateAsync('sms.lastRecipient', recipient, true);
            await this.setStateAsync('sms.lastSendResult', result.success, true);
            await this.setStateAsync('sms.lastSendTime', new Date().toISOString(), true);
            
            if (result.success) {
                await this.setStateAsync('sms.lastError', '', true);
                this.log.info(`SMS sent successfully to ${recipient}`);
            } else {
                await this.setStateAsync('sms.lastError', result.error || 'Unknown error', true);
                this.log.error(`SMS send failed: ${result.error}`);
            }

        } catch (error) {
            this.log.error(`SMS send error: ${error.message}`);
            await this.setStateAsync('sms.lastSendResult', false, true);
            await this.setStateAsync('sms.lastError', error.message, true);
            await this.setStateAsync('sms.lastSendTime', new Date().toISOString(), true);
        }
    }

    startStatusUpdates() {
        // Update connection and signal status every 60 seconds
        this.updateTimer = setInterval(async () => {
            await this.testConnection();
        }, 60000);
    }

    async onMessage(obj) {
        this.log.debug('Received message:', JSON.stringify(obj, null, 2));
        
        if (typeof obj === 'object' && obj.message) {
            if (obj.command === 'sendSMS') {
                // Handle Blockly SMS send command
                const { recipient, message } = obj.message;
                
                if (!recipient || !message) {
                    this.sendTo(obj.from, obj.command, { 
                        success: false, 
                        error: 'Recipient and message are required' 
                    }, obj.callback);
                    return;
                }

                try {
                    const result = await this.rutx50Api.sendSMS(recipient, message);
                    
                    // Update states
                    await this.setStateAsync('sms.lastMessage', message, true);
                    await this.setStateAsync('sms.lastRecipient', recipient, true);
                    await this.setStateAsync('sms.lastSendResult', result.success, true);
                    await this.setStateAsync('sms.lastSendTime', new Date().toISOString(), true);
                    
                    if (!result.success) {
                        await this.setStateAsync('sms.lastError', result.error || 'Unknown error', true);
                    } else {
                        await this.setStateAsync('sms.lastError', '', true);
                    }

                    this.sendTo(obj.from, obj.command, result, obj.callback);
                } catch (error) {
                    this.log.error(`Blockly SMS send error: ${error.message}`);
                    this.sendTo(obj.from, obj.command, { 
                        success: false, 
                        error: error.message 
                    }, obj.callback);
                }
            } else if (obj.command === 'testConnection') {
                // Test connection command
                const result = await this.testConnection();
                this.sendTo(obj.from, obj.command, { 
                    success: this.connectionStatus 
                }, obj.callback);
            }
        }
    }

    onUnload(callback) {
        try {
            if (this.updateTimer) {
                clearInterval(this.updateTimer);
                this.updateTimer = null;
            }
            this.log.info('Teltonika RUTX50 adapter stopped');
            callback();
        } catch (e) {
            callback();
        }
    }
}

if (require.main !== module) {
    module.exports = (options) => new TeltonikaRutx50(options);
} else {
    new TeltonikaRutx50();
}
