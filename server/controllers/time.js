let interval;
let time;

module.exports = (client, sendResponse) => {
  if (interval) {
    client.emit("StartTime", time ?? 0);
  }

  client.emit("SetTime", time ?? 0);

  client.on("StartTime", () => {
    if (interval) {
      clearInterval(interval);
    }
    if (time === undefined) {
      time = 0;
    }
    sendResponse("StartTime", "", client);
    interval = setInterval(() => {
      const response = time++;
      sendResponse("SetTime", response, client);
    }, 1000);
  });

  client.on("StopTime", () => {
    console.log("Stopped");
    if (interval) {
      interval = clearInterval(interval);
    }
    sendResponse("StopTime", "", client);
  });

  client.on("ResetTime", () => {
    console.log("Reset");
    if (interval) {
      clearInterval(interval);
    }
    time = 0;
    sendResponse("ResetTime", "", client);
  });
};
