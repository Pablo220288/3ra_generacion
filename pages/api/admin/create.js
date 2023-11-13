import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";

export default async function handle(req, res) {

  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { user, fullName, password, owner } = req.body;

  const AdminDoc = await AdminModel.create({
    user,
    fullName,
    password: await AdminModel.encryptPassword(password),
    owner
  });
  res.json(AdminDoc);
}
