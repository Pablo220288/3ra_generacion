import { mongooseConnect } from "@/lib/mongoose";
import { CheckListModel } from "@/models/CheckList";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const data = await CheckListModel.find({}, null, {
    sort: {
      file: -1,
    },
  }).populate("owner");
  res.json(data);
}
