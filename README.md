# 🎓 VocPr (Vocabulary Practice)

![VocPr Banner](assets/banner.png)

[Tiếng Việt](#tiếng-việt) | [English](#english)

---

## Tiếng Việt

Ứng dụng web học từ vựng đa ngôn ngữ ngoại tuyến. Hỗ trợ bất kỳ cặp ngôn ngữ nào (ví dụ: Anh-Việt, Trung-Nhật, v.v.) và chạy hoàn toàn trên trình duyệt, không yêu cầu thiết lập máy chủ.

### ✨ Các tính năng nổi bật

- 🌏 **Hỗ trợ đa ngôn ngữ (i18n):** Giao diện linh hoạt giữa Tiếng Việt và Tiếng Anh.
- 🧩 **Tùy biến cặp ngôn ngữ:** Tự định nghĩa tên ngôn ngữ (L1/L2) cho bộ từ vựng của riêng bạn.
- 📖 **Chế độ Học (Flashcards) nâng cấp:** 
  - Trải nghiệm lật thẻ mượt mà với hiệu ứng glassmorphism hiện đại.
  - Tính năng **"Đã thuộc" (Mark as Known/Memorized)** để tự động loại bỏ các từ đã biết khỏi vòng lặp học tập, giúp tập trung học từ mới.
- 📝 **Chế độ Kiểm tra (Test) thông minh:** 
  - Đa dạng loại câu hỏi: Nhập liệu, Trắc nghiệm, Ghép cặp.
  - Tự động xáo trộn và tạo câu hỏi từ cả hai chiều (L1 ↔ L2).
- 📥 **Quản lý dữ liệu mạnh mẽ:**
  - **Nhập liệu linh hoạt:** Hỗ trợ copy-paste từ Excel với nhiều dấu phân cách (`Tab`, `:`, `-`, `|`).
  - **Tải file trực tiếp:** Hỗ trợ upload file `.xlsx`, `.xls`, `.csv`.
  - **Drag & Drop:** Kéo thả file trực tiếp vào vùng nhập liệu để xử lý tức thì (hỗ trợ đầy đủ cả trên thiết bị di động).
  - **Bảng kiểm soát (Review):** Xem và xác nhận dữ liệu (từ mới, cập nhật nghĩa) trước khi lưu vào máy.
- 📊 **Theo dõi tiến độ thông minh:** Biểu đồ thống kê kết quả, streak học tập hàng ngày, theo dõi trực quan số lượng/phần trăm từ "Đã thuộc" theo thời gian thực và ôn tập lại các từ làm sai.
- 📱 **Hỗ trợ Mobile tối ưu (Adaptive Mode):** 
  - Chế độ tối ưu riêng cho điện thoại, khóa tỷ lệ khung hình và ngăn cuộn đàn hồi (elastic scroll) để mang lại trải nghiệm mượt mà như ứng dụng gốc.
  - Tự động thu nhỏ Mascot chú trâu (Buffalo Mascot) 50% giúp giải phóng không gian màn hình nhỏ, tinh tế và dễ nhìn hơn.
- 🌗 **Chế độ tối (Dark Mode):** Giao diện dịu mắt cho việc học vào ban đêm, tối ưu hóa độ tương phản và hiển thị Mascot.

### 🖼️ Giao diện ứng dụng

![VocPr Screenshot](assets/screenshot.png)

### 📖 Hướng dẫn sử dụng

#### 1. Cách nạp từ vựng từ Excel/Google Sheets
Ứng dụng hỗ trợ nạp từ vựng hàng loạt rất nhanh chóng:
1. Chuẩn bị file Excel/Google Sheets với **2 cột** (Cột 1: Từ gốc, Cột 2: Nghĩa).
2. Quét chọn và **Copy** các dòng dữ liệu.
3. Trong ứng dụng, tại phần **Quản lý từ vựng**:
   - Nhập tên ngôn ngữ vào ô **Ngôn ngữ 1** (ví dụ: English) và **Ngôn ngữ 2** (ví dụ: Vietnamese).
   - Dán dữ liệu đã copy vào ô văn bản lớn.
   - Bấm nút **Thêm (Insert)**.
4. Kiểm tra lại dữ liệu trong bảng xem trước và bấm **Xác nhận Lưu**.

#### 2. Cách chuyển đổi bộ từ vựng (Ví dụ: Từ Anh-Việt sang Trung-Anh)
Để chuyển sang học một cặp ngôn ngữ hoàn toàn mới:
1. **Export Excel**: Xuất bộ từ vựng hiện tại ra file để lưu trữ.
2. **Xóa sạch dữ liệu (Reset)**: Bấm nút Reset để xóa dữ liệu cũ trong bộ nhớ trình duyệt.
3. Thực hiện các bước nạp từ vựng như trên với bộ từ mới (Trung - Anh).
*Lưu ý: Bạn cũng có thể tích chọn **"Bỏ qua từ vựng mặc định"** để chỉ tập trung vào các từ bạn đã nạp.*

#### 3. Chế độ Mobile (Mobile Mode)
Để tối ưu hóa trải nghiệm trên điện thoại:
1. Mở menu **Cài đặt**.
2. Bật tùy chọn **"Chế độ Mobile"**.
3. Ứng dụng sẽ tự động điều chỉnh viewport, ngăn chặn việc thu phóng (zoom) không mong muốn và khóa hiệu ứng cuộn của hệ điều hành. Đồng thời, Mascot trâu được tự động thu nhỏ 50% để tránh che nội dung, giúp giao diện ổn định hơn khi thao tác nhanh.

#### 4. Tính năng "Đã thuộc" (Memorized Words)
Để tăng tốc ôn tập và quản lý từ vựng đã biết:
1. Trong màn hình **Học (Learn)**, bấm nút **"Đã thuộc từ này"** (màu xanh lá) hoặc nhấn phím tắt để đánh dấu từ đã nhớ. Mascot trâu sẽ xuất hiện chúc mừng rực rỡ và thẻ tự động trượt sang từ tiếp theo.
2. Tại **Trang chủ**, tiến độ được cập nhật theo thời gian thực dưới dạng `Đã thuộc: X / Y từ (Z%)`.
3. Tích chọn **"Bỏ qua từ vựng đã nhớ khi học"** trên trang chủ nếu bạn chỉ muốn ôn các từ chưa thuộc.
4. Muốn học lại từ đầu? Bấm nút **"Đặt lại từ đã nhớ"** trong mục **Quản lý từ vựng** để reset trạng thái.

#### 5. Phím tắt hữu ích
- **Chế độ Học (Learn):**
  - `Mũi tên Phải`: Sang từ tiếp theo.
  - `Mũi tên Trái`: Quay lại từ trước.
  - `Dấu cách` hoặc `Mũi tên Lên/Xuống`: Lật thẻ.
- **Chế độ Kiểm tra (Test):**
  - `Enter`: Nộp bài hoặc sang câu tiếp theo.

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
- `assets/banner.png` — Banner nghệ thuật được tạo bởi Google Gemini (2026)

> **Lưu ý:** Theo quy định của Văn phòng Bản quyền Hoa Kỳ (2023), các hình ảnh thuần túy do AI tạo ra có thể không thuộc đối tượng được bảo hộ bản quyền. Các tài sản này được cung cấp "nguyên trạng" cùng với mã nguồn giấy phép MIT. Người dùng có quyền tự do sử dụng, sửa đổi và phân phối lại.

### 🤝 Đóng góp (Contributors)

Dự án này được xây dựng với sự hỗ trợ đắc lực từ:
- **Google Gemini:** Thiết kế hình ảnh (assets), tối ưu hóa giao diện (UI/UX), vận hành dự án (Agent Project Operator) và tái cấu trúc hệ thống đa ngôn ngữ.
- **Anthropic Claude:** Xây dựng cấu trúc mã nguồn ban đầu, logic xử lý dữ liệu và các tính năng tương tác.

---

## English

A universal, offline web application for learning vocabulary in any language pair. It runs entirely in the browser without the need for additional server setup.

### ✨ Key Features

- 🌏 **Internationalization (i18n):** Seamlessly switch the UI between English and Vietnamese.
- 🧩 **Custom Language Pairs:** Define your own language names (L1/L2) for personalized study sets.
- 📖 **Upgraded Learning Mode (Flashcards):** 
  - Smooth card-flipping experience with a premium glassmorphism design.
  - Integrated **"Mark as Known" (Memorized)** feature to automatically filter out known words and focus strictly on new vocabulary.
- 📝 **Smart Test Mode:** 
  - Multiple question types: Written (Typing), Multiple Choice, and Matching.
  - Automatic shuffling and bi-directional testing (L1 ↔ L2).
- 📥 **Advanced Data Management:**
  - **Flexible Import:** Copy-paste from Excel with support for various delimiters (`Tab`, `:`, `-`, `|`).
  - **Direct File Upload:** Supports `.xlsx`, `.xls`, and `.csv` files.
  - **Drag & Drop:** Drop your files directly onto the import area for instant processing (fully compatible with mobile devices).
  - **Data Review Table:** Verify changes (new words, updated meanings) before committing to storage.
- 📊 **Smart Progress Tracking:** Interactive statistics charts, daily streaks, visual count & percentage of "Memorized" words in real-time, and focused review for incorrect words.
- 📱 **Optimized Mobile Support (Adaptive Mode):** 
  - A specialized mode for mobile devices that locks the viewport and disables elastic scrolling for a native app-like experience.
  - Auto-scaled Mascot (50% size reduction) to maximize screen estate and avoid visual clutter on small screens.
- 🌗 **Dark Mode:** Easy on the eyes for late-night study sessions, with optimized contrast and mascot visibility.

### 🖼️ Application Interface

![VocPr Screenshot](assets/screenshot.png)

### 📖 User Guide

#### 1. Importing Vocabulary from Excel/Google Sheets
The app supports fast bulk import:
1. Prepare an Excel or Google Sheets file with **2 columns** (Column 1: Term, Column 2: Meaning).
2. Select and **Copy** the data rows.
3. In the app, under **Manage Vocabulary**:
   - Enter language names in the **Language 1** (e.g., English) and **Language 2** (e.g., Chinese) fields.
   - Paste the copied data into the large text area.
   - Click **Add (Insert)**.
4. Review the data in the preview table and click **Confirm Import**.

#### 2. Switching Between Language Pairs (e.g., English-Vietnamese to Chinese-English)
To switch to an entirely new set of languages:
1. **Export Excel**: Export your current vocabulary to a file for backup.
2. **Factory Reset**: Click the Reset button to clear old data from the browser storage.
3. Follow the import steps above for the new pair (Chinese - English).
*Tip: Check **"Ignore default vocabulary"** to focus only on your imported words.*

#### 3. Mobile Mode
To optimize your experience on mobile devices:
1. Open the **Settings** menu.
2. Toggle **"Mobile Mode"** on.
3. The app will automatically adjust the viewport, prevent unwanted zooming, lock OS-level elastic scrolling, and automatically scale down the buffalo mascot to 50% size to ensure a highly stable, clean interface during rapid interactions.

#### 4. "Memorized Words" Feature
Accelerate your learning process by hiding words you already know:
1. In **Learn Mode**, click the green **"I know this word"** button or use keyboard shortcuts. The mascot will celebrate, and the card will slide smoothly to the next word.
2. Real-time statistics are updated on the **Home Screen** as `Memorized: X / Y words (Z%)`.
3. Check the **"Skip memorized words while learning"** option on the home screen to focus only on unfamiliar words.
4. To start over, click **"Reset memorized"** in the **Vocabulary Management** section.

#### 5. Useful Keyboard Shortcuts
- **Learning Mode (Learn):**
  - `Right Arrow`: Next word.
  - `Left Arrow`: Previous word.
  - `Space` or `Up/Down Arrow`: Flip card.
- **Test Mode:**
  - `Enter`: Submit answer or go to the next question.

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
- `assets/banner.png` — Artistic banner generated using Google Gemini (2026)

> **Note:** Per the US Copyright Office (2023), purely AI-generated images may not be eligible for copyright protection. These assets are provided "as-is" alongside the MIT-licensed source code. Users are free to use, modify, and redistribute them.

### 🤝 Contributors

This project was built with the invaluable support of:
- **Google Gemini:** Asset design, UI/UX optimization, Project Operation (Agent Project Operator), and multilingual architecture refactoring.
- **Anthropic Claude:** Core initial structure, data processing logic, and interactive features.

---

*Chúc bạn học tốt! / Happy learning!*
