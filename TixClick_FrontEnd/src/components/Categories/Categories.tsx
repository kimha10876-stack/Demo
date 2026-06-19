import { eventTypes } from "../../constants/constants";

interface CategoriesProps {
  onCategoryClick: (categoryId: number) => void;
}

const Categories = ({ onCategoryClick }: CategoriesProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 lg:px-14 py-12 bg-gradient-to-r from-[#FF8A00]/5 to-[#FF8A00]/10 overflow-x-auto">
      <div className="w-full text-center mb-6 md:hidden">
        <h2 className="text-2xl font-bold text-[#FF8A00]">Khám Phá Sự Kiện</h2>
        <p className="text-white/80">Chọn danh mục yêu thích của bạn</p>
      </div>

      {eventTypes.map((type) => {
        const Icon = type.icon;
        return (
          <div
            key={type.id}
            className="relative w-[340px] rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 group"
            onClick={() => onCategoryClick(type.id)}
          >
            <div className="overflow-hidden w-full rounded-xl">
              <img
                src={type.img || "/placeholder.svg"}
                alt={type.name}
                className="transition-transform duration-500 ease-in-out transform group-hover:scale-110 object-cover w-full h-[200px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 rounded-xl"></div>
            </div>
            <div
              style={{
                backgroundColor: type.color,
              }}
              className={`absolute bottom-0 left-0 w-full p-3 rounded-b-xl text-center transition-all duration-300 group-hover:h-1/3 flex flex-col justify-end`}
            >
              <p className="font-bold flex items-center justify-center text-base md:text-lg text-white">
                <Icon className="h-6 w-6 mr-2 text-white" />
                {type.vietnamName}
              </p>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Khám phá {type.vietnamName} hấp dẫn
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
