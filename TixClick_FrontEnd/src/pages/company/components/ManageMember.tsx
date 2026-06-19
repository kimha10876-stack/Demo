import EmptyList from "../../../components/EmptyList/EmptyList";
import { Button } from "../../../components/ui/button";

const ManageMember = () => {
  return (
    <div className="px-6 py-6 bg-transparent text-white overflow-y-hidden">
      <div className="flex justify-between items-center text-[30px] font-semibold">
        <p>Members</p>
        <Button>Thêm thành viên</Button>
      </div>
      <div className="my-10">
        <EmptyList label="Không có thành viên nào" />
      </div>
    </div>
  );
};

export default ManageMember;
