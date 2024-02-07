import { ModuleType } from "../enum/moduleType.enum";

export interface Module {
  id: number
  name: string
  type: ModuleType
}

export const isModule = (module: Module): module is Module => {
  return (module.id && module.name) ? true : false;
}

export interface Heating extends Module {
  thermostats: string[]
  tempHigh: number
  tempLow: number
  changes: Changes[]
}

interface Changes {
  time: Date
  temp: number
}

export interface Lighting extends Module {
}

export interface Music extends Module {
  volume: number
}