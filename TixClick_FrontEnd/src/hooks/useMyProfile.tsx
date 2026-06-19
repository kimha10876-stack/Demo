import { useEffect, useState } from "react";
import { AdminAccount } from "../interface/admin/Account";
import accountApi from "../services/accountApi";

const useMyProfile = () => {
  const [profile, setProfile] = useState<AdminAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await accountApi.getProfile();
      if (response.data.result) {
        setProfile(response.data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  return { profile, loading };
};

export default useMyProfile;
