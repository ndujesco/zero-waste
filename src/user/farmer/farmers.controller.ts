import { Controller, Get, Query } from '@nestjs/common';
import { GetFarmersByTypeDto } from './dtos/get-farmers-by-type.dto';
import { FarmersService } from './farmers.service';
import { GetFarmersFromSearchDto } from './dtos/get-farmers-search';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get('type')
  async getFarmersByType(@Query() getFarmersByTypeDto: GetFarmersByTypeDto) {
    const farmers = await this.farmersService.getFarmersByType(
      getFarmersByTypeDto,
    );
    return { sucess: true, farmers };
  }

  @Get('search')
  async getFarmersBySearch(
    @Query() getFarmersFromSearch: GetFarmersFromSearchDto,
  ) {
    const farmers = await this.farmersService.getFamersFromSearch(
      getFarmersFromSearch,
    );
    return { sucess: true, farmers };
  }
}
