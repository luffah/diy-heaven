<?php
/**
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     luffah
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
namespace App\Model\Entity\JSMenu;

use Cake\ORM\Entity;

/**
 * JSmenu entity class which extends JSMenuItem.
 *
 * Implementing class : 
 *  JSMenuItem 
 * Children : 
 *   JSMenu
 * 
 * Provide concepts of :
 * - Menu(title,array(items)) -> a menu or a submenu
 * - Page(title,page_id,page) -> a page template reference and the id of the div to include it 
 * - Element(title,el_id,el) -> an element template reference and the id of the div to include it
 * - JSFonction(title,id,function) -> a javascript function
 */
 
class JSMenuItem extends Entity {    
	public $type;
	protected $root_id;
	private $content;
	private $id;
	private $title;
	private $memory_content;// a short memory for page creation
	
	function __construct($array,$root_id=null){
		$this->type=$array[0];
		$this->title=$array[1];
		$this->id=$array[2];
		$this->memory_content=array();
		if (is_null($root_id)){
			$this->root_id=$this->id;
		} else {
			$this->root_id=$root_id;
		}
		switch ($this->type){
			case 'menu' :
				$content=$array[3];
				$this->content=Array();
				foreach ($content as $idx => $item){
						$this->content[$idx]=new JSMenuItem($item,$this->root_id);
				}
			break;
			case 'element' :
			case 'layout' :
				$this->content=$array[3];
			break;
		}
	}
	public static function Menu($title,$id,$array){
		return array('menu', $title, $id, $array);
	}
	public static function Layout($title,$id,$page_ref){
		return array('layout', $title, $id,$page_ref);
	}
	public static function Element($title,$id,$page_ref){
		return array('element', $title, $id,$page_ref);
	}
	public static function JSFunction($title,$id,$func){
		return array('jsfunction', $title, $id,$func);
	}
	public function is_menu(){
		return ($this -> type == 'menu');
	}
	public function is_function(){
		return ($this -> type == 'jsfunction');
	}
	public function is_page_template(){
		return ($this -> type == 'element' or $this -> type == 'layout');
	}
	public function get_items(){
		if ( $this -> is_menu() ){
			return $this->content;
		}
	}
	public function get_content(){
		return $this->content;
	}
	public function set_memory($id,$content){
		$this->memory_content[$id]=$content;
	}
	public function get_memory($id){
		return $this->memory_content[$id];
	}
	public function unset_memory($id){
		unset($this->memory_content[$id]);
	}
	public function clear_memory(){
		foreach ($this->memory_content as $id => $content ) {
			unset($this->memory_content[$id]);
		}
	}
	public function get_item_id(){
		if ($this->root_id == $this->id){
			return $this->id;
		} else {
			return $this->root_id.'_'.$this->id;
		}
	}
	public function get_id(){
		return $this->id;
	}
	public function get_title(){
		return $this->title;
	}
	public function translate($tr_func){
		$this -> title = $tr_func($this -> title) ;
		if ( $this -> is_menu() ){
			foreach ($this->content as  $idx => $item){
				$item->translate($tr_func);
			}
		}
	}
	public function _echo($indent=""){
		echo $indent.$this -> title;
		if ( $this -> is_menu() ){
			echo "\n";
			foreach ($this->content as $idx => $item){
				$item->_echo($indent."->");
			}
		} else {
			echo "(".$this->id.",".$this->content.")\n";
		}
	}
	public function count(){
		if ( $this->is_menu() ){
			return count($this -> content);
		} else {
			return 1;
		}
	}
	function getPageTemplateItems(){
		$ret=array();
		if ( $this->is_menu() ){
			foreach ($this->get_content() as $menu_item) {
				$ret=array_merge($ret,$menu_item->getPageTemplateItems());
			}
		} elseif ( $this->is_page_template() ) {
			array_push($ret,$this);
		}
		return $ret;
	}
	public function toArray(){
		$ret=[$this->type,$this->title,$this->id];
		if ( $this -> is_menu() ){
			$ret[3]=array();
			foreach ($this->content as $idx => $item){
				$ret[3][$idx]=$item->toArray();
			}
		} else {
			$ret[3]=$this->content;
		}
		return $ret;
	}
	// this function help to establish the link between menu items and elements it call
	function gen_action_summary(){
		$ret=array('menu'=>array(),'jsfunction'=>array(),'page'=>array());
		if ($this->is_menu()){
			foreach ($this->get_content() as $idx => $item) {;
				$ret = array_merge_recursive($ret,$item->gen_action_summary());
				if ($item->is_menu()){
					$ret['menu'][$item->get_item_id()]=true;
				} elseif ($item->is_function()){
					$ret['jsfunction'][$item->get_item_id()]=$item->get_content();
				} elseif ($item->is_page_template()){
					$ret['page'][$item->get_item_id()]=$item->get_id();
				}
			}
		}
		return $ret;
	}
}
?>
