import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

// Fix querySrv ECONNREFUSED just in case
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const distinctImages = {
  "Herbal Capsules": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
  "Herbal Oils": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  "Herbal Powders": "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=900&q=80",
  "Herbal Syrups": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=900&q=80",
  "Herbal Tablets": "https://images.unsplash.com/photo-1554602270-6ea027adfc27?auto=format&fit=crop&w=900&q=80",
  "Shilajits": "https://images.unsplash.com/photo-1551847677-dc82d762e1fd?auto=format&fit=crop&w=900&q=80",
  "Combos": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&w=900&q=80"
};

const fixSeedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Atlas for fixing Mock Data...");

    // Remove old data
    await Category.deleteMany({});
    await Product.deleteMany({});

    const exactCats = Object.keys(distinctImages);

    // Seed Categories
    for (let c of exactCats) {
      await Category.create({
        name: c,
        slug: c.toLowerCase().replace(/ /g, "-"),
        image: distinctImages[c],
        description: `100% natural and pure ${c}.`
      });
    }

    // Seed Products
    for (let i = 0; i < exactCats.length; i++) {
      const c = exactCats[i];
      await Product.create({
        name: `Premium ${c}`,
        slug: `premium-${c.toLowerCase().replace(/ /g, "-")}`,
        category: c,
        description: `This is a highly effective, 100% pure ${c}.`,
        price: 800 + i * 50,
        compareAtPrice: 1000 + i * 50,
        inventory: 100,
        images: [distinctImages[c]], // Assigned distinct image based on category
        isBestSeller: true, 
        published: true
      });
    }

    console.log("Mock Products & Categories fully fixed with DISTINCT images!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing seed data:", error);
    process.exit(1);
  }
};

fixSeedData();
