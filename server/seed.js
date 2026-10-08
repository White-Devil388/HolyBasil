import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Enquiry from "./models/Enquiry.js";
import FranchiseApplication from "./models/FranchiseApplication.js";

// Fix querySrv ECONNREFUSED just in case it is run without the expanded string
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Atlas for Seeding...");

    // 1. Create Users
    const customer1 = new User({
      name: "Ramesh Customer",
      email: `ramesh_${Date.now()}@test.com`,
      password: "password123",
      phone: "9999999999",
      role: "customer"
    });
    
    const customer2 = new User({
      name: "Suresh Customer",
      email: `suresh_${Date.now()}@test.com`,
      password: "password123",
      phone: "8888888888",
      role: "customer"
    });

    const franchise1 = new User({
      name: "Indore Franchise",
      email: `franchise_${Date.now()}@test.com`,
      password: "password123",
      phone: "7777777777",
      role: "franchise",
      serviceablePincodes: ["452001"],
      storeCity: "Indore",
      storeDistrict: "Indore"
    });

    await customer1.save();
    await customer2.save();
    await franchise1.save();
    console.log("Mock Users created.");

    // 2. Create Categories
    const category1 = new Category({
      name: `Herbal Powders ${Date.now()}`,
      slug: `herbal-powders-${Date.now()}`,
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "100% natural herbal powders."
    });

    const category2 = new Category({
      name: `Ayurvedic Oils ${Date.now()}`,
      slug: `ayurvedic-oils-${Date.now()}`,
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "Pure and traditional ayurvedic hair and body oils."
    });

    await category1.save();
    await category2.save();
    console.log("Mock Categories created.");

    // 3. Create Products
    const products = [];
    for (let i = 1; i <= 5; i++) {
      const product = new Product({
        name: `Mock Ayurvedic Product ${i}`,
        slug: `mock-product-${i}-${Date.now()}`,
        category: i % 2 === 0 ? category1.name : category2.name,
        description: `This is a highly effective ayurvedic product ${i}.`,
        price: 500 + i * 100,
        compareAtPrice: 600 + i * 100,
        inventory: 50,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        isBestSeller: i === 1,
      });
      await product.save();
      products.push(product);
    }
    console.log("Mock Products created.");

    // 4. Create Orders
    const order1 = new Order({
      user: customer1._id,
      items: [
        { product: products[0]._id, name: products[0].name, price: products[0].price, quantity: 2 },
        { product: products[1]._id, name: products[1].name, price: products[1].price, quantity: 1 },
      ],
      shippingAddress: { name: customer1.name, phone: customer1.phone, address: "123 Street", city: "Mumbai", state: "MH", pincode: "400001" },
      billingAddress: { name: customer1.name, phone: customer1.phone, address: "123 Street", city: "Mumbai", state: "MH", pincode: "400001" },
      paymentMethod: "cod",
      subtotal: products[0].price * 2 + products[1].price,
      total: products[0].price * 2 + products[1].price,
      orderStatus: "Confirmed"
    });
    await order1.save();

    const order2 = new Order({
      user: customer2._id,
      items: [
        { product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 1 }
      ],
      shippingAddress: { name: customer2.name, phone: customer2.phone, address: "456 Avenue", city: "Delhi", state: "DL", pincode: "110001" },
      billingAddress: { name: customer2.name, phone: customer2.phone, address: "456 Avenue", city: "Delhi", state: "DL", pincode: "110001" },
      paymentMethod: "online",
      paymentStatus: "Paid",
      subtotal: products[2].price,
      total: products[2].price,
      orderStatus: "Delivered"
    });
    await order2.save();
    console.log("Mock Orders created.");

    // 5. Create Enquiries
    const enquiry = new Enquiry({
      name: "B2B Client",
      email: "b2b@example.com",
      phone: "1122334455",
      productCategory: category1.name,
      estimatedQuantity: "500",
      message: "Need bulk quotation",
      status: "New"
    });
    await enquiry.save();
    console.log("Mock Enquiries created.");

    console.log("Data seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
