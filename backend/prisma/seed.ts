import { PrismaClient, UserRole, AccountStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greencart.com' },
    update: {},
    create: {
      email: 'admin@greencart.com',
      passwordHash: adminPassword,
      fullName: 'Admin GreenCart',
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.APPROVED,
    },
  });

  // Create test users
  const userPassword = await bcrypt.hash('user123', 10);
  const consumer = await prisma.user.upsert({
    where: { email: 'user@greencart.com' },
    update: {},
    create: {
      email: 'user@greencart.com',
      passwordHash: userPassword,
      fullName: 'Jean Dupont',
      role: UserRole.CONSUMER,
      accountStatus: AccountStatus.APPROVED,
    },
  });

  const producerPassword = await bcrypt.hash('producer123', 10);
  const producer = await prisma.user.upsert({
    where: { email: 'producer@greencart.com' },
    update: {},
    create: {
      email: 'producer@greencart.com',
      passwordHash: producerPassword,
      fullName: 'Marie Martin',
      role: UserRole.PRODUCER,
      accountStatus: AccountStatus.APPROVED,
    },
  });

  const restaurantPassword = await bcrypt.hash('restaurant123', 10);
  const restaurant = await prisma.user.upsert({
    where: { email: 'restaurant@greencart.com' },
    update: {},
    create: {
      email: 'restaurant@greencart.com',
      passwordHash: restaurantPassword,
      fullName: 'Pierre Durand',
      role: UserRole.RESTAURANT,
      accountStatus: AccountStatus.APPROVED,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'legumes' },
      update: {},
      create: {
        name: 'Légumes',
        slug: 'legumes',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fruits' },
    update: {},
    create: {
        name: 'Fruits',
        slug: 'fruits',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'boulangerie' },
    update: {},
    create: {
        name: 'Boulangerie',
        slug: 'boulangerie',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fromages' },
    update: {},
    create: {
        name: 'Fromages',
        slug: 'fromages',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-1' },
      update: {},
      create: {
        id: 'product-1',
        name: 'Panier de légumes de saison',
        description: 'Légumes frais cultivés localement sans pesticides',
      price: 15.99,
      originalPrice: 22.00,
      stock: 12,
        type: 'producer',
        region: 'Île-de-France',
        producer: 'Ferme Bio Martin',
      rating: 4.8,
      reviews: 24,
      solidaire: true,
        distance: '5 km',
      isRestaurant: false,
        ownerId: producer.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-2' },
      update: {},
      create: {
        id: 'product-2',
        name: 'Invendus boulangerie',
        description: 'Pain et viennoiseries de la veille, toujours frais et délicieux',
      price: 8.50,
      originalPrice: 18.00,
      stock: 8,
        type: 'restaurant',
        region: 'Île-de-France',
        producer: 'Boulangerie du Coin',
      rating: 4.6,
      reviews: 18,
      solidaire: true,
        distance: '2 km',
      isRestaurant: true,
        expiryNote: 'Les produits sont proches de leur date limite mais toujours consommables',
        ownerId: restaurant.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-3' },
      update: {},
      create: {
        id: 'product-3',
        name: 'Fruits de saison',
        description: 'Pommes, poires et fruits locaux cueillis à maturité',
      price: 12.99,
      originalPrice: 16.50,
      stock: 15,
        type: 'producer',
        region: 'Normandie',
        producer: 'Vergers Normands',
      rating: 4.9,
      reviews: 31,
      solidaire: false,
        distance: '12 km',
      isRestaurant: false,
        ownerId: producer.id,
        categoryId: categories[1].id,
      },
    }),
  ]);

  // Create product contents
  await Promise.all([
    prisma.productContent.upsert({
      where: { id: 'content-1' },
      update: {},
      create: {
        id: 'content-1',
        productId: 'product-1',
        item: '4 carottes',
        emoji: '🥕',
        order: 1,
      },
    }),
    prisma.productContent.upsert({
      where: { id: 'content-2' },
      update: {},
      create: {
        id: 'content-2',
        productId: 'product-1',
        item: '3 tomates',
        emoji: '🍅',
        order: 2,
      },
    }),
    prisma.productContent.upsert({
      where: { id: 'content-3' },
      update: {},
      create: {
        id: 'content-3',
        productId: 'product-2',
        item: '1 baguette tradition',
        emoji: '🥖',
        order: 1,
      },
    }),
  ]);

  // Create orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id: 'order-1' },
      update: {},
      create: {
        id: 'order-1',
        userId: consumer.id,
        total: 24.49,
        status: 'PAID',
      },
    }),
    prisma.order.upsert({
      where: { id: 'order-2' },
      update: {},
      create: {
        id: 'order-2',
        userId: producer.id,
        total: 15.99,
        status: 'PENDING',
      },
    }),
  ]);

  // Create order items
  await Promise.all([
    prisma.orderItem.upsert({
      where: { id: 'item-1' },
      update: {},
      create: {
        id: 'item-1',
        orderId: 'order-1',
        productId: 'product-1',
        quantity: 1,
        priceAtPurchase: 15.99,
      },
    }),
    prisma.orderItem.upsert({
      where: { id: 'item-2' },
      update: {},
      create: {
        id: 'item-2',
        orderId: 'order-1',
        productId: 'product-2',
        quantity: 1,
        priceAtPurchase: 8.50,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user:', admin.email);
  console.log('👤 Test users created');
  console.log('📦 Products created:', products.length);
  console.log('📋 Orders created:', orders.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 