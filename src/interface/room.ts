import { Module } from "./module";

export interface Room {
  id: number;
  name: string;
  modules: Module[];
}

/*export const isRoom = (room: Room): room is Room => {
  if (room.name)
    return true;
  else
    return false;
};*/