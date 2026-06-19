import { useEffect, useState } from "react";
import { Company } from "../interface/company/Company";
import companyApi from "../services/companyApi";

const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await companyApi.isAccountHaveCompany();
      console.log(res.data.result);
      if (res.data.code == 200) {
        setCompany(res.data.result);
      } else {
        setCompany(null);
      }
    } catch (error) {
      if (error) setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);
  return { company, loading };
};

export default useCompany;
