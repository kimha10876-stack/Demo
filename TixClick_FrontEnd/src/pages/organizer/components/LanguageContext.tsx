import { createContext, ReactNode, useContext, useState } from "react";

type Language = "en" | "vi";

const translations = {
  vi: {
    title: "Sự kiện đã tạo",
    search: "Tìm kiếm sự kiện",
    filters: {
      all: "Tất cả",
      draft: "Nháp",
      pending: "Chờ duyệt",
      confirmed: "Chờ hợp đồng",
      scheduled: "Diễn ra",
      completed: "Đã nhận tiền",
      rejected: "Từ chối",
      cancelled: "Bị hủy",
      ended: "Đã qua",
    },
    menu: {
      tickets: "Vé đã mua",
      myEvents: "Sự kiện của tôi",
      profile: "Trang cá nhân",
      signOut: "Đăng xuất",
    },
    nav: {
      events: "Sự kiện đã tạo",
      fileManagement: "Quản lý xuất file",
      createEvent: "Tạo sự kiện",
      terms: "Điều khoản cho Ban tổ chức",
      members: "Thành viên ban tổ chức",
      tasks: "Phân chia công việc",
      revenue: "Doanh thu",
    },
    account: "Tài khoản",
    language: "Ngôn ngữ",
    sidebar: {
      title: "Consumer Center",
      myEvents: "Sự kiện của tôi",
      reports: "Quản lý báo cáo",
      terms: "Điều khoản cho Ban tổ chức",
      members: "Thành viên ban tổ chức",
      tasks: "Phân chia công việc",
      revenue: "Doanh thu",
      information: "Thông tin công ty",
    },
    myEvents: {
      search: "Tìm kiếm sự kiện",
      searchButton: "Tìm kiếm",
      tabs: {
        upcoming: "Sắp tới",
        past: "Đã qua",
        pending: "Chờ duyệt",
        draft: "Nháp",
      },
      empty: {
        title: "Chưa có sự kiện nào",
        description: "Bạn chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!",
      },
    },
    reports: {
      columns: {
        file: "File",
        createdAt: "Ngày Tạo",
        creator: "Người tạo",
        status: "Trạng thái xử lý",
        actions: "Thao tác",
      },
      empty: {
        title: "Không có dữ liệu",
        description: "Chưa có báo cáo nào được tạo",
      },
    },
    terms: {
      items: [
        {
          id: "1",
          title: "Danh mục hàng hoá, dịch vụ cấm kinh doanh",
          content:
            "Các mặt hàng và dịch vụ sau đây bị cấm kinh doanh trên nền tảng của chúng tôi:\n\n- Vũ khí, chất nổ và các vật phẩm nguy hiểm\n- Chất cấm và dược phẩm không được phép\n- Hàng giả, hàng nhái thương hiệu\n- Các dịch vụ tài chính bất hợp pháp\n- Dịch vụ đánh bạc và cờ bạc\n- Nội dung khiêu dâm hoặc người lớn\n- Dịch vụ vi phạm pháp luật\n\nVi phạm các quy định này có thể dẫn đến việc đình chỉ hoặc chấm dứt tài khoản của bạn.",
          category: "prohibited",
        },
        {
          id: "2",
          title: "Danh mục hàng hoá, dịch vụ cấm quảng cáo",
          content:
            "Các mặt hàng và dịch vụ sau đây bị cấm quảng cáo trên nền tảng của chúng tôi:\n\n- Thuốc lá và các sản phẩm liên quan đến thuốc lá\n- Đồ uống có cồn khi nhắm đến người dưới tuổi quy định\n- Dịch vụ y tế không được cấp phép\n- Sản phẩm làm đẹp chưa được kiểm chứng\n- Dịch vụ tài chính đa cấp\n- Nội dung chính trị gây chia rẽ\n- Quảng cáo có nội dung phân biệt đối xử\n\nTất cả quảng cáo phải tuân thủ luật pháp địa phương và quốc gia.",
          category: "advertising",
        },
        {
          id: "3",
          title: "Quy định kiểm duyệt nội dung & hình ảnh",
          content:
            "Quy định kiểm duyệt nội dung và hình ảnh trên nền tảng của chúng tôi:\n\n- Nội dung phải phù hợp với thuần phong mỹ tục\n- Không chứa ngôn từ thù địch hoặc kích động bạo lực\n- Không vi phạm bản quyền hoặc sở hữu trí tuệ\n- Hình ảnh phải rõ ràng và không gây hiểu lầm\n- Không sử dụng hình ảnh người khác mà không được phép\n- Không chứa thông tin cá nhân nhạy cảm\n- Nội dung phải trung thực và chính xác\n\nTất cả nội dung sẽ được kiểm duyệt trước khi xuất hiện công khai trên nền tảng.",
          category: "content",
        },
      ],
    },
    appPromo: {
      title: "Ticketbox Event Manager",
      subtitle: "Dễ dàng quản lý\ntất cả sự kiện",
      downloadText: "Tải ứng dụng Ticketbox Event Manager",
    },
    header: {
      account: "Tài khoản",
    },
    eventFilter: {
      search: "Tìm kiếm",
      searchPlaceholder: "Nhập tên sự kiện",
      eventType: "Loại sự kiện",
      all: "Tất cả",
      online: "Trực tuyến",
      offline: "Trực tiếp",
      category: "Danh mục",
      selectCategory: "Chọn danh mục",
      categories: {
        music: "Âm nhạc",
        sports: "Thể thao",
        arts: "Nghệ thuật",
      },
      applyFilter: "Áp dụng bộ lọc",
    },
  },
  en: {
    title: "Created Events",
    search: "Search events",
    filters: {
      all: "All",
      draft: "Draft",
      pending: "pending",
      confirmed: "confirmed",
      scheduled: "scheduled",
      completed: "completed",
      rejected: "rejected",
      cancelled: "cancelled",
      ended: "ended",
    },
    menu: {
      tickets: "My Tickets",
      myEvents: "My Events",
      profile: "Profile",
      signOut: "Sign out",
    },
    nav: {
      events: "Created Events",
      fileManagement: "File Management",
      createEvent: "Create Event",
      terms: "Organizer Terms",
      members: "Company Employee",
      tasks: "Tasks",
      revenue: "Revenue",
    },
    account: "Account",
    language: "Language",
    sidebar: {
      title: "Consumer Center",
      myEvents: "My Events",
      reports: "Reports Management",
      terms: "Organizer Terms",
      members: "Company Employee",
      tasks: "Tasks",
      revenue: "Revenue",
      information: "Company Information",
    },
    myEvents: {
      search: "Search events",
      searchButton: "Search",
      tabs: {
        upcoming: "Upcoming",
        past: "Past",
        pending: "Pending",
        draft: "Draft",
      },
      empty: {
        title: "No events yet",
        description: "You have no events yet. Create your first event!",
      },
    },
    reports: {
      columns: {
        file: "File",
        createdAt: "Created Date",
        creator: "Creator",
        status: "Status",
        actions: "Actions",
      },
      empty: {
        title: "No data",
        description: "No reports have been created yet",
      },
    },
    terms: {
      items: [
        {
          id: "1",
          title: "Prohibited Goods and Services",
          content:
            "The following goods and services are prohibited from being sold on our platform:\n\n- Weapons, explosives, and dangerous items\n- Illegal substances and unauthorized pharmaceuticals\n- Counterfeit goods and brand imitations\n- Illegal financial services\n- Gambling services\n- Pornographic or adult content\n- Services that violate the law\n\nViolation of these regulations may result in suspension or termination of your account.",
          category: "prohibited",
        },
        {
          id: "2",
          title: "Prohibited Advertising Items",
          content:
            "The following goods and services are prohibited from being advertised on our platform:\n\n- Tobacco and tobacco-related products\n- Alcoholic beverages targeting underage individuals\n- Unlicensed medical services\n- Unverified beauty products\n- Multi-level financial services\n- Divisive political content\n- Advertisements with discriminatory content\n\nAll advertisements must comply with local and national laws.",
          category: "advertising",
        },
        {
          id: "3",
          title: "Content & Image Review Policy",
          content:
            "Content and image review policy on our platform:\n\n- Content must be appropriate and in good taste\n- No hostile language or incitement to violence\n- No copyright or intellectual property violations\n- Images must be clear and not misleading\n- No unauthorized use of others' images\n- No sensitive personal information\n- Content must be honest and accurate\n\nAll content will be reviewed before appearing publicly on the platform.",
          category: "content",
        },
      ],
    },
    appPromo: {
      title: "Ticketbox Event Manager",
      subtitle: "Easily manage\nall your events",
      downloadText: "Download Ticketbox Event Manager",
    },
    header: {
      account: "Account",
    },
    eventFilter: {
      search: "Search",
      searchPlaceholder: "Enter event name",
      eventType: "Event Type",
      all: "All",
      online: "Online",
      offline: "Offline",
      category: "Category",
      selectCategory: "Select category",
      categories: {
        music: "Music",
        sports: "Sports",
        arts: "Arts",
      },
      applyFilter: "Apply Filter",
    },
  },
};

interface LanguageContextType {
  language: Language;
  t: typeof translations.en;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
