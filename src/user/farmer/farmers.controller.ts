import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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

@UseGuards(ApiKeyGuard, JwtGuard)
@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

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

  @Delete()
  async deleteFarmer(@GetUser() user: User) {
    const farmer = await this.farmersService.deleteFarmer(user);
    return { success: true, farmer };
  }

  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user,
  ) {
    const farmer = await this.farmersService.updatePassword(
      updatePasswordDto,
      user,
    );

    return { success: true, farmer };
  }
}
