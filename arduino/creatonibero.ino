 /*COCHE:
1. El coche está en movimiento. Se detiene y se desactivan las ventanas automáticas - luces.
2. Cuando se detiene manda la ubicación de dónde está ubicado el coche. 
3. Espera el msj para que active la alarma. 
4. Se activa la alarma 5 segundos.
 
 */
#include <SoftwareSerial.h>
String textMessage;

//Create software serial object to communicate with SIM800L
SoftwareSerial mySerial(3, 2); //SIM800L Tx & Rx is connected to Arduino #3 & #2

void setup()
{
  //Begin serial communication with Arduino and Arduino IDE (Serial Monitor)
  Serial.begin(9600);
  
  //Begin serial communication with Arduino and SIM800L
  mySerial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(10, INPUT);


  Serial.println("Initializing..."); 
  delay(1000);

  mySerial.println("AT"); //Once the handshake test is successful, it will back to OK
  updateSerial();
   
  }

String n = "windowsON";
int val = 0;
int inPin = 10;
void loop()
{
  //1. El coche está en movimiento. Se detiene y se desactivan las ventanas automáticas - luces.
  val = digitalRead(inPin);

  while(val == LOW){
    //2. Cuando se detiene manda la ubicación de dónde está ubicado el coche. 
    Serial.println("Coche Estacionado");
    if (n == "windowsON"){
      GPSinit();
      String location = getGPS();
      String mobileNumber = "5518656593";
      //SendMessage(mobileNumber, location);
      n = "windowsOFF";
      Serial.println(n);
      break; 
      }
    
    // 3. Espera un msj para que se active la alarma
    if(mySerial.available()>0){
      textMessage = mySerial.readString();
      Serial.print(textMessage);    
      delay(10);
    } 
  
    if(textMessage.indexOf("08912")>=0){ //If you sent "ON" the lights will turn on
      // 4. Activa la alarma por 5 segundos 

      Serial.println("Alarma Activada\r\n");
      textMessage = "";
    
      digitalWrite(8, HIGH);
      delay(5000);
      digitalWrite(8, LOW); 
      break;
      
    }
    break;
    }
    while(val == HIGH){
    Serial.println("Coche en Movimiento.");
    n = "windowsON";
    break;
    }
 
}

String DisplayGSMResponse() {
  if(mySerial.available()) {
    String gsm_input="";
    while(mySerial.available()) {
      gsm_input+= (char)mySerial.read();
    }
    gsm_input.trim();
    delay(1000);
    Serial.println(gsm_input);
    return gsm_input;
  }
}

void GPSinit(){
  mySerial.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");
  updateSerial();
  delay(1000);
  mySerial.println("AT+SAPBR=3,1,\"APN\",\"internet.itelcel.com\"");
  updateSerial();
  delay(1000);
   mySerial.println("AT+SAPBR=3,1,\"USER\",\"webgprs\"");
  updateSerial();
  delay(1000);
  mySerial.println("AT+SAPBR=3,1,\"PWD\",\"gprs\"");
  updateSerial();
  delay(2000);
  mySerial.println("AT+SAPBR=1,1");
  delay(2000);
  updateSerial();
  mySerial.println("AT+SAPBR=2,1");
  delay(2000);
  updateSerial();

  }

String getGPS() {
  Serial.println("GETTING GPS LOCATION");
  String loc = "";
  String location = "";
  mySerial.println("AT+CIPGSMLOC=1,1");
  delay(3000);
  loc = DisplayGSMResponse();
  return loc;
}

void SendMessage(String mobNum,String Location) {
  Serial.println("Sending message..");
  mySerial.println("AT+CMGF=1");
  //Sets the GSM Module in Text Mode
  delay(2000);
  // Delay of 1000 milli seconds or 1 second
  updateSerial();
  // Accepts incoming messages:
  mySerial.println("AT+CNMI=1,2,0,0,0"); 
  delay(2000);
  updateSerial();
  
  mySerial.println("AT+CMGS=\""+mobNum+"\"\r");
  // mobile Number
  delay(4000);
  updateSerial();
  mySerial.print("\""+Location+"\"");
  // The SMS text you want to send
  delay(100);
  mySerial.println((char)26);
  // ASCII code of CTRL+Z
  delay(8000);
  updateSerial();
}

void updateSerial()
{
  delay(500);
  while (Serial.available()) 
  {
    mySerial.write(Serial.read());//Forward what Serial received to Software Serial Port
  }
  while(mySerial.available()) 
  {
    Serial.write(mySerial.read());//Forward what Software Serial received to Serial Port
  }
}

