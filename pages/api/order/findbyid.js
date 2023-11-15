import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  res.json(await OrderModel.findOne({ _id: req.query.id }).populate('owner'));
}
