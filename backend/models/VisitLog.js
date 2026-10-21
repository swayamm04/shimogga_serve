const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    action: {
      type: String,
      enum: ['view', 'call', 'whatsapp', 'website', 'directions'],
      default: 'view',
    },
    userAgent: String,
    ip: String,
    referrer: String,
  },
  {
    timestamps: true,
  }
);

visitLogSchema.index({ business: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('VisitLog', visitLogSchema);
