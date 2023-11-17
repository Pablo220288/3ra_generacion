import { mongooseConnect } from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { name, parentCategory, properties, _id } = req.body;
  const categoryDoc = await CategoryModel.updateOne(
    { _id },
    {
      name,
      parent: parentCategory || undefined,
      properties,
    }
  );
  res.json(categoryDoc);
}
