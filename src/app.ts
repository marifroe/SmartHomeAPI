import express, { Application, Request, Response } from "express";
import { HttpStatus } from "./enum/httpStatus.enum";
import { HttpResponse } from "./domain/response";
import roomRoutes from "./routes/room.routes";
import lightRoutes from "./routes/light.routes";
import tempRoutes from "./routes/temp.routes";

export class App {
  private readonly app: Application;
  private readonly ROUTE_NOT_FOUND = 'Not Found';

  constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 3000) {
    this.app = express();
    this.middleWare();
    this.routes();
  }

  listen(): void {
    this.app.listen(this.port);
    console.log(`listening on port: ${this.port}`);
  }

  private middleWare(): void {
    this.app.use(express.json());
    this.app.use(function timeLog(req, res, next) {
      console.info(`[${new Date().toLocaleString()}]: Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
      next();
    });
  }

  private routes(): void {
    this.app.use('/rooms', roomRoutes);
    this.app.use('/light', lightRoutes)
    this.app.use('/temp', tempRoutes)
    this.app.get('/', (req: Request, res: Response) => res.status(HttpStatus.OK).send(new HttpResponse(HttpStatus.OK, 'Server up and running')));
    this.app.all('*', (req: Request, res: Response) => res.status(HttpStatus.NOT_FOUND).send(new HttpResponse(HttpStatus.NOT_FOUND, this.ROUTE_NOT_FOUND)));
  }

}