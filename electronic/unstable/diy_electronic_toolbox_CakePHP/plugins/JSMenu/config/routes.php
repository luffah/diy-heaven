<?php
use Cake\Routing\Router;

Router::plugin(
    'JSMenu',
    ['path' => '/j-s-menu'],
    function ($routes) {
        $routes->fallbacks('DashedRoute');
    }
);
