import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReputationService } from './reputation.service';
import { ReputationResponseDto } from './dto/reputation-response.dto';

interface AuthenticatedUser {
  sub: string;
}

@ApiTags('Reputation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Consultar mi reputación',
  })
  @ApiResponse({
    status: 200,
    type: ReputationResponseDto,
  })
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.reputationService.findMyReputation(user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar reputación de un usuario',
  })
  @ApiResponse({
    status: 200,
    type: ReputationResponseDto,
  })
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.reputationService.findUserReputation(id);
  }
}
