import { Schema, model, models } from "mongoose";

const CheckListSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateCheckList: { type: Date, required: true },
    branch: { type: String, required: true },
    equipment: { type: String, required: true },
    observations: { type: String },
    mileage: { type: String },
    items: [{ type: Object }],
    signature: { type: String, required: true },
    nameSignature: { type: String, required: true },
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

export const CheckListModel =
  models?.CheckList || model("CheckList", CheckListSchema);
