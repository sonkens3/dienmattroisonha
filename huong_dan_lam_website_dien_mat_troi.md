# HƯỚNG DẪN LÀM WEBSITE ĐIỆN MẶT TRỜI CHO CỬA HÀNG LẮP ĐẶT

## 1. Mục tiêu dự án

Tạo một website quảng cáo thương hiệu cá nhân/cửa hàng lắp đặt điện mặt trời, mục tiêu chính là:

- Giới thiệu dịch vụ lắp đặt điện mặt trời.
- Tạo lòng tin bằng hình ảnh, số liệu và dự án thực tế.
- Cho khách hàng tự tính sơ bộ công suất, chi phí đầu tư và thời gian hoàn vốn.
- Có chatbot hỗ trợ tư vấn kỹ thuật cơ bản.
- Thu thông tin khách hàng tiềm năng: họ tên, số điện thoại/Zalo, địa chỉ, tiền điện hàng tháng, ảnh hóa đơn điện, ảnh mái nhà.
- Giai đoạn đầu deploy thử nghiệm miễn phí bằng GitHub/Vercel.
- Giai đoạn sau có thể chuyển sang VPS, gắn tên miền riêng, thêm database thật và hệ thống quản trị nâng cao.

Website phải ưu tiên dễ dùng, dễ hiểu, chạy tốt trên điện thoại, giao diện chuyên nghiệp, tạo cảm giác đáng tin cậy.

---

## 2. Công nghệ đề xuất

### Giai đoạn thử nghiệm

Ưu tiên dùng stack đơn giản:

- Frontend: Next.js hoặc React + Vite.
- Styling: Tailwind CSS.
- UI component: tự viết bằng Tailwind, không cần quá nhiều thư viện.
- Hosting thử nghiệm:
  - GitHub để lưu source code.
  - Vercel để deploy web miễn phí.
- Dữ liệu ban đầu:
  - Lưu cứng trong file JSON hoặc TypeScript object.
  - Form khách hàng có thể gửi về Google Sheet, email hoặc tạm thời lưu local/mock.
- Chatbot:
  - Giai đoạn đầu có thể làm chatbot rule-based trước.
  - Sau đó mới tích hợp OpenAI API/Gemini API.

### Giai đoạn sau khi chạy thật

Có thể nâng cấp:

- VPS chạy Node.js/Next.js.
- Database: MySQL, PostgreSQL hoặc Supabase.
- Upload ảnh: Cloudinary, Firebase Storage hoặc lưu trên VPS.
- Admin panel quản lý dự án, khách hàng, bài viết, bảng giá.
- Chatbot AI dùng API riêng.
- Gửi thông báo lead về Telegram/Zalo OA/email.

---

## 3. Yêu cầu giao diện tổng thể

Website cần có phong cách:

- Sạch, rõ ràng, chuyên nghiệp.
- Màu chủ đạo gợi ý:
  - Xanh lá/năng lượng sạch.
  - Xanh dương/kỹ thuật.
  - Vàng/cam nhẹ/gợi ánh nắng.
- Font dễ đọc.
- Mobile-first, chạy tốt trên điện thoại.
- Có nút nổi:
  - Gọi ngay.
  - Chat tư vấn.
  - Zalo.
- CTA rõ ràng:
  - Nhận tư vấn miễn phí.
  - Tính chi phí & hoàn vốn.
  - Gửi hóa đơn điện để kỹ thuật tư vấn.

---

## 4. Cấu trúc trang web

Menu chính:

1. Trang chủ
2. Dự án thực tế
3. Bảng giá
4. Tính hoàn vốn
5. Kiến thức
6. Bảo hành
7. Liên hệ

Nếu dùng landing page một trang ở giai đoạn đầu thì các mục trên có thể là section trong cùng một trang.

---

## 5. Trang chủ

Trang chủ là trang quan trọng nhất, cần có các section sau.

### 5.1 Hero section

Nội dung gợi ý:

**Tiêu đề:**

Lắp đặt điện mặt trời áp mái cho hộ gia đình, nhà nghỉ, quán cafe và xưởng nhỏ

**Mô tả:**

Tư vấn đúng nhu cầu, thiết kế theo hóa đơn điện thực tế, báo giá minh bạch từng hạng mục, hỗ trợ tính công suất - chi phí - thời gian hoàn vốn trước khi lắp đặt.

**Nút CTA:**

- Nhận tư vấn miễn phí
- Tính chi phí & hoàn vốn

**Thông tin tin cậy:**

- Khảo sát thực tế theo từng công trình
- Tư vấn hệ hòa lưới, hybrid, lưu trữ
- Có báo giá vật tư rõ ràng
- Hỗ trợ theo dõi sản lượng sau lắp

---

### 5.2 Section công cụ tính nhanh

Tạo một form nhỏ ngay trên trang chủ:

Trường nhập:

- Tiền điện trung bình mỗi tháng
- Loại công trình: nhà ở, nhà nghỉ, quán cafe, xưởng, văn phòng
- Điện 1 pha hay 3 pha
- Ban ngày dùng điện ít/trung bình/nhiều
- Diện tích mái ước tính
- Có muốn dùng pin lưu trữ không

Sau khi bấm tính, hiển thị kết quả sơ bộ:

- Công suất hệ thống đề xuất
- Số tấm pin ước tính nếu dùng pin 635W
- Diện tích mái cần
- Chi phí đầu tư tham khảo
- Số tiền điện có thể giảm mỗi tháng
- Thời gian hoàn vốn dự kiến

Luôn hiển thị cảnh báo:

Kết quả chỉ là ước tính sơ bộ. Để có phương án chính xác cần xem hóa đơn điện, ảnh mái, hướng mái, bóng che, tủ điện và nhu cầu sử dụng điện thực tế.

---

### 5.3 Section vì sao chọn chúng tôi

Tạo 4-6 thẻ nội dung:

1. Tư vấn theo hóa đơn điện thực tế  
   Không tư vấn quá công suất nếu không phù hợp.

2. Báo giá minh bạch  
   Tách rõ tấm pin, inverter, khung giàn, dây dẫn, tủ điện, chống sét, nhân công.

3. Khảo sát kỹ mái và tủ điện  
   Kiểm tra hướng nắng, diện tích, bóng che, vị trí lắp inverter và đường dây.

4. Hỗ trợ theo dõi sản lượng  
   Hướng dẫn khách xem sản lượng trên app inverter.

5. Bảo hành rõ ràng  
   Có chính sách bảo hành vật tư và thi công.

6. Ưu tiên hiệu quả hoàn vốn  
   Tư vấn theo mức tự dùng điện ban ngày, không vẽ lợi nhuận ảo.

---

### 5.4 Section dự án thực tế nổi bật

Hiển thị dạng card:

Mỗi card gồm:

- Ảnh công trình
- Tên dự án
- Loại công trình
- Công suất lắp đặt
- Số tấm pin
- Inverter
- Tiền điện trước khi lắp
- Hoàn vốn dự kiến
- Nút xem chi tiết

Ví dụ dữ liệu mẫu:

```json
[
  {
    "title": "Hệ điện mặt trời nhà nghỉ 5 tầng",
    "location": "Hà Nội",
    "type": "Nhà nghỉ",
    "monthlyBill": "6-8 triệu/tháng",
    "systemSize": "15kW",
    "panels": "24 tấm Jinko 635W",
    "inverter": "Inverter 15kW 3 pha",
    "estimatedOutput": "55-70 kWh/ngày",
    "payback": "3.5-5 năm"
  },
  {
    "title": "Hệ điện mặt trời quán cafe",
    "location": "Hà Nội",
    "type": "Quán cafe",
    "monthlyBill": "10-12 triệu/tháng",
    "systemSize": "20kW",
    "panels": "32 tấm 635W",
    "inverter": "Inverter 20kW 3 pha",
    "estimatedOutput": "75-90 kWh/ngày",
    "payback": "3-5 năm"
  }
]
```

Giai đoạn đầu có thể dùng ảnh placeholder. Sau này admin có thể thay bằng ảnh thật.

---

### 5.5 Section quy trình lắp đặt

Hiển thị timeline 8 bước:

1. Tiếp nhận hóa đơn điện và nhu cầu sử dụng
2. Khảo sát mái, hướng nắng, bóng che, tủ điện
3. Tính công suất phù hợp
4. Lên phương án vật tư và báo giá
5. Ký hợp đồng thi công
6. Lắp khung giàn, tấm pin, inverter, tủ điện
7. Kiểm tra vận hành và bàn giao
8. Bảo hành, bảo trì, hỗ trợ sau lắp

---

### 5.6 Section bảng giá tham khảo

Bảng giá tham khảo:

| Gói | Phù hợp với | Công suất | Chi phí tham khảo |
|---|---|---:|---:|
| Hộ gia đình nhỏ | Tiền điện 1-2 triệu/tháng | 3-5kW | 35-70 triệu |
| Hộ gia đình lớn | Tiền điện 2-4 triệu/tháng | 5-8kW | 70-110 triệu |
| Nhà nghỉ/quán cafe | Tiền điện 5-12 triệu/tháng | 10-20kW | 130-300 triệu |
| Xưởng nhỏ | Dùng điện ban ngày nhiều | 20-50kW | Báo giá theo khảo sát |

Ghi chú:

Giá chỉ là tham khảo. Chi phí thực tế phụ thuộc vào loại pin, inverter, mái tôn/mái bê tông, khoảng cách đi dây, tủ điện, chống sét, khung giàn và nhu cầu có lưu trữ hay không.

---

### 5.7 Section câu hỏi thường gặp

Tạo accordion FAQ:

Câu hỏi nên có:

1. Lắp điện mặt trời có cần pin lưu trữ không?
2. Không có pin lưu trữ thì ban đêm có dùng được không?
3. Khi mất điện lưới, hệ hòa lưới có chạy không?
4. Nhà dùng điện ban đêm nhiều có nên lắp không?
5. Điện 1 pha và 3 pha khác gì khi lắp điện mặt trời?
6. Bao lâu thì hoàn vốn?
7. Mái nhỏ có lắp được không?
8. Tấm pin dùng được bao lâu?
9. Có cần vệ sinh tấm pin không?
10. Lắp xong có xem được sản lượng trên điện thoại không?

---

### 5.8 Section form nhận tư vấn

Form gồm:

- Họ tên
- Số điện thoại/Zalo
- Tỉnh/thành phố
- Loại công trình
- Tiền điện mỗi tháng
- Điện 1 pha/3 pha/không rõ
- Diện tích mái ước tính
- Nhu cầu: hòa lưới, hybrid, lưu trữ, chưa rõ
- Upload ảnh hóa đơn điện
- Upload ảnh mái nhà
- Ghi chú thêm

Sau khi gửi form:

Hiển thị thông báo:

Cảm ơn anh/chị đã gửi thông tin. Kỹ thuật sẽ xem hóa đơn, ảnh mái và liên hệ lại để tư vấn phương án phù hợp.

---

## 6. Trang dự án thực tế

Trang này hiển thị toàn bộ dự án đã làm.

### Bộ lọc

Nên có filter:

- Tất cả
- Nhà dân
- Nhà nghỉ
- Quán cafe
- Xưởng
- Văn phòng
- Có lưu trữ
- Không lưu trữ

### Card dự án

Mỗi card gồm:

- Ảnh đại diện
- Tên dự án
- Địa điểm
- Loại công trình
- Công suất hệ thống
- Số tấm pin
- Chi phí tham khảo nếu muốn công khai
- Thời gian hoàn vốn
- Nút xem chi tiết

### Trang chi tiết dự án

Mỗi dự án nên có các phần:

1. Thông tin công trình
2. Nhu cầu ban đầu của khách
3. Khảo sát thực tế
4. Phương án đề xuất
5. Vật tư sử dụng
6. Hình ảnh thi công
7. Sản lượng dự kiến
8. Chi phí và hoàn vốn
9. Kết quả sau khi bàn giao
10. Bài học/rút kinh nghiệm nếu có

---

## 7. Trang bảng giá

Trang bảng giá cần giải thích rõ:

- Giá phụ thuộc vào công suất.
- Giá phụ thuộc vào loại inverter.
- Giá phụ thuộc có lưu trữ hay không.
- Giá phụ thuộc mái tôn/mái bê tông.
- Giá phụ thuộc chiều dài dây, tủ điện, chống sét, khung giàn.
- Không nên báo giá cứng khi chưa khảo sát.

### Bảng giá gợi ý

| Công suất | Số tấm 635W ước tính | Diện tích mái | Giá tham khảo |
|---:|---:|---:|---:|
| 3kW | 5 tấm | 15-20m² | 35-50 triệu |
| 5kW | 8 tấm | 25-35m² | 55-80 triệu |
| 10kW | 16 tấm | 45-60m² | 110-160 triệu |
| 15kW | 24 tấm | 70-90m² | 170-240 triệu |
| 20kW | 32 tấm | 90-120m² | 230-320 triệu |

Ghi chú quan trọng:

Không cam kết sản lượng ảo. Sản lượng thực tế phụ thuộc hướng mái, góc nghiêng, bóng che, thời tiết, vị trí địa lý và chất lượng thi công.

---

## 8. Trang tính hoàn vốn

Đây là một trang riêng chuyên để khách tự tính.

### Input cần có

- Tiền điện trung bình mỗi tháng
- Giá điện trung bình/kWh nếu khách biết
- Loại công trình
- Điện 1 pha/3 pha
- Tỷ lệ dùng điện ban ngày: ít/trung bình/nhiều
- Diện tích mái
- Loại hệ thống:
  - Hòa lưới bám tải
  - Hybrid
  - Có pin lưu trữ
  - Chưa rõ
- Tỉnh/thành phố

### Công thức tính sơ bộ

Có thể dùng công thức đơn giản ban đầu.

#### Ước tính điện tiêu thụ mỗi tháng

Nếu khách chỉ nhập tiền điện:

```
monthlyKwh = monthlyBill / averageElectricPrice
```

Trong đó:

```
averageElectricPrice = 3000
```

Có thể cho phép chỉnh giá điện trung bình.

#### Ước tính công suất đề xuất

Gợi ý logic:

- Nếu tiền điện dưới 2 triệu: đề xuất 3-5kW
- 2-4 triệu: đề xuất 5-8kW
- 4-7 triệu: đề xuất 8-12kW
- 7-12 triệu: đề xuất 12-20kW
- Trên 12 triệu: đề xuất 20kW trở lên, cần khảo sát

Có thể điều chỉnh theo tỷ lệ dùng điện ban ngày:

- Dùng ban ngày ít: giảm công suất đề xuất
- Dùng ban ngày trung bình: giữ mức đề xuất
- Dùng ban ngày nhiều: ưu tiên công suất cao hơn

#### Số tấm pin

Nếu dùng pin 635W:

```
panelCount = ceil(systemKw * 1000 / 635)
```

#### Diện tích mái

Ước tính:

```
roofArea = panelCount * 3
```

Mỗi tấm tính khoảng 2.8-3.2m² gồm cả khoảng hở, lối thao tác, khung.

#### Sản lượng trung bình/ngày

Ước tính đơn giản:

```
dailyOutput = systemKw * 3.5 đến systemKw * 4.5
```

Ví dụ hệ 10kW có thể tạo khoảng 35-45kWh/ngày tùy khu vực, hướng mái và thời tiết.

#### Tiền điện giảm mỗi tháng

```
monthlySaving = dailyOutput * 30 * averageElectricPrice * selfUseRate
```

Trong đó selfUseRate:

- Dùng ban ngày ít: 0.45
- Trung bình: 0.65
- Nhiều: 0.8

#### Thời gian hoàn vốn

```
paybackYears = investmentCost / monthlySaving / 12
```

InvestmentCost ước tính theo công suất:

- 3-5kW: 12-16 triệu/kW
- 5-10kW: 11-15 triệu/kW
- 10-20kW: 10-14 triệu/kW
- Trên 20kW: 9-13 triệu/kW

Chỉ nên báo khoảng giá.

### Kết quả hiển thị

Ví dụ:

Dựa trên thông tin anh/chị cung cấp:

- Hệ thống đề xuất: 12-15kW
- Số tấm pin 635W: khoảng 19-24 tấm
- Diện tích mái cần: khoảng 60-90m²
- Sản lượng dự kiến: khoảng 45-67kWh/ngày
- Chi phí đầu tư tham khảo: 150-230 triệu
- Tiền điện có thể giảm: 3.5-6 triệu/tháng
- Thời gian hoàn vốn: 3.5-5.5 năm

Lưu ý:

Đây là kết quả ước tính. Để tính chính xác, cần khảo sát mái, hướng nắng, bóng che, tủ điện, hóa đơn điện và thói quen dùng điện thực tế.

---

## 9. Chatbot tư vấn kỹ thuật

### Mục tiêu chatbot

Chatbot hỗ trợ khách:

- Hiểu nên lắp hệ bao nhiêu kW.
- Hiểu có nên dùng pin lưu trữ không.
- Hiểu khoảng chi phí đầu tư.
- Hiểu thời gian hoàn vốn.
- Biết cần gửi thông tin gì để kỹ thuật báo giá chính xác.
- Điều hướng khách để lại số điện thoại/Zalo.

### Giai đoạn 1: chatbot rule-based

Chưa cần AI API ngay. Tạo chatbot theo kịch bản.

Luồng hội thoại:

1. Bot chào khách.
2. Hỏi loại công trình.
3. Hỏi tiền điện mỗi tháng.
4. Hỏi điện 1 pha hay 3 pha.
5. Hỏi ban ngày dùng điện nhiều không.
6. Hỏi diện tích mái.
7. Hỏi có muốn pin lưu trữ không.
8. Tính sơ bộ.
9. Gợi ý khách gửi số điện thoại/Zalo và ảnh hóa đơn.

Ví dụ câu trả lời:

Dựa trên thông tin anh/chị cung cấp, em đề xuất khảo sát hệ khoảng 10-15kW. Nếu dùng pin 635W thì cần khoảng 16-24 tấm, diện tích mái khoảng 50-80m². Chi phí tham khảo khoảng 120-220 triệu tùy vật tư và điều kiện thi công. Nếu ban ngày dùng điện nhiều, thời gian hoàn vốn có thể khoảng 4-6 năm. Để tính chính xác hơn, anh/chị gửi giúp em ảnh hóa đơn điện và ảnh mái nhà qua Zalo.

### Giai đoạn 2: chatbot AI

Sau này tích hợp API. Chatbot cần có system prompt riêng:

```text
Bạn là trợ lý kỹ thuật tư vấn điện mặt trời áp mái cho một cửa hàng lắp đặt tại Việt Nam.

Nhiệm vụ:
- Tư vấn dễ hiểu cho khách hàng phổ thông.
- Hỏi từng bước để lấy thông tin: tiền điện, loại công trình, điện 1 pha/3 pha, mức dùng điện ban ngày, diện tích mái, nhu cầu lưu trữ.
- Tính sơ bộ công suất, số tấm pin, diện tích mái, chi phí, thời gian hoàn vốn.
- Luôn nói rõ đây chỉ là ước tính sơ bộ.
- Không cam kết sản lượng tuyệt đối.
- Không báo giá cứng nếu chưa khảo sát.
- Khuyến khích khách gửi hóa đơn điện và ảnh mái.
- Không bịa thông tin bảo hành/sản phẩm nếu dữ liệu không có.
- Trả lời bằng tiếng Việt, giọng tư vấn thân thiện, chuyên nghiệp.

Quy tắc:
- Nếu thiếu thông tin quan trọng, hãy hỏi tiếp.
- Nếu khách hỏi giá, hãy báo khoảng giá.
- Nếu khách hỏi hoàn vốn, hãy giải thích phụ thuộc tỷ lệ tự dùng ban ngày.
- Nếu khách muốn lắp pin lưu trữ, hãy giải thích lưu trữ giúp dùng khi mất điện/ban đêm nhưng chi phí cao hơn và hoàn vốn thường lâu hơn.
- Nếu khách dùng điện chủ yếu ban đêm, hãy khuyên cân nhắc pin lưu trữ hoặc giảm công suất hòa lưới.
```

---

## 10. Form thu khách hàng

Tạo component `LeadForm`.

### Field bắt buộc

- Họ tên
- Số điện thoại/Zalo
- Tỉnh/thành phố
- Tiền điện trung bình mỗi tháng

### Field không bắt buộc

- Loại công trình
- Diện tích mái
- Điện 1 pha/3 pha
- Nhu cầu lưu trữ
- Ghi chú
- Ảnh hóa đơn điện
- Ảnh mái nhà

### Dữ liệu lead

Schema gợi ý:

```ts
type Lead = {
  id: string;
  fullName: string;
  phone: string;
  province?: string;
  projectType?: "home" | "hotel" | "cafe" | "factory" | "office" | "other";
  monthlyBill?: number;
  phase?: "1phase" | "3phase" | "unknown";
  roofArea?: number;
  storageNeed?: "yes" | "no" | "unknown";
  note?: string;
  billImageUrl?: string;
  roofImageUrl?: string;
  source: "website" | "chatbot" | "calculator";
  status: "new" | "called" | "surveyed" | "quoted" | "won" | "lost";
  createdAt: string;
};
```

Giai đoạn thử nghiệm có thể log ra console hoặc lưu localStorage. Sau đó nâng cấp gửi API.

---

## 11. Admin panel đơn giản

Giai đoạn đầu có thể chưa cần login phức tạp. Nhưng nên thiết kế sẵn route `/admin`.

Admin có các mục:

1. Dashboard
2. Leads
3. Projects
4. Pricing
5. FAQ
6. Blog/Knowledge

### Quản lý lead

Hiển thị bảng:

- Ngày gửi
- Họ tên
- Số điện thoại
- Tỉnh/thành
- Tiền điện
- Loại công trình
- Trạng thái
- Ghi chú

Có thể đổi trạng thái:

- Mới
- Đã gọi
- Đã khảo sát
- Đã báo giá
- Đã chốt
- Không phù hợp

### Quản lý dự án

Cho phép thêm/sửa/xóa dự án:

- Tên dự án
- Địa điểm
- Loại công trình
- Công suất
- Số tấm pin
- Inverter
- Tiền điện trước khi lắp
- Chi phí nếu muốn công khai
- Hoàn vốn dự kiến
- Nội dung chi tiết
- Ảnh đại diện
- Gallery ảnh

Giai đoạn đầu admin có thể chỉ là trang mock UI. Dữ liệu vẫn nằm trong file.

---

## 12. Dữ liệu mẫu cho dự án

Tạo file:

`src/data/projects.ts`

```ts
export const projects = [
  {
    id: "nha-nghi-15kw",
    title: "Hệ điện mặt trời nhà nghỉ 5 tầng",
    location: "Hà Nội",
    type: "Nhà nghỉ",
    monthlyBill: "6-8 triệu/tháng",
    systemSize: "15kW",
    panels: "24 tấm Jinko 635W",
    inverter: "Inverter 15kW 3 pha",
    estimatedOutput: "55-70 kWh/ngày",
    payback: "3.5-5 năm",
    image: "/images/projects/project-1.jpg",
    summary: "Phương án phù hợp cho công trình sử dụng điện ban ngày và buổi tối, ưu tiên giảm tiền điện ban ngày.",
    details: [
      "Khảo sát mái bê tông/tôn, kiểm tra hướng nắng và bóng che.",
      "Đề xuất hệ 15kW dùng inverter 3 pha.",
      "Bố trí khoảng 24 tấm pin công suất 635W.",
      "Theo dõi sản lượng qua app inverter."
    ]
  },
  {
    id: "quan-cafe-20kw",
    title: "Hệ điện mặt trời quán cafe",
    location: "Hà Nội",
    type: "Quán cafe",
    monthlyBill: "10-12 triệu/tháng",
    systemSize: "20kW",
    panels: "32 tấm 635W",
    inverter: "Inverter 20kW 3 pha",
    estimatedOutput: "75-90 kWh/ngày",
    payback: "3-5 năm",
    image: "/images/projects/project-2.jpg",
    summary: "Phù hợp với quán cafe dùng nhiều điện ban ngày cho điều hòa, máy pha, tủ lạnh và chiếu sáng.",
    details: [
      "Phụ tải ban ngày cao nên tỷ lệ tự dùng tốt.",
      "Ưu tiên phương án hòa lưới bám tải.",
      "Có thể cân nhắc lưu trữ nếu cần backup khi mất điện."
    ]
  }
];
```

---

## 13. Dữ liệu mẫu cho FAQ

Tạo file:

`src/data/faqs.ts`

```ts
export const faqs = [
  {
    question: "Lắp điện mặt trời có cần pin lưu trữ không?",
    answer: "Không bắt buộc. Nếu mục tiêu chính là giảm tiền điện ban ngày thì có thể dùng hệ hòa lưới bám tải không cần pin lưu trữ. Nếu muốn dùng điện khi mất điện hoặc dùng ban đêm thì mới cân nhắc pin lưu trữ."
  },
  {
    question: "Không có pin lưu trữ thì ban đêm có dùng được điện mặt trời không?",
    answer: "Không. Ban đêm hệ thống không tạo ra điện. Nếu không có pin lưu trữ thì ban đêm vẫn dùng điện lưới như bình thường."
  },
  {
    question: "Khi mất điện lưới, hệ hòa lưới có chạy không?",
    answer: "Thông thường hệ hòa lưới sẽ ngắt khi mất điện lưới để đảm bảo an toàn. Nếu muốn có điện khi mất điện cần dùng hệ hybrid có pin lưu trữ và cấu hình backup phù hợp."
  },
  {
    question: "Bao lâu thì hoàn vốn?",
    answer: "Thời gian hoàn vốn thường phụ thuộc vào chi phí đầu tư, sản lượng tạo ra và tỷ lệ tự dùng điện ban ngày. Với công trình dùng điện ban ngày nhiều, thời gian hoàn vốn có thể tốt hơn."
  }
];
```

---

## 14. Component cần xây dựng

Tạo các component chính:

```text
src/components/
  Header.tsx
  Footer.tsx
  HeroSection.tsx
  QuickCalculator.tsx
  TrustSection.tsx
  ProjectCard.tsx
  ProjectGrid.tsx
  PricingTable.tsx
  ProcessTimeline.tsx
  FAQAccordion.tsx
  LeadForm.tsx
  ChatbotWidget.tsx
  FloatingContactButtons.tsx
  PaybackCalculator.tsx
  AdminLeadTable.tsx
  AdminProjectTable.tsx
```

---

## 15. Route/trang cần có

Nếu dùng Next.js App Router:

```text
src/app/
  page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx
  pricing/page.tsx
  calculator/page.tsx
  knowledge/page.tsx
  warranty/page.tsx
  contact/page.tsx
  admin/page.tsx
```

Nếu dùng React + Vite, dùng React Router:

```text
/
 /projects
 /projects/:slug
 /pricing
 /calculator
 /knowledge
 /warranty
 /contact
 /admin
```

---

## 16. Logic tính toán cần viết thành module riêng

Tạo file:

`src/lib/solarCalculator.ts`

Các hàm cần có:

```ts
export type SolarInput = {
  monthlyBill: number;
  averageElectricPrice?: number;
  projectType?: string;
  phase?: "1phase" | "3phase" | "unknown";
  dayUsageLevel: "low" | "medium" | "high";
  roofArea?: number;
  wantStorage?: boolean;
};

export type SolarEstimate = {
  recommendedKwMin: number;
  recommendedKwMax: number;
  panelCountMin: number;
  panelCountMax: number;
  roofAreaMin: number;
  roofAreaMax: number;
  dailyOutputMin: number;
  dailyOutputMax: number;
  investmentMin: number;
  investmentMax: number;
  monthlySavingMin: number;
  monthlySavingMax: number;
  paybackMin: number;
  paybackMax: number;
  notes: string[];
};

export function estimateSolarSystem(input: SolarInput): SolarEstimate {
  // Viết logic tính toán tại đây.
}
```

Yêu cầu:

- Không trả về một con số duy nhất, hãy trả về khoảng.
- Nếu dữ liệu thiếu, vẫn tính sơ bộ nhưng thêm note.
- Nếu roofArea nhỏ hơn diện tích cần, thêm cảnh báo.
- Nếu dayUsageLevel là low, cảnh báo hoàn vốn có thể lâu hơn.
- Nếu wantStorage là true, thêm cảnh báo chi phí tăng và hoàn vốn có thể dài hơn.

---

## 17. Công thức tính toán tham khảo

### Giá điện trung bình

Mặc định:

```ts
averageElectricPrice = 3000;
```

### Công suất gợi ý theo tiền điện

```ts
function getRecommendedKwRange(monthlyBill: number) {
  if (monthlyBill < 2000000) return [3, 5];
  if (monthlyBill < 4000000) return [5, 8];
  if (monthlyBill < 7000000) return [8, 12];
  if (monthlyBill < 12000000) return [12, 20];
  return [20, 50];
}
```

### Điều chỉnh theo mức dùng điện ban ngày

```ts
if (dayUsageLevel === "low") {
  kwMin *= 0.75;
  kwMax *= 0.85;
}

if (dayUsageLevel === "high") {
  kwMin *= 1.0;
  kwMax *= 1.1;
}
```

### Số tấm pin 635W

```ts
panelCount = Math.ceil(systemKw * 1000 / 635);
```

### Diện tích mái

```ts
roofArea = panelCount * 3;
```

### Sản lượng/ngày

```ts
dailyOutputMin = systemKw * 3.5;
dailyOutputMax = systemKw * 4.5;
```

### Tỷ lệ tự dùng

```ts
const selfUseRate = {
  low: 0.45,
  medium: 0.65,
  high: 0.8
};
```

### Chi phí đầu tư/kW

```ts
function getCostPerKw(systemKw: number) {
  if (systemKw <= 5) return [12000000, 16000000];
  if (systemKw <= 10) return [11000000, 15000000];
  if (systemKw <= 20) return [10000000, 14000000];
  return [9000000, 13000000];
}
```

### Tiền tiết kiệm/tháng

```ts
monthlySaving = dailyOutput * 30 * averageElectricPrice * selfUseRate;
```

### Hoàn vốn

```ts
paybackYears = investmentCost / monthlySaving / 12;
```

---

## 18. Yêu cầu chatbot widget

Tạo `ChatbotWidget.tsx`.

### UI

- Nút chat nổi góc phải dưới.
- Khi bấm mở khung chat.
- Khung chat có:
  - Tiêu đề: Tư vấn điện mặt trời
  - Tin nhắn bot
  - Tin nhắn khách
  - Các nút chọn nhanh
  - Ô nhập tin nhắn
  - Nút gửi

### Kịch bản ban đầu

Bot khởi đầu:

Xin chào anh/chị, em là trợ lý tư vấn điện mặt trời. Em có thể giúp anh/chị tính sơ bộ nên lắp hệ bao nhiêu kW, chi phí khoảng bao nhiêu và thời gian hoàn vốn. Anh/chị đang muốn lắp cho loại công trình nào?

Nút chọn:

- Nhà ở
- Nhà nghỉ
- Quán cafe
- Xưởng
- Văn phòng
- Khác

Sau đó hỏi tiền điện:

Tiền điện trung bình mỗi tháng của anh/chị khoảng bao nhiêu?

Nút chọn:

- 1-2 triệu
- 2-4 triệu
- 4-7 triệu
- 7-12 triệu
- Trên 12 triệu
- Nhập số khác

Sau đó hỏi điện 1 pha/3 pha.

Sau đó hỏi mức dùng điện ban ngày.

Sau đó hỏi diện tích mái.

Cuối cùng trả kết quả sơ bộ từ hàm `estimateSolarSystem`.

Kết thúc bằng CTA:

Anh/chị có thể để lại số điện thoại/Zalo hoặc gửi hóa đơn điện, kỹ thuật sẽ tính phương án chính xác hơn.

---

## 19. SEO cơ bản

Cần tối ưu title và meta description.

### Trang chủ

Title:

Lắp đặt điện mặt trời áp mái | Tư vấn chi phí và hoàn vốn

Description:

Tư vấn lắp đặt điện mặt trời cho hộ gia đình, nhà nghỉ, quán cafe, xưởng nhỏ. Tính công suất, chi phí đầu tư và thời gian hoàn vốn theo hóa đơn điện thực tế.

### Trang tính hoàn vốn

Title:

Công cụ tính chi phí lắp điện mặt trời và thời gian hoàn vốn

Description:

Nhập tiền điện hàng tháng để tính sơ bộ hệ điện mặt trời phù hợp, số tấm pin, diện tích mái, chi phí đầu tư và thời gian hoàn vốn.

### Trang dự án

Title:

Dự án điện mặt trời thực tế đã thi công

Description:

Xem các dự án điện mặt trời áp mái thực tế cho nhà dân, nhà nghỉ, quán cafe và xưởng nhỏ, kèm công suất, vật tư, chi phí và thời gian hoàn vốn.

---

## 20. Yêu cầu responsive

Website phải chạy tốt trên:

- iPhone
- Android
- Tablet
- Laptop
- Desktop

Trên điện thoại:

- Menu chuyển thành hamburger.
- Card dự án xếp 1 cột.
- Bảng giá có thể cuộn ngang.
- Form dễ bấm, input đủ lớn.
- Nút gọi/Zalo luôn nổi nhưng không che nội dung.

---

## 21. Yêu cầu chất lượng code

- Code rõ ràng, chia component.
- Không viết toàn bộ trong một file.
- Tách dữ liệu mẫu ra `src/data`.
- Tách logic tính toán ra `src/lib`.
- Dùng TypeScript nếu có thể.
- Không hardcode quá nhiều trong component.
- Có thể thay dữ liệu dự án dễ dàng.
- Có README hướng dẫn chạy local và deploy.

---

## 22. README cần có

Tạo file `README.md` trong project với nội dung:

```md
# Website tư vấn lắp đặt điện mặt trời

## Cài đặt

npm install

## Chạy local

npm run dev

## Build

npm run build

## Deploy thử nghiệm

Có thể deploy lên Vercel bằng cách kết nối GitHub repository.

## Các trang chính

- Trang chủ
- Dự án thực tế
- Bảng giá
- Tính hoàn vốn
- Kiến thức
- Bảo hành
- Liên hệ
- Admin mock

## Ghi chú

Kết quả tính toán chỉ là ước tính sơ bộ. Khi chạy thực tế cần kiểm tra lại công thức, giá vật tư và điều kiện thi công thực tế.
```

---

## 23. Triển khai GitHub và Vercel

### Bước 1: Tạo project

Nếu dùng Next.js:

```bash
npx create-next-app@latest solar-website
```

Chọn:

- TypeScript: Yes
- Tailwind CSS: Yes
- App Router: Yes
- ESLint: Yes
- src directory: Yes

### Bước 2: Chạy thử

```bash
cd solar-website
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

### Bước 3: Đưa lên GitHub

```bash
git init
git add .
git commit -m "Initial solar website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solar-website.git
git push -u origin main
```

### Bước 4: Deploy bằng Vercel

1. Vào Vercel.
2. Đăng nhập bằng GitHub.
3. Import repository `solar-website`.
4. Bấm Deploy.
5. Sau khi deploy xong, Vercel sẽ cấp link dạng:

```text
https://solar-website.vercel.app
```

### Bước 5: Sau này gắn tên miền

Khi mua tên miền, vào Vercel > Project > Domains > Add Domain.

Nếu chuyển sang VPS thì build project và chạy bằng Node.js/PM2 hoặc Docker.

---

## 24. Yêu cầu giao diện cụ thể cho Codex

Khi Codex tạo web, cần đảm bảo:

- Trang chủ nhìn chuyên nghiệp, không sơ sài.
- Có hero section đẹp.
- Có calculator hoạt động thật.
- Có chatbot demo hoạt động theo kịch bản.
- Có trang dự án với dữ liệu mẫu.
- Có trang chi tiết dự án.
- Có form nhận tư vấn.
- Có bảng giá.
- Có FAQ accordion.
- Có nút nổi gọi điện/Zalo/chat.
- Có footer đầy đủ thông tin.
- Code sạch, dễ sửa.
- Có README.
- Có thể chạy ngay bằng `npm install` và `npm run dev`.

---

## 25. Nội dung liên hệ mẫu

Thay bằng thông tin thật của cửa hàng:

```ts
export const contactInfo = {
  brandName: "Điện Mặt Trời Minh Solar",
  phone: "09xx xxx xxx",
  zalo: "09xx xxx xxx",
  email: "contact@example.com",
  address: "Hà Nội, Việt Nam",
  workingHours: "08:00 - 18:00 hằng ngày"
};
```

---

## 26. Nội dung footer mẫu

Footer gồm:

- Tên thương hiệu
- Mô tả ngắn
- Số điện thoại
- Zalo
- Email
- Địa chỉ
- Link nhanh:
  - Dự án thực tế
  - Bảng giá
  - Tính hoàn vốn
  - Liên hệ
- Ghi chú:

Thông tin trên website chỉ mang tính tư vấn tham khảo. Phương án lắp đặt chính xác cần được khảo sát thực tế.

---

## 27. Nội dung blog/kiến thức gợi ý

Tạo sẵn vài bài viết mẫu:

1. Tiền điện bao nhiêu thì nên lắp điện mặt trời?
2. Hệ điện mặt trời hòa lưới và hybrid khác nhau thế nào?
3. Có nên lắp pin lưu trữ không?
4. Nhà nghỉ, quán cafe nên lắp hệ bao nhiêu kW?
5. Cách tính số tấm pin cần lắp theo diện tích mái.
6. Vì sao dùng điện ban ngày nhiều thì hoàn vốn nhanh hơn?
7. Những lỗi cần tránh khi lắp điện mặt trời áp mái.

Giai đoạn đầu có thể chỉ tạo danh sách bài mẫu, nội dung ngắn.

---

## 28. Mục tiêu bản MVP

Bản đầu tiên phải hoàn thành các mục sau:

- Web có giao diện đẹp, chuyên nghiệp.
- Có trang chủ đầy đủ section.
- Có công cụ tính chi phí/hoàn vốn chạy được.
- Có chatbot tư vấn demo.
- Có trang dự án thực tế với dữ liệu mẫu.
- Có bảng giá.
- Có form nhận tư vấn.
- Có FAQ.
- Có README hướng dẫn chạy.
- Có thể deploy lên Vercel từ GitHub.

Không cần làm phức tạp ngay:

- Chưa cần thanh toán.
- Chưa cần đăng nhập khách hàng.
- Chưa cần CRM nâng cao.
- Chưa cần AI chatbot thật nếu chưa có API key.
- Chưa cần database nếu chỉ demo.

---

## 29. Prompt ngắn để đưa cho Codex

Có thể dùng prompt này trong Codex:

```text
Hãy tạo cho tôi một website tư vấn và quảng cáo dịch vụ lắp đặt điện mặt trời áp mái theo file hướng dẫn này.

Yêu cầu:
- Dùng Next.js + TypeScript + Tailwind CSS.
- Giao diện chuyên nghiệp, mobile-first.
- Có các trang: home, projects, project detail, pricing, calculator, knowledge, warranty, contact, admin mock.
- Có component tính chi phí và hoàn vốn hoạt động thật dựa trên công thức trong tài liệu.
- Có chatbot widget rule-based tư vấn sơ bộ.
- Có form thu lead khách hàng.
- Có dữ liệu mẫu cho dự án, FAQ, bảng giá.
- Tách component, data và logic rõ ràng.
- Có README hướng dẫn chạy local và deploy Vercel.
- Không cần database thật ở bản MVP, có thể lưu mock/localStorage.
- Code phải chạy được ngay sau khi npm install và npm run dev.
```

---

## 30. Lưu ý cuối cùng

Website này không chỉ để cho đẹp. Mục tiêu thật là biến khách truy cập thành khách để lại số điện thoại/Zalo.

Vì vậy mọi trang đều nên dẫn về 3 hành động:

1. Tính chi phí và hoàn vốn.
2. Gửi hóa đơn điện.
3. Liên hệ Zalo/kỹ thuật.

Khi có dự án thật, hãy cập nhật ảnh và số liệu liên tục. Dự án thực tế là phần tạo niềm tin mạnh nhất cho cửa hàng mới.
