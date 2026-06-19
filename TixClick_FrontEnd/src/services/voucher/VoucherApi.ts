
const voucherApi = {
  applyVoucher: async (voucherId: string) => {
    const response = await fetch(`https://tixclick.site/api/voucher/change-status/${voucherId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch vouchers');
    }
    return response.json();
  }
    
}

export default voucherApi;