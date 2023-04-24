import { client } from "../database";
import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import {
  TProjects,
  TProjectsAndTechnologies,
  TProjectsRequest,
  technologiesRequest,
} from "../Interfaces/projects";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: TProjectsRequest = req.body;

  const queryString: string = format(
    `
          INSERT INTO
              projects(%I)
          VALUES
              (%L)
          RETURNING *;
      `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<TProjects> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const updateproject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: Partial<TProjectsRequest> = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
          UPDATE
              projects
          SET
              (%I) = ROW(%L)
          WHERE
              id = $1
          RETURNING *;
      `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const getProjectsAndTechnologies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT 
          p."id" AS "projectId", 
          p."name" AS "projectName", 
          p."description" "projectDescription", 
          p."estimatedTime" AS "projectEstimatedTime",
          p."repository" AS "projectRepository", 
          p."startDate" AS "projectStartDate", 
          p."endDate" AS "projectEndDate", 
          p."developerId" AS "projectDeveloperId",
          t."id" AS "technologyId ", 
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

  const queryResult: QueryResult<TProjectsAndTechnologies> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        DELETE FROM 
            projects
        WHERE
            id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(204).send();
};

const createProjectsAndTechnologies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const technologyId: number = parseInt(res.locals.technologyId);
  const projectId: number = parseInt(req.params.id);
  const date = new Date();

  const queryStringInsert: string = `
    INSERT INTO
        projects_technologies("addedIn", "technologyId", "projectId")
    VALUES($1, $2, $3)
        RETURNING *;
  `;

  const queryResultInsert: QueryResult = await client.query(queryStringInsert, [
    date,
    technologyId,
    projectId,
  ]);

  const queryString: string = `
  SELECT 
      t."id" AS "technologyId ", 
      t."name" AS "technologyName",
      p."id" AS "projectId", 
      p."name" AS "projectName", 
      p."description" "projectDescription", 
      p."estimatedTime" AS "projectEstimatedTime",
      p."repository" AS "projectRepository", 
      p."startDate" AS "projectStartDate", 
      p."endDate" AS "projectEndDate"
  FROM
      projects AS p
  FULL OUTER JOIN
      projects_technologies AS pt 
  ON
      p."id" = pt."projectId"
  FULL OUTER JOIN
      technologies AS t ON t."id" = pt."technologyId"
  WHERE 
      t."id" = $1 AND p."id" = $2;
`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyId, projectId],
  };

  const queryResult: QueryResult<TProjectsAndTechnologies> = await client.query(
    queryConfig
  );

  return res.status(201).json(queryResult.rows[0]);
};

const deleteTechnologyInProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = parseInt(req.params.id);
  const technologyId: number = parseInt(res.locals.technologyId)

  const queryString: string = `
        DELETE FROM 
            projects_technologies AS pt
        WHERE
            pt."projectId" = $1 AND pt."technologyId" = $2
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId, technologyId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createProject,
  updateproject,
  getProjectsAndTechnologies,
  deleteProject,
  createProjectsAndTechnologies,
  deleteTechnologyInProject,
};
