import { Search, User, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Popup from "../../../../components/Popup/Popup";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  MailList,
  MemberResponse,
  SubRole,
} from "../../../../interface/consumer/Member";
import accountApi from "../../../../services/accountApi";
import { AccountResponse } from "../../../../interface/manager/Account";
import { toast, Toaster } from "sonner";
import memberApi from "../../../../services/memberApi";
import companyApi from "../../../../services/companyApi";
import MemberList from "./MemberList";
import { subRoles, TOAST_MESSAGE } from "../../../../constants/constants";
import useCompany from "../../../../hooks/useCompany";
import NotHaveCompany from "../../../../components/Error/NotHaveCompany";
import LoadingFullScreen from "../../../../components/Loading/LoadingFullScreen";
const Member = () => {
  const { company, loading } = useCompany();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [accounts, setAccounts] = useState<AccountResponse[] | undefined>(
    undefined
  );
  const [mailList, setMailList] = useState<MailList[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [searchMember, setSearchMember] = useState<string>();
  const [members, setMembers] = useState<MemberResponse[] | undefined>(
    undefined
  );
  // const [checkedAccounts, setCheckedAccounts] = useState<Set<string>>(
  //   new Set()
  // );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchEmail);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchEmail]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await accountApi.search(debouncedSearch);
      //   console.log(response.data.result);
      if (response.data.result.length != 0) {
        setAccounts(response.data.result);
      } else {
        setAccounts([]);
      }
    };
    fetchData();
  }, [debouncedSearch]);

  const fetchMembers = async () => {
    const companyId = (await companyApi.isAccountHaveCompany()).data.result
      .companyId;
    const response = await memberApi.getMembers(companyId);
    if (response.data.result.length != 0) {
      setMembers(response.data.result);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearchEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const handlenOpenPopUp = () => {
    setIsOpen(true);
  };

  const handleClosePopUp = () => {
    setIsOpen(false);
  };

  const handleRemoveMail = (mail: string) => {
    setMailList((prev) => prev.filter((item) => item.mail !== mail));
  };

  const handleCreateMember = async () => {
    const companyId = (await companyApi.isAccountHaveCompany()).data.result
      .companyId;
    const response = await memberApi.create({
      companyId: companyId,
      mailList: mailList,
    });
    console.log(response);
    if (response.data.code == 201) {
      toast.success(TOAST_MESSAGE.successCreateMember);
    }
    handleClosePopUp();
    setMailList([]);
    await fetchMembers();
  };

  const filterMembers = searchMember
    ? members?.filter((member) =>
        member.email.toLowerCase().includes(searchMember.toLowerCase())
      )
    : members; // nếu searchMember rỗng thì trả lại toàn bộ danh sách

  console.log(mailList);

  if (loading) {
    return <LoadingFullScreen />;
  }

  if (!loading && company === null) {
    return (
      <div className="p-6 h-[calc(100vh-64px)]">
        <NotHaveCompany />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-2xl font-bold ">Thành viên công ty</div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="relative w-full my-8 sm:w-96">
          <input
            type="text"
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            placeholder={"Tìm email"}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-black"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <Button
          onClick={handlenOpenPopUp}
          className="bg-white text-black hover:bg-opacity-80"
        >
          Thêm thành viên
        </Button>
        <Popup
          isOpen={isOpen}
          onClose={handleClosePopUp}
          title="Thêm thành viên "
        >
          <div className="relative w-full my-4 sm:w-96 lg:w-auto">
            <Input
              type="text"
              placeholder={"Nhập email để tìm thành viên"}
              value={searchEmail}
              onChange={handleSearchEmail}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-black"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <h1 className="text-black">Kết quả tìm kiếm</h1>
          <div className="my-4 flex flex-col gap-2 max-h-60 overflow-y-auto">
            {accounts?.length == 0 && (
              <div className="text-center">Không có tài khoản tương thích</div>
            )}
            {accounts?.map((account) => {
              const selectedRole = selectedRoles[account.email];
              const isChecked = mailList.some(
                (item) => item.mail === account.email
              );

              const handleCheck = (checked: boolean) => {
                // Kiểm tra nếu chưa chọn role, hiển thị thông báo
                if (checked) {
                  if (!selectedRole) {
                    toast.error(
                      "Vui lòng chọn chức vụ trước khi thêm thành viên."
                    );
                    return;
                  }

                  // Thêm vào mailList nếu đã chọn role
                  setMailList((prev) => [
                    ...prev,
                    {
                      mail: account.email,
                      subRole: selectedRole as SubRole, // Sử dụng selectedRole đã có
                    },
                  ]);
                } else {
                  // Xóa khỏi mailList nếu bỏ chọn
                  setMailList((prev) =>
                    prev.filter((item) => item.mail !== account.email)
                  );
                }
              };

              const handleRoleChange = (value: SubRole) => {
                // Cập nhật selectedRoles với chức vụ mới
                setSelectedRoles((prev) => ({
                  ...prev,
                  [account.email]: value,
                }));

                // Cập nhật mailList khi thay đổi chức vụ
                setMailList((prev) =>
                  prev.map((item) =>
                    item.mail === account.email
                      ? { ...item, subRole: value }
                      : item
                  )
                );
              };

              return (
                <div
                  key={account.userName}
                  className="flex items-center justify-between w-full space-y-2 ring-black px-2 py-1 rounded-md transition-all duration-300s"
                >
                  <div className="flex items-center w-auto gap-2">
                    <Checkbox
                      checked={isChecked} // Đảm bảo trạng thái checkbox đúng
                      onCheckedChange={(checked) =>
                        handleCheck(checked as boolean)
                      } // Xử lý khi checkbox thay đổi
                    />
                    <div>
                      <User size={26} />
                    </div>
                    <div>
                      <p className="font-semibold max-w-32 truncate">
                        {account.userName}
                      </p>
                      <p className="text-xs max-w-32 truncate text-ellipsis">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Select
                      value={selectedRole || ""} // Đảm bảo giá trị chọn đúng
                      onValueChange={handleRoleChange} // Khi chọn chức vụ mới
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Chức vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Chức vụ</SelectLabel>
                          {subRoles.map((subRole) => (
                            <SelectItem key={subRole.id} value={subRole.value}>
                              {subRole.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-4">
            <ul className="flex flex-wrap gap-4">
              {mailList.map((item) => (
                <li
                  key={item.mail}
                  className="flex items-center w-52 truncate p-2 rounded-full border"
                >
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.mail}
                  </span>
                  <button
                    onClick={() => handleRemoveMail(item.mail)}
                    className="hover:bg-pse-gray/40 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between">
            <Button variant={"outline"} onClick={handleClosePopUp}>
              Quay lại
            </Button>
            <Button
              className={`${
                mailList.length != 0 ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={mailList.length != 0 ? false : true}
              onClick={handleCreateMember}
            >
              Xác nhận
            </Button>
          </div>
        </Popup>
      </div>
      <Toaster position="top-center" />

      {/* Member list */}
      <div>
        <MemberList members={filterMembers} fetchMembers={fetchMembers} />
      </div>
    </div>
  );
};

export default Member;
