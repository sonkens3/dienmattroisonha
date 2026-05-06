export type ProjectMedia = {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string;
  description?: string;
  mediaKey?: string;
};

export type Project = {
  id: string;
  title: string;
  location: string;
  type: string;
  monthlyBill: string;
  systemSize: string;
  panels: string;
  inverter: string;
  estimatedOutput: string;
  payback: string;
  cost?: string;
  hasStorage: boolean;
  image: string;
  video?: string;
  gallery?: ProjectMedia[];
  summary: string;
  details: string[];
};

export const projects: Project[] = [
  {
    id: "nha-nghi-15kw",
    title: "Hệ điện mặt trời nhà nghỉ 5 tầng",
    location: "Bắc Ninh",
    type: "Nhà nghỉ",
    monthlyBill: "6-8 triệu/tháng",
    systemSize: "15kW",
    panels: "Khoảng 24 tấm pin",
    inverter: "Inverter 15kW 3 pha",
    estimatedOutput: "55-70 kWh/ngày",
    payback: "3.5-5 năm",
    cost: "170-240 triệu",
    hasStorage: false,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "nha-nghi-15kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
        caption: "Mặt bằng mái sau khi bố trí tấm pin",
        description:
          "Hệ khung được chia theo từng cụm để chừa lối thao tác, dễ vệ sinh và kiểm tra khi bảo trì.",
      },
      {
        id: "nha-nghi-15kw-inverter",
        type: "image",
        url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1400&q=80",
        caption: "Khu vực inverter và tủ bảo vệ",
        description:
          "Đường dây DC/AC được gom gọn, có tủ bảo vệ và vị trí thuận tiện cho chủ công trình theo dõi vận hành.",
      },
      {
        id: "nha-nghi-15kw-operation",
        type: "image",
        url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80",
        caption: "Theo dõi sản lượng sau bàn giao",
        description:
          "Chủ công trình có thể xem sản lượng theo ngày, tháng để đánh giá hiệu quả giảm tiền điện thực tế.",
      },
    ],
    summary:
      "Phương án phù hợp cho công trình dùng điện ban ngày và buổi tối, ưu tiên giảm tiền điện ban ngày.",
    details: [
      "Khảo sát mái bê tông, hướng nắng, vị trí đặt inverter và đường dây về tủ tổng.",
      "Đề xuất hệ 15kW dùng inverter 3 pha để phù hợp tải điều hòa và bơm nước.",
      "Bố trí khoảng 24 tấm pin, chừa lối thao tác và khoảng thoáng bảo trì.",
      "Bàn giao app theo dõi sản lượng để chủ công trình kiểm tra theo ngày, tháng.",
    ],
  },
  {
    id: "quan-cafe-20kw",
    title: "Hệ điện mặt trời quán cafe sân vườn",
    location: "Bắc Ninh",
    type: "Quán cafe",
    monthlyBill: "10-12 triệu/tháng",
    systemSize: "20kW",
    panels: "Khoảng 32 tấm pin",
    inverter: "Inverter 20kW 3 pha",
    estimatedOutput: "75-90 kWh/ngày",
    payback: "3-5 năm",
    cost: "230-320 triệu",
    hasStorage: false,
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "quan-cafe-20kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80",
        caption: "Cụm pin trên khu mái đón nắng tốt",
        description:
          "Bố trí ưu tiên phần mái ít bóng che để tăng sản lượng trong khung giờ quán vận hành nhiều tải.",
      },
      {
        id: "quan-cafe-20kw-layout",
        type: "image",
        url: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1400&q=80",
        caption: "Thiết kế không ảnh hưởng không gian kinh doanh",
        description:
          "Đường đi dây và vị trí thiết bị được chọn để không làm rối khu vực khách hàng thường xuyên nhìn thấy.",
      },
      {
        id: "quan-cafe-20kw-monitor",
        type: "image",
        url: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=1400&q=80",
        caption: "Sản lượng phù hợp tải ban ngày",
        description:
          "Điều hòa, máy pha, tủ lạnh và chiếu sáng chạy nhiều ban ngày nên hệ bám tải có tỷ lệ tự dùng tốt.",
      },
    ],
    summary:
      "Phù hợp với quán cafe dùng nhiều điện ban ngày cho điều hòa, máy pha, tủ lạnh và chiếu sáng.",
    details: [
      "Phụ tải ban ngày cao nên tỷ lệ tự dùng tốt, phù hợp hệ hòa lưới bám tải.",
      "Thiết kế chia chuỗi pin theo vùng mái để giảm ảnh hưởng bóng che cục bộ.",
      "Có thể cân nhắc lưu trữ nếu quán cần backup cho thiết bị quan trọng khi mất điện.",
    ],
  },
  {
    id: "xuong-may-35kw",
    title: "Hệ áp mái xưởng may nhỏ",
    location: "Bắc Ninh",
    type: "Xưởng",
    monthlyBill: "18-25 triệu/tháng",
    systemSize: "35kW",
    panels: "Khoảng 56 tấm pin",
    inverter: "Inverter 35kW 3 pha",
    estimatedOutput: "125-155 kWh/ngày",
    payback: "3-4.5 năm",
    cost: "Theo khảo sát",
    hasStorage: false,
    image:
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "xuong-may-35kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1400&q=80",
        caption: "Hệ áp mái trên mái tôn nhà xưởng",
        description:
          "Khảo sát kết cấu mái và xà gồ trước khi chốt phương án để hạn chế ảnh hưởng vận hành sản xuất.",
      },
      {
        id: "xuong-may-35kw-safety",
        type: "image",
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
        caption: "Bố trí tủ bảo vệ AC/DC",
        description:
          "Tủ bảo vệ, chống sét lan truyền và tiếp địa được tính theo phương án thi công thực tế.",
      },
      {
        id: "xuong-may-35kw-output",
        type: "image",
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80",
        caption: "Tối ưu cho tải sản xuất ban ngày",
        description:
          "Hệ thống ưu tiên giảm chi phí điện giờ cao điểm và hạn chế phát ngược nếu khu vực chưa cho phép.",
      },
    ],
    summary:
      "Tận dụng mái tôn rộng và phụ tải sản xuất ban ngày để giảm chi phí điện giờ cao điểm.",
    details: [
      "Kiểm tra kết cấu mái tôn, xà gồ, hướng thoát nước và vị trí đi máng cáp.",
      "Ưu tiên phương án bám tải, hạn chế phát ngược nếu khu vực chưa cho phép.",
      "Bổ sung chống sét lan truyền, tiếp địa và tủ AC/DC theo tiêu chuẩn thi công.",
    ],
  },
  {
    id: "biet-thu-hybrid-8kw",
    title: "Hệ hybrid biệt thự có lưu trữ",
    location: "Bắc Ninh",
    type: "Nhà dân",
    monthlyBill: "3-5 triệu/tháng",
    systemSize: "8kW",
    panels: "Khoảng 13 tấm pin",
    inverter: "Hybrid inverter 8kW",
    estimatedOutput: "28-36 kWh/ngày",
    payback: "5-7 năm",
    cost: "150-230 triệu",
    hasStorage: true,
    image:
      "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "biet-thu-hybrid-8kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=1400&q=80",
        caption: "Phương án hybrid cho nhà ở",
        description:
          "Thiết kế ưu tiên vừa tự dùng ban ngày, vừa dự phòng điện cho tải thiết yếu khi mất điện.",
      },
      {
        id: "biet-thu-hybrid-8kw-roof",
        type: "image",
        url: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1400&q=80",
        caption: "Bố trí pin trên khu mái phù hợp thẩm mỹ",
        description:
          "Cụm pin được bố trí gọn để không phá vỡ tổng thể mái và vẫn chừa khoảng thoáng kỹ thuật.",
      },
      {
        id: "biet-thu-hybrid-8kw-backup",
        type: "image",
        url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80",
        caption: "Tách tải backup cho thiết bị quan trọng",
        description:
          "Đèn, tủ lạnh, modem, camera và một số ổ cắm thiết yếu được tính riêng theo nhu cầu gia đình.",
      },
    ],
    summary:
      "Phương án ưu tiên dự phòng điện cho tải thiết yếu, không chỉ tối ưu hoàn vốn.",
    details: [
      "Tách tải backup gồm đèn, tủ lạnh, modem, camera và một số ổ cắm thiết yếu.",
      "Tính dung lượng pin lưu trữ theo thời gian cần dùng khi mất điện.",
      "Giải thích rõ chi phí lưu trữ làm thời gian hoàn vốn dài hơn hệ hòa lưới thông thường.",
    ],
  },
  {
    id: "nha-pho-6kw",
    title: "Hệ điện mặt trời nhà phố 6kW",
    location: "Bắc Ninh",
    type: "Nhà dân",
    monthlyBill: "2-3 triệu/tháng",
    systemSize: "6kW",
    panels: "Khoảng 10 tấm pin",
    inverter: "Inverter 6kW 1 pha",
    estimatedOutput: "22-28 kWh/ngày",
    payback: "3.5-5 năm",
    cost: "75-100 triệu",
    hasStorage: false,
    image:
      "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "nha-pho-6kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1400&q=80",
        caption: "Mái nhà phố sau khi lắp pin",
        description:
          "Phương án gọn cho sân thượng hoặc mái tôn, ưu tiên tránh bóng che từ tum thang và bồn nước.",
      },
      {
        id: "nha-pho-6kw-cable",
        type: "image",
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
        caption: "Đường đi dây gọn về tủ điện chính",
        description:
          "Tuyến cáp được khảo sát trước để hạn chế đục phá và giữ thẩm mỹ cho nhà đang sử dụng.",
      },
      {
        id: "nha-pho-6kw-handover",
        type: "image",
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80",
        caption: "Bàn giao theo dõi sản lượng",
        description:
          "Chủ nhà được hướng dẫn xem app để biết mỗi ngày hệ tạo được bao nhiêu điện.",
      },
    ],
    summary:
      "Phương án gọn cho nhà phố có mái tôn hoặc sân thượng, ưu tiên giảm tiền điện điều hòa ban ngày.",
    details: [
      "Kiểm tra lối đi dây từ mái về khu vực tủ điện chính.",
      "Tối ưu bố trí tấm pin để tránh bóng che từ tum thang và bồn nước.",
      "Hướng dẫn chủ nhà theo dõi sản lượng trên app sau bàn giao.",
    ],
  },
  {
    id: "van-phong-12kw",
    title: "Hệ áp mái văn phòng 12kW",
    location: "Bắc Ninh",
    type: "Văn phòng",
    monthlyBill: "5-7 triệu/tháng",
    systemSize: "12kW",
    panels: "Khoảng 19 tấm pin",
    inverter: "Inverter 12kW 3 pha",
    estimatedOutput: "42-54 kWh/ngày",
    payback: "3-4.5 năm",
    cost: "130-180 triệu",
    hasStorage: false,
    image:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        id: "van-phong-12kw-cover",
        type: "image",
        url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80",
        caption: "Hệ áp mái cho văn phòng",
        description:
          "Tải điều hòa, máy tính và chiếu sáng dùng nhiều vào giờ hành chính nên tỷ lệ tự dùng tốt.",
      },
      {
        id: "van-phong-12kw-cabinet",
        type: "image",
        url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1400&q=80",
        caption: "Tủ điện và đường cáp kỹ thuật",
        description:
          "Thi công gọn để văn phòng vẫn vận hành bình thường trong thời gian lắp đặt.",
      },
      {
        id: "van-phong-12kw-report",
        type: "image",
        url: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=1400&q=80",
        caption: "Báo cáo sản lượng theo tháng",
        description:
          "Dữ liệu sản lượng giúp chủ đầu tư theo dõi hiệu quả giảm tiền điện sau khi nghiệm thu.",
      },
    ],
    summary:
      "Phù hợp văn phòng dùng điều hòa, máy tính và chiếu sáng nhiều vào giờ hành chính.",
    details: [
      "Phụ tải trùng với giờ nắng nên tỷ lệ tự dùng tốt.",
      "Thiết kế tủ bảo vệ AC/DC và đường cáp gọn để không ảnh hưởng vận hành văn phòng.",
      "Báo cáo sản lượng theo tháng để chủ công trình theo dõi hiệu quả đầu tư.",
    ],
  },
];
