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
    const server = await device.gatt.connect();

    // Getting the services we mentioned before through GATT server
    let x=0;
    while(x==0){
    const pressureService = await server.getPrimaryService("cc4a6a80-51e0-11e3-b451-0002a5d5c51b");
  //  const infoService = await server.getPrimaryService("device_information");

    // Getting the current battery level
    const pressureCharacteristic = await pressureService.getCharacteristic(
      "835ab4c0-51e4-11e3-a5bd-0002a5d5c51b"
    );
    console.log('running2');
    const press= await pressureCharacteristic.readValue(); 
     
    number= await press.getUint8(0);
    hex1 = number.toString(16);
    number= await press.getUint8(1);
    hex2 = number.toString(16);
    const pressure = parseInt((hex1 + hex2), 16);
    document.body.style.fontSize="60px";
    const clampForce=1.477*pressure-428;
    document.getElementById('printPressure').innerHTML = 'Pressure=' + pressure + '<br>' +'Clamp Force='+clampForce + ' lb';
    
    }
    // Convert recieved buffer to number
    
     
   // console.log(pressure);
    details.innerHTML = `
      Device Name - ${deviceName}<br />
      Pressure - ${pressure} PSI<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
    /*
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
