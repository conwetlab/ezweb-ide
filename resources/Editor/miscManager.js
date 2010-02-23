// miscManager is the class of the object that manages the files tha are not projects, dirs, code files, templates or images
function miscManager(){
}

// The singleton pattern
miscManager.instance = null;

miscManager.getInstance = function() {
	if (miscManager.instance == null) {
		miscManager.instance = new miscManager();
	}
	return miscManager.instance;
}

// initializes the object an sets the event handlers
miscManager.prototype.init = function() {
    null;
}

// deletes a misc file and updates the its related entry
miscManager.prototype.deleteFile = function(route,mFile) {
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Misc manager says:");
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
                $(this).dialog("close");
                $.post("delete/"+route, function(data, status) {
                    context.deleteFileCallback(data,status,mFile)
                });
			}
		}
	});
}

// Manages the renaming of a misc file showing a dialog to enter the new name
miscManager.prototype.renameFile = function(parent,oldName,mFile) {
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Rename the file");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "New name for the file: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogMiscName");
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
                var newName = document.getElementById("dialogMiscName").value;
                if (newName=="") {
                    logger.getInstance().showLog("The name cannot be empty.","error");
                    $(this).dialog("close");
                } else if (newName.indexOf("/")!=-1) {
                    logger.getInstance().showLog("The name cannot contain the character \'\/\'.","error");
                    $(this).dialog("close");
                } else if (newName==oldName) {
                    logger.getInstance().showLog("The the new name cannot be the same as the old one.","error");
                    $(this).dialog("close");
                } else {
                    $(this).dialog("close");
                    $.post("rename/"+parent+'/'+oldName, {newId: newName}, function(data, status) {
                        context.renameFileCallback(data,status,parent,oldName,newName,mFile);
                    });
                }
			}
		}
	});
}

// Private functions and callbacks

//  manages the updating process after deleting a misc file
miscManager.prototype.deleteFileCallback = function(data,status,mFile) {
    if (status!='success') {
        logger.getInstance().showLog("The file could not be deleted.","error");
    } else {
        if (data=='error') {
            logger.getInstance().showLog("The file could not be deleted.","error");
        } else {
            mFile.updateAfterDelete();
            logger.getInstance().showLog("The file has been successfully deleted.","info");
        }
    }
}

// manages the updating process after renaming a misc file
miscManager.prototype.renameFileCallback = function(data,status,parent,oldName,newName,mFile) {
    if (status!='success') {
		logger.getInstance().showLog("The file could not be renamed.","error");
	} else {
        if (data=="error") {
            logger.getInstance().showLog("The file could not be renamed.","error");
        } else {
            mFile.updateAfterRename(newName);
		    logger.getInstance().showLog("The file has been successfully renamed.","info");
        }
    }
}
