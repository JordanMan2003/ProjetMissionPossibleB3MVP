const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Créer des catégories
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
      where: { slug: 'paniers-complets' },
      update: {},
      create: {
        name: 'Paniers Complets',
        slug: 'paniers-complets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'invendus' },
      update: {},
      create: {
        name: 'Invendus',
        slug: 'invendus',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Créer des utilisateurs de test
  const producer = await prisma.user.upsert({
    where: { email: 'producer@test.com' },
    update: {},
    create: {
      email: 'producer@test.com',
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: test123
      fullName: 'Jean Dupont',
      role: 'PRODUCER',
      accountStatus: 'APPROVED',
      producerCertified: true,
      siret: '12345678901234',
      iban: 'FR1420041010050500013M02606',
      bic: 'BNPAFRPPXXX',
    },
  });

  const restaurant = await prisma.user.upsert({
    where: { email: 'restaurant@test.com' },
    update: {},
    create: {
      email: 'restaurant@test.com',
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: test123
      fullName: 'Le Bistrot Local',
      role: 'RESTAURANT',
      accountStatus: 'APPROVED',
      siret: '98765432109876',
      iban: 'FR1420041010050500013M02607',
      bic: 'DEUTDEFFXXX',
    },
  });

  console.log('✅ Users created');

  // Créer des produits de test
  const products = await Promise.all([
    // Produit producteur
    prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        name: 'Panier Légumes Bio',
        description: 'Un panier de légumes frais et bio cultivés localement',
        price: 15.99,
        originalPrice: 19.99,
        stock: 25,
        type: 'producer',
        region: 'Île-de-France',
        producer: 'Jean Dupont',
        rating: 4.8,
        reviews: 12,
        solidaire: true,
        distance: '5 km',
        isRestaurant: false,
        isActive: true,
        featured: true,
        ownerId: producer.id,
        categoryId: categories[0].id, // légumes
      },
    }),
    // Produit restaurant
    prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        name: 'Panier Invendus Gourmet',
        description: 'Délicieux invendus du jour à prix réduit',
        price: 12.50,
        originalPrice: 18.00,
        stock: 15,
        type: 'restaurant',
        region: 'Île-de-France',
        producer: 'Le Bistrot Local',
        rating: 4.6,
        reviews: 8,
        solidaire: false,
        distance: '2 km',
        isRestaurant: true,
        expiryNote: 'À consommer dans les 24h',
        isActive: true,
        featured: false,
        ownerId: restaurant.id,
        categoryId: categories[3].id, // invendus
      },
    }),
    // Produit fruits
    prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        name: 'Panier Fruits de Saison',
        description: 'Fruits frais et juteux de saison',
        price: 18.99,
        originalPrice: 22.50,
        stock: 20,
        type: 'producer',
        region: 'Normandie',
        producer: 'Jean Dupont',
        rating: 4.9,
        reviews: 15,
        solidaire: true,
        distance: '8 km',
        isRestaurant: false,
        isActive: true,
        featured: true,
        ownerId: producer.id,
        categoryId: categories[1].id, // fruits
      },
    }),
  ]);

  console.log('✅ Products created');

  // Créer du contenu pour les produits
  await Promise.all([
    // Contenu pour le panier légumes
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-1', order: 0 } },
      update: {},
      create: {
        productId: 'prod-1',
        item: 'Carottes bio',
        emoji: '🥕',
        order: 0,
      },
    }),
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-1', order: 1 } },
      update: {},
      create: {
        productId: 'prod-1',
        item: 'Tomates cerises',
        emoji: '🍅',
        order: 1,
      },
    }),
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-1', order: 2 } },
      update: {},
      create: {
        productId: 'prod-1',
        item: 'Salade verte',
        emoji: '🥬',
        order: 2,
      },
    }),
    // Contenu pour le panier invendus
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-2', order: 0 } },
      update: {},
      create: {
        productId: 'prod-2',
        item: 'Quiche du jour',
        emoji: '🥧',
        order: 0,
      },
    }),
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-2', order: 1 } },
      update: {},
      create: {
        productId: 'prod-2',
        item: 'Pain frais',
        emoji: '🥖',
        order: 1,
      },
    }),
    // Contenu pour le panier fruits
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-3', order: 0 } },
      update: {},
      create: {
        productId: 'prod-3',
        item: 'Pommes Golden',
        emoji: '🍎',
        order: 0,
      },
    }),
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-3', order: 1 } },
      update: {},
      create: {
        productId: 'prod-3',
        item: 'Poires Williams',
        emoji: '🍐',
        order: 1,
      },
    }),
    prisma.productContent.upsert({
      where: { productId_order: { productId: 'prod-3', order: 2 } },
      update: {},
      create: {
        productId: 'prod-3',
        item: 'Raisins blancs',
        emoji: '🍇',
        order: 2,
      },
    }),
  ]);

  console.log('✅ Product contents created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
