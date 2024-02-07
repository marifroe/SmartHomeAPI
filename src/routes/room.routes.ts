import { Router } from "express";
import { getRooms, getRoom, updateRoom, getModules, addModule } from "../controller/room.controller";

const roomRoutes = Router();

roomRoutes.route('/')
  .get(getRooms)
//.post(createRoom);
  
roomRoutes.route('/:roomId')
  .get(getRoom)
  .put(updateRoom);
//.delete(deletePatient);
  
roomRoutes.route('/:roomId/modules')
  .get(getModules)
  .post(addModule);

export default roomRoutes;