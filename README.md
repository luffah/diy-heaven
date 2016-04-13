# diy-heaven
A set of little programs usefull for DIY and for avoiding waste




Contains :


####./electronic/diy_electronic_toolbox.html
A simple resistor and capacitor manager and a tool to compute combinations.

####./electronic/arduino/multimeter.ino
An arduino code to measure resistor, capacitor & diod for these moments you don't have an operationnal multimeter with you...

####./html_tool/hypertool.sh
A simple tool to split and restructure html file. conf/tidy* : configuration files for tidy hypertool.sh: script to restructure html

Note you can use the tool without options (it will seeks into local directory).

Options :
"split"|"-s") split file <name> and write splitted html in <name>.split 
"concat"|"-c") concat html files in <name>.split to <name>.split/complete.html
"insert_deps"|"-i") putback <name>.split/complete.html to <name>.html while inserting every "<(script|style) src=".
"beautify"|"-b") pretty print / process files with tidy 
"-sb") split and beautify
