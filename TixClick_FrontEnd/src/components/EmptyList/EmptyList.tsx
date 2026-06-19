import EmptyImg from "../../assets/no content backup.png";

type EmptyListType = {
  label: string;
};

const EmptyList = ({ label }: EmptyListType) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={EmptyImg} className="w-64 h-64" />
      <p>{label}</p>
    </div>
  );
};

export default EmptyList;
