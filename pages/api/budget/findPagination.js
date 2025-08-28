import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";
import { AdminModel } from "@/models/Admin"; 

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { page } = req.query;
  const limit = 12;
  const skip = limit * page - limit;
  const data = await BudgetModel.paginate(
    {},
    {
      limit,
      page: page,
      skip,
      sort: {
        file: -1,
      },
      populate: "owner",
    },
    (error, data) => {
      res.json(data);
    }
  );
}
