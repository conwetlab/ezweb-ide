// deployer is the class which controls al the deploying process of a gadget
function deployer(){
}

// The singleton pattern
deployer.instance = null;

deployer.getInstance = function() {
	if (deployer.instance == null) {
		deployer.instance = new deployer();
	}
	return deployer.instance;
}

// initializes the object an sets the event handlers
deployer.prototype.init = function() {
    this.activeProject = "";
    this.projects = [];
    this.activeTemplate = "";
    this.deploying = false;
    document.getElementById("deployerTab").addEventListener("click",EzWebExt.bind(function(oEvent){this.paint()},this),true);
    document.getElementById("deploySelectProject").getElementsByTagName("select")[0].addEventListener("change",EzWebExt.bind(function(oEvent){this.setProject(oEvent)},this),true);
    document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0].addEventListener("change",EzWebExt.bind(function(oEvent){this.setTemplate(oEvent)},this),true);
    document.getElementById("bDeployGadget").addEventListener("click",EzWebExt.bind(function(oEvent){this.deploy()},this),true);
}

// shows interface in a change of tab depending on the state of the of object
deployer.prototype.paint = function() {
    this.activeProject = projectManager.getInstance().getCurrentProject();
    this.activeTemplate = "";
    var selectProject = document.getElementById("deploySelectProject").getElementsByTagName("select")[0];
    selectProject.innerHTML = "";
    var defProject = document.createElement("option");
    defProject.setAttribute("value","");
    defProject.innerHTML = "";
    selectProject.appendChild(defProject);
    this.projects = $(".projectName");
    for (i=0; i<this.projects.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value",this.projects[i].innerHTML);
        option.innerHTML = this.projects[i].innerHTML;
        selectProject.appendChild(option);
    }
    selectProject.value = this.activeProject;
    document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0].innerHTML = "";
    document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0].disabled = true;
    document.getElementById("bDeployGadget").setAttribute("style","display:none");
    var logo = document.getElementById("oEzWebLogo");
    if (this.deploying) {
        logo.parentNode.removeChild(document.getElementById("oEzWeb"));
        this.deploying = false;
        logo.style.display = "inline";
    }
}

// changes the active project to deploy an the related templates 
deployer.prototype.setProject = function(oEvent) {
    var logo = document.getElementById("oEzWebLogo");
    if (this.deploying) {
        logo.parentNode.removeChild(logo.nextSibling);
        this.deploying = false;
        logo.style.display = "inline";
    }
    if (oEvent.target.value!="") {
        this.activeProject = oEvent.target.value;
        var context = this;
            $.getJSON("/templates/"+this.activeProject, function(data,status) {context.setTemplatesCallback(data,status)});
    } else {
        this.activeProject = "";
        this.activeTemplate = "";
        selectTemplate = document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0];
        selectTemplate.innerHTML = "";
        selectTemplate.disabled = true;
        document.getElementById("bDeployGadget").setAttribute("style","display:none");
    }
}

// changes the active template for the project and shows the button to deploy
deployer.prototype.setTemplate = function(oEvent) {
    var logo = document.getElementById("oEzWebLogo");
    if (this.deploying) {
        logo.parentNode.removeChild(logo.nextSibling);
        this.deploying = false;
        logo.style.display = "inline";
    }
    if (oEvent.target.value!="") {
        this.activeTemplate = oEvent.target.value;
        document.getElementById("bDeployGadget").setAttribute("style","display:block");
    } else {
        this.activeTemplate = "";
        document.getElementById("bDeployGadget").setAttribute("style","display:none");
    }
}

// invokes the deploy process
deployer.prototype.deploy = function() {
    var oEzWeb = document.createElement("object");
    oEzWeb.id = "oEzWeb";
    oEzWeb.standby = "Loading the platform...";
    oEzWeb.type = "text/html";
    var logo = document.getElementById("oEzWebLogo");
    if (this.deploying) {
        logo.parentNode.removeChild(document.getElementById("oEzWeb"));
    } else {
        this.deploying = true;
        logo.style.display = "none";
    }
    document.getElementById("deployLogger").appendChild(oEzWeb);
    oEzWeb.data = document.getElementById("EzWebURL").value+"interfaces/gadget?template_uri="+"http://localhost:8400/resources/Projects/"+userManager.getInstance().getUser()+"/"+this.activeTemplate;
}

// adds a new project to the select of the deployer
deployer.prototype.updateProjects = function() {
    var selectProject = document.getElementById("deploySelectProject").getElementsByTagName("select")[0];
    selectProject.innerHTML = "";
    var defProject = document.createElement("option");
    defProject.setAttribute("value","");
    defProject.innerHTML = "";
    selectProject.appendChild(defProject);
    this.projects = $(".projectName");
    for (i=0; i<this.projects.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value",this.projects[i].innerHTML);
        option.innerHTML = this.projects[i].innerHTML;
        selectProject.appendChild(option);
    }
    selectProject.value = this.activeProject;
    document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0].innerHTML = "";
    document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0].disabled = true;
    document.getElementById("bDeployGadget").setAttribute("style","display:none");
}

// manages the update if a project is renamed
deployer.prototype.updateOnRename = function(oldName, newName, type) {
    if (type=="project") {
        if (this.activeProject != "") {
            if (this.activeProject == oldName) {
                this.activeProject == newName;
                this.paint();
            } else {
                var selectProject = document.getElementById("deploySelectProject").getElementsByTagName("select")[0];
                selectProject.innerHTML = "";
                var defProject = document.createElement("option");
                defProject.setAttribute("value","");
                defProject.innerHTML = "";
                selectProject.appendChild(defProject);
                this.projects = $(".projectName");
                for (i=0; i<this.projects.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value",this.projects[i].innerHTML);
                    option.innerHTML = this.projects[i].innerHTML;
                    selectProject.appendChild(option);
                }
                selectProject.value = this.activeProject;
            }
        }
    } else if (type=="dir" || type=="template") {
        if (route.indexOf(this.activeProject) == 0) {
            var context = this;
            $.getJSON("/templates/"+this.activeProject, function(data,status) {context.setTemplatesCallback(data,status)});
        }
    }
}

// manages the update when a template is created
deployer.prototype.updateTemplates = function(route) {
    if (route.indexOf(this.activeProject) == 0) {
        var selectTemplate = document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0];
        var option = document.createElement("option");
        option.setAttribute("value",route);
        option.innerHTML = route;
        selectTemplate.appendChild(option);
    }
}

// manages the update if a project is deleted
deployer.prototype.updateOnDelete = function(route, type) {
    if (type=="project") {
        if (this.activeProject != "") {
            if (this.activeProject == route) {
                this.activeProject == "";
                this.paint();
            } else {
                var selectProject = document.getElementById("deploySelectProject").getElementsByTagName("select")[0];
                selectProject.innerHTML = "";
                var defProject = document.createElement("option");
                defProject.setAttribute("value","");
                defProject.innerHTML = "";
                selectProject.appendChild(defProject);
                this.projects = $(".projectName");
                for (i=0; i<this.projects.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value",this.projects[i].innerHTML);
                    option.innerHTML = this.projects[i].innerHTML;
                    selectProject.appendChild(option);
                }
                selectProject.value = this.activeProject;
            }
        }
    } else if (type=="dir" || type=="template") {
        if (route.indexOf(this.activeProject) == 0) {
            var context = this;
            $.getJSON("/templates/"+this.activeProject, function(data,status) {context.setTemplatesCallback(data,status)});
        }
    }
}

// Private methods and callbacks
// builds the options of the select to choose templates
deployer.prototype.setTemplatesCallback = function(data,status) {
    if (status=="success") {
        var selectTemplate = document.getElementById("deploySelectTemplate").getElementsByTagName("select")[0];
        selectTemplate.innerHTML = "";
        selectTemplate.disabled = true;
        if (data.length>0) {
            if (data.length==1) {
                var defTemplate = document.createElement("option");
                defTemplate.setAttribute("value",data[0].id);
                defTemplate.innerHTML = data[0].id;
                selectTemplate.appendChild(defTemplate);
                selectTemplate.value = data[0].id;
                this.activeTemplate = data[0].id;
                document.getElementById("bDeployGadget").setAttribute("style","display:block");
            } else {
                this.activeTemplate = data[0].id;
                for (i=0; i<data.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value",data[i].id);
                    option.innerHTML = data[i].id;
                    selectTemplate.appendChild(option);
                }
            }
            selectTemplate.disabled = false;
        } else {
            document.getElementById("bDeployGadget").setAttribute("style","display:none");
            logger.getInstance().showLog("This project does not have any templates yet.","error");
        }
    } else {
        logger.getInstance().showLog("The templates for the project could not be retrieved.","error");
    }
}
