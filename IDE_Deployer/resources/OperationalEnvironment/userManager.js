// userManager is the class that provides the methods related to the users
function userManager(){
}

// The singleton pattern
userManager.instance = null;

userManager.getInstance = function() {
	if (userManager.instance == null) {
		userManager.instance = new userManager();
	}
	return userManager.instance;
}

// This initializes the object
userManager.prototype.init = function() {
	this.username = document.getElementById("usernameSpan").innerHTML;
}

// Returns the current username
userManager.prototype.getUser = function() {
	return this.username;
}
