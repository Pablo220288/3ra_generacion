import { Schema, model, models } from "mongoose";

const BudgetSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateBudget: { type: Date, required: true },
    name: { type: String, required: true },
    items: [{ type: Object }],
    total: { type: Number },
    totalDollar: { type: Number },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BudgetModel = models?.Budget || model("Budget", BudgetSchema);
