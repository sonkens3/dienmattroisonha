export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Lắp điện mặt trời có cần pin lưu trữ không?",
    answer:
      "Không bắt buộc. Nếu mục tiêu chính là giảm tiền điện ban ngày thì có thể dùng hệ hòa lưới bám tải không cần pin lưu trữ. Nếu muốn dùng điện khi mất điện hoặc dùng ban đêm thì mới cần cân nhắc pin lưu trữ.",
  },
  {
    question: "Không có pin lưu trữ thì ban đêm có dùng được không?",
    answer:
      "Ban đêm hệ thống không tạo ra điện. Nếu không có pin lưu trữ, ban đêm vẫn dùng điện lưới như bình thường.",
  },
  {
    question: "Khi mất điện lưới, hệ hòa lưới có chạy không?",
    answer:
      "Thông thường hệ hòa lưới sẽ ngắt khi mất điện lưới để đảm bảo an toàn. Muốn có điện khi mất điện cần dùng hệ hybrid có pin lưu trữ và cấu hình backup phù hợp.",
  },
  {
    question: "Nhà dùng điện ban đêm nhiều có nên lắp không?",
    answer:
      "Vẫn có thể lắp, nhưng cần tính kỹ tỷ lệ tự dùng ban ngày. Nếu ban ngày dùng ít, công suất nên vừa phải hoặc cân nhắc thêm lưu trữ tùy ngân sách.",
  },
  {
    question: "Điện 1 pha và 3 pha khác gì khi lắp?",
    answer:
      "Hệ công suất nhỏ thường có thể dùng 1 pha. Công suất lớn, tải nhiều hoặc công trình kinh doanh thường cần kiểm tra điện 3 pha để đấu nối ổn định và an toàn.",
  },
  {
    question: "Bao lâu thì hoàn vốn?",
    answer:
      "Thời gian hoàn vốn phụ thuộc chi phí đầu tư, sản lượng tạo ra và tỷ lệ tự dùng điện ban ngày. Công trình dùng điện ban ngày nhiều thường có mốc hoàn vốn tốt hơn.",
  },
  {
    question: "Mái nhỏ có lắp được không?",
    answer:
      "Có thể, nếu mái đủ nắng và đủ diện tích cho số tấm tối thiểu. Khi tính mái cần chừa thêm khoảng hở kỹ thuật và lối thao tác để bảo trì.",
  },
  {
    question: "Tấm pin dùng được bao lâu?",
    answer:
      "Tấm pin chất lượng tốt thường có tuổi thọ thiết kế dài, suy giảm sản lượng theo thời gian. Cần xem chính sách bảo hành cụ thể của từng hãng pin.",
  },
  {
    question: "Có cần vệ sinh tấm pin không?",
    answer:
      "Có. Bụi bẩn, lá cây và các vết bám trên bề mặt có thể làm giảm sản lượng. Tần suất vệ sinh tùy môi trường, độ dốc mái và mức bụi tại khu vực.",
  },
  {
    question: "Lắp xong có xem sản lượng trên điện thoại không?",
    answer:
      "Có. Hầu hết inverter hiện nay có app theo dõi sản lượng ngày, tháng, năm và cảnh báo vận hành nếu được cấu hình internet ổn định.",
  },
];
