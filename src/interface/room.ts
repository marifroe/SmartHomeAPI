import { Module } from './module'

export interface Room {
  id: number
  name: string
  heating: Module[]
  lighting: Module[]
  others: Module[]
}

/*export const isRoom = (room: Room): room is Room => {
  if (room.name)
    return true;
  else
    return false;
};*/