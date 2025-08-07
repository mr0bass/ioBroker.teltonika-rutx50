"use strict";

if (typeof goog !== "undefined") {
    goog.provide("Blockly.JavaScript.Sendto");
    goog.require("Blockly.JavaScript");
}

Blockly.Translate =
    Blockly.Translate ||
    function (word, lang) {
        lang = lang || systemLang;
        if (Blockly.Words && Blockly.Words[word]) {
            return Blockly.Words[word][lang] || Blockly.Words[word].en;
        } else {
            return word;
        }
    };

// --- SendTo SMS --------------------------------------------------
Blockly.Words["sms"] = {
    en: "SMS via RUTX50",
    de: "SMS über RUTX50",
    ru: "SMS через RUTX50",
    pt: "SMS via RUTX50",
    nl: "SMS via RUTX50",
    fr: "SMS via RUTX50",
    it: "SMS tramite RUTX50",
    es: "SMS por RUTX50",
    pl: "SMS przez RUTX50",
    "zh-cn": "通过RUTX50发短信",
};

Blockly.Words["sms_to"] = {
    en: "phone number",
    de: "Telefonnummer",
    ru: "номер телефона",
    pt: "número de telefone",
    nl: "telefoonnummer",
    fr: "numéro de téléphone",
    it: "numero di telefono",
    es: "número de teléfono",
    pl: "numer telefonu",
    "zh-cn": "电话号码",
};

Blockly.Words["sms_text"] = {
    en: "message",
    de: "Nachricht",
    ru: "сообщение",
    pt: "mensagem",
    nl: "bericht",
    fr: "message",
    it: "messaggio",
    es: "mensaje",
    pl: "wiadomość",
    "zh-cn": "消息",
};

Blockly.Words["sms_log"] = {
    en: "log level",
    de: "Loglevel",
    ru: "Протокол",
    pt: "nível de log",
    nl: "log-niveau",
    fr: "niveau de journal",
    it: "livello di log",
    es: "nivel de registro",
    pl: "poziom dziennika",
    "zh-cn": "日志级别",
};

Blockly.Words["sms_log_none"] = {
    en: "none",
    de: "keins",
    ru: "нет",
    pt: "nenhum",
    nl: "geen",
    fr: "aucun",
    it: "nessuno",
    es: "ninguno",
    pl: "brak",
    "zh-cn": "无",
};

Blockly.Words["sms_log_info"] = {
    en: "info",
    de: "info",
    ru: "инфо",
    pt: "informações",
    nl: "info",
    fr: "info",
    it: "info",
    es: "info",
    pl: "informacje",
    "zh-cn": "信息",
};

Blockly.Words["sms_log_debug"] = {
    en: "debug",
    de: "debug",
    ru: "debug",
    pt: "depurar",
    nl: "debug",
    fr: "debug",
    it: "debug",
    es: "depurar",
    pl: "debugowanie",
    "zh-cn": "调试",
};

Blockly.Words["sms_log_warn"] = {
    en: "warning",
    de: "warning",
    ru: "warning",
    pt: "aviso",
    nl: "waarschuwing",
    fr: "avertissement",
    it: "avviso",
    es: "advertencia",
    pl: "ostrzeżenie",
    "zh-cn": "警告",
};

Blockly.Words["sms_log_error"] = {
    en: "error",
    de: "error",
    ru: "ошибка",
    pt: "erro",
    nl: "fout",
    fr: "erreur",
    it: "errore",
    es: "error",
    pl: "błąd",
    "zh-cn": "错误",
};

Blockly.Words["sms_anyInstance"] = {
    en: "all instances",
    de: "Alle Instanzen",
    ru: "На все драйвера",
    pt: "todas as instâncias",
    nl: "alle exemplaren",
    fr: "toutes les instances",
    it: "tutte le istanze",
    es: "todas las instancias",
    pl: "wszystkie wystąpienia",
    "zh-cn": "所有实例",
};

Blockly.Words["sms_tooltip"] = {
    en: "Send SMS via Teltonika RUTX50",
    de: "SMS über Teltonika RUTX50 senden",
    ru: "Отправить SMS через Teltonika RUTX50",
    pt: "Enviar SMS via Teltonika RUTX50",
    nl: "SMS verzenden via Teltonika RUTX50",
    fr: "Envoyer SMS via Teltonika RUTX50",
    it: "Invia SMS tramite Teltonika RUTX50",
    es: "Enviar SMS por Teltonika RUTX50",
    pl: "Wyślij SMS przez Teltonika RUTX50",
    "zh-cn": "通过Teltonika RUTX50发送短信",
};

Blockly.Words["sms_help"] = {
    en: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    de: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    ru: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    pt: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    nl: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    fr: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    it: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    es: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    pl: "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
    "zh-cn":
        "https://github.com/iobroker-community-adapters/ioBroker.teltonika-rutx50/blob/master/README.md",
};

// Block template
Blockly.Sendto.blocks["sms"] =
    '<block type="sms">' +
    '  <field name="INSTANCE"></field>' +
    '  <field name="LOG"></field>' +
    '  <value name="TO">' +
    '    <shadow type="text">' +
    '      <field name="TEXT">436641234567</field>' +
    "    </shadow>" +
    "  </value>" +
    '  <value name="TEXT">' +
    '    <shadow type="text">' +
    '      <field name="TEXT">Hello from ioBroker!</field>' +
    "    </shadow>" +
    "  </value>" +
    "</block>";

// Block definition
Blockly.Blocks["sms"] = {
    init: function () {
        const options = [[Blockly.Translate("sms_anyInstance"), ""]];
        if (typeof main !== "undefined" && main.instances) {
            for (let i = 0; i < main.instances.length; i++) {
                const m = main.instances[i].match(
                    /^system.adapter.teltonika-rutx50.(\d+)$/,
                );
                if (m) {
                    const k = parseInt(m[1], 10);
                    options.push(["teltonika-rutx50." + k, "." + k]);
                }
            }
            if (options.length === 1) {
                for (let u = 0; u <= 4; u++) {
                    options.push(["teltonika-rutx50." + u, "." + u]);
                }
            }
        } else {
            for (let n = 0; n <= 4; n++) {
                options.push(["teltonika-rutx50." + n, "." + n]);
            }
        }

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("sms"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("TO").appendField(Blockly.Translate("sms_to"));

        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField(Blockly.Translate("sms_text"));

        this.appendDummyInput("LOG")
            .appendField(Blockly.Translate("sms_log"))
            .appendField(
                new Blockly.FieldDropdown([
                    [Blockly.Translate("sms_log_none"), ""],
                    [Blockly.Translate("sms_log_debug"), "debug"],
                    [Blockly.Translate("sms_log_info"), "log"],
                    [Blockly.Translate("sms_log_warn"), "warn"],
                    [Blockly.Translate("sms_log_error"), "error"],
                ]),
                "LOG",
            );

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("sms_tooltip"));
        this.setHelpUrl(Blockly.Translate("sms_help"));
    },
};

// JavaScript code generation
Blockly.JavaScript["sms"] = function (block) {
    const dropdown_instance = block.getFieldValue("INSTANCE");
    const logLevel = block.getFieldValue("LOG");
    const recipient = Blockly.JavaScript.valueToCode(
        block,
        "TO",
        Blockly.JavaScript.ORDER_ATOMIC,
    );
    const message = Blockly.JavaScript.valueToCode(
        block,
        "TEXT",
        Blockly.JavaScript.ORDER_ATOMIC,
    );

    let text = "{\n";
    text += `  recipient: ${recipient},\n`;
    text += `  message: ${message}\n`;
    text += "}";

    const logText = logLevel
        ? ", (error, result) => {\n" +
          "  if (error) {\n" +
          "    console." +
          logLevel +
          '("SMS error: " + error);\n' +
          "  } else {\n" +
          "    console." +
          logLevel +
          '("SMS sent successfully: " + JSON.stringify(result));\n' +
          "  }\n" +
          "}"
        : "";

    return `sendTo('teltonika-rutx50${dropdown_instance}', 'sendSMS', ${text}${logText});\n`;
};
