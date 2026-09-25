import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaymentsEnabledGuard } from '../common/guards/feature-enabled.guard';

@ApiTags('payments')
@Controller('payments')
// Online payments switched off (owner's decision 2026-09-25): every route, webhook included, answers 404 unless FEATURE_PAYMENTS=true
@UseGuards(PaymentsEnabledGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  // ========================
  // Client Endpoints
  // ========================

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe checkout session (Client)' })
  @ApiResponse({ status: 201, description: 'Checkout session created' })
  createCheckout(@Body() dto: CreateCheckoutDto, @Request() req) {
    return this.paymentsService.createCheckout(dto, req.user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my payments (Client)' })
  findMyPayments(@Request() req) {
    return this.paymentsService.findByClientId(req.user.id);
  }

  // ========================
  // Webhook (no auth - validated by Stripe signature)
  // ========================

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      const event = this.stripeService.constructWebhookEvent(
        req.body as unknown as Buffer,
        signature,
      );
      await this.paymentsService.handleWebhookEvent(event);
      return { received: true };
    } catch (err) {
      throw new BadRequestException(`Webhook error: ${err.message}`);
    }
  }

  // ========================
  // Admin Endpoints
  // ========================

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin)' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment stats (Admin)' })
  getStats() {
    return this.paymentsService.getStats();
  }

  @Post('admin/refund/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund a payment (Admin)' })
  refund(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.refund(id);
  }
}
