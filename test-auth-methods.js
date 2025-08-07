#!/usr/bin/env node
/**
 * Test script to try different authentication methods with RUTX50 router
 * This helps identify which authentication method works with your specific firmware
 */

const RUTX50API = require('./lib/rutx50-api.js');

// Configuration - UPDATE THESE VALUES
const config = {
    host: '192.168.1.1',      // Your router IP
    username: 'admin',         // Your router username  
    password: 'admin01',       // Your router password
    timeout: 10000,           // 10 second timeout
    protocol: 'auto'          // Try both HTTPS and HTTP
};

// Simple logger that outputs to console
const logger = {
    debug: (msg) => console.log(`[DEBUG] ${msg}`),
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.log(`[ERROR] ${msg}`)
};

async function testAuthentication() {
    console.log('=== RUTX50 v1.0.6 Web Authentication Test ===');
    console.log(`Testing connection to: ${config.host}`);
    console.log(`Username: ${config.username}`);
    console.log(`Protocol: ${config.protocol}`);
    console.log('');

    const api = new RUTX50API({
        ...config,
        logger: logger
    });

    try {
        console.log('Starting authentication test...');
        const result = await api.authenticate();
        
        if (result.success) {
            console.log('\n✅ AUTHENTICATION SUCCESSFUL!');
            console.log(`Token: ${result.token ? result.token.substring(0, 20) + '...' : 'N/A'}`);
            console.log(`Protocol: ${result.protocol}`);
            
            // Test SMS sending capability
            console.log('\nTesting SMS capability...');
            try {
                const smsResult = await api.sendSMS('+1234567890', 'Test message from ioBroker adapter');
                if (smsResult.success) {
                    console.log('✅ SMS test successful!');
                } else {
                    console.log(`❌ SMS test failed: ${smsResult.error}`);
                }
            } catch (smsError) {
                console.log(`❌ SMS test error: ${smsError.message}`);
            }
            
        } else {
            console.log('\n❌ AUTHENTICATION FAILED');
            console.log(`Error: ${result.error}`);
            console.log('\nTroubleshooting tips:');
            console.log('1. Verify router IP address and credentials');
            console.log('2. Check if router web interface is accessible');
            console.log('3. Ensure router firmware supports REST API');
            console.log('4. Try accessing router web interface manually first');
        }
        
    } catch (error) {
        console.log('\n💥 AUTHENTICATION ERROR');
        console.log(`Error: ${error.message}`);
        console.log('\nThis usually means:');
        console.log('- Router is not reachable at this IP address');
        console.log('- Network connectivity issues');
        console.log('- Router is not responding');
    }
}

// Run the test
testAuthentication().then(() => {
    console.log('\n=== Test Complete ===');
    process.exit(0);
}).catch((error) => {
    console.error('\n💥 UNEXPECTED ERROR:', error);
    process.exit(1);
});