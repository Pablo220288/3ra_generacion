import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateOrder: { type: Date, required: true },
    description: { type: String, required: true },
    signature: { type: String, required: true },
    nameSignature: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    customer: new Schema(
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
      },
      {
        timestamps: true,
        versionKey: false,
      }
    ),
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const OrderModel = models?.Order || model("Order", OrderSchema);
