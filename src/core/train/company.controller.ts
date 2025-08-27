import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyQueryDto,
  CompanyResponseDto,
  PaginatedCompanyResponseDto,
} from '../../shared/dto/company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new railway company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ status: 201, description: 'Company successfully created', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  create(@Body() createCompanyDto: CreateCompanyDto): CompanyResponseDto {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all railway companies with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully', type: PaginatedCompanyResponseDto })
  findAll(@Query() query: CompanyQueryDto): PaginatedCompanyResponseDto {
    const result = this.companyService.findAll(query);
    return result;
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all company types' })
  @ApiResponse({ status: 200, description: 'Company types retrieved successfully' })
  getCompanyTypes(): { value: number; label: string }[] {
    return this.companyService.getCompanyTypes();
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Get all company statuses' })
  @ApiResponse({ status: 200, description: 'Company statuses retrieved successfully' })
  getCompanyStatuses(): { value: number; label: string }[] {
    return this.companyService.getCompanyStatuses();
  }

  @Get('reload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reload companies data from CSV file' })
  @ApiResponse({ status: 200, description: 'Data reloaded successfully' })
  reloadFromCSV(): { message: string } {
    this.companyService.reloadFromCSV();
    return { message: 'Companies reloaded from CSV successfully' };
  }

  @Get(':companyCode')
  @ApiOperation({ summary: 'Get a railway company by company code' })
  @ApiParam({ name: 'companyCode', description: 'Company code', type: Number })
  @ApiResponse({ status: 200, description: 'Company found', type: CompanyResponseDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(@Param('companyCode', ParseIntPipe) companyCode: number): CompanyResponseDto {
    return this.companyService.findOne(companyCode);
  }

  @Patch(':companyCode')
  @ApiOperation({ summary: 'Update a railway company' })
  @ApiParam({ name: 'companyCode', description: 'Company code', type: Number })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Company updated successfully', type: CompanyResponseDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  update(
    @Param('companyCode', ParseIntPipe) companyCode: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): CompanyResponseDto {
    return this.companyService.update(companyCode, updateCompanyDto);
  }

  @Delete(':companyCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a railway company' })
  @ApiParam({ name: 'companyCode', description: 'Company code', type: Number })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(@Param('companyCode', ParseIntPipe) companyCode: number): void {
    this.companyService.remove(companyCode);
  }
}