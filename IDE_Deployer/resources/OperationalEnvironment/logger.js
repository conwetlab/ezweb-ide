// logger is the class which controls the system of logging
function logger(){
}

// The singleton pattern
logger.instance = null;

logger.getInstance = function() {
	if (logger.instance == null) {
		logger.instance = new logger();
	}
	return logger.instance;
}

// This initializes the object
// It receives:
// 	containerId: the id of the div where the editor and the project management section should be placed.
logger.prototype.init = function(containerId) {
	this.logPanelId = containerId;
	document.getElementById(this.logPanelId).setAttribute("style","display:none");
}

// It shows the desired log and builds its structure, which is previously cleaned
logger.prototype.showLog = function(logText, type) {
	var container = document.getElementById(this.logPanelId);
	var messenger = document.getElementById("logMessage");
	messenger.innerHTML = logText;
	document.getElementById("bCloseLog").addEventListener("click",EzWebExt.bind(function(){this.closeLog()},this),true);
    var img = document.getElementById("logImage");
	if (type=="info"){
		container.setAttribute("class","infoLog");
        img.setAttribute("title","Info");
        img.setAttribute("src","/resources/images/information.png");
		img.setAttribute("alt","Info: ");
	} else if (type=="warning"){
		container.setAttribute("class","warningLog");
        img.setAttribute("title","Warning");
        img.setAttribute("src","/resources/images/warning.png");
		img.setAttribute("alt","Warning: ");
	}else{
		container.setAttribute("class","errorLog");
        img.setAttribute("title","Error");
        img.setAttribute("src","/resources/images/delete.png");
		img.setAttribute("alt","Error: ");
	}
	container.setAttribute("style","display:block");
    setTimeout("logger.getInstance().closeLog()",10000); // Invoking through the singleton because the visibility of the "this" in the setTimeout does not works
}

// it cleans and hides the log panel
logger.prototype.closeLog = function(){
	document.getElementById(this.logPanelId).setAttribute("style","display:none");
	document.getElementById("logMessage").innerHTML = "";
}
