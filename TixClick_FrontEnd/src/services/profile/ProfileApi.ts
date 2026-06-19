import axiosClient from "../axiosClient";

const profileApi = {
  getProfile() {
    const url = "/account/my-profile";
    return axiosClient.get(url);
  },

  getAdminProfile() {
    const url = "/account/my-profile";
    const token = localStorage.getItem("accessToken2");

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // updateProfile(data: Profile) {
  //     const url = "/account/update-profile";
  //     const token = localStorage.getItem("accessToken");

  //     return axiosClient.put(url,data, {
  //         headers: {
  //             Authorization: `Bearer ${token}`
  //         }
  //     });
  //   },

  // In ProfileApi.js
  async updateProfile(data: any, avatarFile: File | null) {
    const url = "/account/update-profile";
    const formData = new FormData();

    // Append text fields
    if (data.firstName !== null) formData.append("firstName", data.firstName);
    if (data.lastName !== null) formData.append("lastName", data.lastName);
    if (data.email !== null) formData.append("email", data.email);
    if (data.phone !== null) formData.append("phone", data.phone);
    if (data.bankingCode !== null) formData.append("bankingCode", data.bankingCode);
    if (data.bankingName !== null) formData.append("bankingName", data.bankingName);
    if (data.ownerCard !== null) formData.append("ownerCard", data.ownerCard);

    if (data.dob !== null) {
      const dobValue =
        data.dob instanceof Date ? data.dob.toISOString() : data.dob;
      formData.append("dob", dobValue);
    }

    if (avatarFile) {
      formData.append("avatarURL", avatarFile);
    }

    return axiosClient.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default profileApi;
