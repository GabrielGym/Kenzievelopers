import format from "pg-format";
import {
  TDeveloper,
  TDeveloperAndInfos,
  TDeveloperInfos,
  TDeveloperInfosIdRequest,
  TDeveloperInfosRequest,
  TDeveloperRequest,
} from "../Interfaces/developers.interfaces";
import { client } from "../database";
import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDeveloperRequest = req.body;

  const queryString: string = format(
    `
        INSERT INTO
            developers(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<TDeveloper> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: Partial<TDeveloperRequest> = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
        UPDATE
            developers
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        DELETE FROM 
            developers
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

const createDeveloperInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInfoData: TDeveloperInfosRequest = req.body;
  const developerId: number = parseInt(req.params.id);

  if (
    developerInfoData.preferredOS !== "Windows" &&
    developerInfoData.preferredOS !== "Linux" &&
    developerInfoData.preferredOS !== "MacOS"
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const data: TDeveloperInfosIdRequest = {
    ...developerInfoData,
    developerId,
  };

  const queryStringInsert: string = format(
    `
          INSERT INTO
              developer_infos(%I) 
          VALUES
              (%L)
          RETURNING *;
      `,
    Object.keys(data),
    Object.values(data)
  );

  const queryResultInsert: QueryResult<TDeveloperInfos> = await client.query(
    queryStringInsert
  );

  return res.status(201).json(queryResultInsert.rows[0]);
};

const getDeveloperAndInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT 
        "d"."id" as "developerId", 
        "d"."name" as "developerName", 
        "d"."email" "developerEmail", 
        "di"."developerSince" as "developerInfoDeveloperSince", 
        "di"."preferredOS" as "developerInfoPreferredOS"
    FROM
        developers AS d
    FULL OUTER JOIN 
        developer_infos AS di
    ON 
       di."developerId" = d."id"
    WHERE
        "d"."id" = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id]
  }

  const queryResult: QueryResult<TDeveloperAndInfos> = await client.query(
    queryConfig
  ); 

  return res.status(200).json(queryResult.rows[0]);
};

export {
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  createDeveloperInfos,
  getDeveloperAndInfos,
};
