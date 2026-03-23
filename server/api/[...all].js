import { app } from "../app.js";
import { connectDB } from "../config/db.js";

let dbReadyPromise;

export default async function handler(req, res) {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB();
  }

  await dbReadyPromise;
  return app(req, res);
}
