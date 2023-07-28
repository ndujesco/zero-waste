import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetFarmersByTypeDto } from './dtos/get-farmers-by-type.dto';
import { FarmersService } from './farmers.service';
import { GetFarmersFromSearchDto } from './dtos/get-farmers-search';
import { GetUser } from '../auth/get-user-decorator';
import { ApiKeyGuard } from 'src/api-strategy';
import { JwtGuard } from '../auth/jwt.strategy';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { User } from '@prisma/client';
import { VerifyPasswordDto } from './dtos/verify-password-otp.dto';

@UseGuards(ApiKeyGuard)
@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @UseGuards(JwtGuard)
  @Get('type')
  async getFarmersByType(
    @Query() getFarmersByTypeDto: GetFarmersByTypeDto,
    @GetUser() user,
  ) {
    const farmers = await this.farmersService.getFarmersByType(
      getFarmersByTypeDto,
      user,
    );
    return { success: true, farmers };
  }

  @UseGuards(JwtGuard)
  @Get('search')
  async getFarmersBySearch(
    @Query() getFarmersFromSearch: GetFarmersFromSearchDto,
    @GetUser() user,
  ) {
    const farmers = await this.farmersService.getFamersFromSearch(
      getFarmersFromSearch,
      user,
    );
    return { success: true, farmers };
  }

  @UseGuards(JwtGuard)
  @Delete()
  async deleteFarmer(@GetUser() user: User) {
    const farmer = await this.farmersService.deleteFarmer(user);
    return { success: true, farmer };
  }

  @Get('request-update')
  async requestUpdatePassword(@Query('email') email: string) {
    const farmer = await this.farmersService.requestUpdatePassword(email);
    return { success: true, farmer };
  }

  @Get('verify-password-otp')
  async verifyPasswordOtp(@Query() verifyPasswordDto: VerifyPasswordDto) {
    const farmer = await this.farmersService.verifyPasswordOtp(
      verifyPasswordDto,
    );
    return { success: true, farmer };
  }

  @Patch('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const farmer = await this.farmersService.updatePassword(updatePasswordDto);
    return { success: true, farmer };
  }
}
