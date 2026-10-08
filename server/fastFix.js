import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

// Fix DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const fixUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Fix Tablets
    const tabletsUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80";
    await Category.updateOne({ name: "Herbal Tablets" }, { image: tabletsUrl });
    await Product.updateMany({ category: "Herbal Tablets" }, { $set: { "images.0": tabletsUrl } });
    
    // Fix Shilajits
    const shilajitUrl = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80";
    await Category.updateOne({ name: "Shilajits" }, { image: shilajitUrl });
    await Product.updateMany({ category: "Shilajits" }, { $set: { "images.0": shilajitUrl } });
    
    console.log("Images fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
fixUrls();
