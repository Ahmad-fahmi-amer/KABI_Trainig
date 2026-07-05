import http from "http";
import dotenv from "dotenv";
import { studentRoutes } from "./routes/studentRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  studentRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
