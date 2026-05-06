# Website tư vấn lắp đặt điện mặt trời

MVP website quảng cáo và thu lead cho cửa hàng lắp đặt điện mặt trời áp mái. Project dùng Next.js App Router, TypeScript và Tailwind CSS.

## Cài đặt

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Mặc định mở tại `http://localhost:3000`.

## Build

```bash
npm run build
```

## Gửi lead về Telegram và Google Sheet

Tạo file `.env.local` từ `.env.example` rồi điền các biến:

```bash
LEAD_NOTIFY_FROM_NAME="Điện mặt trời Sơn Hà"
TELEGRAM_BOT_TOKEN="token_bot_telegram"
TELEGRAM_CHAT_ID="chat_id_nhan_thong_bao"
GOOGLE_SHEET_WEBHOOK_URL="url_web_app_google_apps_script"
GOOGLE_SHEET_WEBHOOK_SECRET="chuoi_bi_mat_tu_chon"
```

### Telegram

1. Vào Telegram, nhắn `@BotFather`, tạo bot và lấy `TELEGRAM_BOT_TOKEN`.
2. Nhắn thử một tin cho bot vừa tạo.
3. Lấy `TELEGRAM_CHAT_ID` bằng bot như `@userinfobot`, hoặc thêm bot vào nhóm rồi lấy ID nhóm.
4. Điền token/chat ID vào `.env.local`, khởi động lại `npm run dev`.

Form tư vấn sẽ gửi tin nhắn lead về Telegram. Nếu khách upload ảnh hóa đơn/ảnh mái, hệ thống gửi thêm file đó sang Telegram dạng document.

### Google Sheet

1. Tạo Google Sheet mới.
2. Vào `Extensions` > `Apps Script`.
3. Dán nội dung file `docs/google-apps-script-leads.js`.
4. Nếu dùng `GOOGLE_SHEET_WEBHOOK_SECRET`, điền cùng giá trị vào biến `WEBHOOK_SECRET` trong Apps Script.
5. Deploy: `Deploy` > `New deployment` > chọn `Web app`.
6. Chọn quyền truy cập `Anyone` hoặc `Anyone with the link`, rồi copy Web app URL vào `GOOGLE_SHEET_WEBHOOK_URL`.
7. Khởi động lại web.

Google Sheet sẽ lưu thông tin lead, nguồn gửi, số điện thoại, tiền điện, nhu cầu, ghi chú và tên file ảnh. File ảnh thật được gửi về Telegram.

## Deploy thử nghiệm

Có thể deploy lên Vercel bằng cách kết nối GitHub repository, chọn project Next.js và bấm Deploy.

## Deploy GitHub Pages

Repo đã có workflow `.github/workflows/pages.yml`. Khi push lên nhánh `master` hoặc `main`, GitHub Actions sẽ build bản tĩnh và đưa lên GitHub Pages.

URL mặc định sau khi bật Pages:

```text
https://sonkens3.github.io/dienmattroisonha/
```

GitHub Pages chỉ chạy được HTML/CSS/JS tĩnh, không chạy được server API `/api/leads`. Muốn form gửi Telegram bằng token bảo mật thì nên deploy bản production trên Vercel hoặc hosting Node.js. Bản GitHub Pages dùng để chạy thử giao diện trước.

## Các trang chính

- Trang chủ
- Dự án thực tế
- Chi tiết dự án
- Bảng giá
- Tính hoàn vốn
- Kiến thức
- Bảo hành
- Liên hệ
- Admin mock

## Ghi chú

Kết quả tính toán chỉ là ước tính sơ bộ. Khi chạy thực tế cần kiểm tra lại công thức, giá vật tư, chính sách bảo hành và điều kiện thi công thực tế.

Form tư vấn trong bản MVP lưu lead vào `localStorage` để demo. Khi triển khai thật có thể nối Google Sheet, email, CRM hoặc database.
