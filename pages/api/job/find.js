import { mongooseConnect } from "@/lib/mongoose";
import { JobModel } from "@/models/Job";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const data = await JobModel.find({}, null, {
    sort: {
      file: -1,
    },
  }).populate("owner");

  res.json(data);
}
