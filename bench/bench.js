module.exports = function (label, repetitions, func) {
	var i = repetitions,
		elapsed,
		start = new Date();
	
	while (i--) {
		func();
	}
	
	elapsed = new Date() - start;
	
	console.log(label,
		"\n  total:", elapsed / 1000 + "s",
		"\n   mean:", (elapsed / repetitions) / 1000 + "s");
};
