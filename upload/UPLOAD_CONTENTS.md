# ioBroker RUTX50 Adapter - Upload Contents

This folder contains all the essential files for the ioBroker RUTX50 adapter project. The adapter enables SMS sending through Teltonika RUTX50 routers using their local REST API.

## Core Adapter Files

### `main.js`
The main ioBroker adapter entry point that:
- Initializes the adapter and creates state objects
- Handles configuration and connection to RUTX50 router  
- Processes SMS sending requests from ioBroker
- Monitors signal status and connection state
- Provides message processing and error handling

### `io-package.json`
ioBroker adapter configuration file containing:
- Adapter metadata (name, version, description)
- Configuration schema for admin interface
- State object definitions for SMS control
- Dependencies and compatibility information
- Installation and setup requirements

### `package.json`
Node.js package configuration with:
- Project dependencies (@iobroker/adapter-core, axios, https)
- Scripts for testing and development
- Adapter version and licensing information

## API Integration

### `lib/rutx50-api.js`
Complete RUTX50 API client implementation:
- Bearer token authentication with `/login` endpoint
- SMS sending via `/messages/actions/send` endpoint
- Signal status monitoring from `/network/mobile/simcards/status`
- Proper error handling and session management
- Support for both HTTP and HTTPS protocols

### `lib/blockly.js`
Visual scripting blocks for ioBroker Blockly editor:
- SMS sending blocks for drag-and-drop programming
- Status monitoring blocks for signal strength
- Error handling blocks for visual scripts

## Admin Interface

### `admin/index.html`
Configuration web interface providing:
- Router connection settings (IP, username, password)
- Protocol selection (HTTP/HTTPS/Auto)
- Connection testing functionality
- Status display and troubleshooting information

### `admin/index.js`
JavaScript logic for admin interface:
- Form handling and validation
- AJAX connection testing
- Dynamic status updates
- Configuration persistence

### `admin/words.js`
Internationalization file with:
- Multi-language support for admin interface
- Translated text for all configuration options
- Error messages and status descriptions

### `admin/teltonika-rutx50.png`
Router icon for ioBroker admin interface

## Documentation

### `README.md`
Main project documentation covering:
- Installation instructions
- Configuration requirements  
- Usage examples and troubleshooting
- Hardware compatibility information

### `API_UPDATE_SUMMARY.md`
Detailed technical documentation of recent API changes:
- Authentication method updates
- Endpoint corrections based on real RUTX50 API
- Troubleshooting guide for common issues
- Testing procedures and examples

### `CHANGELOG.md`
Version history and release notes:
- Feature additions and bug fixes
- API compatibility updates
- Breaking changes and migration notes

### `docs/API.md`
Technical API reference documentation

### `docs/INSTALLATION.md`
Detailed installation and setup guide

## Development Tools

### `diagnose-rutx50.js`
Standalone diagnostic tool for testing:
- Router connectivity verification
- Authentication testing
- SMS sending capability check
- Signal status monitoring
- Comprehensive error reporting

### `RUTX50_7.16.3_v1.8.3.json`
Official RUTX50 API specification used for implementation:
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Error codes and handling

## Installation Instructions

1. Copy all files to your ioBroker adapters directory
2. Install dependencies: `npm install`
3. Configure router settings in ioBroker admin interface
4. Test connection using diagnostic tool: `node diagnose-rutx50.js`
5. Enable adapter in ioBroker and configure SMS objects

## Requirements

- **Hardware**: Teltonika RUTX50 router with active SIM card
- **Network**: Local network access to router web interface
- **Firmware**: RUTX50 firmware with Vuci interface support
- **ioBroker**: Compatible with ioBroker v4+ installations

## Support

For troubleshooting:
1. Run the diagnostic tool to identify connection issues
2. Check the API_UPDATE_SUMMARY.md for common problems
3. Verify router firmware supports the required API endpoints
4. Ensure SIM card has SMS capability and network access