# 🎓 VocPr (Vocabulary Practice)

[Tiếng Việt](#tiếng-việt) | [English](#english)

---

## Tiếng Việt

Ứng dụng web học từ vựng tiếng Anh ngoại tuyến. Ứng dụng chạy hoàn toàn trên trình duyệt, không yêu cầu thiết lập máy chủ.

### ✨ Các tính năng chính

- 📖 **Chế độ Học (Flashcards):** Xem từ vựng và nghĩa tiếng Việt với hiệu ứng lật thẻ tương tác.
- 📝 **Chế độ Kiểm tra (Test):** Đa dạng các loại bài tập giúp củng cố trí nhớ:
  - Nhập liệu (Typing)
  - Trắc nghiệm (Multiple Choice)
  - Ghép cặp (Matching)
- ⚙️ **Cấu hình bài thi:** Tùy chỉnh số lượng câu hỏi mỗi bài kiểm tra (10, 20, 50, hoặc tất cả).
- 📊 **Theo dõi lịch sử:** Tự động lưu kết quả bài thi và danh sách từ làm sai để ôn tập. Hỗ trợ tính năng xóa lịch sử học tập.
- 📥 **Quản lý từ vựng (Nhập/Xuất hàng loạt):**
  - Dễ dàng thêm hoặc cập nhật từ vựng bằng cách sao chép 2 cột (Tiếng Anh, Tiếng Việt) từ Excel/Google Sheets và dán vào phần nhập liệu.
  - Tự động nhận diện và bổ sung nghĩa mới nếu từ vựng đã tồn tại.
  - Xuất toàn bộ danh sách từ vựng hiện tại ra định dạng Excel (.tsv).
  - Khôi phục danh sách từ vựng về mặc định nhanh chóng.

### 🚀 Cách chạy ứng dụng

Chỉ cần mở tệp **`index.html`** bằng bất kỳ trình duyệt web nào (Chrome, Firefox, Safari, Edge, v.v.).

### 💡 Lưu ý dành cho nhà phát triển

- Dữ liệu từ vựng mặc định được tải từ tệp `assets/vocab.js`.
- Tất cả dữ liệu phát sinh (lịch sử, từ làm sai, từ vựng tùy chỉnh) đều được lưu trữ hoàn toàn ở phía người dùng (client-side) thông qua `localStorage`.
- Giao diện được xây dựng tinh gọn bằng HTML/JS/CSS thuần kết hợp với Tailwind CSS (nhúng qua CDN).
- Để chỉnh sửa dữ liệu gốc một cách hệ thống, vui lòng sử dụng các script chuyển đổi trong thư mục `scripts/` tại repository gốc.

## 📜 Bản quyền & Tài sản

Dự án được phát hành dưới giấy phép [MIT License](LICENSE).

### Thư viện bên thứ ba (tải qua CDN)

- [Tailwind CSS](https://tailwindcss.com/) — MIT License
- [Font Awesome](https://fontawesome.com/) — Free icons (CC BY 4.0)
- [Chart.js](https://www.chartjs.org/) — MIT License
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — ISC License

### Tài sản được tạo bởi AI

- `assets/buffalo_mascot.png` — Được tạo bởi Google Gemini (2026)
- `assets/bamboo_leaf.png` — Được tạo bởi Google Gemini (2026)

> **Lưu ý:** Theo quy định của Văn phòng Bản quyền Hoa Kỳ (2023), các hình ảnh thuần túy do AI tạo ra có thể không thuộc đối tượng được bảo hộ bản quyền. Các tài sản này được cung cấp "nguyên trạng" cùng với mã nguồn giấy phép MIT. Người dùng có quyền tự do sử dụng, sửa đổi và phân phối lại.

### 🤝 Đóng góp (Contributors)

Dự án này được xây dựng với sự hỗ trợ đắc lực từ:
- **Google Gemini:** Thiết kế hình ảnh (assets), tối ưu hóa giao diện và trải nghiệm người dùng (UX/UI).
- **Anthropic Claude:** Xây dựng cấu trúc mã nguồn, logic xử lý dữ liệu và các tính năng tương tác.

---

## English

An offline web application for learning English vocabulary. The app runs entirely in the browser without the need for additional server setup.

### ✨ Key Features

- 📖 **Learning Mode (Flashcards):** View vocabulary and Vietnamese meanings with click/flip card interactions.
- 📝 **Test Mode:** Various exercise types to reinforce memory:
  - Typing (Written)
  - Multiple Choice
  - Matching
- ⚙️ **Test Configuration:** Users can customize the number of questions per test (10, 20, 50, or all).
- 📊 **History Tracking:** Automatically saves test results and incorrect words for review. Supports clearing study history.
- 📥 **Vocabulary Management (Bulk Import / Export):**
  - Easily add or update vocabulary in bulk by copying 2 columns (English, Vietnamese) from Excel/Google Sheets and pasting them into the import section.
  - Automatically recognizes and adds new meanings if the word already exists.
  - Export the entire current vocabulary list to Excel (.tsv) format.
  - Quickly restore the vocabulary list to default.

### 🚀 How to Run the App

Simply open the **`index.html`** file with any web browser (Chrome, Firefox, Safari, Edge, etc.).

### 💡 Developer Notes

- Default vocabulary data is loaded from `assets/vocab.js`.
- All data generated during use, including test history, incorrect word lists, and new vocabulary (custom_vocab), is stored entirely on the client-side using `localStorage`.
- The interface is built simply and friendly using pure HTML/JS/CSS along with Tailwind CSS (included via CDN).
- If you want to modify the original vocabulary data properly, use the data conversion script located in the `scripts/` directory in the root repository.

---

## 📜 License & Asset Credits

This project is released under the [MIT License](LICENSE).

### Third-party Libraries (loaded via CDN)

- [Tailwind CSS](https://tailwindcss.com/) — MIT License
- [Font Awesome](https://fontawesome.com/) — Free icons (CC BY 4.0)
- [Chart.js](https://www.chartjs.org/) — MIT License
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — ISC License

### AI-Generated Assets

- `assets/buffalo_mascot.png` — Generated using Google Gemini (2026)
- `assets/bamboo_leaf.png` — Generated using Google Gemini (2026)

> **Note:** Per the US Copyright Office (2023), purely AI-generated images may not be eligible for copyright protection. These assets are provided "as-is" alongside the MIT-licensed source code. Users are free to use, modify, and redistribute them.

### 🤝 Contributors

This project was built with the invaluable support of:
- **Google Gemini:** Asset design, UI/UX optimization.
- **Anthropic Claude:** Core logic, data structure, and interactive features.

---

*Chúc bạn học tốt! / Happy learning!*
