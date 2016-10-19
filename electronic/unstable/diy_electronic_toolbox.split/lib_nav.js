function switchApp(elem_id) {
	if (last_shown!=elem_id) {
		if (last_shown!='') {
			setDisplay(last_shown,'none');
			removeClass('nav_'+last_shown,'active');
		}
		setDisplay(elem_id,'inline-block');
		addClass('nav_'+elem_id,'active');
		last_shown=elem_id;
	}
}
