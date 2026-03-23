import { app } from "../server/app.js";
import { connectDB } from "../server/config/db.js";

let dbReadyPromise;

export default async function handler(req, res) {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB();
  }

  await dbReadyPromise;
  return app(req, res);
}
