const {Cc,Ci,Cm,Cr,Cu} = require("chrome");
const prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

exports.s_pref = function (aKey, aValue) {
	let branch = prefs.getBranch("extensions.motp.");
	if (aValue !== undefined) {
		console.log('set', aKey, aValue);
		branch.setCharPref(aKey, aValue);
	} else {
		console.log('get', aKey);
		if (branch.prefHasUserValue(aKey)) {
			return branch.getCharPref(aKey);
		} else {
			return '';
		}
	}
};