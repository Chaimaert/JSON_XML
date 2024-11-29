const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');


const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

const employees = [];
employees.push({
    id: 1,
    name: 'Ali',
    salary: 9000
});
employees.push({
    id: 2,
    name: 'Kamal',
    salary: 22000
});
employees.push({
    id: 3,
    name: 'Amal',
    salary: 23000
});

// Mesurer le temps d'exécution pour JSON
let start = Date.now();
let jsonObject = { employee: employees };
let jsonData = JSON.stringify(jsonObject);
fs.writeFileSync('data.json', jsonData);
let jsonTime = Date.now() - start;

//  le temps d'exécution pour XML
start = Date.now();
const options = { compact: true, ignoreComment: true, spaces: 0 };
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
fs.writeFileSync('data.xml', xmlData);
let xmlTime = Date.now() - start;

// le temps d'exécution pour Protobuf
start = Date.now();
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
    throw Error(errMsg);
}
let message = EmployeeList.create(jsonObject);  
let buffer = EmployeeList.encode(message).finish(); 
fs.writeFileSync('data.proto', buffer);
let protoTime = Date.now() - start;

// Récupération de la taille des fichiers
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;


console.log(`Temps pour JSON: ${jsonTime} ms`);
console.log(`Temps pour XML: ${xmlTime} ms`);
console.log(`Temps pour Protobuf: ${protoTime} ms`);
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml' : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto' : ${protoFileSize} octets`);
