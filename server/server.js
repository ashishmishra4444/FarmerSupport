import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { startCronJobs } from "./services/cronService.js";
import { initSocket } from "./socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

await connectDB();
startCronJobs();

const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
