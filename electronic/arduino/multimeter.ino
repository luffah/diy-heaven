/** HOW TO USE this program :
  This program shows to the serial monitor the values of components connected to the Arduino UNO board
 Please follow the following steps:
  - setup the monitor at 115200 bauds to match prerequisite of setup()
  - prepare the circuit as described in RESISTANCE, CAPACITANCE, DIOD MEASURE sections below
    /!\ be carreful with short-circuit /!\
  - Check/compile the code
  - Transfer it to the board
  - Open the monitor and enjoy
**/  
/**  ::: RESISTANCE MEASURE ::: test the resistor between ANALOG_PIN_RESISTOR and ground pin
 cause the measure is based on voltage divider, ANALOG_PIN_RESISTOR shall be connected to
 a base resistor with specified value RBASE_RESISTOR  connected to 5v pin

 CONNEXIONS :
    5V --[[RBASE]]-- ANALOG_PIN --[[[Resistor to test]]]-- GND
**/
const int ANALOG_PIN_RESISTOR = 0; // analog pin is A0
const int RBASE_RESISTOR = 619; // Ohms ; you'll probably have to change that

/**  ::: CAPACITANCE MEASURE :::  test the capacitor between OUT_PIN_CAPA and IN_PIN_CAPA
 
 CONNEXIONS :
     IN_PIN_CAPA --[[Capacitor to test]]-- OUT_PIN_CAPA
**/
const int OUT_PIN_CAPA = A5;
const int IN_PIN_CAPA = A3;


/**  ::: DIOD MEASURE :::  test the diod between ANALOG_PIN_DIOD_ANODE and ground through resistance,
 This measure is really approximative, this is the price of a simple circuit.
 You can change the value of the resistor, but it will change bias.
 CONNEXIONS :
     5V --[[1M Ohm]]-- ANALOG_PIN_DIOD_ANODE --[[Diod to test]]-- --[[30k Ohms]]--
**/
const int ANALOG_PIN_DIOD_ANODE= 1;
const int DIOD_MEASURE_BIAS=80;//measure of difference of found value and true value in mV with a BAT42 diod
  


///------------------------------
/** Based on capacitor 'Jonathan Nethercott' trick,
reported on http://www.zem.fr/utiliser-votre-arduino-pour-mesurer-la-capacite-dun-condensateur/
and 'dgetux' resistance meter model 
on http://aujourlejour.eklablog.fr/jour-10-calcul-de-resistance-avec-une-arduino-a23477386

Author of this fork : luffah
Date : 2016, april

For more precise measurement you can look this article :
http://www.skillbank.co.uk/arduino/measure.htm

**/
//Capacitance between IN_PIN_CAPA and Ground
//Stray capacitance value will vary from board to board.
//Calibrate this value using known capacitor.
const float IN_STRAY_CAP_TO_GND = 24.48;
const float IN_CAP_TO_GND  = IN_STRAY_CAP_TO_GND;
//Pullup resistance will vary depending on board.
//Calibrate this with known capacitor.
const float R_PULLUP = 34.8;  //in k ohms
const int MAX_ADC_VALUE = 1023;

void setup()
{
  pinMode(OUT_PIN_CAPA, OUTPUT);
  //digitalWrite(OUT_PIN_CAPA, LOW);  //This is the default state for outputs
  pinMode(IN_PIN_CAPA, OUTPUT);
  //digitalWrite(IN_PIN_CAPA, LOW);

  Serial.begin(115200);
}

void show_resistance(int PIN, long RBASE){
  // Read the input voltage U in millivolts
  long U = analogRead(PIN);
  // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  U = ((U * 5000) / 1023); 
  long R = (U*RBASE)/(5000-U);
  if ( R > 0 ) { 
    Serial.print("Resistance ");
    Serial.print(PIN);
    Serial.print(" value = ");
    Serial.print(R);
    Serial.println(" Ohm");
  }
}

void show_diod(int PIN_ANODE,int BIAS){
  // Read the input voltage U in millivolts
  int U_ANODE = analogRead(PIN_ANODE);
  // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5000mV):
  if (U_ANODE < 1000){
    float voltage = (U_ANODE * (5000 / 1023.0))+BIAS;
    if ( voltage > 0 ) { 
      Serial.print("Diod ");
      Serial.print(PIN_ANODE);
      Serial.print(" ->|- GND");
      Serial.print(" value = ");
      Serial.print(voltage);
      Serial.println(" mV ");
    }
  }
}

void show_capacitor(int INPUT_PIN,int OUTPUT_PIN){
   //Capacitor under test between OUTPUT_PIN and INPUT_PIN
  //Rising high edge on OUT_PIN_CAPA
  pinMode(INPUT_PIN, INPUT);
  digitalWrite(OUTPUT_PIN, HIGH);
  int val = analogRead(INPUT_PIN);
  digitalWrite(OUTPUT_PIN, LOW);

  if (val < 1000)
  {
    //Low value capacitor
    //Clear everything for next measurement
    pinMode(INPUT_PIN, OUTPUT);

    //Calculate and print result
    float capacitance = (float)val * IN_CAP_TO_GND / (float)(MAX_ADC_VALUE - val);
    if (capacitance > 20){
      Serial.print(F("Capacitance Value = "));
      Serial.print(capacitance, 3);
      Serial.print(F(" pF ("));
      Serial.print(val);
      Serial.println(F(") "));
    }
  }
  else
  {
    //Big capacitor - so use RC charging method

    //discharge the capacitor (from low capacitance test)
    pinMode(INPUT_PIN, OUTPUT);
    delay(1);

    //Start charging the capacitor with the internal pullup
    pinMode(OUTPUT_PIN, INPUT_PULLUP);
    unsigned long u1 = micros();
    unsigned long t;
    int digVal;

    //Charge to a fairly arbitrary level mid way between 0 and 5V
    //Best not to use analogRead() here because it's not really quick enough
    do
    {
      digVal = digitalRead(OUTPUT_PIN);
      unsigned long u2 = micros();
      t = u2 > u1 ? u2 - u1 : u1 - u2;
    } 
    while ((digVal < 1) && (t < 400000L));

    pinMode(OUTPUT_PIN, INPUT);  //Stop charging
    //Now we can read the level the capacitor has charged up to
    val = analogRead(OUTPUT_PIN);

    //Discharge capacitor for next measurement
    digitalWrite(INPUT_PIN, HIGH);
    int dischargeTime = (int)(t / 1000L) * 5;
    delay(dischargeTime);    //discharge slowly to start with
    pinMode(OUTPUT_PIN, OUTPUT);  //discharge remainder quickly
    digitalWrite(OUTPUT_PIN, LOW);
    digitalWrite(INPUT_PIN, LOW);

    //Calculate and print result
    float capacitance = -(float)t / R_PULLUP
      / log(1.0 - (float)val / (float)MAX_ADC_VALUE);

    Serial.print(F("Capacitance Value = "));
    if (capacitance > 1000.0)
    {
      Serial.print(capacitance / 1000.0, 2);
      Serial.print(F(" uF"));
    }
    else
    {
      Serial.print(capacitance, 2);
      Serial.print(F(" nF"));
    }

    Serial.print(F(" ("));
    Serial.print(digVal == 1 ? F("Normal") : F("HighVal"));
    Serial.print(F(", t= "));
    Serial.print(t);
    Serial.print(F(" us, ADC= "));
    Serial.print(val);
    Serial.println(F(")"));
  } 
  
}


void loop()
{
  show_resistance(ANALOG_PIN_RESISTOR,RBASE_RESISTOR);
  show_diod(ANALOG_PIN_DIOD_ANODE,DIOD_MEASURE_BIAS);
  show_capacitor(IN_PIN_CAPA,OUT_PIN_CAPA);

  while (millis() % 1000 != 0)
    ;    
}


