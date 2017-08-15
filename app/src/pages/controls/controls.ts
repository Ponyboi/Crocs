import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EurecaClient } from '../../providers/eureca';
import {ColorPickerService} from 'angular2-color-picker';
// import { ColorPicker } from '../../models/colorpicker';
// import {ColorPickerDirective} from 'ct-angular2-color-picker/component'
/*
  Generated class for the Controls page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var nx: any;
declare var Tone: any;
declare var $: any;
declare var instance: any;

@Component({
  selector: 'page-controls',
  templateUrl: 'controls.html'
})
export class ControlsPage {
  private color: string = "#127bdc";
  constructor(public navCtrl: NavController, public eureca: EurecaClient, private cpService: ColorPickerService) {}
  ionViewDidLoad() {
    console.log('Hello ControlsPage Page');
    this.Init();
  }

  instance = this;

  // Automation
  rgb = {r: 50, g: 50, b: 50};
  master = { zoom: 4, slider: 0, cpService: {} };
  data = JSON.parse(localStorage.getItem("data"));
  current = { currentDevice: 0, mode: "rgb" };
  envelope:any = {};
  waveform:any = {};
  player:any = {};

  startIndex = 0;
  drawRGBInterval: number = 0;
  drawRGBTime = 0;
  drawRGBTimeNow = Date.now();
  drawRGBTimeOld = Date.now();
  currentRGB = { r: 50, g: 50, b: 50 };
  screenWidth = 0;

  MoveUpMouseDown() {
  	this.eureca.MoveUpMouseDown();
  	console.log("MUC");
  }
  MoveUpMouseUp() {
  	this.eureca.MoveUpMouseUp();
  	console.log("MUK");
  }
  MoveDownMouseDown() {
  	this.eureca.MoveDownMouseDown();
  	console.log("MDC");
  }
  MoveDownMouseUp() {
  	this.eureca.MoveDownMouseUp();
  	console.log("MDK");
  }
  SetSliderBrightness(event) {
  	this.eureca.SetSliderBrightness(1, event.currentTarget.value);
  	console.log("Slider B", event);
  }
  SetLEDR(event) {
  	this.rgb.r = event.currentTarget.value;
  	this.eureca.SetLED(this.rgb);
  	console.log("LEDR", event);
  }
  SetLEDG(event) {
  	this.rgb.g = event.currentTarget.value;
  	this.eureca.SetLED(this.rgb);
  	console.log("LEDG", event);
  }
  SetLEDB(event) {
  	this.rgb.b = event.currentTarget.value;
  	this.eureca.SetLED(this.rgb);
  	console.log("LEDB", event);
  }
  ServerStatus() {
  	this.eureca.ServerStatus();
  	console.log("ServerStatus", event);
  }

  // Audio
  PlayPause() {

  var offset = this.waveform.val.start * (this.waveform.duration/(this.waveform.duration/this.master.zoom));

  if (this.player.state == "stopped") {
    this.eureca.PlayPause({ state: 'play' });

    $(this).val("||");
    var duration = (this.waveform.val.stop - this.waveform.val.start) * this.master.zoom;
    if (this.waveform.val.stop - this.waveform.val.start < 0.003) {
      duration = 9999999;
    }
    this.player.start(0, offset, duration);

      //find starting point
    this.startIndex = 0;
    //var offset = waveform.val.start * (waveform.duration/(waveform.duration/master.zoom));
    var points = this.envelope.val.points;
    for (var i=0; i < points.length; i++) {
      if (points[i].x > offset && i > 0) {
        this.startIndex = i-1;
        this.drawRGBTime = offset;
        this.drawRGBTimeNow = Date.now();
        this.drawRGBTimeOld = Date.now();
        i = points.length;
        break;
      }
    }
    //myTimer();
    this.drawRGBInterval = setInterval(function(){ this.myTimer() }, 20);
    } else {
      this.eureca.PlayPause({ state: 'pause' });

      $(this).val(">");
      this.player.stop();
      clearInterval(this.drawRGBInterval);
      console.log('stop');
    }
  }
  MyTimer() {
    this.drawRGBTimeNow = Date.now();
    this.drawRGBTime = this.drawRGBTime + ((this.drawRGBTimeNow - this.drawRGBTimeOld)/1000);
    this.drawRGBTimeOld = this.drawRGBTimeNow;
    var p = this.envelope.val.points;
    if (p[this.startIndex+1].x < this.drawRGBTime) {
      this.startIndex++;
      if (this.startIndex >= p.length-1) {
        clearInterval(this.drawRGBInterval);
        return;
      }
    }
    console.log(this.drawRGBTime, this.drawRGBTimeNow, this.drawRGBTimeOld);
    console.log(p[this.startIndex].x, p[this.startIndex].rgb, p[this.startIndex+1].x, p[this.startIndex+1].rgb, this.drawRGBTime);
    this.currentRGB = this.PointsInterp(p[this.startIndex].x, p[this.startIndex].rgb, p[this.startIndex+1].x, p[this.startIndex+1].rgb, this.drawRGBTime);
    console.log(this.currentRGB);
    $('.current-color').css('background-color', 'rgb(' + Math.round(this.currentRGB.r) + ', ' + 
                                                         Math.round(this.currentRGB.g) + ', ' + 
                                                         Math.round(this.currentRGB.b) + ')');
  }
  PointsInterp(x1, rgb1, x2, rgb2, time) {
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
  MyStopFunction() {
    clearInterval(this.drawRGBInterval);
  }
  FullDraw() {
    this.envelope.draw();
    this.waveform.draw();
  }
  Switch() {
    if (this.current.mode == "rgb") {
      this.data[this.current.currentDevice].rgb = this.envelope.val.points;
      if (this.data[this.current.currentDevice].motor == null) {
        this.data[this.current.currentDevice].motor = [];
      }
      this.envelope.val.points = this.data[this.current.currentDevice].motor;
      this.current.mode = "motor";
      $(this).val(this.current.mode);
    } else {
      this.data[this.current.currentDevice].motor = this.envelope.val.points;
      if (this.data[this.current.currentDevice].rgb == null) {
        this.data[this.current.currentDevice].rgb = [];
      }
      this.envelope.val.points = this.data[this.current.currentDevice].rgb;
      this.current.mode = "rgb";
      $(this).val(this.current.mode);
    }
    this.envelope.master = this.master;
    this.waveform.master = this.master;
    this.FullDraw();
  }
  TimeSlider(data) {
  // console.log(data.target.value);
  this.master.slider = data.target.value;
  console.log("debug", Math.round(data.target.value * (this.waveform.duration / this.master.zoom) * 10));
  this.envelope.pos = Math.round((data.target.value * ((this.waveform.duration - (this.waveform.duration * (1/(this.waveform.duration / this.master.zoom)))) / this.master.zoom) * 10));
  this.waveform.pos = Math.round((data.target.value * ((this.waveform.duration - (this.waveform.duration * (1/(this.waveform.duration / this.master.zoom)))) / this.master.zoom) * 10));
  // waveform.definition = data.target.value / 10;
  this.envelope.master = this.master;
  this.waveform.master = this.master;
  this.FullDraw();
}
  ZoomMinus() {
    this.master.zoom = this.master.zoom / 2;
    $('.zoom-value').html(this.master.zoom);
    var sampleGrouping = (48000 * this.master.zoom) / 1000;
    console.log(sampleGrouping);
    this.waveform.zoom = sampleGrouping;
    this.envelope.zoom = sampleGrouping;
    this.envelope.master = this.master;
    this.waveform.master = this.master;
    this.waveform.setBuffer(this.player.buffer._buffer );
    this.FullDraw();
  }
  ZoomPlus() {
    this.master.zoom = this.master.zoom * 2;
    $('.zoom-value').html(this.master.zoom);
    var sampleGrouping = (48000 * this.master.zoom) / 1000;
    console.log(sampleGrouping);
    this.waveform.zoom = sampleGrouping;
    this.envelope.zoom = sampleGrouping;
    this.envelope.master = this.master;
    this.waveform.master = this.master;
    this.waveform.setBuffer(this.player.buffer._buffer );
    this.FullDraw();
  }

  Save() {
    if (this.data == null || this.data == "null") {
      this.data = {};
    }
    if (this.data[this.current.currentDevice] == null) {
      this.data[this.current.currentDevice] = {};
    }
    if (this.current.mode == "rgb") {
      this.data[this.current.currentDevice].rgb = this.envelope.val.points;
    } else {
      this.data[this.current.currentDevice].motor = this.envelope.val.points;
    }
    console.log(this.data);

    localStorage.setItem("data", JSON.stringify(this.data));
  }
  Delete() {
    localStorage.setItem("data", JSON.stringify([]));
  }
  // GenerateColorPicker() {
  //   var pickerObj = new ColorPicker(this);
  //   var picker = $('.color-picker').colorPicker(pickerObj);
  //   return picker;
  // }

  CanvasResize() {
    $( window ).load( function(){
      this.screenWidth = $( window ).width();
    });
      console.log('reszie init');

    $(window).resize( function(){
      //Do something
      console.log('resize');
      $('canvas[nx="envelope"]').width(window.innerWidth);
      $('canvas[nx="waveform"]').width (window.innerWidth);
      var width = Math.min(window.innerWidth-40, 1000);
      this.envelope.canvas.width = width * 2;
      this.waveform.canvas.width = width * 2;
      this.envelope.canvas.height = 300;
      this.waveform.canvas.height = 300;
      this.envelope.context.setTransform(2, 0, 0, 2, 0, 0);
      this.waveform.context.setTransform(2, 0, 0, 2, 0, 0);
      this.fullDraw();
    });
  }
  Init() {
    console.log('init');
    this.envelope = nx.add("envelope", { w: 1000, parent: 'nexus' });
    this.waveform = nx.add("waveform", { w: 1000, parent: 'nexus' });
    this.player = new Tone.Player("PuupyCatLullaby.wav", () => {
        //repitch the sample down a half step
      this.waveform.mode = "area";
      this.waveform.definition = "1";
      this.waveform.channels = 1;
      this.waveform.setBuffer(this.player.buffer._buffer);
      console.log(this.waveform);
        // sampler.triggerAttack(-1);
    }).toMaster();

    // this.CanvasResize();

    if (this.data != null && this.data.length > 0) {
      this.envelope.val.points = this.data[this.current.currentDevice].rgb;
    } else {
      this.envelope.val.points = JSON.parse('[{"x":0.1,"y":0.4,"rgb":{"r":120,"g":120,"b":120}},{"x":0.35,"y":0.6,"rgb":{"r":120,"g":120,"b":120}},{"x":0.65,"y":0.2,"rgb":{"r":120,"g":120,"b":120}},{"x":0.9,"y":0.4,"rgb":{"r":120,"g":120,"b":120}}]');
    }
    this.envelope.pos = 0;
    this.waveform.pos = 0;
    var sampleGrouping = (48000 * this.master.zoom) / 1000;
    console.log('sampleGrouping', sampleGrouping);
    this.waveform.zoom = sampleGrouping;
    this.envelope.zoom = sampleGrouping;
    // this.master.colorPicker = this.GenerateColorPicker();
    this.master.cpService = this.cpService;
    this.envelope.master = this.master;
    this.waveform.master = this.master;
    this.FullDraw();

    console.log('init fin');
  }
}
