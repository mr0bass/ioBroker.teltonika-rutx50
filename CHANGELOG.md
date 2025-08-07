# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [1.1.2] - 2025-08-07

### Fixed
- **Blockly SendTo Communication**: Fixed JavaScript generation format for proper sendTo parameter order
- **Enhanced Debugging**: Added comprehensive logging to onMessage handler to track Blockly communication
- **Callback Function**: Corrected callback function format in Blockly JavaScript generation
- **Message Handling**: Improved message validation and error responses for Blockly blocks

### Technical Changes
- Fixed sendTo call format to use proper parameter order: target, command, message, callback
- Enhanced onMessage handler with detailed logging for debugging Blockly communication
- Improved callback function generation with proper error handling
- Added comprehensive message validation and response handling

## [1.1.1] - 2025-08-07

### Fixed
- **Blockly Functionality**: Removed conflicting Blockly files (blockly_sendto.js, custom.html) that were preventing blocks from working
- **Missing Modem Parameter**: Added missing `this.modem` parameter in RUTX50API constructor
- **Hardcoded Values**: SMS sending now uses configured modem parameter instead of hardcoded "2-1"
- **File Structure**: Cleaned up duplicate and conflicting Blockly implementations
- **Communication**: Improved Blockly sendTo communication and error handling

### Technical Changes
- Removed admin/blockly_sendto.js and admin/custom.html to eliminate conflicts
- Added `this.modem = options.modem || '2-1'` to RUTX50API constructor
- Updated SMS sending to use `this.modem` instead of hardcoded modem value
- Enhanced debugging for sendTo message handling
- Created test server to validate Blockly functionality

## [1.1.0] - 2025-08-07

### Added
- **Proper RUTX50 API Endpoints**: Added comprehensive modem detection and status monitoring using official Teltonika API
- **Device Status Check**: `/unauthorized/status` endpoint for device info without authentication
- **Modem Availability Check**: `/api/network/mobile` endpoint to detect modem presence and configuration
- **Enhanced Signal Status**: Proper signal monitoring with modem-specific data (signal_level, operator, connection_state, sim_state)
- **Comprehensive Connection Testing**: Multi-step validation including device status, authentication, and modem availability
- **SIM Card Detection**: Checks SIM card presence and state for proper SMS functionality
- **Network Type Monitoring**: Reports connection type, band information, and network status
- **Fallback Modem Detection**: Automatically checks configured modem (2-1) and fallback options (1-1)

### Technical Details
- Enhanced RUTX50API class with proper endpoint integration
- Added getDeviceStatus(), checkModemAvailability(), and enhanced getSignalStatus() methods
- Comprehensive error handling for different modem configurations
- Real-time modem and SIM card status monitoring

## [1.0.0] - 2025-08-07

### Added
- Initial release of Teltonika RUTX50 SMS Adapter
- SMS sending functionality via Teltonika RUTX50 router's local REST API
- Admin configuration interface with connection testing
- Session-based authentication with automatic renewal
- Comprehensive error handling and status tracking
- Real-time connection and signal status monitoring
- Blockly integration for visual scripting with custom SMS blocks
- Support for phone number validation and message length checking
- State objects for programmatic SMS control and status monitoring
- Multi-language support (English and German) for admin interface
- SSL certificate handling for local router communication
- Configurable timeouts and update intervals
- Signal strength and network operator monitoring
- Message history tracking with timestamps
- Direct adapter messaging API for advanced integrations

### Features
- **SMS Control States**: recipient, message, send trigger
- **SMS Status States**: last message, recipient, send result, timestamp, error
- **Connection Monitoring**: router connection status, signal strength, operator info
- **Blockly Blocks**: 
  - Send SMS block with phone number and message inputs
  - SMS status check blocks (success, message, recipient, error, timestamp)  
  - Signal status blocks (strength, operator)
  - Connection status block
- **Admin Interface**: 
  - Router connection configuration (IP, credentials, timeouts)
  - Advanced settings (update intervals)
  - Connection test functionality with real-time feedback
  - Responsive design with professional styling
- **Security**: 
  - Secure authentication with router admin interface
  - Session management with automatic renewal
  - Local-only communication (no external dependencies)

### Technical Details
- Built with @iobroker/adapter-core v3.0.4+
- Uses axios for HTTP communication
- Node.js 16+ compatibility
- Supports HTTPS with self-signed certificates
- RESTful API integration with RUTX50 firmware
- Configurable connection timeouts (5-120 seconds)
- Status update intervals (30-300 seconds)
- SMS message validation (160 character warning)
- Phone number format validation and cleaning

### Documentation
- Comprehensive README with installation and usage instructions
- Detailed API reference and troubleshooting guide
- Contributing guidelines for developers
- Example scripts for both JavaScript and Blockly
- Multi-language admin interface documentation