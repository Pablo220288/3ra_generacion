import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateOrder: { type: Date, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
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

export const OrderModel = models?.Order || model("Order", OrderSchema);
