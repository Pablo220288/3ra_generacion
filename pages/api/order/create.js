import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const {
    file,
    dateOrder,
    description,
    signature,
    nameSignature,
    owner,
    customer
  } = req.body;
  
  const OrderDoc = await OrderModel.create({
    file: parseInt(file),
    dateOrder : new Date(dateOrder),
    description,
    signature,
    nameSignature,
    owner,
    customer,
  });
  res.json(OrderDoc);
}
