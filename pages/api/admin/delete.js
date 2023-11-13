import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  await AdminModel.deleteOne({ _id: id });
  res.json(true);
}
