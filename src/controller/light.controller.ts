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

export const toggleLight = (req: Request, res: Response) => {
  const id = req.params.deviceId

  sendRequest(`${BASE_URL}/toggle/fritzdect.1.${id}.state?prettyPrint`, 'PUT')
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log(`Toggled light with ID ${id}: Light is ${json.value ? 'on' : 'off'}`)
      return res.send(json)
    })
    .catch(error => {
      return res.send(error)
    })
}