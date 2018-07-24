const fs = require("fs");

// Save base64 encoded file to path
module.exports.saveBase64File = (base64Data, path) => {
	fs.writeFile(path, base64Data, "base64", (err) => {if(err) throw err});
}

module.exports.capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}