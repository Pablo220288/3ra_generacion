import { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    file: { type: Number, required: true },
    dateJob: { type: Date, required: true },
    name: { type: String, required: true },
    branch: { type: String },
    property: { type: String },
    job: { type: String, required: true },
    gender: { type: String, required: true },
    status: { type: String },
    priority: { type: Number },
    orderJob: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
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

export const JobModel = models?.Job || model("Job", JobSchema);
