enyo.kind({
	name: "mainView",
	kind: "VFlexBox",
	components: [
		{name: "getAccelState", kind: "PalmService", service: "palm://com.xwteam.app.xwtweak/", method: "accelGetState", onSuccess: "getAccelStateS", onFailure: "failure"},
		{name: "setAccelState", kind: "PalmService", service: "palm://com.xwteam.app.xwtweak/", method: "accelSetState", onSuccess: "setAccelStateS", onFailure: "failure"},
        {kind: enyo.Control, name: "content", style: "margin-top: 10px", flex: 1, components: [
            {kind: "RowGroup", name: "system_toggle", caption: $L("System"), components: [
                {kind: "LabeledContainer", caption: $L("Accelerometer"), components: [
                    {kind: "ToggleButton", name: "AccelerometerToggle", onChange: "AccelerometerToggleClick"}
                ]},
            ]},
	    {name: "error", showing: false, allowHtml: true},
        ]},
	],

	create: function() {
		this.inherited(arguments);
        this.$.getAccelState.call();
	},
	getAccelStateS: function(inSender, inResponse) {
	    switch (inResponse.state) {
		case "on":
		    this.$.AccelerometerToggle.setState(true);
		    break;
		case "off":
		    this.$.AccelerometerToggle.setState(false);
		    break;
		default:
		    this.$.system_toggle.hide();
		    this.$.error.show();
		    this.$.error.setContent("<h1>" + $L("error code") + ": " + inResponse.state + "</h1><h3>" + $L("Contact me") + ": xwteam001@gmail.com</h3>");
		    break;
	    }
	},
    setAccelStateS: function(inSender, inResponse) {
    },
    failure: function(inSender, inResponse) {
    },
	AccelerometerToggleClick: function() {
	    if (this.$.AccelerometerToggle.getState()) {
            this.$.setAccelState.call({state: "on"});
        } else {
            this.$.setAccelState.call({state: "off"});
        }
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
                        {kind: enyo.BasicScroller, components: [
                            {kind: "RowGroup", caption: $L("Author"), components: [
                                {kind: enyo.Image, src: "images/xwteam_logo.png"},
                                {content: "xwteam001@gmail.com", flex: 1},
                            ]},
                            {kind: "RowGroup", caption: $L("PalmService"), components: [
                                {content: "palm://com.xwteam.app.xwtweak/"},
                                {kind: "RowGroup", caption: $L("Accelerometer"), components: [
                                    {content: "<ul><li><b>method:</b> accelGetState</li><li><b>return:</b> {\"state\":\"on\"} OR {\"state\":\"off\"}</li></ul>", allowHtml: true},
                                    {content: "<ul><li><b>method:</b> accelSetState</li><li><b>param:</b> {\"state\": \"on\"} OR {\"state\": \"off\"}</li></ul>", allowHtml: true},
                                ]},
                            ]},
                        ]},
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
