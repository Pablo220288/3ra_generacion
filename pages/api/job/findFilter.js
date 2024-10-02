import { mongooseConnect } from "@/lib/mongoose";
import { JobModel } from "@/models/Job";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)
  const { sort, type, state } = req.query;

  let filter = {};
  let options = {
    sort: {
      priority: 1,
    },
  };

  if (state) {
    filter = { status: state };
  }

  if (sort) {
    if (sort === "file") {
      options.sort = {
        file: parseInt(type),
      };
    } else {
      options.sort = {
        priority: parseInt(type),
      };
    }
  }

  const data = await JobModel.find(filter, null, options).populate("owner");
  res.json(data);
}
