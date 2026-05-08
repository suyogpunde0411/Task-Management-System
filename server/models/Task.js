const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due Date is required'],
        validate: {
            validator: function(v) {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison
                // Subtract 1 day to prevent timezone-related false validation errors
                // where the server's UTC day is ahead of the user's local day.
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                return v >= yesterday;
            },
            message: 'Due date must be a current or future date'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
