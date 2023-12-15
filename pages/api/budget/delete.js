import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";


export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  await BudgetModel.deleteOne({ _id: id });
  res.json(true);
}
