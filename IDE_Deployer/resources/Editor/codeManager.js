// codeManager is the class which manages all the operations related to edition of code files
function codeManager(){
	editManager.call()
}

codeManager.prototype = new editManager();

//JavaScript does not allow to heir the singleton pattern
codeManager.instance = null;

codeManager.getInstance = function() {
	if (codeManager.instance == null) {
		codeManager.instance = new codeManager();
	}
	return codeManager.instance;
}

// This initializes the object
// It receives:
// 	identifier: the id of the div where the code editor should be placed.
//	lang: the language configuration of the editor
codeManager.prototype.init = function(identifier,lang){
	this.containerId = identifier;
	this.lang = lang;
	this.textareaId = "editAreaEditor";
	this.files = [];
	this.editing = false;
    document.getElementById("editAreaEditor").style.display = "none";
    document.getElementById("infoEditor").style.display = "inline";	
	this.fileToLoad = null;
    this.paint();
}

// Handlers for the callbacks (due to visibility problems the must be declared here)

// Cleans the area preventing that the broser's cache sets some text in it
function editAreaLoaded(textarea){
	if (codeManager.getInstance().fileToLoad){ // management to open a file once the editor is loaded
		$("#tabSection").tabs('select',0);
		editAreaLoader.openFile(codeManager.getInstance().textareaId, codeManager.getInstance().fileToLoad);
	} else {
		editAreaLoader.setValue(textarea,"");
	}
}

// Public methods

// Checks if a file is loaded (returns -1 if not found)
codeManager.prototype.isFileLoaded = function (route) {
	var i = 0;
	var found = false;
	while (!found && i<this.files.length){
		if ((route)==this.files[i].id){
			found = true;
		} else {
			i++;
		}
	}
	if (found) {
		return i;
	} else {
		return -1;
	}
}

// Loads the file and creates the structures associatted to it
codeManager.prototype.loadFile = function(route) {
	var found = this.isFileLoaded(route);
	if (found == -1) {
        var context = this;
        $.getJSON("file/"+route, function(data, status) {
            context.loadFileCallback(data,status)
        });
	} else {
        $("#tabSection").tabs('select',0);
        var tFile = editAreaLoader.getFile(this.textareaId,route);
        var content = tFile.text; // the editArea changes it when the file is closed so it must be saved again
        var syntax = tFile.syntax;
        editAreaLoader.closeFile(this.textareaId, route);
        tFile.text = content;
        tFile.syntax = syntax;
        editAreaLoader.openFile(this.textareaId, tFile);
        editAreaLoader.setValue(this.textareaId, tFile.text);
        if (tFile.edited) {
            editAreaLoader.setFileEditedMode(this.textareaId,tFile.id,true);
        }
        document.getElementById("frame_editAreaEditor").contentDocument.getElementById("syntax_selection").value = syntax;
	}
}

// It closes the file and free the structures associatted to it
codeManager.prototype.closeFile = function(parent,fileName) {
	var i = this.isFileLoaded(parent+"/"+fileName);
	if (i == -1) {
		logger.getInstance().showLog("The file could not be closed because it was not opened.","warning");
	} else {
        $("#tabSection").tabs('select',0);
		if (editAreaLoader.getFile(this.textareaId,parent+"/"+fileName).edited) {
	        var dialog = document.createElement("div");
	        dialog.setAttribute("id","dialog");
	        dialog.setAttribute("title","Code editor says:");
	        var dContent = document.createElement("a");
	        dContent.innerHTML = "Do you want to close without saving the changes in the file?";
	        dialog.appendChild(dContent);
	        document.body.appendChild(dialog);
            var context = this;
	        $("#dialog").dialog({
		        modal: true,
		        width: 400,
		        resizable: false,
		        draggable: false,
                close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		        buttons: {
			        "Close the file": function() {
				        context.files.splice(i,1);
				        if (context.files.length == 0){
					        document.getElementById("editAreaEditor").style.display="none";
                            document.getElementById("editAreaEditor").nextSibling.style.display="none";
                            document.getElementById("infoEditor").style.display = "inline";	
                            context.editing = false;
					        context.paint();
				        } else {
					        editAreaLoader.closeFile(context.textareaId, parent+"/"+fileName);
				        }
				        logger.getInstance().showLog("The file has been succesfully closed.","info");
				        $(this).dialog("close");
			        },
                    "Cancel": function() {
                        $(this).dialog("close");
			        }
		        }
	        });
		} else {
			this.files.splice(i,1);
			if (this.files.length == 0){
                document.getElementById("editAreaEditor").style.display="none";
                document.getElementById("editAreaEditor").nextSibling.style.display="none";
                document.getElementById("infoEditor").style.display = "inline";
				this.editing = false;
				this.paint();
			} else {
				editAreaLoader.closeFile(this.textareaId, parent+"/"+fileName);
			}
			logger.getInstance().showLog("The file has been succesfully closed.","info");
		}
	}
}

// Starts the operations for saving the file
codeManager.prototype.saveFile = function(parent,fileName,type) {
	var i = this.isFileLoaded(parent+"/"+fileName);
	if (i == -1) {
		logger.getInstance().showLog("The file "+parent+"/"+fileName+" was not saved because it haven't been modified.","info");
	} else {
        $("#tabSection").tabs('select',0);
		var newFile = {id: fileName, text: editAreaLoader.getFile(this.textareaId,parent+"/"+fileName).text, parent: parent, syntax: this.files[i].syntax, type: type};
        var context = this;
        var filesList = [];
        filesList.push(newFile);
        $.post("file/"+parent+"/"+fileName, {filesToSave: JSON.stringify(filesList)}, function(data, status) {
            context.saveFileCallback(data,status,newFile,i)
        });
	}	
}

// Manages the renaming of a file showing a dialog to enter the new name
codeManager.prototype.renameFile = function(parent,oldName,cFile) {
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Rename the file");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "New name for the file: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogFileName");
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
                var newName = document.getElementById("dialogFileName").value;
                if (newName=="") {
                    logger.getInstance().showLog("The name cannot be empty.","error");
                } else if (newName.indexOf("/")!=-1) {
                    logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                } else if (newName==oldName) {
                    logger.getInstance().showLog("The the new name cannot be the same as the old one.","error");
                } else {
                    $.post("rename/"+parent+'/'+oldName, {newId: newName}, function(data, status) {
                        context.renameFileCallback(data,status,parent,oldName,newName,cFile);
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

// If the file is opened it deletes the file of a project
// It returns true if the file has been succesfully deleted, else returns false
codeManager.prototype.deleteFile = function(route,cFile){
	var i = this.isFileLoaded(route);
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Code editor says:");
	var dContent = document.createElement("a");
	dContent.innerHTML = "Do you really want to delete this file?";
	dialog.appendChild(dContent);
	document.body.appendChild(dialog);
    var context = this;
	$("#dialog").dialog({
		modal: true,
		width: 280,
		resizable: false,
		draggable: false,
        close: function(){$("#dialog").dialog('destroy');document.body.removeChild(document.getElementById("dialog"))},
		buttons: {
			"Delete": function() {
				$("#dialog").dialog('close');
                $.post("delete/"+route, function(data, status) {
                    context.deleteFileCallback(data,status,i,cFile,route)
                });
			},
            "Cancel": function() {
                $(this).dialog("close");
			}
		}
	});
}

// Renames every opened file opened that belongs to the old dir
codeManager.prototype.renameDirFiles = function(oldBaseDir,newBaseDir){
    var filesAux = [];
    for (i=0; i<this.files.length; i++) {
        if (this.files[i].id.search(oldBaseDir)==0) {
            var fileToRename = editAreaLoader.getFile(this.textareaId, this.files[i].id);
            editAreaLoader.closeFile(this.textareaId, fileToRename.id);
            fileToRename.id = newBaseDir+fileToRename.id.substr(oldBaseDir.length);
            fileToRename.title = fileToRename.id;
            filesAux.push(fileToRename);
            editAreaLoader.openFile(this.textareaId, fileToRename);
        } else {
            filesAux.push(this.files[i]);
        }
    }
    this.files = filesAux;
}

// Closes every opened file opened that belongs to the given dir
codeManager.prototype.deleteDirFiles = function(baseDir){
    for (i=0; i<this.files.length; i++) {
        if (this.files[i].id.search(oldBaseDir)==0) {
            editAreaLoader.closeFile(this.textareaId, this.files[i].id);
            this.files.splice(i,1);
        }
    }
}

// Returns an array with the files that are opened and modified that belongs to a given dir
codeManager.prototype.getDirFiles = function(baseDir){
    var filesToSave = [];
    for (i=0; i<this.files.length; i++) {
        if (this.files[i].id.search(baseDir)==0) {
            var currentFile = editAreaLoader.getFile(this.textareaId,this.files[i].id)
            this.files[i].text = currentFile.text;
            this.files[i].syntax = currentFile.syntax;
            var newFile = {
                id: this.files[i].id.substr(this.files[i].id.lastIndexOf('/')+1),
                text: currentFile.text,
                parent: this.files[i].id.substr(0,this.files[i].id.lastIndexOf('/')),
                syntax: currentFile.syntax,
                type: this.files[i].type
            }
            filesToSave.push(newFile);
        }
    }
    return filesToSave;
}

// Sets to not edited the files that belongs to a given dir
codeManager.prototype.setSavedFiles = function(baseDir){
    for (i=0; i<this.files.length; i++) {
        if (this.files[i].id.search(baseDir)==0) {
            editAreaLoader.setFileEditedMode(this.textareaId, this.files[i].id, false);
        }
    }
}

// Function for building the part of the interface corresponding to the editor
codeManager.prototype.paint = function(){
	if (this.files.length==0){
		document.getElementById("infoEditor").style.display = "inline";	
	} else {
		this.editing = true;
        document.getElementById("infoEditor").style.display = "none";	
		var textarea = document.getElementById("editAreaEditor");
        textarea.style.display = "inline";
		// Edition environment initialization
		editAreaLoader.init({
			id : this.textareaId			// textarea id
			,language: this.lang			// language of the editor
			,allow_toggle: false			// disables toggling between views
			,isMultifiles: true			    // allows to edit more than one file at the same time
			,start_highlight: true			// to display with highlight mode on start-up
			,allow_resize: "no"			    // disables the resizing
            ,syntax_selection_allow: "css,html,js,php"
			,toolbar: "search, go_to_line, |, undo, redo, |, syntax_selection, |, help"
			// callbacks for the events
			,EA_load_callback: "editAreaLoaded"
		});
	}
}

// Private methods

// The callback for loading a file from the server
codeManager.prototype.loadFileCallback = function(data,status) {
    if (status=="success") {
        if (data.error != undefined) {
            logger.getInstance().showLog(data.error,"error");
        } else {
            var newFile = {id: data.parent+"/"+data.id, text: data.text, type:data.type, syntax: data.syntax, title: data.parent+"/"+data.id};
            this.files.push(newFile);
            $("#tabSection").tabs('select',0);
		    if (!this.editing){
			    this.fileToLoad = newFile;
			    this.paint();
		    } else {
			    editAreaLoader.openFile(this.textareaId, newFile);
		    }
        }
    } else {
        logger.getInstance().showLog("The file could not be retrieved.","error");
    }
}

// The callback for renaming a file from the server
codeManager.prototype.renameFileCallback = function(data,status,parent,oldName,newName,cFile) {
    if (status!='success') {
		logger.getInstance().showLog("The file could not be renamed.","error");
	} else {
        if (data=="error") {
            logger.getInstance().showLog("The file could not be renamed.","error");
        } else {
            var i = this.isFileLoaded(parent+"/"+oldName);
            if (i!=-1) {
                $("#tabSection").tabs('select',0);
		        var newFile = {id: parent+"/"+newName, type:this.files[i].type, text: this.files[i].text, syntax: this.files[i].syntax, title: parent+"/"+newName};
		        this.files[i] = newFile;
                var openedFile = editAreaLoader.getFile(this.textareaId, parent+"/"+oldName);
                var content = openedFile.text; // the same as in the loading function
                var syntax = openedFile.syntax;
		        editAreaLoader.closeFile(this.textareaId, parent+"/"+oldName);
                openedFile.id = parent+"/"+newName;
                openedFile.title = parent+"/"+newName;
                openedFile.text = content;
                openedFile.syntax = syntax;
		        editAreaLoader.openFile(this.textareaId, openedFile);
                if (openedFile.edited) {
                    editAreaLoader.setFileEditedMode(this.textareaId,openedFile.id,true);
                }
                document.getElementById("frame_editAreaEditor").contentDocument.getElementById("syntax_selection").value = syntax;
            }
            cFile.updateAfterRename(newName);
		    logger.getInstance().showLog("The file has been successfully renamed.","info");
        }
	}
}

// The callback for saving a file into the server
codeManager.prototype.saveFileCallback = function(data,status,newFile,found) {
    if (status=='success') {
        if (eval('('+data+')').accomplished) {
            var newFile2 = {id: newFile.parent+"/"+newFile.id, text: editAreaLoader.getFile(this.textareaId,newFile.parent+"/"+newFile.id).text, parent: newFile.parent, syntax: this.files[found].syntax};
		    this.files[found] = newFile2;
		    editAreaLoader.setFileEditedMode(this.textareaId, newFile.parent+"/"+newFile.id, false);
		    logger.getInstance().showLog("The file has been successfully saved.","info");
        } else {
            logger.getInstance().showLog("The file could not be saved.","error");
        }
    } else {
        logger.getInstance().showLog("The file could not be saved.","error");
    }
}

// The callback for renaming a file from the server
codeManager.prototype.deleteFileCallback = function(data,status,found,cFile,route) {
    if (status=='success') {
        if (data=='error') {
            logger.getInstance().showLog("The file could not be deleted.","error");
        } else {
		    if (found!=-1) {
                $("#tabSection").tabs('select',0);
			    this.files.splice(found,1);
			    editAreaLoader.closeFile(this.textareaId,route);
			    if (this.files.length == 0) {
                    document.getElementById("editAreaEditor").style.display="none";
                    document.getElementById("editAreaEditor").nextSibling.style.display="none";
				    document.getElementById("infoEditor").style.display = "inline";
				    this.init(this.containerId,this.lang);
				    this.paint();
			    }
            }
            cFile.updateAfterDelete();
            logger.getInstance().showLog("The file has been successfully deleted.","info");
        }
    } else {
        logger.getInstance().showLog("The file could not be deleted.","error");
    }
}

// alters the size and the positions of the area of the editor
codeManager.prototype.resizeHandler = function(oEvent) {
    var codeEditor = document.getElementById("frame_editAreaEditor");
    if (codeEditor) {
        codeEditor.height = codeEditor.parentNode.offsetHeight;
        codeEditor.width = codeEditor.parentNode.offfsetWidth;
    }
}
