// import CompanyAccount from "./CompanyAccount";
import Statistic from "./Statistic";
import { BarChartComponent } from "./chart/BarChart";

const HomeCompany = () => {
  // const [query, setQuery] = useState("");

  // const handleSearch = () => {
  //   console.log("Searching for:", query);
  // };
  return (
    <div className="px-6 py-6 bg-transparent text-white overflow-y-hidden">
      <div className="flex-col lg:flex-row flex items-center gap-5">
        <Statistic
          label="Tổng sự kiện"
          quantity={10}
          subLabel="Sự kiện"
          percent={22}
        />
        <Statistic
          label="Tổng vé bán ra"
          quantity={4000}
          subLabel="Vé bán"
          percent={22}
        />
        <Statistic
          label="Tổng nhân sự"
          quantity={6}
          subLabel="Nhân sự"
          percent={22}
        />
        <Statistic
          label="Tổng hợp đồng"
          quantity={1}
          subLabel="Hợp đồng"
          percent={22}
        />
      </div>
      <div className="my-8">
        <BarChartComponent />
      </div>
    </div>
  );
};

export default HomeCompany;
