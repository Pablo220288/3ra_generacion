import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const {
    file,
    dateOrder,
    name,
    description,
    signature,
    nameSignature,
    owner,
  } = req.body;
  
  const OrderDoc = await OrderModel.create({
    file: parseInt(file),
    dateOrder : new Date(dateOrder),
    name,
    description,
    signature,
    nameSignature,
    owner,
  });
  res.json(OrderDoc);
}
