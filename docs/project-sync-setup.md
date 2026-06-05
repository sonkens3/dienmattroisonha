# Cấu hình dự án qua Google Sheet và Google Drive

Web chạy GitHub Pages nên không có server riêng để lưu ảnh/video. Phần admin dùng Google Apps Script làm backend:

- Lead khách gửi vẫn ghi vào sheet `Leads` và gửi Telegram.
- Dự án admin thêm/sửa ghi vào sheet `Projects`.
- Ảnh/video dự án upload vào Google Drive folder `Son Ha Solar Project Media`.

## Cập Nhật Apps Script

1. Mở Google Sheet đang nhận lead.
2. Vào `Extensions` > `Apps Script`.
3. Xóa code cũ trong `Code.gs`.
4. Dán toàn bộ nội dung file `docs/google-apps-script-leads.js`.
5. Vào `Project Settings`, bật `Show "appsscript.json" manifest file`.
6. Mở file `appsscript.json`, dán nội dung file `docs/appsscript.json`.
7. Vào `Project Settings` > `Script Properties`, thêm:

```text
TELEGRAM_BOT_TOKEN = token bot Telegram
TELEGRAM_CHAT_ID = chat ID nhận lead
LEAD_NOTIFY_FROM_NAME = Điện mặt trời Sơn Hà
PROJECT_ADMIN_TOKEN = SonHaSync_2026
PROJECT_MEDIA_FOLDER_ID = ID folder Google Drive dùng để lưu ảnh/video công trình
```

Để lấy `PROJECT_MEDIA_FOLDER_ID`: tạo một folder trong Google Drive, ví dụ `Son Ha Solar Project Media`, mở folder đó rồi copy phần ID trên URL.

Ví dụ URL folder:

```text
https://drive.google.com/drive/folders/1AbCDEFgHiJkLmNoPqRsTuvWxYz
```

Thì ID cần điền là:

```text
1AbCDEFgHiJkLmNoPqRsTuvWxYz
```

## Deploy Lại

Trước khi deploy, chọn hàm `authorizeProjectDrive` rồi bấm `Run` một lần để Google hiện màn hình cấp quyền ghi Drive. Chọn đúng tài khoản, bấm `Allow`.

Hàm này sẽ tạo thử một file nhỏ trong folder Drive rồi đưa vào thùng rác. Mục đích là bắt Google cấp đúng quyền `https://www.googleapis.com/auth/drive`, nếu chỉ chạy hàm đọc folder thì khi upload ảnh vẫn có thể lỗi `Folder.createFile`.

1. Bấm `Deploy` > `Manage deployments`.
2. Chọn deployment web app đang dùng.
3. Bấm biểu tượng bút chì `Edit`.
4. Chọn `Version` > `New version`.
5. Giữ:
   - `Execute as: Me`
   - `Who has access: Anyone`
6. Bấm `Deploy`.

Không cần nhập mã đồng bộ trên trang admin nữa. Sau khi Apps Script đã có `PROJECT_ADMIN_TOKEN = SonHaSync_2026`, admin chỉ cần bấm thêm/sửa/xóa công trình.
