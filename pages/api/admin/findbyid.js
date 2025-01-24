import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  res.json(await AdminModel.findOne({ _id: req.query.id }));
}
