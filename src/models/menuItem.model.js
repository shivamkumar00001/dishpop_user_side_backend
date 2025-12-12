import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MenuItemSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },
    
    arModelUrl:{
      type:String,
      default:""
    }
  },
  { timestamps: true }
);

// Create model
const MenuItemModel = mongoose.model("MenuItem", MenuItemSchema, "dishes");

// Export properly
export default MenuItemModel;
