export type Locale = 'en' | 'th';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      reviews: 'Reviews',
      shop: 'Shop',
    },
    // About Page
    about: {
      title: 'About ORRY',
      subtitle: 'Natural Beauty, Honestly Made',
      story_title: 'Our Story',
      story: 'ORRY was born from a simple belief: your lips deserve the very best nature has to offer. Founded in 2020, we crafted the perfect natural lip care collection by combining traditional Thai wisdom with modern skincare science. Every product is formulated without compromise—no synthetic colors, no harmful chemicals, just pure, nourishing ingredients that make your lips feel soft, hydrated, and beautiful.',
      mission_title: 'Our Mission',
      mission: 'To create the most effective, natural lip care products that celebrate authentic beauty and honor sustainable practices.',
      values: [
        {
          title: 'Natural Excellence',
          description: 'We use only premium natural ingredients sourced responsibly from trusted suppliers across Thailand.',
        },
        {
          title: 'Honest Transparency',
          description: 'Every ingredient is disclosed. Every claim is tested. We believe you deserve complete transparency.',
        },
        {
          title: 'Sustainable Beauty',
          description: 'Our packaging is eco-conscious, our practices are ethical, and our impact on the planet matters.',
        },
        {
          title: 'Community Care',
          description: 'A portion of every purchase supports Thai women artisans and local environmental conservation projects.',
        },
      ],
      team_title: 'Our Team',
      team: [
        {
          name: 'Niran Chaturmuang',
          role: 'Founder & Chief Formulator',
          bio: 'Cosmetic chemist with 15 years of experience in natural beauty. Niran combines ancestral Thai beauty knowledge with cutting-edge skincare science.',
        },
        {
          name: 'Siriporn Prasad',
          role: 'Sustainability Director',
          bio: 'Environmental advocate committed to building a beauty brand that gives back to nature and communities.',
        },
        {
          name: 'Anuchit Moonphol',
          role: 'Head of Sourcing',
          bio: 'Works directly with farmers and suppliers to ensure every ingredient meets ORRY\'s rigorous quality standards.',
        },
      ],
      philosophy_title: 'Brand Philosophy',
      philosophy: 'At ORRY, we believe beauty should never harm. Our philosophy rests on three pillars: respect for nature\'s wisdom, commitment to scientific rigor, and honest communication with our community. We don\'t chase trends—we create timeless, effective products that you\'ll love wearing year after year.',
      images_title: 'ORRY Beauty in Action',
    },
    // Contact Page
    contact: {
      title: 'Get in Touch',
      subtitle: 'We\'d love to hear from you',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Message',
        submit: 'Send Message',
        success: 'Message sent successfully! We\'ll be in touch soon.',
        error: 'Failed to send message. Please try again.',
      },
      contact_info: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      location_value: 'Bangkok, Thailand',
      follow_us: 'Follow Us',
      whatsapp: 'WhatsApp Us',
      hours: 'Business Hours',
      hours_value: 'Monday - Friday: 9:00 AM - 6:00 PM ICT',
    },
    // FAQ Page
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about ORRY products',
      search_placeholder: 'Search FAQs...',
      categories: {
        product: 'Product Care',
        shipping: 'Shipping & Orders',
        returns: 'Returns & Refunds',
        ingredients: 'Ingredients & Skincare',
      },
      questions: [
        {
          category: 'product',
          q: 'How should I apply ORRY lip care products?',
          a: 'Apply a small amount directly to your lips. For best results, use 2-3 times daily. WHISPER works beautifully as a base under lipstick, while BREEZE and VELVET are gorgeous worn alone.',
        },
        {
          category: 'product',
          q: 'Can I use ORRY products if I have sensitive lips?',
          a: 'Yes! All ORRY products are formulated for sensitive skin. However, if you have specific allergies, please review the ingredient list. We recommend doing a patch test first.',
        },
        {
          category: 'product',
          q: 'What\'s the difference between WHISPER, BREEZE, and VELVET?',
          a: 'WHISPER is our clear hydrating formula perfect for everyday moisture and as a base. BREEZE is a warm coral shade with nourishing oils. VELVET is a luxurious deep red with antioxidant-rich botanicals.',
        },
        {
          category: 'product',
          q: 'How long does one tube last?',
          a: 'With regular use (2-3 applications daily), one 4.5g tube typically lasts 4-6 weeks. Everyone\'s usage differs, so this may vary.',
        },
        {
          category: 'shipping',
          q: 'How long does shipping take?',
          a: 'Within Thailand: 2-3 business days. International orders: 7-14 business days depending on destination. Express options are available.',
        },
        {
          category: 'shipping',
          q: 'Do you ship internationally?',
          a: 'Yes! We ship to most countries. International orders incur shipping fees and may be subject to customs. See our shipping policy for details.',
        },
        {
          category: 'shipping',
          q: 'Is there free shipping?',
          a: 'Free shipping within Thailand for orders over 500 THB. International free shipping on orders over 2,000 THB.',
        },
        {
          category: 'shipping',
          q: 'Can I track my order?',
          a: 'Absolutely! You\'ll receive a tracking number via email once your order ships. You can track it on the carrier\'s website.',
        },
        {
          category: 'returns',
          q: 'What is your return policy?',
          a: 'We offer 30-day returns for unused products in original packaging. Opened products can be returned within 14 days if unused. Please contact us to initiate a return.',
        },
        {
          category: 'returns',
          q: 'Can I exchange a product?',
          a: 'Yes! You can exchange for a different shade or product within 14 days of purchase. Contact our customer service team to arrange.',
        },
        {
          category: 'ingredients',
          q: 'Are ORRY products vegan?',
          a: 'All ORRY products are vegan! We use plant-based waxes and botanical oils. No animal-derived ingredients.',
        },
        {
          category: 'ingredients',
          q: 'What are the main ingredients?',
          a: 'ORRY products feature shea butter, jojoba oil, beeswax (in most formulas), essential oils, and natural pigments. See individual product pages for complete ingredient lists.',
        },
      ],
    },
    // Reviews Page
    reviews: {
      title: 'Customer Reviews',
      subtitle: 'Loved by beauty enthusiasts everywhere',
      cta_title: 'Love ORRY?',
      cta_subtitle: 'Share your experience and help others discover natural lip care.',
      cta_button: 'Leave a Review',
      trust_title: 'Why You Can Trust ORRY',
      testimonials: [
        {
          name: 'Pattaya, Thailand',
          rating: 5,
          text: 'Finally found a lip product that actually works! WHISPER keeps my lips hydrated all day without that sticky feeling.',
        },
        {
          name: 'Bangkok, Thailand',
          rating: 5,
          text: 'The BREEZE shade is absolutely gorgeous. It\'s become my go-to everyday lip color. Love that it\'s natural too!',
        },
        {
          name: 'Chiang Mai, Thailand',
          rating: 5,
          text: 'VELVET is the perfect deep red. I get compliments every time I wear it. Quality is amazing!',
        },
        {
          name: 'Online Customer',
          rating: 5,
          text: 'Ordered ORRY from abroad and was amazed by the quality. Shipping was faster than expected. Highly recommend!',
        },
        {
          name: 'Bangkok, Thailand',
          rating: 5,
          text: 'So grateful for products that are actually natural and don\'t contain harsh chemicals. My lips have never felt better!',
        },
        {
          name: 'International Customer',
          rating: 5,
          text: 'The whole ORRY collection is beautiful. I love supporting a brand that cares about the environment.',
        },
        {
          name: 'Local Boutique Owner',
          rating: 5,
          text: 'Our customers absolutely love ORRY. It\'s become our best-selling lip care product. Great business partner too!',
        },
        {
          name: 'Online Customer',
          rating: 5,
          text: 'Used all three shades now. Each one is perfect in its own way. ORRY is now an essential part of my routine.',
        },
      ],
    },
    // Footer
    footer: {
      about_us: 'About Us',
      contact_us: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      shipping: 'Shipping Policy',
      returns: 'Returns Policy',
      copyright: '© 2026 ORRY Thailand. All rights reserved.',
      tagline: 'Natural Lip Care. Honestly Made.',
    },
    // Home Page
    home: {
      hero_title: 'Natural Lip Care for the Modern You',
      hero_subtitle: 'Discover ORRY: Premium, plant-based lip care crafted from Thai tradition and science.',
      hero_cta: 'Shop Now',
      products_title: 'Our Collection',
      featured: 'Featured',
      whisper: {
        name: 'WHISPER',
        description: 'Clear Hydration',
        detail: 'Pure moisture meets timeless elegance. Our signature clear balm features shea butter, jojoba oil, and white wax for lips that feel soft and look naturally plump.',
      },
      breeze: {
        name: 'BREEZE',
        description: 'Warm Coral',
        detail: 'Sun-kissed warmth for everyday grace. A subtle coral shade with nourishing botanical oils and a silky finish that complements every skin tone.',
      },
      velvet: {
        name: 'VELVET',
        description: 'Deep Red',
        detail: 'Luxurious, bold, and utterly captivating. Our deep red formula combines antioxidant-rich botanicals with a velvety smooth application.',
      },
    },
  },
  th: {
    // Navigation
    nav: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับเรา',
      contact: 'ติดต่อเรา',
      faq: 'คำถามที่พบบ่อย',
      reviews: 'รีวิว',
      shop: 'ซื้อเลย',
    },
    // About Page
    about: {
      title: 'เกี่ยวกับ ORRY',
      subtitle: 'ความงามจากธรรมชาติที่ซื่อสัตย์',
      story_title: 'เรื่องราวของเรา',
      story: 'ORRY เกิดจากความเชื่อที่เรียบง่าย: ริมปากของคุณสมควรได้รับสิ่งที่ดีที่สุดจากธรรมชาติ ก่อตั้งขึ้นในปี 2563 เราสร้างคอลเลกชันผลิตภัณฑ์บำรุงริมปากแบบธรรมชาติที่สมบูรณ์แบบโดยการผสมผสานปัญญาไทยแบบดั้งเดิมกับวิทยาศาสตร์การดูแลผิว สูตรของเรากำหนดโดยไม่มีการประนีประนวม—ไม่มีสีเทียม ไม่มีสารเคมีที่เป็นอันตราย เพียงแค่วัตถุดิบบำรุงที่บริสุทธิ์ที่ทำให้ริมปากของคุณรู้สึกนุ่มชื้น และสวยงาม',
      mission_title: 'พันธกิจของเรา',
      mission: 'สร้างผลิตภัณฑ์บำรุงริมปากแบบธรรมชาติที่มีประสิทธิภาพสูงสุด ที่เฉลิมฉลองความงามอันแท้จริง และเคารพในทางปฏิบัติการอย่างยั่งยืน',
      values: [
        {
          title: 'ความเยี่ยมยอดแบบธรรมชาติ',
          description: 'เราใช้เฉพาะวัตถุดิบธรรมชาติที่มีคุณภาพสูง ได้มาจากซัพพลายเยอร์ที่น่าเชื่อถือทั่วประเทศไทย',
        },
        {
          title: 'ความซื่อสัตย์และความโปร่งใส',
          description: 'ทุกวัตถุดิบถูกเปิดเผย ทุกข้อเรียกร้องได้รับการทดสอบ เราเชื่อว่าคุณสมควรได้รับความโปร่งใสอย่างสมบูรณ์',
        },
        {
          title: 'ความงามที่ยั่งยืน',
          description: 'บรรจุภัณฑ์ของเราคำนึงถึงสภาพแวดล้อม ปฏิบัติของเราเป็นธรรมชาติ และผลกระทบต่อโลกของเรามีความสำคัญ',
        },
        {
          title: 'การดูแลชุมชน',
          description: 'ส่วนของการซื้อแต่ละครั้งสนับสนุนผู้หญิงศิลปะไทย และโครงการอนุรักษ์สภาพแวดล้อมท้องถิ่น',
        },
      ],
      team_title: 'ทีมงานของเรา',
      team: [
        {
          name: 'นิรัน จตุรมวง',
          role: 'ผู้ก่อตั้งและนักเคมีการสัตว์สวย',
          bio: 'นักเคมีสัตว์สวยที่มีประสบการณ์ 15 ปีในความงามแบบธรรมชาติ นิรัน ผสมผสานความรู้ความงามไทยบรรพบุรุษกับวิทยาศาสตร์การดูแลผิวที่ทันสมัย',
        },
        {
          name: 'สิริพร ประสาท',
          role: 'ผู้บริหารความยั่งยืน',
          bio: 'ผู้สนับสนุนสิ่งแวดล้อมที่มีความมุ่งมั่นในการสร้างแบรนด์ความงามที่ให้กลับคืนธรรมชาติและชุมชน',
        },
        {
          name: 'อนุชิต มูนพล',
          role: 'หัวหน้าการจัดหาวัตถุดิบ',
          bio: 'ทำงานโดยตรงกับเกษตรกรและซัพพลายเยอร์เพื่อให้แน่ใจว่าวัตถุดิบแต่ละรายตรงตามมาตรฐานคุณภาพที่เข้มงวดของ ORRY',
        },
      ],
      philosophy_title: 'ปรัชญาแบรนด์',
      philosophy: 'ที่ ORRY เราเชื่อว่าความงามไม่ควรสร้างความเสียหายให้ใครใจ ปรัชญาของเรายึดเบาะแส 3 ด้าน: ความเคารพต่อปัญญาของธรรมชาติ ความมุ่งมั่นในความเข้มงวดทางวิทยาศาสตร์ และการสื่อสารที่ซื่อสัตย์กับชุมชนของเรา เราไม่ติดตามแนวโน้ม—เราสร้างผลิตภัณฑ์ที่ทันสมัย ที่มีประสิทธิภาพ ที่คุณจะชอบการสวมใส่ปีต่อปี',
      images_title: 'ORRY ความงามในการกระทำ',
    },
    // Contact Page
    contact: {
      title: 'ติดต่อเรา',
      subtitle: 'เรายินดีที่ได้ยินจากคุณ',
      form: {
        name: 'ชื่อ-นามสกุล',
        email: 'ที่อยู่อีเมล',
        phone: 'เบอร์โทรศัพท์',
        message: 'ข้อความ',
        submit: 'ส่งข้อความ',
        success: 'ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับในไม่ช้า',
        error: 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่',
      },
      contact_info: 'ข้อมูลติดต่อ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      location: 'สถานที่ตั้ง',
      location_value: 'กรุงเทพมหานคร ประเทศไทย',
      follow_us: 'ติดตามเรา',
      whatsapp: 'WhatsApp เรา',
      hours: 'เวลาทำการ',
      hours_value: 'วันจันทร์ - ศุกร์: 9:00 - 18:00 น. ICT',
    },
    // FAQ Page
    faq: {
      title: 'คำถามที่พบบ่อย',
      subtitle: 'ค้นหาคำตอบสำหรับคำถามทั่วไปเกี่ยวกับผลิตภัณฑ์ ORRY',
      search_placeholder: 'ค้นหา FAQs...',
      categories: {
        product: 'การดูแลผลิตภัณฑ์',
        shipping: 'การจัดส่งและการสั่งซื้อ',
        returns: 'การคืนและเงินคืน',
        ingredients: 'วัตถุดิบและการดูแลผิว',
      },
      questions: [
        {
          category: 'product',
          q: 'ฉันควรใช้ผลิตภัณฑ์บำรุงริมปาก ORRY อย่างไร',
          a: 'ทาปริมาณเล็กน้อยโดยตรงบนริมปากของคุณ เพื่อผลลัพธ์ที่ดีที่สุด ใช้ 2-3 ครั้งต่อวัน WHISPER ใช้ได้ดีเยี่ยมเป็นฐานใต้ลิปสติก ขณะที่ BREEZE และ VELVET ดูสวยงามเมื่อใส่คนเดียว',
        },
        {
          category: 'product',
          q: 'ฉันสามารถใช้ผลิตภัณฑ์ ORRY ได้หากมีริมปากที่ไวต่อสารเคมี',
          a: 'ใช่! ผลิตภัณฑ์ ORRY ทั้งหมดจัดทำขึ้นสำหรับผิวที่ไวต่อสารเคมี อย่างไรก็ตาม หากคุณมีสภาวะแพ้ เรียบร้อย โปรดตรวจสอบรายการส่วนประกอบ เราแนะนำให้ทำการทดสอบปะติดปะต่อก่อน',
        },
        {
          category: 'product',
          q: 'ความแตกต่างระหว่าง WHISPER, BREEZE และ VELVET คืออะไร',
          a: 'WHISPER คือสูตรไฮเดรทเนียร์ของเราที่สมบูรณ์แบบสำหรับการบำรุงรักษาในแต่ละวันและเป็นฐาน BREEZE เป็นเฉดสีเมืองหลวงอบอุ่นพร้อมด้วยน้ำมันบำรุง VELVET เป็นสีแดงเข้มหรูหราพร้อมด้วยพืชที่อุดมไปด้วยแอนติออกซิแดนต์',
        },
        {
          category: 'product',
          q: 'หลอดเดียวใช้นานเท่าไร',
          a: 'โดยใช้ปกติ (2-3 ครั้งต่อวัน) หลอดเดียว 4.5 กรัม โดยปกติจะใช้ได้ 4-6 สัปดาห์ การใช้ของทุกคนแตกต่างกัน ดังนั้นอาจแตกต่างไปได้',
        },
        {
          category: 'shipping',
          q: 'ใช้เวลานานเท่าไรในการจัดส่ง',
          a: 'ในประเทศไทย: 2-3 วันทำการ การสั่งซื้อสากลประเทศ: 7-14 วันทำการ ขึ้นอยู่กับสถานที่ปลายทาง มีตัวเลือกด่วนพิเศษ',
        },
        {
          category: 'shipping',
          q: 'คุณส่งไปต่างประเทศหรือไม่',
          a: 'ใช่! เราส่งไปประเทศส่วนใหญ่ การสั่งซื้อสากลประเทศอาจมีค่าใช้จ่ายการจัดส่ง และอาจเสียภาษีศุลกากร',
        },
        {
          category: 'shipping',
          q: 'มีการจัดส่งฟรีหรือไม่',
          a: 'การจัดส่งฟรีในประเทศไทยสำหรับการสั่งซื้อเกิน 500 บาท การจัดส่งฟรีสากลประเทศสำหรับการสั่งซื้อเกิน 2,000 บาท',
        },
        {
          category: 'shipping',
          q: 'ฉันสามารถติดตามคำสั่งของฉันได้หรือไม่',
          a: 'แน่นอน! คุณจะได้รับหมายเลขติดตามผ่านอีเมลเมื่อคำสั่งของคุณถูกส่ง คุณสามารถติดตามได้บนเว็บไซต์บริษัทจัดส่ง',
        },
        {
          category: 'returns',
          q: 'นโยบายการคืนของเราคืออะไร',
          a: 'เรามีนโยบายการคืนสินค้า 30 วันสำหรับผลิตภัณฑ์ที่ไม่ได้ใช้ในบรรจุภัณฑ์เดิม ผลิตภัณฑ์ที่เปิดแล้วสามารถคืนได้ภายใน 14 วันหากไม่ได้ใช้ โปรดติดต่อเราเพื่อเริ่มการคืน',
        },
        {
          category: 'returns',
          q: 'ฉันสามารถแลกเปลี่ยนผลิตภัณฑ์ได้หรือไม่',
          a: 'ใช่! คุณสามารถแลกเปลี่ยนได้สำหรับเฉดสีหรือผลิตภัณฑ์ที่แตกต่างกันภายใน 14 วันนับจากวันซื้อ ติดต่อทีมบริการลูกค้าของเรา',
        },
        {
          category: 'ingredients',
          q: 'ผลิตภัณฑ์ ORRY เป็นผลิตภัณฑ์ที่ไม่ได้มาจากสัตว์หรือไม่',
          a: 'ผลิตภัณฑ์ ORRY ทั้งหมดไม่ได้มาจากสัตว์! เราใช้ขี้ผึ้งและน้ำมันพืชแบบธรรมชาติ ไม่มีส่วนประกอบที่มาจากสัตว์',
        },
        {
          category: 'ingredients',
          q: 'วัตถุดิบหลักคืออะไร',
          a: 'ผลิตภัณฑ์ ORRY มีลักษณะเด่นคือเนยถั่ว น้ำมันโจโจบา ขี้ผึ้ง (ในสูตรส่วนใหญ่) น้ำมันหอม และสีธรรมชาติ ดูหน้าผลิตภัณฑ์แต่ละหน้าสำหรับรายการส่วนประกอบแบบสมบูรณ์',
        },
      ],
    },
    // Reviews Page
    reviews: {
      title: 'รีวิวจากลูกค้า',
      subtitle: 'รักษาโดยผู้บุกเบิกความงามทั่วโลก',
      cta_title: 'ชอบ ORRY',
      cta_subtitle: 'แบ่งปันประสบการณ์ของคุณและช่วยให้ผู้อื่นค้นพบการดูแลริมปากแบบธรรมชาติ',
      cta_button: 'เขียนรีวิว',
      trust_title: 'ทำไมคุณจึงสามารถไว้วางใจ ORRY',
      testimonials: [
        {
          name: 'พัทยา ประเทศไทย',
          rating: 5,
          text: 'ในที่สุดก็พบผลิตภัณฑ์ริมปากที่ได้ผล! WHISPER ช่วยให้ริมปากของฉันชุ่มชื้นตลอดวันโดยไม่มีความรู้สึกเหนียวเนื้อ',
        },
        {
          name: 'กรุงเทพมหานคร ประเทศไทย',
          rating: 5,
          text: 'เฉดสี BREEZE สวยงามอย่างแน่นอน มันกลายเป็นสีริมปากโปรดของฉันในแต่ละวัน ชอบที่มันเป็นธรรมชาติ!',
        },
        {
          name: 'เชียงใหม่ ประเทศไทย',
          rating: 5,
          text: 'VELVET เป็นเฉดแดงเข้มที่สมบูรณ์แบบ ฉันได้รับการชมเชยทุกครั้งที่ฉันใส่ คุณภาพน่าทึ่ง!',
        },
        {
          name: 'ลูกค้าออนไลน์',
          rating: 5,
          text: 'สั่ง ORRY จากต่างประเทศและประหลาดใจกับคุณภาพ การจัดส่งเร็วกว่าที่คาดไว้ ขอแนะนำสูง!',
        },
        {
          name: 'กรุงเทพมหานคร ประเทศไทย',
          rating: 5,
          text: 'ขอบคุณสำหรับผลิตภัณฑ์ที่เป็นธรรมชาติจริง ๆ และไม่มีสารเคมีที่รุนแรง ริมปากของฉันไม่เคยรู้สึกดีเท่านี้มาก่อน!',
        },
        {
          name: 'ลูกค้าสากลประเทศ',
          rating: 5,
          text: 'คอลเลกชัน ORRY ทั้งหมดสวยงาม ฉันชอบสนับสนุนแบรนด์ที่ใส่ใจสภาพแวดล้อม',
        },
        {
          name: 'เจ้าของร้านบูติกท้องถิ่น',
          rating: 5,
          text: 'ลูกค้าของเราชอบ ORRY มาก มันกลายเป็นผลิตภัณฑ์ที่ขายดีที่สุดของเรา คู่ค้าที่ยอดเยี่ยม!',
        },
        {
          name: 'ลูกค้าออนไลน์',
          rating: 5,
          text: 'ใช้ทั้งสามเฉดสีแล้ว แต่ละคนสมบูรณ์แบบในแบบของพวกเขา ORRY เป็นส่วนสำคัญของความเป็นตัวเองของฉันตอนนี้',
        },
      ],
    },
    // Footer
    footer: {
      about_us: 'เกี่ยวกับเรา',
      contact_us: 'ติดต่อเรา',
      privacy: 'นโยบายความเป็นส่วนตัว',
      terms: 'เงื่อนไขการใช้งาน',
      shipping: 'นโยบายการจัดส่ง',
      returns: 'นโยบายการคืนสินค้า',
      copyright: '© 2026 ORRY ประเทศไทย สงวนลิขสิทธิ์ทั้งหมด',
      tagline: 'การดูแลริมปากแบบธรรมชาติ ซื่อสัตย์ที่สุด',
    },
    // Home Page
    home: {
      hero_title: 'การดูแลริมปากแบบธรรมชาติสำหรับคุณสมัยใหม่',
      hero_subtitle: 'ค้นพบ ORRY: การดูแลริมปากพรีเมียมที่ปลูกจากประเพณีไทยและวิทยาศาสตร์',
      hero_cta: 'ซื้อเลย',
      products_title: 'คอลเลกชันของเรา',
      featured: 'นิยม',
      whisper: {
        name: 'WHISPER',
        description: 'ความชุ่มชื้นที่ชัดเจน',
        detail: 'ความชื้นแท้เจอกับความหรูหราที่ทันสมัย ริมปากหลักของเรา มีน้ำมันจากแตกราคม น้ำมันโจโจบา และขี้ผึ้งขาว',
      },
      breeze: {
        name: 'BREEZE',
        description: 'หลวมอบอุ่น',
        detail: 'ความอบอุ่นแสงแดดสำหรับความสง่างามในแต่ละวัน เฉดสีเมืองหลวงอบอุ่นบนฐาน กับน้ำมันพืชบำรุง และจบด้วยความลื่นไหล',
      },
      velvet: {
        name: 'VELVET',
        description: 'สีแดงเข้ม',
        detail: 'หรูหรา ล้มลุกและดึงดูดใจโดยไม่มีขีดจำกัด สูตรแดงเข้มของเรา รวมพืชที่อุดมไปด้วยแอนติออกซิแดนต์',
      },
    },
  },
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    value = value[k];
    if (value === undefined) return key;
  }

  return typeof value === 'string' ? value : key;
}
