import mongoose, { Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser extends Document {
  nama: string;
  email: string;
  npm: string;
  jurusan: string;
  password: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    npm: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    jurusan: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password sebelum menyimpan
userSchema.pre<IUser>('save', async function(this: IUser) {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method untuk membandingkan password
userSchema.methods.comparePassword = async function(this: IUser, enteredPassword: string) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
