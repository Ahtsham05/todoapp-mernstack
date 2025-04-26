import mongoose from "mongoose";
import { Schema } from "mongoose"
import bcrypt from "bcrypt"
import mongoosePaginate from 'mongoose-paginate-v2';
import { Todo } from "./todo.model.js";

const userSchema = new Schema({
    email:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: false
    },
    role:{
        type: String,
        required: true,
        enum: ["user","admin"],
        default: "user"
    },
    facebookId: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    otp:{
        type: String,
        default: ""
    },
    otp_expiry:{
        type:String,
        default: ""
    },
    verified:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    
    try {
        this.password = await bcrypt.hash(this.password,10)
        next()
    } catch (error) {
        next(error)
    }
})

// if user delete delete its all data
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
      await Todo.deleteMany({ uid: this._id });  
      next();
    } catch (error) {
      next(error);
    }
  });

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password)
}

// make for is email exist ✅
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };

userSchema.plugin(mongoosePaginate);
export const User = mongoose.model('User',userSchema)


