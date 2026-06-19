import { Search } from "lucide-react";

const SearchEvent = () => {
  return (
    <div>
      <form className="flex items-center bg-white pl-2 pr-4 py-2 rounded-md">
        <Search color="black" className="mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện"
          className="outline-none text-pse-black-light"
        />
        <button type="submit" className="text-black ml-auto border-l pl-2">
          Tìm
        </button>
      </form>
    </div>
  );
};

export default SearchEvent;
