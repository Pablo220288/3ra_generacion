import { mongooseConnect } from "@/lib/mongoose";
import { CheckListModel } from "@/models/CheckList";
import { AdminModel } from "@/models/Admin"; 

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  res.json(await CheckListModel.findOne({ _id: req.query.id }).populate('owner'));
}
