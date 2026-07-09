import { parse } from "url";
import { logger } from "../middleware/logger.js";
import { parseBody } from "../middleware/bodyParser.js";

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

export async function studentRoutes(req, res) {
  logger(req);

  const { pathname } = parse(req.url, true);

  if (pathname === "/students") {
    if (req.method === "GET") return getStudents(req, res);

    if (req.method === "POST") {
      req.body = await parseBody(req);

      return createStudent(req, res);
    }

    res.writeHead(405);
    return res.end();
  }

  const match = pathname.match(/^\/students\/(.+)$/);

  if (match) {
    req.params = {
      id: match[1],
    };

    if (req.method === "GET") return getStudent(req, res);

    if (req.method === "PUT") {
      req.body = await parseBody(req);

      return updateStudent(req, res);
    }

    if (req.method === "DELETE") return deleteStudent(req, res);

    res.writeHead(405);
    return res.end();
  }

  res.writeHead(404);
  res.end();
}
