#!/usr/bin/env node
/**
 * RUTX50 Connection Diagnostic Tool
 * This script tests the connection to your RUTX50 router and SMS functionality
 * Updated to use the real RUTX50 Vuci API
 */

const RUTX50API = require('./lib/rutx50-api');

async function diagnoseConnection() {
    console.log('🔍 RUTX50 Connection Diagnostic Tool (Updated for Vuci API)');
    console.log('========================================================\n');

    // Configuration - you can modify these values or use environment variables
    const config = {
        host: process.env.RUTX50_HOST || '192.168.1.1',
        username: process.env.RUTX50_USERNAME || 'admin',
        password: process.env.RUTX50_PASSWORD || 'admin01',
        timeout: 30000,
        protocol: 'auto'
    };

    console.log('📋 Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Username: ${config.username}`);
    console.log(`   Password: ${'*'.repeat(config.password.length)}`);
    console.log(`   Timeout: ${config.timeout}ms`);
    console.log(`   Protocol: ${config.protocol}\n`);

    const api = new RUTX50API({
        ...config,
        logger: {
            debug: (msg) => console.log(`🐛 DEBUG: ${msg}`),
            info: (msg) => console.log(`ℹ️  INFO: ${msg}`),
            warn: (msg) => console.log(`⚠️  WARN: ${msg}`),
            error: (msg) => console.log(`❌ ERROR: ${msg}`)
        }
    });

    console.log('🔌 Testing connection and authentication...');
    const connectionResult = await api.testConnection();
    
    if (connectionResult.success) {
        console.log('✅ Connection successful!\n');
        
        console.log('📊 Connection Details:');
        console.log(`   Protocol: ${connectionResult.details.protocol}`);
        console.log(`   Authenticated: ${connectionResult.details.authenticated}`);
        console.log(`   Token Expiry: ${new Date(connectionResult.details.tokenExpiry).toLocaleString()}\n`);
        
        console.log('📶 Signal Status:');
        const signalStatus = connectionResult.details.signalStatus;
        if (signalStatus) {
            console.log(`   Signal Strength: ${signalStatus.strength} dBm`);
            console.log(`   Operator: ${signalStatus.operator}`);
            console.log(`   Network Type: ${signalStatus.networkType}`);
            console.log(`   Connected: ${signalStatus.connected ? 'Yes' : 'No'}`);
            console.log(`   SIM Status: ${signalStatus.simStatus}`);
            if (signalStatus.signalQuality !== null) {
                console.log(`   Signal Quality: ${signalStatus.signalQuality}`);
            }
            console.log('');
        }

        console.log('💬 Testing SMS sending capability...');
        console.log('   Note: This will attempt to send a real SMS if configured correctly');
        console.log('   Make sure you want to send a test SMS before proceeding!\n');
        
        // Ask for confirmation before sending SMS
        if (process.env.NODE_ENV !== 'test' && process.argv.includes('--send-sms')) {
            const testPhoneNumber = process.env.TEST_PHONE_NUMBER || '+1234567890';
            console.log(`   Sending test SMS to: ${testPhoneNumber}`);
            
            try {
                const smsResult = await api.sendSMS(testPhoneNumber, 'Test message from ioBroker RUTX50 adapter - ' + new Date().toLocaleString());
                if (smsResult.success) {
                    console.log('✅ SMS sent successfully!');
                    console.log(`   Message ID: ${smsResult.messageId}`);
                    console.log(`   SMS segments used: ${smsResult.smsUsed}`);
                } else {
                    console.log('❌ SMS sending failed:', smsResult.error);
                }
            } catch (error) {
                console.log('❌ SMS test error:', error.message);
            }
        } else {
            console.log('   Skipping actual SMS send (use --send-sms flag to enable)');
        }

        // Test SMS inbox functionality
        console.log('\n📨 Testing SMS inbox access...');
        try {
            const inbox = await api.getSMSInbox();
            console.log(`✅ Inbox access successful - Found ${inbox.length} messages`);
        } catch (error) {
            console.log('❌ Inbox access failed:', error.message);
        }

    } else {
        console.log('❌ Connection failed!');
        console.log(`   Error: ${connectionResult.error}\n`);
        
        if (connectionResult.details) {
            console.log('📊 Connection Details:');
            console.log(`   Reachable: ${connectionResult.details.reachable}`);
            console.log(`   Authenticated: ${connectionResult.details.authenticated}`);
            console.log(`   Protocol: ${connectionResult.details.protocol || 'None detected'}\n`);
        }
        
        console.log('🔧 Troubleshooting suggestions:');
        console.log('   1. Check if the router IP address is correct');
        console.log('   2. Verify username and password are correct');
        console.log('   3. Ensure the router web interface is accessible in browser');
        console.log('   4. Check router firmware version (requires RUT955_R_00.07.06 or newer)');
        console.log('   5. Verify RUTX50 has Vuci web interface enabled');
        console.log('   6. Try both HTTP and HTTPS protocols manually\n');
    }

    // Clean up
    api.logout();

    console.log('🏁 Diagnostic complete!');
    console.log('\n💡 Usage tips:');
    console.log('   - Set environment variables: RUTX50_HOST, RUTX50_USERNAME, RUTX50_PASSWORD');
    console.log('   - Use --send-sms flag to actually send a test SMS');
    console.log('   - Set TEST_PHONE_NUMBER environment variable for SMS testing');
    console.log('   - Example: RUTX50_HOST=192.168.1.1 node diagnose-rutx50.js --send-sms');
}

// Handle command line execution
if (require.main === module) {
    diagnoseConnection().catch(error => {
        console.error('❌ Diagnostic failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    });
}

module.exports = { diagnoseConnection };