//
function reverseDict(dict) {
	var res={
	};
	for (var k in dict) {
		res[dict[k]]=k;
	}
	return res;
}
function hashToString(h){
	var h_txt='{';
	for (var k in h){
		h_txt=h_txt+k+':'+h[k].toString()+',';
	}
	return h_txt.replace(/,$/,'')+'}';
}
