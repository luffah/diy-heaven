var fs = require('fs');

// see 9xx_load_scripts.html
  eval(fs.readFileSync('lib_html.js').toString());
  eval(fs.readFileSync('lib_js_struct.js').toString());
  eval(fs.readFileSync('lib_unittest.js').toString());
  LIB_UNITTEST_LOADED=true;
  eval(fs.readFileSync('lib_unit.js').toString());
  eval(fs.readFileSync('lib_calc.js').toString());
  eval(fs.readFileSync('lib_anim.js').toString());
  eval(fs.readFileSync('lib_cei_colors.js').toString());
  eval(fs.readFileSync('lib_component_desc.js').toString());
  eval(fs.readFileSync('lib_nav.js').toString());
  eval(fs.readFileSync('lib_stock_format.js').toString());
  eval(fs.readFileSync('lib_stock_view.js').toString());
  eval(fs.readFileSync('lib_stock_combine.js').toString());
  //~ eval(fs.readFileSync('002_resistor_decoder.js').toString()); 
  //~ eval(fs.readFileSync('003_calc_combi_resistance.js').toString()); 
  //~ eval(fs.readFileSync('004_calcul_puissance.js').toString()); 
  //~ eval(fs.readFileSync('005_mini_calc.js').toString()); 
  //~ eval(fs.readFileSync('006_diviseur_tension.js').toString()); 
  //~ eval(fs.readFileSync('700_footer.js').toString());

if(LIB_UNITTEST_LOADED){areUnitTestsOk();}
