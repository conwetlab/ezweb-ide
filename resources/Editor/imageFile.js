// projectFile corresponds to the representation of a image of a project
function imageFile(){
	file.call()
}

imageFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the image itself
imageFile.prototype.init = function(wrapper, file, manager) {
	this.wrapper = wrapper;
	this.file = file;
	this.iManager = manager;
}

// shows the interface of the image in the proyect navigator
imageFile.prototype.paint = function(){
	var imageEntry = document.createElement("div");
	imageEntry.setAttribute("class","imageEntry");
	var imageImage = document.createElement("img");
	imageImage.setAttribute("class","entryImage");
	imageImage.setAttribute("alt","Document");
	imageImage.setAttribute("Title","Document");
	imageImage.setAttribute("src","/resources/images/image.png");
	imageEntry.appendChild(imageImage);
	var imageName = document.createElement("span");
	imageName.setAttribute("class","imageName");
	imageName.setAttribute("title","Click to open "+this.file.id);
	imageName.innerHTML = this.file.id;
	imageName.addEventListener("click",EzWebExt.bind(function(oEvent){this.loadImage()},this),true);
	imageEntry.appendChild(imageName);
	var renameImageButton = document.createElement("img");
	renameImageButton.setAttribute("class","operationalButton");
	renameImageButton.setAttribute("alt","Rename");
	renameImageButton.setAttribute("Title","Click to rename this image");
	renameImageButton.setAttribute("src","/resources/images/pencil.png");
	renameImageButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameImage(oEvent)},this),true);
	var deleteImageButton = document.createElement("img");
	deleteImageButton.setAttribute("class","operationalButton");
	deleteImageButton.setAttribute("alt","Delete");
	deleteImageButton.setAttribute("Title","Click to delete this image");
	deleteImageButton.setAttribute("src","/resources/images/bin.png");
	deleteImageButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteImage(oEvent)},this),true);
	imageEntry.appendChild(renameImageButton);
	imageEntry.appendChild(deleteImageButton);
	this.wrapper.appendChild(imageEntry);
}
// event-handling methods

// it shows the image in the image viewer 
imageFile.prototype.loadImage = function() {
	this.iManager.loadImage(this.file.parent+'/'+this.file.id);
}

// it deletes the selected image
imageFile.prototype.deleteImage = function() {
	this.iManager.deleteImage(this.file.parent+'/'+this.file.id,this);
}

// deletes the entry of the image after being deleted in the server
imageFile.prototype.updateAfterDelete = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

// it renames the selected file
imageFile.prototype.renameImage = function() {
    this.iManager.renameImage(this.file.parent, this.file.id, this);
}

// changes the name in the entry of the image and some info attached to it
imageFile.prototype.updateAfterRename = function(newName) {
    this.file.id = newName;
    this.wrapper.firstChild.firstChild.nextSibling.innerHTML = newName;
    this.wrapper.firstChild.firstChild.nextSibling.setAttribute("title","Click to open "+newName);
}
