import { Module } from "./interface/module"
import { Room } from "./interface/room"

import fs from 'fs/promises'

type IdInfo = {
  highestId: number
  vacantIds: number[]
}

/*export const idIncrementor = (array: (Room | Module)[]): number => {
  let id = 0
  const ids = array.map(e => e.id)
  
  if (ids.length > 0) {
    ids.sort((a, b) => a - b)
    if (typeof ids[ids.length - 1] === "number") id = ids[ids.length - 1] + 1
  }
  
  return id
}*/

/*const parseId = (data: string) => {
  /* Read ID info file 
  let idInfo: IdInfo = JSON.parse(data, (key, value) => {
    
  })
  let vacantIds: number[] | undefined = idInfo.vacantIds
  let highest: number | undefined = idInfo.highestId

  if (!vacantIds || !highest) {
    throw new Error("ID info unavailable.")
  }
}

export const idProvider = (): number | undefined => {

  fs.readFile('./src/data/id.json', 'utf8')
    .then(response => {


      
      let newId: number | undefined
      
      if (!vacantIds || !highest) {
        throw new Error("ID info unavailable.")
      }
      
      if (vacantIds.length > 0) {     /* Use vacant ID 
        newId = vacantIds[0]
        vacantIds.shift()
      } else {                            /* Use highest ID 
        highest = newId = highest + 1
      }

      const updatedIdInfo = {
        highestId: highest,
        vacantIds: vacantIds
      }   

      fs.writeFile('./src/data/id.json', JSON.stringify(updatedIdInfo, null, 2))
        .then(response => {
          return newId
        })
    })
    .catch(error => {
      console.log(error)
      return undefined
    })
  
  return undefined

}

export const idTracker = (removeId: number): boolean => {
  fs.readFile('./src/data/id.json', 'utf8')
    .then(response => {
      let idInfo = JSON.parse(response)
      let vacantIds: number[] | undefined = idInfo.vacantIds
      let highest: number | undefined = idInfo.highestId

      if (!vacantIds || !highest) {
        throw new Error("ID info unavailable.")
      }

      if (removeId > highest) {
        return false
      }
    })
}*/