//%devonly Requirements & JSLint directives
//%Require lib/lib_js.js
//%Require lib/lib_calc.js
/*global reverseDict*/
//%Requirements done
//%end

var PKG_ID_TO_CHAR={
	'PACKAGE_RING':'r',
	'PACKAGE_BOBINE':'b',
	'PACKAGE_CMS':'s',
	'PACKAGE_CERAMIC':'c',
	'PACKAGE_ELECTROLYTIC':'e',
	'PACKAGE_PLASTIC':'p'
};
var PKG_CHAR_TO_ID=reverseDict(PKG_ID_TO_CHAR);

//mode values
var PKG_ID_TO_MODE={
	'PACKAGE_RING':10,//>=
	'PACKAGE_BOBINE':1,
	'PACKAGE_CMS':2,
	'PACKAGE_CERAMIC':3,
	'PACKAGE_ELECTROLYTIC':4,
	'PACKAGE_PLASTIC':5
};
var PKG_MODE_TO_ID=reverseDict(PKG_ID_TO_MODE);

var PKG_ID_TO_TYPE_DEF={
	'PACKAGE_RING':'RESISTOR',
	'PACKAGE_BOBINE':'RESISTOR',
	'PACKAGE_CMS':'RESISTOR',
	'PACKAGE_CERAMIC':'CAPACITOR',
	'PACKAGE_ELECTROLYTIC':'CAPACITOR',
	'PACKAGE_PLASTIC':'CAPACITOR'
};
// body colors for RING resistor      
var PKG_COLOR_ID_TO_CHAR={
	'RESISTOR_CARBON':'C',
	'RESISTOR_METAL_BLUE':'B',
	'RESISTOR_METAL_GREEN':'V',
	'RESISTOR_METAL_RED':'R',
	'CAPACITOR_PINK':'P',
	'CAPACITOR_GREEN':'G'
};
var PKG_COLOR_CHAR_TO_ID=reverseDict(PKG_COLOR_ID_TO_CHAR);
// RESISTOR with rings mode=number of rings
//  norme CEI 60757 pour les codes valeurs
var color_tab_val={"":"cei_color_None",
	0:"cei_color_Black",
	1:"cei_color_Brown",
	4:"cei_color_Yellow",
	7:"cei_color_Violet",
	2:"cei_color_Red",
	5:"cei_color_Green",
	8:"cei_color_Gray",
	3:"cei_color_Orange",
	6:"cei_color_Blue",
	9:"cei_color_White"
};
var color_tab_mult={"":"cei_color_None",
	0.1:"cei_color_Gold",
	0.01:"cei_color_Silver",
	1:"cei_color_Black",
	10:"cei_color_Brown",
	100:"cei_color_Red",
	1000:"cei_color_Orange",
	10000:"cei_color_Yellow",
	100000:"cei_color_Green",
	1000000:"cei_color_Blue",
	10000000:"cei_color_Violet"
};
var color_tab_tolerance={"":"cei_color_None",
	0.20:"cei_color_Transparent",
	0.10:"cei_color_Silver",
	0.05:"cei_color_Gold",
	0.01:"cei_color_Brown",
	0.02:"cei_color_Red",
	0.005:"cei_color_Green",
	0.0025:"cei_color_Blue",
	0.001:"cei_color_Violet"
};
var color_tab_corps={"":"cei_color_None",
	'RESISTOR_CARBON':"cei_color_Beige",
	'RESISTOR_METAL_BLUE':"cei_color_Cyan",
	'RESISTOR_METAL_GREEN':"cei_color_Green",
	'RESISTOR_METAL_RED':"cei_color_Red",
	'CAPACITOR_PINK':"cei_color_Pink",
	'CAPACITOR_GREEN':"cei_color_CapGreen"
};
var PKG_ID_TO_CONTENTS_MULT={
	'PACKAGE_RING':{
	0.1:'0.1',
	0.01:'0.01',
	1:'1',
	10:'10',
	100:'100',
	1000:"1k",
	10000:"10k",
	100000:"100k",
	1000000:"1M",
	10000000:"10M"
	},
	'PACKAGE_CERAMIC':{
	0.1:-2,
	0.01:-1,
	1:0,
	10:1,
	100:2,
	1000:3,
	10000:4,
	100000:5,
	1000000:6,
	10000000:7
	},
	'PACKAGE_ELECTROLYTIC':{
	0.1:'0.1p',
	0.01:'.01p',
	1:'1p',
	10:'10p',
	100:'100p',
	1000:'1n',
	10000:'10n',
	100000:'100n',
	1000000:'1u',
	10000000:'10u'
	}
};
PKG_ID_TO_CONTENTS_MULT.PACKAGE_BOBINE=PKG_ID_TO_CONTENTS_MULT.PACKAGE_RING;
PKG_ID_TO_CONTENTS_MULT.PACKAGE_CMS=PKG_ID_TO_CONTENTS_MULT.PACKAGE_RING;
PKG_ID_TO_CONTENTS_MULT.PACKAGE_PLASTIC=PKG_ID_TO_CONTENTS_MULT.PACKAGE_ELECTROLYTIC;
