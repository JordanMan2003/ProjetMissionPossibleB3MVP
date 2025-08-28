"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = class OrdersService {
    prisma;
    notifications;
    stripe;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        const stripeKey = process.env.STRIPE_SECRET_key;
        if (stripeKey && stripeKey !== 'sk_test_your_key_here') {
            this.stripe = new stripe_1.default(stripeKey, {
                apiVersion: '2024-12-18.acacia',
            });
        }
    }
    async notifyOrderReady(sellerUserId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } }, user: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const hasItemFromSeller = order.items.some((it) => it.product.ownerId === sellerUserId);
        if (!hasItemFromSeller)
            throw new common_1.BadRequestException('Not authorized for this order');
        const alreadyPicked = order.items.every((it) => it.product.ownerId !== sellerUserId || it.pickedUp);
        if (alreadyPicked)
            throw new common_1.BadRequestException('Already picked up');
        await this.prisma.orderItem.updateMany({
            where: { orderId, product: { ownerId: sellerUserId } },
            data: { sellerReady: true },
        });
        await this.notifications.notify(order.userId, 'order:ready', 'Votre commande est prête à être récupérée.');
        return { ok: true };
    }
    async confirmOrderPickup(customerUserId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== customerUserId)
            throw new common_1.BadRequestException('Not your order');
        await this.prisma.orderItem.updateMany({
            where: { orderId, sellerReady: true, pickedUp: false },
            data: { pickedUp: true },
        });
        return { ok: true };
    }
    async createCheckoutFromCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const itemsByOwner = new Map();
        for (const it of cart.items) {
            const ownerId = it.product.ownerId;
            const arr = itemsByOwner.get(ownerId) || [];
            arr.push(it);
            itemsByOwner.set(ownerId, arr);
        }
        if (!this.stripe) {
            const LOW_STOCK_THRESHOLD = 5;
            const lowStockWarnings = [];
            const createdOrders = [];
            for (const [ownerId, ownerItems] of itemsByOwner.entries()) {
                const subtotal = ownerItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
                const order = await this.prisma.order.create({
                    data: {
                        userId,
                        total: subtotal,
                        status: client_1.OrderStatus.PAID,
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
            for (const item of cart.items) {
                const current = await this.prisma.product.findUnique({ where: { id: item.productId } });
                if (!current)
                    continue;
                const newStock = Math.max(0, Number(current.stock || 0) - Number(item.quantity || 0));
                const updated = await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: newStock, isActive: newStock > 0 },
                });
                if (newStock > 0 && newStock <= LOW_STOCK_THRESHOLD) {
                    lowStockWarnings.push({ productId: updated.id, name: updated.name, stock: newStock });
                }
                await this.notifications.notify(updated.ownerId, 'order:new', `Nouvelle commande: ${updated.name} x${item.quantity}`);
                if (newStock > 0 && newStock <= LOW_STOCK_THRESHOLD) {
                    await this.notifications.notify(updated.ownerId, 'stock:low', `Stock faible: ${updated.name} (${newStock} restants)`);
                }
            }
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            return {
                clientSecret: 'simulated_client_secret',
                orders: createdOrders,
                status: client_1.OrderStatus.PAID,
                lowStockWarnings,
                message: 'Paiement simulé: commande payée, stocks mis à jour et panier vidé.'
            };
        }
        const total = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'eur',
            metadata: { cartUserId: userId },
            automatic_payment_methods: { enabled: true },
        });
        return { clientSecret: paymentIntent.client_secret };
    }
    async handleWebhook(event) {
        if (event.type === 'payment_intent.succeeded') {
            const pi = event.data.object;
            const order = await this.prisma.order.findFirst({ where: { paymentIntentId: pi.id } });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            await this.prisma.order.update({ where: { id: order.id }, data: { status: client_1.OrderStatus.PAID } });
        }
    }
    async listOrdersForUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOrderForUser(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
            include: { items: { include: { product: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async listOrdersForSeller(sellerUserId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map