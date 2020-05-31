// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
var mongoose = require('mongoose');
var gridfs = require('gridfs-stream');
var fs = require('fs');
module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', server.loopback.status());
  mongoose.connect('mongodb://localhost:27017/MovieSource', { useNewUrlParser: true }).then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));
  mongoose.Promise = global.Promise;
  gridfs.mongo = mongoose.mongo;
  var connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', function () {
  var gfs = gridfs(connection.db);
  router.get('/read/:id', function (req, res) {
      // Check file exist on MongoDB
      console.log(req);
      console.log("this is cunck of data")
      gfs.exist({ '_id': req.params.id }, function (err, file) {
          if (err || !file) {
              res.send('File Not Found');
          } else {
              res.set('content-type', 'video/mp4');
              res.set('accept-ranges', 'bytes');
              var readstream = gfs.createReadStream({  '_id': req.params.id });
              readstream.pipe(res);
          }
      });

  });
  
      
  });
  server.use(router);
};
