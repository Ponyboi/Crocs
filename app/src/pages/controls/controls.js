var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EurecaClient } from '../../providers/eureca';
import { ColorPicker } from '../../models/colorpicker';
var ControlsPage = (function () {
    function ControlsPage(navCtrl, eureca) {
        this.navCtrl = navCtrl;
        this.eureca = eureca;
        this.instance = this;
        // Automation
        this.rgb = { r: 50, g: 50, b: 50 };
        this.master = { zoom: 4, slider: 0, colorPicker: {} };
        this.data = JSON.parse(localStorage.getItem("data"));
        this.current = { currentDevice: 0, mode: "rgb" };
        this.envelope = {};
        this.waveform = {};
        this.player = {};
        this.startIndex = 0;
        this.drawRGBInterval = 0;
        this.drawRGBTime = 0;
        this.drawRGBTimeNow = Date.now();
        this.drawRGBTimeOld = Date.now();
        this.currentRGB = { r: 50, g: 50, b: 50 };
        this.screenWidth = 0;
    }
    ControlsPage.prototype.ionViewDidLoad = function () {
        console.log('Hello ControlsPage Page');
        this.Init();
    };
    ControlsPage.prototype.MoveUpMouseDown = function () {
        this.eureca.MoveUpMouseDown();
        console.log("MUC");
    };
    ControlsPage.prototype.MoveUpMouseUp = function () {
        this.eureca.MoveUpMouseUp();
        console.log("MUK");
    };
    ControlsPage.prototype.MoveDownMouseDown = function () {
        this.eureca.MoveDownMouseDown();
        console.log("MDC");
    };
    ControlsPage.prototype.MoveDownMouseUp = function () {
        this.eureca.MoveDownMouseUp();
        console.log("MDK");
    };
    ControlsPage.prototype.SetSliderBrightness = function (event) {
        this.eureca.SetSliderBrightness(1, event.currentTarget.value);
        console.log("Slider B", event);
    };
    ControlsPage.prototype.SetLEDR = function (event) {
        this.rgb.r = event.currentTarget.value;
        this.eureca.SetLED(this.rgb);
        console.log("LEDR", event);
    };
    ControlsPage.prototype.SetLEDG = function (event) {
        this.rgb.g = event.currentTarget.value;
        this.eureca.SetLED(this.rgb);
        console.log("LEDG", event);
    };
    ControlsPage.prototype.SetLEDB = function (event) {
        this.rgb.b = event.currentTarget.value;
        this.eureca.SetLED(this.rgb);
        console.log("LEDB", event);
    };
    ControlsPage.prototype.ServerStatus = function () {
        this.eureca.ServerStatus();
        console.log("ServerStatus", event);
    };
    // Audio
    ControlsPage.prototype.PlayPause = function () {
        var offset = this.waveform.val.start * (this.waveform.duration / (this.waveform.duration / this.master.zoom));
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
            for (var i = 0; i < points.length; i++) {
                if (points[i].x > offset && i > 0) {
                    this.startIndex = i - 1;
                    this.drawRGBTime = offset;
                    this.drawRGBTimeNow = Date.now();
                    this.drawRGBTimeOld = Date.now();
                    i = points.length;
                    break;
                }
            }
            //myTimer();
            this.drawRGBInterval = setInterval(function () { this.myTimer(); }, 20);
        }
        else {
            this.eureca.PlayPause({ state: 'pause' });
            $(this).val(">");
            this.player.stop();
            clearInterval(this.drawRGBInterval);
            console.log('stop');
        }
    };
    ControlsPage.prototype.MyTimer = function () {
        this.drawRGBTimeNow = Date.now();
        this.drawRGBTime = this.drawRGBTime + ((this.drawRGBTimeNow - this.drawRGBTimeOld) / 1000);
        this.drawRGBTimeOld = this.drawRGBTimeNow;
        var p = this.envelope.val.points;
        if (p[this.startIndex + 1].x < this.drawRGBTime) {
            this.startIndex++;
            if (this.startIndex >= p.length - 1) {
                clearInterval(this.drawRGBInterval);
                return;
            }
        }
        console.log(this.drawRGBTime, this.drawRGBTimeNow, this.drawRGBTimeOld);
        console.log(p[this.startIndex].x, p[this.startIndex].rgb, p[this.startIndex + 1].x, p[this.startIndex + 1].rgb, this.drawRGBTime);
        this.currentRGB = this.PointsInterp(p[this.startIndex].x, p[this.startIndex].rgb, p[this.startIndex + 1].x, p[this.startIndex + 1].rgb, this.drawRGBTime);
        console.log(this.currentRGB);
        $('.current-color').css('background-color', 'rgb(' + Math.round(this.currentRGB.r) + ', ' +
            Math.round(this.currentRGB.g) + ', ' +
            Math.round(this.currentRGB.b) + ')');
    };
    ControlsPage.prototype.PointsInterp = function (x1, rgb1, x2, rgb2, time) {
        var total = x2 - x1;
        time = time - x1;
        var x1p = (total - time) / total;
        var x2p = time / total;
        console.log(total);
        console.log(x1p);
        console.log(x2p);
        return { r: ((x1p * rgb1.r) + (x2p * rgb2.r)),
            g: ((x1p * rgb1.g) + (x2p * rgb2.g)),
            b: ((x1p * rgb1.b) + (x2p * rgb2.b)) };
    };
    ControlsPage.prototype.MyStopFunction = function () {
        clearInterval(this.drawRGBInterval);
    };
    ControlsPage.prototype.FullDraw = function () {
        this.envelope.draw();
        this.waveform.draw();
    };
    // nxOnLoad() {
    //   this.master.colorPicker = $('.color-picker').colorPicker(
    //   {
    //     renderCallback: function($elm, toggled) {
    //       console.log("color-picker1", this, this.color.setColor, $elm, toggled);
    //       if (envelope.selectedNodeColor != undefined) {
    //         if (envelope.val.points[envelope.selectedNodeColor].hex != undefined &&
    //             envelope.selectedNodeColorOld != envelope.selectedNodeColor) {
    //           console.log('setcolor', envelope.val.points[envelope.selectedNodeColor].hex)
    //           this.color.setColor(envelope.val.points[envelope.selectedNodeColor].rgb, 'rgb', 1);
    //         }
    //          if (envelope.selectedNodeColorOld == envelope.selectedNodeColor) {
    //           var rgb = { r: this.color.colors.rgb.r * 256, g: this.color.colors.rgb.g * 256, b: this.color.colors.rgb.b * 256 }
    //           envelope.val.points[envelope.selectedNodeColor].rgb = rgb;
    //           envelope.val.points[envelope.selectedNodeColor].hex = '#' + this.color.colors.HEX;
    //           fullDraw();
    //          }
    //           envelope.selectedNodeColorOld = envelope.selectedNodeColor;
    //       }
    //       console.log("color-picker", this, this.color.setColor, $elm, toggled);
    //     }
    //    }
    //   )
    // }
    ControlsPage.prototype.Switch = function () {
        if (this.current.mode == "rgb") {
            this.data[this.current.currentDevice].rgb = this.envelope.val.points;
            if (this.data[this.current.currentDevice].motor == null) {
                this.data[this.current.currentDevice].motor = [];
            }
            this.envelope.val.points = this.data[this.current.currentDevice].motor;
            this.current.mode = "motor";
            $(this).val(this.current.mode);
        }
        else {
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
    };
    ControlsPage.prototype.TimeSlider = function (data) {
        // console.log(data.target.value);
        this.master.slider = data.target.value;
        console.log("debug", Math.round(data.target.value * (this.waveform.duration / this.master.zoom) * 10));
        this.envelope.pos = Math.round((data.target.value * ((this.waveform.duration - (this.waveform.duration * (1 / (this.waveform.duration / this.master.zoom)))) / this.master.zoom) * 10));
        this.waveform.pos = Math.round((data.target.value * ((this.waveform.duration - (this.waveform.duration * (1 / (this.waveform.duration / this.master.zoom)))) / this.master.zoom) * 10));
        // waveform.definition = data.target.value / 10;
        this.envelope.master = this.master;
        this.waveform.master = this.master;
        this.FullDraw();
    };
    ControlsPage.prototype.ZoomMinus = function () {
        this.master.zoom = this.master.zoom / 2;
        $('.zoom-value').html(this.master.zoom);
        var sampleGrouping = (48000 * this.master.zoom) / 1000;
        console.log(sampleGrouping);
        this.waveform.zoom = sampleGrouping;
        this.envelope.zoom = sampleGrouping;
        this.envelope.master = this.master;
        this.waveform.master = this.master;
        this.waveform.setBuffer(this.player.buffer._buffer);
        this.FullDraw();
    };
    ControlsPage.prototype.ZoomPlus = function () {
        this.master.zoom = this.master.zoom * 2;
        $('.zoom-value').html(this.master.zoom);
        var sampleGrouping = (48000 * this.master.zoom) / 1000;
        console.log(sampleGrouping);
        this.waveform.zoom = sampleGrouping;
        this.envelope.zoom = sampleGrouping;
        this.envelope.master = this.master;
        this.waveform.master = this.master;
        this.waveform.setBuffer(this.player.buffer._buffer);
        this.FullDraw();
    };
    ControlsPage.prototype.Save = function () {
        if (this.data == null || this.data == "null") {
            this.data = {};
        }
        if (this.data[this.current.currentDevice] == null) {
            this.data[this.current.currentDevice] = {};
        }
        if (this.current.mode == "rgb") {
            this.data[this.current.currentDevice].rgb = this.envelope.val.points;
        }
        else {
            this.data[this.current.currentDevice].motor = this.envelope.val.points;
        }
        console.log(this.data);
        localStorage.setItem("data", JSON.stringify(this.data));
    };
    ControlsPage.prototype.Delete = function () {
        localStorage.setItem("data", JSON.stringify([]));
    };
    ControlsPage.prototype.GenerateColorPicker = function () {
        var pickerObj = new ColorPicker(this);
        var picker = $('.color-picker').colorPicker({});
        return picker;
    };
    ControlsPage.prototype.CanvasResize = function () {
        $(window).load(function () {
            this.screenWidth = $(window).width();
        });
        console.log('reszie init');
        $(window).resize(function () {
            //Do something
            console.log('resize');
            $('canvas[nx="envelope"]').width(window.innerWidth);
            $('canvas[nx="waveform"]').width(window.innerWidth);
            var width = Math.min(window.innerWidth - 40, 1000);
            this.envelope.canvas.width = width * 2;
            this.waveform.canvas.width = width * 2;
            this.envelope.canvas.height = 300;
            this.waveform.canvas.height = 300;
            this.envelope.context.setTransform(2, 0, 0, 2, 0, 0);
            this.waveform.context.setTransform(2, 0, 0, 2, 0, 0);
            this.fullDraw();
        });
    };
    ControlsPage.prototype.Init = function () {
        var _this = this;
        console.log('init');
        this.master.colorPicker = this.GenerateColorPicker();
        this.envelope = nx.add("envelope", { w: 1000, parent: 'nexus' });
        this.waveform = nx.add("waveform", { w: 1000, parent: 'nexus' });
        this.player = new Tone.Player("PuupyCatLullaby.wav", function () {
            //repitch the sample down a half step
            _this.waveform.mode = "area";
            _this.waveform.definition = "1";
            _this.waveform.channels = 1;
            _this.waveform.setBuffer(_this.player.buffer._buffer);
            console.log(_this.waveform);
            // sampler.triggerAttack(-1);
        }).toMaster();
        // this.CanvasResize();
        if (this.data != null && this.data.length > 0) {
            this.envelope.val.points = this.data[this.current.currentDevice].rgb;
        }
        else {
            this.envelope.val.points = JSON.parse('[{"x":0.1,"y":0.4,"rgb":{"r":120,"g":120,"b":120}},{"x":0.35,"y":0.6,"rgb":{"r":120,"g":120,"b":120}},{"x":0.65,"y":0.2,"rgb":{"r":120,"g":120,"b":120}},{"x":0.9,"y":0.4,"rgb":{"r":120,"g":120,"b":120}}]');
        }
        this.envelope.pos = 0;
        this.waveform.pos = 0;
        var sampleGrouping = (48000 * this.master.zoom) / 1000;
        console.log('sampleGrouping', sampleGrouping);
        this.waveform.zoom = sampleGrouping;
        this.envelope.zoom = sampleGrouping;
        this.envelope.master = this.master;
        this.waveform.master = this.master;
        this.FullDraw();
        console.log('init fin');
    };
    return ControlsPage;
}());
ControlsPage = __decorate([
    Component({
        selector: 'page-controls',
        templateUrl: 'controls.html'
    }),
    __metadata("design:paramtypes", [NavController, EurecaClient])
], ControlsPage);
export { ControlsPage };
//# sourceMappingURL=controls.js.map