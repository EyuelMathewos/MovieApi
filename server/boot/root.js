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

  const uri = 'mongodb+srv://MovieDBUser:SvxWjNnwqb6H8qwL@cluster0.da5ri.mongodb.net';
  const dbName = 'MovieSource';
const client = new mongodb.MongoClient(uri,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(function(error) {
  assert.ifError(error);
  const db = client.db(dbName);
  console.log("the outer is working");


  router.get('/read/:trackID', function (req, res) {
       let metadata={};
      // Check file exist on MongoDB
     console.log("range: **************---");
     console.log(req.headers.range);

      try {
        console.log('working');
      var trackID = new ObjectID(req.params.trackID);
//       db.collection('fs.files').findOne({"_id": trackID}, (err, video) => {
//         if (err) throw err;
//         metadata = video;
//        });
      collection.find({ _id : 60788b53990bb300157cced8 }).toArray(function(err, video) {
          assert.equal(err, null);
          console.log('*******Find Video Detial');
          console.log(video);
       });
        
        
        
        
    } catch(err) {
      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }
    const videoSize = metadata.length;
    const end = videoSize - 1;

    //const contentLength = ;
    const headers = {
      "Content-Range": `bytes ${0}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": 3964664,
      "Content-Type": "video/mp4",
    };
    

//     res.set('content-type', 'video/mp4');
//     res.set('accept-ranges', 'bytes');
    res.setHeader("accept-ranges", "bytes");
    res.setHeader("content-length", 3964664);
//     res.status(206);
  
    let bucket = new mongodb.GridFSBucket(db);
  
    let downloadStream = bucket.openDownloadStream(trackID);
  
    downloadStream.pipe(res);

//        console.log("range: **************---");
//        console.log(req.range());

  });
  
      
  });
  server.use(router);
};
