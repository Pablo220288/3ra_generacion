import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { user, fullName, password, owner, _id } = req.body;

  const updateUser = {
    user,
    fullName,
    owner,
  };

  if (password !== undefined) {
    updateUser.password = await AdminModel.encryptPassword(password);
  }

  await AdminModel.updateOne({ _id }, updateUser);
  res.json(true);
}
