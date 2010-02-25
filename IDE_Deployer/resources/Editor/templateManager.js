// templateManager is the class which manages all the operations related to edition of template files
function templateManager(){
	editManager.call()
}

templateManager.prototype = new editManager();

//JavaScript does not allow to heir the singleton pattern
templateManager.instance = null;

templateManager.getInstance = function() {
	if (templateManager.instance == null) {
		templateManager.instance = new templateManager();
	}
	return templateManager.instance;
}

// This initializes the object
// It receives:
// 	identifier: the id of the div where the code editor should be placed.
//	lang: the language configuration of the editor
templateManager.prototype.init = function(identifier) {
	this.editor = templateEditor.getInstance();
	this.editor.init(identifier);
	this.file = null;
}

// this function organizes the operations to load a template into the editor (either the wizard or the common editor)
templateManager.prototype.loadTemplate = function(route, wizard) {
    if (codeManager.getInstance().isFileLoaded(route) != -1) {
        if (wizard) {
            if (this.editor.isActive()) {
                this.closeTemplateInCodeEditor(route,"The same template is being edited in the code editor and also there is a template in the wizard. Please select if you want to close without saving changes in the template in edition or you want to save the changes (the changes of the template in the wizard will be lost anyway).");
            } else {
                this.closeTemplateInCodeEditor(route, "The same template is being edited in the code editor. Please select if you want to close without saving changes in the template in edition, to save the changes or cancel the edition in the wizard.");
            }
        } else {
            codeManager.getInstance().loadFile(route); // to focus on the opened file
        }
    } else {
        if (wizard) {
            if (this.editor.isActive()) {
			    if (this.file.parent+'/'+this.file.id == route) {
				    $("#tabSection").tabs('select',1);
			    } else {
				    this.closeTemplateInWizard(route,true,"There is another template being edited in the wizard. Please select if you want to close without saving changes in the template in edition, to save the changes or cancel the edition in the wizard.");
			    }
            } else {
                var context = this;
			    $.getJSON("file/"+route, function(data, status) {
                    context.loadInWizardCallback(data,status)
                });
            }
        } else {
            if (this.editor.isActive()) {
                if (this.file.parent+'/'+this.file.id == route) {
				    this.closeTemplateInWizard(route, false, "This template is being edited in the wizard. Before loading it in the editor choose whether you want to save the changes in  the wizard?");
			    } else {
                    codeManager.getInstance().loadFile(route);
                }
            } else {
                codeManager.getInstance().loadFile(route);
            }
        }
    }
}

// this function renames the template whether it is being edited in the wizard or in the code manager
templateManager.prototype.deleteTemplate = function(parent,templateName,tFile) {
	if (this.file && this.file.id == templateName && this.file.parent == parent) {
        var dialog = document.createElement("div");
	    dialog.setAttribute("id","dialog");
	    dialog.setAttribute("title","Delete the template");
	    var dContent = document.createElement("a");
	    dContent.innerHTML = "Do you really want to delete this template?";
	    dialog.appendChild(dContent);
	    document.body.appendChild(dialog);
        var context = this;
	    $("#dialog").dialog({
		    modal: true,
		    width: 390,
		    resizable: false,
		    draggable: false,
            close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		    buttons: {
			    "Delete": function() {
				    $("#dialog").dialog('close');
                    $.post("delete/"+parent+'/'+templateName, function(data, status) {
                        context.deleteTemplateCallback(data,status,tFile)
                    });
			    },
                "Cancel": function() {
                    $(this).dialog("close");
			    }
		    }
	    });
	} else {
		codeManager.getInstance().deleteFile(parent+'/'+templateName,tFile);
	} 
}

// this function renames the template whether it is being edited in the wizard or in the code manager
templateManager.prototype.renameTemplate = function(parent,oldName,tFile) {
    if (this.file && this.file.id == oldName && this.file.parent == parent) {
        var dialog = document.createElement("div");
	    dialog.setAttribute("id","dialog");
	    dialog.setAttribute("title","Rename the template");
	    var dContent = document.createElement("a");
	    var nameSpan = document.createElement("span");
        nameSpan.innerHTML = "New name for the template: ";
        dContent.appendChild(nameSpan);
        var inputName = document.createElement("input");
        inputName.setAttribute("type","text");
        inputName.setAttribute("id","dialogTemplateName");
        dContent.appendChild(inputName);
	    dialog.appendChild(dContent);
	    document.body.appendChild(dialog);
        var context = this;
	    $("#dialog").dialog({
		    modal: true,
		    width: 370,
		    resizable: false,
		    draggable: false,
            close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		    buttons: {
			    "Rename the file": function() {
                    var newName = document.getElementById("dialogTemplateName").value;
                    if (newName=="") {
                        logger.getInstance().showLog("The name cannot be empty.","error");
                    } else if (newName.indexOf("/")!=-1) {
                        logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                    } else if (newName==oldName) {
                        logger.getInstance().showLog("The the new name cannot be the same as the old one.","error");
                    } else {
                        $.post("rename/"+parent+'/'+oldName, {newId: newName}, function(data, status) {
                            context.renameTemplateCallback(data,status,parent,oldName,newName,tFile);
                        });
                    }
				    $(this).dialog("close");
			    },
                "Cancel": function() {
                    $(this).dialog("close");
			    }
		    }
	    });
    } else {
        codeManager.getInstance().renameFile(parent,oldName,tFile);
    }
}

// this function renames the template due to a rename in a project or a dir if the template belongs to them
templateManager.prototype.renameDirTemplate = function(oldRoute,newRoute) {
    if (this.file) {
        if (this.file.parent.search(oldRoute)==0){
            this.file.parent = newRoute+this.file.parent.substr(oldRoute.length);
        }
    }
}

// this function organizes the operations to save a template in edition (either the wizard or the common editor)
templateManager.prototype.saveTemplate = function(parent, templateName) {
    if (this.file != null && this.file.id == templateName && this.file.parent == parent) {
		this.saveTemplateWizard();
	} else {
		codeManager.getInstance().saveFile(parent,templateName,"template");
	}
}

// this function organizes the operations to save a template in edition (either the wizard or the common editor)
templateManager.prototype.closeTemplate = function(parent, templateName) {
	    if (this.file == null) {
		    return codeManager.getInstance().closeFile(parent,templateName);
	    } else if (this.file.id == templateName && this.file.parent == parent) {
		    var dialog = document.createElement("div");
		    dialog.setAttribute("id","dialog");
		    dialog.setAttribute("title","Attention");
		    var dContent = document.createElement("a");
		    dContent.innerHTML = "The template is being edited in the wizard. Do you want to close without saving the changes, to save the changes and close or cancel the operation?";
		    dialog.appendChild(dContent);
		    document.body.appendChild(dialog);
		    var tName = this.file.id;
		    var tRoute = this.file.parent;
		    $("#dialog").dialog({
			    modal: true,
			    width: 450,
			    resizable: false,
			    draggable: false,
                close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
			    buttons: {
				    "Just close": function() {
					    templateEditor.getInstance().close(true);
                        this.file == null
					    $("#tabSection").tabs('select',0);
					    $("#tabSection").tabs('disable',1);
					    $(this).dialog("close");
				    },
				    "Save & Close": function() {
					    templateManager.getInstance().saveTemplate(tRoute,tName);
					    templateEditor.getInstance().close(true);
                        this.file == null
					    $("#tabSection").tabs('select',0);
					    $("#tabSection").tabs('disable',1);
					    $(this).dialog("close");
				    }
			    }
		    });
	    } else {
		    return codeManager.getInstance().closeFile(parent,templateName,"template");
	    }
    /*} else if (loadInWizard) { // closing and load in wizard
        null;
    } else { // closing and load in code editor
        var dialog = document.createElement("div");
	    dialog.setAttribute("id","dialog");
	    dialog.setAttribute("title","Template wizard says:");
	    var dContent = document.createElement("a");
	    dContent.innerHTML = "The same template is being edited in the code editor. Please select if you want to close without saving changes in the template in edition, to save the changes or cancel the edition in the wizard.";
        var parent = route.substring(0,route.lastIndexOf('/'));
        var templateName = route.substr(route.lastIndexOf('/')+1);
	    dialog.appendChild(dContent);
	    document.body.appendChild(dialog);
	    $("#dialog").dialog({
		    modal: true,
		    width: 450,
		    resizable: false,
		    draggable: false,
            close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		    buttons: {
			    "Close & Continue": function() {
				    codeManager.getInstance().closeFile(parent,templateName,"template",false);
				    templateManager.getInstance().loadTemplate(route, true);
				    $(this).dialog("close");
			    },
			    "Save & Continue": function() {
				    codeManager.getInstance().saveFile(parent,templateName,"template");
				    codeManager.getInstance().closeFile(parent,templateName,"template",false);
				    templateManager.getInstance().loadTemplate(route, templateName, true);
				    $(this).dialog("close");
			    }
		    }
	    });
    }*/
}

// returns the file structure of the template in the wizard if it is well formed, in other case returns null
templateManager.prototype.getTemplateWizard = function(route) {
    if (this.file != null && (this.file.parent+'/'+this.file.id).indexOf(route) == 0) {
	    var template = this.editor.getTemplate();
        if (template != "error") {
	        var serializedTemplate = (new XMLSerializer()).serializeToString(template);
	        var newFile = {id: this.file.id, text: serializedTemplate, parent: this.file.parent, syntax: this.file.syntax, type: this.type};
            return newFile;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

// this function organizes the operations to save a template that is being edited by the wizard
templateManager.prototype.saveTemplateWizard = function() {
	var template = this.editor.getTemplate();
    if (template != "error") {
	    var serializedTemplate = (new XMLSerializer()).serializeToString(template);
	    var newFile = {id: this.file.id, text: serializedTemplate, parent: this.file.parent, syntax: this.file.syntax, type: this.type};
        var context = this;
        var filesList = [];
        filesList.push(newFile);
        $.post("file/"+this.file.parent+"/"+this.file.id, {filesToSave: JSON.stringify(filesList)}, function(data, status) {
            context.saveCallback(data,status,newFile,i)
        });
    } else {
        logger.getInstance().showLog("The template could not be saved. Please fill properly the fields in the wizard.","error");
    }
}

// private methods

// callback for loading a template in the wizard
templateManager.prototype.loadInWizardCallback = function(data, status) {
    if (status=='success') {
        if (this.editor.loadTemplate(data.text) != -1) {
            this.file = data;
    	    $("#tabSection").tabs('enable',1);
    	    $("#tabSection").tabs('select',1);
        } else {
            this.file = null;
        }
    } else {
		logger.getInstance().showLog("The template could not be loaded into the wizard.","error");
    }
}

// The callback for saving a template into the server
templateManager.prototype.saveCallback = function(data,status) {
    if (status=='success') {
        if (eval('('+data+')').accomplished) {
		    logger.getInstance().showLog("The template has been successfully saved.","info");
        } else {
            logger.getInstance().showLog("The template could not be saved.","error");
        }
    } else {
        logger.getInstance().showLog("The template could not be saved.","error");
    }
}

// callback for renaming a template
templateManager.prototype.renameTemplateCallback = function(data,status,parent,oldName,newName,tFile) {
    if (status!='success') {
		logger.getInstance().showLog("The template could not be renamed.","error");
	} else {
        if (data=="error") {
            logger.getInstance().showLog("The template could not be renamed.","error");
        } else {
            this.file.id = newName;
            tFile.updateAfterRename(newName);
		    logger.getInstance().showLog("The file has been successfully renamed.","info");
        }
	}
}

// The callback for deleting a template
templateManager.prototype.deleteTemplateCallback = function(data,status,tFile) {
    if (status=='success') {
        if (data=='error') {
            logger.getInstance().showLog("The template could not be deleted.","error");
        } else {
            this.file = null;
            this.editor.close(true);
            tFile.updateAfterDelete();
            logger.getInstance().showLog("The template has been successfully deleted.","info");
        }
    } else {
        logger.getInstance().showLog("The template could not be deleted.","error");
    }
}

//shows a dialog to choose what to do when the user wants to edit a template in the wizard that is already being edited raw
templateManager.prototype.closeTemplateInCodeEditor = function(route, content) {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Template wizard says:");
	var dContent = document.createElement("a");
    dContent.innerHTML  = content;
	dContent.innerHTML = "The same template is being edited in the code editor. Please select if you want to close without saving changes in the template in edition, to save the changes or cancel the edition in the wizard.";
    var parent = route.substring(0,route.lastIndexOf('/'));
    var templateName = route.substr(route.lastIndexOf('/')+1);
	dialog.appendChild(dContent);
	document.body.appendChild(dialog);
	$("#dialog").dialog({
		modal: true,
		width: 450,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
			"Close & Continue": function() {
				codeManager.getInstance().closeFile(parent,templateName,"template",false);
				templateManager.getInstance().loadTemplate(route, true);
				$(this).dialog("close");
			},
			"Save & Continue": function() {
				codeManager.getInstance().saveFile(parent,templateName,"template");
				codeManager.getInstance().closeFile(parent,templateName,"template",false);
				templateManager.getInstance().loadTemplate(route, true);
				$(this).dialog("close");
			}
		}
	});
}

//shows a dialog to choose what to do when the user wants to edit a template in the wizard that is already being edited in the wizard
templateManager.prototype.closeTemplateInWizard = function(route, loadInWizard, content) {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Attention");
	var dContent = document.createElement("a");
	dContent.innerHTML = content;
	dialog.appendChild(dContent);
	document.body.appendChild(dialog);
	$("#dialog").dialog({
		modal: true,
		width: 450,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
			"Close & Continue": function() {
				templateEditor.getInstance().close(true);
				templateManager.getInstance().loadTemplate(route,loadInWizard);
				$(this).dialog("close");
			},
			"Save & Continue": function() {
				codeManager.getInstance().saveFile(route, templateName, "template");
				codeManager.getInstance().closeFile(route, templateName, "template", loadInWizard);
				templateManager.getInstance().loadTemplate(route,loadInWizard);
				$(this).dialog("close");
			}
		}
	});
}


