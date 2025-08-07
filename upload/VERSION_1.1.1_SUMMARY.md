# Version 1.1.1 Release Summary

## Package Contents Updated for v1.1.1

This upload folder now contains the complete **Teltonika RUTX50 SMS Adapter v1.1.1** with all critical Blockly fixes applied.

## Key Fixes in v1.1.1

### ✅ Blockly Functionality Restored
- **Removed conflicting files**: Eliminated duplicate `blockly_sendto.js` and `custom.html` files that were preventing Blockly blocks from working
- **Single clean implementation**: Only `admin/blockly.js` remains with professional ioBroker standards
- **Proper block registration**: SendTo blocks now function correctly in Blockly editor

### ✅ API Constructor Fixed
- **Missing modem parameter**: Added `this.modem = options.modem || '2-1'` to RUTX50API constructor
- **Configuration integration**: API client now properly receives and uses modem configuration
- **Prevents undefined errors**: Resolves runtime errors when accessing modem settings

### ✅ Dynamic Modem Configuration
- **Removed hardcoded values**: SMS sending now uses `this.modem` instead of hardcoded "2-1"
- **Configurable via admin**: Users can set modem parameter in adapter configuration
- **Fallback support**: Defaults to "2-1" if not specified

### ✅ Enhanced Debugging
- **SendTo message logging**: Added debugging to track Blockly communication
- **Error handling**: Improved error reporting for troubleshooting
- **Test server**: Created validation environment for Blockly functionality

## Core Files Updated

- **main.js**: Enhanced onMessage handler with debugging
- **lib/rutx50-api.js**: Fixed constructor and SMS sending method
- **admin/blockly.js**: Cleaned single Blockly implementation
- **io-package.json**: Version bumped to 1.1.1 with changelog
- **package.json**: Version updated to 1.1.1

## Files Removed from Package

- ❌ `admin/blockly_sendto.js` (conflicting implementation)
- ❌ `admin/custom.html` (duplicate functionality)
- ❌ `lib/blockly.js` (wrong location)
- ❌ Test files and development artifacts

## Installation Ready

This package is now ready for:
- ✅ **ioBroker installation** via admin interface
- ✅ **Blockly block usage** in visual scripts
- ✅ **SMS sending** via configured RUTX50 router
- ✅ **Dynamic modem configuration** via admin settings

## Quality Assurance

- **No conflicting files**: Clean file structure with single implementations
- **No test artifacts**: Production-ready package only
- **Proper versioning**: Consistent v1.1.1 across all configuration files
- **Complete functionality**: All adapter features working and tested

The adapter is now ready for production use with fully functional Blockly integration.