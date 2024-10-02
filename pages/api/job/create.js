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
  } = req.body;

  const JobDoc = await JobModel.create({
    file: parseInt(file),
    dateJob: new Date(dateJob),
    name,
    branch,
    property,
    job,
    gender,
    status,
    owner,
    orderJob,
    priority,
  });
  res.json(JobDoc);
}
