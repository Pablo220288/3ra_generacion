import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const data = await OrderModel.find({}, null, {
    sort: {
      dateOrder: -1,
    },
  }).populate("owner");
  res.json(data);
}
