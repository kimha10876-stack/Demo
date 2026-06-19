export interface customAccount {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}



export interface Document {
  contract_id: number
  file_name: string
  file_type: string
  uploaded_date: string
  file_url?: string
  company_id: number
}


export interface CompanyDocument {
  companyDocumentId: number
  companyId: number
  fileName: string
  fileType: string
  fileURL: string
  uploadDate: string
}

export interface CustomAccount {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
}

export interface Company {
  address: string
  email: string
  bankingCode: string
  bankingName: string
  codeTax: string
  companyDocument: CompanyDocument[]
  companyId: number
  companyName: string
  companyVerificationId: number
  customAccount: CustomAccount
  description: string
  logoURL: string
  nationalId: string
  status: string
}
