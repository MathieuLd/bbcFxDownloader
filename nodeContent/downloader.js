const request = require('request');
const maxApi = require("max-api");
const csv = require('csv-parser');
const fs = require('fs');

let path = "";
let currentFileName = "";


// Setting the path of the download folder
setPath = (_path) =>{
	path = _path;
}


// Setting the current wav filename
setCurrentFileName = (CDName, tracknum) =>{
	// Removing illegal filename characters and preaparing the sring
	CDName = CDName.replace(/[/\\?%*,\s|"<>]/g, ''); //"
	CDName = CDName.replace(/:/g, '-');
	currentFileName = CDName + tracknum + ".wav";
}


// Downloading a wav file from the bbc soud effect data base according to a filename passed in argument
download = (fileIdName) =>{
	let file = fs.createWriteStream(path+fileIdName);
	
    let audioStream = request('http://bbcsfx.acropolis.org.uk/assets/'+fileIdName)
    .pipe(file)
	.on('finish', () => {
        // The file was downloaded
		// Renaming the file
		fs.renameSync(path+fileIdName, path+currentFileName);
		maxApi.outlet("done "+currentFileName);
    })	
	.on('error', (error) => {
		maxApi.outlet("error "+error);
    })	
}


// Parsing the list of all the sound effect and selecing a random one
parseCsv = () =>{
	var results = [];
	fs.createReadStream(path+'BBCSoundEffects.csv')
  	.pipe(csv())
  	.on('data', (data) => results.push(data))
  	.on('end', () => {
		var selectedFx = Math.floor(Math.random()*Object.keys(results).length);
		// The file was selected
		setCurrentFileName(results[selectedFx]["CDName"], results[selectedFx]["tracknum"]);
		download(results[selectedFx]["location"]);
  	})
	.on('error', (error) => {
		maxApi.outlet("error "+error);
    });
	fs.unlinkSync(path+'BBCSoundEffects.csv');
}


// Download the list of all the sound effects
bccSoundEffect = () =>{
	maxApi.outlet("wait");
	let fxList = fs.createWriteStream(path+'BBCSoundEffects.csv');
	
	let listStream = request('http://bbcsfx.acropolis.org.uk/assets/BBCSoundEffects.csv')
    .pipe(fxList)    
	.on('finish', () => {
        // The download of the csv list of the SFX is complete
		parseCsv();
    })	
	.on('error', (error) => {
        maxApi.outlet("error "+error);
    })
	
}



const handlers = {
"path": setPath, 
[maxApi.MESSAGE_TYPES.BANG]: bccSoundEffect	
};



maxApi.addHandlers(handlers);