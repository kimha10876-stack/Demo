export interface Profile {
    accountId: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    // active: boolean;
    avatarURL: string | null;
    dob: Date;
    roleId: number;
    bankingName?: string
  bankingCode?: string
  ownerCard?: string

  }
  