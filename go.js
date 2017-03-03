var exec = require('child_process').exec;
var fs = require("fs");
var path = require('path');
var UglifyJS = require("uglify-js");

//settings

var src="./src";
var dest = "./proc";
var fdest ="./dest";

var dirs = [
  'global',
  'umd',
  'es6' 
];

var except = [
  'require','exports','module', 'export', 'default'
];

//end settings
var walk = function(directoryName, ext) {
  var res=  [];
  ext=ext || ".ts";
  var files=fs.readdirSync(directoryName);   
  files.forEach(function(file) {
      let fullPath = path.join(directoryName,file);
      let f= fs.statSync(fullPath);
      if (f.isDirectory()) {
          res=res.concat(walk(fullPath));
      } else {
      if(fullPath.match(ext+"$"))
            res.push(fullPath)
      }
    });
  return res;
};
var toProcess=walk(src);
toProcess.forEach(function(file){
  dirs.forEach(function(dir){
    let toAdd=file.substr(0, file.length-3)+"."+dir+".add";
    if(fs.existsSync(toAdd)){
      let outFile=path.join(dest, dir, path.basename(file));
      fs.writeFileSync(outFile, 
          fs.readFileSync(file)+"\n"+fs.readFileSync(toAdd));
    }
  })
});
for(let i=0; i<dirs.length; i++)
{
  let config = 'tsc -p tsconfig.'+dirs[i]+'.json';
  console.log("start "+dirs[i]);
  exec(config, function(error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    if(dirs[i] != 'es6') {
      let files = walk(path.join(fdest, dirs[i]), ".js");
      files.forEach(function(file){
        let baseName=file.substr(0, file.length-3);
        if(baseName.match(".min$")) return;
        let inMap = file+".map";
        let outFile = baseName+".min.js";
        let outMap = baseName+".min.js.map";
        let res=UglifyJS.minify(file, {
          outSourceMap: path.basename(outMap),
          outFileName: path.basename(outFile),
          inSourceMap: inMap,
          except:except
        });
        fs.writeFileSync(outFile, res.code);
        fs.writeFileSync(outMap, res.map);
      });
    }
    console.log("finished "+dirs[i]);
  });
}


