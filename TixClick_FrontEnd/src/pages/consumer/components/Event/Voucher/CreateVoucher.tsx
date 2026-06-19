import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Popup from "../../../../../components/Popup/Popup";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { VoucherRequest } from "../../../../../interface/company/Voucher";
import { DateTimePicker } from "./DateTimePicker";
import voucherApi from "../../../../../services/voucherApi";
import { useParams } from "react-router";
import { toast } from "sonner";
import { TOAST_MESSAGE } from "../../../../../constants/constants";
import { AxiosError } from "axios";

type Props = {
  onCreated: () => void;
};

const initialVoucher: VoucherRequest = {
  voucherName: "",
  voucherCode: "",
  discount: 0,
  eventId: 0,
  quantity: 0,
  startDate: "",
  endDate: "",
};

const CreateVoucher = ({ onCreated }: Props) => {
  const { eventId } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm<VoucherRequest>({
    defaultValues: initialVoucher,
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: VoucherRequest) => {
    try {
      const updateEventId = { ...data, eventId: Number(eventId) };
      // console.log(updateEventId);
      const response = await voucherApi.create(updateEventId);
      if (response.data.code == 200) {
        toast.success(TOAST_MESSAGE.createVoucherSuccess);
        onCreated();
      }
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(error);
      toast.error(axiosError.response?.data.message);
    }

    handleClose();
  };

  return (
    <section className="w-full my-4">
      <Button onClick={handleOpen} className="bg-foreground text-background">
        Tạo mã giảm giá
      </Button>
      <Popup isOpen={isOpen} onClose={handleClose} title="Tạo mã giảm giá">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <div>
            <Label htmlFor="voucherCode">Mã code</Label>
            <Input
              id="voucherCode"
              {...register("voucherCode", {
                required: "Vui lòng nhập mã code",
              })}
              placeholder="Ví dụ: BACKTOSCHOOL2025"
            />
            {errors.voucherCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.voucherCode.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="voucherName">Tên mã giảm giá</Label>
            <Input
              id="voucherName"
              {...register("voucherName", { required: "Vui lòng nhập tên mã" })}
              placeholder="Ví dụ: Giảm 10% cho đơn hàng"
            />
            {errors.voucherName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.voucherName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="discount">Phần trăm giảm(%)</Label>
            <Input
              id="discount"
              type="number"
              {...register("discount", {
                required: "Vui lòng nhập phần trăm giảm",
                min: { value: 1, message: "Giảm ít nhất 1%" },
                max: { value: 80, message: "Không được quá 80%" },
              })}
              placeholder="Nhập số từ 1 đến 80"
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="discount">Số lượng mã giảm</Label>
            <Input
              id="discount"
              type="number"
              {...register("quantity", {
                required: "Vui lòng nhập số lượng",
                min: { value: 1, message: "Số lượng phải ít nhất là 1" },
              })}
              placeholder="Số lượng mã giảm"
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <Label className="flex flex-col gap-1" htmlFor="startDate">
              Ngày bắt đầu áp dụng
              <span className="text-xs text-pse-gray">
                Hệ thống sẽ tự động kích hoạt khi đến ngày bắt đầu
              </span>
            </Label>
            <Controller
              control={control}
              name="startDate"
              rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
              render={({ field }) => (
                <DateTimePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date.toISOString())}
                  placeholder="Chọn ngày bắt đầu"
                />
              )}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* Ngày kết thúc */}
          <div>
            <Label className="flex flex-col gap-1" htmlFor="endDate">
              Ngày hết hiệu lực
              <span className="text-xs text-pse-gray">
                Hệ thống sẽ tự động vô hiệu hóa khi đến ngày kết thúc
              </span>
            </Label>
            <Controller
              control={control}
              name="endDate"
              rules={{
                required: "Vui lòng chọn ngày kết thúc",
                validate: (value) => {
                  if (!value) return "Vui lòng chọn ngày kết thúc";
                  const start = new Date(getValues("startDate"));
                  const end = new Date(value);
                  return end > start || "Ngày kết thúc phải sau ngày bắt đầu";
                },
              }}
              render={({ field }) => (
                <DateTimePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date.toISOString())}
                  placeholder="Chọn ngày kết thúc"
                />
              )}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">Tạo mã</Button>
          </div>
        </form>
      </Popup>
    </section>
  );
};

export default CreateVoucher;
