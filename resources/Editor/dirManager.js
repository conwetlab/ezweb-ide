// proyectManager is the class which provides access point to the functions for manging the data associated to the folders
function dirManager(){
}

// The singleton pattern
dirManager.instance = null;

dirManager.getInstance = function() {
	if (dirManager.instance == null) {
		dirManager.instance = new dirManager();
	}
	return dirManager.instance;
}

dirManager.prototype.init = function() {
    this.cManager = codeManager.getInstance();
    this.tManager = templateManager.getInstance();
    this.uploadingDir = null;
}

// Shows a dialog giving the options for creating a file and once then invokes the functionality to create it if the user says so
dirManager.prototype.createFile = function(route,dFile) {
    this.uploadingDir = dFile;
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Create/add a new file:");
	var dContent = document.createElement("a");
    var creationFileDiv = document.createElement("div");
    creationFileDiv.id = "creationFileDiv";
    creationFileDiv.style.display = "none";
    var importFileDiv = document.createElement("div");
    importFileDiv.id = "importFileDiv";
    importFileDiv.style.display = "none";
    var blankRadio = document.createElement("input");
    blankRadio.id = "creationFileRadio";
    blankRadio.type = "radio";
    blankRadio.name = "typeFileRadio";
    blankRadio.value = "blank";
    blankRadio.addEventListener("click",EzWebExt.bind(function(oEvent){
        if(oEvent.target.checked) {
            document.getElementsByClassName("ui-state-default")[4].style.display = "block";
            document.getElementById("importFileDiv").setAttribute("style","display:none");
            document.getElementById("creationFileDiv").setAttribute("style","display:block");
        }
    },this),true);
    var blankRadioSpan = document.createElement("span");
    blankRadioSpan.innerHTML = "Blank file";

    creationFileDiv.appendChild(document.createElement("br"));
	var creationNameSpan = document.createElement("span");
    creationNameSpan.innerHTML = "Name: ";
    creationFileDiv.appendChild(creationNameSpan);
    var creationInputName = document.createElement("input");
    creationInputName.setAttribute("type","text");
    creationInputName.setAttribute("id","dialogCreationName");
    creationFileDiv.appendChild(creationInputName);
    creationFileDiv.appendChild(document.createElement("br"));
    var creationTypeSpan = document.createElement("span");
    creationTypeSpan.innerHTML = "Type: ";
    creationFileDiv.appendChild(creationTypeSpan);
    var creationSelectType = document.createElement("select");
    creationSelectType.setAttribute("id","dialogCreationSelectType");
    var creationOptionCode = document.createElement("option");
    creationOptionCode.innerHTML = "Code file";
    creationOptionCode.setAttribute("value", "code");
    creationSelectType.appendChild(creationOptionCode);
    var creationOptionTemplate = document.createElement("option");
    creationOptionTemplate.innerHTML = "Template file";
    creationOptionTemplate.setAttribute("value", "template");
    creationSelectType.appendChild(creationOptionTemplate);
    var creationOptionFolder = document.createElement("option");
    creationOptionFolder.innerHTML = "Folder";
    creationOptionFolder.setAttribute("value", "dir");
    creationSelectType.appendChild(creationOptionFolder);
    creationSelectType.addEventListener("change",EzWebExt.bind(function(oEvent){
        if(oEvent.target.value == "code") {
            document.getElementById("dialogCreationSyntaxDiv").setAttribute("style","display:block");
        } else {
            document.getElementById("dialogCreationSyntaxDiv").setAttribute("style","display:none");
        }
    },this),true);
    creationFileDiv.appendChild(creationSelectType);
    creationFileDiv.appendChild(document.createElement("br"));
    var creationSyntaxDiv = document.createElement("div");
    creationSyntaxDiv.setAttribute("id","dialogCreationSyntaxDiv");
    var creationSyntaxSpan = document.createElement("span");
    creationSyntaxSpan.innerHTML = "Syntax: ";
    creationSyntaxDiv.appendChild(creationSyntaxSpan);
    var creationSelectSyntax = document.createElement("select");
    creationSelectSyntax.setAttribute("id","dialogCreationSelectSyntax");
    var creationOptionJS = document.createElement("option");
    creationOptionJS.innerHTML = "JavaScript";
    creationOptionJS.setAttribute("value", "js");
    creationSelectSyntax.appendChild(creationOptionJS);
    var creationOptionHTML = document.createElement("option");
    creationOptionHTML.innerHTML = "HTML";
    creationOptionHTML.setAttribute("value", "html");
    creationSelectSyntax.appendChild(creationOptionHTML);
    var creationOptionCSS = document.createElement("option");
    creationOptionCSS.innerHTML = "CSS";
    creationOptionCSS.setAttribute("value", "css");
    creationSelectSyntax.appendChild(creationOptionCSS);
    var creationOptionXML = document.createElement("option");
    creationOptionXML.innerHTML = "XML";
    creationOptionXML.setAttribute("value", "xml");
    creationSelectSyntax.appendChild(creationOptionXML);
    creationSyntaxDiv.appendChild(creationSelectSyntax);
    creationFileDiv.appendChild(creationSyntaxDiv);

    var importRadio = document.createElement("input");
    importRadio.id = "importFileRadio";
    importRadio.type = "radio";
    importRadio.name = "typeFileRadio";
    importRadio.value = "import";
    importRadio.addEventListener("click",EzWebExt.bind(function(oEvent){
        if(oEvent.target.checked) {
            document.getElementsByClassName("ui-state-default")[4].style.display = "none";
            document.getElementById("creationFileDiv").setAttribute("style","display:none");
            document.getElementById("importFileDiv").setAttribute("style","display:block");
        }
    },this),true);
	var importRadioSpan = document.createElement("span");
    importRadioSpan.innerHTML = "Import file";

    var formFile = document.createElement("form");
    formFile.method = "POST";
    formFile.enctype = "multipart/form-data";
    formFile.action = "import/";
    formFile.name = "formFile";
    var importNameSpan = document.createElement("span");
    importNameSpan.innerHTML = "Name of the file (with its extension): ";
    formFile.appendChild(importNameSpan);
    var importRoute = document.createElement("input");
    importRoute.setAttribute("name","importRoute");
    importRoute.setAttribute("type","hidden");
    importRoute.setAttribute("value",route);
    formFile.appendChild(importRoute);
    var importNameInput = document.createElement("input");
    importNameInput.setAttribute("type","text");
    importNameInput.setAttribute("name","importNameInput");
    formFile.appendChild(importNameInput);
    formFile.appendChild(document.createElement("br"));
    var importNameTipDiv = document.createElement("div");
    importNameTipDiv.id = "importNameTipDiv";
    importNameTipDiv.setAttribute("class","infoTip");
    importNameTipDiv.innerHTML = "Tip: if the name field is left empty the name assingned will be the one from the file.";
    formFile.appendChild(importNameTipDiv);
    formFile.appendChild(document.createElement("br"));
    var importTypeSpan = document.createElement("span");
    importTypeSpan.innerHTML = "Type: ";
    formFile.appendChild(importTypeSpan);
    var importSelectType = document.createElement("select");
    importSelectType.setAttribute("name","dialogImportSelectType");
    formFile.appendChild(importSelectType);
    formFile.appendChild(document.createElement("br"));
    var importOptionCode = document.createElement("option");
    importOptionCode.innerHTML = "Code file";
    importOptionCode.setAttribute("value", "code");
    importSelectType.appendChild(importOptionCode);
    var importOptionTemplate = document.createElement("option");
    importOptionTemplate.innerHTML = "Template file";
    importOptionTemplate.setAttribute("value", "template");
    importSelectType.appendChild(importOptionTemplate);
    var importOptionImage = document.createElement("option");
    importOptionImage.innerHTML = "Image";
    importOptionImage.setAttribute("value", "image");
    importSelectType.appendChild(importOptionImage);
    var importOptionOther = document.createElement("option");
    importOptionOther.innerHTML = "Other";
    importOptionOther.setAttribute("value", "other");
    importSelectType.appendChild(importOptionOther);
    var importFileSpan = document.createElement("span");
    importFileSpan.innerHTML = "Select the file: ";
    formFile.appendChild(importFileSpan);
    var importFileInput = document.createElement("input");
    importFileInput.setAttribute("type","file");
    importFileInput.setAttribute("name","importFileInput");
    formFile.appendChild(importFileInput);
    formFile.appendChild(document.createElement("br"));
    var submitInput = document.createElement("input");
    submitInput.setAttribute("type","submit");
    submitInput.setAttribute("value",'Send file >>');
    formFile.appendChild(submitInput);
    var context = this;
    formFile.onsubmit = function(){
	    return AIM.submit(formFile, {
            'onStart' : function(){return true;},
            'onComplete' : context.uploadFileCallback
        });
	}
    importFileDiv.appendChild(formFile);

    dContent.appendChild(blankRadio);
    dContent.appendChild(blankRadioSpan);
    dContent.appendChild(importRadio);
    dContent.appendChild(importRadioSpan);
    dContent.appendChild(document.createElement("br"));
    dContent.appendChild(creationFileDiv);
    dContent.appendChild(importFileDiv);
    dialog.appendChild(dContent);
	document.body.appendChild(dialog);
    var context = this;
	$("#dialog").dialog({
		modal: true,
		width: 437,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
            "Add file": function() {
                if (document.getElementById("creationFileRadio").checked) {
                    var newName = document.getElementById("dialogCreationName").value;
                    if (newName=="") {
                        logger.getInstance().showLog("The name cannot be empty.","error");
                    } else if (newName.indexOf("/")!=-1) {
                        logger.getInstance().showLog("The name cannot contain the character \'\/\'","error");
                    } else {
                        var newFile = {id: newName, type: document.getElementById("dialogCreationSelectType").value, syntax:"", parent: route};
                        var filesList = [];
                        if (document.getElementById("dialogCreationSelectType").value == "code") {
                            newFile.syntax = document.getElementById("dialogCreationSelectSyntax").value;
                        } else if (document.getElementById("dialogCreationSelectType").value == "template") {
                            newFile.syntax = "xml";
                        }
                        filesList.push(newFile);
                        $(this).dialog("close");
                        $.post("file/"+route+"/"+newName, {filesToSave: JSON.stringify(filesList)}, function(data, status) {
                            context.createFileCallback(data,status,dFile)
                        });
                    }
                } else if (document.getElementById("importFileRadio").checked) {
                    $(this).dialog("close");
                } else {
                    logger.getInstance().showLog("You have to choose first if you want to create a new file or import an existing one.","error");
                }
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// it renames a dir and every file that belongs to it, even if they are opened
dirManager.prototype.renameDir = function(oldName,dFile){
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Rename the dir");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "New name for the folder: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogDirName");
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
			"Rename": function() {
                var newName = document.getElementById("dialogDirName").value;
                if (newName=="") {
                    logger.getInstance().showLog("The name cannot be empty.","error");
                } else if (newName.indexOf("/")!=-1) {
                    logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                } else if (newName==oldName) {
                    logger.getInstance().showLog("The the new name cannot be the same as the old one.","error");
                } else {
                    $(this).dialog("close");
                    $.post("rename/"+oldName, {newId: newName}, function(data, status) {
                        context.renameDirCallback(data,status,oldName,newName,dFile);
                    });
                }
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// it deletes an existing folder, all of its contents and closes every one of its opened files
dirManager.prototype.deleteDir = function(route, dFile) {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Deleting a folder...");
	var dContent = document.createElement("a");
	var messageSpan = document.createElement("span");
    messageSpan.innerHTML = "Do you really want to delete this folder and its content?";
    dContent.appendChild(messageSpan);
	dialog.appendChild(dContent);
	document.body.appendChild(dialog);
    var context = this;
	$("#dialog").dialog({
		modal: true,
		width: 380,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
			"Delete": function() {
                $(this).dialog("close");
                $.post("delete/"+route, function(data, status) {
                    context.deleteDirCallback(data,status,dFile)
                });
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// obtains the files that are being edited and manages the saving procedure
dirManager.prototype.saveDir = function(route) {
    var filesInEditor = this.cManager.getDirFiles(route);
    var templateInWizard = this.tManager.getTemplateWizard(route);
    if (filesInEditor.length==0 && templateInWizard == null) {
        logger.getInstance().showLog("There was no change to be saved so the saving was cancelled.","warning");
    } else {
        var context = this;
        if (templateInWizard != null) {
            filesInEditor.push(templateInWizard);
        }
        $.post("file/"+route, {filesToSave: JSON.stringify(filesInEditor)}, function(data, status) {
            context.saveDirCallback(data,status,route)
        });
    }
}

// Private Methods

// callback for the creation of file that belongs to a dir
dirManager.prototype.createFileCallback = function(data,status,dFile) {
    if (status=="success") {
        dFile.updateCreateFile();
        //imageManager.getInstance().paint();
        logger.getInstance().showLog("The element has been successfully created.","info");
    } else {
        logger.getInstance().showLog("The "+data.type+" could not be created or it may already exist.","error");
    }
}

// makes the neccesary changes if folder was renamed succesfully
dirManager.prototype.renameDirCallback = function(data,status,oldName,newName,dFile) {
    if (status=="success") {
        this.cManager.renameDirFiles(oldName,newName);
        this.tManager.renameDirTemplate(oldName,newName);
        logger.getInstance().showLog("The folder has been successfully renamed.","info");
        dFile.updateDirId(newName);
        dFile.paint();
    } else {
        logger.getInstance().showLog("The folder could not be renamed..","error");
    }
}

// cleans the element of the interface related to a deleted folder if it has been deleted in the server
dirManager.prototype.deleteDirCallback = function(data,status,dFile) {
    if (status=="success") {
        dFile.updateDeleteDir();
        logger.getInstance().showLog("The dir was successfully deleted.","info");
    } else {
        logger.getInstance().showLog("The dir could not be deleted.","error");
    }
}

// manages the update of the state of edition of the files saved
dirManager.prototype.saveDirCallback = function(data,status,route) {
    if (status=="success") {
        this.cManager.setSavedFiles(route);
        logger.getInstance().showLog("The files were succesfully saved.","info");
    } else {
        logger.getInstance().showLog("The files could not be saved.","error");
    }
}

// callback for uploading a file
dirManager.prototype.uploadFileCallback = function(transport) {
    $("#dialog").dialog('close');
    if (transport!="Error") {
        dirManager.getInstance().uploadingDir.updateCreateFile();
        logger.getInstance().showLog("The file has been successfully uploaded.","info");
    } else {
        logger.getInstance().showLog("The file could not be uploaded.","error");
    }
}
