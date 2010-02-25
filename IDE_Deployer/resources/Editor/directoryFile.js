// directoryFile corresponds to the representation of file of code
function directoryFile() {
	file.call()
}

directoryFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
directoryFile.prototype.init = function(wrapper, file, manager) {
	this.wrapper = wrapper;
	this.file = file;
	this.dManager = manager;
    this.displaying = false;
}

// shows the interface of the file in the proyect navigator
directoryFile.prototype.paint = function() {
    this.wrapper.innerHTML = null;
	var dirEntry = document.createElement("div");
	dirEntry.setAttribute("class","dirEntry");
	var dirImage = document.createElement("img");
	dirImage.setAttribute("id",this.file.id);
	dirImage.setAttribute("class","entryImage");
	dirImage.setAttribute("alt","Folder");
	dirImage.setAttribute("Title","Document");
	dirImage.setAttribute("src","/resources/images/folder.png");
	dirEntry.appendChild(dirImage);
	var dirName = document.createElement("span");
	dirName.setAttribute("class","dirName");
	dirName.setAttribute("name",this.file.parent+"/"+this.file.id);
	dirName.setAttribute("title","Click to open "+this.file.id);
	dirName.innerHTML = this.file.id;
	var fileList = document.createElement("div");
	fileList.setAttribute("class","fileList");
    fileList.style.display = "none";
	dirName.addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleFiles(oEvent)},this),true);
	dirEntry.appendChild(dirName);
	var newFileButton = document.createElement("img");
	newFileButton.setAttribute("class","operationalButton");
	newFileButton.setAttribute("alt","New file");
	newFileButton.setAttribute("Title","Click to create a new file for this folder");
	newFileButton.setAttribute("src","/resources/images/add.png");
	newFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.createFile(oEvent)},this),true);
	var renameDirButton = document.createElement("img");
	renameDirButton.setAttribute("class","operationalButton");
	renameDirButton.setAttribute("alt","Rename");
	renameDirButton.setAttribute("Title","Click to rename this folder");
	renameDirButton.setAttribute("src","/resources/images/pencil.png");
	renameDirButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameDir(oEvent)},this),true);
	var saveDirButton = document.createElement("img");
	saveDirButton.setAttribute("class","operationalButton");
	saveDirButton.setAttribute("alt","Save");
	saveDirButton.setAttribute("Title","Click to save this folder");
	saveDirButton.setAttribute("src","/resources/images/disk.png");
	saveDirButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.saveDir(oEvent)},this),true);
	var deleteDirButton = document.createElement("img");
	deleteDirButton.setAttribute("class","operationalButton");
	deleteDirButton.setAttribute("alt","Delete");
	deleteDirButton.setAttribute("Title","Click to delete this folder");
	deleteDirButton.setAttribute("src","/resources/images/bin.png");
	deleteDirButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteDir(oEvent)},this),true);
	dirEntry.appendChild(newFileButton);
	dirEntry.appendChild(renameDirButton);
	dirEntry.appendChild(saveDirButton);
	dirEntry.appendChild(deleteDirButton);
	this.wrapper.appendChild(dirEntry);
	this.wrapper.appendChild(fileList);
    if (this.displaying) {
        var context = this;
        $.getJSON("file/"+this.file.parent+"/"+this.file.id, function(data, status) {
            context.listDirCallback(data,status,fileList)
        });
    }
}
// event-handling methods

// it shows/hides the files of a project when it's clicked
directoryFile.prototype.toggleFiles = function(oEvent) {
	if (this.displaying) {
        this.displaying = false;
        this.wrapper.lastChild.style.display = "none";
        oEvent.target.setAttribute("title","Open folder "+this.file.id);
	    this.wrapper.firstChild.nextSibling.innerHTML = "";
    } else {
        this.displaying = true;
        oEvent.target.setAttribute("title","Close folder "+this.file.id);
	    var fileList = oEvent.target.parentNode.nextSibling;
        var context = this;
        $.getJSON("file/"+this.file.parent+"/"+this.file.id, function(data, status) {
            context.listDirCallback(data,status,fileList)
        });
    }
}

// changes the Id ofo the project related
directoryFile.prototype.updateDirId = function(newId) {
    this.file.id = newId.substr(newId.lastIndexOf('/')+1);
}

// it saves the selected folder
directoryFile.prototype.saveDir = function() {
	this.dManager.saveDir(this.file.parent+"/"+this.file.id);
}

// it deletes the selected folder and the files inside it
directoryFile.prototype.deleteDir = function() {
	this.dManager.deleteDir(this.file.parent+"/"+this.file.id, this);
}

// makes the changes in the interface after finishing the deleting operations
directoryFile.prototype.updateDeleteDir = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

// it renames the selected folder and the files inside it
directoryFile.prototype.renameDir = function() {
	this.dManager.renameDir(this.file.parent+"/"+this.file.id, this);
}

// it creates a new file for the folder
directoryFile.prototype.createFile = function() {
	this.dManager.createFile(this.file.parent+"/"+this.file.id, this);
}

// makes the changes in the interface after creating a file in a folder
directoryFile.prototype.updateCreateFile = function() {
    this.displaying = true;
    this.wrapper.firstChild.setAttribute("title","Hide the files of the folder "+this.file.id);
    var fileList = this.wrapper.firstChild.nextSibling;
	fileList.innerHTML = null;
    var context = this;
    $.getJSON("file/"+this.file.parent+"/"+this.file.id, function(data2, status2) {
        context.listDirCallback(data2,status2,fileList)
    });
}

// Private methods

// Callback for listing the content of the dir
directoryFile.prototype.listDirCallback = function (files,status,fileList) {
    if (status=="success") {
        this.wrapper.lastChild.style.display = "block";
        for (i=0; i<files.length; i++){
		    wrapper = document.createElement("div");
		    if (files[i].type == "dir") {
			    wrapper.setAttribute("class","dirWrapper");
			    var dir = new directoryFile();
			    dir.init(wrapper, files[i], this.dManager);
			    dir.paint();
		    } else if (files[i].type == "code") {
			    wrapper.setAttribute("class","codeWrapper");
			    var code = new codeFile();
			    code.init(wrapper, files[i], codeManager.getInstance());
			    code.paint();
		    } else if (files[i].type == "template") {
			    wrapper.setAttribute("class","templateWrapper");
			    var template = new templateFile();
			    template.init(wrapper, files[i], templateManager.getInstance());
			    template.paint();
            } else if (files[i].type == "image") {
			    wrapper.setAttribute("class","imageWrapper");
			    var image = new imageFile();
			    image.init(wrapper, files[i], imageManager.getInstance());
			    image.paint();
		    } else {
			    wrapper.setAttribute("class","miscWrapper");
			    var misc = new miscFile();
			    misc.init(wrapper, files[i], miscManager.getInstance());
			    misc.paint();
            }
		    fileList.appendChild(wrapper);
	    }
    } else {
        logger.getInstance().showLog("The files of the folder could not be displayed.","error");
    }
}
