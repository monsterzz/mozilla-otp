var $ = function (id) {
	return document.getElementById(id);
}

$('generate').onclick = function () {
	let secret = $('secret').value;
	let pin = $('pin').value;

	self.postMessage({
		secret: secret,
		pin: pin
	});

	$('pin').value = '';
};

self.port.on('init-secret', function (data) {
	$('secret').value = data;
});