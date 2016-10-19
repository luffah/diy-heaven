function ring_package_view(data){
	var tab_desc=get_tab_desc_in_desc(data);
	var mode=get_standard_mode(tab_desc);
	var span_base=["<span class='","'>&nbsp;&nbsp;</span> "];
	var cei_coloration=get_cei_color_tab(data);
	return "&mdash;" +
		htmlSpan( "&nbsp;" + 
			span_base[0] + cei_coloration[0] + span_base[1] +
			span_base[0] + cei_coloration[1] + span_base[1] +
			(mode>PKG_ID_TO_MODE['PACKAGE_RING']+1?span_base[0] + cei_coloration[2] + span_base[1]:"") +
			span_base[0] + cei_coloration[3] + span_base[1] +
			span_base[0] + cei_coloration[4] +span_base[1] +
			(mode==6?span_base[0]+'cei_color_None'+span_base[1]:"")+
			"&nbsp;" ,
			{ class:"resistor_view "+cei_coloration[5] }) + "&mdash;" ;
}
function electrolytic_capacitor_view(data){
	var value=splitValueNDesc(data)[0];
	return htmlSmall(
			htmlSpan(
				htmlSmall(
				htmlSpan('&nbsp;&nbsp;&nbsp;',
					{class:'eletrolytic_pkg_view_round cei_color_Silver'}
				) + htmlStrong('..')
				+ value + htmlStrong("..")
				)
				,
				{class:'eletrolytic_pkg_view_cylinder cei_color_Black'}
			)
	)	+
	htmlSpan("||",{class:'rotate_item_unvertical'});
}
function plastic_capacitor_view(data){
	var value=splitValueNDesc(data)[0];
	return htmlSpan(value,{class:'plastic_pkg_view cei_color_Blue'});
}
function ceramic_capacitor_view(data){
	var tab_desc=get_tab_desc_in_desc(data);
	return htmlSpan("&nbsp;"+get3DigitNotation(tab_desc)+"&nbsp;",
			{class:'eletrolytic_pkg_view_cylinder ceramic_color_Brown down_small_item'})+
			htmlDiv("|&nbsp;|",{});
}
function bobine_resistor_view(data){
	var tab_desc=get_tab_desc_in_desc(data);
	return "&mdash;" +
			htmlSpan("&nbsp;&nbsp;" +
					formatUnit(get_value_from_tab_desc(tab_desc)) + " " + tab_desc[5]
					+ "&nbsp;&nbsp;", {class : 'power_resistor_view'})
			+ "&mdash;";
}
function undefined_component(data){
	var value=splitValueNDesc(data)[0];
	return "&mdash;" +
			htmlSpan("&nbsp;&nbsp;"+data+"&nbsp;&nbsp;</span>",
					{class:'cei_color_Black'})
				+ "&mdash;";
}
