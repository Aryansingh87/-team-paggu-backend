import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["client", "coach"], default: "client" },

    // Membership snapshot — kept on the user for fast dashboard reads.
    // Source of truth for payment history lives in the Payment model.
    membership: {
      plan: { type: String, enum: ["STARTER", "COMPETITOR", "ELITE", null], default: null },
      status: { type: String, enum: ["active", "inactive", "expired"], default: "inactive" },
      startDate: { type: Date, default: null },
      expiryDate: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never send the password hash back in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
