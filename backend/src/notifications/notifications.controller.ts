import { Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.notifications.listForUser(req.user.userId);
  }

  @Put(':id/read')
  async markRead(@Req() req: any, @Param('id') id: string) {
    return this.notifications.markAsRead(req.user.userId, id);
  }
}


