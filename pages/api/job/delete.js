import { mongooseConnect } from "@/lib/mongoose";
import { JobModel } from "@/models/Job";


export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { id } = req.query;
  await JobModel.deleteOne({ _id: id });
  res.json(true);
}
