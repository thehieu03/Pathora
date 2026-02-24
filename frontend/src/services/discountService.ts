import { api, API_ENDPOINTS } from "@/api";

const discountEndpoints = API_ENDPOINTS.DISCOUNT;

export const discountService = {
  getAllCoupons: () => api.get(discountEndpoints.GET_ALL_COUPONS),
  getCouponById: (id: string) => api.get(discountEndpoints.GET_DETAIL(id)),
  createCoupon: (payload: unknown) => api.post(discountEndpoints.CREATE, payload),
  updateCoupon: (id: string, payload: unknown) =>
    api.put(discountEndpoints.UPDATE(id), payload),
  deleteCoupon: (id: string) => api.delete(discountEndpoints.DELETE(id)),
  approveCoupon: (id: string) =>
    api.put(discountEndpoints.APPROVE_COUPON(id)),
  rejectCoupon: (id: string) => api.put(discountEndpoints.REJECT_COUPON(id)),
  updateValidityPeriod: (id: string, payload: unknown) =>
    api.patch(discountEndpoints.UPDATE_VALIDITY_PERIOD(id), payload),
};

export default discountService;
