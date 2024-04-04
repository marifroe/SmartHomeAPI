import { Router } from "express"
import { setTemp } from '../controller/temp.controller'

const tempRoutes = Router()

tempRoutes.route('/')
  //.get(getLights)

tempRoutes.route('/:deviceId/:temp')
  .put(setTemp)

export default tempRoutes