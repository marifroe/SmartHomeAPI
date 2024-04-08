import { Router } from "express"
import { getTemp, setTemp } from '../controller/heating.controller'

const tempRoutes = Router()

tempRoutes.route('/')
//.get(getLights)

tempRoutes.route('/:deviceId/tsoll')
  .get(getTemp)
  
tempRoutes.route('/:deviceId/tsoll/:temp')
  .put(setTemp)

export default tempRoutes