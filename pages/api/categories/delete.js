import { mongooseConnect } from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  console.log(id);
  await CategoryModel.deleteOne({ _id: id });
  res.json(true);
}
