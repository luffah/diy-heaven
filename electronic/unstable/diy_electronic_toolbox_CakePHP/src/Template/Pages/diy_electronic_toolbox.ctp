<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         0.10.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
use Cake\Cache\Cache;
use Cake\Core\Configure;
use Cake\Datasource\ConnectionManager;
use Cake\Error\Debugger;
use Cake\Network\Exception\NotFoundException;

$this->layout = false;

if (version_compare(PHP_VERSION, '5.5.9', '<')):
	throw new NotFoundException('Your version of PHP is too low. You need PHP 5.5.9 or higher to use CakePHP.');
endif; 

if (!Configure::read('debug')):
    throw new NotFoundException('"debug" var not found in config file !');
endif;

use App\Model\Entity\JSMenu\JSMenu;

// menu elements settings
// -> menu content : *event_type(item name, sub id, event parameter/component) 
$menu_items_table=array(
		JSMenu::Element('Ajout','resistor_decoder','ResistorDecoder'),
		JSMenu::Menu('Stock','stock',[ JSMenu::Element('Résistances','block_stock_resistor','Stock'),
			JSMenu::Element('Condensateurs','block_stock_capacitor', 'Stock')]),
		JSMenu::Menu('Calcul','calcul',[
			JSMenu::Element('Mini calc','mini_calc', 'MiniCalc'),
			JSMenu::Element('Combinaisons','calc_combi_resistance','ComponentCombiner'),
			JSMenu::Element('Puissance','calcul_puissance','PowerCheck')]),
		JSMenu::Menu('Montages','montages',[
			JSMenu::Element('Div.tension','diviseur_tension','Circuits/TensionDivider')])
		);

function abbrv($text_ref){
	$long_desc=__($text_ref."...");
	$short_desc=__($text_ref);
	return "<span class='longdesc'>".$long_desc.
	"</span><span class='shortdesc' title='".
	str_replace('<br>',' ',$long_desc)."'>".$short_desc."</span>";
}
// menu content declaration 
$menu_items=new JSMenu('menu',$menu_items_table); 
$menu_items->translate('abbrv');

// -> menu css properties
$forbid_selection='	-webkit-touch-callout:none;	-webkit-user-select:none;	-khtml-user-select:none;	-moz-user-select:none;	-ms-user-select:none;	user-select:none;';
$menu=array('menu_id' => 'menu' ,
	'menu_items' => $menu_items,
	'menu_levels'=>[ "menu_lvl0","menu_lvl1","menu_lvl2","menu_lvl3","menu_lvl4"],
	'template_containers_class'=>'app',
	'menu_levels_css_class' => ['cssmenu'],
	'menu_levels_css_styles' => [
		'' => [ 0 => ['text-align:center','width'=>'100%',
				'max-width' => (20*$menu_items->count())."em"],
				1 =>  ['top:0;left:0','margin:0;padding:0',
						"text-transform: uppercase" ]
			],
		' ul ' => [['width'=>'100%']],
		' li ' => [['width'=>(100/ $menu_items->count()).'%'],['width'=>'100%']],
		' li a ' => [[$forbid_selection]]
		],
	'medias' => [
		//media queries assiociated to abbrv function below
		'max-width:480px' => [
			'.longdesc' => [ 'display' => 'none' ],
			'.shortdesc' => [ 'display' => 'inline' ]
			],
		'min-width:480px' => [
			'.longdesc' => [ 'display' => 'inline' ],
			'.shortdesc' => [ 'display' => 'none' ]
			]
		]
)


?>
<!DOCTYPE html>
<html lang="<?= Configure::read('App.defaultLocale')?>" >
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="<?= __('Electronic DIY toolbox') ?>" content=
  "<?= __('Set of tools for electronic waste reuse and DIYers') ?>">
    <?= $this->Html->charset() ?>
  <title><?= __('Electronic DIY toolbox') ?>"</title>
  <?= $this->Html->css('base.css') ?>
  <?= $this->Html->css('cssmenu1.css') ?>
  <?php echo $this->element('JSMenu/css',$menu); ?>
</head>
<body>
<?php echo $this->element('JSMenu/html_menu',$menu); ?>
<?php echo $this->element('JSMenu/html_pages',$menu); ?>
</body>
<?php
 // load event configuration for 'jsmenu'
 echo $this->element('JSMenu/script_events',$menu)."\n";
 // Load interface basic tests and finalize initialization
 echo $this->Html->script('testing/buttons')."\n";
?>
</html>

