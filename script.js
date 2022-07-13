const button = document.getElementById("getDetails");
const button2 = document.getElementById("exit");
let x=0;
let pressCount=4;
button2.addEventListener("click", function(){
location.reload();
console.log('stop');
},false);

button.addEventListener("click", async () => {
  try {
    // Request the Bluetooth device through browser
    let options = {
      filters:[
       {namePrefix: '2'}

      ],
      optionalServices: ['battery_service','device_information','cc4a6a80-51e0-11e3-b451-0002a5d5c51b']
    }
    const device = await navigator.bluetooth.requestDevice(options);   //options
   // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceName = device.gatt.device.name;
    const server = await device.gatt.connect();
    const str =deviceName.toString();
    const info =str.split(',');
    // Getting the services we mentioned before through GATT server  
    const battery_service = await server.getPrimaryService("battery_service");
    const pressureService = await server.getPrimaryService("cc4a6a80-51e0-11e3-b451-0002a5d5c51b");
    // Getting the current battery level
    const batteryLevelCharacteristic = await battery_service.getCharacteristic(
        "battery_level"
    )
    const pressureCharacteristic = await pressureService.getCharacteristic(
      "835ab4c0-51e4-11e3-a5bd-0002a5d5c51b"
    );
      // Convert recieved buffer to number
      const batteryLevel = await batteryLevelCharacteristic.readValue();
      const batteryPercent = await batteryLevel.getUint8(0);  
      let pressOld=0;  
      var pressDisplay=0;
    while(x==0){
      console.log(x);
      try {
        const press= await pressureCharacteristic.readValue();
        number0= await press.getUint8(0);
        number1= await press.getUint8(1);
      } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser test
      }
       
    const str = new String(number0.toString(16) + number1.toString(16));
    var pressure = parseInt(str,16);
  
    if(pressure>3000){pressure=3000;}
    if(pressure<400)
    {pressure=pressOld;
     pressDisplay=0;
     pressCount=4;        //reset when arms open
    }
    if((Math.abs(pressOld-pressure))<30)
    { 
    pressCount = pressCount-1;
    if(pressCount==0)                  //store pressure if 4 readings below 30
    {
    pressDisplay=pressure;
    }
    pressOld=pressure;
    var clampForce=(1.3537*pressDisplay-310)*info[2]/100;
    if(clampForce<0){
      clampForce=0;
    }
    
   }
    document.body.style.fontSize="30px";
    const element = document.getElementById('printForce');
    element.style.fontSize = "60px";
    document.getElementById('printForce').innerHTML = 'Force='+clampForce.toFixed(0) + ' lb';
    
    document.getElementById('printBatteryPercent').innerHTML = 'Battery='+batteryPercent+'%';
    document.getElementById('serialNumber').innerHTML = info[0];
    document.getElementById('printPressure').innerHTML = pressure + ' psi' ;
  }
  } catch (err) {
    console.log(err);
    alert("An error occured while fetching pressure");
  }
});
