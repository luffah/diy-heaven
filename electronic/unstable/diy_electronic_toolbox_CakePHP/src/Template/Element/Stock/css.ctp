<?php
use App\Utilities\DependencyChecker\CSSdeps;

foreach ( CSSdeps::get_deps('electronic_toolbox/component_view') as $dep_script ){
	echo $this->Html->css($dep_script)."\n";
}
?>