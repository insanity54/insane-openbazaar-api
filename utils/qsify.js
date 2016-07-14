// useful for creating Drakov specs.
// querystrings a text file
// to the format that OpenBazaar-Server expects


var qs = require('qs');


var file = process.argv[2];
if (typeof file === 'undefined') throw new Error('please pass the name of the jsonfile as a parameter');


var text = require(file);
if (typeof text === 'undefined') throw new Error('could not read text in this file, got undefined.');



var content = qs.stringify(text, {
    arrayFormat: 'repeat'
});

console.log(content);
