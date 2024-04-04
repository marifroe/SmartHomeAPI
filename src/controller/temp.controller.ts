import { Request, Response } from 'express';

const BASE_URL = 'http://192.168.188.6:8087'

const sendRequest = (url: string, method: string, body?: string) => {
  const options: RequestInit = {
    method: method,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*',
    }
  }

  if (body) options.body = JSON.stringify(body)

  return fetch(url, options)
}

export const setTemp = (req: Request, res: Response) => {
  const id = req.params.deviceId
  const temp = req.params.temp

  sendRequest(`${BASE_URL}/set/fritzdect.1.${id}.tsoll?value=${temp}&prettyPrint`, 'PUT')
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log(`Toggled thermostat with ID ${id}: New target temp is ${json.value}`)
      return res.send(json)
    })
    .catch(error => {
      return res.send(error)
    })
}