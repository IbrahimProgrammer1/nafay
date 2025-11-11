const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!@#', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nafay.com' },
    update: {},
    create: {
      email: 'admin@nafay.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  // Create products
  const products = [
    {
      name: 'Dell XPS 13 Plus',
      brand: 'Dell',
      price: 1799.99,
      description: 'Ultra-thin and powerful laptop with stunning InfinityEdge display. Perfect for professionals and creators.',
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        'https://images.unsplash.com/photo-1593642634315-48f5414c3267?w=800'
      ],
      stock: 15,
      processor: 'Intel Core i7-1260P',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '13.4" FHD+ (1920x1200)',
      gpu: 'Intel Iris Xe',
      battery: '55Whr',
      weight: 1.24,
      os: 'Windows 11 Pro',
      featured: true,
    },
    {
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      price: 2399.99,
      description: 'Supercharged by M3 Pro chip. The most advanced Mac laptops for demanding workflows.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
      ],
      stock: 10,
      processor: 'Apple M3 Pro',
      ram: '18GB Unified Memory',
      storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR',
      gpu: '14-core GPU',
      battery: '70Whr',
      weight: 1.6,
      os: 'macOS Sonoma',
      featured: true,
    },
    {
      name: 'HP Spectre x360',
      brand: 'HP',
      price: 1549.99,
      description: 'Premium 2-in-1 convertible laptop with exceptional versatility and style.',
      images: [
        'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=800',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
      ],
      stock: 20,
      processor: 'Intel Core i7-1355U',
      ram: '16GB DDR4',
      storage: '1TB SSD',
      display: '13.5" 3K2K OLED Touch',
      gpu: 'Intel Iris Xe',
      battery: '66Whr',
      weight: 1.34,
      os: 'Windows 11 Home',
      featured: false,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      brand: 'Lenovo',
      price: 1899.99,
      description: 'Legendary business laptop with military-grade durability and all-day battery life.',
      images: [
        'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'
      ],
      stock: 12,
      processor: 'Intel Core i7-1365U',
      ram: '32GB LPDDR5',
      storage: '1TB SSD',
      display: '14" WUXGA (1920x1200)',
      gpu: 'Intel Iris Xe',
      battery: '57Whr',
      weight: 1.12,
      os: 'Windows 11 Pro',
      featured: false,
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      brand: 'ASUS',
      price: 1649.99,
      description: 'Compact gaming powerhouse with incredible performance in a portable design.',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=800'
      ],
      stock: 8,
      processor: 'AMD Ryzen 9 7940HS',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      display: '14" QHD 165Hz',
      gpu: 'NVIDIA RTX 4060',
      battery: '76Whr',
      weight: 1.65,
      os: 'Windows 11 Home',
      featured: true,
    },
    {
      name: 'Microsoft Surface Laptop 5',
      brand: 'Microsoft',
      price: 1299.99,
      description: 'Sleek and stylish laptop with premium build quality and touchscreen display.',
      images: [
        'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
      ],
      stock: 18,
      processor: 'Intel Core i5-1235U',
      ram: '8GB LPDDR5x',
      storage: '256GB SSD',
      display: '13.5" PixelSense Touch',
      gpu: 'Intel Iris Xe',
      battery: '47.4Whr',
      weight: 1.27,
      os: 'Windows 11 Home',
      featured: false,
    },
    {
      name: 'Razer Blade 15',
      brand: 'Razer',
      price: 2799.99,
      description: 'Ultimate gaming laptop with desktop-class performance and premium aluminum chassis.',
      images: [
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800',
        'https://images.unsplash.com/photo-1565375706404-082d37dd1f5d?w=800'
      ],
      stock: 5,
      processor: 'Intel Core i9-13950HX',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      display: '15.6" QHD 240Hz',
      gpu: 'NVIDIA RTX 4070',
      battery: '80Whr',
      weight: 2.01,
      os: 'Windows 11 Home',
      featured: true,
    },
    {
      name: 'LG Gram 17',
      brand: 'LG',
      price: 1499.99,
      description: 'Incredibly lightweight 17-inch laptop that defies physics with all-day battery life.',
      images: [
        'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
      ],
      stock: 14,
      processor: 'Intel Core i7-1360P',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '17" WQXGA (2560x1600)',
      gpu: 'Intel Iris Xe',
      battery: '80Whr',
      weight: 1.35,
      os: 'Windows 11 Home',
      featured: false,
    },
    {
      name: 'Acer Swift X',
      brand: 'Acer',
      price: 1099.99,
      description: 'Creator laptop with dedicated graphics for content creation and light gaming.',
      images: [
        'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
      ],
      stock: 22,
      processor: 'AMD Ryzen 7 5825U',
      ram: '16GB LPDDR4X',
      storage: '512GB SSD',
      display: '14" FHD IPS',
      gpu: 'NVIDIA RTX 3050',
      battery: '59Whr',
      weight: 1.39,
      os: 'Windows 11 Home',
      featured: false,
    },
    {
      name: 'MSI Stealth 17',
      brand: 'MSI',
      price: 2199.99,
      description: 'Thin and powerful gaming laptop designed for gamers and content creators.',
      images: [
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
        'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=800'
      ],
      stock: 7,
      processor: 'Intel Core i7-13700H',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      display: '17.3" FHD 144Hz',
      gpu: 'NVIDIA RTX 4060',
      battery: '53.5Whr',
      weight: 2.8,
      os: 'Windows 11 Home',
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });