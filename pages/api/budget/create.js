import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { file, dateBudget, name, items, total, totalDollar, owner } = req.body;

  const OrderDoc = await BudgetModel.create({
    file: parseInt(file),
    dateBudget: new Date(dateBudget),
    name,
    items,
    total,
    totalDollar: parseInt(totalDollar),
    owner,
  });
  res.json(OrderDoc);
}
