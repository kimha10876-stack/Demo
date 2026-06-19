import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Popup from "../../components/Popup/Popup";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import ticketApi from "../../services/ticketApi";
import seatmapApi from "../../services/seatmapApi";
import LoadingFullScreen from "../../components/Loading/LoadingFullScreen";
import { StepProps } from "../../components/CreateEvent/steps/Step1_Infor";
import { formatMoney } from "../../lib/utils";

// Type definitions
// type SeatStatus = "available" | "disabled";
type ToolType = "select" | "add" | "remove" | "edit" | "move" | "addSeatType";
type ViewMode = "edit" | "preview";
export type SectionType = "SEATED" | "STANDING";

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export type SeatTypeEdit = {
  id: string;
  name: string;
  color: string;
  textColor: string;
  price: number;
  minQuantity?: number;
  maxQuantity?: number;
  eventId?: number;
};

export interface ISeat {
  id: string;
  row: number;
  column: number;
  // status: SeatStatus;
  price: number;
  seatTypeId: string;
  x?: number;
  y?: number;
}

export interface ISection {
  id: string;
  name: string;
  rows: number;
  columns: number;
  seats: ISeat[];
  x: number;
  y: number;
  width: number;
  height: number;
  type: SectionType;
  priceId?: string;
  price?: number; // Price for standing sections
  capacity?: number; // Capacity for standing sections
  isSave: boolean;
}

interface DraggableSectionProps {
  section: ISection;
  isActive: boolean;
  onSectionClick: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSeatClick: (seat: ISeat) => void;
  getSeatColor: (seat: ISeat) => string;
  seatTypes: SeatTypeEdit[];
}

interface SeatMapContainerProps {
  sections: ISection[];
  activeSection: string | null;
  setActiveSection: (id: string) => void;
  updateSection: (id: string, data: Partial<ISection>) => void;
  handleSeatClick: (seat: ISeat) => void;
  getSeatColor: (seat: ISeat) => string;
  seatTypes: SeatTypeEdit[];
}

// Draggable Section Component using react-draggable
const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  isActive,
  onSectionClick,
  onPositionChange,
  onSeatClick,
  getSeatColor,
  seatTypes,
}) => {
  // Track dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<ISeat | null>(null);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    setIsDragging(false);
    onPositionChange(data.x, data.y);
  };

  // Calculate seat size based on section dimensions
  // const seatSize = Math.min(
  //   (section.width - 80) / section.columns,
  //   (section.height - 80) / section.rows
  // );

  return (
    <Draggable
      position={{ x: section.x, y: section.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`absolute w-auto h-auto p-4 overflow-visible ${
          isActive ? "border-2 border-blue-500" : ""
        }`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          zIndex: isActive ? 10 : 1,
        }}
        onClick={() => !isDragging && onSectionClick()}
      >
        <div className="text-center text-gray-800 font-semibold mb-3">
          {section.name}
          {section.type == "STANDING" && (
            <div className="text-sm text-gray-600 mt-1">
              Khu vực đứng - {formatCurrency(section.price || 0)}
            </div>
          )}
        </div>
        {section.type == "STANDING" ? (
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg flex flex-col items-center justify-center text-gray-700 font-medium relative overflow-hidden"
            style={{
              width: section.width - 32,
              height: section.height - 32,
              minWidth: "180px",
              minHeight: "80px",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #6b7280 0, #6b7280 1px, transparent 0, transparent 50%)`,
                  backgroundSize: "10px 10px",
                }}
              />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-3 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-500">
                Số lượng: {section.capacity || 0} vé
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg">
            {Array.from({ length: section.rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex text-gray-700 gap-1.5 mb-1.5">
                <div
                  style={{
                    width: `25px`,
                    textAlign: "center",
                    height: "25px",
                    display: "flex",
                    fontSize: "12px",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                  }}
                  className="bg-gray-700 bg-opacity-20 rounded-md"
                >
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                {Array.from({ length: section.columns }).map((_, colIndex) => {
                  const seat = section.seats.find(
                    (s) => s.row == rowIndex && s.column == colIndex
                  );

                  if (!seat)
                    return (
                      <div
                        key={colIndex}
                        style={{
                          width: `25px`,
                          height: `25px`,
                          marginRight: "5px",
                        }}
                      ></div>
                    );

                  const seatColor = getSeatColor(seat);

                  return (
                    <div
                      key={colIndex}
                      className="flex items-center justify-center rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                      style={{
                        width: `25px`,
                        height: `25px`,
                        fontSize: `12px`,
                        backgroundColor:
                          // seat.status == "disabled" ? "#f3f4f6" : seatColor,
                          seatColor,
                        color:
                          // seat.status == "disabled"
                          //   ? "#9ca3af"
                          //   : seatTypes.find(
                          //       (type) => type.id == seat.seatTypeId
                          //     )?.textColor || "#000000",
                          seatTypes.find((type) => type.id == seat.seatTypeId)
                            ?.textColor || "#000000",
                        // opacity: seat.status == "disabled" ? 0.3 : 1,
                        marginRight: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDragging) onSeatClick(seat);
                      }}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      {String.fromCharCode(65 + rowIndex)}
                      {colIndex + 1}

                      {hoveredSeat && hoveredSeat.id == seat.id && (
                        <div
                          className="absolute z-20 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap shadow-lg"
                          style={{
                            bottom: rowIndex == 0 ? "auto" : "100%",
                            top: rowIndex == 0 ? "100%" : "auto",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: rowIndex == 0 ? "0" : "2px",
                            marginTop: rowIndex == 0 ? "2px" : "0",
                          }}
                        >
                          <div className="mb-1">
                            Hàng: {String.fromCharCode(65 + rowIndex)}
                          </div>
                          <div className="mb-1">Ghế: {colIndex + 1}</div>
                          <div className="mb-1">
                            Loại ghế:{" "}
                            {seatTypes.find(
                              (type) => type.id == seat.seatTypeId
                            )?.name || "Chưa xác định"}
                          </div>
                          <div className="mb-1">
                            Giá:{" "}
                            {formatMoney(
                              seatTypes.find(
                                (type) => type.id == seat.seatTypeId
                              )?.price
                            )}
                          </div>
                          {/* <div>
                            Trạng thái:{" "}
                            {seat.status == "available"
                              ? "Có sẵn"
                              : "Đã vô hiệu"}
                          </div> */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </Draggable>
  );
};

// Container for draggable sections
const SeatMapContainer: React.FC<SeatMapContainerProps> = ({
  sections,
  activeSection,
  setActiveSection,
  updateSection,
  handleSeatClick,
  getSeatColor,
  seatTypes,
}) => {
  return (
    <div
      className="relative mx-auto flex justify-center"
      style={{ width: "100%" }}
    >
      <div
        id="mapContainer"
        className="relative w-[1200px] h-[800px] bg-gray-100 border border-gray-300 rounded overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 p-5 bg-gray-800 text-white text-center">
          Sân khấu
        </div>

        {sections.map((section) => (
          <DraggableSection
            key={section.id}
            section={section}
            isActive={activeSection == section.id}
            onSectionClick={() => setActiveSection(section.id)}
            onPositionChange={(x, y) => updateSection(section.id, { x, y })}
            onSeatClick={handleSeatClick}
            getSeatColor={getSeatColor}
            seatTypes={seatTypes}
          />
        ))}
      </div>
    </div>
  );
};

// Main Application Component
const SeatChartDesigner: React.FC<StepProps> = ({ step, updateStep }) => {
  // Get event id;
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");

  const [sections, setSections] = useState<ISection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [currentSeatTypeId, setCurrentSeatTypeId] = useState<string | null>(
    null
  );
  const [addCurrentSeatTypeId, setAddCurrenSeatTypeId] = useState<
    string | null
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [newSectionRows, setNewSectionRows] = useState<string>("6");
  const [newSectionColumns, setNewSectionColumns] = useState<string>("8");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Seat types state
  const [seatTypes, setSeatTypes] = useState<SeatTypeEdit[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [price, setPrice] = useState<string>("0");
  const [maxQuantity, setMaxQuantity] = useState<string>("2");
  const [editingSeat, setEditingSeat] = useState<SeatTypeEdit | null>(null);

  const [newSectionType, setNewSectionType] = useState<SectionType>("SEATED");
  // const [standingPrice, setStandingPrice] = useState<number>(0);
  const [standingCapacity, setStandingCapacity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await ticketApi.getTicketsByEventId(Number(eventId));
        if (response.data.result.length > 0) {
          setSeatTypes(response.data.result);
        } else if (response.data.result.length == 0) {
          setSeatTypes([]);
        }
      } catch (error) {
        console.log("error fetch", error);
      }
    };
    getTickets();
  }, []);

  console.log(sections);

  useEffect(() => {
    const getSections = async () => {
      try {
        const response = await seatmapApi.getSections(Number(eventId));
        // console.log(response.data.result);
        if (response.data.result.length > 0) {
          setSections(response.data.result);
        }
        if (response.data.result.length == 0) {
          setSections(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSections();
  }, []);

  const handleSave = async () => {
    // Validate empty fields
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên loại ghế");
      return;
    }
    if (!color) {
      toast.error("Vui lòng chọn màu cho loại ghế");
      return;
    }
    if (!textColor) {
      toast.error("Vui lòng chọn màu chữ cho loại ghế");
      return;
    }
    if (!price) {
      toast.error("Vui lòng nhập giá cho loại ghế");
      return;
    }
    if (Number(price) <= 0) {
      toast.error("Giá ghế phải lớn hơn 0");
      return;
    }
    if (Number(maxQuantity) < 2) {
      toast.error("Số lượng vé tối đa phải lớn hơn hoặc bằng 2");
      return;
    }

    // Check for duplicate name
    const duplicateName = seatTypes.some(
      (type) =>
        type.name.toLowerCase() == name.trim().toLowerCase() &&
        (!editingSeat || type.id !== editingSeat.id)
    );
    if (duplicateName) {
      toast.error("Tên loại ghế đã tồn tại");
      return;
    }

    // Check for duplicate color
    const duplicateColor = seatTypes.some(
      (type) =>
        type.color.toLowerCase() == color.toLowerCase() &&
        (!editingSeat || type.id !== editingSeat.id)
    );
    if (duplicateColor) {
      toast.error("Màu này đã được sử dụng cho loại ghế khác");
      return;
    }

    if (editingSeat) {
      const editSeat = {
        ...editingSeat,
        name: name.trim(),
        color: color,
        textColor: textColor,
        price: Number(price),
        minQuantity: 1,
        maxQuantity: Number(maxQuantity),
      };
      ticketApi
        .updateTicket(editSeat)
        .then((response) => {
          console.log(response);
          setSeatTypes(response.data.result);
          toast.success("Cập nhật loại ghế thành công");
        })
        .catch((error) => console.log(error))
        .finally(() => setEditingSeat(null));
    } else {
      ticketApi
        .createTicketInSeatMap({
          id: Date.now().toString(),
          name: name.trim(),
          color,
          textColor,
          price: Number(price),
          minQuantity: 1,
          maxQuantity: Number(maxQuantity),
          eventId: Number(eventId),
        })
        .then((response) => {
          console.log(response);
          setSeatTypes(response.data.result);
        })
        .catch((error) => console.log(error));

      toast.success("Thêm loại ghế thành công");
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setColor("#000000");
    setTextColor("#FFFFFF");
    setPrice("0");
    setMaxQuantity("2");
  };

  const handleEdit = (seat: SeatTypeEdit) => {
    setEditingSeat(seat);
    setName(seat.name);
    setColor(seat.color);
    setTextColor(seat.textColor);
    setPrice(seat.price.toString());
  };

  const handleDelete = async (id: string) => {
    // Check if any seats are using this seat type
    const seatTypeInUse = sections.some((section) =>
      section.seats.some((seat) => seat.seatTypeId == id)
    );

    if (seatTypeInUse) {
      toast.error("Không thể xóa loại ghế đang được sử dụng");
      return;
    }

    const response = await ticketApi.deleteTicket(id);
    console.log(response);
    setSeatTypes(response.data.result);
    toast.success("Đã xóa loại ghế");
  };

  // Improved calculation of section size based on rows and columns
  const calculateSectionSize = (rows: number, columns: number) => {
    // Base size for each seat plus spacing
    const defaultSeatSize = 30; // Decreased from 40 to 30
    const seatGap = 5; // Decreased from 10 to 5
    const rowLabelWidth = 30; // Decreased from 40 to 30
    const headerHeight = 40; // Decreased from 50 to 40
    const padding = 12; // Decreased from 16 to 12

    // Calculate dimensions precisely including gaps
    const sectionWidth =
      columns * (defaultSeatSize + seatGap) + rowLabelWidth + padding;
    const sectionHeight =
      rows * (defaultSeatSize + seatGap) + headerHeight + padding;

    return {
      width: Math.max(sectionWidth, 120),
      height: Math.max(sectionHeight, 100),
    };
  };

  // Add a new section with calculated position
  const addSection = () => {
    if (newSectionType == "STANDING" && !addCurrentSeatTypeId) {
      toast.error("Vui lòng chọn giá vé cho khu vực đứng");
      return;
    }
    if (
      newSectionType == "STANDING" &&
      (!standingCapacity || standingCapacity <= 0)
    ) {
      toast.error("Vui lòng nhập số lượng vé cho khu vực đứng");
      return;
    }

    if (newSectionType == "SEATED") {
      if (Number(newSectionRows) <= 0 || Number(newSectionColumns) <= 0) {
        toast.error("Số hàng và số cột phải lớn hơn 0");
        return;
      }
      if (seatTypes.length == 0) {
        toast.error(
          "Vui lòng thêm ít nhất một loại ghế trước khi tạo khu vực có ghế"
        );
        return;
      }
    }

    // Calculate section dimensions based on rows and columns
    const { width: sectionWidth, height: sectionHeight } = calculateSectionSize(
      newSectionType == "SEATED" ? Number(newSectionRows) : 1,
      newSectionType == "SEATED" ? Number(newSectionColumns) : 1
    );

    // Calculate default position - center of the container
    const centerX = (1200 - sectionWidth) / 2;
    const centerY = (800 - sectionHeight) / 2;

    // Fint Seat object depend on currentSeatTypeId
    const seatObj = seatTypes.find((s) => s.id == addCurrentSeatTypeId);

    const newSection: ISection = {
      id: Date.now().toString(),
      name: `Section ${sections.length + 1}`,
      rows: newSectionType == "SEATED" ? Number(newSectionRows) : 1,
      columns: newSectionType == "SEATED" ? Number(newSectionColumns) : 1,
      seats: [],
      x: Math.max(0, centerX),
      y: Math.max(40, centerY),
      width: sectionWidth,
      height: sectionHeight,
      type: newSectionType,
      priceId: newSectionType == "STANDING" ? seatObj?.id : undefined,
      price: newSectionType == "STANDING" ? seatObj?.price : undefined,
      capacity: newSectionType == "STANDING" ? standingCapacity : undefined,
      isSave: false,
    };

    // Generate seats only for seated sections
    if (newSectionType == "SEATED") {
      newSection.seats = generateSeats(newSection);
    }
    // newSection.seats = generateSeats(newSection);

    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
    toast.success("Thêm khu vực mới thành công");
  };

  // Generate seats for a section
  const generateSeats = (section: ISection): ISeat[] => {
    const seats: ISeat[] = [];
    const defaultSeatType = seatTypes[0]; // Use first seat type as default if available

    for (let row = 0; row < section.rows; row++) {
      for (let col = 0; col < section.columns; col++) {
        seats.push({
          id: `${section.id}-r${row}-c${col}`,
          row,
          column: col,
          // status: "available",
          price: defaultSeatType?.price || Number(price),
          seatTypeId: defaultSeatType.id?.toString() || "",
        });
      }
    }
    return seats;
  };

  // Update a section
  const updateSection = (sectionId: string, data: Partial<ISection>) => {
    // console.log("update section");
    // Validate section name
    if (data.name !== undefined && !data.name.trim()) {
      toast.error("Tên khu vực không được để trống");
      return;
    }

    // // Validate standing price
    // if (data.price !== undefined && data.price <= 0) {
    //   toast.error("Giá khu vực đứng phải lớn hơn 0");
    //   return;
    // }

    // Validate rows and columns
    if (
      (data.rows !== undefined && data.rows <= 0) ||
      (data.columns !== undefined && data.columns <= 0)
    ) {
      toast.error("Số hàng và số cột phải lớn hơn 0");
      return;
    }

    setSections(
      sections.map((section) => {
        if (section.id == sectionId) {
          const updatedSection = { ...section, ...data };

          if (data.rows !== undefined || data.columns !== undefined) {
            const { width, height } = calculateSectionSize(
              updatedSection.rows,
              updatedSection.columns
            );
            updatedSection.width = width;
            updatedSection.height = height;
            updatedSection.seats = generateSeats(updatedSection);
          }

          return updatedSection;
        }
        return section;
      })
    );
    // toast.success("Cập nhật khu vực thành công");
  };

  // Handle seat click
  const handleSeatClick = (seat: ISeat) => {
    const sectionId = seat.id.split("-r")[0];
    const activeS = sections.find((s) => s.id == sectionId);
    if (!activeS) return;

    if (activeTool == "remove") {
      updateSection(sectionId, {
        seats: activeS.seats.map((s) =>
          s.id == seat.id ? { ...s, status: "disabled" } : s
        ),
      });
      toast.success("Đã vô hiệu hóa ghế");
    } else if (activeTool == "add" || activeTool == "edit") {
      if (!currentSeatTypeId) {
        toast.error("Vui lòng chọn loại ghế");
        return;
      }

      const selectedSeatType = seatTypes.find(
        (type) => type.id == currentSeatTypeId
      );
      if (!selectedSeatType) {
        toast.error("Loại ghế không hợp lệ");
        return;
      }

      updateSection(sectionId, {
        seats: activeS.seats.map((s) =>
          s.id == seat.id
            ? {
                ...s,
                status: "available",
                seatTypeId: currentSeatTypeId,
                price: selectedSeatType.price,
              }
            : s
        ),
      });
      toast.success(
        `Đã ${activeTool == "add" ? "thêm" : "cập nhật"} ghế thành công`
      );
    }
  };

  const exportData = () => {
    // console.log(JSON.stringify(sections, null, 2));
    setLoading(true);
    seatmapApi
      .createSeatmap(sections, Number(eventId))
      .then((response) => {
        console.log(JSON.stringify(response.data.result, null, 2));
        setSections(response.data.result);
        toast.success(response.data.message);
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };

  // Delete a section
  const deleteSection = async (sectionId: string) => {
    console.log(sectionId, eventId, JSON.stringify(sections, null, 2));
    const response = await seatmapApi.deleteSections(
      sectionId,
      Number(eventId),
      sections
    );
    if (response.data.result.length != 0) {
      setSections(response.data.result);
    } else {
      setSections(response.data.result);
    }
    toast.success(response.data.message);
  };

  // Export JSON data

  // Get color based on seat type
  const getSeatColor = (seat: ISeat): string => {
    // if (seat.status == "disabled") return "#e5e7eb"; // gray-200 color

    const seatType = seatTypes.find((type) => type.id == seat.seatTypeId);
    return seatType ? seatType.color : "#6b7280"; // Use actual color from seat type or gray-500 as default
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode == "edit" ? "preview" : "edit");
  };

  // Add form reset when closing popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingSeat(null);
    setName("");
    setColor("#000000");
    setTextColor("#FFFFFF");
    setPrice("0");
  };

  useEffect(() => {
    // Add a default section on startup
    if (sections.length == 0) {
      addSection();
    }
  }, []);
  console.log(JSON.stringify(sections, null, 2));

  return (
    <div className="container mx-auto p-6 bg-gray-200 min-h-screen">
      {loading && <LoadingFullScreen />}
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Thiết kế sơ đồ ghế
      </h1>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-md font-medium"
          onClick={() => {
            setActiveTool("addSeatType");
            setIsPopupOpen(true);
          }}
        >
          Thêm loại ghế
        </button>
        <button
          className={`px-6 py-2.5 rounded-lg transition-colors shadow-md font-medium ${
            viewMode == "preview"
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
          onClick={toggleViewMode}
        >
          {viewMode == "edit" ? "Xem trước" : "Quay lại chỉnh sửa"}
        </button>
        <button
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md font-medium"
          onClick={exportData}
        >
          Lưu sơ đồ
        </button>
      </div>

      {/* New Section Size Controls */}
      {viewMode == "edit" && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-4 border-b border-gray-200">
              Thông tin khu vực mới
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-900">
                  Loại khu vực:
                </label>
                <select
                  className="px-4 py-2.5 border rounded-lg w-full text-gray-700 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={newSectionType}
                  onChange={(e) =>
                    setNewSectionType(e.target.value as SectionType)
                  }
                >
                  <option value="SEATED">Khu vực có ghế</option>
                  <option value="STANDING">Khu vực đứng</option>
                </select>
              </div>

              {newSectionType == "STANDING" ? (
                <>
                  {/* <div>
                    <label className="block font-medium mb-2 text-gray-900">
                      Giá khu vực đứng (VND):
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2.5 border rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={standingPrice}
                      onChange={(e) => setStandingPrice(Number(e.target.value))}
                      min="0"
                    />
                  </div> */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-900">
                      Số lượng vé:
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2.5 border rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={standingCapacity}
                      onChange={(e) =>
                        setStandingCapacity(Number(e.target.value))
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Giá khu vực đứng
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={addCurrentSeatTypeId || ""}
                      onChange={(e) => {
                        setAddCurrenSeatTypeId(e.target.value);
                        // const seatId = seatTypes.find(
                        //   (s) => s.id == Number(e.target.value)
                        // );
                        // console.log(seatId);
                      }}
                    >
                      <option value="">Chọn loại ghế</option>
                      {seatTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} -{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(type.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-medium mb-2 text-gray-900">
                      Số hàng:
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2.5 border rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={newSectionRows}
                      onChange={(e) => setNewSectionRows(e.target.value)}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-gray-900">
                      Số cột:
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2.5 border rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={newSectionColumns}
                      onChange={(e) => setNewSectionColumns(e.target.value)}
                      min="1"
                      max="20"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
                onClick={addSection}
              >
                Thêm khu vực
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section settings if selected */}
      {activeSection && viewMode == "edit" && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-4 border-b border-gray-200">
              Cài đặt khu vực
            </h2>

            {/* Add section selector here */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">
                Danh sách khu vực:
              </h3>
              <div className="flex flex-wrap gap-3">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center">
                    <button
                      className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                        activeSection == section.id
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.name}
                    </button>
                    <button
                      className="ml-2 p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                      onClick={() => deleteSection(section.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-900">
                  Tên khu vực
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={
                    sections.find((s) => s.id == activeSection)?.name || ""
                  }
                  onChange={(e) =>
                    updateSection(activeSection, { name: e.target.value })
                  }
                />
              </div>
              {sections.find((s) => s.id == activeSection)?.type ==
              "STANDING" ? (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Giá khu vực đứng
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={currentSeatTypeId || ""}
                      onChange={(e) => {
                        setCurrentSeatTypeId(e.target.value);
                        const seatId = seatTypes.find(
                          (s) => s.id == e.target.value
                        );
                        // console.log(seatId);
                        updateSection(activeSection, {
                          priceId: seatId?.id,
                          price: seatId?.price,
                        });
                      }}
                    >
                      <option value="">Chọn loại ghế</option>
                      {seatTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} -{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(type.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Giá khu vực đứng (VND)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={
                        sections.find((s) => s.id == activeSection)?.price || 0
                      }
                      onChange={(e) =>
                        updateSection(activeSection, {
                          price: Number(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div> */}
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Số lượng vé
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={
                        sections.find((s) => s.id == activeSection)?.capacity ||
                        0
                      }
                      onChange={(e) =>
                        updateSection(activeSection, {
                          capacity: Number(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Số hàng
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={
                        sections.find((s) => s.id == activeSection)?.rows || 0
                      }
                      onChange={(e) =>
                        updateSection(activeSection, {
                          rows: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Số cột
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={
                        sections.find((s) => s.id == activeSection)?.columns ||
                        0
                      }
                      onChange={(e) =>
                        updateSection(activeSection, {
                          columns: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-gray-900">Công cụ:</h3>
              <div className="flex flex-wrap gap-3">
                {sections.find((s) => s.id == activeSection)?.type ==
                "SEATED" ? (
                  <>
                    <button
                      className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                        activeTool == "add"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                      onClick={() => setActiveTool("add")}
                    >
                      Thêm ghế
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                        activeTool == "edit"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                      onClick={() => setActiveTool("edit")}
                    >
                      Sửa ghế
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                        activeTool == "remove"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                      onClick={() => setActiveTool("remove")}
                    >
                      Xóa ghế
                    </button>
                  </>
                ) : null}

                <button
                  className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                    activeTool == "move"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                  onClick={() => setActiveTool("move")}
                >
                  Di chuyển
                </button>
              </div>
            </div>

            {(activeTool == "add" || activeTool == "edit") &&
              sections.find((s) => s.id == activeSection)?.type == "SEATED" && (
                <div className="mt-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Loại ghế
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={currentSeatTypeId || ""}
                      onChange={(e) => setCurrentSeatTypeId(e.target.value)}
                    >
                      <option value="">Chọn loại ghế</option>
                      {seatTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} -{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(type.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Seat Map and Legend Container */}
      <div className="mb-8 flex gap-6">
        {/* Seat Map */}
        <div className="flex-1 overflow-x-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="mb-4 text-center text-gray-600 text-sm font-medium">
            Kéo thả các khu vực để điều chỉnh vị trí
          </div>
          <SeatMapContainer
            sections={sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            updateSection={updateSection}
            handleSeatClick={handleSeatClick}
            getSeatColor={getSeatColor}
            seatTypes={seatTypes}
          />
        </div>

        {/* Legend */}
        {seatTypes.length > 0 && (
          <div className="w-80 bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit sticky top-6">
            <h3 className="text-gray-900 font-semibold mb-4">
              Chú thích loại ghế
            </h3>
            <div className="space-y-3">
              {seatTypes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow-md mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popup to edit seat type */}
      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title="Quản lý loại ghế"
      >
        <div>
          {/* Danh sách loại ghế */}
          <ul className="space-y-3 overflow-y-auto h-auto max-h-[150px] space-x-3 mb-6">
            {seatTypes.length == 0 && (
              <div className="text-black flex items-center justify-center">
                Không có vé nào
              </div>
            )}
            {seatTypes.map((seat) => (
              <li
                key={seat.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-8 h-8 rounded-lg shadow-md"
                    style={{ backgroundColor: seat.color }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">{seat.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(seat.price)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(seat)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(seat.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Form nhập liệu */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Tên loại ghế
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50"
                placeholder="Nhập tên loại ghế..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Màu nền ghế
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 border rounded-lg p-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Màu chữ
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-12 border rounded-lg p-1 bg-gray-50"
                />
              </div>
            </div>

            {/* Preview ghế */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Xem trước
              </label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className="flex items-center justify-center rounded-md shadow-md transition-all duration-200"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: color || "#000000",
                    color: textColor || "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  A1
                </div>
                <div className="text-sm text-gray-600">
                  {name ? name : "Tên loại ghế"} -{" "}
                  {formatCurrency(Number(price) || 0)}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block truncate text-gray-900 font-medium mb-2">
                  Số vé tối đa 1 người được mua
                </label>
                <input
                  type="number"
                  value={maxQuantity}
                  onChange={(e) => setMaxQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50"
                  min="2"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-6 shadow-md"
            >
              {editingSeat ? "Lưu thay đổi" : "Thêm loại ghế"}
            </button>
          </div>
        </div>
      </Popup>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => updateStep(step - 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Quay lại
        </button>

        <button
          onClick={() => updateStep(step + 1)}
          className="px-4 py-2 bg-pse-green-second hover:bg-pse-green-third text-white rounded disabled:opacity-50"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default SeatChartDesigner;
