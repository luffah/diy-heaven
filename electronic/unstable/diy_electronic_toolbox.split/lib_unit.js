function parseUnit(a) {
	var res;
	var pos_mult=a.search(/(k|M|m|n|u|p)/i);
	if (pos_mult>-1) {
		res=a.charAt(pos_mult);
		res=parseFloat(a.replace(/(k|M|m|n|u|p)( |$)/i,'').replace(/(k|M|m|n|u|p)/i,'.'))*
		(res=='M'?1000000:
		(res=='k'?1000:
		(res=='m'?parseFloat(Math.pow(10,-3)):
		(res=='u'?parseFloat(Math.pow(10,-6)):
		(res=='n'?parseFloat(Math.pow(10,-9)):
		(res=='p'?parseFloat(Math.pow(10,-12)):1))))));
	} else {
		res=parseFloat(a);
	}
	return res;
}
function roundRelative(a,p) {
	var res=a+"";
	var e_num = (Math.round(Math.log(a)/Math.log(10)))-p;//get exp number
	return Math.round(a/Math.pow(10,e_num))/Math.pow(10,-e_num);
}
function formatUnit(a,details) {
	var res=a+"";
	var p=4;//precision
	if (a>-1) {
		if (a>=1000000) {
			res=Math.round(a*Math.pow(10,p))/Math.pow(10,p+6)+'M';
		} else if (a>=1000) {
			res=Math.round(a*Math.pow(10,p))/Math.pow(10,p+3)+'k';
		} else if (a>=1) {
			res=Math.round(a*Math.pow(10,p))/Math.pow(10,p);
		} else if (a>=Math.pow(10,-3)) {
			res=Math.round(a*Math.pow(10,3+p))/Math.pow(10,p)+'m';
		} else if (a>=Math.pow(10,-6)) {
			res=Math.round(a*Math.pow(10,6+p))/Math.pow(10,p)+'&mu;';
		} else if (a>=Math.pow(10,-9)) {
			p=6;
			res=(details? Math.round(a*Math.pow(10,6+p))/Math.pow(10,p)+'&mu;' +
			' ou ' : "")+ Math.round(a*Math.pow(10,9+p))/Math.pow(10,p)+'n';	   
		} else {
			p=8;
			res=Math.round(a*Math.pow(10,6+p))/Math.pow(10,p)+'&mu;';
			res=res + ' ou ' + Math.round(a*Math.pow(10,9+p))/Math.pow(10,p)+'n';	   
			res=(details?Math.round(a*Math.pow(10,6+p))/Math.pow(10,p)+'&mu;' +
			 ' ou' + Math.round(a*Math.pow(10,9+p))/Math.pow(10,p)+ 'n' +
			 ' ou ':"")+ Math.round(a*Math.pow(10,12+p))/Math.pow(10,p)+'p' ;
				   
		}
	}
	return res;
}
if(LIB_UNITTEST_LOADED){
	testFunction(roundRelative,[0.00123456789,3],0.001235,equal,"",Error("lib_unit"));
	testFunction(roundRelative,[0.0123456789,3],0.01235,equal,"",Error("lib_unit"));
	testFunction(roundRelative,[1.23456789,3],1.235,equal,"",Error("lib_unit"));
	testFunction(parseUnit,['10nf'],'1e-8',equal,"",Error("lib_unit"));
	testFunction(formatUnit,['1e-8'],'10n',equal,"",Error("lib_unit"));
	testFunction(formatUnit,['1e-8',true],'0.01&mu; ou 10n',equal,"",Error("lib_unit"));
}

