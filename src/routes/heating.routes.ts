import { Router } from "express"
import { setTemp } from '../controller/heating.controller'

const tempRoutes = Router()

tempRoutes.route('/')
//.get(getLights)
  
tempRoutes.route('/:deviceId/:temp')
  .put(setTemp)

export default tempRoutes