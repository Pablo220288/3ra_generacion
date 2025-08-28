import { mongooseConnect } from "@/lib/mongoose";
import { JobModel } from "@/models/Job";
import { AdminModel } from "@/models/Admin"; 

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  res.json(await JobModel.findOne({ _id: req.query.id }).populate('owner'));
}
