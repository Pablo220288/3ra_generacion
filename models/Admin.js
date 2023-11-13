import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new Schema(
  {
    user: { type: String, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
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

AdminSchema.static("encryptPassword", async (password) => {
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT))
  );
});

AdminSchema.static("comparePassword", async (password, receivedPassword) => {
  return bcrypt.compareSync(password, receivedPassword);
});

export const AdminModel = models?.Admin || model("Admin", AdminSchema);
