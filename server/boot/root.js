// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const assert = require('assert');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;


module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', server.loopback.status());

  const uri = 'mongodb+srv://MovieDBUser:SvxWjNnwqb6H8qwL@cluster0.da5ri.mongodb.net/MovieSource?retryWrites=true&w=majority';

const client = new mongodb.MongoClient(uri,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(function(error) {
  assert.ifError(error);

  console.log("the outer is working");


  router.get('/read/:trackID', function (req, res) {
      // Check file exist on MongoDB
      try {
        console.log('working');
      var trackID = new ObjectID(req.params.trackID);
    } catch(err) {
      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }
    res.set('content-type', 'video/mp4');
    res.set('accept-ranges', 'bytes');
  
    let bucket = new mongodb.GridFSBucket(db);
  
    let downloadStream = bucket.openDownloadStream(trackID);
  
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
  
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
  
    downloadStream.on('end', () => {
      res.end();
    });

  });
  
      
  });
  server.use(router);
};
