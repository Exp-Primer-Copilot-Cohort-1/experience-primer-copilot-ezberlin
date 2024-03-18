//Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 3000;
var server = http.createServer(function(req, res) {
    var urlData = url.parse(req.url, true);
    var path = urlData.pathname;
    console.log('path:', path);
    if (path === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var html = fs.readFileSync(__dirname + '/index.html');
        res.end(html);
    } else if (path === '/comments') {
        if (req.method === 'GET') {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            var comments = fs.readFileSync(__dirname + '/comments.json');
            res.end(comments);
        } else if (req.method === 'POST') {
            var data = '';
            req.on('data', function(chunk) {
                data += chunk;
            });
            req.on('end', function() {
                var comments = JSON.parse(fs.readFileSync(__dirname + '/comments.json'));
                comments.push(JSON.parse(data));
                fs.writeFileSync(__dirname + '/comments.json', JSON.stringify(comments));
                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(comments));
            });
        }
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not Found');
    }
});
server.listen(port, function() {
    console.log('server is listening on port', port);
});
