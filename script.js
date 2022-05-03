const button = document.getElementById("getDetails");
const details = document.getElementById("details");

button.addEventListener("click", async () => {
  try {
    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: ["cc4a6a80-51e0-11e3-b451-0002a5d5c51b", "device_information"],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceName = device.gatt.device.name;
    const server = await device.gatt.connect();

    // Getting the services we mentioned before through GATT server
    const pressureService = await server.getPrimaryService("cc4a6a80-51e0-11e3-b451-0002a5d5c51b");
    const infoService = await server.getPrimaryService("device_information");

    // Getting the current battery level
    const pressureCharacteristic = await pressureService.getCharacteristic(
      "835ab4c0-51e4-11e3-a5bd-0002a5d5c51b"
    );
    let x=0;
    while(x==0){
    // Convert recieved buffer to number
    const press = await pressureCharacteristic.readValue();   
    number= await press.getUint8(0);
    hex1 = number.toString(16);
    number= await press.getUint8(1);
    hex2 = number.toString(16);
    const pressure = parseInt((hex1 + hex2), 16);
     
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
    });
     
    }

  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});
