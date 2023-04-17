import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, getDeveloperAndInfos, updateDeveloper } from "./Logics/developers";
import { ensureDeveloperEmailExists, ensureDeveloperIdExists, ensureDeveloperInfosExists } from "./middlewares.ts/developers";
import { createProject, getProjectsAndTechnologies, updateproject } from "./Logics/pojects";
import { ensureDeveloperIdExistsProjects, ensureProjectIdExists } from "./middlewares.ts/projects";

const app: Application = express();
app.use(express.json());

app.post("/developers",ensureDeveloperEmailExists, createDeveloper)
app.patch("/developers/:id", ensureDeveloperIdExists, ensureDeveloperEmailExists, updateDeveloper)
app.delete("/developers/:id", ensureDeveloperIdExists, deleteDeveloper)
app.post("/developers/:id/infos", ensureDeveloperIdExists, ensureDeveloperInfosExists, createDeveloperInfos)
app.get("/developers/:id",ensureDeveloperIdExists, getDeveloperAndInfos )

app.post("/projects",ensureDeveloperIdExistsProjects, createProject)
app.patch("/projects/:id", ensureDeveloperIdExistsProjects, ensureProjectIdExists, updateproject)
app.get("/projects/:id",ensureProjectIdExists, getProjectsAndTechnologies )

export default app;
