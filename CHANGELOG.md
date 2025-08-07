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