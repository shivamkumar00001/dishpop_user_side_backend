import mongoose from "mongoose";
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      index: true,
    },

    tableNumber: {
      type: Number,
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BILLED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],

    billId: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true, versionKey: false }
);

/* ---------- INDEXES ---------- */
SessionSchema.index({ username: 1, tableNumber: 1, status: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* ---------- HELPERS ---------- */
SessionSchema.statics.generateSessionId = function () {
  return `SES-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

SessionSchema.statics.findOrCreateActive = async function ({
  username,
  tableNumber,
  customerName,
  phoneNumber,
}) {
  let session = await this.findOne({
    username,
    tableNumber,
    status: "ACTIVE",
  });

  if (session) {
    return { session, isNew: false };
  }

  session = await this.create({
    sessionId: this.generateSessionId(),
    username,
    tableNumber,
    customerName,
    phoneNumber,
  });

  return { session, isNew: true };
};

SessionSchema.methods.markAsBilled = async function (billId) {
  this.status = "BILLED";
  this.billId = billId;
  this.endedAt = new Date();
  await this.save();
};

export default mongoose.model("Session", SessionSchema);
