import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const password = req.query.password;

  const dataAdmin = await AdminModel.findOne({ _id: req.query.id });

  const passwordMatch = await AdminModel.comparePassword(
    password,
    dataAdmin.password
  );

  res.json(passwordMatch);
}
