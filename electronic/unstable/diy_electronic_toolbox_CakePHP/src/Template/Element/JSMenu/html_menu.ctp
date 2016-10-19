<?php
/* Client menu element (designed to act on the page offline) 
 * HTML part 
 * 
 * Produce an HTML structure similar to :
 * <nav id='menu'>
 * 	<div class=' menu_lvl0'>
 * 		<ul>
 * 			<li id='menu_FUNC1'><a href='#'>FUNC1 USER FRIENDLY NAME</a></li>
 * 			<li id='menu_MENU' ><a href='#'>TITLE SUB MENU</a>
 * 				<ul class=' menu_lvl1'>
 * 					<li id='menu_FUNC2'><a href='#'>FUNC2..NAME</a></li>
 * 				</ul>
 * 			</li>
 * 		</ul>
 * 	</div>
 * </nav>
 * 
 * How to call this file ?
 *  
 * <?php echo $this->element('jsmenu',$menu); ?>
 * 
 * with $menu=array(
 *  // to identify menu with id='menu'
 *	'menu_items' => new JSMenu('menu',JSMenu.Element(...)),
 *	'menu_levels'=> array( 0 => "menu_lvl0", 1=> "menu_lvl1" ...),
 *	'menu_levels_css_class' => array(0 => 'rootLevelMenuClass',...),
 * 	'menu_levels_css_styles' => array(//this part is specific to jsmenu_css.ctp),
 *	'medias' => [//this part is specific to jsmenu_css.ctp]
 *	)
 */
(!isset($menu_levels_css_class)) && $menu_levels_css_class = array(); 
	
function get_default_val($array,$key,$def_val){
	if (isset($array[$key])){
		$ret=$array[$key];
	} else {
		$ret=$def_val;
	}
	return $ret;
}
function make_menu_items($menu,$menu_levels,$level,$menu_levels_css_class,$indent){
	$ret='';
	if ( $menu->is_menu() ) { 
		$ret.=$indent."<ul class='";
		$ret.=get_default_val($menu_levels_css_class,$level,"");
		$ret.=" ".$menu_levels[$level]."'>\n";
		foreach ($menu->get_content() as $menu_item) {
			$ret.=$indent."  "."<li id='".$menu_item->get_item_id()."'>";
			$ret.="<a draggable='false'href='#'>";
			$ret.=$menu_item->get_title();
			$ret.="</a>".make_menu_items(
				$menu_item,
				$menu_levels,
				$level+1,
				$menu_levels_css_class,
				$indent."  ");
			$ret.="</li>\n";
		}
		$ret.=$indent."</ul>\n";
	} 
	return $ret;
}
if ( $menu_items->is_menu() ){
	echo "<nav id='".$menu_items->get_item_id()."'>";
	if (isset($menu_title)){echo $menu_title;}
	echo "<div ";
	echo "class='".get_default_val($menu_levels_css_class,0,"")." ".$menu_levels[0]."'";
	echo ">\n<ul>\n";
	$indent="  ";
	foreach ($menu_items->get_content() as $menu_item) {
		// text_ref id
		echo $indent."<li ";
		echo "id='".$menu_item->get_item_id()."'";
		echo "><a draggable='false' href='#'>".$menu_item->get_title()."</a>\n";
		echo make_menu_items($menu_item,$menu_levels,1,$menu_levels_css_class,$indent); 
		echo "</li>\n";
	}
	 echo "</ul>\n</div></nav>"; 
}

?>
