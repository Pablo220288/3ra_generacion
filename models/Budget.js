import { Schema, model, models } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BudgetSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateBudget: { type: Date, required: true },
    name: { type: String, required: true },
    branch: { type: String },
    items: [{ type: Object }],
    total: { type: Number },
    totalDollar: { type: Number },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    gender: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BudgetSchema.plugin(mongoosePaginate);

export const BudgetModel = models?.Budget || model("Budget", BudgetSchema);
