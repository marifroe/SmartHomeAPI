import { Request, Response } from 'express'
import { HttpStatus } from '../enum/httpStatus.enum'
import { HttpResponse } from '../domain/response'
import { readRooms } from '../utils/readWrite'
import { InvalidError } from '../utils/errors'
import { Module, isModule } from '../interface/module'

const BASE_URL = 'http://192.168.188.6:8087'

const sendRequest = (url: string, method: string, body?: string) => {

  console.log(`Sending ${method} request to ioBroker: ` + url)
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
 * Get thermostat settings for given room.
 * @param req 
 * @param res 
 * @returns 
 */
export const getThermostatsByRoom = (req: Request, res: Response) => {

  const roomId: number = Number(req.params.roomId)
  if (!roomId || isNaN(roomId)) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Error! Please enter a valid ID.`))
  
  readRooms()
    .then(rooms => {
      const room = rooms.find(room => room.id === roomId)
      if (!room) throw new InvalidError(`Room with ID ${roomId} doesn't exist`)
      if (room.heating.length === 0) return []
      return getThermostatsByIds(room.heating)
    })
    .then(thermostats => {
      return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Found ${thermostats.length}`, thermostats))
    })
    .catch(error => {
      if (error instanceof InvalidError) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, error.message))
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t load thermostats. ${error}`))
  })
}

/**
 * Set thermostat settings for room.
 * @param req 
 * @param res 
 * @returns 
 */
export const setThermostatsByRoom = (req: Request, res: Response) => {

  const roomId: number = Number(req.params.roomId)
  const variable: string = req.params.variable
  const value: number = Number(req.params.value)

  if (!roomId || isNaN(roomId)) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Error! Please enter a valid ID.`))
  
  readRooms()
    .then(rooms => {
      const room = rooms.find(room => room.id === roomId)
      if (!room) throw new InvalidError(`Room with ID ${roomId} doesn't exist`)
      if (room.heating.length === 0) throw new InvalidError('Room has no associated thermostats')
      return setThermostatsByIds(room.heating, variable, value)
    })
    .then(thermostats => {
      return res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, `Set ${variable} to ${value} for ${thermostats.length} thermostats`, thermostats))
    })
    .catch(error => {
      if (error instanceof InvalidError) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, error.message))
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, `Error! Couldn\'t set temperature. ${error}`))
  })
}

/**
 * Creates bulk string for given thermostats.
 * @param modules Modules which shall be altered
 * @param variable Variable which is to be set (e.g. tsoll)
 * @param setValue Value the variable should be set to
 * @returns 
 */
const createBulkRequest = (modules: Module[], separator: ',' | '&', variable: string, setValue?: number): string => {

  let bulk = ''

  modules.forEach((id, index) => {
    if (index !== 0) bulk += separator
    bulk = bulk + `fritzdect.1.${id.id}.${variable}`
    if(setValue) bulk += `=${setValue}`
  })

  return bulk
}


/**
 * Load thermostat data as bulk.
 * @param thermostats Thermostats which shall be loaded
 * @returns 
 */
export const getThermostatsByIds = (thermostats: Module[]) => new Promise((resolve: (value: any[]) => void, reject: (reasond: Error) => void) => {

  const bulk = createBulkRequest(thermostats, ',', 'tsoll')

  sendRequest(`${BASE_URL}/getBulk/${bulk}?prettyPrint`, 'GET')
    .then(response => response.json())
    .then(thermostats => {
      if (thermostats.length > 0) resolve(thermostats)
      else reject(new Error('Failed loading thermostats'))
    })
    .catch(error => reject(error))
})


/**
 * Send request to ioBroker API to alter multiple thermostats at once.
 * @param thermostats Thermostats which shall be altered
 * @param variable Variable which is to be set (e.g. tsoll)
 * @param value Value the variable should be set to
 * @returns 
 */
export const setThermostatsByIds = (thermostats: Module[], variable: string, value: number) => new Promise((resolve: (value: any[]) => void, reject) => {

  const bulk = createBulkRequest(thermostats, '&', variable, value)

  sendRequest(`${BASE_URL}/setBulk?${bulk}&prettyPrint`, 'PUT')
    .then(response => response.json())
    .then(therms => resolve(therms))
    .catch(error => reject(error))
})

/**
 * Get Temperature for thermostat by ID.
 * @param req 
 * @param res 
 */
export const getTemp = (req: Request, res: Response) => {
  const id = req.params.deviceId

  getTempById(id)
    .then(temp => res.send(temp))
    .catch(error => res.send(error))
}


/**
 * Send request to ioBroker API to get tsoll settign of Thermostat.
 * @param id ID of the Thermostat
 * @returns 
 */
export const getTempById = (id: string) => new Promise((resolve: (value: JSON) => void, reject: (reason: Error) => void) => {
  
  sendRequest(`${BASE_URL}/get/fritzdect.1.${id}.tsoll?prettyPrint`, 'GET')
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log(`Thermostat with ID ${id}: Target temp is ${json.value}`)
    resolve(json)
  })
  .catch(error => {
    reject(error)
  })
})


/**
 * Set temperature by providing thermostat ID.
 * @param req 
 * @param res 
 * @returns 
 */
export const setTemp = (req: Request, res: Response) => {
  const id = req.params.deviceId
  const temp = Number(req.params.temp)

  if (!temp || isNaN(temp)) return res.status(HttpStatus.BAD_REQUEST).send(new HttpResponse(HttpStatus.BAD_REQUEST, `Error! Please enter a valid temperature.`))

  setTempById(id, temp)
    .then(temp => res.send(temp))
    .catch(error => res.send(error))


  /*sendRequest(`${BASE_URL}/set/fritzdect.1.${id}.tsoll?value=${temp}&prettyPrint`, 'PUT')
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log(`Toggled thermostat with ID ${id}: New target temp is ${json.value}`)
      return res.send(json)
    })
    .catch(error => {
      return res.send(error)
    })*/
}


/**
 * Send request to ioBroker to set target temperature of thermostat.
 * @param id Thermostat ID
 * @param temp Target Temperature
 * @returns 
 */
export const setTempById = (id: string, temp: number) => new Promise((resolve: (value: JSON) => void, reject: (reason: Error) => void) => {
  
  sendRequest(`${BASE_URL}/set/fritzdect.1.${id}.tsoll?value=${temp}&prettyPrint`, 'PUT')
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log(`Toggled thermostat with ID ${id}: New target temp is ${json.value}`)
    resolve(json)
  })
  .catch(error => {
    reject(error)
  })
})
