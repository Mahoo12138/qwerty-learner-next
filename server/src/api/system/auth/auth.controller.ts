import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { SigninReqDto } from './dto/signin.req.dto';
import { SigninResDto } from './dto/signin.res.dto';
import { CreateApiTokenReqDto } from './dto/create-api-token.req.dto';
import { CreateApiTokenResDto } from './dto/create-api-token.res.dto';
import { ListApiTokensResDto } from './dto/list-api-tokens.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { Uuid } from '@/common/types/common.type';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Login in',
  })
  @Post('login')
  async login(
    @Body() userLogin: LoginReqDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<LoginResDto> {
    return await this.authService.login(userLogin, userAgent);
  }

  @ApiPublic({
    summary: 'Sign in',
  })
  @Post('signin')
  async signin(@Body() dto: SigninReqDto): Promise<SigninResDto> {
    return await this.authService.signin(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiAuth({
    type: CreateApiTokenResDto,
    summary: 'Create API token',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('api-tokens')
  async createApiToken(
    @CurrentUser() userToken: JwtPayloadType,
    @Body() dto: CreateApiTokenReqDto,
  ): Promise<CreateApiTokenResDto> {
    return await this.authService.createApiToken(userToken.id as Uuid, dto);
  }

  @ApiAuth({
    type: ListApiTokensResDto,
    summary: 'List API tokens',
    errorResponses: [400, 401, 403, 500],
  })
  @Get('api-tokens')
  async listApiTokens(
    @CurrentUser() userToken: JwtPayloadType,
  ): Promise<ListApiTokensResDto> {
    return await this.authService.listApiTokens(userToken.id as Uuid);
  }

  @ApiAuth({
    summary: 'Delete API token',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @Delete('api-tokens/:tokenId')
  async deleteApiToken(
    @CurrentUser() userToken: JwtPayloadType,
    @Param('tokenId') tokenId: string,
  ): Promise<void> {
    await this.authService.deleteApiToken(userToken.id, tokenId);
  }

  @ApiPublic()
  @Post('forgot-password')
  async forgotPassword() {
    return 'forgot-password';
  }

  @ApiPublic()
  @Post('verify/forgot-password')
  async verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @ApiPublic()
  @Post('reset-password')
  async resetPassword() {
    return 'reset-password';
  }

  @ApiPublic()
  @Get('verify/email')
  async verifyEmail() {
    return 'verify-email';
  }

  @ApiPublic()
  @Post('verify/email/resend')
  async resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
