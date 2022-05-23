const button = document.getElementById("getDetails");
const details = document.getElementById("details");
//const button2 = document.getElementById("stop");

//button2.addEventListener("click", async() =>{

//});
button.addEventListener("click", async () => {
  try {
    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: ["battery_service", "device_information", "cc4a6a80-51e0-11e3-b451-0002a5d5c51b"],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceName = device.gatt.device.name;
    //
  
    const server = await device.gatt.connect();
   // console.log(deviceName.toString());
    const str =deviceName.toString();
   // console.log(str);
    const info =str.split(',');
   // console.log(info[0]);

    

    // Getting the services we mentioned before through GATT server
    
    const battery_service = await server.getPrimaryService("battery_service");
    const pressureService = await server.getPrimaryService("cc4a6a80-51e0-11e3-b451-0002a5d5c51b");
  //  const infoService = await server.getPrimaryService("device_information");

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
      var element = document.getElementById("printBatteryPercent");
      element.style.fontSize = "30px"; 
      document.getElementById('printBatteryPercent').innerHTML = 'Battery='+batteryPercent+'%';
    var element = document.getElementById("printPressure");
        element.style.fontSize = "20px";

    let x=0;
    while(x==0){
    console.log('running2');
    var press= await pressureCharacteristic.readValue(); 
    //console.log(press);
    number0= await press.getUint8(0);
      console.log(number0);
  
    number1= await press.getUint8(1);
    //  console.log(number1);
    const str = new String(number0.toString(16) + number1.toString(16));
    console.log(str);
    const pressure = parseInt(str,16);
    if(pressure>3000){pressure=0;}
    document.body.style.fontSize="60px";
    const clampForce=(1.477*pressure-428)*info[2]/100;
    if(clampForce<200){
      clampForce=0;
    }
    document.getElementById('serialNumber').innerHTML = info[0];
    document.getElementById('printForce').innerHTML = 'Force='+clampForce.toFixed(0) + ' lb';
    document.getElementById('printPressure').innerHTML = pressure + ' psi' ;
   }
    
    
    /* 
   // console.log(pressure);
    details.innerHTML = `
      Device Name - ${deviceName}<br />
      Pressure - ${pressure} PSI<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
    
    }
     
    // Getting device information
    // We will get all characteristics from device_information
    const infoCharacteristics = await infoService.getCharacteristics();
      
    console.log(infoCharacteristics);

    let infoValues = [];

    const promise = new Promise((resolve, reject) => {
      infoCharacteristics.forEach(async (characteristic, index, array) => {
        // Returns a buffer
        const value = await characteristic.readValue();
        console.log(new TextDecoder().decode(value));
        // Convert the buffer to string
        infoValues.push(new TextDecoder().decode(value));
        if (index === array.length - 1) resolve();
      });
    });

    promise.then(() => {
      console.log(infoValues);
      // Display all the information on the screen
      // use innerHTML
      details.innerHTML = `
      Device Name - ${deviceName}<br />
      Pressure - ${pressure} PSI<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
    });*/
     
    

  } catch (err) {
    console.log(err);
    alert("An error occured while fetching pressure");
  }
});
