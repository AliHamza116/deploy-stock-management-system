import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.models.StockUser || mongoose.model("StockUser", UserSchema);

export default Users;
