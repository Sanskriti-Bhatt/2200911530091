const axios = require("axios");

async function Log(stack, level, pkg, message) {
  const logData = {
    stack: stack,      
    level: level,      //
    package: pkg,      // 
    message: message,  
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post("https://20.244.56.144/evaluation-service/logs", logData);
    console.log("Log sent:", logData);
  } catch (err) {
    console.error("Failed to send log:", err.message);
  }
}

module.exports = { Log };
