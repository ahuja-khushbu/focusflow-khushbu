import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 500 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    columns: { type: [columnSchema], default: [] },
  },
  { timestamps: true }
);

boardSchema.index({ userId: 1 });

const Board = mongoose.model('Board', boardSchema);
export default Board;
