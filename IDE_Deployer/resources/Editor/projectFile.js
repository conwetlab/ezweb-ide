// projectFile corresponds to the representation of gadget's project
function projectFile(){
	file.call()
}

projectFile.prototype = new file();

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
projectFile.prototype.init = function(wrapper, file, manager) {
	this.wrapper = wrapper;
	this.file = file;
	this.pManager = manager;
    this.displaying = false;
}

// Represents the the project in its dom element
projectFile.prototype.paint = function() {
    this.wrapper.innerHTML = "";
    var projectEntry = document.createElement("div");
	projectEntry.setAttribute("class","projectEntry");
	var projectName = document.createElement("span");
	projectName.setAttribute("class","projectName");
	projectName.setAttribute("title","Display the files of the project "+this.file.id);
	projectName.innerHTML = this.file.id;
	var fileList = document.createElement("div");
	fileList.setAttribute("class","fileList");
    fileList.style.display = "none";
	projectName.addEventListener("click",EzWebExt.bind(function(oEvent){this.toggleFiles(oEvent)},this),true);
	projectEntry.appendChild(projectName);
    var wgtButton = document.createElement("img");
	wgtButton.setAttribute("class","operationalButton");
	wgtButton.setAttribute("alt","WGT");
	wgtButton.setAttribute("Title","Click to generate a packaged gadget");
	wgtButton.setAttribute("src","/resources/images/package_go.png");
	wgtButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.generateWgt(oEvent)},this),true);
	var newFileButton = document.createElement("img");
	newFileButton.setAttribute("class","operationalButton");
	newFileButton.setAttribute("alt","New...");
	newFileButton.setAttribute("Title","Click to create a new file for this project");
	newFileButton.setAttribute("src","/resources/images/add.png");
	newFileButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.createFile(oEvent)},this),true);
	var renameProjectButton = document.createElement("img");
	renameProjectButton.setAttribute("class","operationalButton");
	renameProjectButton.setAttribute("alt","Rename");
	renameProjectButton.setAttribute("Title","Click to rename this project");
	renameProjectButton.setAttribute("src","/resources/images/pencil.png");
	renameProjectButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.renameProject(oEvent)},this),true);
	var saveProjectButton = document.createElement("img");
	saveProjectButton.setAttribute("class","operationalButton");
	saveProjectButton.setAttribute("alt","Save");
	saveProjectButton.setAttribute("Title","Click to save this project");
	saveProjectButton.setAttribute("src","/resources/images/disk.png");
	saveProjectButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.saveProject(oEvent)},this),true);
	var deleteProjectButton = document.createElement("img");
	deleteProjectButton.setAttribute("class","operationalButton");
	deleteProjectButton.setAttribute("alt","Delete");
	deleteProjectButton.setAttribute("Title","Click to delete this project");
	deleteProjectButton.setAttribute("src","/resources/images/bin.png");
	deleteProjectButton.addEventListener("click",EzWebExt.bind(function(oEvent){this.deleteProject(oEvent)},this),true);
	projectEntry.appendChild(newFileButton);
	projectEntry.appendChild(renameProjectButton);
	projectEntry.appendChild(saveProjectButton);
	projectEntry.appendChild(deleteProjectButton);
    projectEntry.appendChild(wgtButton);
	this.wrapper.appendChild(projectEntry);
	this.wrapper.appendChild(fileList);
}

// changes the Id ofo the project related
projectFile.prototype.updateProjectId = function(newId) {
    this.file.id = newId;
}

// it shows/hides the files of a project when it's clicked
projectFile.prototype.toggleFiles = function(oEvent) {
    if (this.displaying) {
        this.wrapper.lastChild.style.display = "none";
        this.displaying = false;
        oEvent.target.setAttribute("title","Display the files of the project "+this.file.id);
	    this.wrapper.firstChild.nextSibling.innerHTML = "";
    } else {
        this.pManager.setCurrentProject(this.file.id);
        this.displaying = true;
        oEvent.target.setAttribute("title","Hide the files of the project "+this.file.id);
	    var fileList = oEvent.target.parentNode.nextSibling;
        var context = this;
        $.getJSON("file/"+this.file.id, function(data, status) {
            context.listProjectCallback(data,status,fileList)
        });
    }
}
	
// it saves all the files from a project and its info
projectFile.prototype.saveProject = function() {
	this.pManager.saveProject(this.file.id);
}

// it deletes the info of a project and all its related files
projectFile.prototype.deleteProject = function() {
	this.pManager.deleteProject(this.file.id, this);
}

// it renames a project and the related files
projectFile.prototype.renameProject = function() {
	this.pManager.renameProject(this.file.id, this);
}

// it creates a new file for the project
projectFile.prototype.createFile = function() {
    this.pManager.createFile(this.file.id, this);
}

// it generates the .wgt container for the gadget
projectFile.prototype.generateWgt = function() {
    this.pManager.generateWgt(this.file.id);
}

// makes the changes in the interface after creating a file in aproject
projectFile.prototype.updateCreateFile = function() {
    this.displaying = true;
    this.wrapper.firstChild.setAttribute("title","Hide the files of the project "+this.file.id);
    var fileList = this.wrapper.firstChild.nextSibling;
	fileList.innerHTML = null;
    var context = this;
    $.getJSON("file/"+this.file.id, function(data2, status2) {
        context.listProjectCallback(data2,status2,fileList)
    });
}

// makes the changes in the interface after finishing the deleting operations
projectFile.prototype.updateDeleteProject = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
}

//Private methods

// The callback for listing the files of a project
projectFile.prototype.listProjectCallback = function(files,status,fileList) {
    if (status=="success") {
        this.wrapper.lastChild.style.display = "block";
        for (i=0; i<files.length; i++){
		    var wrapper = document.createElement("div");
		    if (files[i].type == "dir") {
			    wrapper.setAttribute("class","dirWrapper");
			    var dir = new directoryFile();
			    dir.init(wrapper, files[i], dirManager.getInstance());
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
                //deployer.getInstance().updateTemplates(template.getRoute());
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
        logger.getInstance().showLog("The files of the project could not be displayed.","error");
    }
}
