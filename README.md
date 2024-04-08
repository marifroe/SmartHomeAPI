# SmartHomeAPI

## About

![systemarchitecture](./figures/systemarchitecture.png)

- [ioBroker Simple API adapter](https://github.com/ioBroker/ioBroker.simple-api)

## Functionality

### General
- turn all off (e.g. when leaving apartment)

### Room Management
- **Get Rooms** <br /> `GET: localhost:3000/rooms`
- **Add Room** <br /> `POST: localhost:3000/rooms`
  ```
  body: {
    "name": "Cinema",
    "heating": [],
    "lighting": [],
    "others": []
  }
  ``` 
- add thermostat
- add light

### Lighting
- **Turn on/off** <br /> `PUT: localhost:3000/light/:lightId/toggle?prettyPrint`
- **Dim** <br /> `PUT: localhost:3000/light/:lightId/:dimVal?prettyPrint`
- color temperature
- color hue

### Heating
- **Get Target Temp** <br /> `GET: localhost:3000/heating/:deviceId/tsoll` 
- **Set Target Temp (individually)** <br /> `PUT: localhost:3000/heating/:deviceId/tsoll/:targettemp`
- **Set Target Temp (multiple)** <br /> `PUT: localhost:3000/rooms/:roomId/heating/tsoll/:targettemp`
- open window mode (turn heating off)
- vacation mode
- schedule

### Socket
- turn on/off
- schedule

### Watering System
- turn on/off (main valve)
- turn on/off (individual valves)
- display water level
- turn auto watering on/off
- warning valve open

### Window sensor
- display window state
- reminder/timer

### NFC
- scan NFC tag to open controller app with room's view
- setup NFC tag / assign room by ID

## Setup

1. Create project folder
2. Inside folder run 'npm init -y'
3. Run 'npm install express --save' and 'npm i @types/express --save'
4. Run 'npm i -D nodemon' (nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected. - https://www.npmjs.com/package/nodemon)
4. Inside package.json add '"start": "node index.js",' to "srcipts"

### Setup TypeScript

1. Run 'npm i -D typescript ts-node' (-D flag short for --save-dev)
2. Inside package.json add '"tsc": "tsc"' to "scripts"
3. Run 'npm run tsc -- --init'

### Helpful Resources
* https://dev.to/sulistef/how-to-set-up-routing-in-an-expressjs-project-using-typescript-51ib
* https://dev.to/sulistef/how-to-set-up-a-nodejs-backend-using-expressjs-and-typescript-1655
* https://www.youtube.com/watch?v=aUMGAFE5pPM
