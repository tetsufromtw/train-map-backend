import { IsOptional, IsString, IsNumber, IsEnum, IsUrl, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyType, CompanyStatus } from '../types/company.types';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company code', example: 1 })
  @IsNumber()
  companyCode: number;

  @ApiProperty({ description: 'Railway code', example: 11, minimum: 10, maximum: 99 })
  @IsNumber()
  @Min(10)
  @Max(99)
  railwayCode: number;

  @ApiProperty({ description: 'Company name', example: 'JR北海道' })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ description: 'Company name in katakana', example: 'ジェイアールホッカイドウ' })
  @IsOptional()
  @IsString()
  companyNameKana?: string;

  @ApiPropertyOptional({ description: 'Company official name', example: '北海道旅客鉄道株式会社' })
  @IsOptional()
  @IsString()
  companyNameOfficial?: string;

  @ApiPropertyOptional({ description: 'Company abbreviated name', example: 'JR北海道' })
  @IsOptional()
  @IsString()
  companyNameAbbreviated?: string;

  @ApiPropertyOptional({ description: 'Company website URL', example: 'http://www.jrhokkaido.co.jp/' })
  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @ApiPropertyOptional({ description: 'Company type', enum: CompanyType, example: CompanyType.JR })
  @IsOptional()
  @IsEnum(CompanyType)
  @Type(() => Number)
  companyType?: CompanyType;

  @ApiPropertyOptional({ description: 'Company status', enum: CompanyStatus, example: CompanyStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CompanyStatus)
  @Type(() => Number)
  status?: CompanyStatus;

  @ApiPropertyOptional({ description: 'Sort order', example: 1 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Railway code', example: 11, minimum: 10, maximum: 99 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(99)
  railwayCode?: number;

  @ApiPropertyOptional({ description: 'Company name', example: 'JR北海道' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Company name in katakana', example: 'ジェイアールホッカイドウ' })
  @IsOptional()
  @IsString()
  companyNameKana?: string;

  @ApiPropertyOptional({ description: 'Company official name', example: '北海道旅客鉄道株式会社' })
  @IsOptional()
  @IsString()
  companyNameOfficial?: string;

  @ApiPropertyOptional({ description: 'Company abbreviated name', example: 'JR北海道' })
  @IsOptional()
  @IsString()
  companyNameAbbreviated?: string;

  @ApiPropertyOptional({ description: 'Company website URL', example: 'http://www.jrhokkaido.co.jp/' })
  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @ApiPropertyOptional({ description: 'Company type', enum: CompanyType, example: CompanyType.JR })
  @IsOptional()
  @IsEnum(CompanyType)
  @Type(() => Number)
  companyType?: CompanyType;

  @ApiPropertyOptional({ description: 'Company status', enum: CompanyStatus, example: CompanyStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CompanyStatus)
  @Type(() => Number)
  status?: CompanyStatus;

  @ApiPropertyOptional({ description: 'Sort order', example: 1 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CompanyQueryDto {
  @ApiPropertyOptional({ description: 'Filter by company type', enum: CompanyType })
  @IsOptional()
  @IsEnum(CompanyType)
  @Transform(({ value }) => parseInt(value))
  companyType?: CompanyType;

  @ApiPropertyOptional({ description: 'Filter by company status', enum: CompanyStatus })
  @IsOptional()
  @IsEnum(CompanyStatus)
  @Transform(({ value }) => parseInt(value))
  status?: CompanyStatus;

  @ApiPropertyOptional({ description: 'Search in company names', example: 'JR' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Sort field', 
    enum: ['companyCode', 'railwayCode', 'companyName', 'companyNameKana', 'companyNameOfficial', 'companyNameAbbreviated', 'companyType', 'status', 'sortOrder'],
    example: 'sortOrder'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'companyCode' | 'railwayCode' | 'companyName' | 'companyNameKana' | 'companyNameOfficial' | 'companyNameAbbreviated' | 'companyType' | 'status' | 'sortOrder' = 'sortOrder';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class CompanyResponseDto {
  @ApiProperty({ description: 'Company code', example: 1 })
  companyCode: number;
  
  @ApiProperty({ description: 'Railway code', example: 11 })
  railwayCode: number;
  
  @ApiProperty({ description: 'Company name', example: 'JR北海道' })
  companyName: string;
  
  @ApiPropertyOptional({ description: 'Company name in katakana', example: 'ジェイアールホッカイドウ' })
  companyNameKana?: string;
  
  @ApiPropertyOptional({ description: 'Company official name', example: '北海道旅客鉄道株式会社' })
  companyNameOfficial?: string;
  
  @ApiPropertyOptional({ description: 'Company abbreviated name', example: 'JR北海道' })
  companyNameAbbreviated?: string;
  
  @ApiPropertyOptional({ description: 'Company website URL', example: 'http://www.jrhokkaido.co.jp/' })
  companyUrl?: string;
  
  @ApiPropertyOptional({ description: 'Company type', enum: CompanyType, example: CompanyType.JR })
  companyType?: CompanyType;
  
  @ApiPropertyOptional({ description: 'Company status', enum: CompanyStatus, example: CompanyStatus.ACTIVE })
  status?: CompanyStatus;
  
  @ApiPropertyOptional({ description: 'Sort order', example: 1 })
  sortOrder?: number;
}

export class PaginatedCompanyResponseDto {
  @ApiProperty({ description: 'Company data', type: [CompanyResponseDto] })
  data: CompanyResponseDto[];
  
  @ApiProperty({ description: 'Total number of companies', example: 100 })
  total: number;
  
  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;
  
  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
  
  @ApiProperty({ description: 'Total pages', example: 10 })
  totalPages: number;
}