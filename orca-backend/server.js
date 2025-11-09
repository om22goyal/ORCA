const { SerialPort, ReadlineParser } = require('serialport'); //allows us to read until a newline


const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

// Adjust port path based on windows/linux
const arduinoPortPath = '/dev/ttyUSB0'; 

// Create the SerialPort object
const arduinoPort = new SerialPort({
  path: arduinoPortPath,
  baudRate: 9600,
});

// Create a parser to read full lines 
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Listen for full data lines from Arduino
parser.on('data', (data) => {
  console.log('Arduino says:', data);
});

// Endpoint to test server status
app.get('/', (req, res) => {
  res.send('Node.js server is running...');
});

// Endpoint to send commands to Arduino
app.get('/send-command/:cmd', (req, res) => {
  const command = req.params.cmd;
  arduinoPort.write(command, (err) => {
    if (err) {
      console.error('Error writing to Arduino:', err);
      return res.status(500).send('Error writing to Arduino');
    }
    console.log(`Command "${command}" sent to Arduino.`);
    res.send(`Command "${command}" sent to Arduino.`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
