const button = document.getElementById("getDetails");
const button2 = document.getElementById("exit");
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0,0, myCanvas.clientWidth,100);

let x=0;
let pressCount=2;
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
     // var pressDisplay=0;  removed pressDisplay
      var clampForce=0;
    while(x==0){
      //console.log(x);
      try {
        const press= await pressureCharacteristic.readValue();
        number0= await press.getUint8(0);
        number1= await press.getUint8(1);
      } catch (error) {
        //console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser test
      }
    
    
    
    
    const str = new String(number0.toString(16) + number1.toString(16));
    var pressure = parseInt(str,16);         //convert to integer
  
    if(pressure>3000){pressure=0;}  //was pressure=3000
    if(pressure<300)
    {pressure=0;           //was pressure=pressOld
     pressDisplay=0;
    // pressCount=2;        //reset when arms open
     clampForce=0;
    }
   // if((Math.abs(pressOld-pressure))<100)
   if(pressure>pressOld)
    { 
   // pressCount = pressCount-1;
   // if(pressCount==0)                  //store pressure if 2 readings below 100
   // {
   // pressDisplay=pressure;         pressDisplay not neede use pressure
    clampForce=(1.3537*pressure-310)*info[2]/100;
    }
    
    
    if(clampForce<0){
      clampForce=0;
    }
    // Check if clampForce is low medium or high
   // if (clampForce >= 1001) {
    //  ctx.fillStyle = "red";
   //   } else if (clampForce >= 301) {
    //  ctx.fillStyle = "yellow";
    //  } 
     //  else {
    //  ctx.fillStyle = "red";
     // } 
     // ctx.fillRect(20,20, 250,100);
  
   //}
   //else
   //{
   // pressCount=2;
   // clampForce=0;
   //}
    pressOld=pressure;
    document.body.style.fontSize="30px";
    const element = document.getElementById('printForce');
    element.style.fontSize = "60px";
    document.getElementById('printForce').innerHTML = 'Force='+clampForce.toFixed(0) + ' lb';
    
    document.getElementById('printBatteryPercent').innerHTML = 'Battery='+batteryPercent+'%';
   // document.getElementById('serialNumber').innerHTML = info[0];
    document.getElementById('printPressure').innerHTML = pressure + ' psi' ;
    
  }
  } catch (err) {
    //console.log(err);
    alert("An error occured while fetching pressure");
  }
});
