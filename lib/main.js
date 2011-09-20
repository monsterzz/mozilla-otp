const widgets   = require("widget"),
	  tabs      = require("tabs"),
	  panel     = require("panel"),
	  cb        = require("clipboard"),
	  data      = require("self").data,
	  md5       = require("md5").hex_md5,
	  prefs     = require("prefs");

const {Cc,Ci,Cm,Cr,Cu} = require("chrome");
const promptSvc = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

var toHexString = function (charCode) {
	return ("0" + charCode.toString(16)).slice(-2);
}

var motpPanel = panel.Panel({
	width: 300,
	height: 150,
	contentURL: data.url('panel.html'),
	contentScriptFile: data.url('panel.js'),
	allow: {
		script: true
	},
	onShow: function () {
		let secret = prefs.s_pref('init_secret');
		console.log(secret);
		motpPanel.port.emit('init-secret', secret);
	},
	onMessage: function (aPayload) {
		motpPanel.hide();

		if (!aPayload) return;
		let pin    = aPayload.pin,
		    secret = aPayload.secret,
		    salt   = Math.floor(new Date().getTime() / 1000 / 10) + secret + pin;

		prefs.s_pref('init_secret', secret);

		let hexHash = md5(salt).substring(0, 6);
		if (promptSvc.confirmEx(null, "OTP Generator", "Your password is: '" + hexHash + "'. Do you want to copy it?", promptSvc.STD_YES_NO_BUTTONS, null, null, null, null, {}) == 0) {
			cb.set(hexHash);
		}
	}
});

var widget = widgets.Widget({
  id: "motp-button",
  label: "Generate OTP",
  contentURL: data.url("key.png"),
  panel: motpPanel
});
