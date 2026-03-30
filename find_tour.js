var fs = require('fs');
var path = require('path');

function walk(dir, files) {
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full, files);
      } else if (e.name.match(/\.(cs|tsx|ts)$/)) {
        files.push(full);
      }
    }
  } catch(err) {}
  return files;
}

var base = 'D:\\DoAn\\panthora_be\\src';
var files = walk(base, []);
console.log(JSON.stringify(files));
