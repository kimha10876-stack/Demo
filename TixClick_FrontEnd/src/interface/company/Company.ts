export interface Company {
  companyId: number;
  companyName: string;
  codeTax: string;
  bankingName: string;
  bankingCode: string;
  email: string;
  ownerCard: string;
  nationalId: string;
  logoURL: string;
  address: string;
  description: string;
  status: string;
  representativeId: number;
}

export type CompanyStatus = "ACTIVE" | "PENDING" | "REJECTED";

interface CompanyList extends Company {
  subRole: string;
}

export interface CompanyListResponse {
  myCompany: CompanyList;
  listCompany: CompanyList[];
}
