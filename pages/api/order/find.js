import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";
import { AdminModel } from "@/models/Admin"; 

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const data = await OrderModel.find({}, null, {
    sort: {
      file: -1,
    },
  }).populate("owner");
  res.json(data);
}
