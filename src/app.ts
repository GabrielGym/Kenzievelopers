import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, getDeveloperAndInfos, updateDeveloper } from "./Logics/developers";
import { ensureDeveloperEmailExists, ensureDeveloperIdExists, ensureDeveloperInfosExists } from "./middlewares.ts/developers";
import { createProject, createProjectsAndTechnologies, deleteProject, getProjectsAndTechnologies, updateproject } from "./Logics/pojects";
import { ensureDeveloperIdExistsProjects, ensureProjectIdExists } from "./middlewares.ts/projects";
import { verifyNameTechnologies } from "./middlewares.ts/technologies";

const app: Application = express();
app.use(express.json());

app.post("/developers",ensureDeveloperEmailExists, createDeveloper)
app.patch("/developers/:id", ensureDeveloperIdExists, ensureDeveloperEmailExists, updateDeveloper)
app.delete("/developers/:id", ensureDeveloperIdExists, deleteDeveloper)
app.post("/developers/:id/infos", ensureDeveloperIdExists, ensureDeveloperInfosExists, createDeveloperInfos)
app.get("/developers/:id",ensureDeveloperIdExists, getDeveloperAndInfos )

app.post("/projects",ensureDeveloperIdExistsProjects, createProject)
app.get("/projects/:id",ensureProjectIdExists, getProjectsAndTechnologies )
app.patch("/projects/:id",ensureProjectIdExists, ensureDeveloperIdExistsProjects,  updateproject)
app.delete("/projects/:id", ensureProjectIdExists, deleteProject)
app.post("/projects/:id/technologies", ensureProjectIdExists, verifyNameTechnologies, createProjectsAndTechnologies)

export default app;
