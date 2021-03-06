import IBaseController from "../IBaseController";
import express, { Request, Response } from "express";
import landService from "./land.service";
import { ILand } from "../../model/Land";
import errorService from "../errors/errors.service";
import passport from "passport";

class LandController implements IBaseController {
  path: string = "/land";
  router: express.Router = express.Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      `${this.path}`,
      passport.authenticate("jwt", { session: false }),
      this.createLand
    );
    this.router.get(
      `${this.path}`,
      passport.authenticate("jwt", { session: false }),
      this.index
    );
    this.router.get(
      `${this.path}`,
      passport.authenticate("jwt", { session: false }),
      this.getById
    );
    this.router.put(
      `${this.path}`,
      passport.authenticate("jwt", { session: false }),
      this.updateLand
    );
  }

  private async createLand(req: Request, res: Response) {
    try {
      const land: ILand = req.body;
      const landName = await landService.getOne({ name: land.name });
      if (landName)
        return res.status(400).send(errorService.dataExistError("land"));

      const data = await landService.create(land);
      return res.status(201).send({ status: 201, data });
    } catch (error) {
      console.error(error);
      return res.status(500).send(errorService.internalError());
    }
  }

  private async index(req: Request, res: Response) {
    try {
      const { count } = req.query;
      const data = await landService.get();
      const total = data.length;
      if (count) {
        return res.send({ status: 200, data: total });
      }
      return res.send({ status: 200, data });
    } catch (error) {
      console.error(error);
      return res.status(500).send(errorService.internalError());
    }
  }

  private async getById(req: Request, res: Response) {
    try {
      const { identifier } = req.query;
      const data = await landService.getOne({ id: identifier });
      return res.send({ status: 200, data });
    } catch (error) {
      console.error(error);
      return res.status(500).send(errorService.internalError());
    }
  }

  private async updateLand(req: Request, res: Response) {
    try {
      const land: ILand = req.body;
      const data = await landService.update(land);
      return res.send({ status: 200, data, message: "land updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).send(errorService.internalError());
    }
  }
}

export default LandController;
