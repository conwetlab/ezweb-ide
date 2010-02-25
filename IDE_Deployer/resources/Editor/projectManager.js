// proyectManager is the class which provides the common interface for the differnt editors
// of the tool. It contains the common attributes and methods
function projectManager(){
}

// The singleton pattern
projectManager.instance = null;

projectManager.getInstance = function() {
	if (projectManager.instance == null) {
		projectManager.instance = new projectManager();
	}
	return projectManager.instance;
}

// This initializes the object
// It receives:
// 	identifier: the id of the div where the editor and the project management section should be placed.
projectManager.prototype.init = function(identifier) {
	this.containerId = identifier;
    this.dManager = dirManager.getInstance();
    this.dManager.init();
	this.cManager = codeManager.getInstance();
	this.cManager.init("editorLayer", this.language);
	this.tManager = templateManager.getInstance();
	this.tManager.init("templateLayer");
	templateManager.getInstance().init("templateLayer");
    this.count = 0;
    this.projects = [];
    this.currentProject = "";
    this.uploadingProject = null;
    this.fileInCreation = "";
    this.fileInCreationRoute = "";
    var context = this;
    $.getJSON("/projects/", function(data,status) {
        context.setProjectsCallback(data,status)
    });
}

// Updates the current project
projectManager.prototype.setCurrentProject = function(project) {
    this.currentProject = project;
}

// Returns the id of the current project
projectManager.prototype.getCurrentProject = function() {
    return this.currentProject;
}

// Function for building the part of the interface corresponding to the editor.
projectManager.prototype.paint = function() {
	// the section for the projects
	var projectList = document.getElementById(this.containerId);
	if (this.count==0){ // There are no projects
		var noProjectsInfo = document.createElement("p");
		noProjectsInfo.setAttribute("id","noProjects");
		noProjectsInfo.innerHTML = "You do not have any projects";
		projectList.appendChild(noProjectsInfo);
	}else{ //Building the list of projects
        projectList.innerHTML = "";
		for (i=0;i<this.projects.length;i++){
			var projectWrapper = document.createElement("div");
			projectWrapper.setAttribute("class","projectWrapper");
			var projectDir = new projectFile();
			projectDir.init(projectWrapper, this.projects[i], this);
			projectDir.paint();
			projectList.appendChild(projectWrapper);
		}
	}
	var newProjectButton = document.getElementById("bCreateProject");
	newProjectButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.createProject(oEvent)},this),true);
}

// it creates a new project and the related files, showing a dialog to ask for the new name
projectManager.prototype.createProject = function() {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","New project:");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "Name of the new project: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogProjectName");
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
			"Create": function() {
                var newName = document.getElementById("dialogProjectName").value;
                if (newName=="") {
                    logger.getInstance().showLog("The name of a project cannot be empty.","error");
                } else if (newName.indexOf("/")!=-1) {
                    logger.getInstance().showLog("The name of a project cannot contain the character \'\/\'","error");
                } else {
		            var newFile = {id: newName, type: 'dir', parent:null};
                    var filesList = [];
                    filesList.push(newFile);
                    $(this).dialog("close");
                    $.post("file/"+newName, {filesToSave: JSON.stringify(filesList)}, function(data, status) {
                        context.createProjectCallback(data,status,newName)
                    });
                }
				$(this).dialog("close");
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// Shows a dialog giving the options for creating a file or import it and once then invokes the functionality to create it if the user says so
projectManager.prototype.createFile = function(route,pFile) {
    this.uploadingProject = pFile;
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
    /*importSelectType.addEventListener("change",EzWebExt.bind(function(oEvent){
        if (oEvent.target.value == "template") {
            this.fileInCreation = "template";
        } else if (oEvent.target.value == "image"){
            this.fileInCreation = "image";
        } else {
            this.fileInCreation = "";
        }
    },this),true);*/
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
                            this.fileInCreation = "template";
                        }
                        filesList.push(newFile);
                        $(this).dialog("close");
                        $.post("file/"+route+"/"+newName, {filesToSave: JSON.stringify(filesList)}, function(data, status) {
                            context.createFileCallback(data,status,pFile)
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

// it deletes an existing project, all of its contents and closes every one of it opened files
projectManager.prototype.deleteProject = function(route, pFile) {
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Deleting a project...");
	var dContent = document.createElement("a");
	var messageSpan = document.createElement("span");
    messageSpan.innerHTML = "Do you really want to delete this project and its content?";
    dContent.appendChild(messageSpan);
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
				$(this).dialog("close");
                $.post("delete/"+route, function(data, status) {
                    context.deleteProjectCallback(data,status,pFile,route)
                });
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// it renames a project 
projectManager.prototype.renameProject = function(oldName,pFile){
	var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Rename the project");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "New name for the project: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogProjectName");
    dContent.appendChild(inputName);
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
			"Rename": function() {
                var newName = document.getElementById("dialogProjectName").value;
                if (newName=="") {
                    logger.getInstance().showLog("The name cannot be empty.","error");
                } else if (newName.indexOf("/")!=-1) {
                    logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                } else if (newName==oldName) {
                    logger.getInstance().showLog("The the new name cannot be the same as the old one.","error");
                } else {
                    $(this).dialog("close");
                    $.post("rename/"+oldName, {newId: newName}, function(data, status) {
                        context.renameProjectCallback(data,status,oldName,newName,pFile);
                    });
                }
				$(this).dialog("close");
			},
			"Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// obtains the files that are being edited and manages the saving procedure
projectManager.prototype.saveProject = function(route) {
    this.dManager.saveDir(route);
}

// shows the dialog asking for the data of the .wgt
projectManager.prototype.generateWgt = function(route) {
    context = this;
    $.getJSON("/templates/"+route, function(data,status) {context.setTemplatesCallback(data,status,route)});
}


// Private methods

// The callback for creating a new element in a project
projectManager.prototype.createFileCallback = function(data,status,pFile) {
    if (status=="success") {
        pFile.updateCreateFile();
        //imageManager.getInstance().paint();
        logger.getInstance().showLog("The element has been successfully created.","info");
    } else {
        logger.getInstance().showLog("The "+data.type+" could not be created or it may already exist.","error");
    }
}

// sets the list of available projects and invokes the painting of the environment
projectManager.prototype.setProjectsCallback = function(data,status) {
    if (status=="success") {
        this.count = data.length;
        this.projects = data;
        this.paint();
    } else {
        logger.getInstance().showLog("The projects could not be retrieved.","error");
    }
}

// sets the list of available projects and invokes the painting of the environment
projectManager.prototype.createProjectCallback = function(data,status,newName) {
    if (status=="success") {
        var oData = eval('(' +data+ ')');
        if (oData.accomplished) {
            this.count++;
            var projectList = document.getElementById("projectsList");
            if (this.count==1) {
                projectList.innerHTML = "";
            }
            var projectWrapper = document.createElement("div");
		    projectWrapper.setAttribute("class","projectWrapper");
		    var projectDir = new projectFile();
		    projectDir.init(projectWrapper, {id:newName},this);
		    projectDir.paint();
		    projectList.appendChild(projectWrapper);
            //deployer.getInstance().updateProjects();
            //imageManager.getInstance().paint();
            logger.getInstance().showLog("The project has been successfully created.","info");
        } else {
            logger.getInstance().showLog("There is another project with the same name.","error");
        }
    } else {
        logger.getInstance().showLog("The project could not be created.","error");
    }
}

// cleans the element of the interface related to a deleted project if it has been deleted in the server
projectManager.prototype.deleteProjectCallback = function(data,status,pFile,route) {
    if (status=="success") {
        pFile.updateDeleteProject();
        this.count--;
        var projectList = document.getElementById(this.containerId);
	    if (this.count==0){ // There are no projects
            projectList.innerHTML = "";
		    var noProjectsInfo = document.createElement("p");
		    noProjectsInfo.setAttribute("id","noProjects");
		    noProjectsInfo.innerHTML = "You do not have any projects";
		    projectList.appendChild(noProjectsInfo);
	    }
        //deployer.getInstance().updateOnDelete(route,"project");
        //imageManager.getInstance().updateOnDelete(route);
        logger.getInstance().showLog("The project was successfully deleted.","info");
    } else {
        logger.getInstance().showLog("The projects could not be retrieved.","error");
    }
}

// makes the neccesary changes if project was renamed succesfully
projectManager.prototype.renameProjectCallback = function(data,status,oldName,newName,pFile) {
    if (status=="success") {
        this.projects = data;
        this.cManager.renameDirFiles(oldName,newName);
        this.tManager.renameDirTemplate(oldName,newName);
        logger.getInstance().showLog("The project has been successfully renamed.","info");
        pFile.updateProjectId(newName);
        //imageManager.getInstance().updateOnRename(oldName,newName);
        //deployer.getInstance().updateOnRename(oldName,newName,"project");
        pFile.paint();
    } else {
        logger.getInstance().showLog("The projects could not be retrieved.","error");
    }
}

// callback for uploading a file
projectManager.prototype.uploadFileCallback = function(transport) {
    $("#dialog").dialog('close');
    if (transport!="Error") {
        var created = eval(transport);
        deployer.getInstance().updateTemplates(created[0].parent+'/'+created[0].id);
        projectManager.getInstance().uploadingProject.updateCreateFile();
        logger.getInstance().showLog("The file has been successfully uploaded.","info");
    } else {
        logger.getInstance().showLog("The file could not be uploaded.","error");
    }
}

// makes the neccesary changes if project was renamed succesfully
projectManager.prototype.generateWgtCallback = function(data,status,route) {
    if (status=="success") {
        logger.getInstance().showLog("Package created","info");
        window.open("http://"+location.host+"/"+data,"_blank")
    } else {
        logger.getInstance().showLog("The .wgt could not be generated.","error");
    }
}

// shows the dialog for creating a .wgt package
projectManager.prototype.setTemplatesCallback = function(data,status,route) {
    if (status=="success") {
        if (data.length>0) {
            var dialog = document.createElement("div");
	        dialog.setAttribute("id","dialog");
	        dialog.setAttribute("title","Data for the package");
	        var dContent = document.createElement("a");
	        var nameSpan = document.createElement("span");
            nameSpan.innerHTML = "New name for the project: ";
            dContent.appendChild(nameSpan);
            var inputName = document.createElement("input");
            inputName.setAttribute("type","text");
            inputName.setAttribute("id","dialogProjectName");
            dContent.appendChild(inputName);
	        dialog.appendChild(dContent);
	        document.body.appendChild(dialog);
            dContent.appendChild(document.createElement("br"));
            var versionSpan = document.createElement("span");
            versionSpan.innerHTML = "Version of the gadget: ";
            dContent.appendChild(versionSpan);
            var inputVersion = document.createElement("input");
            inputVersion.setAttribute("type","text");
            inputVersion.setAttribute("id","dialogVersion");
            dContent.appendChild(inputVersion);
            dContent.appendChild(document.createElement("br"));
            var vendorSpan = document.createElement("span");
            vendorSpan.innerHTML = "Vendor of the gadget: ";
            dContent.appendChild(vendorSpan);
            var inputVendor = document.createElement("input");
            inputVendor.setAttribute("type","text");
            inputVendor.setAttribute("id","dialogVendorName");
            dContent.appendChild(inputVendor);
            dContent.appendChild(document.createElement("br"));
            var templateSpan = document.createElement("span");
            templateSpan.innerHTML = "Template of the gadget: ";
            dContent.appendChild(templateSpan);
            var selectTemplate = document.createElement("select");
            selectTemplate.setAttribute("id","dialogTemplateSelect");
            for (i=0; i<data.length; i++) {
                var option = document.createElement("option");
                option.setAttribute("value",data[i].id);
                option.innerHTML = data[i].id;
                selectTemplate.appendChild(option);
            }
            dContent.appendChild(selectTemplate);
            dContent.appendChild(document.createElement("br"));
            var wgtSpan = document.createElement("span");
            wgtSpan.innerHTML = "Name of the wgt template: ";
            dContent.appendChild(wgtSpan);
            var inputWgt = document.createElement("input");
            inputWgt.setAttribute("type","text");
            inputWgt.setAttribute("id","dialogWgtName");
            dContent.appendChild(inputWgt);
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
			        "Create package": function() {
                        var newName = document.getElementById("dialogProjectName").value;
                        var newVersion = document.getElementById("dialogVersion").value;
                        var newVendor = document.getElementById("dialogVendorName").value;
                        var newWgt = document.getElementById("dialogWgtName").value;
                        var template = document.getElementById("dialogTemplateSelect").value;
                        if (newName=="" || newVersion=="" || newVendor=="" || newWgt=="") {
                            logger.getInstance().showLog("Any of the fields can be blank.","error");
                        } else if (newName.indexOf("/")!=-1 || newVersion.indexOf("/")!=-1 || newVendor.indexOf("/")!=-1 || newWgt.indexOf("/")!=-1) {
                            logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                        } else {
                            $(this).dialog("close");
                            $.post("wgt/"+route, {wgtName: newName, wgtVersion: newVersion, wgtVendor: newVendor, wgtTemplate: template, wgtTemplateName: newWgt }, function(data, status) {
                                context.generateWgtCallback(data,status,route);
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
            logger.getInstance().showLog("This project does not have any templates yet.","error");
        }
    } else {
        logger.getInstance().showLog("The templates for the project could not be retrieved.","error");
    }
}
