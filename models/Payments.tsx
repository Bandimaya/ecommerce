import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  websiteRefNo: string;
  transactionNumber?: string;
  amount: number;
  currency?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'INVALID_CHECKSUM';
  gateway: 'SADAD';
  rawPayload: Record<string, any>;
  responseCode?: string;
  responseMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true, index: true },
    websiteRefNo: { type: String, required: true },
    transactionNumber: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'QAR' },

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING', 'INVALID_CHECKSUM'],
      required: true,
    },

    gateway: { type: String, default: 'SADAD' },

    responseCode: { type: String },
    responseMessage: { type: String },

    rawPayload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', PaymentSchema);
