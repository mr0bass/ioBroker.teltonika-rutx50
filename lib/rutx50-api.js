'use strict';

const axios = require('axios');
const https = require('https');

class RUTX50API {
    constructor(options) {
        this.host = options.host;
        this.username = options.username;
        this.password = options.password;
        this.timeout = options.timeout || 30000;
        this.logger = options.logger;
        
        this.authToken = null;
        
        // Create axios instance - accept self-signed certificates
        this.client = axios.create({
            timeout: this.timeout,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    /**
     * Get base URL - clean host and add https
     */
    getBaseUrl() {
        const cleanHost = this.host.replace(/^https?:\/\//, '');
        return `https://${cleanHost}`;
    }

    /**
     * Authenticate using exact Postman flow
     */
    async authenticate() {
        try {
            this.logger && this.logger.info('Authenticating with RUTX50...');
            
            const url = `${this.getBaseUrl()}/api/login`;
            const loginData = {
                username: this.username,
                password: this.password
            };
            
            this.logger && this.logger.debug(`POST ${url}`);
            this.logger && this.logger.debug('Login data:', loginData);
            
            const response = await this.client.post(url, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            this.logger && this.logger.debug('Login response:', response.data);
            
            if (response.data.success && response.data.data && response.data.data.token) {
                this.authToken = response.data.data.token;
                this.logger && this.logger.info('Authentication successful');
                return { success: true, token: this.authToken };
            } else {
                this.logger && this.logger.error('Authentication failed - no token received');
                return { success: false, error: 'No token received from login' };
            }
            
        } catch (error) {
            this.logger && this.logger.error(`Authentication failed: ${error.message}`);
            return { success: false, error: `Authentication failed: ${error.message}` };
        }
    }

    /**
     * Send SMS using exact Postman flow
     */
    async sendSMS(number, message) {
        // Authenticate if no token
        if (!this.authToken) {
            const authResult = await this.authenticate();
            if (!authResult.success) {
                return authResult;
            }
        }

        try {
            this.logger && this.logger.info(`Sending SMS to ${number}: ${message}`);
            
            const url = `${this.getBaseUrl()}/api/messages/actions/send`;
            const smsData = {
                data: {
                    number: number,
                    message: message,
                    modem: "2-1"
                }
            };
            
            this.logger && this.logger.debug(`POST ${url}`);
            this.logger && this.logger.debug('SMS data:', smsData);
            
            const response = await this.client.post(url, smsData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            this.logger && this.logger.debug('SMS response:', response.data);
            
            if (response.status === 200) {
                this.logger && this.logger.info('SMS sent successfully');
                return {
                    success: true,
                    messageId: `sms_${Date.now()}`,
                    recipient: number,
                    message: message,
                    timestamp: new Date().toISOString()
                };
            } else {
                return { success: false, error: `SMS API returned status ${response.status}` };
            }
            
        } catch (error) {
            this.logger && this.logger.error(`SMS sending failed: ${error.message}`);
            
            // Handle specific error cases
            if (error.response) {
                this.logger && this.logger.error('Error response:', error.response.data);
                
                if (error.response.status === 401) {
                    // Token expired - clear it for next attempt
                    this.authToken = null;
                    return { success: false, error: 'Authentication token expired' };
                }
                
                return { 
                    success: false, 
                    error: `SMS API error: ${error.response.status} - ${JSON.stringify(error.response.data)}` 
                };
            }
            
            return { success: false, error: `SMS sending failed: ${error.message}` };
        }
    }

    /**
     * Get device status (unauthenticated)
     */
    async getDeviceStatus() {
        try {
            const url = `${this.getBaseUrl()}/unauthorized/status`;
            
            const response = await this.client.get(url);
            
            if (response.status === 200 && response.data) {
                return {
                    success: true,
                    deviceInfo: response.data
                };
            } else {
                return { success: false, error: 'No device status received' };
            }
            
        } catch (error) {
            this.logger && this.logger.debug(`Device status failed: ${error.message}`);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    /**
     * Check if modem is present and available
     */
    async checkModemAvailability() {
        // First try to authenticate
        if (!this.authToken) {
            const authResult = await this.authenticate();
            if (!authResult.success) {
                return { success: false, error: 'Authentication failed', modemPresent: false };
            }
        }

        try {
            // Check mobile interface status
            const url = `${this.getBaseUrl()}/api/network/mobile`;
            
            const response = await this.client.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.status === 200 && response.data) {
                const data = response.data.data || response.data;
                
                // Check if modem configuration exists
                const modemConfig = data[this.modem] || data['2-1'] || data['1-1'];
                
                if (modemConfig) {
                    const isEnabled = modemConfig.enabled !== false;
                    const simPresent = modemConfig.sim_state !== 'absent' && modemConfig.sim_state !== 'error';
                    
                    return {
                        success: true,
                        modemPresent: true,
                        modemEnabled: isEnabled,
                        simPresent: simPresent,
                        simState: modemConfig.sim_state || 'unknown',
                        connectionState: modemConfig.connection_state || 'unknown',
                        signal: modemConfig.signal_level || 0,
                        operator: modemConfig.operator || 'Unknown'
                    };
                } else {
                    return {
                        success: true,
                        modemPresent: false,
                        error: `Modem ${this.modem} not found in configuration`
                    };
                }
            } else {
                return { success: false, error: 'No mobile configuration received', modemPresent: false };
            }
            
        } catch (error) {
            this.logger && this.logger.debug(`Modem availability check failed: ${error.message}`);
            return { 
                success: false, 
                error: error.message,
                modemPresent: false
            };
        }
    }

    /**
     * Test connection with comprehensive checks
     */
    async testConnection() {
        // First check device status (no auth needed)
        const deviceStatus = await this.getDeviceStatus();
        
        // Then try authentication
        const authResult = await this.authenticate();
        
        if (authResult.success) {
            // Check modem availability
            const modemCheck = await this.checkModemAvailability();
            
            return {
                success: true,
                message: 'Connected to RUTX50',
                authenticated: true,
                deviceStatus: deviceStatus.success ? deviceStatus.deviceInfo : null,
                modemStatus: modemCheck
            };
        } else {
            return {
                success: false,
                error: authResult.error,
                authenticated: false,
                deviceStatus: deviceStatus.success ? deviceStatus.deviceInfo : null
            };
        }
    }

    /**
     * Get signal status from router using proper API endpoint
     */
    async getSignalStatus() {
        // Authenticate if no token
        if (!this.authToken) {
            const authResult = await this.authenticate();
            if (!authResult.success) {
                return { success: false, error: authResult.error };
            }
        }

        try {
            // Use the mobile interface status endpoint
            const url = `${this.getBaseUrl()}/api/network/mobile`;
            
            const response = await this.client.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.status === 200 && response.data) {
                const data = response.data.data || response.data;
                const modemData = data[this.modem] || data['2-1'] || data['1-1'];
                
                if (modemData) {
                    return {
                        success: true,
                        signal: modemData.signal_level || 0,
                        operator: modemData.operator || 'Unknown',
                        connection: modemData.connection_state || 'Unknown',
                        simState: modemData.sim_state || 'Unknown',
                        networkType: modemData.network_type || 'Unknown',
                        modem: this.modem
                    };
                } else {
                    return { 
                        success: false, 
                        error: `Modem ${this.modem} not found`,
                        signal: 0,
                        operator: 'Unknown',
                        connection: 'Unknown'
                    };
                }
            } else {
                return { success: false, error: 'No mobile data received' };
            }
            
        } catch (error) {
            this.logger && this.logger.debug(`Signal status failed: ${error.message}`);
            return { 
                success: false, 
                error: error.message,
                signal: 0,
                operator: 'Unknown',
                connection: 'Unknown'
            };
        }
    }

    /**
     * Clear token
     */
    logout() {
        this.authToken = null;
        this.logger && this.logger.debug('Token cleared');
    }
}

module.exports = RUTX50API;