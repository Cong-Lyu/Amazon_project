const http = require('http');
const fs = require('fs');

let AmazonProductsFile = ``;
let AmazonCheckoutFile = ``;
let AmazonLoginFile = ``;

async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    const readFileStream = fs.createReadStream(filePath, 'utf8');
    let fileString = ``;
    readFileStream.on('data', (chunk) => { fileString += chunk })
    readFileStream.on('end', () => { resolve(fileString) })
    readFileStream.on('error', (error) => { reject(error) })
  })
}

async function readAllFiles() {
  AmazonProductsFile = await readFile('./Websites/Amazon_products.html');
  AmazonCheckoutFile = await readFile('./Websites/Amazon_checkout.html');
  AmazonLoginFile = await readFile('./Websites/Amazon_login.html');
}

async function serverBuildUp() {
  await readAllFiles();
  
  const server = http.createServer(async (req, res) => {
    
    if(req.url === '/') {
      res.writeHead(200, {'Content-type': 'text/html'});
      res.end(AmazonProductsFile);
    }
  });
  server.listen(5000, () => {console.log('Now, Amazon project is ready for requests.')})
}

serverBuildUp();