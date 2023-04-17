import app from "./app";
import { startDatabase } from "./database";

const server = (port: number) =>
  app.listen(port, async () => {
    await startDatabase();
    console.log(`Server is running on port ${port}.`);
  });

if (process.env.NODE_ENV === "dev") {
  server(Number(process.env.APP_PORT));
}

export default server;
