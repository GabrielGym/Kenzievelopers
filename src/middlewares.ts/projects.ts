import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureDeveloperIdExistsProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.body.developerId);

  console.log(id)

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
      message: "Developer not found.",
    });
  }

  return next();
};

const ensureProjectIdExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const id = parseInt(req.params.id);

    console.log(id)
  
    const queryString: string = `
            SELECT
                *
            FROM
                projects
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
        "message": "Project not found."
      });
    }
  
    return next();
  };

export { ensureDeveloperIdExistsProjects, ensureProjectIdExists };
