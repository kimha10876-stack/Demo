const typeEvents = [
  {
    id: 1,
    type: "Sắp tới",
  },
  {
    id: 2,
    type: "Đã qua",
  },
  {
    id: 3,
    type: "Chờ duyệt",
  },
  {
    id: 4,
    type: "Nháp",
  },
];

const FilterEvent = () => {
  return (
    <div className="my-4 min-w-[330px]">
      <ul className="flex justify-between bg-white text-pse-gray px-4 py-2 rounded-md">
        {typeEvents.map((type) => (
          <li key={type.id}>{type.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilterEvent;
