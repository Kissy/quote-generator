var wordwrap = require('wordwrap')(20),
    http = require('http'),
    url = require('url'),
    gm = require('gm');

var port = process.env.PORT || 8080;
var imagemagick = gm.subClass({
    imageMagick: true
});

http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url);
    var parsedText = parsedUrl.pathname.match(/^\/(.*)\.jpg$/);
    if (!parsedText || parsedText.length < 2) {
        res.writeHead(404);
        res.end();
        return;
    }
    
    res.writeHead(200, {
        'Expires': new Date(Date.now() + 604800000),
        'Content-Type': 'image/jpeg'
    });
    
    var text = decodeURIComponent(parsedText[1]);
    var from = "- " + (parsedUrl.query || "Anonyme");
    imagemagick("assets/background.jpg")
        .font('assets/meiryo.ttc').fill('#BDC3C7')
        .fontSize(32).drawText(0, 0, wordwrap(text), 'Center')
        .fontSize(16).drawText(10, 10, from, 'SouthWest')
        .stream().pipe(res);
}).listen(port);