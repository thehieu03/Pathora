/**
 * ============================================================
 * DỮ LIỆU MẪU CHO FORM TẠO TOUR — THEO THỨ TỰ TABS
 * ============================================================
 * Copy từng block bên dưới và paste vào file page.tsx
 * Tìm dòng khởi tạo state tương ứng → thay thế.
 *
 * Tab order trong form:
 *   Tab 0 → Basic Info      → state: basicInfo, enTranslation
 *   Tab 1 → Packages        → state: classifications
 *   Tab 2 → Itineraries     → state: dayPlans[ci]
 *   Tab 3 → Accommodations   → state: accommodations
 *   Tab 4 → Locations        → state: locations
 *   Tab 5 → Transportation   → state: transportations
 *   Tab 6 → Services        → state: services
 *   Tab 7 → Insurance       → state: insurances[ci]
 */

// ============================================================
// TAB 0 — BASIC INFO
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({...});
export const SAMPLE_BASIC_INFO = {
  tourName: "Hà Nội - Hạ Long - Sapa: Khám Phá Miền Bắc 5N4Đ",
  shortDescription:
    "Hành trình 5 ngày 4 đêm khám phá Hà Nội cổ kính, vịnh Hạ Long kỳ vĩ và Sapa mờ sương. Đêm trên du thuyền 5 sao, trek rừng nhiệt đới, thưởng thức ẩm thực đặc sản vùng cao.",
  longDescription:
    "Chuyến đi mở đầu tại Hà Nội — thủ đô ngàn năm văn hiến. Ngày 2-3: vịnh Hạ Long với đêm trên du thuyền cao cấp, kayaking, thăm làng chài Vung Vieng. Ngày 4-5: Sapa với ruộng bậc thang vàng, bản Cát Cát, đỉnh Fansipan huyền thoại.",
  seoTitle: "Tour Hà Nội Hạ Long Sapa 5N4Đ | Du Lịch Miền Bắc 2025",
  seoDescription:
    "Tour trọn gói Hà Nội - Hạ Long - Sapa 5 ngày 4 đêm. Du thuyền 5 sao Hạ Long, khách sạn 4-5 sao. Đặt tour online, giá tốt nhất.",
  status: "1", // 1=Active, 2=Inactive, 3=Draft
};

//   const [enTranslation, setEnTranslation] = useState<TranslationFields>({...});
export const SAMPLE_EN_TRANSLATION = {
  tourName: "Hanoi - Ha Long - Sapa: Discover Northern Vietnam 5D4N",
  shortDescription:
    "5-day journey exploring ancient Hanoi, majestic Ha Long Bay, and misty Sapa. Luxury cruise, jungle trek, and authentic highland cuisine.",
  longDescription:
    "The journey begins in Hanoi — the thousand-year cultural capital. Days 2-3: Ha Long Bay with an overnight luxury cruise, kayaking, and Vung Vieng fishing village. Days 4-5: Sapa with golden terraced rice fields, Cat Cat village, and the legendary Fansipan Peak.",
  seoTitle: "Hanoi Ha Long Sapa Tour 5D4N | Northern Vietnam Travel 2025",
  seoDescription:
    "All-inclusive Hanoi - Ha Long - Sapa tour package. 5-star Ha Long cruise, 4-5 star hotels. Book online, best price guaranteed.",
};

// ============================================================
// TAB 1 — PACKAGES (Classifications)
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [classifications, setClassifications] = useState<ClassificationForm[]>([...]);
export const SAMPLE_CLASSIFICATIONS = [
  {
    name: "Tiêu Chuẩn",
    enName: "Standard",
    description:
      "Gói tiêu chuẩn với khách sạn 3 sao, ăn sáng buffet, hướng dẫn viên tiếng Việt. Phù hợp du lịch tiết kiệm.",
    enDescription:
      "Standard package with 3-star hotels, breakfast buffet, Vietnamese-speaking guide. Ideal for budget travelers.",
    price: "4500000",
    salePrice: "3750000",
    durationDays: "5",
  },
  {
    name: "Cao Cấp",
    enName: "Premium",
    description:
      "Gói cao cấp với khách sạn 4-5 sao, ăn trưa & chiều, hướng dẫn viên song ngữ, xe riêng. Trải nghiệm trọn vẹn.",
    enDescription:
      "Premium package with 4-5 star hotels, lunch & dinner included, bilingual guide, private vehicle. Fully immersive experience.",
    price: "8500000",
    salePrice: "7200000",
    durationDays: "5",
  },
  {
    name: "VIP",
    enName: "VIP",
    description:
      "Gói VIP riêng biệt: khách sạn 5 sao, ăn uống cao cấp, xe riêng, hướng dẫn viên chuyên nghiệp, chương trình đặc biệt.",
    enDescription:
      "Exclusive VIP package: 5-star hotels, fine dining, private car, professional guide, special itinerary.",
    price: "14500000",
    salePrice: "12900000",
    durationDays: "5",
  },
];

// ============================================================
// TAB 2 — ITINERARIES (Day Plans cho gói Tiêu Chuẩn / Index 0)
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [dayPlans, setDayPlans] = useState<DayPlanForm[][]>([[]]);
// dayPlans[0] = SAMPLE_DAY_PLANS;  ← gán cho gói đầu tiên (Standard)
// dayPlans[1] = [];                 ← gói Premium (rỗng, điền sau)
// dayPlans[2] = [];                ← gói VIP (rỗng, điền sau)

export const SAMPLE_DAY_PLANS_PKG0_STANDARD = [
  {
    dayNumber: "1",
    title: "Hà Nội - Khám Phá Thủ Đô",
    enTitle: "Hanoi - Explore the Capital",
    description:
      "Đón khách tại sân bay Nội Bài, di chuyển về trung tâm Hà Nội. Buổi chiều tham quan Hoàng thành Thăng Long.",
    enDescription:
      "Meet & greet at Noi Bai airport, transfer to central Hanoi. Afternoon tour of the Imperial Citadel of Thang Long.",
    activities: [
      {
        activityType: "0",
        title: "Đón khách tại sân bay Nội Bài",
        enTitle: "Airport pickup at Noi Bai",
        description: "Hướng dẫn viên đón khách tại sân bay, phát nước và khăn lạnh.",
        enDescription: "Guide meets guests with cold towels and bottled water.",
        note: "Chờ tất cả khách trước khi khởi hành",
        enNote: "Wait for all guests before departing",
        estimatedCost: "0",
        isOptional: false,
        startTime: "08:00",
        endTime: "10:00",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Tham quan Hoàng thành Thăng Long",
        enTitle: "Visit Imperial Citadel of Thang Long",
        description:
          "Di tích lịch sử quốc gia đặc biệt, UNESCO công nhận năm 2010. Khám phá các cung điện, di vật và lịch sử ngàn năm.",
        enDescription:
          "Special national historical site, UNESCO World Heritage since 2010. Explore palaces, artifacts, and thousand-year history.",
        note: "Mua vé riêng tại cổng",
        enNote: "Separate ticket required at gate",
        estimatedCost: "80000",
        isOptional: false,
        startTime: "14:00",
        endTime: "16:30",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Buffet tối tại nhà hàng chay Âu Cơ",
        enTitle: "Dinner buffet at Au Co Vegetarian Restaurant",
        description:
          "Nhà hàng chay nổi tiếng Hà Nội với hơn 100 món ăn từ rau củ tươi, không gian yên tĩnh và hiện đại.",
        enDescription:
          "Famous Hanoi vegetarian restaurant with 100+ dishes from fresh vegetables, quiet and modern ambience.",
        note: "Kèm trà và nước trái cây",
        enNote: "Includes tea and fruit juice",
        estimatedCost: "180000",
        isOptional: false,
        startTime: "18:30",
        endTime: "20:00",
        linkToResources: [""],
      },
      {
        activityType: "9",
        title: "Dạo phố cổ Hà Nội buổi tối",
        enTitle: "Evening stroll in Old Quarter",
        description:
          "Tự do khám phá khu phố cổ 36 phố phường, mua sắm đặc sản và ngắm nhìn nhịp sống Hà Nội về đêm.",
        enDescription:
          "Free time to explore the Old Quarter's 36 streets, shop for local specialties, and enjoy Hanoi's night scene.",
        note: "Không bao gồm chi phí mua sắm",
        enNote: "Shopping expenses not included",
        estimatedCost: "0",
        isOptional: true,
        startTime: "20:00",
        endTime: "22:00",
        linkToResources: [""],
      },
    ],
  },
  {
    dayNumber: "2",
    title: "Hà Nội → Vịnh Hạ Long",
    enTitle: "Hanoi → Ha Long Bay",
    description:
      "Di chuyển ra Hạ Long (khoảng 2.5h), lên du thuyền, bắt đầu hành trình khám phá vịnh.",
    enDescription:
      "Transfer to Ha Long (2.5h), board the cruise ship, begin the bay exploration.",
    activities: [
      {
        activityType: "7",
        title: "Xe khách riêng Hà Nội → Hạ Long",
        enTitle: "Private bus Hanoi → Ha Long",
        description:
          "Xe limousine 29 chỗ có máy lạnh, wifi miễn phí. Dừng chân trạm nghỉ trên đường.",
        enDescription:
          "Air-conditioned 29-seat limousine with free wifi. Rest stop en route.",
        note: "Thời gian di chuyển khoảng 2.5 - 3 giờ",
        enNote: "Travel time approximately 2.5 - 3 hours",
        estimatedCost: "0",
        isOptional: false,
        startTime: "08:30",
        endTime: "11:30",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Check-in Du thuyền Heritage Wing 5★",
        enTitle: "Check-in Heritage Wing 5★ Cruise",
        description:
          "Du thuyền 5 sao với 18 phòng ngủ suite, nhà hàng rooftop, bar, spa và boong tắm nắng. Mỗi phòng có view ra vịnh và ban công riêng.",
        enDescription:
          "5-star cruise with 18 suite rooms, rooftop restaurant, bar, spa and sundeck. Each room has bay view and private balcony.",
        note: "Phòng có view ra vịnh, ban công riêng",
        enNote: "Rooms with bay view and private balcony",
        estimatedCost: "0",
        isOptional: false,
        startTime: "12:00",
        endTime: "12:30",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Buffet trưa hải sản trên du thuyền",
        enTitle: "Seafood lunch buffet on cruise",
        description:
          "Bữa trưa buffet với hơn 30 món hải sản tươi sống: tôm hùm, cua, ghẹ, cá hồi và các món chay.",
        enDescription:
          "Lunch buffet with 30+ dishes of fresh seafood: lobster, crab, salmon, and vegetarian options.",
        note: "Nước lọc miễn phí, đồ uống có cồn tính phí",
        enNote: "Free water, alcoholic beverages charged separately",
        estimatedCost: "0",
        isOptional: false,
        startTime: "12:30",
        endTime: "14:00",
        linkToResources: [""],
      },
      {
        activityType: "3",
        title: "Kayaking tại hang Sửng Sốt",
        enTitle: "Kayaking at Surprising Cave area",
        description:
          "Khám phá các hang động và vịnh nhỏ xung quanh đảo, ngắm nhìn nhũ đá tự nhiên dưới nước trong xanh.",
        enDescription:
          "Explore caves and small bays around the islands, admire natural stalactites under crystal-clear water.",
        note: "Đã bao gồm trong giá tour, có áo phao",
        enNote: "Included in tour price, life jacket provided",
        estimatedCost: "0",
        isOptional: false,
        startTime: "14:30",
        endTime: "16:30",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Thăm làng chài Vung Vieng",
        enTitle: "Visit Vung Vieng fishing village",
        description:
          "Trải nghiệm cuộc sống của ngư dân vùng vịnh, di chuyển bằng thuyền nan truyền thống.",
        enDescription:
          "Experience daily life of bay fishermen, traveling by traditional bamboo boat.",
        note: "Có thể chọn kayak thay thuyền nan",
        enNote: "Option to kayak instead of bamboo boat",
        estimatedCost: "0",
        isOptional: true,
        startTime: "16:30",
        endTime: "17:30",
        linkToResources: [""],
      },
      {
        activityType: "4",
        title: "Workshop nấu ăn trên du thuyền",
        enTitle: "Cooking class on cruise",
        description:
          "Học cách làm nem cuốn Hà Nội và nước mắm phú quốc cùng đầu bếp 5 sao của du thuyền.",
        enDescription:
          "Learn to make Hanoi spring rolls and Phu Quoc fish sauce with the cruise's 5-star chef.",
        note: "Món tự làm sẽ dùng cho bữa tối",
        enNote: "Self-made dish will be served at dinner",
        estimatedCost: "0",
        isOptional: true,
        startTime: "17:30",
        endTime: "18:30",
        linkToResources: [""],
      },
      {
        activityType: "4",
        title: "Ngắm hoàng hôn + Happy Hour trên boong tàu",
        enTitle: "Sunset + Happy Hour on deck",
        description:
          "Thư giãn trên boong tàu với cocktail và snack, ngắm hoàng hôn tuyệt đẹp trên vịnh Hạ Long.",
        enDescription:
          "Relax on deck with cocktails and snacks, watch the stunning sunset over Ha Long Bay.",
        note: "Happy Hour: 17:00 - 18:30, 2-for-1 cocktails",
        enNote: "Happy Hour: 17:00 - 18:30, 2-for-1 cocktails",
        estimatedCost: "0",
        isOptional: false,
        startTime: "17:00",
        endTime: "18:30",
        linkToResources: [""],
      },
    ],
  },
  {
    dayNumber: "3",
    title: "Vịnh Hạ Long - Hang Sửng Sốt & Tiệc Trưa BBQ",
    enTitle: "Ha Long Bay - Surprising Cave & BBQ Lunch",
    description:
      "Thức dậy sớm với yoga trên boong, thăm hang Sửng Sốt, tắm biển tại Ba Trẻ San Hô, tiệc trưa BBQ trên du thuyền.",
    enDescription:
      "Wake up early for sunrise yoga on deck, visit Surprising Cave, swim at Ba Trai Dao, BBQ lunch on cruise.",
    activities: [
      {
        activityType: "4",
        title: "Yoga Thiền trên boong du thuyền",
        enTitle: "Sunrise meditation yoga on cruise deck",
        description:
          "Buổi tập yoga thiền định 30 phút do hướng dẫn viên yoga 5 năm kinh nghiệm hướng dẫn.",
        enDescription:
          "30-minute meditation yoga session led by a 5-year experienced yoga instructor.",
        note: "Mats và nước detox miễn phí",
        enNote: "Mats and detox water provided free",
        estimatedCost: "0",
        isOptional: true,
        startTime: "06:00",
        endTime: "06:30",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Tham quan Hang Sửng Sốt",
        enTitle: "Explore Surprising Cave (Hang Sửng Sốt)",
        description:
          "Hang động lớn nhất vịnh Hạ Long với hệ thống nhũ đá, măng đá đa dạng màu sắc. Được phát hiện bởi người Pháp năm 1901.",
        enDescription:
          "The largest cave in Ha Long Bay with diverse stalactite and stalagmite formations. Discovered by the French in 1901.",
        note: "Cần leo ~100 bậc thang, mang giày thoải mái",
        enNote: "~100 steps to climb, wear comfortable shoes",
        estimatedCost: "0",
        isOptional: false,
        startTime: "08:00",
        endTime: "09:30",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Tiệc trưa BBQ trên boong du thuyền",
        enTitle: "BBQ lunch on cruise deck",
        description:
          "Bữa trưa BBQ đa dạng: tôm hùm, bạch tuộc, thịt bò wagyu, rau nướng và salad tươi.",
        enDescription:
          "Diverse BBQ lunch: lobster, octopus, wagyu beef, grilled vegetables and fresh salads.",
        note: "Thực đơn thay đổi theo ngày",
        enNote: "Menu changes daily",
        estimatedCost: "0",
        isOptional: false,
        startTime: "12:00",
        endTime: "13:30",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Tắm biển tại khu vực Ba Trẻ San Hô",
        enTitle: "Swimming at Ba Trai Dao coral area",
        description:
          "Bãi tắm hoang sơ với nước trong xanh, san hô đầy màu sắc. Thiết bị lặn snorkeling có sẵn.",
        enDescription:
          "Pristine beach with crystal-clear water and colorful corals. Snorkeling gear available.",
        note: "Có áo phao và kính lặn miễn phí",
        enNote: "Life jackets and snorkel masks provided free",
        estimatedCost: "0",
        isOptional: true,
        startTime: "14:00",
        endTime: "15:30",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Check-out du thuyền, về Hạ Long city",
        enTitle: "Check-out cruise, return to Ha Long city",
        description:
          "Thanh toán các chi phí phát sinh (minibar, spa, cocktail), rời du thuyền, về bến tàu Tuần Châu.",
        enDescription:
          "Settle any extras (minibar, spa, cocktails), disembark, transfer to Tuan Chau port.",
        note: "Hướng dẫn viên đợi tại bến",
        enNote: "Guide waiting at the pier",
        estimatedCost: "0",
        isOptional: false,
        startTime: "16:00",
        endTime: "17:00",
        linkToResources: [""],
      },
    ],
  },
  {
    dayNumber: "4",
    title: "Hạ Long → Sapa, Ruộng Bậc Thang Mùa Vàng",
    enTitle: "Ha Long → Sapa, Golden Terraced Fields",
    description:
      "Di chuyển ra Sapa qua đèo Ô Quy Hồ. Chiều thăm bản Cát Cát, tối thưởng thức thắng cố và các đặc sản vùng cao.",
    enDescription:
      "Transfer to Sapa via O Quy Ho Pass. Afternoon visit to Cat Cat village, evening enjoying Thang Co and highland specialties.",
    activities: [
      {
        activityType: "7",
        title: "Xe khách Hạ Long → Sapa (qua đèo Ô Quy Hồ)",
        enTitle: "Bus Ha Long → Sapa via O Quy Ho Pass",
        description:
          "Hành trình khoảng 6 giờ qua đèo Ô Quy Hồ — một trong 4 đèo huyền thoại của Việt Nam. Ngắm núi Hồng Sơn, Mẫu Sơn.",
        enDescription:
          "Approx. 6-hour journey via O Quy Ho Pass — one of Vietnam's four legendary passes. Views of Hong Son and Mau Son mountains.",
        note: "Có toilet trên xe, dừng chân 2 lần",
        enNote: "Onboard toilet, 2 rest stops",
        estimatedCost: "0",
        isOptional: false,
        startTime: "06:00",
        endTime: "12:00",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Buffet trưa tại Sapa Town",
        enTitle: "Lunch buffet at Sapa Town",
        description:
          "Nhà hàng ẩm thực Tây Bắc với các món đặc sản: lợn cắp nách, gà đồi, cá sông, rau rừng, xôi ngũ sắc.",
        enDescription:
          "Northwest cuisine restaurant with specialties: mountain pig, free-range chicken, stream fish, wild vegetables, colorful sticky rice.",
        note: "Nước lọc miễn phí",
        enNote: "Free drinking water",
        estimatedCost: "0",
        isOptional: false,
        startTime: "12:30",
        endTime: "14:00",
        linkToResources: [""],
      },
      {
        activityType: "0",
        title: "Trek thăm bản Cát Cát",
        enTitle: "Trek to Cat Cat village",
        description:
          "Đi bộ ~3km qua rừng, ruộng bậc thang và thác nước Cát Cát. Tìm hiểu văn hóa người H'Mông và Dao đỏ.",
        enDescription:
          "~3km trek through forest, terraced fields and Cat Cat waterfall. Learn about H'Mong and Red Dao culture.",
        note: "Có hướng dẫn viên địa phương đi cùng",
        enNote: "Local guide accompanies the group",
        estimatedCost: "0",
        isOptional: false,
        startTime: "14:30",
        endTime: "17:30",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Bữa tối đặc sản vùng cao",
        enTitle: "Highland specialties dinner",
        description:
          "Thưởng thức thắng cố, cá hồi, thịt trâu gác bếp, rượu táo mèo — đặc sản Sapa.",
        enDescription:
          "Enjoy Thang Co, salmon, smoked buffalo meat, apple wine — Sapa specialties.",
        note: "Có thể kết hợp biểu diễn văn nghệ dân tộc",
        enNote: "Can combine with ethnic cultural performance",
        estimatedCost: "0",
        isOptional: false,
        startTime: "19:30",
        endTime: "21:00",
        linkToResources: [""],
      },
    ],
  },
  {
    dayNumber: "5",
    title: "Sapa - Đỉnh Fansipan - Về Hà Nội",
    enTitle: "Sapa - Fansipan Peak - Return to Hanoi",
    description:
      "Buổi sáng chinh phục đỉnh Fansipan (3.143m). Chiều khởi hành về Hà Nội, kết thúc tour.",
    enDescription:
      "Morning climb to Fansipan Peak (3,143m). Afternoon depart for Hanoi, tour ends.",
    activities: [
      {
        activityType: "3",
        title: "Chinh phục đỉnh Fansipan (3.143m)",
        enTitle: "Conquer Fansipan Peak (3,143m)",
        description:
          "Leo núi hoặc đi cáp treo (tùy gói). Đỉnh Fansipan — nóc nhà Đông Dương, ngắm toàn cảnh Sapa từ trên cao.",
        enDescription:
          "Trek or take cable car (depending on package). Fansipan Peak — the Roof of Indochina, panoramic views of Sapa.",
        note: "Gói Standard đi cáp treo; gói VIP leo núi có hướng dẫn viên leo núi chuyên nghiệp",
        enNote: "Standard: round-trip cable car; VIP: trek with professional mountain guide",
        estimatedCost: "750000",
        isOptional: false,
        startTime: "06:00",
        endTime: "11:00",
        linkToResources: [""],
      },
      {
        activityType: "2",
        title: "Chợ Tình Sapa & chợ Sapa",
        enTitle: "Sapa Love Market & Sapa Market",
        description:
          "Trải nghiệm Chợ Tình độc đáo — nơi thanh niên các dân tộc gặp gỡ. Mua sắm thổ cẩm, thảo dược, trà shan tuyết.",
        enDescription:
          "Experience the unique Love Market — where young people of different ethnic groups meet. Shop for brocade, herbal medicine, Shan Tuyet tea.",
        note: "Chợ Tình chỉ họp thứ 7 và chủ nhật",
        enNote: "Love Market only opens Saturday and Sunday",
        estimatedCost: "0",
        isOptional: true,
        startTime: "08:00",
        endTime: "10:00",
        linkToResources: [""],
      },
      {
        activityType: "1",
        title: "Bữa trưa tạm biệt tại Sapa",
        enTitle: "Farewell lunch in Sapa",
        description:
          "Bữa trưa cuối cùng với các món đặc sản miền Tây Bắc. Chia tay Sapa.",
        enDescription:
          "Final lunch with Northwest specialties. Farewell to Sapa.",
        note: "Đặt trước món đặc biệt cho đoàn",
        enNote: "Special dishes pre-ordered for the group",
        estimatedCost: "0",
        isOptional: false,
        startTime: "12:00",
        endTime: "13:30",
        linkToResources: [""],
      },
      {
        activityType: "7",
        title: "Xe khách Sapa → Hà Nội (kết thúc tour)",
        enTitle: "Bus Sapa → Hanoi (tour ends)",
        description:
          "Di chuyển về Hà Nội. Tiễn khách tại điểm hẹn trong nội thành hoặc sân bay.",
        enDescription:
          "Transfer to Hanoi. Drop-off at agreed location in city center or airport.",
        note: "Xe về Hà Nội khoảng 20:00-21:00",
        enNote: "Estimated arrival in Hanoi ~20:00-21:00",
        estimatedCost: "0",
        isOptional: false,
        startTime: "14:00",
        endTime: "20:00",
        linkToResources: [""],
      },
    ],
  },
];

// ============================================================
// TAB 3 — ACCOMMODATIONS
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [accommodations, setAccommodations] = useState<AccommodationForm[]>([...]);
export const SAMPLE_ACCOMMODATIONS = [
  {
    accommodationName: "Khách sạn Silk Path Hotel Hanoi",
    enAccommodationName: "Silk Path Hotel Hanoi",
    address: "195-199 Đường Đồng Xuân, Quận Hoàn Kiếm, Hà Nội",
    enAddress: "195-199 Dong Xuan Street, Hoan Kiem District, Hanoi",
    contactPhone: "+84 24 3938 8989",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    note: "Khách sạn 4 sao, cách phố cổ 5 phút đi bộ, có bãi đỗ xe miễn phí",
    enNote: "4-star hotel, 5 min walk to Old Quarter, free parking",
  },
  {
    accommodationName: "Du thuyền Heritage Wing",
    enAccommodationName: "Heritage Wing Cruise",
    address: "Bến tàu Tuần Châu, Hạ Long, Quảng Ninh",
    enAddress: "Tuan Chau Port, Ha Long, Quang Ninh",
    contactPhone: "+84 203 384 8888",
    checkInTime: "12:00",
    checkOutTime: "10:00",
    note: "Du thuyền 5 sao, 18 phòng Suite, nhà hàng rooftop, spa, boong tắm nắng",
    enNote: "5-star cruise, 18 Suite rooms, rooftop restaurant, spa, sundeck",
  },
  {
    accommodationName: "Sapa Highland Resort & Spa",
    enAccommodationName: "Sapa Highland Resort & Spa",
    address: "Đường Mường Hoa, Thị trấn Sapa, Lào Cai",
    enAddress: "Muong Hoa Road, Sapa Town, Lao Cai",
    contactPhone: "+84 214 386 6666",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    note: "Resort 4.5 sao, view trực diện núi Fansipan, spa khoáng nóng, bể bơi nước nóng",
    enNote: "4.5-star resort, direct Fansipan view, hot spring spa, hot pool",
  },
];

// ============================================================
// TAB 4 — LOCATIONS
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [locations, setLocations] = useState<LocationForm[]>([...]);
export const SAMPLE_LOCATIONS = [
  {
    locationName: "Hoàng thành Thăng Long",
    enLocationName: "The Imperial Citadel of Thang Long",
    type: "1",
    enType: "1",
    description:
      "Di tích lịch sử quốc gia đặc biệt, UNESCO công nhận năm 2010. Nơi đây là trung tâm chính trị của Việt Nam qua nhiều triều đại.",
    enDescription:
      "Special national historical site, UNESCO World Heritage since 2010. Political center of Vietnam through many dynasties.",
    city: "Hà Nội",
    enCity: "Hanoi",
    country: "Việt Nam",
    enCountry: "Vietnam",
    entranceFee: "80000",
    address: "19C Hoàng Diệu, Ba Đình, Hà Nội",
    enAddress: "19C Hoang Dieu, Ba Dinh, Hanoi",
  },
  {
    locationName: "Vịnh Hạ Long",
    enLocationName: "Ha Long Bay",
    type: "1",
    enType: "1",
    description:
      "Kỳ quan thiên nhiên thế giới UNESCO, với hơn 1.600 đảo đá vôi và hang động kỳ vĩ. Top 10 điểm đến đẹp nhất thế giới.",
    enDescription:
      "UNESCO World Heritage Site with 1,600+ limestone islands. Voted Top 10 most beautiful destinations in the world.",
    city: "Hạ Long",
    enCity: "Ha Long",
    country: "Việt Nam",
    enCountry: "Vietnam",
    entranceFee: "0",
    address: "Vịnh Hạ Long, Quảng Ninh",
    enAddress: "Ha Long Bay, Quang Ninh",
  },
  {
    locationName: "Hang Sửng Sốt",
    enLocationName: "Surprising Cave (Hang Sửng Sốt)",
    type: "1",
    enType: "1",
    description:
      "Hang động lớn nhất vịnh Hạ Long, được phát hiện bởi người Pháp năm 1901. Hệ thống nhũ đá với hơn 10.000 hình thù khác nhau.",
    enDescription:
      "The largest cave in Ha Long Bay, discovered by the French in 1901. Stalactite system with over 10,000 unique formations.",
    city: "Hạ Long",
    enCity: "Ha Long",
    country: "Việt Nam",
    enCountry: "Vietnam",
    entranceFee: "0",
    address: "Vịnh Hạ Long, Quảng Ninh",
    enAddress: "Ha Long Bay, Quang Ninh",
  },
  {
    locationName: "Bản Cát Cát",
    enLocationName: "Cat Cat Village",
    type: "3",
    enType: "3",
    description:
      "Bản làng của người H'Mông đen cách trung tâm Sapa 3km. Nơi đây có thác nước Cát Cát, ruộng bậc thang và các sản phẩm thổ cẩm truyền thống.",
    enDescription:
      "Black H'Mong village 3km from Sapa center. Features Cat Cat waterfall, terraced rice fields and traditional brocade products.",
    city: "Sapa",
    enCity: "Sapa",
    country: "Việt Nam",
    enCountry: "Vietnam",
    entranceFee: "70000",
    address: "Bản Cát Cát, Thị trấn Sapa, Lào Cai",
    enAddress: "Cat Cat Village, Sapa Town, Lao Cai",
  },
  {
    locationName: "Đỉnh Fansipan",
    enLocationName: "Fansipan Peak",
    type: "2",
    enType: "2",
    description:
      "Đỉnh núi cao nhất Việt Nam và Đông Dương (3.143m). Có thể chinh phục bằng cáp treo 6.3km hoặc trek 2 ngày 1 đêm.",
    enDescription:
      "Highest peak in Vietnam and Indochina (3,143m). Accessible by 6.3km cable car or 2-day 1-night trek.",
    city: "Sapa",
    enCity: "Sapa",
    country: "Việt Nam",
    enCountry: "Vietnam",
    entranceFee: "750000",
    address: "Thị trấn Sapa, Lào Cai",
    enAddress: "Sapa Town, Lao Cai",
  },
];

// ============================================================
// TAB 5 — TRANSPORTATION
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [transportations, setTransportations] = useState<TransportationForm[]>([...]);
export const SAMPLE_TRANSPORTATIONS = [
  {
    fromLocation: "Sân bay Nội Bài",
    enFromLocation: "Noi Bai International Airport",
    toLocation: "Khách sạn Silk Path, Hà Nội",
    enToLocation: "Silk Path Hotel, Hanoi",
    transportationType: "1",
    enTransportationType: "1",
    transportationName: "Xe Limousine 29 chỗ",
    enTransportationName: "29-seat Limousine Bus",
    durationMinutes: "45",
    pricingType: "0",
    price: "0",
    requiresIndividualTicket: false,
    ticketInfo: "Không cần vé riêng",
    enTicketInfo: "No separate ticket required",
    note: "Có wifi, sạc USB, nước uống miễn phí",
    enNote: "Free wifi, USB charging, complimentary water",
  },
  {
    fromLocation: "Hà Nội (Khách sạn)",
    enFromLocation: "Hanoi (Hotel)",
    toLocation: "Cảng Tuần Châu, Hạ Long",
    enToLocation: "Tuan Chau Port, Ha Long",
    transportationType: "1",
    enTransportationType: "1",
    transportationName: "Xe Limousine 29 chỗ",
    enTransportationName: "29-seat Limousine Bus",
    durationMinutes: "150",
    pricingType: "0",
    price: "0",
    requiresIndividualTicket: false,
    ticketInfo: "Đón tại khách sạn",
    enTicketInfo: "Hotel pickup",
    note: "Dừng chân trạm nghỉ trên đường (15 phút)",
    enNote: "Rest stop en route (15 minutes)",
  },
  {
    fromLocation: "Cảng Tuần Châu, Hạ Long",
    enFromLocation: "Tuan Chau Port, Ha Long",
    toLocation: "Du thuyền Heritage Wing",
    enToLocation: "Heritage Wing Cruise",
    transportationType: "2",
    enTransportationType: "2",
    transportationName: "Tàu đưa đón Heritage Wing",
    enTransportationName: "Heritage Wing Transfer Boat",
    durationMinutes: "30",
    pricingType: "1",
    price: "0",
    requiresIndividualTicket: false,
    ticketInfo: "Vé được cấp khi check-in du thuyền",
    enTicketInfo: "Ticket issued upon cruise check-in",
    note: "Tàu khởi hành mỗi 30 phút từ 11:00-13:00",
    enNote: "Boat departs every 30 min from 11:00-13:00",
  },
  {
    fromLocation: "Hạ Long City",
    enFromLocation: "Ha Long City",
    toLocation: "Sapa Town",
    enToLocation: "Sapa Town",
    transportationType: "1",
    enTransportationType: "1",
    transportationName: "Xe Limousine Sleeping Bus",
    enTransportationName: "Sleeping Limousine Bus",
    durationMinutes: "360",
    pricingType: "0",
    price: "0",
    requiresIndividualTicket: false,
    ticketInfo: "Có chăn, gối, wifi, toilet trên xe",
    enTicketInfo: "Blankets, pillows, wifi, toilet on board",
    note: "Chuyến đêm — xe có giường nằm êm ái",
    enNote: "Night journey — comfortable sleeping bus",
  },
  {
    fromLocation: "Sapa Town",
    enFromLocation: "Sapa Town",
    toLocation: "Hà Nội (Nội thành / Sân bay)",
    enToLocation: "Hanoi (City center / Airport)",
    transportationType: "1",
    enTransportationType: "1",
    transportationName: "Xe Limousine 29 chỗ",
    enTransportationName: "29-seat Limousine Bus",
    durationMinutes: "360",
    pricingType: "0",
    price: "0",
    requiresIndividualTicket: false,
    ticketInfo: "Điểm đón tại khách sạn, trả tại địa chỉ yêu cầu",
    enTicketInfo: "Pickup at hotel, drop-off at requested address",
    note: "Về đến Hà Nội khoảng 20:00-21:00",
    enNote: "Estimated arrival in Hanoi ~20:00-21:00",
  },
];

// ============================================================
// TAB 6 — SERVICES (placeholder — giao diện chưa đầy đủ)
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [services, setServices] = useState<ServiceForm[]>([emptyService()]);
export const SAMPLE_SERVICES = [
  {
    serviceName: "Dịch vụ hướng dẫn viên song ngữ",
    pricingType: "1",
    price: "0",
    salePrice: "0",
    email: "guide@pathora.com",
    contactNumber: "+84 24 1234 5678",
  },
];

// ============================================================
// TAB 7 — INSURANCE (cho gói Tiêu Chuẩn / Index 0)
// ============================================================
// Tìm đoạn này trong page.tsx và thay thế:
//   const [insurances, setInsurances] = useState<InsuranceForm[][]>([[]]);
// insurances[0] = SAMPLE_INSURANCES_PKG0;  ← gói Standard
// insurances[1] = [];                       ← gói Premium
// insurances[2] = [];                       ← gói VIP

export const SAMPLE_INSURANCES_PKG0_STANDARD = [
  {
    insuranceName: "Bảo hiểm Du lịch Toàn Diện",
    enInsuranceName: "Comprehensive Travel Insurance",
    insuranceType: "1",
    insuranceProvider: "Bảo Việt",
    coverageDescription:
      "Bảo hiểm tai nạn, bệnh viện nước ngoài, mất hành lý, hủy chuyến. Mức bồi thường tối đa 500 triệu VNĐ.",
    enCoverageDescription:
      "Accident and overseas hospital coverage, lost luggage, trip cancellation. Maximum payout 500M VND.",
    coverageAmount: "500000000",
    coverageFee: "150000",
    isOptional: false,
    note: "Bắt buộc cho tất cả khách",
    enNote: "Mandatory for all guests",
  },
  {
    insuranceName: "Bảo hiểm Hủy Chuyến",
    enInsuranceName: "Trip Cancellation Insurance",
    insuranceType: "3",
    insuranceProvider: "PTI",
    coverageDescription:
      "Hoàn tiền 80% nếu hủy chuyến vì lý do y tế hoặc thiên tai, có giấy xác nhận.",
    enCoverageDescription:
      "80% refund if trip is cancelled for medical reasons or natural disaster with supporting documents.",
    coverageAmount: "200000000",
    coverageFee: "80000",
    isOptional: true,
    note: "Đăng ký trước 7 ngày khởi hành",
    enNote: "Register 7 days before departure",
  },
];

// ============================================================
// HƯỚNG DẪN SỬ DỤNG TRONG page.tsx
// ============================================================
/**
 * Sau khi copy từng block vào page.tsx:
 *
 * // Trong component CreateTourPage:
 * useEffect(() => {
 *   // TAB 0
 *   setBasicInfo(SAMPLE_BASIC_INFO);
 *   setEnTranslation(SAMPLE_EN_TRANSLATION);
 *
 *   // TAB 1
 *   setClassifications(SAMPLE_CLASSIFICATIONS);
 *
 *   // TAB 2 — dayPlans là DayPlanForm[][]
 *   setDayPlans([SAMPLE_DAY_PLANS_PKG0_STANDARD, [], []]);
 *
 *   // TAB 3
 *   setAccommodations(SAMPLE_ACCOMMODATIONS);
 *
 *   // TAB 4
 *   setLocations(SAMPLE_LOCATIONS);
 *
 *   // TAB 5
 *   setTransportations(SAMPLE_TRANSPORTATIONS);
 *
 *   // TAB 6
 *   setServices(SAMPLE_SERVICES);
 *
 *   // TAB 7 — insurances là InsuranceForm[][]
 *   setInsurances([SAMPLE_INSURANCES_PKG0_STANDARD, [], []]);
 * }, []);
 */
