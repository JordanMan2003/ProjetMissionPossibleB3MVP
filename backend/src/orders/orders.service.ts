import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {
    const stripeKey = process.env.STRIPE_SECRET_key;
    if (stripeKey && stripeKey !== 'sk_test_your_key_here') {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2024-12-18.acacia',
      } as any);
    }
  }

  async notifyOrderReady(sellerUserId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    // Vérifier que cette commande contient au moins un produit du vendeur
    const hasItemFromSeller = order.items.some((it) => it.product.ownerId === sellerUserId);
    if (!hasItemFromSeller) throw new BadRequestException('Not authorized for this order');

    // Ne pas rem arquer comme prête si déjà tous récupérés
    const alreadyPicked = order.items.every((it) => it.product.ownerId !== sellerUserId || it.pickedUp);
    if (alreadyPicked) throw new BadRequestException('Already picked up');

    // Marquer les items du vendeur comme prêts
    await this.prisma.orderItem.updateMany({
      where: { orderId, product: { ownerId: sellerUserId } },
      data: { sellerReady: true },
    });

    // Notifier le client
    await this.notifications.notify(order.userId, 'order:ready', 'Votre commande est prête à être récupérée.');
    return { ok: true };
  }

  async confirmOrderPickup(customerUserId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== customerUserId) throw new BadRequestException('Not your order');

    // Marquer les items prêts comme récupérés
    await this.prisma.orderItem.updateMany({
      where: { orderId, sellerReady: true, pickedUp: false },
      data: { pickedUp: true },
    });
    return { ok: true };
  }

  async createCheckoutFromCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Group items by seller (ownerId)
    const itemsByOwner = new Map<string, typeof cart.items>();
    for (const it of cart.items) {
      const ownerId = it.product.ownerId;
      const arr = itemsByOwner.get(ownerId) || [] as any;
      arr.push(it);
      itemsByOwner.set(ownerId, arr);
    }

    if (!this.stripe) {
      // Mode simulation sans Stripe: considérer le paiement comme réussi
      const LOW_STOCK_THRESHOLD = 5;
      const lowStockWarnings: Array<{ productId: string; name: string; stock: number }> = [];
      const createdOrders: Array<{ orderId: string; total: number }> = [];

      // Créer une commande par vendeur
      for (const [ownerId, ownerItems] of itemsByOwner.entries()) {
        const subtotal = ownerItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
        const order = await this.prisma.order.create({
          data: {
            userId,
            total: subtotal,
            status: OrderStatus.PAID,
            items: {
              create: ownerItems.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                priceAtPurchase: i.product.price,
              })),
            },
          },
        });
        createdOrders.push({ orderId: order.id, total: subtotal });
      }

      // Décrémenter les stocks et désactiver si épuisé
      for (const item of cart.items) {
        const current = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (!current) continue;
        const newStock = Math.max(0, Number(current.stock || 0) - Number(item.quantity || 0));
        const updated = await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: newStock, isActive: newStock > 0 },
        });
        if (newStock > 0 && newStock <= LOW_STOCK_THRESHOLD) {
          lowStockWarnings.push({ productId: updated.id, name: updated.name, stock: newStock });
        }
        // Notifier le vendeur du produit
        await this.notifications.notify(updated.ownerId, 'order:new', `Nouvelle commande: ${updated.name} x${item.quantity}`);
        if (newStock > 0 && newStock <= LOW_STOCK_THRESHOLD) {
          await this.notifications.notify(updated.ownerId, 'stock:low', `Stock faible: ${updated.name} (${newStock} restants)`);
        }
      }

      // Vider le panier
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        clientSecret: 'simulated_client_secret',
        orders: createdOrders,
        status: OrderStatus.PAID,
        lowStockWarnings,
        message: 'Paiement simulé: commande payée, stocks mis à jour et panier vidé.'
      };
    }

    // Stripe: un seul paiement global (simplifié)
    const total = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'eur',
      metadata: { cartUserId: userId },
      automatic_payment_methods: { enabled: true },
    });
    // Dans un vrai flux, il faudrait créer des PaymentIntents par vendeur
    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const order = await this.prisma.order.findFirst({ where: { paymentIntentId: pi.id } });
      if (!order) throw new NotFoundException('Order not found');
      await this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAID } });
    }
  }

  async listOrdersForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderForUser(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async listOrdersForSeller(sellerUserId: string) {
    // Orders containing products owned by the seller
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { ownerId: sellerUserId },
          },
        },
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  }
}

