import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

type technologiesRequest = {
  name: string;
};

const ensureDeveloperIdExistsProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.body.developerId);

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
      message: "Project not found.",
    });
  }

  return next();
};

const verifyTechnologiesNameInProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name }: technologiesRequest = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT  
          t."name" AS "technologyName"
      FROM
          projects AS p
      FULL OUTER JOIN
          projects_technologies AS pt 
      ON
          p."id" = pt."projectId"
      FULL OUTER JOIN
          technologies AS t ON t."id" = pt."technologyId"
      WHERE 
          p."id" = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rows[0].technologyName === name) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

const verifyTechnologiesNameInProjectsNotExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: string = req.params.name;
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT  
          t."name" AS "technologyName"
      FROM
          projects AS p
      FULL OUTER JOIN
          projects_technologies AS pt 
      ON
          p."id" = pt."projectId"
      FULL OUTER JOIN
          technologies AS t ON t."id" = pt."technologyId"
      WHERE 
          p."id" = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  const queryStringTechnologies: string = `
  SELECT
      *
  FROM
      technologies
  WHERE
      "name" = $1
`;

  const queryConfigTechnologies: QueryConfig = {
    text: queryStringTechnologies,
    values: [name],
  };

  const queryResultTechnologies: QueryResult = await client.query(
    queryConfigTechnologies
  );

  if (queryResultTechnologies.rowCount === 0) {
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

  if (queryResult.rows[0].technologyName !== name) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  res.locals.technologyId = queryResultTechnologies.rows[0].id;

  return next();
};

export {
  ensureDeveloperIdExistsProjects,
  ensureProjectIdExists,
  verifyTechnologiesNameInProjects,
  verifyTechnologiesNameInProjectsNotExists,
};
