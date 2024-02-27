import { mongooseConnect } from "@/lib/mongoose";
import { CheckListModel } from "@/models/CheckList";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const {
    file,
    dateCheckList,
    branch,
    equipment,
    items,
    observations,
    mileage,
    signature,
    nameSignature,
    owner,
    _id,
  } = req.body;

  await CheckListModel.updateOne(
    { _id },
    {
      file,
      dateCheckList,
      branch,
      equipment,
      items,
      observations,
      mileage,
      signature,
      nameSignature,
      owner,
    }
  );
  res.json(true);
}
