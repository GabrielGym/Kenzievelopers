import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

type technologiesRequest = {
  name: string;
};

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
    return res.status(409).json({
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

  return next();
};

export { verifyNameTechnologies }