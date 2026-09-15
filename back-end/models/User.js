import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['CITIZEN', 'OFFICIAL', 'ADMIN'],
    default: 'CITIZEN'
  },
  mobile: { type: String, default: '' },
  organization: { type: String, default: '' },
  district: { type: String, default: 'Bengaluru Urban' },
  state: { type: String, default: 'Karnataka' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
