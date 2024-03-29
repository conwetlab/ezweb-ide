/**
 * @class
 * Esta clase proporciona algunos mÃ©todos Ãºtiles para el desarrollador de 
 * gadgets de EzWeb.
 */
var EzWebExt = new Object();

/**
 * Guarda la URL donde se encuentra alojada la librerÃ­a JavaScript.
 * @type String
 */
EzWebExt.URL = "http://jupiter.ls.fi.upm.es/svn/ezweb-gadgets/eskel/1.0_beta1";

/**
 * Permite obtener la URL absoluta de un recurso proporcionado por la librerÃ­a.
 *
 * @param {String} path Path relativo al recurso deseado
 * @return {String} URL del recurso
 */
EzWebExt.getResourceURL = function(path) {
    // TODO check if resourcesURL end with a tailing slash ("/")
    return this.URL + path;
}

/**
 * Importa la librerÃ­a Javascript indicada por la URL pasada. Esta funciÃ³n
 * no controla si el script fue cargado satisfactoriamente.
 *
 * @param {String} url
 * @param {Function} onloadCallback indica el callback al que habrÃ¡ que llamar
 *                   en caso de que el script sea cargado exitosamente.
 */
EzWebExt.importJS = function(url, onloadCallback) {
    // Create the Script Object
    var script = document.createElement('script');
    script.setAttribute("type", 'text/javascript');

    // onload callback
    if (onloadCallback)
      script.addEventListener("load", onloadCallback, true);

    // Load script
    script.setAttribute("src", url);

    // Insert the created object to the html head element
    var head = document.getElementsByTagName('head').item(0);
    head.appendChild(script);
}

/**
 * AÃ±ade una nueva hoja de estilos al principio de la lista.
 * @param {Object} url
 */
EzWebExt.prependStyle = function(url) {
    // Create the Script Object
    var style = document.createElement('link');
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("type", "text/css");
    //style.setAttribute("media", "screen,projection");
    style.setAttribute("href", url);

    // Insert the created object to the html head element
    var head = document.getElementsByTagName('head').item(0);
    head.insertBefore(style, head.firstChild);
}

/**
 * AÃ±ade una nueva hoja de estilos al final de la lista.
 * @param {Object} url
 */
EzWebExt.appendStyle = function(url) {
    // Create the Script Object
    var style = document.createElement('link');
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("type", "text/css");
    //style.setAttribute("media", "screen,projection");
    style.setAttribute("href", url);

    // Insert the created object to the html head element
    var head = document.getElementsByTagName('head').item(0);
    head.appendChild(style);
}

/*---------------------------------------------------------------------------*/

/* Load default style */
EzWebExt.prependStyle(EzWebExt.getResourceURL("/EzWebGadgets.css"));

/*---------------------------------------------------------------------------*/

/*
 * Experimental!!!!
 * Support for using Gadgets outside EzWeb.
 */

/*
EzWebExt.onEzWebPlatform = false;
PseudoRWGadgetVariable = function(name_) {
    this.name_ = name_;
    this.value_ = "";
}

PseudoRWGadgetVariable.prototype.set = function(value_) {
    this.value_ = value_;
}

PseudoRWGadgetVariable.prototype.get = function(value_) {
    return this.value_;
}

PseudoRGadgetVariable = function(name_, handler) {
    this.name_ = name_;
    this.handler = handler;
}

PseudoRGadgetVariable.prototype.get = function() {
    return "";
}

EzWebAPI = function() {}

EzWebAPI.prototype.getId = function() {
    return 1;
}

EzWebAPI.prototype.createRWGadgetVariable = function(name) {
    return new PseudoRWGadgetVariable(name);
}

EzWebAPI.prototype.createRWGadgetVariable = function(name, handler) {
    return new PseudoRGadgetVariable(name, handler);
}
*/
/*---------------------------------------------------------------------------*/

/* Load EzWebAPI JavaScript */
EzWebExt.importJS("/ezweb/js/EzWebAPI/EzWebAPI.js");

/*---------------------------------------------------------------------------*/

/**
 * Rellena los parÃ¡metros usados en un patrÃ³n. Los campos a rellenar en el
 * patrÃ³n vienen indicados mediante sentencias "%(nombre)s". Por ejemplo,
 * al finalizar la ejecuciÃ³n del siguiente cÃ³digo:
 * <code>
 *     var date = {year: 2009, month: 3, day: 27};
 *
 *     var pattern1 = "%(year)s/%(month)s/%(day)s";
 *     var result1 = EzWebExt.interpolate(pattern, date);
 *
 *     var pattern2 = "%(day)s/%(month)s/%(year)s";
 *     var result2 = EzWebExt.interpolate(pattern, date);
 * </code>
 *
 * obtendrÃ­amos "2009/3/27" en result1 y "27/3/2009" en result2
 */
EzWebExt.interpolate = function(pattern, attributes) {
    return pattern.replace(/%\(\w+\)s/g,
                           function(match) {
                               return String(attributes[match.slice(2,-2)])
                           });
}

/**
 * Elimina el exceso de carÃ¡cteres de espaciado (espacios, tabuladores, saltos
 * de linea, etc...)
 *
 * @param {String} text string inicial
 * @return {String} el string pasado en el argumento text, pero eliminando el
 * exceso de carÃ¡cteres de espaciado.
 */
EzWebExt.stripWhiteSpaces = function(text) {
    //text = text.replace(RegExp("\\s+", "g"), " "); Remove internal spaces
    return text.replace(RegExp("^\\s+|\\s+$", "g"), "");
}

/**
 * Comprueba si una palabra estÃ¡ incluida en un string dado.
 *
 * @param {String} text Texto en el que se va a realizar la comprobaciÃ³n.
 * @param {String} word Palabra que se va a comprobar si estÃ¡ en el texto.
 * @return {Boolean}
 */
EzWebExt.hasWord = function(text, word) {
    return text.match(RegExp("(^\\s*|\\s+)" + word + "(\\s+|\\s*$)", "g")) != null;
}

EzWebExt.removeWord = function(text, word) {
    return EzWebExt.stripWhiteSpaces(text.replace(RegExp("(^\\s*|\\s+)" + word + "(\\s+|\\s*$)", "g"), " "));
}

EzWebExt.appendWord = function(text, word) {
    return EzWebExt.removeWord(text, word) + (" " + word);
}

EzWebExt.prependWord = function(text, word) {
    return word + " " + EzWebExt.removeWord(text, word);
}

EzWebExt.hasClassName = function(element, className) {
    return element.className.match(RegExp("(^\\s*|\\s+)" + className + "(\\s+|\\s*$)", "g")) != null;
}

/**
 * @deprecated
 */
EzWebExt.addClassName = function(element, className) {
    element.className = EzWebExt.appendWord(element.className, className);
}

EzWebExt.appendClassName = function(element, className) {
    element.className = EzWebExt.appendWord(element.className, className);
}

EzWebExt.prependClassName = function(element, className) {
    element.className = EzWebExt.prependWord(element.className, className);
}

EzWebExt.removeClassName = function(element, className) {
    element.className = element.className.replace(RegExp("(^\\s*|\\s+)" + className + "(\\s+|\\s*$)", "g"), " ").replace(RegExp("^\\s+|\\s+$", "g"), "");
}

EzWebExt.toggleClassName = function(element, className) {
    if (EzWebExt.hasClassName(element, className))
        EzWebExt.removeClassName(element, className);
    else
        EzWebExt.addClassName(element, className);
}

/* getElementsByClassName function */
if ("getElementsByClassName" in document) {
    EzWebExt.getElementsByClassName = function(rootElement, className) {
        return rootElement.getElementsByClassName(className);
    }
} else { /* TODO check for XPath support */
    EzWebExt.getElementsByClassName = function(rootElement, className) {
        var classes = className.split(/\s+/);

        var q = ".//*[contains(concat(' ', @class, ' '), ' " + classes[0] + " ')";
        for (var i = 1; i < classes.length; i++)  
            q += " and contains(concat(' ', @class, ' '), ' " + classes[i] + " ')";
        q += "]";

        var results = [];
        var dom = rootElement.ownerDocument;
        var query = dom.evaluate(q, rootElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, length = query.snapshotLength; i < length; i++)
            results.push(query.snapshotItem(i));
        return results;
    }
}

/**
 * Sustituye los caracteres XML reservados, por las entidades predefinidas
 * que los representan.
 *
 * @param {String} string Texto del que se desean sustituir los caracteres
 * reservados.
 *
 * @return {String} Texto sin caracteres reservados.
 */
EzWebExt.escapeXML = function(string) {
    return string.replace(RegExp("&", "g"), "&amp;").replace(RegExp("<", "g"), "&lt;").replace(RegExp(">", "g"), "&gt;").replace(RegExp("'", "g"), "&apos;").replace(RegExp('"', "g"), "&quot;");
}

/**
 * Constante para que el diÃ¡logo que muestre el mÃ©todo <code>alert</code> 
 * sea una alerta informativa.
 * @type Number
 */
EzWebExt.ALERT_INFO = 0;

/**
 * Constante para que el diÃ¡logo que muestre el mÃ©todo <code>alert</code> 
 * sea una  alerta de advertencia.
 * @type Number
 */
EzWebExt.ALERT_WARNING = 1;

/**
 * Constante para que el diÃ¡logo que muestre el mÃ©todo <code>alert</code> 
 * sea una  alerta de error.
 * @type Number
 */
EzWebExt.ALERT_ERROR = 2;


/**
 * Permite forzar el valor que tendrÃ¡ la variable <code>this</code> cuando se
 * llame a la funciÃ³n indicada.
 * 
 * @param {Object} func FunciÃ³n a la que se le forzarÃ¡ el valor de la variable
 * <code>this</code>
 * @param {Object} _this valor que tendrÃ¡ la variable <code>this</code>.
 * @return a new function that forces the value of <code>this</code> and calls
 * the given function.
 */
EzWebExt.bind = function (func, _this) {
    return function() {func.apply(_this, arguments)}
}

/**
 * @deprecated @experimental
 */
EzWebExt.clone = function (obj1) {
    var tmp = new Array();
    for (var key in obj1)
        tmp[key] = obj1[key]

    return tmp;
}

/**
 * Elimina un nodo DOM de su elemento padre. Esta funcion no comprueba que el
 * nodo DOM tenga un padre, por lo que en caso de no ser asÃ­ el cÃ³digo lanzarÃ­a
 * una excepciÃ³n.
 */
EzWebExt.removeFromParent = function (domNode) {
    domNode.parentNode.removeChild(domNode);
}

/**
 * Permite obtener un objeto a partir de la mezcla de los atributos de dos
 * objetos. Para ello, se pasarÃ¡n los dos objetos que se usarÃ¡n de fuente, 
 * siendo el primero de los objetos sobreescrito con el resultado. En caso de
 * que exista un mismo atributo en los dos objetos, el valor final serÃ¡ el del
 * segundo objeto, perdiendose el valor del primer objeto.
 * 
 * @param {Object} obj1 objeto base.
 * @param {Object} obj2 objeto modificador. En caso de que este argumento sea
 * null, esta funciÃ³n no harÃ¡ nada.
 *
 * @return obj1 modificado
 */
EzWebExt.merge = function (obj1, obj2) {
    if (obj2 != null) {

        /* TODO esto no "funciona" ("funciona", pero mete las funciones de prototype
         * como atributos en caso de estar mezclando Arrays, etc..) cuando se usa
         * prototype.
         */
        for (var key in obj2)
            obj1[key] = obj2[key];
    }

    return obj1;
}

/**
 * 
 * @deprecated @experimental
 * 
 * @param {Object} foregroundColor
 * @param {Object} backgroundColor
 * @param {Object} kind
 * @param {Object} transparent
 */
EzWebExt.genLoadingGIF = function(foregroundColor, backgroundColor, kind, transparent) {
    foregroundColor = foregroundColor.substr(0,2) + "/" + foregroundColor.substr(2,2) + "/" + foregroundColor.substr(4,2);
    backgroundColor = backgroundColor.substr(0,2) + "/" + backgroundColor.substr(2,2) + "/" + backgroundColor.substr(4,2);
    transparent = transparent ? "1" : "0";
    return "http://www.ajaxload.info/cache/" + foregroundColor + "/" + backgroundColor + "/" + kind + "-" + transparent + ".gif"
}

EzWebExt.CIRCLE_BALL = 1;
EzWebExt.INDICATOR = 2;
EzWebExt.KIT = 3;
EzWebExt.ARROWS = 4;
EzWebExt.INDICATOR_BIG = 5;
EzWebExt.SNAKE = 6;
EzWebExt.BOUNCING_BALL = 7;
EzWebExt.BAR = 8;
EzWebExt.BAR2 = 9;
EzWebExt.BAR3 = 10;
EzWebExt.CIRCLING_BALL = 11;
EzWebExt.HYPNOTIZE = 12;
EzWebExt.WHEEL = 13;
EzWebExt.EXPANDING_CIRCLE = 14;
EzWebExt.RADAR = 15;
EzWebExt.REFRESH = 16;
EzWebExt.FLOWER = 17;
EzWebExt.SQUARES = 18;
EzWebExt.CIRCLE_THICKBOX = 19;
EzWebExt.BIG_ROLLER = 20;
EzWebExt.WHEEL_THROBBER = 21;
EzWebExt.SMALL_WAIT = 22;
EzWebExt._3D_ROTATION = 23;
EzWebExt.INDICATOR_LITE = 24;
EzWebExt.SQUARES_CIRCLE = 25;
EzWebExt.BIG_SNAKE = 26;
EzWebExt.BIG_CIRCLE_BALL = 27;
EzWebExt.ROLLER = 28;
EzWebExt.DRIP_CIRCLE = 29;
EzWebExt.INDICATOR_BIG2 = 30;
EzWebExt.BIG_FLOWER = 31;
EzWebExt.CLOCK = 32;
EzWebExt.BAR_CIRCLE = 34;
EzWebExt.PIK = 34;
EzWebExt.PK = 35;
EzWebExt.BERT = 36;
EzWebExt.BERT2 = 37;


/*---------------------------------------------------------------------------*/
/*                                EzWebGadget                                */
/*---------------------------------------------------------------------------*/

/**
 * @class
 * Esta clase representa a un Gadget de EzWeb y facilita la implementaciÃ³n
 * de estos (no es necesario usar esta clase para crear un gadget).
 * 
 * Dentro de esta clase se define el uso de ciertas variables de EzWeb asÃ­
 * como de ciertos mÃ©todos que actuarÃ¡n de callbacks.
 *
 * En caso de que el gadget sea traducible, se usarÃ¡n las variables indicadas
 * por los elementos languagePrefVarName y platformLanguageVarName.
 * 
 * La configuraciÃ³n por defecto es la siguiente:
 *   lockStatusVarName: "lockStatus"
 *   heightVarName: "height"
 *   userVarName: "user"
 *   languagePrefVarName: "languagePref"
 *   platformLanguageVarName: "language"
 *   translatable: false
 *   defaultLanguage: "en"
 *
 * @param {Array} settings
 */
var EzWebGadget = function(customSettings) {
    if (arguments.length == 0)
        return;

    var gadget = this;

    /* Parse settings */
    this.settings = {
        useLockStatus: true,
        lockStatusVarName: "lockStatus",
        useHeightVar: true,
        heightVarName: "height",
        useWidthVar: false,
        widthVarName: "width",
        userVarName: "user",
        languagePrefVarName: "languagePref",
        platformLanguageVarName: "language",
        translatable: false,
        defaultLanguage: "en"
    };
    for (var key in customSettings)
        this.settings[key] = customSettings[key];

    /* Common funcionality */
    this.lockVar   = EzWebAPI.createRGadgetVariable(this.settings["lockStatusVarName"],
                                                    function(value) {gadget.lockCallback(value)});
    this.heightVar = EzWebAPI.createRGadgetVariable(this.settings["heightVarName"],
                                                    function(value) {gadget.heightCallback(value)});

    if (this.settings.useWidthVar) {
        this.widthVar = EzWebAPI.createRGadgetVariable(this.settings["widthVarName"],
                                                       function(value) {gadget.widthCallback(value)});
    }
    this.userVar   = EzWebAPI.createRGadgetVariable(this.settings["userVarName"],
                                                    function() {/* Not used */});

    /* Enable translation support only if this gadget is translatable */
    this._babel = []
    this._currentLanguage = [];
    this._babelLoaded = false;

    if (this.settings.translatable) {
        var loadCatalogue = function(transport) {
            var response = transport.responseXML, i, j;

            var xmlLanguages = response.getElementsByTagName("language");
            var languages = [], language;

            for (i = 0; i < xmlLanguages.length; i++) {
                language = xmlLanguages[i].attributes.name.value
                languages[i] = language;
                gadget._babel[language] = [];
            }

            var xmlLabels;
            for (i = 0; i < languages.length; i++) {
                xmlLabels = xmlLanguages[i].getElementsByTagName("label");
                for (var j = 0; j < xmlLabels.length; j++) {
                    gadget._babel[languages[i]][xmlLabels[j].attributes.id.value] = xmlLabels[j].firstChild.nodeValue;
                }
            }
            gadget._babelLoaded = true;

            var lang = gadget.langPrefVar.get();
            if (lang == "default")
               lang = gadget.langContextVar.get();

            if (!gadget._babel[lang])
               lang = gadget.settings["defaultLanguage"];

            gadget.loadCatalogueCallback();
            gadget.languageCallback(lang);
            //gadget._currentLanguage = gadget._babel[lang];
        }

        var processLanguageChange = function(prefLang, platformLang) {
            if (this._babelLoaded === false)
                return; // Do nothing if the catalogue is not loaded yet
            /*
             * If you have not selected a language in the preferences of the gadget it
             * will be shown with the language of the platform.
             */
            var lang = prefLang;
            if (lang == "default")
                lang = platformLang;

            if (!gadget._babel[lang]) {
                lang = gadget.settings["defaultLanguage"];
            }

            if (gadget._currentLanguage != gadget._babel[lang])
                gadget.languageCallback(lang);
        }
        this.langContextVar = EzWebAPI.createRGadgetVariable(this.settings["platformLanguageVarName"],
                                                             function (newvalue) {
                                                                 processLanguageChange(gadget.langPrefVar.get(), newvalue);
                                                             });
        this.langPrefVar = EzWebAPI.createRGadgetVariable(this.settings["languagePrefVarName"],
                                                          function (newvalue) {
                                                              processLanguageChange(newvalue, gadget.langContextVar.get());
                                                          });

        var url = this.getResourceURL("/languages.xml");
        this.sendGet(url, loadCatalogue, "Error al recuperar el fichero de idiomas (URL: %(url)s).");
    }

    this.init = EzWebExt.bind(this.init, this);
    document.addEventListener("DOMContentLoaded", this.init, true);
}

/**
 * Indica que se quiere recalcular los tamaÃ±os de los elementos visuales de
 * este gadget. Este mÃ©todo es conveniente en caso de necesitar realizar
 * ciertos cÃ¡lculos de tamaÃ±os en JavaScript (que normalmente sÃ³lo son
 * necesarios en caso de no poder usar reglas de CSS para conseguir el
 * resultado deseado). La implementaciÃ³n por defecto no hace nada, siendo
 * necesario sobreescribir este mÃ©todo con la implementaciÃ³n adecuada en caso
 * de necesitar hacer cÃ¡lculos de tamaÃ±os mediante JavaScript.
 * 
 * @see EzWebGadget/heightCallback
 */
EzWebGadget.prototype.repaint = function() {
}

/**
 * Este mÃ©todo es llamado cuando cambia el alto (en pixels) de la ventana
 * asociada a este gadget. La implementaciÃ³n por defecto llama al mÃ©todo
 * {repaint}. En caso de querer capturar este evento, se podrÃ¡ sobreescribir
 * este mÃ©todo, pero habrÃ¡ que tener en cuenta que entonces no se llamarÃ¡ al
 * mÃ©todo {repaint} salvo que se haga explÃ­citamente. TambiÃ©n se puede llamar
 * a la implementaciÃ³n por defecto usando la siguiente linea de cÃ³digo:
 * 
 * <code>
 * EzWebGadget.prototype.heightCallback.call(this, newHeihght);
 * </code>
 *
 * @see EzWebGadget/repaint
 */
EzWebGadget.prototype.heightCallback = function(newHeight) {
    this.repaint();
}

/**
 * Este mÃ©todo es llamado cuando cambia el ancho (en pixels) de la ventana
 * asociada a este gadget. La implementaciÃ³n por defecto llama al mÃ©todo
 * {repaint}. En caso de querer capturar este evento, se podrÃ¡ sobreescribir
 * este mÃ©todo, pero habrÃ¡ que tener en cuenta que entonces no se llamarÃ¡ al
 * mÃ©todo {repaint} salvo que se haga explÃ­citamente. TambiÃ©n se puede llamar
 * a la implementaciÃ³n por defecto usando la siguiente linea de cÃ³digo:
 * 
 * <code>
 * EzWebGadget.prototype.widthCallback.call(this, newWidth);
 * </code>
 *
 * @see EzWebGadget/repaint
 */
EzWebGadget.prototype.widthCallback = function(newWidth) {
    this.repaint();
}

/**
 * Este mÃ©todo es llamado cuando la plataforma bloquea o desbloquea este
 * gadget. La implementaciÃ³n por defecto de este gadget se encarga de modificar
 * el atributo class del elemento body acordemente al nuevo estado. En caso de
 * querer modificar este comportamiento, se podrÃ¡ sobreescribir este mÃ©todo. En
 * caso de querer usar la implementaciÃ³n por defecto de este mÃ©todo cuando se
 * estÃ¡ sobreescribiendo el mÃ©todo, basta con usar la siguiente linea de
 * cÃ³digo:
 * 
 * <code>
 * EzWebGadget.prototype.lockCallback.call(this, newLockStatus);
 * </code>
 * 
 */
EzWebGadget.prototype.lockCallback = function(newLockStatus) {
    if (newLockStatus == true) {
        EzWebExt.appendClassName(document.body, "locked");
    } else {
        EzWebExt.removeClassName(document.body, "locked");
    }
}

/**
 * Este mÃ©todo es llamado justo despuÃ©s de traducir el gadget mediante el
 * mÃ©todo <code>translate</code>. La implementaciÃ³n de este mÃ©todo esta vacÃ­a
 * por defecto. En caso de querer capturar este evento, habrÃ¡ que sobreescribir
 * este mÃ©todo.
 * 
 * @see EzWebGadget/translate
 */
EzWebGadget.prototype.translateCallback = function() {
}

/**
 * Este mÃ©todo es llamado justo despuÃ©s de cargar exitosamente el catalogo
 * de traducciones. La implementaciÃ³n de este mÃ©todo esta vacÃ­a por defecto. En
 * caso de querer capturar este evento habrÃ¡ que sobreescribir este mÃ©todo.
 */
EzWebGadget.prototype.loadCatalogueCallback = function() {
}

/**
 * Este mÃ©todo es llamado cuando el idioma del gadget es modificado. La
 * implementaciÃ³n por defecto modifica el idioma actual del gadget y fuerza la
 * traducciÃ³n del gadget (ver mÃ©todo {translate}). En caso de ser necesario, se
 * puede sobreescribir este mÃ©todo, pero se recomienda que la nueva
 * implementaciÃ³n llame a la implementaciÃ³n por defecto. Para llamar a la
 * implementaciÃ³n por defecto, se puede usar la siguiente linea de cÃ³digo:
 * 
 * <code>
 * EzWebGadget.prototype.languageCallback.call(this, newLang);
 * </code>
 *
 * @param {String} newLang
 */
EzWebGadget.prototype.languageCallback = function(newLang) {
    this._currentLanguage = this._babel[newLang];
    this.translate();
}

/**
 * Permite obtener la URL absoluta de un recurso dado de este gadget.
 * 
 * @param {String} path Path relativo a la URL donde se encuentran los
 *                      recursos del gadget.
 * @return {String} URL del recurso
 */
EzWebGadget.prototype.getResourceURL = function(path) {
    // TODO check if resourcesURL end with a tailing slash ("/")
    return this.resourcesURL + path;
}

/**
 * Este mÃ©todo es llamado justo cuando se instancia el gadget. La
 * implementaciÃ³n por defecto no hace absolutamente nada. Normalmente
 * habrÃ¡ que sobreescribir este mÃ©todo para crear las variables de EzWeb
 * pertinentes.
 */
EzWebGadget.prototype.preinit = function() {
}

/**
 * Este mÃ©todo es llamado cuando el cÃ³digo HTML del gadget ha sido cargado
 * completamente. La implementaciÃ³n por defecto no hace absolutamente nada.
 * Este mÃ©todo estÃ¡ pensado para ser sobreescribir en caso de querer ser
 * notificado de cuando se ha cargado el cÃ³digo HTML completamente.
 */
EzWebGadget.prototype.init = function() {
    document.removeEventListener("DOMContentLoaded", this.init, true);
}

/**
 * Obtiene el nombre de usuario que esta haciendo uso de este gadget.
 * @return 
 */
EzWebGadget.prototype.getUserName = function() {
    return this.userVar.get();
}

/**
 * Permite obtener la anchura en pixels de la ventana asignada para este
 * gadget.
 * @return {Number} Altura del gadget
 */
EzWebGadget.prototype.getWidth = function() {
    return document.defaultView.innerWidth;
}

/** 
 * Permite obtener la altura en pixels de la ventana asignada para este
 * gadget.
 * @return {Number} Altura del gadget
 */
EzWebGadget.prototype.getHeight = function() {
    return this.heightVar.get();
}

/**
 * Fuerza la traducciÃ³n de todos los elementos HTML de este gadget.
 */
EzWebGadget.prototype.translate = function() {
    var id;
    for (id in this._currentLanguage) {
        var element = document.getElementById(id);
        if (element)
            element.innerHTML = this._currentLanguage[id];
    }

    this.translateCallback();
}

/**
 * Devuelve la traducciÃ³n para el elemento indicado.
 * 
 * @param id identificador del mensaje a traducir
 */
EzWebGadget.prototype.getTranslatedLabel = function(id) {
    return this._currentLanguage[id];
}

/**
 * Realiza una peticiÃ³n GET a la URL indicada.
 *
 * @param {String} url URL del servidor al que se desea realizar la
 * peticiÃ³n GET.
 *
 * @param {Function} onSuccess FunciÃ³n que serÃ¡ llamada cuando
 * se reciba la respuesta del servidor, siempre que no se produzca
 * ningÃºn error.
 *
 * @param {Function | String} onError Este parÃ¡metro es opcional, si se aÃ±ade y
 * vale distinto de null, su valor podrÃ¡ ser de tipo <code>String</code>, que
 * serÃ¡ el mensaje de error que se mostrarÃ¡ si se produce
 * algÃºn error durante la peticiÃ³n al servidor. En lugar del
 * mensaje de error, este parÃ¡metro podrÃ¡ apuntar a una
 * funciÃ³n que serÃ¡ llamada cuando se produzca algÃºn
 * error durante la peticiÃ³n al servidor.
 */
EzWebGadget.prototype.sendGet = function(url, onSuccess, onError, onException) {
    onError = onError ? onError : "HTTP error %(errorCode)s in GET request (%(url)s)";
    if (typeof onError == "string") {
        var onErrorMsg = onError;
        onError = function(transport) {
           var msg = EzWebExt.interpolate(onErrorMsg, {errorCode: transport.status, url: url});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    onException = onException ? onException : "Exception processing GET response (%(url)s): %(errorDesc)s";
    if (typeof onException == "string") {
        var onExceptionMsg = onException;
        onException = function(transport, e) {
           var msg = EzWebExt.interpolate(onExceptionMsg, {url: url, errorDesc: e});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    var handleError = function(transport, e) {
        if (e)
            onException.call(this, transport, e);
        else
            onError.call(this, transport);
    }

    EzWebAPI.send_get(url, this, onSuccess, handleError);
}

/**
 * Realiza una peticiÃ³n POST a la URL indicada.
 *
 * @param {String} url URL del servidor al que se desea realizar la
 * peticiÃ³n POST.<br/><br/>
 *
 * @param {String} params ParÃ¡metros de la peticiÃ³n.<br/><br/>
 *
 * @param {Function} onSuccess FunciÃ³n que serÃ¡ llamada cuando
 * se reciba la respuesta del servidor, siempre que no se produzca
 * ningÃºn error.<br/><br/>
 *
 * @param {Object} onError Este parÃ¡metro es opcional, si se
 * aÃ±ade, su valor podrÃ¡ ser de tipo <code>String</code>, que
 * serÃ¡ el mensaje de error que se mostrarÃ¡ si se produce
 * algÃºn error durante la peticiÃ³n al servidor. En lugar del
 * mensaje de error, este parÃ¡metro podrÃ¡ apuntar a una
 * funciÃ³n que serÃ¡ llamada cuando se produzca algÃºn
 * error durante la peticiÃ³n al servidor.
 *
 */
EzWebGadget.prototype.sendPost = function(url, params, onSuccess, onError, onException) {
    onError = onError ? onError : "HTTP error %(errorCode)s in POST request (%(url)s)";
    if (typeof onError == "string") {
        var onErrorMsg = onError;
        onError = function(transport) {
           var msg = EzWebExt.interpolate(onErrorMsg, {errorCode: transport.status, url: url});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    onException = onException ? onException : "Exception processing POST response (%(url)s): %(errorDesc)s";
    if (typeof onException == "string") {
        var onExceptionMsg = onException;
        onException = function(transport, e) {
           var msg = EzWebExt.interpolate(onExceptionMsg, {url: url, errorDesc: e});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    var handleError = function(transport, e) {
        if (e)
            onException.call(this, transport, e);
        else
            onError.call(this, transport);
    }

    EzWebAPI.send_post(url, params, this, onSuccess, handleError);
}

/**
 * Realiza una peticiÃ³n PUT a la URL indicada.
 *
 * @param {String} url URL del servidor al que se desea realizar la
 * peticiÃ³n PUT.<br/><br/>
 *
 * @param {String} params ParÃ¡metros de la peticiÃ³n.<br/><br/>
 *
 * @param {Function} onSuccess FunciÃ³n que serÃ¡ llamada cuando
 * se reciba la respuesta del servidor, siempre que no se produzca
 * ningÃºn error.<br/><br/>
 *
 * @param {Object} onError Este parÃ¡metro es opcional, si se
 * aÃ±ade, su valor podrÃ¡ ser de tipo <code>String</code>, que
 * serÃ¡ el mensaje de error que se mostrarÃ¡ si se produce
 * algÃºn error durante la peticiÃ³n al servidor. En lugar del
 * mensaje de error, este parÃ¡metro podrÃ¡ apuntar a una
 * funciÃ³n que serÃ¡ llamada cuando se produzca algÃºn
 * error durante la peticiÃ³n al servidor.
 *
 */
EzWebGadget.prototype.sendPut = function(url, params, onSuccess, onError, onException) {
    onError = onError ? onError : "HTTP error %(errorCode)s in PUT request (%(url)s)";
    if (typeof onError == "string") {
        var onErrorMsg = onError;
        onError = function(transport) {
           var msg = EzWebExt.interpolate(onErrorMsg, {errorCode: transport.status, url: url});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    onException = onException ? onException : "Exception processing PUT response (%(url)s): %(errorDesc)s";
    if (typeof onException == "string") {
        var onExceptionMsg = onException;
        onException = function(transport, e) {
           var msg = EzWebExt.interpolate(onExceptionMsg, {url: url, errorDesc: e});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    var handleError = function(transport, e) {
        if (e)
            onException.call(this, transport, e);
        else
            onError.call(this, transport);
    }

    EzWebAPI.send_put(url, params, this, onSuccess, handleError);
}

/** 
 * Realiza una peticiÃ³n DELETE a la URL indicada.
 *
 * @param {String} url	URL del servidor al que se desea realizar la
 * peticiÃ³n DELETE.<br/><br/>
 *
 * @param {Function} onSuccess FunciÃ³n que serÃ¡ llamada cuando
 * se reciba la respuesta del servidor, siempre que no se produzca
 * ningÃºn error.<br/><br/>
 *
 * @param {Object} onError Este parÃ¡metro es opcional, si se
 * aÃ±ade, su valor podrÃ¡ ser de tipo <code>String</code>, que
 * serÃ¡ el mensaje de error que se mostrarÃ¡ si se produce
 * algÃºn error durante la peticiÃ³n al servidor. En lugar del
 * mensaje de error, este parÃ¡metro podrÃ¡ apuntar a una
 * funciÃ³n que serÃ¡ llamada cuando se produzca algÃºn
 * error durante la peticiÃ³n al servidor.
 */
EzWebGadget.prototype.sendDelete = function(url, onSuccess, onError, onException) {
    onError = onError ? onError : "HTTP error %(errorCode)s in DELETE request (%(url)s)";
    if (typeof onError == "string") {
        var onErrorMsg = onError;
        onError = function(transport) {
           var msg = EzWebExt.interpolate(onErrorMsg, {errorCode: transport.status, url: url});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    onException = onException ? onException : "Exception processing DELETE response (%(url)s): %(errorDesc)s";
    if (typeof onException == "string") {
        var onExceptionMsg = onException;
        onException = function(transport, e) {
           var msg = EzWebExt.interpolate(onExceptionMsg, {url: url, errorDesc: e});
           this.alert("Error", msg, EzWebExt.ALERT_ERROR);
        }
    }

    var handleError = function(transport, e) {
        if (e)
            onException.call(this, transport, e);
        else
            onError.call(this, transport);
    }

    EzWebAPI.send_delete(url, this, onSuccess, handleError);
}



EzWebGadget.prototype.alert = function(title, content, type) {
    var alert = new StyledElements.StyledAlert(title, content, {type: type});
    alert.insertInto(document.body);
}


/**
 *
    Problemas con this.

    var obj = function() {
    }
    obj.prototype.func() {
      this.func2();
    }
    obj.prototype.func2() {
      ...
    }

    instancia = new obj();
    instancia.func();          // javascript asigna "instancia" como valor de this antes de llamar a la funcion
    instancia.func.call(null); // javascript asigna null como valor de this antes de llamar a la funcion
    func3 = function(func) {
      func()                   // javascript no sobreescribe el valor de this (por lo tanto this puede valer cualquier cosa)
    }

    func3(instancia.func)

    func = func.bind(null);    // devuelve una funcion que asigna null a this y luego llama a la funcion inicial
                               // por lo tanto da igual el valor que tenga this a la hora de llamar a la funcion, ya que la
                               // nueva funcion se encarga ella misma de sobreescribirlo y asegurarse de que valga lo que se quiere
*/

/*---------------------------------------------------------------------------*
 *                               StyledElements                              *
 *---------------------------------------------------------------------------*/

// Static class
var StyledElements = new Object();

StyledElements.Event = function() {
    this.handlers = [];
}

StyledElements.Event.prototype.addEventListener = function(handler) {
    this.handlers.push(handler);
}

StyledElements.Event.prototype.removeEventListener = function(handler) {
    var index = this.handlers.indexOf(handler);
    if (index != -1)
        this.handlers.splice(index, 1);
}

StyledElements.Event.prototype.dispatch = function() {
    for (var i = 0; i < this.handlers.length; i++)
        this.handlers[i].apply(null, arguments);
}

/**
 * @abstract
 */
StyledElements.StyledElement = function(events) {
    events = events ? events : [];

    this.events = {};
    for (var i = 0; i < events.length; i++)
        this.events[events[i]] = new StyledElements.Event();

    this.wrapperElement = null;
}

/**
 * Inserta el elemento con estilo dentro del elemento indicado.
 *
 * @param element Este serÃ¡ el elemento donde se insertarÃ¡ el elemento con
 * estilo.
 * @param refElement Este parÃ¡metro es opcional. En caso de ser usado, sirve
 * para indicar delante de que elemento se tiene que aÃ±adir este elemento con
 * estilo.
 */
StyledElements.StyledElement.prototype.insertInto = function (element, refElement) {
    if (element instanceof StyledElements.StyledElement) {
        element = element.wrapperElement;
    }

    if (refElement instanceof StyledElements.StyledElement) {
        refElement = refElement.wrapperElement;
    }

    if (refElement)
        element.insertBefore(this.wrapperElement, refElement);
    else
        element.appendChild(this.wrapperElement);
}

/**
 * Esta funciÃ³n sirve para repintar el componente.
 *
 * @param {Boolean} temporal Indica si se quiere repintar el componente de
 * forma temporal o de forma permanente. Por ejemplo, cuando mientras se estÃ¡
 * moviendo el tirador de un HPaned se llama a esta funciÃ³n con el parÃ¡metro
 * temporal a <code>true</code>, permitiendo que los componentes intenten hacer
 * un repintado mÃ¡s rÃ¡pido (mejorando la experiencia del usuario); y cuando el 
 * usuario suelta el botÃ³n del ratÃ³n se ejecuta una Ãºltima vez esta funciÃ³n con
 * el parÃ¡metro temporal a <code>false</code>, indicando que el usuario ha
 * terminado de mover el tirador y que se puede llevar a cabo un repintado mÃ¡s
 * inteligente. Valor por defecto: <code>false</code>.
 */
StyledElements.StyledElement.prototype.repaint = function (temporal) {
}

/**
 * 
 */
StyledElements.StyledElement.prototype.addClassName = function(className) {
    EzWebExt.addClassName(this.wrapperElement, className);
}

/**
 * 
 */
StyledElements.StyledElement.prototype.removeClassName = function(className) {
    EzWebExt.removeClassName(this.wrapperElement, className);
}

/**
 * AÃ±ade un listener para un evento indicado.
 */
StyledElements.StyledElement.prototype.addEventListener = function(event, handler) {
    if (this.events[event] === undefined)
        throw new Exception(EzWebExt.interpolate("Unhandled event \"%(event)s\"", {event: event}));

    this.events[event].addEventListener(handler);
}

/**
 * Elimina un listener para un evento indicado.
 */
StyledElements.StyledElement.prototype.removeEventListener = function(event, handler) {
    if (this.events[event] === undefined)
        throw new Exception(EzWebExt.interpolate("Unhandled event \"%(event)s\"", {event: event}));

    this.events[event].removeEventListener(handler);
}

/**
 * @abstract
 *
 * Esta clase contiene la lÃ³gica base de todos los elementos StyledElements que
 * corresponden con un elemento de entrada de datos valido tanto para usarlos
 * junto con formularios como sin ellos.
 */
StyledElements.StyledInputElement = function(defaultValue, events) {
    this.inputElement = null;
    this.defaultValue = defaultValue;

    StyledElements.StyledElement.call(this, events);
}
StyledElements.StyledInputElement.prototype = new StyledElements.StyledElement();

StyledElements.StyledInputElement.prototype.getValue = function () {
    return this.inputElement.value;
}

StyledElements.StyledInputElement.prototype.setValue = function (newValue) {
    this.inputElement.value = newValue;
}

StyledElements.StyledInputElement.prototype.reset = function () {
    this.setValue(this.defaultValue);
}

/**
 * Este componente permite agrupar varios componentes en uno solo.
 *
 * @param options
 * @param events
 */
StyledElements.Container = function(options, events) {
    var defaultOptions = {
        'extending': false,
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    // Necesario para permitir herencia
    if (options.extending)
        return;

    StyledElements.StyledElement.call(this, events);
    this.wrapperElement = document.createElement("div");
    this.childs = new Array();

    if (options['id'])
        this.wrapperElement.setAttribute("id", options['id']);

    this.wrapperElement.className = EzWebExt.prependWord(options['class'], "container");
}
StyledElements.Container.prototype = new StyledElements.StyledElement();

StyledElements.Container.prototype.appendChild = function(element) {
    if (element instanceof StyledElements.StyledElement) {
        element.insertInto(this);
        this.childs[this.childs.length] = element;
    } else {
        this.wrapperElement.appendChild(element);
    }
}

StyledElements.Container.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal : false;

    for (var i = 0; i < this.childs.length; i++)
        this.childs[i].repaint(temporal);
}

/**
 * Elimina el contenido de este contenedor.
 */
StyledElements.Container.prototype.clear = function() {
    this.childs = new Array();
    this.wrapperElement.innerHTML = "";
}

/**
 *
 */
StyledElements.StyledSelect = function(options) {
    options = EzWebExt.merge({
        'class': '',
        'initialEntries': [],
        'initialValue': null
    },
    options);

    StyledElements.StyledInputElement.call(this, options['initialValue'], ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = EzWebExt.prependWord(options['class'], "styled_select");

    var div =  document.createElement("div");
    div.className = "arrow";
    this.inputElement = document.createElement("select");

    if (options['name'])
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'])
        this.wrapperElement.setAttribute("id", options['id']);

    this.textDiv = document.createElement("div");
    this.textDiv.className = "text";

    this.optionsByValue = {};
    this.addEntries(options['initialEntries']);

    this.inputElement.addEventListener("change",
                                       EzWebExt.bind(function(event) {
                                           var optionList = event.target;
                                           this.textDiv.textContent = optionList[optionList.selectedIndex].text;
                                           this.events['change'].dispatch(this);
                                       }, this),
                                       true);

    this.wrapperElement.appendChild(this.textDiv);
    this.wrapperElement.appendChild(div);
    this.wrapperElement.appendChild(this.inputElement);

    // initialize the textDiv with the initial selection
    var selectedIndex = this.inputElement.options.selectedIndex;
    if (selectedIndex !== -1)
        this.textDiv.textContent = this.inputElement.options[selectedIndex].text;
}
StyledElements.StyledSelect.prototype = new StyledElements.StyledInputElement();

StyledElements.StyledSelect.prototype.setValue = function (newValue) {
    // TODO exception if the newValue is not listened in the option list?
    StyledElements.StyledInputElement.prototype.setValue.call(this, newValue);
    this.textDiv.innerHTML = this.optionsByValue[newValue];
}

StyledElements.StyledSelect.prototype.addEntries = function (newEntries) {
    var oldSelectedIndex = this.inputElement.options.selectedIndex;

    for (var i = 0; i < newEntries.length; i++) {
        var option = document.createElement("option");
        var optionValue = newEntries[i][0];
        var optionLabel = newEntries[i][1];
        optionLabel = optionLabel ? optionLabel : optionValue;

        option.setAttribute("value", optionValue);
        option.appendChild(document.createTextNode(optionLabel));

        if (this.defaultValue == optionValue) {
            option.setAttribute("selected", "selected");
        }

        this.inputElement.appendChild(option);
        this.optionsByValue[optionValue] = optionLabel;
    }

    // initialize the textDiv with the initial selection
    var selectedIndex = this.inputElement.options.selectedIndex;
    if (oldSelectedIndex !== selectedIndex)
        this.textDiv.textContent = this.inputElement.options[selectedIndex].text;
}

StyledElements.StyledSelect.prototype.clear = function () {
    // Clear textDiv
    this.textDiv.textContent = "";

    // Clear select element options
    var options = this.inputElement.textContent = "";

    this.optionsByValue = {};
}

/**
 * Este
 */
StyledElements.StyledList = function(options) {
    options = EzWebExt.merge({
        multivalued:    false,
        initialEntries: {},
        initialSelection: []
    },
    options);

    StyledElements.StyledElement.call(this, ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = "styled_list";

    this.content = document.createElement("div");
    this.wrapperElement.appendChild(this.content);

    if (options.name != null)
        this.inputElement.setAttribute("name", options.name);

    this.entries = [];
    this.entriesByValue = {};
    this.currentSelection = [];

    this.addEntries(options.initialEntries);
    this.select(options.initialSelection);

    /* Process options */
    if (options.full)
        EzWebExt.appendClassName(this.wrapperElement, "full");

    this.multivalued = options.multivalued;

    if (options.allowEmpty === undefined)
        this.allowEmpty = this.multivalued;
    else
        this.allowEmpty = options.allowEmpty;
}
StyledElements.StyledList.prototype = new StyledElements.StyledElement();

/**
 * AÃ±ade las entradas indicadas en la lista.
 */
StyledElements.StyledList.prototype.addEntries = function(entries) {
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var entryValue = entry[0];
        var entryText = entry[1] !== undefined ? entry[1] : entry[0];

        var row = document.createElement("div");
        row.className = "row";

        var context = {listComponent: this, value: entryValue};
        row.addEventListener("click",
                             EzWebExt.bind(function() {
                                 this.listComponent.toggleElementSelection(this.value);
                             }, context),
                             true);
        entry.element = row;

        row.appendChild(document.createTextNode(entryText));
        this.content.appendChild(row);

        this.entriesByValue[entryValue] = entry;
    }
    this.entries.concat(entries);
}

/**
 * Devuelve una copia de la selecciÃ³n actual.
 */
StyledElements.StyledList.prototype.getSelection = function() {
    return EzWebExt.clone(this.currentSelection);
}

/**
 * @private
 */
StyledElements.StyledList.prototype._cleanSelection = function() {
    for (var i = 0; i < this.currentSelection.length; i++) {
        var value = this.currentSelection[i];
        EzWebExt.removeClassName(this.entriesByValue[value].element, "selected");
    }
    this.currentSelection = [];
}

/**
 * Borra la seleccion actual.
 */
StyledElements.StyledList.prototype.cleanSelection = function() {
    if (this.currentSelection.length === 0)
        return;  // Nothing to do

    var oldSelection = this.currentSelection;

    this._cleanSelection();

    this.events['change'].dispatch(this, [], [], oldSelection);
}

/**
 * Cambia la selecciÃ³n actual a la indicada.
 *
 * @param {[]} selection lista de valores a seleccionar.
 */
StyledElements.StyledList.prototype.select = function(selection) {
    this._cleanSelection();

    this.addSelection(selection);
}

/**
 * AÃ±ade un conjunto de valores a la selecciÃ³n actual. No estÃ¡ contemplado, por
 * ahora, que se pueda pasar elementos ya seleccionados previamente (TODO).
 */
StyledElements.StyledList.prototype.addSelection = function(selection) {
    if (selection.length === 0)
        return;  // Nothing to do

    if (!this.multivalued) {
        this._cleanSelection();

        if (selection.length > 1)
            selection = selection.splice(0, 1);
    }

    for (var i = 0; i < selection.length; i++) {
        var entry = selection[i];
        EzWebExt.appendClassName(this.entriesByValue[entry].element, "selected");
        this.currentSelection.push(entry);
    }

    this.events['change'].dispatch(this, this.currentSelection, selection, []);
}

/**
 * Elimina un conjunto de valores de la selecciÃ³n actual.
 */
StyledElements.StyledList.prototype.removeSelection = function(selection) {
    if (selection.length === 0)
        return;  // Nothing to do

    for (var i = 0; i < selection.length; i++) {
        var entry = selection[i];
        EzWebExt.removeClassName(this.entriesByValue[entry].element, "selected");
        for (var j = 0; j < this.currentSelection.length; j++) {
            if (this.currentSelection[j] == entry) {
                this.currentSelection.splice(j, 1);
                EzWebExt.removeClassName(this.entriesByValue[entry].element, "selected");
                break;
            }
        }
    }

    this.events['change'].dispatch(this, this.currentSelection, [], selection);
}

/**
 * AÃ±ade o borra una entrada de la selecciÃ³n dependiendo de si el elemento estÃ¡
 * ya selecionado o no. En caso de que la entrada estuviese selecionado, el
 * elemento se eliminiaria de la selecciÃ³n y viceversa.
 */
StyledElements.StyledList.prototype.toggleElementSelection = function(element) {
    if (!EzWebExt.hasClassName(this.entriesByValue[element].element, "selected")) {
        this.addSelection([element]);
    } else if (this.allowEmpty) {
        this.removeSelection([element]);
    }
}

/**
 * AÃ±ade un campo de texto.
 */
StyledElements.StyledTextField = function(options) {
    var defaultOptions = {
        'initialValue': '',
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initialValue, ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = "styled_text_field";

    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "text");

    if (options['name'])
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    this.inputElement.setAttribute("value", options['initialValue']);

    var div = document.createElement("div");
    div.appendChild(this.inputElement);
    this.wrapperElement.appendChild(div);
}
StyledElements.StyledTextField.prototype = new StyledElements.StyledInputElement();

/**
 *
 */
StyledElements.StyledPasswordField = function(options) {
    var defaultOptions = {
        'initialValue': '',
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initialValue, ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = EzWebExt.prependWord(options['class'], 'styled_password_field');

    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "password");

    if (options['name'] !== undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    this.inputElement.setAttribute("value", options['initialValue']);

    var div = document.createElement("div");
    div.appendChild(this.inputElement);
    this.wrapperElement.appendChild(div);
}
StyledElements.StyledPasswordField.prototype = new StyledElements.StyledInputElement();

/**
 * @param options Una tabla hash con opciones. Los posibles valores son los
 * siguientes:
 *   - name: nombre que tendrÃ¡ el elemento input (sÃ³lo es necesario cuando se
 *     estÃ¡ creando un formulario).
 *   - class: lista de clases separada por espacios que se asignarÃ¡ al div
 *     principal de este Numeric Field. Independientemente del valor de esta
 *     opciÃ³n, siempre se le asignarÃ¡ la clase "styled_numeric_field" al div
 *     principal.
 *   - minValue: valor mÃ­nimo que permitirÃ¡ este Numeric Field.
 *   - maxValue: valor mÃ¡ximo que permitirÃ¡ este Numeric Field.
 *
 */
StyledElements.StyledNumericField = function(options) {
    var defaultOptions = {
        'initialValue': 0,
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initialValue, ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = "styled_numeric_field";
    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "text");

    if (options['name'] != undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    this.inputElement.setAttribute("value", options['initialValue']);

    this.inputElement.className = EzWebExt.prependWord(options['class'], "numeric_field");

    var topButton = document.createElement("button");
    topButton.className = "numeric_top_button";
    var bottomButton = document.createElement("button");
    bottomButton.className = "numeric_bottom_button";

    var inc = function(element, inc) {
        var value = element.value;
        if (!isNaN(Number(value))) {
            value =  parseInt(value) + inc;

            // Check for max & min values
            if ((inc > 0) && options['maxValue'] != undefined && value > options['maxValue'])
                value = options['maxValue'];
            else if ((inc < 0) && options['minValue'] != undefined && value < options['minValue'])
                value = options['minValue'];

            element.value = value;
        }
    };

    var text = this.inputElement;
    topButton.addEventListener("click",
                               function(event_) {
                                   inc(text, 1);
                               },
                               true);

    bottomButton.addEventListener("click",
                                  function(event_) {
                                      inc(text, -1);
                                  },
                                  true);

    var div = document.createElement("div");
    div.appendChild(this.inputElement);
    this.wrapperElement.appendChild(div);
    this.wrapperElement.appendChild(topButton);
    this.wrapperElement.appendChild(bottomButton);
}
StyledElements.StyledNumericField.prototype = new StyledElements.StyledInputElement();

/**
 * Este componente permite agrupar varios CheckBoxes o RadioButtons, con el
 * objetivo de tratarlos como un Ãºnico campo de entrada, permitiendo obtener y
 * establecer su valor, escuchar eventos de modificaciÃ³n, etc... etc...
 */
StyledElements.ButtonsGroup = function(name_) {
    StyledElements.StyledInputElement.call(this, "", ['change']);

    this.name_ = name_;
    this.buttons = [];
}
StyledElements.ButtonsGroup.prototype = new StyledElements.StyledInputElement();

/**
 * Devuelve el nombre que tiene asignado este ButtonsGroup.
 */
StyledElements.ButtonsGroup.prototype.getName = function() {
    return this.name_;
}

/**
 * @private
 */
StyledElements.ButtonsGroup.prototype.insertButton = function(button) {
    this.buttons[this.buttons.length] = button;
    button.addEventListener('change',
                            EzWebExt.bind(function () {
                                var changeHandlers = this.events['change'].dispatch(this);
                            }, this),
                            true);
}

StyledElements.ButtonsGroup.prototype.getValue = function() {
    if (this.buttons[0] instanceof StyledElements.StyledCheckBox) {
        var result = [];

        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                result[result.length] = this.buttons[i].inputElement.value;
        }

        return result;
    } else {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                return [this.buttons[i].inputElement.value];
        }
        return [];
    }
}

StyledElements.ButtonsGroup.prototype.reset = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].reset();
    }
}

/**
 * Devuelve una lista de los elementos StyledCheckBox o StyledRadioButton
 * selecionados. En caso de que la selecciÃ³n este vaciÃ¡, este mÃ©todo devolverÃ¡
 * una lista vacÃ­a y en caso de que este ButtonGroup este formado por
 * StyledRadioButtons, la selecciÃ³n serÃ¡ como mucho de un elemento.
 */
StyledElements.ButtonsGroup.prototype.getSelectedButtons = function() {
    if (this.buttons[0] instanceof StyledElements.StyledCheckBox) {
        var result = [];

        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                result[result.length] = this.buttons[i];
        }

        return result;
    } else {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                return [this.buttons[i]];
        }
        return [];
    }
}

/**
 *
 */
StyledElements.StyledCheckBox = function(nameGroup_, value, options) {
    var defaultOptions = {
        'initiallyChecked': false,
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initiallyChecked, ['change']);

    this.wrapperElement = document.createElement("input");

    this.wrapperElement.setAttribute("type", "checkbox");
    this.wrapperElement.setAttribute("value", value);
    this.inputElement = this.wrapperElement;

    if (options['name'] != undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['initiallyChecked'] == true)
        this.inputElement.setAttribute("checked", true);

    if (nameGroup_ instanceof StyledElements.ButtonsGroup) {
        this.wrapperElement.setAttribute("name", nameGroup_.getName());
        nameGroup_.insertButton(this);
    } else if (nameGroup_) {
        this.wrapperElement.setAttribute("name", nameGroup_);
    }

    /* Internal events */
    this.inputElement.addEventListener('change',
                                       EzWebExt.bind(function () {
                                           this.events['change'].dispatch(this);
                                       }, this),
                                       true);
}
StyledElements.StyledCheckBox.prototype = new StyledElements.StyledInputElement();

StyledElements.StyledCheckBox.prototype.reset = function() {
    this.inputElement.checked = this.defaultValue;
}

StyledElements.StyledCheckBox.prototype.setValue = function(newValue) {
    this.inputElement.checked = newValue;
}

/**
 *
 */
StyledElements.StyledRadioButton = function(nameGroup_, value, options) {
    var defaultOptions = {
        'initiallyChecked': false,
        'class': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initiallyChecked, ['change']);

    this.wrapperElement = document.createElement("input");

    this.wrapperElement.setAttribute("type", "radio");
    this.wrapperElement.setAttribute("value", value);
    this.inputElement = this.wrapperElement;

    if (options['name'] != undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['initiallyChecked'] == true)
        this.inputElement.setAttribute("checked", true);

    if (nameGroup_ instanceof StyledElements.ButtonsGroup) {
        this.wrapperElement.setAttribute("name", nameGroup_.getName());
        nameGroup_.insertButton(this);
    } else if (nameGroup_) {
        this.wrapperElement.setAttribute("name", nameGroup_);
    }

    /* Internal events */
    this.inputElement.addEventListener('change',
                                       EzWebExt.bind(function () {
                                           this.events['change'].dispatch(this);
                                       }, this),
                                       true);
}
StyledElements.StyledRadioButton.prototype = new StyledElements.StyledInputElement();

StyledElements.StyledRadioButton.prototype.reset = function() {
    this.inputElement.checked = this.defaultValue;
}

StyledElements.StyledRadioButton.prototype.setValue = function(newValue) {
    this.inputElement.checked = newValue;
}

/**
 * El componente Styled HPaned crea dos paneles separados por un separador y
 * que permite redimensionar los dos paneles a la vez con el objetivo de que
 * siguan ocupando el mismo espacio en conjunto.
 *
 * @param options Opciones admitidas:
 *                -{Number} handlerPosition Indica la posiciÃ³n en la que estarÃ¡
 *                 el separador inicialmente. Esta posiciÃ³n deberÃ¡ ir indicada
 *                 en porcentajes. Valor por defecto: 50.
 *                -{Number} leftMinWidth Indica el tamaÃ±o mÃ­nimo que tendrÃ¡ el
 *                 panel izquierdo del componente. Este tamaÃ±o mÃ­nimo tiene que
 *                 ir en pixels.
 *                -{Number} rightMinWidth Indica el tamaÃ±o mÃ­nimo que tendrÃ¡ el
 *                 panel derecho del componente. Este tamaÃ±o mÃ­nimo tiene que
 *                 ir en pixels.
 */
StyledElements.StyledHPaned = function(options) {
    StyledElements.StyledElement.call(this, []);

    var defaultOptions = {
        'class': '',
        'full': true,
        'handlerPosition': 50,
        'leftContainerOptions': {'class': ''},
        'leftMinWidth': 0,
        'rightMinWidth': 0,
        'rightContainerOptions': {'class': ''}
    };
    options = EzWebExt.merge(defaultOptions, options);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = EzWebExt.prependWord(options['class'], "hpaned");

    /* Force leftpanel class */
    options.leftContainerOptions['class'] = EzWebExt.prependWord(options.leftContainerOptions['class'], 'leftpanel');
    this.leftPanel = new StyledElements.Container(options.leftContainerOptions);

    this.handler = document.createElement("div");
    this.handler.className = "handler";

    /* Force rightpanel class */
    options.rightContainerOptions['class'] = EzWebExt.prependWord(options.rightContainerOptions['class'], 'rightpanel');
    this.rightPanel = new StyledElements.Container(options.rightContainerOptions);

    this.leftPanel.insertInto(this.wrapperElement);
    this.wrapperElement.appendChild(this.handler);
    this.rightPanel.insertInto(this.wrapperElement);

    this.handlerPosition = options['handlerPosition'];
    this.leftMinWidth = options['leftMinWidth'];
    this.rightMinWidth = options['rightMinWidth'];

    /* Process other options */
    if (options['name'] !== undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['full'])
        EzWebExt.appendClassName(this.wrapperElement, 'full');

    /*
     * Code for handling internal hpaned events
     */
    var hpaned = this;
    var xStart, handlerPosition, hpanedWidth;

    function endresize(e) {
        e = e || window.event;

        document.oncontextmenu = null; //reenable context menu
        document.onmousedown = null; //reenable text selection

        document.removeEventListener("mouseup", endresize, true);
        document.removeEventListener("mousemove", resize, true);

        hpaned.repaint(false);

        hpaned.handler.addEventListener("mousedown", startresize, true);
    }

    function resize(e) {
        e = e || window.event;
        var screenX = parseInt(e.screenX);
        xDelta = xStart - screenX;
        xStart = screenX;
        handlerPosition = hpanedWidth * (handlerPosition / 100);
        handlerPosition -= xDelta;
        handlerPosition = (handlerPosition / hpanedWidth) * 100;
        if (handlerPosition > 100)
            hpaned.handlerPosition = 100;
        else if (handlerPosition < 0)
            hpaned.handlerPosition = 0;
        else
            hpaned.handlerPosition = handlerPosition;

        hpaned.repaint(true);
    }

    function startresize(e) {
        e = e || window.e; // Needed for IE

        document.oncontextmenu = function() { return false; }; //disable context menu
        document.onmousedown = function() { return false; }; //disable text selection
        hpaned.handler.removeEventListener("mousedown", startresize, true);

        xStart = parseInt(e.screenX);
        hpanedWidth = hpaned.wrapperElement.parentNode.offsetWidth - 5;
        handlerPosition = hpaned.handlerPosition;

        document.addEventListener("mousemove", resize, true);
        document.addEventListener("mouseup", endresize, true);
    }

    hpaned.handler.addEventListener("mousedown", startresize, true);
}
StyledElements.StyledHPaned.prototype = new StyledElements.StyledElement();

StyledElements.StyledHPaned.prototype.insertInto = function (element, refElement) {
    StyledElements.StyledElement.prototype.insertInto.call(this, element, refElement);

    this.repaint();
    window.addEventListener("resize",
                            EzWebExt.bind(this.repaint, this),
                            true);
}

StyledElements.StyledHPaned.prototype.getLeftPanel = function () {
    return this.leftPanel;
}

StyledElements.StyledHPaned.prototype.getRightPanel = function () {
    return this.rightPanel;
}

StyledElements.StyledHPaned.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal: false;

    var parentElement = this.wrapperElement.parentNode;
    if (!parentElement)
        return; // nothing to do

    var width = parentElement.offsetWidth - 5;

    var handlerMiddle = Math.floor(width * (this.handlerPosition / 100));

    var newLeftPanelWidth = handlerMiddle;
    if (newLeftPanelWidth <  this.leftMinWidth) {
        handlerMiddle += this.leftMinWidth - newLeftPanelWidth;
        newLeftPanelWidth = this.leftMinWidth;
    }

    var newRightPanelWidth = width - handlerMiddle;
    if (newRightPanelWidth <  this.rightMinWidth) {
        handlerMiddle -= this.rightMinWidth - newRightPanelWidth;
        newRightPanelWidth = this.rightMinWidth;
        newLeftPanelWidth = handlerMiddle;
    }


    /* Real width update */
    this.leftPanel.wrapperElement.style.width = newLeftPanelWidth + "px";
    this.rightPanel.wrapperElement.style.width = newRightPanelWidth + "px";
    this.handler.style.left = handlerMiddle + "px";

    /* Propagate resize event */
    this.leftPanel.repaint(temporal);
    this.rightPanel.repaint(temporal);
}

/**
 * Este compontente representa a un tab de un notebook.
 */
StyledElements.Tab = function(id, notebook, options) {
    if (!(notebook instanceof StyledElements.StyledNotebook))
        throw Exception("Invalid notebook argument");

    var defaultOptions = {
        'closeable': true,
        'containerOptions': {},
        'name': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    this.tabId = id;
    this.notebook = notebook;

    this.tabElement = document.createElement("div");
    this.tabElement.className = "tab";
    this.name = document.createTextNode(options.name);
    this.tabElement.appendChild(this.name);

    /* call to the parent constructor */
    StyledElements.Container.call(this, options['containerOptions'], ['close']);

    EzWebExt.prependClassName(this.wrapperElement, "tab hidden"); // TODO

    this.tabElement.addEventListener("click",
                                EzWebExt.bind(function () {
                                    this.notebook.goToTab(this.tabId);
                                }, this),
                                false);


    /* Process options */
    if (options.closeable) {
        var closeButton = document.createElement("div");
        closeButton.className = "close_button";
        closeButton.appendChild(document.createTextNode("X"));
        this.tabElement.appendChild(closeButton);

        closeButton.addEventListener("click",
                                     EzWebExt.bind(function (e) {
                                         this.close();
                                         e.stopPropagation();
                                         return false;
                                     }, this),
                                     true);
    }

    if (options.title !== undefined)
        this.setTitle(options.title);
}
StyledElements.Tab.prototype = new StyledElements.Container({extending: true});

/**
 * Elimina este Tab del notebook al que estÃ¡ asociado.
 */
StyledElements.Tab.prototype.close = function() {
    this.notebook.removeTab(this.tabId);
}

/**
 * Establece el texto que se mostrarÃ¡ dentro de la pestaÃ±a que se mostrarÃ¡ en
 * <code>notebook</code> y que representarÃ¡ al contenido de este
 * <code>Tab</code>.
 */
StyledElements.Tab.prototype.rename = function(newName) {
    this.name.textContent = newName;
}

/**
 * Establece el texto que se mostrarÃ¡, mediante un dialogo popup, cuando el
 * puntero del ratÃ³n este encima de la pestaÃ±a simulando al atributo "title" de
 * los elementos HTML.
 */
StyledElements.Tab.prototype.setTitle = function(newTitle) {
    this.tabElement.setAttribute("title", newTitle);
}

StyledElements.Tab.prototype.setVisible = function (newStatus) {
    if (newStatus) {
        EzWebExt.appendClassName(this.tabElement, "selected");
        EzWebExt.removeClassName(this.wrapperElement, "hidden");
    } else {
        EzWebExt.removeClassName(this.tabElement, "selected");
        EzWebExt.appendClassName(this.wrapperElement, "hidden");
    }
}

StyledElements.Tab.prototype.getId = function() {
    return this.tabId;
}

/**
 * TODO change this.
 */
StyledElements.Tab.prototype.getTabElement = function() {
    return this.tabElement;
}

/**
 * El componente Styled Notebook crea dos paneles separados por un separador y
 * que permite redimensionar los dos paneles a la vez con el objetivo de que
 * siguan ocupando el mismo espacio en conjunto.
 *
 * @param options opciones soportadas:
 *                - focusOnSetVisible: hace que se ponga el foco en las
 *                  pestaÃ±as al hacerlas visibles (<code>true</code> por
 *                  defecto).
 *
 * Eventos que soporta este componente:
 *      - change: evento lanzado cuando se cambia la pestaÃ±a.
 *      - tabDeletion: evento lanzado cuando se elimina algÃºn tab del notebook.
 *      - tabInsertion: evento lanzado cuando se crea e inserta un nuevo tab en
 *        el notebook.
 */
StyledElements.StyledNotebook = function(options) {
    StyledElements.StyledElement.call(this, ['change', 'tabDeletion', 'tabInsertion']);

    var defaultOptions = {
        'class': '',
        'focusOnSetVisible': true,
        'full': true
    };
    options = EzWebExt.merge(defaultOptions, options);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = EzWebExt.prependWord(options['class'], "notebook");

    var div = document.createElement("div");
    this.wrapperElement.appendChild(div);

    this.tabArea = document.createElement("div");
    this.tabArea.className = "tab_area";
    div.appendChild(this.tabArea);

    this.moveLeftButton = document.createElement("div");
    this.moveLeftButton.className = "move_left";
    this.moveLeftButton.appendChild(document.createTextNode("<"));
    this.tabArea.appendChild(this.moveLeftButton);

    this.moveRightButton = document.createElement("div");
    this.moveRightButton.className = "move_right";
    this.moveRightButton.appendChild(document.createTextNode(">"));
    this.tabArea.appendChild(this.moveRightButton);

    this.contentArea = document.createElement("div");
    this.contentArea.className = "wrapper";
    div.appendChild(this.contentArea);

    this.tabs = new Array();
    this.tabsById = new Array();
    this.visibleTab = null;
    this.firstVisibleTab = 0;
    this.visibleTabs = 0;

    /* Process options */
    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['full'])
        EzWebExt.appendClassName(this.wrapperElement, 'full');

    this.focusOnSetVisible = options.focusOnSetVisible;

    /* Code for handling internal events */
    this.moveLeftButton.addEventListener("click",
                                         EzWebExt.bind(this.shiftLeftTabs, this),
                                         true);

    this.moveRightButton.addEventListener("click",
                                         EzWebExt.bind(this.shiftRightTabs, this),
                                         true);

}
StyledElements.StyledNotebook.prototype = new StyledElements.StyledElement();

/**
 * @private
 */
StyledElements.StyledNotebook.prototype._enableDisableButtons = function() {
    if (this.firstVisibleTab > 0)
        EzWebExt.appendClassName(this.moveLeftButton, "enabled");
    else
        EzWebExt.removeClassName(this.moveLeftButton, "enabled");

    if (this.tabs.length - this.firstVisibleTab - this.visibleTabs > 0)
        EzWebExt.appendClassName(this.moveRightButton, "enabled");
    else
        EzWebExt.removeClassName(this.moveRightButton, "enabled");
}

/**
 * Desplaza las pestaÃ±as a la izquierda.
 */
StyledElements.StyledNotebook.prototype.shiftLeftTabs = function() {
    if (this.firstVisibleTab == 0)
        return;

    this.firstVisibleTab--;
    EzWebExt.removeClassName(this.tabs[this.firstVisibleTab].getTabElement(), "hidden");
    this.visibleTabs++;

    for (var i = this.firstVisibleTab + this.visibleTabs - 1; i > this.firstVisibleTab; i--) {
        var currentTab = this.tabs[i].getTabElement();
        if (currentTab.offsetTop != 0) {
            this.visibleTabs--;
            EzWebExt.appendClassName(currentTab, "hidden");
        } else {
            break;
        }
    }

    this._enableDisableButtons();
}

/**
 * Desplaza las pestaÃ±as a la derecha.
 */
StyledElements.StyledNotebook.prototype.shiftRightTabs = function() {
    if (this.tabs.length - this.firstVisibleTab - this.visibleTabs <= 0)
        return;

    EzWebExt.appendClassName(this.tabs[this.firstVisibleTab].getTabElement(), "hidden");
    this.firstVisibleTab++;
    this.visibleTabs--;

    for (var i = this.firstVisibleTab + this.visibleTabs; i < this.tabs.length; i++) {
        var currentTab = this.tabs[i].getTabElement();
        this.visibleTabs++;
        EzWebExt.removeClassName(currentTab, "hidden");
        if (this.tabArea.offsetHeight != this.tabArea.scrollHeight) {
            this.visibleTabs--;
            EzWebExt.appendClassName(currentTab, "hidden");
            break;
        }
    }

    this._enableDisableButtons();
}

StyledElements.StyledNotebook.prototype.insertInto = function (element, refElement) {
    StyledElements.StyledElement.prototype.insertInto.call(this, element, refElement);

    this.repaint();
}

/**
 * Crea un Tab y lo asocia con este notebook.
 *
 * @param options opciones de la pestaÃ±a:
 *                - containerOptions: indica las opciones particulares del
 *                  contenedor que se crearÃ¡ para el contenido del Tab. Para
 *                  ver las opciones disponibles ver el constructor de
 *                  <code>Container</code>. Valor por defecto: {}.
 *                - closeable: indica si se le permitirÃ¡ al usuario cerrar
 *                  la pestaÃ±a mediante el botÃ³n cerrar (botÃ³n que sÃ³lo aparece
 *                  si la pestaÃ±a es "closeable"). Valor por defecto: true.
 *                - name: indica el texto inicial que se mostrarÃ¡ dentro de la
 *                  pestaÃ±a. Valor por defecto: "".
 *                - title: indica el "title" inicial que tendrÃ¡ el Tab (ver el
 *                  mÃ©todo Tab.setTitle).
 */
StyledElements.StyledNotebook.prototype.createTab = function(options) {
    var defaultOptions = {
        'initiallyVisible': false,
        'name': ''
    };
    options = EzWebExt.merge(defaultOptions, options);

    // Reserve an id for the new tab
    var tabId = this.tabsById.push(null);

    // Create the tab
    var tab = new StyledElements.Tab(tabId, this, options);

    // Insert it into our hashes
    this.tabs[this.tabs.length] = tab;
    this.tabsById[tabId] = tab;

    var tabElement = tab.getTabElement();
    this.tabArea.appendChild(tabElement);
    tab.insertInto(this.contentArea);

    if (!this.visibleTab) {
        this.visibleTab = tab;
        this.firstVisibleTab = 0;
        tab.setVisible(true);
    }

    if (tabElement.offsetTop == 0) {
        this.visibleTabs++;
    } else {
        EzWebExt.appendClassName(tabElement, "hidden");
    }

    // Enable/Disable tab moving buttons
    this._enableDisableButtons();

    /* Process options */
    if (options.initiallyVisible)
        this.goToTab(tabId);

    // Event dispatch
    this.events['tabInsertion'].dispatch(this);

    /* Return the container associated with the newly created tab */
    return tab;
}

/**
 * Devuelve la instancia de la pestaÃ±a indicada mediante su identificador.
 *
 * @param id identificador de la pestaÃ±a que se quiere recuperar.
 * @returns {Tab}
 */
StyledElements.StyledNotebook.prototype.getTab = function(id) {
    return this.tabsById[id];
}

/**
 * Devuelve la pesataÃ±a que estÃ¡ actualmente en la posiciÃ³n indicada.
 *
 * @param index indice de la pestaÃ±a de la que se quiere conocer el
 * identificador de pestaÃ±a.
 * @returns {Tab}
 */
StyledElements.StyledNotebook.prototype.getTabByIndex = function(index) {
    return this.tabs[index];
}

/**
 * Devuelve la posiciÃ³n actual de la pestaÃ±a indicada mediante su identificador.
 * Esta operaciÃ³n es lenta, por lo que no conviene abusar de ella.
 *
 * @param id identificador de la pestaÃ±a de la que se quiere conocer su posiciÃ³n
 * actual.
 */
StyledElements.StyledNotebook.prototype.getTabIndex = function(id) {
    for (var i = 0; i < this.tabs.length; i++) {
         if (this.tabs[i].getId() == id)
             return i;
    }
    return null;
}

/**
 * Elimina del notebook la pestaÃ±a indicada mediante su identificador.
 * @param id identificador de la pestaÃ±a que se quiere eliminar.
 */
StyledElements.StyledNotebook.prototype.removeTab = function(id) {
    if (!this.tabsById[id])
        return;

    delete this.tabsById[id];
    var index = this.getTabIndex(id);
    var tabToExtract = this.tabs.splice(index, 1)[0];

    this.tabArea.removeChild(tabToExtract.getTabElement());
    this.contentArea.removeChild(tabToExtract.wrapperElement); // TODO create a method for removeFrom

    if (!EzWebExt.hasClassName(tabToExtract.getTabElement(), "hidden")) {
        this.visibleTabs--;

        for (var i = this.firstVisibleTab + this.visibleTabs; i < this.tabs.length; i++) {
            var currentTab = this.tabs[i].getTabElement();
            this.visibleTabs++;
            EzWebExt.removeClassName(currentTab, "hidden");
            if (this.tabArea.offsetHeight != this.tabArea.scrollHeight) {
                this.visibleTabs--;
                EzWebExt.appendClassName(currentTab, "hidden");
                break;
            }
        }

        if (this.firstVisibleTab == this.tabs.length) {
            if (this.tabs.length > 0) {
                var lastTabId = this.tabs[this.firstVisibleTab - 1].getId();
                this.focus(lastTabId);
            } else {
                this.firstVisibleTab = 0;
            }
        }
    }

    if (this.visibleTab == tabToExtract) {
      this.visibleTab = null;
      if (index == this.tabs.length) {
        if (this.tabs.length > 0) {
            var lastTabId = this.tabs[index - 1].getId();
            this.goToTab(lastTabId);
        } /* else
           notify */
      } else {
        this.goToTab(this.tabs[index].getId());
      }
    }

    // Enable/Disable tab moving buttons
    this._enableDisableButtons();

    // Send specific tab close event
    tabToExtract.events['close'].dispatch(tabToExtract, this);

    // Event dispatch
    this.events['tabDeletion'].dispatch(this, tabToExtract);
}

/**
 * Marca la pestaÃ±a indicada mediante su identificador como visible, haciendo
 * que el contenido de esta sea visible. En caso de que el notebook fuera
 * creado con la opciÃ³n "focusOnSetVisible" activada, ademÃ¡s se le pasarÃ¡ el
 * foco a la pestaÃ±a asociada.
 *
 * @param id identificador de la pestaÃ±a que se quiere eliminar.
 */
StyledElements.StyledNotebook.prototype.goToTab = function(id) {
    var newTab = this.tabsById[id];
    var oldTab = this.visibleTab;
    if (this.visibleTab && newTab == this.visibleTab)
        return;

    this.events['change'].dispatch(this, oldTab, newTab);

    if (this.visibleTab)
        this.visibleTab.setVisible(false);

    this.visibleTab = newTab;
    this.visibleTab.setVisible(true);

    if (this.focusOnSetVisible)
        this.focus(id);
}

/**
 * Devuelve el nÃºmero de pestaÃ±as disponibles actualmente en este notebook.
 */
StyledElements.StyledNotebook.prototype.getNumberOfTabs = function() {
    return this.tabs.length;
}

/**
 * Establece el foco en la pestaÃ±a indicada, esto es, fuerza a que sea visible
 * la pestaÃ±a en el area de pestaÃ±as del notebook.
 */
StyledElements.StyledNotebook.prototype.focus = function(tabId) {
    var tabElement = this.tabsById[tabId].getTabElement();
    if (!EzWebExt.hasClassName(tabElement, "hidden"))
        return; // Nothing to do

    var newIndex = this.getTabIndex(tabId);
    if (newIndex < this.firstVisibleTab) {
        var offset = this.firstVisibleTab - newIndex;
        for (var i = 0; i < offset; i++)
            this.shiftLeftTabs();
    } else {
        do {
            this.shiftRightTabs();
        } while (EzWebExt.hasClassName(tabElement, "hidden"))
    }
}

StyledElements.StyledNotebook.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal: false;

    var parentElement = this.wrapperElement.parentNode;
    if (!parentElement)
        return; // nothing to do

    // Resize tab area
    if (!temporal) {
        var i;
        var resizeNeeded = this.tabArea.offsetHeight != this.tabArea.scrollHeight;
        if (resizeNeeded) {
            for (i = this.firstVisibleTab; i < this.tabs.length; i++) {
                var currentTab = this.tabs[i].getTabElement();
                if (currentTab.offsetTop != 0) {
                    this.visibleTabs = i - this.firstVisibleTab;
                    break;
                }
            }
            for (; i < this.tabs.length; i++) {
                var currentTab = this.tabs[i].getTabElement();
                EzWebExt.appendClassName(currentTab, "hidden");
            }
            EzWebExt.appendClassName(this.moveLeftButton, "enabled");
        } else if ((this.tabs.length - this.firstVisibleTab) > 0) {
            for (i = this.firstVisibleTab + this.visibleTabs; i < this.tabs.length; i++) {
                var currentTab = this.tabs[i].getTabElement();
                this.visibleTabs++;
                EzWebExt.removeClassName(currentTab, "hidden");
                if (this.tabArea.offsetHeight != this.tabArea.scrollHeight) {
                    this.visibleTabs--;
                    EzWebExt.appendClassName(currentTab, "hidden");
                    break;
                }
            }
        }

        // Enable/Disable tab moving buttons
        this._enableDisableButtons();
    }

    // Resize content
    if (this.visibleTab)
        this.visibleTab.repaint(temporal);
}


/** 
 * Muestra un diÃ¡logo de alerta con un mensaje, tÃ­tulo e icono.
 *
 * TODO rellenar la documentaciÃ³n
 *
 * @param title
 * @param content
 * @param options Opciones disponibles:
 *         -minWidth:
 *         -maxWidth:
 *         -minWidth:
 *         -maxWidth:
 *         -type: Indica el tipo de mesaje que se quiere mostrar. Los valores
 *          disponibles son: EzWebExt.ALERT_INFO, EzWebExt.ALERT_WARNING,
 *          EzWebExt.ALERT_ERROR. Valor por defecto: EzWebExt.ALERT_INFO.
 */
StyledElements.StyledAlert = function(title, content, options) {
    var defaultOptions = {
        'minWidth': 200,
        'maxWidth': 400,
        'minHeight': 100,
        'maxHeight': 200,
        'type': EzWebExt.ALERT_INFO
    };
    this.options = EzWebExt.merge(defaultOptions, options);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = "styled_alert";

    this.messageDiv = document.createElement("div");
    this.messageDiv.className = "message";
    this.wrapperElement.appendChild(this.messageDiv);

    this.header = document.createElement("div");
    this.header.className = "header";
    if (title)
        this.header.appendChild(document.createTextNode(title));
    this.messageDiv.appendChild(this.header);

    var button = document.createElement("div");
    button.className = "close_button";
    this.messageDiv.appendChild(button);

    this.icon = document.createElement("div");
    this.icon.className = "icon";
    this.messageDiv.appendChild(this.icon);

    this.content = document.createElement("div");
    this.content.className = "content";
    if (content)
        this.content.innerHTML = content;
    this.messageDiv.appendChild(this.content);

    var types = ["info", "warning", "error"];
    EzWebExt.prependClassName(this.wrapperElement, types[this.options['type']]);

    /* Events code */
    button.addEventListener("click",
                            EzWebExt.bind(function () {
                                EzWebExt.removeFromParent(this.wrapperElement);
                            }, this),
                            true);
}
StyledElements.StyledAlert.prototype = new StyledElements.StyledElement();

StyledElements.StyledAlert.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal: false;

/*    var width = (EzWebExt.getWidth() * 80 / 100);
    var height = (EzWebExt.getHeight() * 80 / 100);

    width = (width > this.options['max_width']) ? this.options['max_width']:
                ((width < this.options['min_width']) ? this.options['min_width'] : width);
    height = (height > this.options['max_height']) ? this.options['max_height']:
                ((height < this.options['min_height']) ? this.options['min_height'] : height);
*/
}

/**
 * @experimental
 *
 * Permite ejecutar secuencialmente distintos comandos. Dado que javascript no
 * tiene un interfaz para manejo de hilos, esto realmente sÃ³lo es necesario en
 * los casos en los que la concurrencia provenga a travÃ©s de alguno de los
 * mecanismos de seÃ±ales soportados por javascript (de momento, estos son los
 * eventos, los temporizadores y las peticiones asÃ­ncronas mediante el objeto
 * XMLHttpRequest).
 */
var CommandQueue = function (context, initFunc, stepFunc) {
    var running = false;
    var elements = new Array();
    var step = 0;
    var stepTimes = null;

    function doStep() {
      if (stepFunc(step, context)) {
          setTimeout(doStep, stepTimes[step] - (new Date()).getTime());
          step++;
      } else {
          doInit()
      }
    }

    function doInit() {
        var command;
        do {
            command = elements.shift();
        } while (command != undefined && !(stepTimes = initFunc(context, command)));

        if (command != undefined) {
            step = 0;
            setTimeout(doStep, stepTimes[step] - (new Date()).getTime());
        } else {
            running = false;
        }
    }

    /**
     * AÃ±ade un comando a la cola de procesamiento. El comando serÃ¡ procesado
     * despues de que se procesen todos los comandos aÃ±adidos anteriormente.
     *
     * @param command comando a aÃ±adir a la cola de procesamiento. El tipo de
     * este pÃ¡rametro tiene que ser compatible con las funciones initFunc y
     * stepFunc pasadas en el constructor.
     */
    this.addCommand = function(command) {
        var len = elements.push(command);

        if (!running) {
            running = true;
            doInit();
        }
    }
}

/**
 * Este compontente representa al contenedor para una alternativa usable por el
 * componente StyledAlternatives.
 */
StyledElements.Alternative = function(id, initialName, options) {
    var defaultOptions = {};
    options = EzWebExt.merge(defaultOptions, options);

    this.altId = id;

    /* call to the parent constructor */
    StyledElements.Container.call(this, options, []);

    EzWebExt.appendClassName(this.wrapperElement, "hidden"); // TODO
}
StyledElements.Alternative.prototype = new StyledElements.Container({extending: true});

StyledElements.Alternative.prototype.setVisible = function (newStatus) {
    if (newStatus)
        EzWebExt.removeClassName(this.wrapperElement, "hidden");
    else
        EzWebExt.appendClassName(this.wrapperElement, "hidden");
}

StyledElements.Alternative.prototype.getId = function() {
    return this.altId;
}

/**
 * El componente Styled Alternatives permite guardar una colecciÃ³n de
 * contenedores, de los cuales sÃ³lo uno estarÃ¡ visible en el area asociada al
 * componente Alternatives.
 */
StyledElements.StyledAlternatives = function(options) {
    var defaultOptions = {
        'class': '',
        'full': true,
        'defaultEffect': 'None'
    };

    options = EzWebExt.merge(defaultOptions, options);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = EzWebExt.prependWord(options['class'], "alternatives");

    this.contentArea = document.createElement("div");
    this.contentArea.className = "wrapper";
    this.wrapperElement.appendChild(this.contentArea);

    this.visibleAlt = null;
    this.alternatives = new Array();

    /* Process options */
    if (options['id'])
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['full'])
        EzWebExt.appendClassName(this.wrapperElement, "full");

    this.defaultEffect = options['defaultEffect'];

    /* Transitions code */
    var context = {alternativesObject: this,
                   inAlternative: null,
                   outAlternative: null,
                   width: null,
                   steps: null,
                   step: null,
                   inc: null};

    var stepFunc = function(step, context) {
        var offset = Math.floor(step * context.inc);

        if (context.inc < 0) {
           var newLeftPosOut = offset;
           var newLeftPosIn = context.width + offset;
        } else {
           var newLeftPosOut = offset;
           var newLeftPosIn = -context.width + offset;
        }

        if ((context.inc < 0) && (newLeftPosIn > 0) ||
            (context.inc > 0) && (newLeftPosOut < context.width)) {
          context.outAlternative.wrapperElement.style.left = newLeftPosOut + "px";
          context.inAlternative.wrapperElement.style.left = newLeftPosIn + "px";
          return true;  // we need to do more iterations
        } else {
          // Finish current transition
          context.outAlternative.setVisible(false);
          context.outAlternative.wrapperElement.style.left = null;
          context.outAlternative.wrapperElement.style.width = null;
          context.inAlternative.wrapperElement.style.left = null;
          context.inAlternative.wrapperElement.style.width = null;

          context.alternativesObject.visibleAlt = context.inAlternative;
          return false; // we have finished here
        }
    };

    var initFunc = function(context, command) {
        context.outAlternative = context.alternativesObject.visibleAlt;
        context.inAlternative = command;
        if (context.inAlternative != null)
                context.inAlternative = context.alternativesObject.alternatives[context.inAlternative];

        if (context.inAlternative == null || context.inAlternative == context.outAlternative)
            return false; // we are not going to process this command

        var baseTime = (new Date()).getTime() + 150;

        context.width = context.alternativesObject.wrapperElement.offsetWidth;
        context.inAlternative.wrapperElement.style.width = context.width + "px";
        context.outAlternative.wrapperElement.style.width = context.width + "px";
        context.inAlternative.setVisible(true);

        var stepTimes = [];
        // TODO
        switch (context.alternativesObject.defaultEffect) {
        case StyledElements.StyledAlternatives.HORIZONTAL_SLICE:
            context.steps = 6;
            for (var i = 0; i <= context.steps; i++)
               stepTimes[i] = baseTime + (i * 150);

            context.inc = Math.floor(context.width / context.steps);
            if (context.inAlternative.getId() > context.outAlternative.getId()) {
                context.inAlternative.wrapperElement.style.left = context.width + "px";
                context.inc = -context.inc;
            } else {
                context.inAlternative.wrapperElement.style.left = -context.width + "px";
            }
        // TODO
        default:
        case StyledElements.StyledAlternatives.NONE:
            context.steps = 1;
            stepTimes[0] = baseTime;

            context.inc = Math.floor(context.width / context.steps);
            if (context.inAlternative.getId() > context.outAlternative.getId()) {
                context.inAlternative.wrapperElement.style.left = context.width + "px";
                context.inc = -context.inc;
            } else {
                context.inAlternative.wrapperElement.style.left = -context.width + "px";
            }
        }

        return stepTimes; // we have things to do
    }

    this.transitionsQueue = new CommandQueue(context, initFunc, stepFunc);

}
StyledElements.StyledAlternatives.prototype = new StyledElements.StyledElement();
StyledElements.StyledAlternatives.HORIZONTAL_SLICE = "HorizontalSlice";
StyledElements.StyledAlternatives.NONE = "HorizontalSlice";

StyledElements.StyledAlternatives.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal: false;

    var parentElement = this.wrapperElement.parentNode;
    if (!parentElement)
        return; // nothing to do

    // Resize content
    for (var i = 0; i < this.alternatives.length; i++)
        this.alternatives[i].repaint(temporal);
}

StyledElements.StyledAlternatives.prototype.createAlternative = function(options) {
    var defaultOptions = {
        'containerOptions': {}
    };
    options = EzWebExt.merge(defaultOptions, options);

    var altId = this.alternatives.length;
    var alt = new StyledElements.Alternative(altId, options['containerOptions']);

    alt.insertInto(this.contentArea);

    this.alternatives[altId] = alt;

    if (!this.visibleAlt) {
        this.visibleAlt = alt;
        alt.setVisible(true);
    }

    /* Return the alternative container */
    return alt;
}

StyledElements.StyledAlternatives.prototype.showAlternative = function(id) {
    this.transitionsQueue.addCommand(id);
}



