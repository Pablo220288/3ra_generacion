import { mongooseConnect } from "@/lib/mongoose";
import { BudgetModel } from "@/models/Budget";

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res)

  const { page } = req.query;
  const limit = 10;
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
