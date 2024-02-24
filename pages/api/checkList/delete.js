import { mongooseConnect } from "@/lib/mongoose";
import { CheckListModel } from "@/models/CheckList";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  await CheckListModel.deleteOne({ _id: id });
  res.json(true);
}
