// EditManager is the class which provides the common interface for the different editors
// of the tool. It contains the common attributes and methods and singleton pattern
function editManager(){
}

editManager.instance = null;

editManager.getInstance = function() {
	if (editManager.instance == null) {
		editManager.instance = new editManager();
	}
	return editManager.instance;
}


// This initializes the object
editManager.prototype.init = function(){
}
/*
// Loads the file and creates the structures associatted to it
editManager.prototype.loadFile = function(file){
}

// Returns the content of the file
editManager.prototype.getFile = function(){
}

// Closes the file and free the structures associatted to it
editManager.prototype.closeFile = function(){
}

// Starts the operations for saving the file
editManager.prototype.saveFile = function(){
}
*/

// function for building the part of the interface correspondig to the editor
editManager.prototype.paint = function(){
}
