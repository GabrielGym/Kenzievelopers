type TDeveloper = {
  id: number;
  name: string;
  email: string;
};

type TDeveloperRequest = Omit<TDeveloper, "id">;

type TDeveloperInfos = {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId: number;
};

type TDeveloperInfosRequest = Omit<TDeveloperInfos, "id" | "developerId">;

type TDeveloperInfosIdRequest = Omit<TDeveloperInfos, "id">;

type TDeveloperAndInfos = {
  developerSince: Date | null;
  preferredOS: string | null;
  developerId: number;
  developerName: string;
  developerEmail: string;
};

export {
  TDeveloper,
  TDeveloperRequest,
  TDeveloperInfos,
  TDeveloperInfosRequest,
  TDeveloperInfosIdRequest,
  TDeveloperAndInfos
};
