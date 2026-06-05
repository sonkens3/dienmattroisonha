# Cấu hình đồng bộ dự án qua Google Sheet và Google Drive

Web đang chạy GitHub Pages nên không có server riêng để lưu ảnh/video. Phần admin dùng Google Apps Script làm backend:

- Lead khách gửi vẫn ghi vào sheet `Leads` và gửi Telegram.
- Dự án admin thêm/sửa ghi vào sheet `Projects`.
- Ảnh/video dự án upload vào Google Drive folder `Son Ha Solar Project Media`.

## Cập nhật Apps Script

1. Mở Google Sheet đang nhận lead.
2. Vào `Extensions` > `Apps Script`.
3. Xóa code cũ trong `Code.gs`.
4. Dán toàn bộ nội dung file `docs/google-apps-script-leads.js`.
5. Vào `Project Settings` > `Script Properties`, thêm các property:

```text
TELEGRAM_BOT_TOKEN = token bot Telegram
TELEGRAM_CHAT_ID = chat ID nhận lead
LEAD_NOTIFY_FROM_NAME = Điện mặt trời Sơn Hà
PROJECT_ADMIN_TOKEN = một mã bí mật tự đặt, ví dụ SonHaSync_2026
```

`PROJECT_MEDIA_FOLDER_ID` là tùy chọn. Nếu không thêm, script sẽ tự tạo folder `Son Ha Solar Project Media` trong Google Drive.

## Deploy lại

1. Bấm `Deploy` > `Manage deployments`.
2. Chọn deployment web app đang dùng.
3. Bấm biểu tượng bút chì `Edit`.
4. Chọn `Version` > `New version`.
5. Giữ:
   - `Execute as: Me`
   - `Who has access: Anyone`
6. Bấm `Deploy`.

URL web app cũ vẫn dùng được nếu anh cập nhật đúng deployment hiện tại.

## Dùng trong admin

1. Vào `/admin`.
2. Đăng nhập admin website như hiện tại.
3. Ở ô `Mã đồng bộ admin`, nhập đúng giá trị `PROJECT_ADMIN_TOKEN`.
4. Thêm/sửa dự án và upload ảnh/video.

Sau khi lưu thành công, khách mở web bằng thiết bị khác sẽ đọc dự án từ Google Sheet/Drive.
