// file is the generic class for the elements that te editor manages
function file(){
}

// This initializes the object
// It receives the dom element which will be the container of its representation the file itself
file.prototype.init = function(wrapper,file){
	this.wrapper = wrapper;
	this.file = file;
}

// General method for displaying the file into the projects navigator
file.prototype.paint = function(){
}