import fs from 'fs/promises'
import { Room } from '../interface/room'

const PATH_ROOMS = "./src/data/rooms_ioB.json"
const PATH_ID = './src/data/id.json'
const PATH_ID_SIMPLE = './src/data/idSimple.txt'

export const readRooms = () => new Promise((resolve: (value: Room[]) => void, reject: (reason: Error) => void) => {

  let rooms: Room[] | undefined

  fs.readFile(PATH_ROOMS, 'utf-8')
    .then(data => {
      rooms = JSON.parse(data)
      if (rooms) resolve(rooms)
      else throw new Error('Failed parsing ID file.')
    })
    .catch(error => {
      console.log('Error! Couldn\'t load rooms. ' + error)
      reject(error)
    })
})

export const writeRooms = (rooms: Room[]) => new Promise((resolve: (value: Room[]) => void, reject: (reason: Error) => void) => {

  fs.writeFile(PATH_ROOMS, JSON.stringify(rooms))
    .then(() => resolve(rooms))
    .catch(error => {
      console.log('Error! Couldn\'t write rooms. ' + error)
      reject(error)
    })
})

export const writeID = (id: number) => new Promise((resolve: (value: number) => void, reject: (reason: Error) => void) => {

  fs.writeFile(PATH_ID_SIMPLE, String(id))
    .then(() => resolve(id))
    .catch(error => {
      console.log('Error! Couldn\'t write new ID. ' + error)
      reject(error)
    })
})

export const readId = () => new Promise((resolve: (value: number) => void, reject: (reason: Error) => void) => {

  fs.readFile(PATH_ID_SIMPLE, 'utf-8')
    .then(data => {

      const id = Number(data)
      
      if (id) resolve(id)
      else throw new Error('Failed reading ID from file.')
    })
    .catch(error => {
      console.log(error)
      reject(new Error('Error! Couldn\'t load ID. ' + error))
    })
})