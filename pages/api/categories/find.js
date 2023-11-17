import { mongooseConnect } from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  res.json(await CategoryModel.find().populate("parent"));
}