import { Schema, model, models } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
        type: { type: String, required: true },
        branch: { type: String },
        property: { type: String },
        address: { type: String },
        location: { type: String },
        phone: { type: String },
        email: { type: String },
        contact: { type: String },
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

OrderSchema.plugin(mongoosePaginate);

export const OrderModel = models?.Order || model("Order", OrderSchema);
