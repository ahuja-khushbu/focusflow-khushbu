import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 10000 },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, default: 'todo' },
    dueDate: { type: Date, default: null },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', default: null },
    categoryId: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

taskSchema.index({ createdBy: 1, isDeleted: 1, status: 1 });
taskSchema.index({ createdBy: 1, isDeleted: 1, dueDate: 1 });
taskSchema.index({ isDeleted: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
