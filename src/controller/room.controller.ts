import { Request, Response } from "express";
import { Room } from "../interface/room";
import { HeatingModule, LightingModule, Module, MusicModule, isModule, isHeatingModule, isMusicModule, isLightingModule } from "../interface/module";
import RoomsJson from '../data/rooms.json'
import { HttpStatus } from "../enum/httpStatus.enum";
import { HttpResponse } from "../domain/response";
import fs from 'fs';
import { ModuleType } from "../enum/moduleType.enum";

const PATH = "./src/data/rooms.json";

/**
 * Get all rooms
 * @param req 
 * @param res 
 * @returns 
 */
//export const getRooms = async (req: Request, res: Response): Promise<Response<Room[]>> => {
export const getRooms = async (req: Request, res: Response) => {

  //console.info(`[${new Date().toLocaleString()}]: Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  let rooms: Room[];

  try {
    const data = fs.readFile(PATH, "utf8", (error, data) => {
      if (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
      }

      try {
        rooms = JSON.parse(data);
        console.log(rooms);
        return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${rooms.length} rooms`, rooms));
      } catch (error) {
        console.log("Error parsing json string: ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
  }
  
  /*if (data) {
    let rooms: Room[] = JSON.parse(data);
  }
   
  return rooms
    ? res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${rooms.length} rooms`, rooms))
    : res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'))*/
};

/**
 * Get specific room by Id
 * @param req 
 * @param res 
 * @returns 
 */
//export const getRoom = async (req: Request, res: Response): Promise<Response<Room>> => {
export const getRoom = async (req: Request, res: Response) => {

  const id: number = Number(req.params.roomId);
  let rooms: Room[];
  let room: Room | undefined; 

  try {

    const data = fs.readFile(PATH, "utf8", (error, data) => {
      if (error) {
          console.log(error);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
      }

      try {
        rooms = JSON.parse(data);
        room = rooms.find(room => room.id == id);
      } catch (error) {
        console.log("Error parsing json string: ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
      }
      return room ? res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found room with ID ${id}`, room)) : res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, `Couldn't find room with ID ${id}`));
    });
    
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
  }
};

/** 
 * Update an existing room.
*/

export const updateRoom = async (req: Request, res: Response) => {
  
  // keep id
  //let roomUpdates: Room = {id: 0, name: "", modules: []};
  let roomUpdates: Room = {
    id: Number(req.params.roomId),
    name: req.body.name,
    modules: req.body.modules.reduce((result: Module[], m: Module) => {
      
      const module: Module = {
        id: m.id,
        name: m.name,
        type: m.type
      }
      isModule(module) && result.push(module);
      return result;
    }, [])
  };
  //let roomUpdates: Room = { ...req.body as Room, id: Number(req.params.roomId) };
  console.log("HERE: ", req.body as Room);
  let rooms: Room[];
  const id: number = Number(req.params.roomId);
  var index = -1;

  try {
    const roomData = fs.readFile(PATH, "utf-8", (error, data) => {
      if (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Not found'));
      }

      try {
        rooms = JSON.parse(data);
        let roomToUpdate = rooms.find((room, i) => {
          if (room.id == id) {
            index = i;
            return room;
          }
        });
        
        roomToUpdate &&= { ...roomToUpdate, ...roomUpdates };
        roomToUpdate && (rooms[index] = roomToUpdate);

        fs.writeFile("./src/data/roomsTest.json", JSON.stringify(rooms, null, 2), (error) => {
          
          // Error writing file
          if (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Room couldn\'t be updated'));
          }

          console.log(roomToUpdate);
          return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Updated room with ID ${id}`, roomToUpdate))
        });
      
      // Error parsing json
      } catch (error) {
        console.error("Error parsing json string: ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Room couldn\'t be updated'));
      }
    })
  
  // Error reading json file
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, 'Not Found'));  
  }
}

export const deleteRoom = (req: Request, res: Response) => {

  //if patient found and deleted
  //return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, 'Room deleted'));

  //if not found
  //return res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, 'Room not found'));
};




/**
 * Add module to room by Id
 * @param req 
 * @param res 
 */
export const addModule = (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  const moduleType: String = req.body.type;
  let newModule: Module | HeatingModule | MusicModule | LightingModule | undefined;
  let rooms: Room[];
  let room: Room | undefined;
  let index: number = -1;

  switch (moduleType) {
    case "heating":
      /*newModule = {
        id: req.body.id,
        name: req.body.name,
        type: ModuleType.HEATING,
        thermostats: req.body.thermostats,
        tempHigh: req.body.tempHigh,
        tempLow: req.body.tempLow,
        schedule: req.body.schedule
      };*/

      newModule =
        isHeatingModule(req.body)
          /*isHeatingModule({
            id: req.body.id,
            name: req.body.name,
            type: ModuleType.HEATING,
            thermostats: req.body.thermostats,
            tempHigh: req.body.tempHigh,
            tempLow: req.body.tempLow,
            schedule: req.body.schedule
          })*/
          ? {
            id: req.body.id,
            name: req.body.name,
            type: ModuleType.HEATING,
            thermostats: req.body.thermostats,
            tempHigh: req.body.tempHigh,
            tempLow: req.body.tempLow,
            schedule: req.body.schedule
          }
          : undefined
        ;
      break;
    case "music":
      newModule = isMusicModule(req.body)
        ? {
          id: req.body.id,
          name: req.body.name,
          type: ModuleType.MUSIC,
          volume: req.body.volume
        }
        : undefined;
      break;
    case "lighting":
      newModule = isLightingModule(req.body)
        ? {
          id: req.body.id,
          name: req.body.name,
          type: ModuleType.LIGHTING
        }
        : undefined;
      break;
    default:
      break;
  }

  /*const newModule: Module = {
    id: req.body.id,
    name: req.body.name,
    type: moduleType
  };*/

  if (!newModule)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Invalid module structure'));

  try {
    const data = fs.readFile(PATH, "utf-8", (error, data) => {
      if (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
      }

      try {
        rooms = JSON.parse(data);
        room = rooms.find((room, i) => {
          if (room.id == roomId) {
            index = i;
            return room;
          }
        });

        //room && (room.modules = [...room.modules, newModule]);

        room && (rooms[index].modules = [...room.modules as Module[], newModule as Module]);

        fs.writeFile("./src/data/roomsTest.json", JSON.stringify(rooms, null, 2), (error) => {
          
          // Error writing file
          if (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
          }

          console.log(rooms[index]);
          return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Added module to room with ID ${roomId}`, rooms[index]))
        });

      } catch (error) {
        console.error("Error parsing json string: ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
      }
    });

  } catch (error) { 
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
  }
}

export const getModules = (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  let rooms: Room[];
  let room: Room | undefined;

  try {

    const data = fs.readFile(PATH, "utf8", (error, data) => {
      if (error) {
          console.error(error);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Not found'));
      }

      try {
        rooms = JSON.parse(data);
        room = rooms.find(room => room.id == roomId);
      } catch (error) {
        console.error("Error parsing json string: ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
      }
      return room ? res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${room.modules.length} ${room.modules.length > 1 ? "modules" : "module"} for room with ID ${roomId}`, room.modules)) : res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, `Couldn't find room with ID ${roomId}`));
    });
    
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Rooms couldn\'t be loaded'));
  }
}