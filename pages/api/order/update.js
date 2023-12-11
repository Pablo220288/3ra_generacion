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
    _id,
    customer,
  } = req.body;

  await OrderModel.updateOne(
    { _id },
    { file, dateOrder, name, description, signature, nameSignature, owner, customer }
  );
  res.json(true);
}
