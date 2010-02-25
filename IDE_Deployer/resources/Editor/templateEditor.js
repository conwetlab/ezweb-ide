// templateEditor is the class which manages all the operations related to edition of template files
function templateEditor(){
}

//JavaScript does not allow to heir the singleton pattern
templateEditor.instance = null;

templateEditor.getInstance = function() {
	if (templateEditor.instance == null) {
		templateEditor.instance = new templateEditor();
	}
	return templateEditor.instance;
}

// This initializes the object
// It receives:
// 	identifier: the id of the div where the code editor should be placed.
templateEditor.prototype.init = function(id) {
	this.identifier = id;
	this.doc = null;
    document.getElementById("tipImage").innerHTML = "Tip: if the image is belongs to the project the URI should be like <i>http://"+location.host+"/route/to/the/image</i>";
    document.getElementById("tipHTMLURL").innerHTML = "Tip: the URI should be like <i>http://"+location.host+"/route/to/the/html</i>";
}

// this function displays an empty wizard
templateEditor.prototype.activate = function() {
	document.getElementById("inputPreferencesType").addEventListener("change",EzWebExt.bind(function(oEvent){this.toggleOptions(oEvent)},this),true);
	document.getElementById("preferencesVars").style.display = "none";
	document.getElementById("preferencesOptionsDiv").style.display = "none";
	document.getElementById("preferencesOptions").style.display = "none";
	document.getElementById("propertiesVars").style.display = "none";
	document.getElementById("wiringVars").style.display = "none";
	document.getElementById("contextVars").style.display = "none";

	document.getElementById("descriptionHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("preferencesHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("propertiesHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("wiringHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("contextHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("renderingHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);
	document.getElementById("linkHeader").addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleSection(oEvent)},this),true);

	document.getElementById("addPreference").addEventListener("click",EzWebExt.bind(function(oEvent){this.addPreference(oEvent)},this),true);
	document.getElementById("addOption").addEventListener("click",EzWebExt.bind(function(oEvent){this.addOption(oEvent)},this),true);
	document.getElementById("addProperty").addEventListener("click",EzWebExt.bind(function(oEvent){this.addProperty(oEvent)},this),true);
	document.getElementById("addWiring").addEventListener("click",EzWebExt.bind(function(oEvent){this.addWiring(oEvent)},this),true);
	document.getElementById("addContext").addEventListener("click",EzWebExt.bind(function(oEvent){this.addContext(oEvent)},this),true);
	
	document.getElementById("clearTemplate").addEventListener("click",EzWebExt.bind(function(){this.clearAll()},this),true);
	document.getElementById("saveTemplate").addEventListener("click",EzWebExt.bind(function(){this.saveWizard()},this),true);
	document.getElementById("closeTemplate").addEventListener("click",EzWebExt.bind(function(){this.close()},this),true);
    this.clearAll();
}

// this function returns if the editor is active and with a template loaded or not
templateEditor.prototype.isActive = function() {
	return (this.doc != null);
}

// this function organizes the operations to load a template into the wizard
templateEditor.prototype.loadTemplate = function(content) {
	this.activate();
	if (content) {
		var parser=new DOMParser();
		this.doc = parser.parseFromString(content,"text/xml");
		if (this.doc.getElementsByTagName("parsererror").length != 0) {
			logger.getInstance().showLog("The template could not be loaded into the wizard because is not well formed.","error");
            this.doc = null;
            return -1;
		} else {
		    var errorVar = null;
		    try {
			    // Loading the description section
			    errorVar = {section: "description", element: "Vendor"};
			    if (this.doc.getElementsByTagName("Vendor").length != 0 && this.doc.getElementsByTagName("Vendor")[0].firstChild != null) {
				    document.getElementById("inputDescriptionVendor").value = this.doc.getElementsByTagName("Vendor")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "Name";
			    if (this.doc.getElementsByTagName("Name").length != 0 && this.doc.getElementsByTagName("Name")[0].firstChild != null) {
				    document.getElementById("inputDescriptionName").value = this.doc.getElementsByTagName("Name")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "Version";
			    if (this.doc.getElementsByTagName("Version").length != 0 && this.doc.getElementsByTagName("Version")[0].firstChild != null) {
				    document.getElementById("inputDescriptionVersion").value = this.doc.getElementsByTagName("Version")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "Author";
			    if (this.doc.getElementsByTagName("Author").length != 0 && this.doc.getElementsByTagName("Author")[0].firstChild != null) {
				    document.getElementById("inputDescriptionAuthor").value = this.doc.getElementsByTagName("Author")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "Mail";
			    if (this.doc.getElementsByTagName("Mail").length != 0 && this.doc.getElementsByTagName("Mail")[0].firstChild != null) {
				    document.getElementById("inputDescriptionMail").value = this.doc.getElementsByTagName("Mail")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "ImageURI";
			    if (this.doc.getElementsByTagName("ImageURI").length != 0 && this.doc.getElementsByTagName("ImageURI")[0].firstChild != null) {
				    document.getElementById("inputDescriptionImage").value = this.doc.getElementsByTagName("ImageURI")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "WikiURI";
			    if (this.doc.getElementsByTagName("WikiURI").length != 0 && this.doc.getElementsByTagName("WikiURI")[0].firstChild != null) {
				    document.getElementById("inputDescriptionWiki").value = this.doc.getElementsByTagName("WikiURI")[0].firstChild.nodeValue;
			    }
			    errorVar.element = "Description";
			    if (this.doc.getElementsByTagName("Description").length != 0 && this.doc.getElementsByTagName("Description")[0].firstChild != null) {
				    document.getElementById("inputDescriptionDesc").value = this.doc.getElementsByTagName("Description")[0].firstChild.nodeValue;
			    }

			    // Loading the preferences
			    errorVar = {section: "preferences", element: null};
			    var preferences = this.doc.getElementsByTagName("Preference");
			    if (preferences.length != 0) {
				    document.getElementById("preferencesVars").style.display = "block";
				    for (k=0; k<preferences.length; k++) {
					    var preferenceName = preferences[k].getAttribute("name");
					    errorVar.varName = preferenceName;
					    var preferenceType = preferences[k].getAttribute("type");
					    var options = [];
					    if (preferenceType == "list" || preferenceType == "select") {
						    var rawOptions = preferences[k].getElementsByTagName("Option");
						    for (j=0; j<rawOptions.length; j++) {
							    options.push({oValue: rawOptions[j].getAttribute("value"), oName: rawOptions[j].getAttribute("name")});
						    }
					    }
					    var preferenceLabel = preferences[k].getAttribute("label");
					    var preferenceDesc = preferences[k].getAttribute("description");
					    var preferenceDefault = preferences[k].getAttribute("default");
					    this.paintPreference(preferenceName,preferenceType,preferenceLabel,preferenceDesc,preferenceDefault,options);
				    }
			    }
			    // Loading the properties
			    errorVar = {section: "properties", element: null};
			    var properties = this.doc.getElementsByTagName("Property");
			    if (properties.length != 0) {
				    document.getElementById("propertiesVars").style.display = "block";
				    for (i=0; i<properties.length; i++) {
					    var propertyName = properties[i].getAttribute("name");
					    errorVar.varName = propertyName;
					    var propertyType = properties[i].getAttribute("type");
					    var propertyLabel = properties[i].getAttribute("label");
					    var propertyDesc = properties[i].getAttribute("description");
					    var propertyDefault = properties[i].getAttribute("default");
					    this.paintProperty(propertyName,propertyType,propertyLabel,propertyDesc,propertyDefault);
				    }
			    }

			    // Loading the wiring
			    errorVar = {section: "wiring", element: "slot", varName: null};
			    var slots = this.doc.getElementsByTagName("Slot");
			    var wPainted = false;
			    if (slots.length != 0) {
				    document.getElementById("wiringVars").style.display = "block";
				    wPainted = true;
				    for (i=0; i<slots.length; i++) {
					    var slotName = slots[i].getAttribute("name");
					    errorVar.varName = slotName;
					    var slotType = slots[i].getAttribute("type");
					    var slotLabel = slots[i].getAttribute("label");
					    var slotFriendcode = slots[i].getAttribute("friendcode");
					    this.paintWiringVar("slot",slotName,slotType,slotLabel,slotFriendcode);
				    }
			    }
			    errorVar = {section: "wiring", element: "event", varName: null};
			    var events = this.doc.getElementsByTagName("Event");
			    if (events.length != 0) {
				    if (!wPainted) {
					    document.getElementById("wiringVars").style.display = "block";
				    }
				    for (i=0; i<events.length; i++) {
					    var eventName = events[i].getAttribute("name");
					    errorVar.varName = eventName;
					    var eventType = events[i].getAttribute("type");
					    var eventLabel = events[i].getAttribute("label");
					    var eventFriendcode = events[i].getAttribute("friendcode");
					    this.paintWiringVar("event",eventName,eventType,eventLabel,eventFriendcode);
				    }
			    }

			    // Loading the context
			    errorVar = {section: "context", element:"Context", varName: null};
			    var contexts = this.doc.getElementsByTagName("Context");
			    var cPainted = false;
			    if (contexts.length != 0) {
				    cPainted = true;
				    document.getElementById("contextVars").style.display = "block";
				    for (i=0; i<contexts.length; i++) {
					    var contextName = contexts[i].getAttribute("name");
					    errorVar.varName = contextName;
					    var contextType = contexts[i].getAttribute("type");
					    var contextConcept = contexts[i].getAttribute("concept");
					    this.paintContextVar("Context",contextName,contextType,contextConcept);
				    }
			    }
			    errorVar = {section: "context", element:"GadgetContext", varName: null};
			    var gadgetContexts = this.doc.getElementsByTagName("GadgetContext");
			    if (contexts.length != 0) {
				    if (!cPainted) {
					    document.getElementById("contextVars").style.display = "block";
				    }
				    document.getElementById("contextVars").style.display = "block";
				    for (i=0; i<gadgetContexts.length; i++) {
					    var contextName = gadgetContexts[i].getAttribute("name");
					    errorVar.varName = contextName;
					    var contextType = gadgetContexts[i].getAttribute("type");
					    var contextConcept = gadgetContexts[i].getAttribute("concept");
					    this.paintContextVar("GadgetContext",contextName,contextType,contextConcept);
				    }
			    }

			    // Loading the rendering
			    errorVar = {section: "rendering"};
			    if (this.doc.getElementsByTagName("Platform.Rendering").length != 0) {
				    document.getElementById("inputWidth").value = this.doc.getElementsByTagName("Platform.Rendering")[0].getAttribute("width");
				    document.getElementById("inputHeight").value = this.doc.getElementsByTagName("Platform.Rendering")[0].getAttribute("height");
			    }

			    // Loading the link
			    errorVar = {section: "code"};
			    if (this.doc.getElementsByTagName("XHTML").length != 0) {
				    document.getElementById("inputLink").value = this.doc.getElementsByTagName("XHTML")[0].getAttribute("href");
			    }
		    } catch (err) {
			    this.clearAll();
			    if (errorVar.section == "description") {
				    logger.getInstance().showLog("The element "+errorVar.element+" of the description may not exist.","error");
			    } else if (errorVar.section == "preferences") {
				    logger.getInstance().showLog("The preferences section may not exist or the preference "+errorVar.varName+" may be bad formed.","error");
			    } else if (errorVar.section == "properties") {
				    logger.getInstance().showLog("The properties section may not exist or the property "+errorVar.varName+" may be bad formed.","error");
			    } else if (errorVar.section == "wiring") {
				    logger.getInstance().showLog("The wiring section may not exist or the "+errorVar.element+" "+errorVar.varName+" may be bad formed.","error");
			    } else if (errorVar.section == "context") {
				    logger.getInstance().showLog("The context section may not exist or the "+errorVar.element+" var "+errorVar.varName+" may be bad formed.","error");
			    } else if (errorVar.section == "rendering") {
				    logger.getInstance().showLog("The rendering section may not exist or its attributes may ot be defined","error");
			    } else {
				    logger.getInstance().showLog("The link to the code may not exist.","error");
			    }
                this.doc = null;
                return -1;
		    }
            return 0;
        }
	} else {
        var parser = new DOMParser();
        content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        content += "<Template schemaLocation=\"http://morfeo-project.org/2007/Template\">\n";
        content += "</Template>"
		this.doc = parser.parseFromString(content,"text/xml");
    }
}


// this function returns the template content from the wizard
templateEditor.prototype.getTemplate = function() {
	try {
		// checking and setting the global template tag
        var templateNode = this.doc.getElementsByTagName("Template");
		if (templateNode.length == 0) {
			templateNode = this.doc.createElement("Template");
			templateNode.setAttribute("schemaLocation","http://morfeo-project.org/2007/Template");
			this.doc.replaceChild(templateNode,this.doc.firstChild);
            templateNode.appendChild(this.doc.createTextNode("\n"));
		} else {
            templateNode = templateNode[0];
        }

        var newElement = false;
		// checking and setting the description
		var resourceTags = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Catalog.ResourceDescription");
		var resource = null;
		if (resourceTags.length == 0) {
            newElement = true;
            templateNode.appendChild(this.doc.createTextNode("\t"));
			resource = this.doc.createElement("Catalog.ResourceDescription");
            resource.appendChild(this.doc.createTextNode("\n"));
			templateNode.appendChild(resource);
		} else {
			resource = resourceTags[0];
		}
		if (resource.getElementsByTagName("Vendor").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var vendorNode = this.doc.createElement("Vendor");
            vendorNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionVendor").value));
			resource.appendChild(vendorNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
            if (resource.getElementsByTagName("Vendor")[0].firstChild) {
			    resource.getElementsByTagName("Vendor")[0].firstChild.nodeValue = document.getElementById("inputDescriptionVendor").value;
            } else {
                resource.getElementsByTagName("Vendor")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionVendor").value));
            }
		}
		if (resource.getElementsByTagName("Name").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var nameNode = this.doc.createElement("Name");
            nameNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionName").value));
			resource.appendChild(nameNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
            if (resource.getElementsByTagName("Name")[0].firstChild) {
			    resource.getElementsByTagName("Name")[0].firstChild.nodeValue = document.getElementById("inputDescriptionName").value;
            } else {
                resource.getElementsByTagName("Name")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionName").value));
            }
		}
		if (resource.getElementsByTagName("Version").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var versionNode = this.doc.createElement("Version");
            versionNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionVersion").value));
			resource.appendChild(versionNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
            if (resource.getElementsByTagName("Version")[0].firstChild) {
			    resource.getElementsByTagName("Version")[0].firstChild.nodeValue = document.getElementById("inputDescriptionVersion").value;
            } else {
                resource.getElementsByTagName("Version")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionVersion").value));
            }
		}
		if (resource.getElementsByTagName("Author").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var authorNode = this.doc.createElement("Author");
            authorNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionAuthor").value));
			resource.appendChild(authorNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
			if (resource.getElementsByTagName("Author")[0].firstChild) {
			    resource.getElementsByTagName("Author")[0].firstChild.nodeValue = document.getElementById("inputDescriptionAuthor").value;
            } else {
                resource.getElementsByTagName("Author")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionAuthor").value));
            }
		}
		if (resource.getElementsByTagName("Mail").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var mailNode = this.doc.createElement("Mail");
            mailNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionMail").value));
			resource.appendChild(mailNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
			if (resource.getElementsByTagName("Mail")[0].firstChild) {
			    resource.getElementsByTagName("Mail")[0].firstChild.nodeValue = document.getElementById("inputDescriptionMail").value;
            } else {
                resource.getElementsByTagName("Mail")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionMail").value));
            }
		}
		if (resource.getElementsByTagName("Description").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var descNode = this.doc.createElement("Description");
            descNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionDesc").value));
			resource.appendChild(descNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
			if (resource.getElementsByTagName("Description")[0].firstChild) {
			    resource.getElementsByTagName("Description")[0].firstChild.nodeValue = document.getElementById("inputDescriptionDesc").value;
            } else {
                resource.getElementsByTagName("Description")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionDesc").value));
            }
		}
		if (resource.getElementsByTagName("ImageURI").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var imageNode = this.doc.createElement("ImageURI");
            imageNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionImage").value));
			resource.appendChild(imageNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
			if (resource.getElementsByTagName("ImageURI")[0].firstChild) {
			    resource.getElementsByTagName("ImageURI")[0].firstChild.nodeValue = document.getElementById("inputDescriptionImage").value;
            } else {
                resource.getElementsByTagName("ImageURI")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionImage").value));
            }
		}
		if (resource.getElementsByTagName("WikiURI").length == 0) {
            resource.appendChild(this.doc.createTextNode("\t\t"));
			var wikiNode = this.doc.createElement("WikiURI");
            wikiNode.appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionWiki").value));
			resource.appendChild(wikiNode);
            resource.appendChild(this.doc.createTextNode("\n"));
		} else {
			if (resource.getElementsByTagName("WikiURI")[0].firstChild) {
			    resource.getElementsByTagName("WikiURI")[0].firstChild.nodeValue = document.getElementById("inputDescriptionWiki").value;
            } else {
                resource.getElementsByTagName("WikiURI")[0].appendChild(this.doc.createTextNode(document.getElementById("inputDescriptionWiki").value));
            }
		}
        if (newElement) {
            newElement = false;
            resource.appendChild(this.doc.createTextNode("\t"));
            templateNode.appendChild(this.doc.createTextNode("\n"));
        }

		// checking and setting the preferences
		var preferences = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.Preferences");
		var preferencesNode = null;
		if (preferences.length == 0) {
            newElement = true;
            templateNode.appendChild(this.doc.createTextNode("\t"));
			preferencesNode = this.doc.createElement("Platform.Preferences");
			templateNode.appendChild(preferencesNode);
		} else {
			preferencesNode = preferences[0];
		}
		while (preferencesNode.childNodes.length>0) {
			preferencesNode.removeChild(preferencesNode.firstChild);
		}
		var preferencesRows = document.getElementById("preferencesVars").getElementsByTagName("tbody")[0];
		for (i=0; i<preferencesRows.childNodes.length; i++) {
            preferencesNode.appendChild(this.doc.createTextNode("\n\t\t"));
			var preferenceNode = this.doc.createElement("Preference");
			preferenceNode.setAttribute("name",preferencesRows.childNodes[i].cells[0].innerHTML);
			var pType = preferencesRows.childNodes[i].cells[1].firstChild.innerHTML;
			preferenceNode.setAttribute("type",pType);
			preferenceNode.setAttribute("label",preferencesRows.childNodes[i].cells[2].innerHTML);
			preferenceNode.setAttribute("description",preferencesRows.childNodes[i].cells[3].innerHTML);
			preferenceNode.setAttribute("default",preferencesRows.childNodes[i].cells[4].innerHTML);
			if (pType == "list" || pType =="select") {
				optionRows = preferencesRows.childNodes[i].cells[1].getElementsByTagName("tr");
				for (j=0; j<optionRows.length ; j++) {
                    preferenceNode.appendChild(this.doc.createTextNode("\n\t\t\t"));
					var optionNode = this.doc.createElement("option");
					optionNode.setAttribute("value",optionRows[j].cells[0].innerHTML);
					optionNode.setAttribute("name",optionRows[j].cells[1].innerHTML);
					preferenceNode.appendChild(optionNode);
				}
                preferenceNode.appendChild(this.doc.createTextNode("\n\t\t"));
			}
			preferencesNode.appendChild(preferenceNode);
		}
        if (newElement) {
            newElement = false;
            preferencesNode.appendChild(this.doc.createTextNode("\n\t"));
            templateNode.appendChild(this.doc.createTextNode("\n"));
        }

		// checking and setting the properties
		var properties = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.StateProperties");
		var propertiesNode = null;
		if (properties.length == 0) {
            newElement = true;
            templateNode.appendChild(this.doc.createTextNode("\t"));
			propertiesNode = this.doc.createElement("Platform.StateProperties");
			templateNode.appendChild(propertiesNode);
		} else {
			propertiesNode = properties[0];
		}
		while (propertiesNode.childNodes.length>0) {
			propertiesNode.removeChild(propertiesNode.firstChild);
		}
		var propertiesRows = document.getElementById("propertiesVars").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		for (i=0; i<propertiesRows.length; i++) {
            propertiesNode.appendChild(this.doc.createTextNode("\n\t\t"));
			var propertyNode = this.doc.createElement("Property");
			propertyNode.setAttribute("name",propertiesRows[i].cells[0].innerHTML);
			propertyNode.setAttribute("type",propertiesRows[i].cells[1].innerHTML);
			propertyNode.setAttribute("label",propertiesRows[i].cells[2].innerHTML);
			propertyNode.setAttribute("description",propertiesRows[i].cells[3].innerHTML);
			propertyNode.setAttribute("default",propertiesRows[i].cells[4].innerHTML);
			propertiesNode.appendChild(propertyNode);
		}
        if (newElement) {
            newElement = false;
            propertiesNode.appendChild(this.doc.createTextNode("\n\t"));
            templateNode.appendChild(this.doc.createTextNode("\n"));
        }
		
		// checking and setting the wiring
		var wiring = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.Wiring");
		var wiringNode = null;
		if (wiring.length == 0) {
            newElement = true;
            templateNode.appendChild(this.doc.createTextNode("\t"));
			wiringNode = this.doc.createElement("Platform.Wiring");
			templateNode.appendChild(wiringNode);
		} else {
			wiringNode = wiring[0];
		}
		while (wiringNode.childNodes.length>0) {
			wiringNode.removeChild(wiringNode.firstChild);
		}
		var wiringRows = document.getElementById("wiringVars").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		for (i=0; i<wiringRows.length; i++) {
            wiringNode.appendChild(this.doc.createTextNode("\n\t\t"));
			var wiringVarNode = null;
			if (wiringRows[i].cells[0].innerHTML == "event") {
				wiringVarNode = this.doc.createElement("Event");
			} else {
				wiringVarNode = this.doc.createElement("Slot");
			}
			wiringVarNode.setAttribute("name",wiringRows[i].cells[1].innerHTML);
			wiringVarNode.setAttribute("type",wiringRows[i].cells[2].innerHTML);
			wiringVarNode.setAttribute("label",wiringRows[i].cells[3].innerHTML);
			wiringVarNode.setAttribute("friendcode",wiringRows[i].cells[4].innerHTML);
			wiringNode.appendChild(wiringVarNode);
		}
        if (newElement) {
            newElement = false;
            wiringNode.appendChild(this.doc.createTextNode("\n\t"));
            templateNode.appendChild(this.doc.createTextNode("\n"));
        }

		// checking and setting the context
		var context = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.Context");
		var contextNode = null;
		if (context.length == 0) {
            newElement = true;
            templateNode.appendChild(this.doc.createTextNode("\t"));
			contextNode = this.doc.createElement("Platform.Context");
			templateNode.appendChild(contextNode);
		} else {
			contextNode = context[0];
		}
		while (contextNode.childNodes.length>0) {
			contextNode.removeChild(contextNode.firstChild);
		}
		var contextRows = document.getElementById("contextVars").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		for (i=0; i<contextRows.length; i++) {
            contextNode.appendChild(this.doc.createTextNode("\n\t\t"));
			var contextVarNode = null;
			if (contextRows[i].cells[0].innerHTML == "Context") {
				contextVarNode = this.doc.createElement("Context");
			} else {
				contextVarNode = this.doc.createElement("GadgetContext");
			}
			contextVarNode.setAttribute("name",contextRows[i].cells[1].innerHTML);
			contextVarNode.setAttribute("label",contextRows[i].cells[2].innerHTML);
			contextVarNode.setAttribute("concept",contextRows[i].cells[3].innerHTML);
			contextNode.appendChild(contextVarNode);
		}
        if (newElement) {
            newElement = false;
            contextNode.appendChild(this.doc.createTextNode("\n\t"));
            templateNode.appendChild(this.doc.createTextNode("\n"));
        }

		// checking and setting the rendering
		var rendering = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.Rendering");
		if (rendering.length == 0) {
            templateNode.appendChild(this.doc.createTextNode("\t"));
			var renderingNode = this.doc.createElement("Platform.Rendering");
			renderingNode.setAttribute("width",document.getElementById("inputWidth").value);
			renderingNode.setAttribute("height",document.getElementById("inputHeight").value);
			templateNode.appendChild(renderingNode);
            templateNode.appendChild(this.doc.createTextNode("\n"));
		} else {
			rendering[0].setAttribute("width",document.getElementById("inputWidth").value);
			rendering[0].setAttribute("height",document.getElementById("inputHeight").value);
		}

		// checking and setting the xhtml URI
		var link = this.doc.getElementsByTagName("Template")[0].getElementsByTagName("Platform.Link");
		if (link.length == 0) {
            templateNode.appendChild(this.doc.createTextNode("\t"));
			var linkNode = this.doc.createElement("Platform.Link");
            linkNode.appendChild(this.doc.createTextNode("\n"));
            linkNode.appendChild(this.doc.createTextNode("\t\t"));
			var xhtmlNode = this.doc.createElement("XHTML");
			xhtmlNode.setAttribute("href",document.getElementById("inputLink").value);
			linkNode.appendChild(xhtmlNode);
            linkNode.appendChild(this.doc.createTextNode("\n"));
            linkNode.appendChild(this.doc.createTextNode("\t"));
			templateNode.appendChild(linkNode);
            templateNode.appendChild(this.doc.createTextNode("\n"));
		} else if (link[0].getElementsByTagName("XHTML").length == 0){
			var xhtmlNode = this.doc.createElement("XHTML");
			xhtmlNode.setAttribute("href",document.getElementById("inputLink").value);
			link[0].appendChild(xhtmlNode);
		} else {
			link[0].getElementsByTagName("XHTML")[0].setAttribute("href",document.getElementById("inputLink").value);
		}
		return this.doc;
	} catch (err) {
		return "error";
	}
}


//private methods for painting the tables

// this function paints a row for a preference
templateEditor.prototype.paintPreference = function(pName, pType, pLabel, pDescription, pDefault, options) {
	var tbody = document.getElementById("preferencesVars").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	var nameTd = document.createElement("td");
	nameTd.innerHTML = pName;
	row.appendChild(nameTd);
	var typeTd = document.createElement("td");
	typeTd.innerHTML = "<span>"+pType+"</span>";
	if (pType == "select" || pType == "list") {
		var tOptions = document.createElement("table");
		tOptions.setAttribute("class","innerTable");
		var rows = document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		for (i=0; i<options.length; i++) {
			tOptions.innerHTML += "<tr><td>"+options[i].oValue+"<\/td><td>"+options[i].oName+"<\/td><\/tr>";
		}
		typeTd.appendChild(tOptions);
	}
	row.appendChild(typeTd);
	var labelTd = document.createElement("td");
	labelTd.innerHTML = pLabel;
	row.appendChild(labelTd);
	var descTd = document.createElement("td");
	descTd.innerHTML = pDescription;
	row.appendChild(descTd);
	var defaultTd = document.createElement("td");
	defaultTd.innerHTML = pDefault;
	row.appendChild(defaultTd);
	var editTd = document.createElement("td");
    var removeTd = document.createElement("td");
	var bEdit = document.createElement("img");
	bEdit.setAttribute("class","operationalButton");
	bEdit.setAttribute("alt","Edit");
	bEdit.setAttribute("Title","Click to edit this preference");
	bEdit.setAttribute("src","/resources/images/pencil.png");
	bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editPreference(oEvent)},this),true);
	var bDelete = document.createElement("img");
	bDelete.setAttribute("class","operationalButton");
	bDelete.setAttribute("alt","Delete");
	bDelete.setAttribute("Title","Click to delete this preference");
	bDelete.setAttribute("src","/resources/images/bin.png");
	bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removePreference(oEvent)},this),true);
	editTd.appendChild(bEdit);
	removeTd.appendChild(bDelete);
	row.appendChild(editTd);
    row.appendChild(removeTd);
	tbody.appendChild(row);
}

// this function paints a row for a property
templateEditor.prototype.paintProperty = function(pName, pType, pLabel, pDescription, pDefault) {
	var tbody = document.getElementById("propertiesVars").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	var nameTd = document.createElement("td");
	nameTd.innerHTML =pName;
	row.appendChild(nameTd);
	var typeTd = document.createElement("td");
	typeTd.innerHTML = pType;
	row.appendChild(typeTd);
	var labelTd = document.createElement("td");
	labelTd.innerHTML = pLabel;
	row.appendChild(labelTd);
	var descTd = document.createElement("td");
	descTd.innerHTML = pDescription;
	row.appendChild(descTd);
	var defaultTd = document.createElement("td");
	defaultTd.innerHTML = pDefault;
	row.appendChild(defaultTd);
	var editTd = document.createElement("td");
    var removeTd = document.createElement("td");
	var bEdit = document.createElement("img");
	bEdit.setAttribute("class","operationalButton");
	bEdit.setAttribute("alt","Edit");
	bEdit.setAttribute("Title","Click to edit this property");
	bEdit.setAttribute("src","/resources/images/pencil.png");
	bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editProperty(oEvent)},this),true);
	var bDelete = document.createElement("img");
	bDelete.setAttribute("class","operationalButton");
	bDelete.setAttribute("alt","Delete");
	bDelete.setAttribute("Title","Click to delete this property");
	bDelete.setAttribute("src","/resources/images/bin.png");
	bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removeProperty(oEvent)},this),true);
	editTd.appendChild(bEdit);
	removeTd.appendChild(bDelete);
	row.appendChild(editTd);
    row.appendChild(removeTd);
	tbody.appendChild(row);
}

// this function paints a row for a wiring var
templateEditor.prototype.paintWiringVar = function(varClass, wName, wType, wLabel, wFriendcode) {
	var tbody = document.getElementById("wiringVars").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	var varTd = document.createElement("td");
	varTd.innerHTML = varClass;
	row.appendChild(varTd);
	var nameTd = document.createElement("td");
	nameTd.innerHTML = wName;
	row.appendChild(nameTd);
	var typeTd = document.createElement("td");
	typeTd.innerHTML = wType;
	row.appendChild(typeTd);
	var labelTd = document.createElement("td");
	labelTd.innerHTML = wLabel;
	row.appendChild(labelTd);
	var friendcodeTd = document.createElement("td");
	friendcodeTd.innerHTML = wFriendcode;
	row.appendChild(friendcodeTd);
	var editTd = document.createElement("td");
    var removeTd = document.createElement("td");
	var bEdit = document.createElement("img");
	bEdit.setAttribute("class","operationalButton");
	bEdit.setAttribute("alt","Edit");
	bEdit.setAttribute("Title","Click to edit this wiring var");
	bEdit.setAttribute("src","/resources/images/pencil.png");
	bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editWiring(oEvent)},this),true);
	var bDelete = document.createElement("img");
	bDelete.setAttribute("class","operationalButton");
	bDelete.setAttribute("alt","Delete");
	bDelete.setAttribute("Title","Click to delete this wiring var");
	bDelete.setAttribute("src","/resources/images/bin.png");
	bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removeWiring(oEvent)},this),true);
	editTd.appendChild(bEdit);
	removeTd.appendChild(bDelete);
	row.appendChild(editTd);
    row.appendChild(removeTd);
	tbody.appendChild(row);
}

// this function paints a row for a context var
templateEditor.prototype.paintContextVar = function(cClass, cName, cType, cConcept) {
	var tbody = document.getElementById("contextVars").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	var classTd = document.createElement("td");
	classTd.innerHTML = cClass;
	row.appendChild(classTd);
	var nameTd = document.createElement("td");
	nameTd.innerHTML = cName;
	row.appendChild(nameTd);
	var typeTd = document.createElement("td");
	typeTd.innerHTML = cType;
	row.appendChild(typeTd);
	var conceptTd = document.createElement("td");
	conceptTd.innerHTML = cConcept;
	row.appendChild(conceptTd);
	var editTd = document.createElement("td");
    var removeTd = document.createElement("td");
	var bEdit = document.createElement("img");
	bEdit.setAttribute("class","operationalButton");
	bEdit.setAttribute("alt","Edit");
	bEdit.setAttribute("Title","Click to edit this context var");
	bEdit.setAttribute("src","/resources/images/pencil.png");
	bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editContext(oEvent)},this),true);
	var bDelete = document.createElement("img");
	bDelete.setAttribute("class","operationalButton");
	bDelete.setAttribute("alt","Delete");
	bDelete.setAttribute("Title","Click to delete this context var");
	bDelete.setAttribute("src","/resources/images/bin.png");
	bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removeContext(oEvent)},this),true);
	editTd.appendChild(bEdit);
	removeTd.appendChild(bDelete);
	row.appendChild(editTd);
    row.appendChild(removeTd);
	tbody.appendChild(row);
}

// event handlers

// this function shows or hides the different sections of the wizard
templateEditor.prototype.toggleSection = function(oEvent) {
	if (oEvent.target.parentNode.getAttribute("name")=="on") {
		oEvent.target.parentNode.nextSibling.nextSibling.style.display = "none";
		oEvent.target.parentNode.setAttribute("name","off");
	} else {
		oEvent.target.parentNode.nextSibling.nextSibling.style.display = "block";
		oEvent.target.parentNode.setAttribute("name","on");
	} 
}

// this function checks and adds a new preference to the wizard
templateEditor.prototype.addPreference = function(oEvent) {
	var tbody = document.getElementById("preferencesVars").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	if (document.getElementById("inputPreferencesName").value == "" || document.getElementById("inputPreferencesLabel").value == "") {
		logger.getInstance().showLog("The preference could not be added. Please fill the name and the label fields.","error");
	} else {
		var names = [];
		var rows = tbody.getElementsByTagName("tr");
		var found = false;
		if (rows.length == 0) {
			document.getElementById("preferencesVars").style.display = "block";
		} else {
			for (i=0; i<rows.length; i++) {
				if (rows[i].cells[0].innerHTML == document.getElementById("inputPreferencesName").value) {
					found = true;
				}
			}
		}
		if (found) {
			logger.getInstance().showLog("The preference could not be added. Already exists a preference with that name.","error");
		} else {
			var pType = document.getElementById("inputPreferencesType").value;
			var options = [];
			if (pType == "select" || pType == "list") {
				var rows = document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
				for (i=0; i<rows.length; i++) {
					options.push({oValue: rows[i].cells[0].innerHTML, oName: rows[i].cells[1].innerHTML});
				}
				document.getElementById("preferencesOptionsDiv").style.display = "none";
				document.getElementById("preferencesOptions").style.display = "none";
				document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].innerHTML = null;
			}
            this.paintPreference(document.getElementById("inputPreferencesName").value, pType, document.getElementById("inputPreferencesLabel").value, document.getElementById("inputPreferencesDesc").value, document.getElementById("inputPreferencesDefault").value, options);
            document.getElementById("inputPreferencesName").value = "";
			document.getElementById("inputPreferencesType").value = "text";
			document.getElementById("inputPreferencesLabel").value = "";			
			document.getElementById("inputPreferencesDesc").value = "";
			document.getElementById("inputPreferencesDefault").value = "";
		}
	}
}

// this function removes a preference from the wizard
templateEditor.prototype.removePreference = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("preferencesVars").getElementsByTagName("tbody")[0];
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("preferencesVars").style.display = "none";
	}
}

// this function sets the selected preference in edition mode
templateEditor.prototype.editPreference = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("preferencesVars").getElementsByTagName("tbody")[0];
	document.getElementById("inputPreferencesName").value = row.cells[0].innerHTML;
	if (row.firstChild.nextSibling.firstChild.innerHTML == "select" || row.firstChild.nextSibling.firstChild.innerHTML == "list") {
		document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].innerHTML=null;
		document.getElementById("preferencesOptionsDiv").style.display = "block";
		var options = row.firstChild.nextSibling.firstChild.nextSibling.getElementsByTagName("tr");
		for (i=0; i<options.length; i++) {
			var opRow = document.createElement("tr")
			var valueTd = document.createElement("td");
			valueTd.innerHTML = options[i].cells[0].innerHTML;
			opRow.appendChild(valueTd);
			var nameTd = document.createElement("td");
			nameTd.innerHTML = options[i].cells[1].innerHTML;
			opRow.appendChild(nameTd);
			var editTd = document.createElement("td");
            var deleteTd = document.createElement("td");
			var bEdit = document.createElement("img");
			bEdit.setAttribute("class","operationalButton");
			bEdit.setAttribute("alt","Edit");
			bEdit.setAttribute("Title","Click to edit this option");
			bEdit.setAttribute("src","/resources/images/pencil.png");
			bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editOption(oEvent)},this),true);
			var bDelete = document.createElement("img");
			bDelete.setAttribute("class","operationalButton");
			bDelete.setAttribute("alt","Delete");
			bDelete.setAttribute("Title","Click to delete this option");
			bDelete.setAttribute("src","/resources/images/bin.png");
			bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removeOption(oEvent)},this),true);
			editTd.appendChild(bEdit);
			deleteTd.appendChild(bDelete);
			opRow.appendChild(editTd);
            opRow.appendChild(deleteTd);
			document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].appendChild(opRow);
		}
		if (options.length!=0) {
			document.getElementById("preferencesOptions").style.display = "block";
		}
	}
	document.getElementById("inputPreferencesType").value = row.firstChild.nextSibling.firstChild.innerHTML;
	document.getElementById("inputPreferencesLabel").value = row.cells[2].innerHTML;
	document.getElementById("inputPreferencesDesc").value = row.cells[3].innerHTML;
	document.getElementById("inputPreferencesDefault").value = row.cells[4].innerHTML;
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("preferencesVars").style.display = "none";
	}
}

// this function shows or hides the options section depending on the value of type of the preference in edition
templateEditor.prototype.toggleOptions = function(oEvent) {
	if (oEvent.target.value == "list" || oEvent.target.value == "select") {
		document.getElementById("preferencesOptionsDiv").style.display = "block";
	} else {
        document.getElementById("inputOptionValue").value = "";
        document.getElementById("inputOptionName").value = "";
		document.getElementById("preferencesOptionsDiv").style.display = "none";
		document.getElementById("preferencesOptions").style.display = "none";
		document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].innerHTML = null;
	}
}

// this function checks and adds a option to a preference
templateEditor.prototype.addOption = function(oEvent) {
	var tbody = document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0];
	var row = document.createElement("tr");
	if (document.getElementById("inputOptionValue").value == "" || document.getElementById("inputOptionName").value == "") {
		logger.getInstance().showLog("The option could not be added. Please fill the name and the label fields.","error");
	} else {
		var names = [];
		var rows = tbody.getElementsByTagName("tr");
		var found = false;
		if (rows.length == 0) {
			document.getElementById("preferencesOptions").style.display = "block";
		} else {
			for (i=0; i<rows.length; i++) {
				if (rows[i].cells[0].innerHTML == document.getElementById("inputOptionValue").value || rows[i].cells[1].innerHTML == document.getElementById("inputOptionName").value) {
					found = true;
				}
			}
		}
		if (found) {
			logger.getInstance().showLog("The preference could not be added. Already exists a preference with that name or value.","error");
		} else {
			var valueTd = document.createElement("td");
			valueTd.innerHTML = document.getElementById("inputOptionValue").value;
			document.getElementById("inputOptionValue").value = "";
			row.appendChild(valueTd);
			var nameTd = document.createElement("td");
			nameTd.innerHTML = document.getElementById("inputOptionName").value;
			document.getElementById("inputOptionName").value = "";
			row.appendChild(nameTd);
			var editTd = document.createElement("td");
            var deleteTd = document.createElement("td");
			var bEdit = document.createElement("img");
			bEdit.setAttribute("class","operationalButton");
			bEdit.setAttribute("alt","Edit");
			bEdit.setAttribute("Title","Click to edit this option");
			bEdit.setAttribute("src","/resources/images/pencil.png");
			bEdit.addEventListener("click",EzWebExt.bind(function(oEvent){this.editOption(oEvent)},this),true);
			var bDelete = document.createElement("img");
			bDelete.setAttribute("class","operationalButton");
			bDelete.setAttribute("alt","Delete");
			bDelete.setAttribute("Title","Click to delete this option");
			bDelete.setAttribute("src","/resources/images/bin.png");
			bDelete.addEventListener("click",EzWebExt.bind(function(oEvent){this.removeOption(oEvent)},this),true);
			editTd.appendChild(bEdit);
			deleteTd.appendChild(bDelete);
			row.appendChild(editTd);
            row.appendChild(deleteTd);
			tbody.appendChild(row);
		}
	}
}

// this function removes a option froma  preference of the wizard
templateEditor.prototype.removeOption = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0];
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("preferencesOptions").style.display = "none";
	}
}

// this function sets the selected option in edition mode
templateEditor.prototype.editOption = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0];
	document.getElementById("inputOptionValue").value = row.cells[0].innerHTML;
	document.getElementById("inputOptionName").value = row.cells[1].innerHTML;
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("preferencesOptions").style.display = "none";
	}
}

// this function checks and adds a new property to the wizard
templateEditor.prototype.addProperty = function(oEvent) {
	var tbody = document.getElementById("propertiesVars").getElementsByTagName("tbody")[0];
	if (document.getElementById("inputPropertiesName").value == "" || document.getElementById("inputPropertiesLabel").value == "") {
		logger.getInstance().showLog("The property var could not be added. Please fill the name and the label fields.","error");
	} else {
		var names = [];
		var rows = tbody.getElementsByTagName("tr");
		var found = false;
		if (rows.length == 0) {
			document.getElementById("propertiesVars").style.display = "block";
		} else {
			for (i=0; i<rows.length; i++) {
				if (rows[i].cells[0].innerHTML == document.getElementById("inputPropertiesName").value) {
					found = true;
				}
			}
		}
		if (found) {
			logger.getInstance().showLog("The property could not be added. Already exists a property with that name.","error");
		} else {
			this.paintProperty(document.getElementById("inputPropertiesName").value, document.getElementById("inputPropertiesType").value, document.getElementById("inputPropertiesLabel").value, document.getElementById("inputPropertiesDescription").value, document.getElementById("inputPropertiesDefault").value);
			document.getElementById("inputPropertiesName").value = "";
			document.getElementById("inputPropertiesType").value = "text";
			document.getElementById("inputPropertiesLabel").value = "";
			document.getElementById("inputPropertiesDescription").value = "";
			document.getElementById("inputPropertiesDefault").value = "";
		}
	}
}

// this function removes a property from the wizard
templateEditor.prototype.removeProperty = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("propertiesVars").getElementsByTagName("tbody")[0];
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("propertiesVars").style.display = "none";
	}
}

// this function sets the selected property in edition mode
templateEditor.prototype.editProperty = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("propertiesVars").getElementsByTagName("tbody")[0];
	document.getElementById("inputPropertiesName").value = row.cells[0].innerHTML;
	document.getElementById("inputPropertiesType").value = row.cells[1].innerHTML;
	document.getElementById("inputPropertiesLabel").value = row.cells[2].innerHTML;
	document.getElementById("inputPropertiesDescription").value = row.cells[3].innerHTML;
	document.getElementById("inputPropertiesDefault").value = row.cells[4].innerHTML;
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("propertiesVars").style.display = "none";
	}
}

// this function checks and adds a new wiring var to the wizard
templateEditor.prototype.addWiring = function(oEvent) {
	var tbody = document.getElementById("wiringVars").getElementsByTagName("tbody")[0];
	if (document.getElementById("inputWiringName").value == "" || document.getElementById("inputWiringLabel").value == "" || document.getElementById("inputWiringFriendcode").value == "") {
		logger.getInstance().showLog("The wiring var could not be added. Please fill all the fields.","error");
	} else {
		var names = [];
		var rows = tbody.getElementsByTagName("tr");
		var found = false;
		if (rows.length == 0) {
			document.getElementById("wiringVars").style.display = "block";
		} else {
			for (i=0; i<rows.length; i++) {
				if (rows[i].cells[0].innerHTML == document.getElementById("inputWiringVar").value && rows[i].cells[1].innerHTML == document.getElementById("inputWiringName").value) {
					found = true;
				}
			}
		}
		if (found) {
			logger.getInstance().showLog("The wiring var could not be added. Already exists a wiring var with that name.","error");
		} else {
			this.paintWiringVar(document.getElementById("inputWiringVar").value, document.getElementById("inputWiringName").value, document.getElementById("inputWiringType").value, document.getElementById("inputWiringLabel").value, document.getElementById("inputWiringFriendcode").value);
			document.getElementById("inputWiringVar").value = "event";
			document.getElementById("inputWiringName").value = "";
			document.getElementById("inputWiringType").value = "text";
			document.getElementById("inputWiringLabel").value = "";
			document.getElementById("inputWiringFriendcode").value = "";
		}
	}
}

// this function removes a wiring var from the wizard
templateEditor.prototype.removeWiring = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("wiringVars").getElementsByTagName("tbody")[0];
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("wiringVars").style.display = "none";
	}
}

// this function sets the selected wiring var in edition mode
templateEditor.prototype.editWiring = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("wiringVars").getElementsByTagName("tbody")[0];
	document.getElementById("inputWiringVar").value = row.cells[0].innerHTML;
	document.getElementById("inputWiringName").value = row.cells[1].innerHTML;
	document.getElementById("inputWiringType").value = row.cells[2].innerHTML;
	document.getElementById("inputWiringLabel").value = row.cells[3].innerHTML;
	document.getElementById("inputWiringFriendcode").value = row.cells[4].innerHTML;
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("contextVars").style.display = "none";
	}
}

// this function checks and adds a new context var to the wizard
templateEditor.prototype.addContext = function(oEvent) {
	var tbody = document.getElementById("contextVars").getElementsByTagName("tbody")[0];
	if (document.getElementById("inputContextName").value == "") {
		logger.getInstance().showLog("The context var could not be added. It must have a name.","error");
	} else {
		var names = [];
		var rows = tbody.getElementsByTagName("tr");
		var found = false;
		if (rows.length == 0) {
			document.getElementById("contextVars").style.display = "block";
		} else {
			for (i=0; i<rows.length; i++) {
				if (rows[i].cells[0].innerHTML == document.getElementById("inputContextName").value) {
					found = true;
				}
			}
		}
		if (found) {
			logger.getInstance().showLog("The context var could not be added. Already exists a context var with that name.","error");
		} else {
			this.paintContextVar(document.getElementById("inputContextClass").value, document.getElementById("inputContextName").value, document.getElementById("inputContextType").value, document.getElementById("inputContextConcept").value);
			document.getElementById("inputContextClass").value = "Context";
			document.getElementById("inputContextName").value = "";
			document.getElementById("inputContextType").value = "text";
			document.getElementById("inputContextConcept").value = "user_name";
		}
	}
}

// this function removes a context var from the wizard
templateEditor.prototype.removeContext = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("contextVars").getElementsByTagName("tbody")[0];
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("contextVars").style.display = "none";
	}
}

// this function sets the selected context var in edition mode
templateEditor.prototype.editContext = function(oEvent) {
	var row = oEvent.target.parentNode.parentNode;
	var tbody = document.getElementById("contextVars").getElementsByTagName("tbody")[0];
	document.getElementById("inputContextClass").value = row.cells[0].innerHTML;
	document.getElementById("inputContextName").value = row.cells[1].innerHTML;
	document.getElementById("inputContextType").value = row.cells[2].innerHTML;
	document.getElementById("inputContextConcept").value = row.cells[3].innerHTML;
	tbody.removeChild(row);
	if (tbody.getElementsByTagName("tr").length == 0) {
		document.getElementById("contextVars").style.display = "none";
	}
}

// this function empties the wizard
templateEditor.prototype.clearAll = function() {
	var inputs = document.getElementById("templateLayer").getElementsByTagName("input");
	for (i=0; i<inputs.length; i++) {
		inputs[i].value = "";
	}
	document.getElementById("preferencesVars").style.display = "none";
	document.getElementById("preferencesVars").getElementsByTagName("tbody")[0].innerHTML = null;
	document.getElementById("preferencesOptionsDiv").style.display = "none";
	document.getElementById("preferencesOptions").style.display = "none";
	document.getElementById("preferencesOptions").getElementsByTagName("tbody")[0].innerHTML = null;
	document.getElementById("propertiesVars").style.display = "none";
	document.getElementById("propertiesVars").getElementsByTagName("tbody")[0].innerHTML = null;
	document.getElementById("wiringVars").style.display = "none";
	document.getElementById("wiringVars").getElementsByTagName("tbody")[0].innerHTML = null;
	document.getElementById("contextVars").style.display = "none";
	document.getElementById("contextVars").getElementsByTagName("tbody")[0].innerHTML = null;
	
}

// this function checks the content of the wizard and if it is correct generates the template file and saves it
templateEditor.prototype.saveWizard = function() {
	templateManager.getInstance().saveTemplateWizard();
}

// this function closes the wizard without saving
templateEditor.prototype.close = function(force) {
	if (force != undefined) {
		$("#tabSection").tabs('select',0);
		$("#tabSection").tabs('disable',1);
		this.clearAll();
		this.doc = null;
	} else {
		this.dialogSaveBeforeClosing();
	}
}

// auxiliar method for showing the dialog that gives the option of saving before closing
templateEditor.prototype.dialogSaveBeforeClosing = function() {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Template wizard says:");
	var dContent = document.createElement("a");
	dContent.innerHTML = "Do you want to save the template you are editing before closing it?";
	dialog.appendChild(dContent);
	document.body.appendChild(dialog);
	$("#dialog").dialog({
		modal: true,
		width: 450,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
			"Save & Close": function() {
				templateEditor.getInstance().saveWizard();
				templateEditor.getInstance().close(true);
				$(this).dialog("close");
			},
			"Just close": function() {
				templateEditor.getInstance().close("true");
				$(this).dialog("close");
			}
		}
	});
	
}
