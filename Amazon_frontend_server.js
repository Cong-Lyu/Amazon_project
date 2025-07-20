const express = require('express');
const amazonServer = express();

amazonServer.use(express.static('./public'));

amazonServer.listen(4000, () => {
  console.log('Now Amazon frontend server is created and listening requests from port 4000......');
})