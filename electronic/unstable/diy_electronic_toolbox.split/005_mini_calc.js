function mini_calc_resistance() {
	var user_input=document.getElementById('calc_in_resistance').value.replace(
	/[abcdfghijloqrstvwxyzABCDEFGHIJKLNOPQRSTUVWXYZ]+[a-zA-Z]*/g,'');
	document.getElementById('calc_out_resistance').innerHTML=formatUnit(
	parseAndCompute(user_input,combine_resistance),true);
}
function mini_calc_capacitance() {
	var user_input=document.getElementById('calc_in_capacitance').value.replace(
	/[abcdfghijloqrstvwxyzABCDEFGHIJKLNOPQRSTUVWXYZ]+[a-zA-Z]*/g,'');
	while (/(e[0-9]+)([^Mkmnup]|$)/.test(user_input)) { // unite standard : picofarad
		user_input=user_input.replace(/(^|[^0-9])([0-9]+e[0-9]+)([^Mkmnup]|$)/g,
		function (a,b,c,d) {
			return b + c + "p" + d;
		});
	}
	document.getElementById('calc_out_capacitance').innerHTML=formatUnit(
	parseAndCompute(user_input,combine_capacitance),true);
}
