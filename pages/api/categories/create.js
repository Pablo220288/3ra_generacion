import { mongooseConnect } from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { name, parentCategory, properties } = req.body;
  const categoryDoc = await CategoryModel.create({
    name,
    parent: parentCategory || undefined,
    properties,
  });
  res.json(categoryDoc);
}
