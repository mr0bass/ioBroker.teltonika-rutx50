#!/usr/bin/env node
/**
 * Package verification script for Teltonika RUTX50 SMS Adapter
 * Checks if all required files are present and properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Teltonika RUTX50 Adapter Package...\n');

// Required files for ioBroker adapter
const requiredFiles = [
    'main.js',
    'io-package.json', 
    'package.json',
    'README.md',
    'LICENSE',
    'admin/index.html',
    'admin/index.js', 
    'admin/words.js',
    'admin/teltonika-rutx50.png',
    'lib/rutx50-api.js',
    'lib/blockly.js'
];

// Optional but recommended files
const optionalFiles = [
    'CHANGELOG.md',
    'diagnose-rutx50.js',
    'test-auth-methods.js',
    'docs/API.md',
    'docs/INSTALLATION.md',
    'RUTX50_7.16.3_v1.8.3.json'
];

let allGood = true;

// Check required files
console.log('✅ Checking required files:');
for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`  ✓ ${file} (${Math.round(stats.size / 1024)}KB)`);
    } else {
        console.log(`  ❌ ${file} - MISSING!`);
        allGood = false;
    }
}

console.log('\n📋 Checking optional files:');
for (const file of optionalFiles) {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`  ✓ ${file} (${Math.round(stats.size / 1024)}KB)`);
    } else {
        console.log(`  ⚠️  ${file} - Optional, but recommended`);
    }
}

// Verify JSON files
console.log('\n🔧 Verifying configuration files:');
try {
    const ioPackage = JSON.parse(fs.readFileSync('io-package.json', 'utf8'));
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log(`  ✓ io-package.json - Version: ${ioPackage.common.version}`);
    console.log(`  ✓ package.json - Version: ${packageJson.version}`);
    
    if (ioPackage.common.version !== packageJson.version) {
        console.log('  ⚠️  Version mismatch between io-package.json and package.json');
    }
    
    // Check required properties
    const requiredProps = ['name', 'version', 'title', 'desc'];
    for (const prop of requiredProps) {
        if (ioPackage.common[prop]) {
            console.log(`  ✓ ${prop}: ${typeof ioPackage.common[prop] === 'object' ? 'Multi-language' : ioPackage.common[prop]}`);
        } else {
            console.log(`  ❌ Missing ${prop} in io-package.json`);
            allGood = false;
        }
    }
    
} catch (error) {
    console.log(`  ❌ Error reading JSON files: ${error.message}`);
    allGood = false;
}

// Check main.js
console.log('\n⚙️ Verifying main adapter file:');
try {
    const mainJs = fs.readFileSync('main.js', 'utf8');
    const checks = [
        { name: 'Adapter class definition', pattern: /class.*extends.*Adapter/ },
        { name: 'RUTX50API import', pattern: /require.*rutx50-api/ },
        { name: 'SMS sending method', pattern: /sendSMS|send.*sms/i },
        { name: 'Connection handling', pattern: /testConnection|authenticate/ }
    ];
    
    for (const check of checks) {
        if (check.pattern.test(mainJs)) {
            console.log(`  ✓ ${check.name}`);
        } else {
            console.log(`  ❌ ${check.name} - Not found!`);
            allGood = false;
        }
    }
} catch (error) {
    console.log(`  ❌ Error reading main.js: ${error.message}`);
    allGood = false;
}

// Check API library
console.log('\n📡 Verifying API library:');
try {
    const apiLib = fs.readFileSync('lib/rutx50-api.js', 'utf8');
    const apiChecks = [
        { name: 'RUTX50API class', pattern: /class RUTX50API/ },
        { name: 'Authentication method', pattern: /authenticate.*{/ },
        { name: 'SMS sending method', pattern: /sendSMS.*{/ },
        { name: 'Multi-endpoint support', pattern: /authEndpoints|\/api\/login|\/cgi-bin\/luci/ },
        { name: 'Error handling', pattern: /try.*catch|\.catch\(/ }
    ];
    
    for (const check of apiChecks) {
        if (check.pattern.test(apiLib)) {
            console.log(`  ✓ ${check.name}`);
        } else {
            console.log(`  ❌ ${check.name} - Not found!`);
            allGood = false;
        }
    }
} catch (error) {
    console.log(`  ❌ Error reading lib/rutx50-api.js: ${error.message}`);
    allGood = false;
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allGood) {
    console.log('🎉 Package verification PASSED!');
    console.log('✅ All required files present and properly configured');
    console.log('📦 Ready for ioBroker installation');
} else {
    console.log('❌ Package verification FAILED!');
    console.log('🔧 Please fix the issues above before deployment');
}

console.log('\n📋 Package Summary:');
console.log(`   Adapter: teltonika-rutx50`);
console.log(`   Version: ${JSON.parse(fs.readFileSync('io-package.json')).common.version}`);
console.log(`   Description: SMS sending via Teltonika RUTX50 router`);
console.log(`   Features: Multi-endpoint auth, Blockly support, Web interface`);