import { Router } from "express"
import { getRooms, getRoom, addRoom, updateRoom, deleteRoom, getModules, addModule } from "../controller/room.controller"

const roomRoutes = Router()

roomRoutes.route('/')
  .get(getRooms)
//.post(createRoom);
  
roomRoutes.route('/:roomId')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom)
  .post(addRoom)
  
roomRoutes.route('/:roomId/modules')
  .get(getModules)
  .post(addModule)

export default roomRoutes