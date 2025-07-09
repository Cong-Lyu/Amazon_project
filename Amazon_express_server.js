const express = require('express');
const amazonServer = express();

amazonServer.use(express.static('./public'));

amazonServer.listen(5000, () => {
  console.log('Now Amazon server is created and listening requests from port 5000......');
})