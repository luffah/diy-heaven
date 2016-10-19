//%devonly Requirements & JSLint directives
//%Require lib/lib_unitconv.js
/*global parseUnit*/
//%Require lib/lib_unittest.js
/*global testFunction,equal,LIB_UNITTEST_LOADED*/
//%Requirements done
//%end JSLint directives

function getValResistancesEnSerie(a,b) {
	return parseFloat(parseFloat(a)+parseFloat(b));
}
function getValResistancesEnParallel(a,b) {
	var v_a=parseFloat(a);
	var v_b=parseFloat(b);
	var res;
	if (v_a===v_b) {
		res=(v_a/2);
	} else {
		res=((v_a*v_b)/(v_a+v_b));
	}
	return parseFloat(res);
}
function getValCondensateursEnParallel(a,b) {
	return getValResistancesEnSerie(a,b);
}
function getValCondensateursEnSerie(a,b) {
	return getValResistancesEnParallel(a,b);
}

var combine_resistance={
	'+':getValResistancesEnSerie,
	'//':getValResistancesEnParallel,
	'-':function (a,b){return a-b;},
	'*':function (a,b){return a*b;},
	'/':function (a,b){return a/b;}
};
var combine_capacitance={
	'+':getValCondensateursEnSerie,
	'//':getValCondensateursEnParallel,
	'-':function (a,b){return a-b;},
	'*':function (a,b){return a*b;},
	'/':function (a,b){return a/b;}
};

function parseAndCompute(formule,funcset) {
	/* // -> funcpar;  + -> funcadd */
	//enleve les espace inutiles
	
	var res=formule.replace('µ','u').replace(/\([\s]*([0-9.]+[Mmknup]?[0-9]*(e[-]?[1-9][0-9]?)?[Mmknup]?)[\s]*\)/,function(x,y) {return y;});
	if (! (/(\/\/|\+|-|\*|\/)/.test(res)) ) {
		//si pas d'operateur binaire
		res=parseUnit(res);
	} else { // sinon
		var func_subst=function(a,b,c,d,e,f,g,h,i,j) {
				return funcset[e](parseUnit(c),parseUnit(f));
			};
		while ((/(^|\()[\s]*([0-9.]+[Mmknup]?[0-9]*(e[-]?[1-9][0-9]?)?[Mmknup]?)[\s]*(\/\/|\+|-|\*|\/)[\s]*([0-9.]+[Mmknup]?[0-9]*(e[-]?[1-9][0-9]?)?[Mmknup]?)[\s]*(\)|$)/.test(res))) {
		res=res.replace(/(^|\()[\s]*([0-9.]+[Mmknup]?[0-9]*(e[-]?[1-9][0-9]?)?[Mmknup]?)[\s]*(\/\/|\+|-|\*|\/)[\s]*([0-9.]+[Mmknup]?[0-9]*(e[-]?[1-9][0-9]?)?[Mmknup]?)[\s]*(\)|$)/g,func_subst);
		}
	}
	return res;
}

//%devonly unit_test
if(LIB_UNITTEST_LOADED){
	var err=new Error("lib_physics");
	testFunction(getValCondensateursEnParallel,[0.01,0.01],0.02,equal,"",err);
	testFunction(getValCondensateursEnSerie,[0.01,0.01],0.005,equal,"",err);
	testFunction(getValResistancesEnParallel,[100,100],50,equal,"",err);
	testFunction(getValResistancesEnSerie,[100,100],200,equal,"",err);
}
//%end
