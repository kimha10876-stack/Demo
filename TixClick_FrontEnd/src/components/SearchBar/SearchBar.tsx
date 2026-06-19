import { FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submitSearchValue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("searchValue") as string;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("event-name", searchValue); // Thêm hoặc cập nhật tham số 'area'
    navigate(`/search?${searchParams.toString()}`);
  };
  return (
    <form onSubmit={submitSearchValue}>
      <div className="hidden lg:flex items-center">
        <span className="bg-white pl-4 py-2 rounded-tl-lg rounded-bl-lg">
          <LuSearch size={21} color="black" />
        </span>
        <input
          name="searchValue"
          placeholder="Bạn tìm gì?"
          className="px-4 py-2 text-black outline-none"
        />
        <button
          type="submit"
          className="bg-white pr-4 py-2 text-black rounded-tr-lg rounded-br-lg"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
