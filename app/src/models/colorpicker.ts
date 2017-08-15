// User model based on the structure of github api at
// https://api.github.com/users/{username}
import { ControlsPage } from "../pages/controls/controls";

export class ColorPicker {
  color: any;
  controlsPage: ControlsPage;

  constructor(public context: ControlsPage) {
  	this.controlsPage = context;
  	debugger;
  }

  renderCallback($elm, toggled) {
    // function($elm, toggled) {
        console.log("color-picker1", this, this.color.setColor, $elm, toggled);
        
        if (this.controlsPage.envelope.selectedNodeColor != undefined) {
          if (this.controlsPage.envelope.val.points[this.controlsPage.envelope.selectedNodeColor].hex != undefined &&
              this.controlsPage.envelope.selectedNodeColorOld != this.controlsPage.envelope.selectedNodeColor) {
            console.log('setcolor', this.controlsPage.envelope.val.points[this.controlsPage.envelope.selectedNodeColor].hex)
            this.color.setColor(this.controlsPage.envelope.val.points[this.controlsPage.envelope.selectedNodeColor].rgb, 'rgb', 1);
          }

           if (this.controlsPage.envelope.selectedNodeColorOld == this.controlsPage.envelope.selectedNodeColor) {
            var rgb = { r: this.color.colors.rgb.r * 256, g: this.color.colors.rgb.g * 256, b: this.color.colors.rgb.b * 256 }
            this.controlsPage.envelope.val.points[this.controlsPage.envelope.selectedNodeColor].rgb = rgb;
            this.controlsPage.envelope.val.points[this.controlsPage.envelope.selectedNodeColor].hex = '#' + this.color.colors.HEX;
            this.controlsPage.envelope.master = this.controlsPage.master;
            this.controlsPage.waveform.master = this.controlsPage.master;
            this.controlsPage.FullDraw();
           }
            this.controlsPage.envelope.selectedNodeColorOld = this.controlsPage.envelope.selectedNodeColor;
        }
        console.log("color-picker", this, this.color.setColor, $elm, toggled);
      // }
    }
}