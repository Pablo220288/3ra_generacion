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
    owner,
  } = req.body;

  const CheckListDoc = await CheckListModel.create({
    file: parseInt(file),
    dateCheckList: new Date(dateCheckList),
    branch,
    equipment,
    items,
    observations,
    mileage,
    owner,
  });
  res.json(CheckListDoc);
}
