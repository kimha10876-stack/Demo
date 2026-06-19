import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css"; // Import file CSS để chỉnh font

interface TextEditorProps {
  onChange?: (value: string) => void;
}

const defaultContent = `
<p><strong>Giới thiệu sự kiện:</strong></p><p>[Tóm tắt ngắn gọn về sự kiện: Nội dung chính của sự kiện, điểm đặc sắc nhất và lý do khiến người tham gia không nên bỏ lỡ]</p><p><strong>Chi tiết sự kiện:</strong></p><ul><li><strong>Chương trình chính:</strong> [Liệt kê những hoạt động nổi bật trong sự kiện: các phần trình diễn, khách mời đặc biệt, lịch trình các tiết mục cụ thể nếu có.]</li><li><strong>Khách mời:</strong> [Thông tin về các khách mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. Có thể bao gồm phần mô tả ngắn gọn về họ và những gì họ sẽ mang lại cho sự kiện.]</li><li><strong>Trải nghiệm đặc biệt:</strong> [Nếu có các hoạt động đặc biệt khác như workshop, khu trải nghiệm, photo booth, khu vực check-in hay các phần quà/ưu đãi dành riêng cho người tham dự.]</li></ul><p><strong>Điều khoản và điều kiện:</strong></p><p>[TnC] sự kiện</p><p><strong>Lưu ý về điều khoản trẻ em:</strong> [Chi tiết về quy định dành cho trẻ em nếu có.]</p><p><strong>Lưu ý về điều khoản VAT:</strong> [Thông tin về thuế VAT và các khoản phí khác nếu áp dụng.]</p>
`;

const TextEditor: React.FC<TextEditorProps> = ({ onChange }) => {
  const [content, setContent] = useState<string>(defaultContent);

  const handleChange = (value: string) => {
    setContent(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="bg-white text-black my-2 mx-2">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ size: ["14px"] }], // Chỉ cho phép 14px, nhưng thực tế CSS sẽ kiểm soát
            [{ list: "ordered" }, { list: "bullet" }], // Danh sách chấm, số
            ["bold", "italic", "underline"], // In đậm, in nghiêng, gạch chân
            [{ align: [] }], // Căn lề trái, phải, giữa
            ["clean"], // Xóa định dạng
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true,
          },
        }}
        formats={[
          "size",
          "list",
          "bold",
          "italic",
          "underline",
          "align",
          "clean",
        ]}
      />
      {/* <h3>Xem trước:</h3>
      <div
        className="editor-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      /> */}
    </div>
  );
};

export default TextEditor;
