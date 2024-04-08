import { Request, Response } from 'express'
import { HttpStatus } from '../enum/httpStatus.enum'
import { HttpResponse } from '../domain/response'
import { Room } from '../interface/room'
import { readRooms, writeRooms, readId, writeID } from '../utils/readWrite'
import { InvalidError } from '../utils/errors'

const BASE_URL = 'http://192.168.188.6:8087'

const sendRequest = (url: string, method: string, body?: string) => {
  const options: RequestInit = {
    method: method,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*',
    }
  }

  if (body) options.body = JSON.stringify(body)

  return fetch(url, options)
}

/**
 * Get all rooms
 * @param req 
 * @param res 
 * @returns
 */

export const getRooms = (req: Request, res: Response) => {
  readRooms()
    .then(rooms => res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${rooms.length} ${rooms.length === 1 ? 'room' : 'rooms'}`, rooms)))
    .catch(error =>  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t load rooms. ${error}`)))
}


/**
 * Get specific room by ID
 * @param req 
 * @param res 
 * @returns 
 */

export const getRoom = (req: Request, res: Response) => {

  const id: number = Number(req.params.roomId)
  if (!id || isNaN(id)) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Error! Please enter a valid ID.`))

  readRooms()
    .then(rooms => {
      const room = rooms.find(room => room.id === id)

      room
      ? res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found room with ID ${id}.`, room))
      : res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Room with ID ${id} doesn't exist.`))
    })
    .catch(error => {
      console.log('Error! Couldn\'t load room. ' + error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t load rooms. ${error}`))
    })
}

/**
 * Add room. Generates a new ID by incrementing the ID stored in the ID file. Returns an error if the body doesn't match the required format of the Room type.
 * @param req 
 * @param res JSON of the newly created room or error
 * @returns 
 */
export const addRoom = (req: Request, res: Response) => {

  let newId: number
  let newRoom: Room
  let updatedRooms: Room[]

  const roomRequest: Room = req.body

  if (!roomRequest) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, 'Error! Couldn\'t add room. Provided room info does not conform to required format.'))
  
  readId()
    .then(id => {
      newId = id + 1
      return readRooms()
    })
    .then(rooms => {
      updatedRooms = [...rooms]
      newRoom = {
        ...roomRequest,
        id: newId
      }
      updatedRooms.push(newRoom)
      return writeID(newId)
    })
    .then(id => {
      console.log('Wrote incremented ID to file. New ID highest existing ID is ' + id)
      return writeRooms(updatedRooms)
    })
    .then(rooms => {
      console.log('Wrote to rooms file:')
      console.log(rooms)
      return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, 'Added room.', newRoom))
    })
    .catch(error => {
      console.log(error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t add room. ${error}`))
    })
  
}

/*export const getLights = (req: Request, res: Response) => {

  const id: number = Number(req.params.roomId)

  readRooms()
    .then(rooms => {
      const room = rooms.find(room => room.id === id)
      const heating: string[] = room?.heating
      return res.send(heating)
    })
    .catch(error => {
    c
  })
  
}

export const getHeating = (req: Request, res: Response) => {

  readRooms()
  return res.send('Hello World!')
}*/




/** 
 * Update an existing room.
*/

export const updateRoom = (req: Request, res: Response) => {

  /*const id: number = Number(req.params.roomId)
  
  // Create updated room content
  let roomUpdates: Room = {
    id: id,
    name: req.body.name,
    modules: req.body.modules.reduce((result: Module[], m: Module) => {
      
      const module: Module = {
        id: m.id,
        name: m.name,
        type: m.type
      }
      isModule(module) && result.push(module)       // make sure Module has valid format
      return result
    }, [])
  };

  
  fs.readFile(PATH, "utf-8")
  .then(data => {
    let rooms: Room[] = JSON.parse(data)
    var index = -1
    const updatedRooms = rooms.map(room => {
      return room.id === id ? roomUpdates : room
    })
    fs.writeFile("./src/data/rooms.json", JSON.stringify(updatedRooms, null, 2))
      .then(response => {
        return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Updated room with ID ${id}`, roomUpdates))
      })
  })
  .catch(error => {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Room couldn\'t be updated. ${error}`));
  })

  /*
  //let roomUpdates: Room = { ...req.body as Room, id: Number(req.params.roomId) };
  console.log("HERE: ", req.body as Room);
  let rooms: Room[];
  var index = -1;
*/
    
    
    /*, (error, data) => {
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
  }*/
}

export const deleteRoom = (req: Request, res: Response) => {

  const id: number = Number(req.params.roomId)
  if (!id || isNaN(id)) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Error! Please enter a valid ID.`))
  
  let roomToDelete: Room | undefined

  readRooms()
    .then(rooms => {
      let index: number = -1
      roomToDelete = rooms.find((room, i) => {
        index = i
        return room.id === id
      })

      if (index === -1 || !roomToDelete) throw new InvalidError(`Room with ID ${id} doesn't exist.`) 
      
      rooms.splice(index, 1)

      return writeRooms(rooms)
    })
    .then(_ => {
      return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Deleted room with ID ${id}`, roomToDelete))
    })
    .catch(error => {
      if (error instanceof InvalidError) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, error.message))
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t delete room. ${error}`))
    })
}




/**
 * Add module to room by Id
 * @param req 
 * @param res 
 */
export const addModule = (req: Request, res: Response) => {
  /*const roomId = Number(req.params.roomId);
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
      };

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
          })
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
  };

  if (!newModule) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Invalid module structure'));

  const data = fs.readFile(PATH, "utf-8")
    .then(data => {
      rooms = JSON.parse(data);
        room = rooms.find((room, i) => {
          if (room.id == roomId) {
            index = i;
            return room;
          }
        });
      room && (rooms[index].modules = [...room.modules as Module[], newModule as Module]);
      
      fs.writeFile("./src/data/roomsTest.json", JSON.stringify(rooms, null, 2))
        .then(response => {
          console.log(rooms[index]);
          return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Added module to room with ID ${roomId}`, rooms[index]))
        })
        .catch(error => {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
        })
    })
    .catch(error => {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Module couldn\'t be added'));
    })


        //room && (room.modules = [...room.modules, newModule]);

        

        /*fs.writeFile("./src/data/roomsTest.json", JSON.stringify(rooms, null, 2), (error) => {
          
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
  }*/
}

export const getModules = (req: Request, res: Response) => {
  /*const roomId = Number(req.params.roomId);
  let rooms: Room[];
  let room: Room | undefined;

  const data = fs.readFile(PATH, "utf8")
    .then(data => {
      rooms = JSON.parse(data);
      room = rooms.find(room => room.id == roomId);
      return room ? res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${room.modules.length} ${room.modules.length > 1 ? "modules" : "module"} for room with ID ${roomId}`, room.modules)) : res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, `Couldn't find room with ID ${roomId}`));
    })
    .catch(error => {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Not found'));
    })*/
}