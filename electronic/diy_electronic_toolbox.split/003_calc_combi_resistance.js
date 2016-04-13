<!-- functions in gui -->
function start_calcul_combinaisons() {
	setTimeout(function() {
		document.getElementById('button_chercher').className='button_hidden';
		document.getElementById('button_chercher_loading').innerHTML='Recherche en cours...';
		document.getElementById('button_chercher_loading').className='button_waiting';
	},0);
	setTimeout(function() {
		trouver_solutions();
		setTimeout(function() {
			document.getElementById('button_chercher').className='';
			document.getElementById('button_chercher_loading').className='button_hidden';
		},100);
	},100);
}
function trouver_solutions() {
	var v_resistance=parseInt(htElem('resistance').value);
	var v_ecart_type=parseFloat(htElem('ecart').value)/100;
	var v_ecart=v_ecart_type*v_resistance;
	var v_max=v_resistance+v_ecart;
	var v_min=v_resistance-v_ecart;
	var max_qte=parseInt(htElem('nbresistances').value);
	// reinitialization of the output
	var i;
	reformat_input_stock();// include quantification between { }
	for (i=1; i<(3+1);i++) {
		document.getElementById('grp_resistance'+i).value="";
		document.getElementById('grp_resistance_val'+i).innerHTML="";
		document.getElementById('prendre_grp'+i+'_btn').className="button_hidden";
	}
	// search the nearests
	var stock=new Stock();
	stock.populateFromTxt(document.getElementById('my_stock_resistor').value,true);
	var computed_stock=stock.getComputableSet();
	// build combinations
	var liste_combinaisons=[
		{symbole:'+', combinaison:getValResistancesEnSerie,
			limit:function(f,v){
				return (v < (v_resistance * 2)) && (f.qte<=max_qte);
				}
		},
		{symbole:'//', combinaison:getValResistancesEnParallel,
			limit:function(f,v){
				return (v < v_max) && (v > v_resistance/4)
				&& (f.qte<=max_qte);
				}
		},
		{symbole:'+', combinaison:getValResistancesEnSerie,
			limit:function(f,v){
				return (v < v_max) && (v>v_min) && (f.qte<=max_qte);
				}
		}
		];
	computed_stock.populateCombine(stock,liste_combinaisons);
	var v_solution=computed_stock.searchGroup(v_resistance,v_ecart);
	//~ console.log(v_solution);
	// displaying results
	for (i=0; i<((v_solution.length<3)?v_solution.length:3);i++) {
		document.getElementById('prendre_grp'+(i+1)+'_btn').className="";
		document.getElementById('grp_resistance'+(i+1)).value=v_solution[i][1];
		document.getElementById('grp_resistance_val'+(i+1)).innerHTML='='.concat(v_solution[i][0],
		' (+/- ',
		Math.round((v_solution[i][2]/v_solution[i][0])*10000)/100,"%)") ;
	}
}
function prendre_grp(n) {
	document.getElementById('my_stock_resistor_pris').value=document.getElementById('my_stock_resistor_pris').value.concat(" "
	,popElemFromInputStock(document.getElementById('grp_resistance'+n).value,'my_stock_resistor')
	).replace(')(',') (');
	
	//~ document.getElementById('grp_resistance'+n).value="";
	//~ document.getElementById('grp_resistance_val'+n).innerHTML="";
	for (var i=1; i<=3; i++){
		document.getElementById('prendre_grp'+i+'_btn').className="button_hidden";
	}
	makeViewFromFormattedTakenStock('taken_stock_view_resistor','my_stock_resistor_pris',combine_resistance);
}
