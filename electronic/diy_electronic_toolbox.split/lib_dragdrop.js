function dragResitorFromInput(ev,elem_input) {
	if ((elem_input.value!="")&&(isValidStockFormat(elem_input.value))) {
		ev.dataTransfer.setData("text", elem_input.value);
	}
}
function dragResitor(ev) {
	if (my_component.getValue()!="") {
		ev.dataTransfer.setData("text", my_component.getRef());
	}
}
function dropText(ev,funcdo,funccallback) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	funcdo(data);
	if (funccallback!=null) {
		funccallback(data);
	}
}
function dropOnStock(ev) {
	dropText(ev,add_to_stock,shake);
}
function allowDrop(ev) {
	ev.preventDefault();
}
