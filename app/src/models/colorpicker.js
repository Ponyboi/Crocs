var ColorPicker = (function () {
    function ColorPicker(context) {
        this.context = context;
    }
    ColorPicker.prototype.renderCallback = function ($elm, toggled) {
        // function($elm, toggled) {
        console.log("color-picker1", this, this.color.setColor, $elm, toggled);
        if (this.context.envelope.selectedNodeColor != undefined) {
            if (this.envelope.val.points[this.envelope.selectedNodeColor].hex != undefined &&
                this.envelope.selectedNodeColorOld != this.envelope.selectedNodeColor) {
                console.log('setcolor', this.envelope.val.points[this.envelope.selectedNodeColor].hex);
                this.color.setColor(this.envelope.val.points[this.envelope.selectedNodeColor].rgb, 'rgb', 1);
            }
            if (this.envelope.selectedNodeColorOld == this.envelope.selectedNodeColor) {
                var rgb = { r: this.color.colors.rgb.r * 256, g: this.color.colors.rgb.g * 256, b: this.color.colors.rgb.b * 256 };
                this.envelope.val.points[this.envelope.selectedNodeColor].rgb = rgb;
                this.envelope.val.points[this.envelope.selectedNodeColor].hex = '#' + this.color.colors.HEX;
                this.envelope.master = this.master;
                this.waveform.master = this.master;
                this.FullDraw();
            }
            this.envelope.selectedNodeColorOld = this.envelope.selectedNodeColor;
        }
        console.log("color-picker", this, this.color.setColor, $elm, toggled);
        // }
    };
    return ColorPicker;
}());
export { ColorPicker };
//# sourceMappingURL=colorpicker.js.map