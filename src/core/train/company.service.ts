import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { Company, CompanyQuery } from '../../shared/types/company.types';
import { CreateCompanyDto, UpdateCompanyDto } from '../../shared/dto/company.dto';

@Injectable()
export class CompanyService {
  private companies: Company[] = [];
  private readonly csvFilePath = path.join(process.cwd(), 'src/data/raw/company.csv');

  constructor() {
    this.loadCompaniesFromCSV();
  }

  private loadCompaniesFromCSV(): void {
    try {
      console.log('Loading CSV from:', this.csvFilePath);
      const csvData = fs.readFileSync(this.csvFilePath, 'utf-8');
      console.log('CSV file size:', csvData.length, 'characters');
      
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === 'company_cd' || 
              context.column === 'rr_cd' || 
              context.column === 'company_type' || 
              context.column === 'e_status' || 
              context.column === 'e_sort') {
            const parsed = parseInt(value);
            return isNaN(parsed) ? undefined : parsed;
          }
          return value === '' ? undefined : value;
        }
      });
      
      // Convert CSV snake_case fields to camelCase
      this.companies = records.map((record: any) => ({
        companyCode: record.company_cd,
        railwayCode: record.rr_cd,
        companyName: record.company_name,
        companyNameKana: record.company_name_k || undefined,
        companyNameOfficial: record.company_name_h || undefined,
        companyNameAbbreviated: record.company_name_r || undefined,
        companyUrl: record.company_url || undefined,
        companyType: record.company_type,
        status: record.e_status,
        sortOrder: record.e_sort
      }));
      console.log('Successfully loaded', this.companies.length, 'companies from CSV');
      console.log('First company:', this.companies[0]);
    } catch (error) {
      console.error('Failed to load companies from CSV:', error);
      console.error('CSV file path:', this.csvFilePath);
      console.error('File exists:', fs.existsSync(this.csvFilePath));
      this.companies = [];
    }
  }

  findAll(query: CompanyQuery = {}): { data: Company[], total: number, page: number, limit: number, totalPages: number } {
    let filteredCompanies = [...this.companies];

    if (query.companyType !== undefined) {
      filteredCompanies = filteredCompanies.filter(c => c.companyType === query.companyType);
    }

    if (query.status !== undefined) {
      filteredCompanies = filteredCompanies.filter(c => c.status === query.status);
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(c => 
        c.companyName?.toLowerCase().includes(searchLower) ||
        c.companyNameKana?.toLowerCase().includes(searchLower) ||
        c.companyNameOfficial?.toLowerCase().includes(searchLower) ||
        c.companyNameAbbreviated?.toLowerCase().includes(searchLower)
      );
    }

    if (query.sortBy && query.sortOrder) {
      filteredCompanies.sort((a, b) => {
        const aVal = a[query.sortBy!];
        const bVal = b[query.sortBy!];
        
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return query.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredCompanies.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filteredCompanies.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCompanies.length / limit)
    };
  }

  findOne(companyCode: number): Company {
    const company = this.companies.find(c => c.companyCode === companyCode);
    if (!company) {
      throw new NotFoundException(`Company with code ${companyCode} not found`);
    }
    return company;
  }

  create(createCompanyDto: CreateCompanyDto): Company {
    const existingCompany = this.companies.find(c => c.companyCode === createCompanyDto.companyCode);
    if (existingCompany) {
      throw new Error(`Company with code ${createCompanyDto.companyCode} already exists`);
    }

    const newCompany: Company = {
      ...createCompanyDto,
    };

    this.companies.push(newCompany);
    return newCompany;
  }

  update(companyCode: number, updateCompanyDto: UpdateCompanyDto): Company {
    const companyIndex = this.companies.findIndex(c => c.companyCode === companyCode);
    if (companyIndex === -1) {
      throw new NotFoundException(`Company with code ${companyCode} not found`);
    }

    this.companies[companyIndex] = {
      ...this.companies[companyIndex],
      ...updateCompanyDto,
    };

    return this.companies[companyIndex];
  }

  remove(companyCode: number): void {
    const companyIndex = this.companies.findIndex(c => c.companyCode === companyCode);
    if (companyIndex === -1) {
      throw new NotFoundException(`Company with code ${companyCode} not found`);
    }

    this.companies.splice(companyIndex, 1);
  }

  getCompanyTypes(): { value: number, label: string }[] {
    return [
      { value: 0, label: 'その他' },
      { value: 1, label: 'JR' },
      { value: 2, label: '大手私鉄' },
      { value: 3, label: '準大手私鉄' }
    ];
  }

  getCompanyStatuses(): { value: number, label: string }[] {
    return [
      { value: 0, label: '運用中' },
      { value: 1, label: '運用前' },
      { value: 2, label: '廃止' }
    ];
  }

  reloadFromCSV(): void {
    this.loadCompaniesFromCSV();
  }
}