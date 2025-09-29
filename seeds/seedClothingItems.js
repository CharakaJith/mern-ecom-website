require('dotenv').config();
const mongoose = require('mongoose');

const ClothingItem = require('../models/clothingItem');
const CATEGORY = require('../enum/clothingCategory');
const SIZE = require('../enum/clothingSizes');

const { DATABASE } = require('../common/messages');
const { ENTITY } = require('../constants/entity.constants');

const items = [
  // men's items
  {
    name: 'Seamless Compression Tank',
    description:
      'Stay comfortable and supported during your workouts with our Seamless Compression Tank. Designed for men, this lightweight, moisture-wicking tank offers a snug, second-skin fit that moves with you, reducing chafing and maximizing performance.',
    price: 4750.0,
    imageUrls: ['/images/tank-1.webp', '/images/tank-2.webp', '/images/tank-3.webp'],
    category: CATEGORY.MEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE, SIZE.XLARGE],
  },
  {
    name: 'Athletic Seamless Compression',
    description:
      'Stay comfortable and supported during every workout with our Athletic Seamless Compression Tee. Designed for men, this high-performance shirt features a seamless construction that reduces friction, provides a snug fit, and enhances muscle support. Perfect for running, training, or any athletic activity, it keeps you cool and dry with its moisture-wicking fabric while offering maximum flexibility and range of motion.',
    price: 4990.0,
    imageUrls: ['/images/tee-1.webp', '/images/tee-2.webp', '/images/tee-3.webp'],
    category: CATEGORY.MEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE, SIZE.XLARGE],
  },
  {
    name: 'The Vault Hoodie',
    description:
      'Experience comfort and style with The Vault Hoodie. Crafted for men, this premium hoodie features a soft, durable fabric that keeps you warm without sacrificing mobility. With a sleek design, adjustable hood, and convenient front pocket, it’s perfect for casual wear, workouts, or layering on chilly days.',
    price: 5950.0,
    imageUrls: ['/images/hoodie-1.webp', '/images/hoodie-2.webp', '/images/hoodie-3.webp'],
    category: CATEGORY.MEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE, SIZE.XLARGE],
  },
  {
    name: 'Classic Wide Leg Denim',
    description:
      'Upgrade your casual wardrobe with the Urban Essential Knit Polo. Designed for men, this polo features a soft, breathable knit fabric that offers all-day comfort. With a classic collar, button placket, and versatile design, it’s perfect for work, weekend outings, or layering with your favorite jacket for a sharp, urban look.',
    price: 7950.0,
    imageUrls: ['/images/denim-1.webp', '/images/denim-3.webp'],
    category: CATEGORY.MEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE, SIZE.XLARGE],
  },
  {
    name: 'Urban Essential Knit Polo',
    description:
      'Step into timeless style with our Classic Wide Leg Denim. Designed for men, these jeans offer a relaxed fit with a wide-leg silhouette, combining comfort and effortless fashion. Crafted from durable denim, they are perfect for casual outings or pairing with your favorite sneakers for a modern, laid-back look.',
    price: 5650.0,
    imageUrls: ['/images/polo-1.webp', '/images/polo-2.webp', '/images/polo-3.webp'],
    category: CATEGORY.MEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE, SIZE.XLARGE],
  },

  // women's items
  {
    name: 'Classic Seamless Women’s Long sleeve Tee',
    description:
      'Redefine everyday comfort with the Classic Seamless Women’s Long Sleeve Tee. Designed with a smooth, body-contouring fit, this lightweight top offers all-day wearability without irritation. Its seamless construction ensures maximum flexibility and breathability, making it perfect for layering, workouts, or casual outings with a modern, polished look.',
    price: 4890.0,
    imageUrls: ['/images/long-1.jpg', '/images/long-2.jpg', '/images/long-3.jpg'],
    category: CATEGORY.WOMEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },
  {
    name: 'Women’s Core Seamless Tee V2',
    description:
      'Elevate your essentials with the Women’s Core Seamless Tee V2. Designed for a sleek, second-skin feel, this upgraded version delivers improved stretch, breathability, and all-day comfort. Its seamless design minimizes irritation while providing a flattering, flexible fit-perfect for training, lounging, or layering into your everyday look.',
    price: 4650.0,
    imageUrls: ['/images/v-1.webp', '/images/v-1.webp', '/images/v-3.webp'],
    category: CATEGORY.WOMEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },
  {
    name: 'Classic Bell Bottom Jeggings',
    description:
      'Step into timeless style with our Classic Bell Bottom Jeggings, designed to bring back the retro vibe with a modern twist. Made from a soft, stretchable fabric, these jeggings hug your curves while flaring out at the bottom for that iconic bell-bottom silhouette. Perfect for pairing with crop tops, oversized tees, or blazers, they’re a versatile piece for both casual days and chic evenings.',
    price: 5850.0,
    imageUrls: ['/images/jeggins-1.webp', '/images/jeggins-2.webp'],
    category: CATEGORY.WOMEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },
  {
    name: 'Script Straight Leg Jogger',
    description:
      'Upgrade your off-duty style with the Script Straight Leg Jogger - where laid-back comfort meets everyday versatility. Crafted from premium soft-touch fabric, these joggers feature a relaxed fit with a straight-leg silhouette, giving you a modern edge while keeping it effortlessly casual. Whether you’re lounging, running errands, or styling them up with sneakers, these joggers are your go-to for an easy yet elevated look.',
    price: 4600.0,
    imageUrls: ['/images/jogger-1.webp', '/images/jogger-2.webpp', '/images/jogger-3.webp'],
    category: CATEGORY.WOMEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },
  {
    name: 'Classic Everyday Skirt',
    description:
      'Upgrade your off-duty style with the Script Straight Leg Jogger - where laid-back comfort meets everyday versatility. Crafted from premium soft-touch fabric, these joggers feature a relaxed fit with a straight-leg silhouette, giving you a modern edge while keeping it effortlessly casual. Whether you’re lounging, running errands, or styling them up with sneakers, these joggers are your go-to for an easy yet elevated look.',
    price: 5500.0,
    imageUrls: ['/images/skirt-1.webp', '/images/skirt-2.webp', '/images/skirt-3.webp'],
    category: CATEGORY.WOMEN,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },

  // kids' items
  {
    name: 'Kids Boys Oversized Back Print T-Shirt',
    description:
      'Let your little one step out in style with the Kids Boys Oversized Back Print T-Shirt. Designed with a relaxed oversized fit, this tee is perfect for all-day play and comfort. Made from soft, breathable cotton, it’s gentle on the skin while durable enough to handle everyday adventures. The bold back print adds a fun, trendy touch - making it a favorite for kids who love to stand out.',
    price: 2990.0,
    imageUrls: ['/images/kt-1.webp', '/images/kt-2.webp', '/images/kt-3.webp'],
    category: CATEGORY.KIDS,
    sizes: [SIZE.SMALL, SIZE.MEDIUM],
  },
  {
    name: 'WARNER BROS Kids Boys Cargo Bottom',
    description:
      'Let your little one step out in style with the Kids Boys Oversized Back Print T-Shirt. Designed with a relaxed oversized fit, this tee is perfect for all-day play and comfort. Made from soft, breathable cotton, it’s gentle on the skin while durable enough to handle everyday adventures. The bold back print adds a fun, trendy touch - making it a favorite for kids who love to stand out.',
    price: 3790.0,
    imageUrls: ['/images/bottom-1.webp'],
    category: CATEGORY.KIDS,
    sizes: [SIZE.SMALL, SIZE.MEDIUM],
  },
  {
    name: 'Urban Wear Kids Boys Crew Neck Oversized T-Shirt',
    description:
      'The URBAN WEAR Kids Boys Crew Neck Oversized T-Shirt is all about comfort and street-ready style. Designed with a modern oversized fit, this tee gives kids the freedom to move while keeping them on-trend. Crafted from soft, breathable cotton, it’s perfect for everyday wear—whether at school, the playground, or weekend outings. The classic crew neck design ensures it pairs effortlessly with joggers, jeans, or shorts for a laid-back urban vibe.',
    price: 3990.0,
    imageUrls: ['/images/green-1.webp', '/images/green-2.webp', '/images/green-3.webp'],
    category: CATEGORY.KIDS,
    sizes: [SIZE.MEDIUM, SIZE.LARGE],
  },
  {
    name: 'Boys Crew Neck Short Sleeve Cotton T-Shirt Dusty Blue',
    description:
      'Keep it simple, stylish, and comfortable with the Boys Crew Neck Short Sleeve Cotton T-Shirt in Dusty Blue. Made from 100% soft cotton, this everyday essential offers breathable comfort and a lightweight feel, perfect for active kids. The classic crew neck and relaxed short-sleeve design make it versatile for school, play, or casual outings. The muted dusty blue shade adds a modern touch, pairing effortlessly with jeans, shorts, or joggers.',
    price: 990.0,
    imageUrls: ['/images/blue-1.webp', '/images/blue-2.webp', '/images/blue-3.webp'],
    category: CATEGORY.KIDS,
    sizes: [SIZE.SMALL],
  },
  {
    name: 'Boys Sleeve Less Tank Top',
    description:
      'Stay cool and active with the Boys Sleeveless Tank Top, designed for maximum comfort during play, sports, or everyday wear. Crafted from lightweight, breathable cotton-blend fabric, this tank keeps kids fresh and unrestricted on warm days. The sleeveless cut allows easy movement, while the classic fit makes it a versatile wardrobe essential—perfect for layering or wearing solo.',
    price: 1590.0,
    imageUrls: ['/images/hawai-1.webp', '/images/hawai-2.webp', '/images/hawai-3.webp'],
    category: CATEGORY.KIDS,
    sizes: [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await ClothingItem.deleteMany();
    await ClothingItem.insertMany(items);

    console.log(DATABASE.SEED.SUCCESS(ENTITY.CLOTHINGITEM));
    mongoose.disconnect();
  } catch (error) {
    console.error(DATABASE.SEED.FAILED(ENTITY.CLOTHINGITEM, error));
  }
}

seed();
