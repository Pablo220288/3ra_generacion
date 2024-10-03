import { mongooseConnect } from "@/lib/mongoose";
import { JobModel } from "@/models/Job";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const {
    file,
    dateJob,
    name,
    branch,
    property,
    job,
    gender,
    status,
    owner,
    orderJob,
    priority,
    _id,
  } = req.body;

  await JobModel.updateOne(
    { _id },
    {
      file,
      dateJob,
      name,
      branch,
      property,
      job,
      gender,
      status,
      owner,
      orderJob,
      priority,
    }
  );
  res.json(true);
}
