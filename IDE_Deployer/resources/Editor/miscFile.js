// miscFile is the entry for the files that are not templates, images, dirs or code files
function miscFile(){
	file.call()
}

miscFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
miscFile.prototype.init = function(wrapper, file, manager) {
	this.wrapper = wrapper;
	this.file = file;
	this.mManager = manager;
}

// shows the interface of the file in the proyect navigator
miscFile.prototype.paint = function(){
	var miscEntry = document.createElement("div");
	miscEntry.setAttribute("class","miscEntry");
	var miscImage = document.createElement("img");
	miscImage.setAttribute("class","entryImage");
	miscImage.setAttribute("alt","file");
	miscImage.setAttribute("Title","File");
	miscImage.setAttribute("src","/resources/images/page_gear.png");
	miscEntry.appendChild(miscImage);
	var miscName = document.createElement("span");
	miscName.setAttribute("class","miscName");
	miscName.innerHTML = this.file.id;
	miscEntry.appendChild(miscName);
	var renameMiscButton = document.createElement("img");
	renameMiscButton.setAttribute("class","operationalButton");
	renameMiscButton.setAttribute("alt","Rename");
	renameMiscButton.setAttribute("Title","Click to rename this file");
	renameMiscButton.setAttribute("src","/resources/images/pencil.png");
	renameMiscButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameFile(oEvent)},this),true);
	var deleteMiscButton = document.createElement("img");
	deleteMiscButton.setAttribute("class","operationalButton");
	deleteMiscButton.setAttribute("alt","Delete");
	deleteMiscButton.setAttribute("Title","Click to delete this file");
	deleteMiscButton.setAttribute("src","/resources/images/bin.png");
	deleteMiscButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteFile(oEvent)},this),true);
	miscEntry.appendChild(renameMiscButton);
	miscEntry.appendChild(deleteMiscButton);
	this.wrapper.appendChild(miscEntry);
}

// event-handling methods

// it deletes the selected file
miscFile.prototype.deleteFile= function() {
	this.mManager.deleteFile(this.file.parent+'/'+this.file.id,this);
}

// deletes the entry of the file after being deleted in the server
miscFile.prototype.updateAfterDelete = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

// it renames the selected file
miscFile.prototype.renameFile = function() {
    this.mManager.renameFile(this.file.parent, this.file.id, this);
}

// changes the name in the entry of the image and some info attached to it
miscFile.prototype.updateAfterRename = function(newName) {
    this.file.id = newName;
    this.wrapper.firstChild.firstChild.nextSibling.innerHTML = newName;
    this.wrapper.firstChild.firstChild.nextSibling.setAttribute("title","Click to open "+newName);
}
