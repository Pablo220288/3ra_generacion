import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";


export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  await OrderModel.deleteOne({ _id: id });
  res.json(true);
}
