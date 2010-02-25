// codeFile corresponds to the representation of file of code
function codeFile(){
	file.call()
}

codeFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
codeFile.prototype.init = function(wrapper, file, manager){
	this.wrapper = wrapper;
	this.file = file;
	this.cManager = manager;
}

// shows the interface of the file in the proyect navigator
codeFile.prototype.paint = function(){
	var fileEntry = document.createElement("div");
	fileEntry.setAttribute("class","fileEntry");
	var fileImage = document.createElement("img");
	fileImage.setAttribute("class","entryImage");
	fileImage.setAttribute("alt","Document");
	fileImage.setAttribute("Title","Document");
	fileImage.setAttribute("src","/resources/images/page.png");
	fileEntry.appendChild(fileImage);
	var fileName = document.createElement("span");
	fileName.setAttribute("class","fileName");
	fileName.setAttribute("title","Click to open "+this.file.id);
	fileName.innerHTML = this.file.id;
	fileName.addEventListener("click",EzWebExt.bind(function(oEvent){this.loadFile()},this),true);
	fileEntry.appendChild(fileName);
	var renameFileButton = document.createElement("img");
	renameFileButton.setAttribute("class","operationalButton");
	renameFileButton.setAttribute("alt","Rename");
	renameFileButton.setAttribute("Title","Click to rename this file");
	renameFileButton.setAttribute("src","/resources/images/pencil.png");
	renameFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameFile(oEvent)},this),true);
	var saveFileButton = document.createElement("img");
	saveFileButton.setAttribute("class","operationalButton");
	saveFileButton.setAttribute("alt","Save");
	saveFileButton.setAttribute("Title","Click to save this file");
	saveFileButton.setAttribute("src","/resources/images/disk.png");
	saveFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.saveFile()},this),true);
	var closeFileButton = document.createElement("img");
	closeFileButton.setAttribute("class","operationalButton");
	closeFileButton.setAttribute("alt","Close");
	closeFileButton.setAttribute("Title","Click to close this file");
	closeFileButton.setAttribute("src","/resources/images/cross.png");
	closeFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.closeFile()},this),true);
	var deleteFileButton = document.createElement("img");
	deleteFileButton.setAttribute("class","operationalButton");
	deleteFileButton.setAttribute("alt","Delete");
	deleteFileButton.setAttribute("Title","Click to delete this file");
	deleteFileButton.setAttribute("src","/resources/images/bin.png");
	deleteFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteFile(oEvent)},this),true);
	fileEntry.appendChild(renameFileButton);
	fileEntry.appendChild(saveFileButton);
	fileEntry.appendChild(closeFileButton);
	fileEntry.appendChild(deleteFileButton);
	this.wrapper.appendChild(fileEntry);
}
// event-handling methods

// it shows the files of a project when clicked
codeFile.prototype.loadFile = function() {
	this.cManager.loadFile(this.file.parent+'/'+this.file.id);
}

// it saves the selected file
codeFile.prototype.saveFile = function() {
	this.cManager.saveFile(this.file.parent, this.file.id,"code");
}

//  it closes the selected file
codeFile.prototype.closeFile = function(oEvent) {
	this.cManager.closeFile(this.file.parent, this.file.id);
}

// it deletes the selected file
codeFile.prototype.deleteFile = function(oEvent) {
	this.cManager.deleteFile(this.file.parent+'/'+this.file.id,this);
}

// deletes the entry of the file after being deleted in the server
codeFile.prototype.updateAfterDelete = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

// it deletes the selected file
codeFile.prototype.renameFile = function() {
    this.cManager.renameFile(this.file.parent, this.file.id, this);
}

// changes the name in the entry of the file and some info attached to it
codeFile.prototype.updateAfterRename = function(newName) {
    this.file.id = newName;
    this.wrapper.firstChild.firstChild.nextSibling.innerHTML = newName;
    this.wrapper.firstChild.firstChild.nextSibling.setAttribute("title","Click to open "+newName);
}
