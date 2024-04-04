import { ModuleType } from "../enum/moduleType.enum";

export interface Module {
  readonly id: number
  name: string
  type?: ModuleType
}

export const isModule = (module: Module): module is Module => {
  return (module.id && module.name) ? true : false;
}

/**
 * Module for heating units
 */
export interface HeatingModule extends Module {
  type: ModuleType.HEATING;
  thermostats: string[];
  tempHigh: number;
  tempLow: number;
  schedule: Schedule[];
}

interface Schedule {
  time: Date;
  temp: number;
}

export const isHeatingModule = (module: HeatingModule): module is HeatingModule => {
  return (
    module.type == ModuleType.HEATING
    && module.thermostats
    && module.tempHigh
    && module.tempLow
    && module.schedule
  ) ? true : false ;
}

/**
 * Module for lighting units
 */
export interface LightingModule extends Module {
  type: ModuleType.LIGHTING;
}

export const isLightingModule = (module: LightingModule): module is LightingModule => {
  return (
    module.type == ModuleType.LIGHTING
  ) ? true : false ;
}

/**
 * Module for music units
 */
export interface MusicModule extends Module {
  type: ModuleType.MUSIC;
  volume: number;
}

export const isMusicModule = (module: MusicModule): module is MusicModule => {
  return (
    module.type == ModuleType.MUSIC
    && module.volume
  ) ? true : false ;
}