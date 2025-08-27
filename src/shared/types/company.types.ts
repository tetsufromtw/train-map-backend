export interface Company {
  companyCode: number;
  railwayCode: number;
  companyName: string;
  companyNameKana?: string;
  companyNameOfficial?: string;
  companyNameAbbreviated?: string;
  companyUrl?: string;
  companyType?: CompanyType;
  status?: CompanyStatus;
  sortOrder?: number;
}

export enum CompanyType {
  OTHER = 0,
  JR = 1,
  MAJOR_PRIVATE = 2,
  SEMI_MAJOR_PRIVATE = 3,
}

export enum CompanyStatus {
  ACTIVE = 0,
  PRE_OPERATION = 1,
  ABOLISHED = 2,
}

export interface CompanyQuery {
  companyType?: CompanyType;
  status?: CompanyStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'companyCode' | 'railwayCode' | 'companyName' | 'companyNameKana' | 'companyNameOfficial' | 'companyNameAbbreviated' | 'companyType' | 'status' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
}