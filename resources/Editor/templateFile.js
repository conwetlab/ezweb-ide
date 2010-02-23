// codeFile corresponds to the representation of file of code
function templateFile(){
	file.call()
}

templateFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
templateFile.prototype.init = function(wrapper, file, manager){
	this.wrapper = wrapper;
	this.file = file;
	this.tManager = manager;
}

// shows the interface of the file in the proyect navigator
templateFile.prototype.paint = function(){
	var templateEntry = document.createElement("div");
	templateEntry.setAttribute("class","templateEntry");
	var templateImage = document.createElement("img");
	templateImage.setAttribute("id",""+this.file.id);
	templateImage.setAttribute("class","entryImage");
	templateImage.setAttribute("alt","Template");
	templateImage.setAttribute("Title","Document");
	templateImage.setAttribute("src","/resources/images/page_code.png");
	templateEntry.appendChild(templateImage);
	var templateName = document.createElement("span");
	templateName.setAttribute("class","fileName");
	templateName.setAttribute("title","Click to open "+this.file.id);
	templateName.innerHTML = this.file.id;
	templateName.addEventListener("click",EzWebExt.bind(function(oEvent){this.loadTemplate()},this),true);
	templateEntry.appendChild(templateName);
	var wizardTemplateButton = document.createElement("img");
	wizardTemplateButton.setAttribute("class","operationalButton");
	wizardTemplateButton.setAttribute("alt","Rename");
	wizardTemplateButton.setAttribute("Title","Click to edit this template with the wizard");
	wizardTemplateButton.setAttribute("src","/resources/images/page_lightning.png");
	wizardTemplateButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.loadWizardTemplate(oEvent)},this),true);
	var renameTemplateButton = document.createElement("img");
	renameTemplateButton.setAttribute("class","operationalButton");
	renameTemplateButton.setAttribute("alt","Rename");
	renameTemplateButton.setAttribute("Title","Click to rename this template");
	renameTemplateButton.setAttribute("src","/resources/images/pencil.png");
	renameTemplateButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameTemplate(oEvent)},this),true);
	var saveTemplateButton = document.createElement("img");
	saveTemplateButton.setAttribute("class","operationalButton");
	saveTemplateButton.setAttribute("alt","Save");
	saveTemplateButton.setAttribute("Title","Click to save this template");
	saveTemplateButton.setAttribute("src","/resources/images/disk.png");
	saveTemplateButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.saveTemplate(oEvent)},this),true);
	var closeTemplateButton = document.createElement("img");
	closeTemplateButton.setAttribute("class","operationalButton");
	closeTemplateButton.setAttribute("alt","Close");
	closeTemplateButton.setAttribute("Title","Click to close this template");
	closeTemplateButton.setAttribute("src","/resources/images/cross.png");
	closeTemplateButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.closeTemplate(oEvent)},this),true);
	var deleteTemplateButton = document.createElement("img");
	deleteTemplateButton.setAttribute("class","operationalButton");
	deleteTemplateButton.setAttribute("alt","Delete");
	deleteTemplateButton.setAttribute("Title","Click to delete this template");
	deleteTemplateButton.setAttribute("src","/resources/images/bin.png");
	deleteTemplateButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteTemplate(oEvent)},this),true);
	templateEntry.appendChild(wizardTemplateButton);
	templateEntry.appendChild(renameTemplateButton);
	templateEntry.appendChild(saveTemplateButton);
	templateEntry.appendChild(closeTemplateButton);
	templateEntry.appendChild(deleteTemplateButton);
	this.wrapper.appendChild(templateEntry);
}

// returns the whole route to the file
templateFile.prototype.getRoute = function(){
    return this.file.parent+'/'+this.file.id;
}

// event-handling methods

// it shows the content of the template in the editor when clicked
templateFile.prototype.loadTemplate = function() {
	this.tManager.loadTemplate(this.file.parent+'/'+this.file.id,false);
}

// it opens the wizard to edit the template
templateFile.prototype.loadWizardTemplate = function() {
	this.tManager.loadTemplate(this.file.parent+'/'+this.file.id,true);
}

// it saves the selected template
templateFile.prototype.saveTemplate = function() {
	this.tManager.saveTemplate(this.file.parent,this.file.id);
}

//  it closes the selected template
templateFile.prototype.closeTemplate = function() {
	this.tManager.closeTemplate(this.file.parent,this.file.id);
}

// it deletes the selected template
templateFile.prototype.deleteTemplate = function() {
	this.tManager.deleteTemplate(this.file.parent,this.file.id,this);
}

// deletes the entry of the file after being deleted in the server
templateFile.prototype.updateAfterDelete = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

// it deletes the selected template
templateFile.prototype.renameTemplate = function(){
    this.tManager.renameTemplate(this.file.parent,this.file.id,this);
}
// changes the name in the entry of the file and some info attached to it
templateFile.prototype.updateAfterRename = function(newName) {
    this.file.id = newName;
    this.wrapper.firstChild.firstChild.nextSibling.innerHTML = newName;
    this.wrapper.firstChild.firstChild.nextSibling.setAttribute("title","Click to open "+newName);
}
