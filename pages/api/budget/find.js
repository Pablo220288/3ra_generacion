import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const data = await BudgetModel.find({}, null, {
    sort: {
      file: -1,
    },
  }).populate("owner");
  res.json(data);
}