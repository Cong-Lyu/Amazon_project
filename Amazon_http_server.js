const http = require('http');
const fs = require('fs');
const url = require('url');
const pathPackage = require('path');
const projectPath = '.';
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
let subFolders = [];
let fetchStaticFilesDict = {};
const ignoredFolders = ['.git', 'node_modules'];
const websitesFolderHtmlFile = ['/Amazon_products.html', '/Amazon_login.html', '/Amazon_checkout.html'];

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if(err) {reject(err)}
      else {resolve(data)}
    })
  })
}

function isFolder(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if(err) {
        reject(err);
      }
      else {
        if(stats.isDirectory()) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }
    })
  })
}

function getSubItems(path) {  //here read all the items in a sub folder.
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) {reject(err);}
      else {
        resolve(files);
      }
    })
  })
}

function getFilesInSubFolder(subFolderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(subFolderPath, (err, files) => {
      if(err) {reject(err);}
      else {resolve(files);}
    })
  })
}

async function getSubFolders(path) {
  let label = 0;
  const files = await getSubItems(path);
  for(const item of files) { //loop all the files in a folder
    if(ignoredFolders.includes(item)) {continue;} // if it is in the ignore list, ignores it.

    const newPath = path + '/' + item;  //build up the new path for the sub file.
    const judument = await isFolder(newPath);  //check if this new file is a folder? 

    if(judument === false) {continue;}  // if it is not a folder, continue.
    else {
      label ++;
      await getSubFolders(newPath);
    }
  }
  if(label === 0) {subFolders.push(path);}
   // when all the files inside a folder are checked, this folder will be added into subFolders list.
}

async function readAllFiles() {
  await getSubFolders(projectPath);
  for(const folder of subFolders) {  //here reads out the path of a sub folder.
    const filesInSubFolder = await getFilesInSubFolder(folder);   //here gets all files in a sub folder.
    for(const file of filesInSubFolder) {
      const filePath = folder + '/' + file;
      const fileContent = await readFile(filePath);
      fetchStaticFilesDict[`${filePath}`] = fileContent;
    }
  }
}

function getFileBasedOnUrl(path) {
  const actualPath = '.' + path;
  if(actualPath in fetchStaticFilesDict) {
    return [true, fetchStaticFilesDict[actualPath]];
  }
  else {
    return [false, undefined];
  }
}

async function serverBuildUp() {
  await readAllFiles();
  
  const server = http.createServer(async (req, res) => {
    let file = [];
    if(websitesFolderHtmlFile.includes(req.url)) { //this only works when users click to redirect to the html files in Websites folder.
      console.log(req.url);
      req.url = "/Websites" + req.url;
      file = getFileBasedOnUrl(req.url);
    }
    else if(req.url === '/') { //this sets the path '/' to the home products page by default.
      req.url = "/Websites/Amazon_products.html";
      file = getFileBasedOnUrl(req.url);
    }
    else {  //below are the normal requests can be found in the fetchStaticFilesDict dictionary.
      file = getFileBasedOnUrl(req.url);
    }
    
    if(file[0] === true) {  //here builds up the response to the user.
      res.writeHead(200, {'Content-type': `${mimeTypes[pathPackage.extname(req.url)]}`})
      res.end(file[1]);
    }
    else {
      res.writeHead(404);
      res.end('Page Not Found');
    }
  });
  server.listen(5000, () => {console.log('Now, Amazon project is ready for requests.')})
}

serverBuildUp();