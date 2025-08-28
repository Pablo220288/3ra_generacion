import { mongooseConnect } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";
import { AdminModel } from "@/models/Admin"; 

export default async function handle(req, res) {
  await mongooseConnect();
  
  const { customer, page = 1 } = req.query;
  const limit = 12;
  const skip = limit * page - limit;

  try {
    const data = await OrderModel.paginate(
      { "customer.name": { $regex: customer, $options: "i" } },
      {
        limit,
        page: parseInt(page),
        skip,
        sort: { file: -1 },
        populate: "owner"
      }
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}