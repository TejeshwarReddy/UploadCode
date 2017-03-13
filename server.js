/**
  * Module dependencies.
  */
let express = require('express'),
    mrgan = require('morgan'),
    Busboy = require('busboy'),
    os = require('os'),
    fs = require('fs'),
    path = require('path'),
    app = express();

/**
  * HTTP middleware request logger
  * @see "https://www.npmjs.com/package/morgan"
  */
app.use(mrgan('dev'))

/**
  * File upload request,
  * using busboy middleware for parsing multipart
  * @see "https://www.npmjs.com/package/busboy"
  */
app.post('/upload', function(req, res) {
    /**
      * get the HTTP headers of the incoming request
      */
    var busboy = new Busboy({
        headers: req.headers
    })

    /**
      * "file" event is emitted whenever any file is received, and is stored in the specified folder
      */
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        var saveTo = path.join('./uploads', filename)
        file.pipe(fs.createWriteStream(saveTo))
        console.log('uploading');
    })

    /** "finish" event is emitted after the file is uploaded.
      * Closing the server socket
      */
    busboy.on('finish', () => {
        res.writeHead(200, {
            'Connection': 'close'
        })
        res.end('uploaded')
    })
    return req.pipe(busboy)
})

app.listen(3000, '172.16.73.217', function() {
    console.log('3000')
})
