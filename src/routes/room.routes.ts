import { Router } from "express"
import { getRooms, getRoom, addRoom, deleteRoom } from '../controller/room.controller'

const roomRoutes = Router()

roomRoutes.route('/')
  .get(getRooms)
  .post(addRoom);
  
roomRoutes.route('/:roomId')
  .get(getRoom)
  //.put(updateRoom)
  .delete(deleteRoom)
  //.post(addRoom)
  
/*roomRoutes.route('/:roomId/modules')
  .get(getModules)
  .post(addModule)*/

export default roomRoutes