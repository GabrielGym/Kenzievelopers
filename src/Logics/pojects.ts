import { client } from "../database";
import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { TProjects, TProjectsAndTechnologies, TProjectsRequest } from "../Interfaces/projects";

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
          p."id" as "projectId", 
          p."name" as "developerName", 
          p."description" "projectDescription", 
          p."estimatedTime" as "projectEstimatedTime",
          p."repository" as "projectRepository", 
          p."startDate" as "projectStartDate", 
          p."endDate" as "projectEndDate", 
          p."developerId" as "projectDeveloperId", 
          t."id" as "technologyId ", 
          t."name" as "technologyName"
      FROM
          projects AS p
      INNER JOIN 
          projects_technologies AS t
      ON 
          p."id" = t."id"
      WHERE
          p."id" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProjectsAndTechnologies> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows[0]);
};

export { createProject, updateproject, getProjectsAndTechnologies };
