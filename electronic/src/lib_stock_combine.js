/*
 * 
 * Important note : this program use the concept of stock, 2 type of stock are used:
 *  	- simple stock represents the reserves
 *  	- computed stock represents all combinations possibles 
 *  Moreover the stock contains the value of the componants represented by the different formula (or set of componants) avaible :
 *      { "formula1" : {"componant1":qte,"componant2":qte}, "formula2" : {"componant3":qte,"componant2":qte} }
 *  So we have set of value associated to a set of set of componants.
 * 
 *  Here the structure of the stock concept.
 *    simple stock = { value1 : { "componant1" : {"componant1":qte}},
 *              	value2 : { "componant2" : {"componant2":qte}},... }
 *    computed stock = { value1 : { "formula1" : {"componant1":qte,"componant2":qte}},
 *              value2 : { "formula2" : {"componant1":qte,... }},"formula3" : {"componant1":qte,... }},... }
 * 
 * name: copyFormula
 * @param a formula e.g. {"componant1":qte,"componant2":qte}
 * @return a copy of the formula
 * 
 */
var ComponentsSet= function(components,nb) {
	
	this.qte=(typeof nb !== 'undefined')?nb:0;
	switch (typeof components){
		case 'undefined': this.components={}; break;
		case 'object': this.components=components; break;
		case 'string': this.components={}; this.components[components]=this.qte; break;
	}
	

	this.get= function(k){
		return this.components[k];
	}
		this.toString= function(){
		return '{ Components:' + hashToString(this.components) + ', #Components:' + this.qte + ' }';
	}
	this.addComponents= function(h){
		for (var v_k in h) {
			if (v_k in this.components) {
				this.components[v_k]=this.components[v_k]+h[v_k];
			} else {
				this.components[v_k]=h[v_k];
			}
			this.qte=this.qte+h[v_k];
		}
	}
	this.containsComponent= function(k){
		return k in this.components;
	}
	this.clone= function() {
		var components={};
		for (var v_k in this.components) {
			components[v_k]=this.components[v_k];
		}
		return new ComponentsSet(components,this.qte);
	}
	this.union= function(b) {
		var res=this.clone();
		res.addComponents(b.components);
		return res;
	}
	this.equal= function(b) {
		if (this.qte!=b.qte) {
			return false;
		}
		for (var v_k in this.components) {
			if ((!v_k in b.components) || (this.components[v_k]!=b.components[v_k])) {
				return false;
			}
		}
		return true;
	}
}
function RecomputeFormula(formula_txt,components_hash,funcset) {
	return parseFloat(parseAndCompute(
	formula_txt.replace(/(^|[ \(\/\+])([0-9.]+([kmMnup][0-9]*)?(\[[a-z0-9.,]*\])?)/ig,
	function(x,y,z) {
		return y.concat(components_hash[z]);
	}),funcset));
}
var FormulaSet= function (){
	this.formulas={};
	this.get= function(f_text) {
		return this.formulas[f_text];
	}
	this.getHash= function() {
		return this.formulas;
	}
	this.toString=function (){
		return '{ Formulas:' + hashToString(this.formulas) + ' }';
	}
	this.hash= function() {
		return this.formulas;
	}
	this.add= function(f_text,k) {
		if (!(f_text in this.formulas)) {
			this.formulas[f_text]=k;
		} else {
			this.formulas[f_text].addComponents(k.components);
		}
	}
	this.populateFromTxt= function(stock_txt){//TODO
		var i;var j;
		var k;
		var formula_txt;
		var formula_stock_txt;
		var formula_parse_tab;
		var stock_parse_tab=stock_txt.replace(
			/\(\s*/g,"(").replace(
			/\s*\)/g,")").replace(
			/\s*\+\s*/g,"+").replace(
			/\s*\/\/\s*/g,"//").split(" ");
		for (i=0; (i < stock_parse_tab.length); i++) {
			formula_txt=stock_parse_tab[i];
			if (formula_txt!=""){
				formula_parse_tab=reformat_stock(formula_txt).split(' ');
				for (j=0; (j < formula_parse_tab.length); j++) {
					k=formula_parse_tab[j];
					qte=parseInt(k.replace(/(.*\{)/,'').replace(/(\})/,''));
					this.add(formula_txt,new ComponentsSet(k.replace(/(\{.*)/,''),qte));
				}
			}
		}
	}
	this.clone= function(a) {
		var res={};
		for (var v_k in a) {
			res[v_k]=a[v_k].clone();
		}
		return new FormulaSet(formulas);
	}
	this.contains= function(a){
		for (var f in this.formulas) {
			if (a.equal(this.formulas[f])) {
				return true;
			}
		}
		return false;
	}
	this.limitTo= function(num) {
		var i=0;
		var nb_solution=[];
		for (var k in this.formulas) {
			nb_solution[i]=[this.formulas[k].qte,k];
			i++;
		}
		if (i>num) {
			nb_solution.sort(function(a,b) {return a[0]-b[0];});
			while (i>num) {
				delete this.formulas[nb_solution.pop()[1]];
				i--;
			}
		}
	}
	this.getMinMaxValues= function (formula_txt,combine_function_set){
		var min_val_component_set={};
		var max_val_component_set={};
		var tol;
		var val;
		var tab_desc;//TODO
		for (var c in this.formulas[formula_txt].components) {
			if (!(c in min_val_component_set)) {
				tol="";
				if (c.indexOf("[")>0) { 
					tab_desc=get_tab_desc_in_desc(c);
					tol=tab_desc[4];
				} 
				val=parseUnit(c);
				if (tol=="") {
					min_val_component_set[c]=val;
					max_val_component_set[c]=val;
				} else {
					min_val_component_set[c]=(val-(parseFloat(tol)*val));
					max_val_component_set[c]=(val+(parseFloat(tol)*val));
				}
			}
		}
		return [RecomputeFormula(formula_txt,min_val_component_set,combine_function_set),
		RecomputeFormula(formula_txt,max_val_component_set,combine_function_set)];
	}
}
var Stock=function(){
	this.qte=0;
	this.sets_of_formulas={};
	this.combine_register={};
	this.getHash= function(k){
		return this.sets_of_formulas[k].getHash();
	}
	this.toString= function(){
		return '{ Stock:' + hashToString(this.sets_of_formulas) + ', #Stock:' + this.qte + ' }';
	}
	this.add= function(v_k,f_text,f){
		if (!(v_k in this.sets_of_formulas)) {
			this.sets_of_formulas[v_k]=new FormulaSet();
		}
		this.sets_of_formulas[v_k].add(f_text,f);
	}
	this.populateFromTxt= function(stock_txt){
		var i;
		var v_nb;
		var v_k;
		var k;
		var qte;
		var stock_parse_tab=stock_txt.split(' ');
		for (i=0; (i < stock_parse_tab.length); i++) {
			k=stock_parse_tab[i];
			qte=parseInt(k.replace(/(.*\{)/,'').replace(/(\})/,''));
			k=k.replace(/(\{.*)/,'');
			this.qte=this.qte+qte;
			v_k=parseUnit(k);
			this.add(v_k,k,new ComponentsSet(k,qte));
		}
	}
	this.containsComponents=function(a) {
		var v;
		for (var k in a.components) {
			v=parseUnit(k);
			if (!(v in this.sets_of_formulas)  ||
				(a.components[k] > this.sets_of_formulas[v].get(k).get(k)) ) {
				return false;
			}
		}
		return true;
	}
	this.getComputableSet= function(){
		var v_k; var k; var i;//values to iterate
		var init_set=new Stock();
		for (v_k in this.sets_of_formulas) {
			if (init_set.qte < 32) {
				i=0;
				for (k in this.sets_of_formulas[v_k].hash()) {
					if (i<3) {// for better perfomance we limit the number of different resistor
						init_set.qte++;
						init_set.add(v_k,k,new ComponentsSet(k,1));
						i++;
					}
				}
			} else { break ; }
		}
		return init_set;
	}
	this.populateCombine=function (orig_stock,list_comb) {
		/* list_com=[{symbole:symb_combi,combinaison:func_combi,limit:func_test_optim},...] */
		var v;
		var symb_combi;var func_combi;var func_test_optim;
		var formula_txt;
		var formula;
		this.qte=orig_stock.qte;
		
		for (var n=0; n < list_comb.length; n++) {
			symb_combi=list_comb[n]['symbole'];
			func_combi=list_comb[n]['combinaison'];
			func_test_optim=list_comb[n]['limit'];
			this.combine_register[symb_combi]=func_combi;
			for (var h in this.sets_of_formulas) {
				for (var k in this.sets_of_formulas[h].hash()) {
					for (var i in this.sets_of_formulas) {
						for (var j in this.sets_of_formulas[i].hash()) {
							formula_txt='('+k+' '+symb_combi+' '+j+')';
							formula=this.sets_of_formulas[h].get(k).union(this.sets_of_formulas[i].get(j));
							//~ if ( !(formula.containsComponent(formula_txt)) ){
								v=roundRelative(func_combi(h,i),3);
								//~ console.log(v);
								if (func_test_optim(formula,v) &&
								(orig_stock.containsComponents(formula)) &&
								( !(v in this.sets_of_formulas) || !(this.sets_of_formulas[v].contains(formula)) )
								) {
									this.add(v,formula_txt,formula);
									this.sets_of_formulas[v].limitTo(3);
								}
							//~ }
						}
					}
				}
			}
		}
	}
	// functions to find bests results of combinations
	this.searchGroup= function(v_value,v_ecart) {
		var res=[];
		var i=0;
		var diff;
		var min_max_val_tab;
		var val;
		var tab_desc;
		var tol;
		for (var k in this.sets_of_formulas) {
			var diff=Math.abs(k - v_value );
			//~ console.log(k,diff,v_ecart);
			if (res.length == 5){ break ;}
			if ( diff <= v_ecart ) {
				for (var formula in this.sets_of_formulas[k].getHash()) {
					//~ console.log(k,stock[k],formula,v_ecart);
					if (formula.indexOf('[')>0) {
						min_max_val_tab=this.sets_of_formulas[k].getMinMaxValues(formula,this.combine_register);
						diff=Math.abs(min_max_val_tab[0] - v_value );
						var diff_max=Math.abs(min_max_val_tab[1] - v_value );
						if(diff<diff_max) {
							diff=diff_max;
						}
					}
					if ( diff <= v_ecart ) { 
						res[i]=[Math.round(k),formula,Math.round(diff)];
						i++;
					}
				}
			}
		}
		//~ console.log(res);
		res.sort(function(a, b) {return a[2]-b[2]})
		return res;
	}
}

if(LIB_UNITTEST_LOADED){
	var values={
		component1ktoStr:'{ Components:{1k:1}, #Components:1 }',
		stock1txt:"1k{1} 1k{1}",
		stock1toStr:'{ Stock:{1000:{ Formulas:{1k:{ Components:{1k:2}, #Components:2 }} }}, #Stock:2 }',
		stock1btoStr:'{ Stock:{1000:{ Formulas:{1k:{ Components:{1k:1}, #Components:1 }} }}, #Stock:1 }',
		stock2txt:"1k{2} 2k[2,,,1k,0.01]{2}",
		stock2ComputedtoStr:'{ Stock:{\
1000:{ Formulas:{1k:{ Components:{1k:1}, #Components:1 }} },\
2000:{ Formulas:{\
2k[2,,,1k,0.01]:{ Components:{2k[2,,,1k,0.01]:1}, #Components:1 },\
(1k + 1k):{ Components:{1k:2}, #Components:2 }\
} },\
3000:{ Formulas:{\
(1k + 2k[2,,,1k,0.01]):{ Components:{1k:1,2k[2,,,1k,0.01]:1}, #Components:2 }\
} },\
4000:{ Formulas:{\
(2k[2,,,1k,0.01] + 2k[2,,,1k,0.01]):{ Components:{2k[2,,,1k,0.01]:2}, #Components:2 }\
} }\
}, #Stock:4 }'
	};
	var prerequis={};
	var prerequis_function={
			formulas: function(mem){
				mem['formula1']=new ComponentsSet({'1k':1},1);
				mem['formula2']=new ComponentsSet({'1k':2},2);
				mem['formula3']=new ComponentsSet({'1k':3},3);
				return true;
			},
			populateStock1: function(mem){
				if (prerequis['formulas']){
					mem['stock']=new Stock();
					mem['stock'].populateFromTxt(values['stock1txt'],true);
					mem['stockb']=mem['stock'].getComputableSet();
					return true;
				} else {
					return false;
				}
			},
			populateStock2: function(mem){
				mem['stock']=new Stock();
				mem['stock'].populateFromTxt(values['stock2txt'],true);
				mem['stockb']=mem['stock'].getComputableSet();
				mem['stockb'].populateCombine(mem['stock'],
				[{  symbole:'+',
					combinaison:getValResistancesEnSerie,
					limit:function (f,v){return f.qte<=2;}
					}]);
				return true;
			},
			searchGroup1: function(mem){
				return prerequis['populateStock2'];
			}		
	};
	function prepare(a,v){
			if (! (a in prerequis) ){
				prerequis[a]=prerequis_function[a](v);
			}
			return prerequis[a];
	}
	function objEqual(a,b){return a.equal(b);}
	function objToString(a){return a.toString();}
	function objContainsComponents(a,b){return a.containsComponents(b);}
	function objSearchGroup(a,b,c){return a.searchGroup(b,c).toString();}
	tests=[
		{
		"Test formula 1a":{prerequis:'formulas',func:objEqual,res:false,
			args:function(v){return [v['formula1'],v['formula2']];}},
		"Test formula 1b":{prerequis:'formulas',func:objEqual,res:true,
			args:function(v){return [v['formula1'].union(v['formula2']),v['formula3']];}},
		"Test formula 1c":{prerequis:'formulas',func:objToString,res:values['component1ktoStr'],
			args:function(v){return [v['formula1']];}}
		},
		{
		"Test populate 1a":{prerequis:'populateStock1',func:objToString,res:values['stock1toStr'],
			args:function(v){return [v['stock']];}},
		"Test containsComponent 1a":{prerequis:'populateStock1',func:objContainsComponents,res:true,
			args:function(v){return [v['stock'],v['formula2']];}},
		"Test containsComponent 1b":{prerequis:'populateStock1',func:objContainsComponents,res:false,
			args:function(v){return [v['stock'],v['formula3']];}},
		"Test populate 1b":{prerequis:'populateStock1',func:objToString,res:values['stock1btoStr'],
			args:function(v){return [v['stockb']];}}
		},
		{
		"Test combine 1a":{prerequis:'populateStock2',func:objToString,res:values['stock2ComputedtoStr'],
			args:function(v){return [v['stockb'],v['formula2']];}},
		"Test search 1a":{prerequis:'searchGroup1',func:objSearchGroup,res:[1000,"1k",0],
			args:function(v){return [v['stockb'],1000,0];}},
		"Test search 1c":{prerequis:'searchGroup1',func:objSearchGroup,res:[1000,"1k",500],
			args:function(v){return [v['stockb'],1500,500];}},
		"Test search 1b":{prerequis:'searchGroup1',func:objSearchGroup,res:[3000,"(1k + 2k[2,,,1k,0.01])",20],
			args:function(v){return [v['stockb'],3000,100];}}
		}
		
	
	];
	var t;
	for (var i=0; i<tests.length;i++){
		for (t in tests[i]){
			if ( prepare(tests[i][t].prerequis,values) ){
				if ((typeof tests[i][t].func=='function') &&
					(typeof tests[i][t].args=='function') &&
					(typeof tests[i][t].res!='undefined')){					
					testFunction(tests[i][t].func,tests[i][t].args(values),
					tests[i][t].res,equal,t,Error("lib_stock_combine"));
				} else {
					console.log("'"+t+"' is not a valid test"); 
				}
			}
		}
	}
}
