import { Router } from "express"
import { getRooms, getRoom, addRoom, deleteRoom } from '../controller/room.controller'
import { getThermostatsByRoom, setThermostatsByRoom } from '../controller/heating.controller'
//import { getLightByRoom } from '../controller/light.controller'

const roomRoutes = Router()

roomRoutes.route('/')
  .get(getRooms)
  .post(addRoom);
  
roomRoutes.route('/:roomId')
  .get(getRoom)
  //.put(updateRoom)
  .delete(deleteRoom)
  //.post(addRoom)
  
roomRoutes.route('/:roomId/light')
  //.put(toggleLight)
  
roomRoutes.route('/:roomId/heating')
  .get(getThermostatsByRoom)

roomRoutes.route('/:roomId/heating/:variable/:value')
  .put(setThermostatsByRoom)

export default roomRoutes