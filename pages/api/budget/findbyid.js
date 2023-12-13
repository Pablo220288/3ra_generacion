import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  res.json(await BudgetModel.findOne({ _id: req.query.id }).populate('owner'));
}
