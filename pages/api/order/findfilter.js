import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { customer } = req.query;
  const data = await OrderModel.find({ "customer.name": customer }).populate(
    "owner"
  );
  res.json(data);
}
