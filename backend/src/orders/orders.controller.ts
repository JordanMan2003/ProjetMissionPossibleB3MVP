import { Body, Controller, Get, Headers, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { OrdersService } from './orders.service';
import Stripe from 'stripe';
import type { Request, Response } from 'express';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: any) {
    return this.ordersService.createCheckoutFromCart(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async listMyOrders(@Req() req: any) {
    return this.ordersService.listOrdersForUser(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('seller')
  async listSellerOrders(@Req() req: any) {
    return this.ordersService.listOrdersForSeller(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.getOrderForUser(req.user.userId, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/ready')
  async notifyReady(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.notifyOrderReady(req.user.userId, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/pickup-confirm')
  async confirmPickup(@Req() req: any, @Param('id') id: string) {
    // Client confirme la récupération
    return this.ordersService.confirmOrderPickup(req.user.userId, id);
  }

  @Post('webhook')
  async webhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature?: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_key || '', {
      apiVersion: '2024-12-18.acacia',
    } as any);
    try {
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody || (req as any).body,
        signature || '',
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
      await this.ordersService.handleWebhook(event);
      res.json({ received: true });
    } catch (err) {
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }
  }
}

