enyo.kind({
	name: "XwTweakPlugin",
	kind: "enyo.Hybrid",
	width: 0,
	height: 0,
	executable: "xwtweak_plugin",

	create: function() {
		this.inherited(arguments);
	},

	setState: function(flag) {
		if (window.PalmSystem) {
            flag = flag && 1 || 0;
			this.callPluginMethodDeferred(enyo.nop, "setState", flag);
		}
	},

});

enyo.kind({
	name: "XwTweakApp",
	kind: "VFlexBox",
	components: [
        {kind: "XwTweakPlugin", name: "plugin"},
        {kind: "Control", flex: 1, components: [
            {kind: "RowGroup", caption: $L("System"), style: "margin-bottom: 10px", components: [
                {kind: "LabeledContainer", caption: $L("Accelerometer"), components: [
                    {kind: "ToggleButton", name: "AccelerometerToggle", onChange: "AccelerometerToggleClick"}
                ]},
            ]},
        ]}
	],

	create: function() {
		this.inherited(arguments);
        this.$.plugin.callPluginMethodDeferred(enyo.bind(this, "initAccelerometerToggle"), "getState");
	},
    initAccelerometerToggle: function(ret) {
        if (ret === "on") {
            this.$.AccelerometerToggle.setState(true);
        } else {
            this.$.AccelerometerToggle.setState(false);
        }
    },
    AccelerometerToggleClick: function() {
        this.$.plugin.setState(this.$.AccelerometerToggle.getState());
    },
});
