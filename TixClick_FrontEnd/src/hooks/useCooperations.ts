import { useEffect, useState } from "react";
import { CompanyListResponse } from "../interface/company/Company";
import companyApi from "../services/companyApi";

const useCooperations = () => {
  const [listCompany, setListCompany] = useState<CompanyListResponse>();
  const [loading, setLoading] = useState<boolean>();

  const fetchListCompany = async () => {
    setLoading(true);
    try {
      const res = await companyApi.getListCompany();
      console.log(res);
      if (res.data.code == 200) {
        setListCompany(res.data.result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListCompany();
  }, []);

  return { listCompany, loading };
};

export default useCooperations;
