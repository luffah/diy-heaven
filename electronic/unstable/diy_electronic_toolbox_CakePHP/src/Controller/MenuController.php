<?
//~ Sources StackOverflow : OpenSorceress 
class MenusController extends AppController {
var $name = 'Menus';

function index() {
    if (isset($this->params['requested']) && $this->params['requested'] == true) {
        $menus = $this->Menu->find('all');
        return $menus;
    } else {
        $this->set('Menus', $this->Menu->find('all'));
    }
}

function add() {
    if (!empty($this->data)) {
        if ($this->Menu->save($this->data)) {
            $this->Session->setFlash(__('The menu item has been saved', true));
        }
    }
}

    // Build out additional CRUD functionality, 
    // for example edit / view / delete, as desired.

}
