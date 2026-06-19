import Avt from "../../../../assets/AvatarHuy.jpg";

type User = {
  name: string;
  position: string;
  email: string;
  status: "Active" | "Inactive";
};

const usersData: User[] = [
  {
    name: "Nguyễn Văn A",
    position: "Quản lý",
    email: "nguyenvana@example.com",
    status: "Active",
  },
  {
    name: "Trần Thị B",
    position: "Nhân viên",
    email: "tranthib@example.com",
    status: "Inactive",
  },
  {
    name: "Lê Văn C",
    position: "Giám đốc",
    email: "levanc@example.com",
    status: "Active",
  },
  {
    name: "Phạm Minh D",
    position: "Kế toán",
    email: "phamminhd@example.com",
    status: "Inactive",
  },
];

const MemberList = () => {
  return (
    <div className="bg-white border-2 border-[#bdbdbdb] p-6">
      <div className="flex justify-between items-center">
        <p className="font-bold text-[20px]">Member</p>
        <button className="bg-pse-gray bg-opacity-35 px-2 py-1 text-pse-green-second font-bold rounded-sm">
          Filter
        </button>
      </div>
      <table className="min-w-full mt-4 rounded-lg">
        <thead>
          <tr className="text-pse-gray">
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2 text-left">Chức vụ</th>
            <th className="px-4 py-2 text-left">Gmail</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <tr
              key={index}
              className="first:border-t font-bold border-[#bdbdbd"
            >
              <td className="px-4 py-2 flex items-center gap-2 ">
                <span>
                  <img src={Avt} className="rounded-full w-[32px] h-[32px]" />
                </span>
                {user.name}
              </td>
              <td className="px-4 py-2">{user.position}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className={`px-4 py-2 font-semibold`}>
                <div
                  className={`text-center px-2 rounded-md ${
                    user.status === "Active"
                      ? "bg-pse-success bg-opacity-20 text-pse-success"
                      : "text-pse-error bg-pse-error bg-opacity-20"
                  }`}
                >
                  {user.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
