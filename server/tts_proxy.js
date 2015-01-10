var http = require('http'),
    url = require("url"),
    request = require('request');



http.createServer(function (req, res) {

    var parameters = url.parse(req.url,true);
    console.log(parameters.query)

    var options = { method: 'GET', uri: "http://translate.google.com/translate_tts?q="+parameters.query['q']+'&tl='+parameters.query['tl'],
        headers : { "user-agent":"Mozilla"}
    }

    request(options, function(error, response, buffer) {
        //console.log(error)
        //console.log(response)
    }).pipe(res);

}).listen(8000);
console.log('TTS Server Running');