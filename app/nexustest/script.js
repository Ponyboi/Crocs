// $(document).ready(function() {

  // nx.onload = function() {

// var data = { 0: {rgb: [], motor: []}};
var data = JSON.parse(localStorage.getItem("data"));
var current = { currentDevice: 0, mode: "rgb" };

var master = {}
master.zoom = 4;
master.slider = 0;
$('zoom-plus').val(master.zoom);

var envelope = nx.add("envelope", { w: 1000, parent: 'nexus' });
var waveform = nx.add("waveform", { w: 1000, parent: 'nexus' });

if (data != null && data.length > 0) {
  envelope.val.points = data[current.currentDevice].rgb;
}

envelope.pos = 0;
waveform.pos = 0;
var sampleGrouping = (48000 * master.zoom) / 1000;
console.log('sampleGrouping', sampleGrouping);
waveform.zoom = sampleGrouping;
envelope.zoom = sampleGrouping;

// var sampler =  new Tone.Sampler("https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/Kick_11.wav", function(){
var player =  new Tone.Player("PuupyCatLullaby.wav", function(){
      //repitch the sample down a half step
    waveform.mode = "area";
    waveform.definition = "1";
    waveform.channels = 1;
    waveform.setBuffer(player.buffer._buffer );
      // sampler.triggerAttack(-1);
    }).toMaster();
   
fullDraw();

var startIndex = 0;
var drawRGBInterval = {};
var drawRGBTime = 0;
var drawRGBTimeNow = Date.now();
var drawRGBTimeOld = Date.now();
var currentRGB = {};
$('.play-pause').on('click', function() {
  var offset = waveform.val.start * (waveform.duration/(waveform.duration/master.zoom));

  if (player.state == "stopped") {
    $(this).val("||");
    var duration = (waveform.val.stop - waveform.val.start) * master.zoom;
    if (waveform.val.stop - waveform.val.start < 0.003) {
      duration = 9999999;
    }
    player.start(0, offset, duration);

      //find starting point
    startIndex = 0;
    //var offset = waveform.val.start * (waveform.duration/(waveform.duration/master.zoom));
    var points = envelope.val.points;
    for (var i=0; i < points.length; i++) {
      if (points[i].x > offset && i > 0) {
        startIndex = i-1;
        drawRGBTime = offset;
        drawRGBTimeNow = Date.now();
        drawRGBTimeOld = Date.now();
        i = points.length;
        break;
      }
    }
  //myTimer();
  drawRGBInterval = setInterval(function(){ myTimer() }, 20);
  } else {
    $(this).val(">");
    player.stop();
    clearInterval(drawRGBInterval);
    console.log('stop');
  }
});

function myTimer() {
  drawRGBTimeNow = Date.now();
  drawRGBTime = drawRGBTime + ((drawRGBTimeNow - drawRGBTimeOld)/1000);
  drawRGBTimeOld = drawRGBTimeNow;
  var p = envelope.val.points;
  if (p[startIndex+1].x < drawRGBTime) {
    startIndex++;
    if (startIndex >= p.length-1) {
      clearInterval(drawRGBInterval);
      return;
    }
  }
  console.log(drawRGBTime, drawRGBTimeNow, drawRGBTimeOld);
  console.log(p[startIndex].x, p[startIndex].rgb, p[startIndex+1].x, p[startIndex+1].rgb, drawRGBTime);
  currentRGB = pointsInterp(p[startIndex].x, p[startIndex].rgb, p[startIndex+1].x, p[startIndex+1].rgb, drawRGBTime);
  console.log(currentRGB);
  $('.current-color').css('background-color', 'rgb(' + Math.round(currentRGB.r) + ', ' + 
                                                       Math.round(currentRGB.g) + ', ' + 
                                                       Math.round(currentRGB.b) + ')');
}
function pointsInterp(x1, rgb1, x2, rgb2, time) {
  var total = x2 - x1;
  time = time - x1;
  var x1p = (total - time) / total;
  var x2p = time / total;
  console.log(total);
  console.log(x1p);
  console.log(x2p);
  return { r:((x1p * rgb1.r) + (x2p * rgb2.r)), 
           g: ((x1p * rgb1.g) + (x2p * rgb2.g)), 
           b: ((x1p * rgb1.b) + (x2p * rgb2.b)) };
}

function myStopFunction() {
    clearInterval(drawRGB);
}


nx.onload = function() {

// fullDraw();

    
	  // envelope.on('*', function(data) {
	  //   //console.log(data);
	  // });

	}

  // envelope.GUI.w = sampler.buffer._buffer.length;

master.colorPicker = $('.color-picker').colorPicker(
 {
  // buildCallback: function($elm) {
  //   if (envelope.selectedNodeColor != undefined) {
  //     if (envelope.val.points[envelope.selectedNodeColor].hex != undefined &&
  //         envelope.selectedNodeColorOld != envelope.selectedNodeColor) {
  //       console.log('setcolor', envelope.val.points[envelope.selectedNodeColor].hex)
  //       this.color.setColor(envelope.val.points[envelope.selectedNodeColor].hueRGB, 'rgb', 1);
  //       envelope.selectedNodeColorOld = envelope.selectedNodeColor;
  //     }

  //     // if (envelope.selectedNodeColorOld != envelope.selectedNodeColor) {
  //       envelope.val.points[envelope.selectedNodeColor].hueRGB = this.color.colors.hueRGB;
  //       envelope.val.points[envelope.selectedNodeColor].hex = '#' + this.color.colors.HEX;
  //       fullDraw();
  //     // }
  //   }
  // },
  renderCallback: function($elm, toggled) {
    console.log("color-picker1", this, this.color.setColor, $elm, toggled);
    
    if (envelope.selectedNodeColor != undefined) {
      if (envelope.val.points[envelope.selectedNodeColor].hex != undefined &&
          envelope.selectedNodeColorOld != envelope.selectedNodeColor) {
        console.log('setcolor', envelope.val.points[envelope.selectedNodeColor].hex)
        this.color.setColor(envelope.val.points[envelope.selectedNodeColor].hueRGB, 'rgb', 1);
      }

       if (envelope.selectedNodeColorOld == envelope.selectedNodeColor) {
        var rgb = { r: this.color.colors.rgb.r * 256, g: this.color.colors.rgb.g * 256, b: this.color.colors.rgb.b * 256 }
        envelope.val.points[envelope.selectedNodeColor].hueRGB = rgb;
        envelope.val.points[envelope.selectedNodeColor].hex = '#' + this.color.colors.HEX;
        fullDraw();
       }
        envelope.selectedNodeColorOld = envelope.selectedNodeColor;
    }
    console.log("color-picker", this, this.color.setColor, $elm, toggled);
  }
 }
);
$('.time-slider').on('input change', function(data) {
  // console.log(data.target.value);
  master.slider = data.target.value;
  console.log("debug", Math.round(data.target.value * (waveform.duration / master.zoom) * 10));
  envelope.pos = Math.round((data.target.value * ((waveform.duration - (waveform.duration * (1/(waveform.duration / master.zoom)))) / master.zoom) * 10));
  waveform.pos = Math.round((data.target.value * ((waveform.duration - (waveform.duration * (1/(waveform.duration / master.zoom)))) / master.zoom) * 10));
  // waveform.definition = data.target.value / 10;
  fullDraw();
});
$('.zoom-minus').on('click', function() {
  master.zoom = master.zoom / 2;
  $('.zoom-value').html(master.zoom);
  var sampleGrouping = (48000 * master.zoom) / 1000;
  console.log(sampleGrouping);
  waveform.zoom = sampleGrouping;
  envelope.zoom = sampleGrouping;
  waveform.setBuffer(player.buffer._buffer );
  fullDraw();
});
$('.zoom-plus').on('click', function() {
  master.zoom = master.zoom * 2;
  $('.zoom-value').html(master.zoom);
  var sampleGrouping = (48000 * master.zoom) / 1000;
  console.log(sampleGrouping);
  waveform.zoom = sampleGrouping;
  envelope.zoom = sampleGrouping;
  waveform.setBuffer(player.buffer._buffer );
  fullDraw();
});


function fullDraw() {
  envelope.draw();
  waveform.draw();
}

  $('.switch').on('click', function() {
    if (current.mode == "rgb") {
      data[current.currentDevice].rgb = envelope.val.points;
      if (data[current.currentDevice].motor == null) {
        data[current.currentDevice].motor = [];
      }
      envelope.val.points = data[current.currentDevice].motor;
      current.mode = "motor";
      $(this).val(current.mode);
    } else {
      data[current.currentDevice].motor = envelope.val.points;
      if (data[current.currentDevice].rgb == null) {
        data[current.currentDevice].rgb = [];
      }
      envelope.val.points = data[current.currentDevice].rgb;
      current.mode = "rgb";
      $(this).val(current.mode);
    }
    fullDraw();
  });

  $('.save').on('click', function() {
    if (data == null || data == "null") {
      data = {};
    }
    if (data[current.currentDevice] == null) {
      data[current.currentDevice] = {};
    }
    if (current.mode == "rgb") {
      data[current.currentDevice].rgb = envelope.val.points;
    } else {
      data[current.currentDevice].motor = envelope.val.points;
    }
    console.log(data);

    localStorage.setItem("data", JSON.stringify(data));
  });
  $('.delete').on('click', function() {
    localStorage.setItem("data", JSON.stringify([]));
  });


// }

// });

/*
localStorage.getItem("");
localStorage.setItem("");
*/