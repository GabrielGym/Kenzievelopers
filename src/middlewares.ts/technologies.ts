import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { technologiesRequest } from "../Interfaces/projects";

const verifyNameTechnologies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name }: technologiesRequest = req.body;

  const queryString: string = `
          SELECT
              *
          FROM
              technologies
          WHERE
              "name" = $1
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technologyId = queryResult.rows[0].id;

  return next();
};

export { verifyNameTechnologies };
