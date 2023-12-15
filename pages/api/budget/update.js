import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const {
    file,
    dateBudget,
    name,
    branch,
    items,
    total,
    totalDollar,
    owner,
    gender,
    _id,
  } = req.body;

  await BudgetModel.updateOne(
    { _id },
    { file, dateBudget, name, branch, items, total, totalDollar, owner, gender }
  );
  res.json(true);
}
