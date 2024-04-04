import { Router } from "express"
import { toggleLight } from '../controller/light.controller'

const lightRoutes = Router()

lightRoutes.route('/')
  //.get(getLights)

lightRoutes.route('/:deviceId/toggle')
  .put(toggleLight)

export default lightRoutes