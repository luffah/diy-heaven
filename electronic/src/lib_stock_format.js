function isValidStockFormat(data) {
	return (/^[0-9.]+([kmMnup][0-9]*)?(\[[a-z0-9.,]*\])?$/i).test(data);
}
function formatToValidStockFormat(data) {
	return data.replace(/(^|$)/g,' ').replace(/ [^0-9 ]+[^ ]* /,' ');
}
function remove_operators(data) {
	return data.replace(/(\(|\)|\+|\/\/)+/g," ").replace(/(\s)+/g," ").replace(/(^\s|\s$)/g,"");
}
function reformat_stock(v_stock) {
	var stock_parse_tab=formatToValidStockFormat(secureText(remove_operators(v_stock))).split(" ");
	var v_stock_hash={
	};
	var i;
	var k;
	var qte;
	for (i=0; (i <stock_parse_tab.length); i++) {
		k=stock_parse_tab[i];
		if (k.search('{')>0) {
			qte=parseInt(k.replace(/(.*\{)/,'').replace(/(\})/,''));
			k=k.replace(/(\{.*)/,'');
		} else {
			qte=1;
		}
		if (k in v_stock_hash) {
			v_stock_hash[k]=v_stock_hash[k]+qte;
		} else {
			v_stock_hash[k]=qte;
		}
	}
	v_stock="";
	delete v_stock_hash[''];
	for (k in v_stock_hash) {
		v_stock=v_stock.concat(correctValueFromDesc(k),"{",v_stock_hash[k],"} ");
	}
	return v_stock.replace(/(^\s|\s$)/g,"");
}
