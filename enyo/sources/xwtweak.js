enyo.kind({
	name: "XwTweakPlugin",
	kind: "enyo.Hybrid",
	width: 0,
	height: 0,
	executable: "xwtweak_plugin",
    cachePlugin: true,

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
	name: "mainView",
	kind: "VFlexBox",
	components: [
        {kind: "XwTweakPlugin", name: "plugin"},
        {kind: "Control", style: "margin-top: 10px", flex: 1, components: [
            {kind: "RowGroup", caption: $L("System"), components: [
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

enyo.kind({
	name: "XwTweakApp",
    kind: enyo.VFlexBox,
    components: [
        {kind: "ApplicationEvents", onBack: "handleBack"},
        {kind: enyo.Pane, name: "pane", transitionKind: "enyo.transitions.Simple", flex: 1, components: [
                {kind: "mainView", name: "main"},
                {kind: enyo.VFlexBox, name: "about", className: "aboutView", lazy: false, components: [
                    {kind: enyo.PageHeader, name: "aboutHeader"},
                    {kind: enyo.Image, src: "images/xwteam_logo.png"},
                    {content: "xwteam001@gmail.com", flex: 1},
                ]},
            ]
        },
        {kind: "AppMenu", name: "appMenu", components: [
            {name: "aboutItem", caption: $L("About"), onclick: "selectAboutView"},
        ]},
    ],

    create: function() {
		this.inherited(arguments);

        var appInfo = enyo.fetchAppInfo();
        this.$.aboutHeader.setContent($L("About") + " " + appInfo.title + " " + appInfo.version);
        
    },

    selectAboutView: function() {
        this.$.pane.selectViewByName("about");
    },

    handleBack: function(s, e) {
        var n = this.$.pane.getViewName();
        switch (n) {
            case 'main':
                break;
            case 'about':
                this.$.pane.back(e);
                break;
        }
    },

	isMainShowing: function() {
		return this.$.pane.getViewName() === "main";
	},
	isAboutShowing: function() {
		return this.$.pane.getViewName() === "about";
	},
	openAppMenuHandler: function() {
		this.$.aboutItem.setDisabled(this.isAboutShowing());
	},
});
