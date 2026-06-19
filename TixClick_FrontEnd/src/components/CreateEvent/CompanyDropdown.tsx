import React, { useState } from "react";
import { cn } from "../../lib/utils"; // Giả sử có hàm cn từ shadcn/ui để gộp class
import { Company } from "../../interface/company/Company";

interface CompanyStackProps {
  companies: Company[] | undefined;
  selectedCompanyId: number | null; // Nhận từ cha để biết công ty nào được chọn
  onSelectCompany: (companyId: number) => void; // Hàm callback truyền từ cha
}

const CompanyDropdown: React.FC<CompanyStackProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="mb-4 text-white">Chọn công ty</p>
      {/* Danh sách công ty dạng "khối gỗ" */}
      <div className="relative flex flex-col gap-2">
        {companies && companies.length > 0 ? (
          companies.map((company, index) => (
            <div
              key={company.companyId}
              onClick={() => onSelectCompany(company.companyId)} // Gọi hàm từ cha
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative flex items-center justify-between p-3 bg-background border border-input rounded-md shadow-sm cursor-pointer transition-all duration-300",
                hoveredIndex === index && "translate-x-4 shadow-md", // Hiệu ứng "rút" khi hover
                selectedCompanyId === company.companyId &&
                  "bg-primary text-primary-foreground border-primary shadow-lg" // UI nổi bật khi được chọn
              )}
              style={{
                zIndex: companies.length - index, // Xếp chồng như Jenga
              }}
            >
              <div className="flex items-center gap-3">
                {/* Ảnh công ty */}
                <img
                  src={company.logoURL}
                  alt={`${company.companyName} logo`}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ID: {company.companyId}
                  </span>
                  <span className="text-sm truncate">
                    {company.companyName}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-sm text-muted-foreground text-center">
            Không có công ty nào
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDropdown;
