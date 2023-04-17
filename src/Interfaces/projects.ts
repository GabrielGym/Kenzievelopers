type TProjects = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
  developerId: number;
};

type TProjectsRequest = Omit<TProjects, "id">

interface TProjectsAndTechnologies  extends TProjects {
  technologiesid: number;
  technologiesname: string;
}

export { TProjects, TProjectsRequest, TProjectsAndTechnologies };
