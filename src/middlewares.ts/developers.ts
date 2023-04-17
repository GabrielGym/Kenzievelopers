import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  TDeveloperRequest,
} from "../Interfaces/developers.interfaces";

const ensureDeveloperIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.params.id);

  const queryString: string = `
        SELECT
            *
        FROM
            developers
        WHERE
            id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      "message": "Developer not found."
    });
  }

  return next();
};

const ensureDeveloperEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerData: TDeveloperRequest = req.body;

  const queryString: string = `
        SELECT
            *
        FROM
            developers
        WHERE
            "email" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerData.email],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  return next();
};

const ensureDeveloperInfosExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerInfosId: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT
            *
        FROM
            developer_infos
        WHERE
            "developerId" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerInfosId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  return next();
};

export {
  ensureDeveloperEmailExists,
  ensureDeveloperIdExists,
  ensureDeveloperInfosExists,
};
