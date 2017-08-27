//express server setup
var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app)
  , expressWs = require('express-ws')(app, server)
  , device = require('express-device')
  , _ = require('lodash');
  // , tone = require('tone');


// serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/www'));
app.use(device.capture());

// device.enableDeviceHelpers(app);
// device.enableViewRouting(app);

//we'll keep clients data here
var clients = {};
var bulbs = [];
var players = {};
var spectators = {};
var messages = {};

//track disconnect timeouts
var disconnects = {};
  
 
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next) {
    console.log('page return');
    console.log(req.device.type);
    if (req.device.type == "phone" && Object.keys(players).length < 4) {
        res.sendFile(__dirname + '/src/index-mobile.html');
    } else {
        res.sendFile(__dirname + '/src/index-desktop.html');
    }
});
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

var port = process.env.PORT || 8080;
// app.listen(port);
server.listen(port);

console.log('\033[96m'+'Listening on ' + port +'\033[39m');

// eurecaServer.exports.ServerStatus = function () 
// {
//     val = val * 10;
//     client.write('{ "type": "CONTROLLER", "state": "STATUS" }');
//     console.log("ServerStatus");
// }

// eurecaServer.exports.MoveUpMouseDown = function () 
// {
//     client.write('{ "type": "controller", "state": "motor", "command": "MoveUpMouseDown" }');
//     console.log("MUC");
// }

// eurecaServer.exports.MoveUpMouseUp = function () 
// {
//     client.write('{ "type": "controller", "state": "motor", "command": "MoveUpMouseUp" }');
//     console.log("MUK");
// }

// eurecaServer.exports.MoveDownMouseDown = function () 
// {
//     client.write('{ "type": "controller", "state": "motor", "command": "MoveDownMouseDown" }');
//     console.log("MDC");
// }

// eurecaServer.exports.MoveDownMouseUp = function () 
// {
//     client.write('{ "type": "controller", "state": "motor", "command": "MoveDownMouseUp" }');
//     console.log("MDK");
// }
// eurecaServer.exports.SetSliderBrightness = function (bulb, val) 
// {
//     if (bulbs[bulb] == undefined) {
//         bulbs[bulb] = { r: 50, g: 50, b: 50, brightness: 100 }
//     }
//     bulbs[bulb].brightness = val/100;
//     console.log("Slider B", val, bulbs[bulb].brightness, bulbs[bulb]);
//     eurecaServer.exports.SetLED(bulb)
// }
// eurecaServer.exports.SetLED = function (bulb, rgb) 
// {
//     var rgbFaux = {};
//     console.log(bulb, bulbs, bulbs[bulb]);
//     if (rgb != null) {
//         rgbFaux.r = Math.round(rgb.r * bulbs[bulb].brightness * 10);
//         rgbFaux.g = Math.round(rgb.g * bulbs[bulb].brightness * 10);
//         rgbFaux.b = Math.round(rgb.b * bulbs[bulb].brightness * 10);
//         bulbs[bulb].r = rgb.r;
//         bulbs[bulb].g = rgb.g;
//         bulbs[bulb].b = rgb.b;
//     } else {
//         rgbFaux.r = Math.round(bulbs[bulb].r * bulbs[bulb].brightness * 10);
//         rgbFaux.g = Math.round(bulbs[bulb].g * bulbs[bulb].brightness * 10);
//         rgbFaux.b = Math.round(bulbs[bulb].b * bulbs[bulb].brightness * 10);
//     }
//     // console.log(bulbs[bulb].b, rgb.b, bulbs[bulb].brightness);
//     var result = String.format('{ "type": "controller", "state": "LED", "bulb": "{0}", "r": "{1}", "g": "{2}", "b": "{3}" }', bulb, rgbFaux.r, rgbFaux.g, rgbFaux.b );
//     client.write(result);
//     console.log("Slider B", result);
// }

