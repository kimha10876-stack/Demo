import { useEffect, useState } from "react";
import { Company } from "../interface/company/Company";
import companyApi from "../services/companyApi";

type Props = {
  eventId: number;
};

const useAllCompany = ({ eventId }: Props) => {
  const [companies, setCompanies] = useState<Company>();

  const fetchCompanies = async () => {
    if (eventId) {
      try {
        const response = await companyApi.getByEventId(eventId);
        if (response.data.code == 200) {
          setCompanies(response.data.result);
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await companyApi.isAccountHaveCompany();
        if (response.data.code == 200) {
          setCompanies(response.data.result);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
  return companies;
};

export default useAllCompany;
