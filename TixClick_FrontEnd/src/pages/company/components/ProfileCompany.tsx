import {
  BadgePercent,
  Banknote,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
} from "lucide-react";

import CompanyAvt from "../../../assets/AvatarHuy.jpg";
import { Button } from "../../../components/ui/button";
import { NavLink } from "react-router";
interface AccountCompanyInterface {
  id: number;
  label: string;
  data: string;
  icon: React.ReactNode;
  canEdit: boolean;
}

const accountInfor: AccountCompanyInterface[] = [
  {
    id: 1,
    label: "Tên công ty",
    data: "ABC Company",
    icon: <Building2 className="mr-2" />,
    canEdit: false,
  },
  {
    id: 2,
    label: "Mô tả công ty",
    data: "Công ty chuyên cung cấp giải pháp phần mềm.",
    icon: <FileText className="mr-2" />,
    canEdit: true,
  },
  {
    id: 3,
    label: "Mã số thuế",
    data: "1234567890",
    icon: <CreditCard className="mr-2" />,
    canEdit: false,
  },
  {
    id: 4,
    label: "Tên ngân hàng",
    data: "Ngân hàng ABC",
    icon: <Banknote className="mr-2" />,
    canEdit: true,
  },
  {
    id: 5,
    label: "Số tài khoản",
    data: "1234 5678 9012",
    icon: <ClipboardList className="mr-2" />,
    canEdit: true,
  },
  {
    id: 6,
    label: "Căn cước công dân",
    data: "079123456789",
    icon: <BadgePercent className="mr-2" />,
    canEdit: false,
  },
];
console.log(accountInfor);

const ProfileCompany = () => {
  return (
    <div className="px-6 py-6 space-y-4 md:space-y-6 md:w-[500px] mx-auto">
      <div className="flex items-center gap-3">
        <img
          src={CompanyAvt}
          className="w-[100px] md:w-[150px] h-[100px] md:h-[150px] rounded-lg"
        />
        <div className="flex flex-col gap-2 md:gap-4">
          <p className="text-[30px] font-bold">ABC Company</p>
          <p className="text-[20px] font-medium text-pse-gray">
            Địa chỉ công ty
          </p>
        </div>
      </div>
      <div className="text-pse-gray">
        Công ty ABC là doanh nghiệp hàng đầu trong lĩnh vực cung cấp giải pháp
        phần mềm và dịch vụ công nghệ thông tin. Với đội ngũ chuyên gia giàu
        kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất
        lượng cao, giúp doanh nghiệp tối ưu hóa quy trình vận hành và nâng cao
        hiệu suất làm việc. Chúng tôi không ngừng đổi mới, áp dụng các công nghệ
        tiên tiến để đáp ứng nhu cầu ngày càng cao của khách hàng. Sứ mệnh của
        chúng tôi là đồng hành cùng doanh nghiệp trên con đường chuyển đổi số,
        hướng tới sự phát triển bền vững và thành công.
      </div>
      <section>
        <h1 className="text-pse-green-second text-[25px]">Chi tiết:</h1>
        <div>
          <ul className="space-y-2">
            <li className="font-bold">
              Tên ngân hàng:{" "}
              <span className="font-medium">
                Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)
              </span>
            </li>
            <li className="font-bold">
              Số tài khoản:{" "}
              <span className="font-medium">1903 4567 8910 1234</span>
            </li>
            <li className="font-bold">
              Mã số thuế: <span className="font-medium">0312345678</span>
            </li>
            <li className="font-bold ">
              Căn cước công dân:{" "}
              <span className="font-medium">079123456789</span>
            </li>
          </ul>
        </div>
      </section>
      <div className="flex justify-center">
        <NavLink to="/company">
          <Button>Hoàn tất</Button>
        </NavLink>
      </div>
      {/* <Popup isOpen={openEdit} onClose={handleCloseEdit} title="Chỉnh sửa">
        <div className="space-y-4">
          {accountInfor.map((item) => (
            <InputCanEdit
              key={item.id}
              label={item.label}
              icon={item.icon}
              text={item.data}
              canEdit={item.canEdit}
            />
          ))}
        </div>
      </Popup> */}
    </div>
  );
};

export default ProfileCompany;
