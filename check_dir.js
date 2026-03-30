var fs = require("fs");
var path = require("path");

var base = "D:\\DoAn\\pathora\\frontend\\src";
var result = fs.readdirSync(base);
console.log(result.join("\n"));
