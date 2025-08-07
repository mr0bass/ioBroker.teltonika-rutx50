// Dictionary for translation
systemDictionary = systemDictionary || {};

// Load settings
function load(settings, onChange) {
    if (!settings) return;
    
    // Load configuration values
    $('.value').each(function () {
        const $key = $(this);
        const id = $key.attr('id');
        
        if ($key.attr('type') === 'checkbox') {
            $key.prop('checked', settings[id]).on('change', () => onChange());
        } else {
            $key.val(settings[id]).on('change', () => onChange()).on('keyup', () => onChange());
        }
    });
    
    // Set default values if not set
    if (!settings.timeout) $('#timeout').val(30000);
    if (!settings.updateInterval) $('#updateInterval').val(60000);
    
    onChange(false);
    
    // Initialize UI components
    M.updateTextFields();
    
    // Setup test connection button
    $('#testConnection').on('click', testConnection);
}

// Save settings
function save(callback) {
    const obj = {};
    
    $('.value').each(function () {
        const $this = $(this);
        const id = $this.attr('id');
        
        if ($this.attr('type') === 'checkbox') {
            obj[id] = $this.prop('checked');
        } else {
            obj[id] = $this.val();
        }
    });
    
    // Validate required fields
    if (!obj.routerIp || !obj.username || !obj.password) {
        showMessage(_('Router IP, username and password are required'), 'error');
        return;
    }
    
    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!ipRegex.test(obj.routerIp)) {
        showMessage(_('Please enter a valid IP address or domain name'), 'error');
        return;
    }
    
    // Validate timeout
    if (obj.timeout < 5000 || obj.timeout > 120000) {
        showMessage(_('Timeout must be between 5000 and 120000 milliseconds'), 'error');
        return;
    }
    
    // Validate update interval
    if (obj.updateInterval < 30000 || obj.updateInterval > 300000) {
        showMessage(_('Update interval must be between 30000 and 300000 milliseconds'), 'error');
        return;
    }
    
    callback(obj);
}

// Test connection to router
function testConnection() {
    const $button = $('#testConnection');
    const $result = $('#testResult');
    
    // Get current configuration
    const config = {
        routerIp: $('#routerIp').val(),
        username: $('#username').val(),
        password: $('#password').val(),
        timeout: parseInt($('#timeout').val()) || 30000
    };
    
    // Validate required fields
    if (!config.routerIp || !config.username || !config.password) {
        showTestResult(_('Please fill in all required fields'), false);
        return;
    }
    
    // Disable button and show loading
    $button.prop('disabled', true);
    $button.find('span').text(_('Testing...'));
    $result.hide();
    
    // Send test command to adapter
    sendTo(null, 'testConnection', config, function(result) {
        $button.prop('disabled', false);
        $button.find('span').text(_('Test Connection'));
        
        if (result && result.success) {
            showTestResult(_('Connection successful!'), true);
        } else {
            const errorMsg = result && result.error ? result.error : _('Connection failed');
            showTestResult(_('Connection failed: ') + errorMsg, false);
        }
    });
}

// Show test result message
function showTestResult(message, success) {
    const $result = $('#testResult');
    $result.removeClass('test-success test-error');
    $result.addClass(success ? 'test-success' : 'test-error');
    $result.text(message);
    $result.show();
    
    // Hide after 5 seconds
    setTimeout(() => {
        $result.fadeOut();
    }, 5000);
}

// Show general message
function showMessage(message, type) {
    M.toast({
        html: message,
        classes: type === 'error' ? 'red' : 'green',
        displayLength: 4000
    });
}

// Initialize when document is ready
$(document).ready(function() {
    // Initialize Materialize components
    M.AutoInit();
});
