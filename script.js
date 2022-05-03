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
    const batteryService = await server.getPrimaryService("cc4a6a80-51e0-11e3-b451-0002a5d5c51b");
    const infoService = await server.getPrimaryService("device_information");

    // Getting the current battery level
    const batteryLevelCharacteristic = await batteryService.getCharacteristic(
      "835abac0-51e4-11e3-a5bd-0002a5d5c51b"
    );
    
    // Convert recieved buffer to number
    const batteryLevel = await batteryLevelCharacteristic.readValue();
    const batteryPercent = await batteryLevel.getUint8(11);  

    for(let i=0; i < 1; i++){
      console.log(i);
      console.log(await batteryLevel.getUint8(i));


    }
    
   // console.log( batteryLevel.array.ge);

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
      Battery Level - ${batteryPercent}%<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
    });
  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});
