const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    erpid: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostle',
        required: true
    },
    role: {
        type: String,
        default: "Admin"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// Check if the model is already registered before defining it
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

module.exports = Admin;

// module.exports = mongoose.models.admin || mongoose.model('admin', adminSchema);
