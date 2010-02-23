// imageManager is the class which the display of the images during the development process
function imageManager(){
}

// The singleton pattern
imageManager.instance = null;

imageManager.getInstance = function() {
	if (imageManager.instance == null) {
		imageManager.instance = new imageManager();
	}
	return imageManager.instance;
}

// initializes the object an sets the event handlers
imageManager.prototype.init = function() {
    this.activeProject = "";
    this.projects = [];
    this.dirToUpdate = "";
    document.getElementById("imageTab").addEventListener("click",EzWebExt.bind(function(oEvent){this.paint()},this),true);
    document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0].addEventListener("change",EzWebExt.bind(function(oEvent){this.setProject(oEvent)},this),true);
    $(window).bind('resize',EzWebExt.bind(function(oEvent){this.resizeHandler()},this));
}

// shows interface in a change of tab depending on the state of the of object
imageManager.prototype.paint = function() {
    this.activeProject = projectManager.getInstance().getCurrentProject();
    var selectProject = document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0];
    selectProject.innerHTML = "";
    this.projects = this.projects = $(".projectName");
    if (this.projects.length == 0) {
        this.activeProject = "";
        selectProject.disabled = true;
    } else if (this.projects.length == 1) {
        selectProject.disabled = false;
        var defProject = document.createElement("option");
        defProject.setAttribute("value",this.projects[0].innerHTML);
        defProject.innerHTML = this.projects[0].innerHTML;
        selectProject.appendChild(defProject);
        selectProject.value = this.projects[0].innerHTML;
        this.activeProject = this.projects[0].innerHTML;
        var context = this;
        $.getJSON("/images/"+this.activeProject, function(data,status) {context.setImagesCallback(data,status)});
    } else {
        selectProject.disabled = false;
        var defProject = document.createElement("option");
        defProject.setAttribute("value","");
        defProject.innerHTML = "";
        selectProject.appendChild(defProject);
        for (i=0; i<this.projects.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value",this.projects[i].innerHTML);
            option.innerHTML = this.projects[i].innerHTML;
            selectProject.appendChild(option);
        }
        selectProject.value = this.activeProject;
        var context = this;
        $.getJSON("/images/"+this.activeProject, function(data,status) {context.setImagesCallback(data,status)});
    }
}

// manages the update the images of the viewer if the given route belongs to the project whose images are being displayed
imageManager.prototype.updateImages = function(route) {
    if (this.activeProject != "") {
        if (route.indexOf(this.activeProject) == 0) {
            var context = this;
            $.getJSON("/images/"+this.activeProject, function(data,status) {context.setImagesCallback(data,status)});
        }
    }
}

// manages the update the images of the viewer if a project is renamed
imageManager.prototype.updateOnRename = function(oldName, newName) {
    if (this.activeProject != "") {
        if (this.activeProject == oldName) {
            this.activeProject == newName;
            this.paint();
        } else {
            var selectProject = document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0];
            selectProject.innerHTML = "";
            this.projects = this.projects = $(".projectName");
            selectProject.disabled = false;
            var defProject = document.createElement("option");
            defProject.setAttribute("value","");
            defProject.innerHTML = "";
            selectProject.appendChild(defProject);
            for (i=0; i<this.projects.length; i++) {
                var option = document.createElement("option");
                option.setAttribute("value",this.projects[i].innerHTML);
                option.innerHTML = this.projects[i].innerHTML;
                selectProject.appendChild(option);
            }
            selectProject.value = this.activeProject;
        }
    }
}

// manages the update the images of the viewer if a project is deleted
imageManager.prototype.updateOnDelete = function(project) {
    if (this.activeProject != "") {
        if (this.activeProject == project) {
            this.activeProject == "";
            this.paint();
        } else {
            var selectProject = document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0];
            selectProject.innerHTML = "";
            this.projects = this.projects = $(".projectName");
            selectProject.disabled = false;
            var defProject = document.createElement("option");
            defProject.setAttribute("value","");
            defProject.innerHTML = "";
            selectProject.appendChild(defProject);
            for (i=0; i<this.projects.length; i++) {
                var option = document.createElement("option");
                option.setAttribute("value",this.projects[i].innerHTML);
                option.innerHTML = this.projects[i].innerHTML;
                selectProject.appendChild(option);
            }
            selectProject.value = this.activeProject;
        }
    }
}

// adds a new project to the select of the viewer
imageManager.prototype.updateProjects = function() {
    var selectProject = document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0];
    selectProject.innerHTML = "";
    this.projects = this.projects = $(".projectName");
    if (this.projects.length == 0) {
        this.activeProject = "";
        selectProject.disabled = true;
    } else if (this.projects.length == 1) {
        selectProject.disabled = false;
        var defProject = document.createElement("option");
        defProject.setAttribute("value",this.projects[0].innerHTML);
        defProject.innerHTML = this.projects[0].innerHTML;
        selectProject.appendChild(defProject);
        selectProject.value = this.projects[0].innerHTML;
        this.activeProject = this.projects[0].innerHTML;
    } else {
        selectProject.disabled = false;
        var defProject = document.createElement("option");
        defProject.setAttribute("value","");
        defProject.innerHTML = "";
        selectProject.appendChild(defProject);
        for (i=0; i<this.projects.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value",this.projects[i].innerHTML);
            option.innerHTML = this.projects[i].innerHTML;
            selectProject.appendChild(option);
        }
        selectProject.value = this.activeProject;
    }
}

// changes the active project to deploy an the related templates 
imageManager.prototype.setProject = function(oEvent) {
    if (oEvent.target.value!="") {
        if (oEvent.target.value!=this.activeProject) {
            document.getElementById("mainImage").innerHTML = "";
            document.getElementById("imageGallery").innerHTML = "";
            document.getElementById("mainImageName").innerHTML = "";
            document.getElementById("mainImagePath").innerHTML = "";
            this.activeProject = oEvent.target.value;
            var context = this;
            $.getJSON("/images/"+this.activeProject, function(data,status) {context.setImagesCallback(data,status)});
        }
    } else {
        this.activeProject = "";
        document.getElementById("mainImage").innerHTML = "";
        document.getElementById("imageGallery").innerHTML = "";
        document.getElementById("mainImageName").innerHTML = "";
        document.getElementById("mainImagePath").innerHTML = "";
    }
}

// displays one image in the mainImage div and shows its data
imageManager.prototype.displayMainImage = function(src) {
    var mainImage = document.getElementById("mainImage");
    mainImage.innerHTML = "";
    var mainWidth = mainImage.offsetWidth;
    var mainHeight = mainImage.offsetHeight;
    var img = document.createElement("img");
    img.style.display="none";
    img.setAttribute("src",src);
    img.setAttribute("alt","Large view of: "+src);
    img.setAttribute("Title","Large view of: "+src);
    img.setAttribute("oWidth",img.width);
    img.setAttribute("oHeight",img.height);
    img.onload = function(){
            if (this.width > mainWidth) {
                this.width = mainWidth;
            }
            if (this.getAttribute("oHeight") > mainHeight) {
                this.height = mainHeight;
            } else if (this.height < mainHeight){
                this.style.marginTop=(mainHeight-this.height)/2;
            }
            this.style.display="inline";
        }
    document.getElementById("mainImageName").innerHTML = src.substr(src.lastIndexOf('/')+1);
    document.getElementById("mainImagePath").innerHTML = src.substring(src.indexOf(userManager.getInstance().getUser())+userManager.getInstance().getUser().length,src.lastIndexOf('/'));
    document.getElementById("mainImageWidth").innerHTML = img.width +" px";
    document.getElementById("mainImageHeight").innerHTML = img.height +" px";
    mainImage.appendChild(img);
}

// loads an image in the viewer and the gallery of its project
imageManager.prototype.loadImage = function(image) {
    var project = image.substring(0,(image.indexOf("/")));
    if (this.activeProject == project) {
        $("#tabSection").tabs('select',3);
        this.displayMainImage("../resources/Projects/"+userManager.getInstance().getUser()+"/"+image);
    } else {
        this.activeProject = project;
        var selectProject = document.getElementById("imgSelectorContainer").getElementsByTagName("select")[0];
        selectProject.innerHTML = "";
        this.projects = $(".projectName");
        for (i=0; i<this.projects.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value",this.projects[i].innerHTML);
            option.innerHTML = this.projects[i].innerHTML;
            selectProject.appendChild(option);
        }
        selectProject.value = this.activeProject;
        var context = this;
        $.getJSON("/images/"+this.activeProject, function(data,status) {context.loadImageCallback(data,status,image)});
    }
}

// deletes an image and updates the imageManager and its related entry
imageManager.prototype.deleteImage = function(image,iFile) {
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Image manager says:");
	var dContent = document.createElement("a");
	dContent.innerHTML = "Do you really want to delete this image?";
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
                $.post("delete/"+image, function(data, status) {
                    context.deleteImageCallback(data,status,image,iFile)
                });
			}
		}
	});
}

// Manages the renaming of a image showing a dialog to enter the new name
imageManager.prototype.renameImage = function(parent,oldName,iFile) {
    var dialog = document.createElement("div");
	dialog.setAttribute("id","dialog");
	dialog.setAttribute("title","Rename the image");
	var dContent = document.createElement("a");
	var nameSpan = document.createElement("span");
    nameSpan.innerHTML = "New name for the image: ";
    dContent.appendChild(nameSpan);
    var inputName = document.createElement("input");
    inputName.setAttribute("type","text");
    inputName.setAttribute("id","dialogImageName");
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
                var newName = document.getElementById("dialogImageName").value;
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
                        context.renameImageCallback(data,status,parent,oldName,newName,iFile);
                    });
                }
			}
		}
	});
}

// Private functions and callbacks
// alters the size and the positions of the images displayed when the window is resized
imageManager.prototype.resizeHandler = function(oEvent) {
    var mainImage = document.getElementById("mainImage");
    if (mainImage.innerHTML != "") {
        var mainWidth = mainImage.offsetWidth;
        var mainHeight = mainImage.offsetHeight;
        var img = mainImage.firstChild;
        img.style.display="none";
        if (img.getAttribute("oWidth") > mainWidth) {
            img.width = mainWidth;
        }
        if (img.getAttribute("oHeight") > mainHeight) {
            img.height = mainHeight;
        } else if (img.getAttribute("oHeight") < mainHeight){
            img.style.marginTop=(mainHeight-img.height)/2;
        }
        img.style.display="inline";
    }
    var imgGallery = document.getElementById("imageGallery");
    if (imgGallery.innerHTML != "") {
        var childs = imgGallery.childNodes;
        for (i=0; i<childs.length; i++) {
            var container = childs[i];
            var thumb = container.firstChild;
            thumb.style.display = "none";
            if (thumb.getAttribute("oHeight") > container.offsetHeight) {
                thumb.height = container.offsetHeight;
            } else if (thumb.getAttribute("oHeight") < container.offsetHeight) {
                thumb.style.marginTop=(container.offsetHeight-thumb.getAttribute("oHeight"))/2;
            }
            thumb.style.display = "inline";
        }
    }
}

// sets the images of a project and displays them
imageManager.prototype.setImagesCallback = function(data,status) {
    if (status=="success") {
        if (data.length>0) {
            this.displayMainImage("../resources/Projects/"+userManager.getInstance().getUser()+"/"+data[0].id);
            var imgGallery = document.getElementById("imageGallery");
            imgGallery.innerHTML = "";
            for (i=0; i<data.length; i++) {
                var imgThumb = document.createElement("div");
                imgThumb.setAttribute("class","imageThumb");
                imgThumb.setAttribute("src","../resources/Projects/"+userManager.getInstance().getUser()+"/"+data[i].id);
                imgThumb.addEventListener("click",EzWebExt.bind(function(oEvent){this.displayMainImage(oEvent.target.getAttribute("src"))},this),true);
                var img = document.createElement("img");
                img.setAttribute("src","../resources/Projects/"+userManager.getInstance().getUser()+"/"+data[i].id);
                img.setAttribute("alt","Display "+data[i].id);
                img.setAttribute("Title","Display "+data[i].id);
                img.style.display = "none";
                imgThumb.appendChild(img);
                imgGallery.appendChild(imgThumb);
                img.onload = function(){
                    this.setAttribute("oHeight",this.height);
                    if (this.getAttribute("oHeight") > this.parentNode.offsetHeight) {
                        this.height = this.parentNode.offsetHeight;
                    } else if (this.getAttribute("oHeight") < this.parentNode.offsetHeight) {
                        this.style.marginTop=(this.parentNode.offsetHeight-this.getAttribute("oHeight"))/2;
                    }
                    this.style.display = "inline";
                }
            }
        } else {
            logger.getInstance().showLog("This project does not have any images yet.","warning");
        }
    } else {
        document.getElementById("imageColumn").getElementsByTagName("input")[0].disabled = true;
        logger.getInstance().showLog("The images for the project could not be retrieved.","error");
    }
}

// loads the images of a project and displays the selected one
imageManager.prototype.loadImageCallback = function(data,status,image) {
    if (status=="success") {
        if (data.length>0) {
            $("#tabSection").tabs('select',3);
            this.displayMainImage("../resources/Projects/"+userManager.getInstance().getUser()+"/"+image);
            var imgGallery = document.getElementById("imageGallery");
            for (i=0; i<data.length; i++) {
                var imgThumb = document.createElement("div");
                imgThumb.setAttribute("class","imageThumb");
                imgThumb.setAttribute("src","../resources/Projects/"+userManager.getInstance().getUser()+"/"+data[i].id);
                imgThumb.addEventListener("click",EzWebExt.bind(function(oEvent){this.displayMainImage(oEvent.target.getAttribute("src"))},this),true);
                var img = document.createElement("img");
                img.setAttribute("src","../resources/Projects/"+userManager.getInstance().getUser()+"/"+data[i].id);
                img.setAttribute("alt","Display "+data[i].id);
                img.setAttribute("Title","Display "+data[i].id);
                img.style.display = "none";
                imgThumb.appendChild(img);
                imgGallery.appendChild(imgThumb);
                img.onload = function(){
                    this.setAttribute("oHeight",this.height);
                    if (this.getAttribute("oHeight") > this.parentNode.offsetHeight) {
                        this.height = this.parentNode.offsetHeight;
                    } else if (this.getAttribute("oHeight") < this.parentNode.offsetHeight) {
                        this.style.marginTop=(this.parentNode.offsetHeight-this.getAttribute("oHeight"))/2;
                    }
                    this.style.display = "inline";
                }
            }
        } else {
            logger.getInstance().showLog("This project does not have any images yet.","warning");
        }
    } else {
        document.getElementById("imageColumn").getElementsByTagName("input")[0].disabled = true;
        logger.getInstance().showLog("The images for the project could not be retrieved.","error");
    }
}

//  updates the gallery and the main gallery if the image was successfully deleted
imageManager.prototype.deleteImageCallback = function(data,status,image,iFile) {
    if (status=='success') {
        if (data=='error') {
            logger.getInstance().showLog("The image could not be deleted.","error");
        } else {
            var project = image.substring(0,(image.indexOf("/")));
            if (this.activeProject == project) {
                $("#tabSection").tabs('select',3);
                var imgGallery = document.getElementById("imageGallery");
                var i = 0;
                var found = false;
                while (i<imgGallery.childNodes.length && !found) {
                    if (imgGallery.childNodes[i].firstChild.getAttribute("src") == "../resources/Projects/"+userManager.getInstance().getUser()+"/"+image) {
                        imgGallery.removeChild(imgGallery.childNodes[i]);
                        found = true;
                    }
                    i++;
                }
                var mainImage = document.getElementById("mainImage")
                if (mainImage.firstChild.getAttribute("src") == "../resources/Projects/"+userManager.getInstance().getUser()+"/"+image) {
                    if (imgGallery.childNodes.length > 0) {
                        this.displayMainImage(imgGallery.childNodes[0].firstChild.getAttribute("src"));
                    } else {
                        mainImage.innerHTML = null;
                        document.getElementById("mainImageName").innerHTML = "";
                        document.getElementById("mainImagePath").innerHTML = "";
                        document.getElementById("mainImageWidth").innerHTML = "";
                        document.getElementById("mainImageHeight").innerHTML = "";
                    }
                }
            }
            iFile.updateAfterDelete();
            logger.getInstance().showLog("The image has been successfully deleted.","info");
        }
    }
}

// The callback for renaming a image from the server
imageManager.prototype.renameImageCallback = function(data,status,parent,oldName,newName,iFile) {
    if (status!='success') {
		logger.getInstance().showLog("The image could not be renamed.","error");
	} else {
        if (data=="error") {
            logger.getInstance().showLog("The image could not be renamed.","error");
        } else {
            var project = parent+"/".substring(0,(parent+"/".indexOf("/")));
            if (this.activeProject == project) {
                $("#tabSection").tabs('select',3);
                var imgGallery = document.getElementById("imageGallery");
                var i = 0;
                var found = false;
                while (i<imgGallery.childNodes.length && !found) {
                    if (imgGallery.childNodes[i].getAttribute("src") == "../resources/Projects/"+userManager.getInstance().getUser()+"/"+parent+"/"+oldName) {
                        imgGallery.childNodes[i].removeChild(imgGallery.childNodes[i].firstChild);
                        var img = document.createElement("img");
                        img.setAttribute("src","../resources/Projects/"+userManager.getInstance().getUser()+"/"+parent+"/"+newName);
                        img.setAttribute("alt","Display "+parent+"/"+newName);
                        img.setAttribute("Title","Display "+parent+"/"+newName);
                        imgGallery.childNodes[i].appendChild(img);
                        img.onload = function(){
                            this.setAttribute("oHeight",this.height);
                            if (this.getAttribute("oHeight") > this.parentNode.offsetHeight) {
                                this.height = this.parentNode.offsetHeight;
                            } else if (this.getAttribute("oHeight") < this.parentNode.offsetHeight) {
                                this.style.marginTop=(this.parentNode.offsetHeight-this.getAttribute("oHeight"))/2;
                            }
                            this.style.display = "inline";
                        }
                        found = true;
                    }
                    i++;
                }
                var mainImage = document.getElementById("mainImage")
                if (mainImage.firstChild.getAttribute("src") == "../resources/Projects/"+userManager.getInstance().getUser()+"/"+parent+"/"+oldName) {
                    this.displayMainImage("../resources/Projects/"+userManager.getInstance().getUser()+"/"+parent+"/"+newName);
                }
            }
            iFile.updateAfterRename(newName);
		    logger.getInstance().showLog("The image has been successfully renamed.","info");
        }
    }
}
