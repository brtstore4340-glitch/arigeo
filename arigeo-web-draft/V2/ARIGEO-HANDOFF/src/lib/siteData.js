const svgDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`

const heroImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="ARIGEO hero still life">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="100%" stop-color="#f3f0ea"/>
    </linearGradient>
    <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottle" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e9e5df"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <circle cx="916" cy="250" r="220" fill="#df0c0c"/>
  <path d="M58 770c220 26 839 26 1086 0" fill="none" stroke="url(#shadow)" stroke-width="44" stroke-linecap="round" opacity=".45"/>
  <g transform="translate(317 205)">
    <rect x="0" y="88" rx="32" ry="32" width="176" height="418" fill="url(#bottle)"/>
    <rect x="55" y="44" rx="10" width="66" height="58" fill="#f4f1ec"/>
    <rect x="70" y="22" rx="6" width="36" height="22" fill="#efefef"/>
    <rect x="41" y="145" rx="12" width="94" height="9" fill="#d8d3cd"/>
    <rect x="41" y="176" rx="9" width="94" height="9" fill="#d8d3cd" opacity=".85"/>
    <text x="88" y="244" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="30" fill="#111">ARIGEO</text>
    <circle cx="126" cy="234" r="9" fill="#df0c0c"/>
    <text x="88" y="332" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" fill="#4b4b4b">SURFACE CLEANER</text>
    <text x="88" y="356" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" fill="#8b8b8b">POWERFUL &amp; GENTLE</text>
  </g>
  <g transform="translate(498 176)">
    <rect x="0" y="116" rx="22" ry="22" width="136" height="446" fill="rgba(255,255,255,.55)" stroke="#ddd8d1"/>
    <rect x="38" y="70" rx="10" width="60" height="44" fill="#f4f1ec"/>
    <rect x="50" y="42" rx="6" width="36" height="30" fill="#efefef"/>
    <rect x="36" y="176" rx="12" width="64" height="8" fill="#d8d3cd"/>
    <rect x="36" y="206" rx="9" width="64" height="8" fill="#d8d3cd" opacity=".8"/>
    <text x="68" y="284" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="26" fill="#111">ARIGEO</text>
    <circle cx="103" cy="274" r="7" fill="#df0c0c"/>
    <text x="68" y="360" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" fill="#4b4b4b">HAND WASH</text>
  </g>
  <g transform="translate(684 226)">
    <rect x="0" y="74" rx="30" ry="30" width="182" height="388" fill="url(#bottle)"/>
    <rect x="54" y="28" rx="10" width="74" height="48" fill="#f4f1ec"/>
    <rect x="71" y="10" rx="6" width="40" height="18" fill="#efefef"/>
    <rect x="43" y="144" rx="12" width="92" height="9" fill="#d8d3cd"/>
    <text x="91" y="252" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="30" fill="#111">ARIGEO</text>
    <circle cx="131" cy="242" r="9" fill="#df0c0c"/>
    <text x="91" y="333" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" fill="#4b4b4b">BODY LOTION</text>
    <text x="91" y="356" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" fill="#8b8b8b">DAILY MOISTURE</text>
  </g>
  <g transform="translate(883 456)">
    <rect x="0" y="134" rx="24" ry="24" width="150" height="176" fill="url(#bottle)"/>
    <rect x="34" y="104" rx="12" width="82" height="36" fill="#232323"/>
    <text x="75" y="202" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="22" fill="#111">ARIGEO</text>
    <circle cx="118" cy="194" r="6" fill="#df0c0c"/>
    <text x="75" y="228" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" fill="#4b4b4b">MOISTURE CREAM</text>
  </g>
  <g transform="translate(1012 357)">
    <rect x="44" y="0" width="64" height="260" rx="24" fill="#e8efe7"/>
    <path d="M0 76c20-20 49-28 84-24 21 2 46 13 60 31-25 1-46 10-64 26-18 16-29 39-30 69-22-33-35-72-50-102z" fill="#6ea35c"/>
    <path d="M52 32c26-12 47-10 70 4" stroke="#6ea35c" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M77 15c1 36-7 80-28 118" stroke="#4d7e3c" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
  <g transform="translate(913 599)">
    <rect x="0" y="0" width="186" height="100" rx="18" fill="#faf8f4" opacity=".9"/>
    <rect x="22" y="18" width="62" height="50" rx="8" fill="#ece7e0"/>
    <rect x="36" y="10" width="34" height="12" rx="6" fill="#fff"/>
    <path d="M110 58h34l-18-30z" fill="#ded7cf"/>
  </g>
</svg>
`)

const householdImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" role="img" aria-label="Household brand scene">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f6f2"/>
      <stop offset="100%" stop-color="#ebe4da"/>
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7ec"/>
      <stop offset="100%" stop-color="#eadbc9"/>
    </linearGradient>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <rect x="70" y="130" width="540" height="260" rx="28" fill="url(#sun)" opacity=".8"/>
  <rect x="104" y="166" width="120" height="164" rx="8" fill="#f6f4ef"/>
  <rect x="132" y="166" width="6" height="164" fill="#d9d1c5"/>
  <rect x="190" y="166" width="6" height="164" fill="#d9d1c5"/>
  <rect x="108" y="170" width="112" height="126" fill="#fff" opacity=".5"/>
  <rect x="270" y="196" width="300" height="110" rx="26" fill="#d7c4ad"/>
  <rect x="300" y="160" width="240" height="30" rx="15" fill="#f3ece2"/>
  <rect x="322" y="228" width="56" height="42" rx="10" fill="#eee9e2"/>
  <rect x="382" y="224" width="56" height="46" rx="10" fill="#ece5dd"/>
  <rect x="442" y="228" width="56" height="42" rx="10" fill="#eee9e2"/>
  <rect x="304" y="312" width="220" height="14" rx="7" fill="#b89573"/>
  <rect x="262" y="344" width="340" height="42" rx="20" fill="#c79a6f"/>
  <rect x="232" y="382" width="392" height="110" rx="20" fill="#ad835c"/>
  <circle cx="708" cy="236" r="72" fill="#9cc587" opacity=".55"/>
  <path d="M726 154c8 68 6 128 6 196" stroke="#5c8b3d" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M726 208c-34-6-58-24-78-52" stroke="#5c8b3d" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M734 214c38-6 65-25 86-58" stroke="#5c8b3d" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M100 620c138 0 612 0 760 0" stroke="#d9d0c7" stroke-width="10" stroke-linecap="round"/>
</svg>
`)

const skincareImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" role="img" aria-label="Skincare brand scene">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f8f7"/>
      <stop offset="100%" stop-color="#ececec"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e6e0da"/>
    </linearGradient>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <path d="M100 570c190 24 570 24 760 0" stroke="#d8d0c8" stroke-width="10" stroke-linecap="round"/>
  <rect x="145" y="422" width="132" height="132" rx="26" fill="#f1ebe4"/>
  <rect x="166" y="404" width="90" height="24" rx="12" fill="#fff"/>
  <rect x="208" y="240" width="106" height="280" rx="32" fill="url(#glass)"/>
  <rect x="235" y="202" width="52" height="48" rx="8" fill="#f3ede5"/>
  <rect x="246" y="184" width="30" height="20" rx="5" fill="#ece7df"/>
  <rect x="348" y="198" width="118" height="350" rx="36" fill="url(#glass)"/>
  <rect x="380" y="160" width="54" height="46" rx="10" fill="#f3ede5"/>
  <rect x="392" y="140" width="30" height="20" rx="5" fill="#ece7df"/>
  <rect x="508" y="248" width="150" height="274" rx="30" fill="url(#glass)"/>
  <rect x="546" y="212" width="74" height="46" rx="10" fill="#f3ede5"/>
  <rect x="562" y="192" width="42" height="20" rx="5" fill="#ece7df"/>
  <circle cx="736" cy="210" r="58" fill="#acd3b1" opacity=".5"/>
  <path d="M710 164c18 52 18 102 0 150" stroke="#7ea56f" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M698 244c-20-26-44-42-74-50" stroke="#7ea56f" stroke-width="7" stroke-linecap="round" fill="none"/>
  <rect x="756" y="360" width="106" height="166" rx="30" fill="#f3ede5"/>
  <rect x="774" y="336" width="70" height="24" rx="12" fill="#fff"/>
</svg>
`)

const newsroomImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" role="img" aria-label="Corporate newsroom scene">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f8fa"/>
      <stop offset="100%" stop-color="#e9edf2"/>
    </linearGradient>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <rect x="106" y="142" width="560" height="360" rx="22" fill="#d9e0e8"/>
  <rect x="142" y="180" width="488" height="286" rx="16" fill="#b8c7d4"/>
  <rect x="165" y="202" width="448" height="244" rx="10" fill="#f4f6f8"/>
  <rect x="182" y="216" width="100" height="40" rx="8" fill="#ffffff"/>
  <rect x="302" y="216" width="118" height="40" rx="8" fill="#ffffff"/>
  <rect x="442" y="216" width="156" height="40" rx="8" fill="#ffffff"/>
  <rect x="214" y="288" width="366" height="20" rx="10" fill="#cbd5dd"/>
  <rect x="214" y="324" width="300" height="20" rx="10" fill="#cbd5dd"/>
  <rect x="214" y="360" width="240" height="20" rx="10" fill="#cbd5dd"/>
  <circle cx="748" cy="238" r="122" fill="#b4c2ce" opacity=".65"/>
  <rect x="696" y="374" width="180" height="148" rx="18" fill="#ffffff" opacity=".9"/>
  <rect x="716" y="394" width="86" height="12" rx="6" fill="#d33"/>
  <rect x="716" y="418" width="128" height="16" rx="8" fill="#d8dde2"/>
  <rect x="716" y="450" width="104" height="16" rx="8" fill="#d8dde2"/>
</svg>
`)

const productImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" role="img" aria-label="Product launch scene">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#faf7f4"/>
      <stop offset="100%" stop-color="#f0e6da"/>
    </linearGradient>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <path d="M116 596c178 12 560 12 722 0" stroke="#dacfbf" stroke-width="12" stroke-linecap="round"/>
  <rect x="160" y="220" width="126" height="322" rx="30" fill="#fff"/>
  <rect x="190" y="188" width="66" height="42" rx="10" fill="#f2ece4"/>
  <text x="223" y="392" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="#111">ARIGEO</text>
  <circle cx="266" cy="384" r="7" fill="#df0c0c"/>
  <rect x="334" y="178" width="146" height="366" rx="34" fill="#fff"/>
  <rect x="370" y="146" width="74" height="46" rx="10" fill="#f2ece4"/>
  <text x="407" y="362" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="#111">ARIGEO</text>
  <circle cx="451" cy="354" r="7" fill="#df0c0c"/>
  <rect x="524" y="216" width="136" height="290" rx="32" fill="#fff"/>
  <rect x="556" y="182" width="72" height="44" rx="10" fill="#f2ece4"/>
  <text x="592" y="386" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="#111">ARIGEO</text>
  <circle cx="636" cy="378" r="7" fill="#df0c0c"/>
  <rect x="712" y="452" width="136" height="130" rx="24" fill="#fff"/>
  <rect x="742" y="418" width="76" height="42" rx="10" fill="#1f1f1f"/>
</svg>
`)

const sharedAssets = {
  heroImage,
  householdImage,
  skincareImage,
  newsroomImage,
  productImage,
}

const en = {
  languageLabel: 'Global',
  languageShort: 'EN',
  altLanguageShort: 'TH',
  navLinks: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Brands', href: '#brands' },
    { label: 'Products', href: '#brands' },
    { label: 'Innovation', href: '#innovation' },
    { label: 'Sustainability', href: '#innovation' },
    { label: 'Newsroom', href: '#news' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact Us', href: '#contact' },
  ],
  hero: {
    eyebrow: 'ARIGEO CORPORATE WEBSITE',
    title: ['Elevating', 'Everyday Life'],
    emphasis: ['Through Innovation', 'People Understand'],
    body:
      'ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care—bringing quality to everyday life for everyone.',
    cta: 'Discover More',
    image: sharedAssets.heroImage,
    alt: 'ARIGEO hero still life with red circle',
  },
  gateways: [
    {
      title: 'Household',
      description: 'Smart solutions for a clean, safe and comfortable home for everyone.',
      cta: 'Explore Products',
      image: sharedAssets.householdImage,
      alt: 'Household living room scene',
      icon: '01',
    },
    {
      title: 'Skincare',
      description: 'Thoughtfully formulated skincare for healthy, beautiful skin every day.',
      cta: 'Explore Products',
      image: sharedAssets.skincareImage,
      alt: 'Skincare product still life',
      icon: '02',
    },
  ],
  values: [
    {
      title: 'Innovation for Better Living',
      description:
        'We continuously create and improve products that deliver better performance and elevate everyday life.',
    },
    {
      title: 'Sustainability for the Future',
      description:
        'We are committed to reducing our environmental impact and building a better world for future generations.',
    },
    {
      title: 'Safety & Quality You Can Trust',
      description:
        'Every product is developed and tested with high standards to ensure safety, quality and reliability.',
    },
  ],
  news: [
    {
      category: 'Corporate',
      date: 'May 12, 2024',
      title: 'ARIGEO Unveils New Vision for Innovation-Driven Everyday Living',
      image: sharedAssets.newsroomImage,
      alt: 'ARIGEO corporate newsroom illustration',
    },
    {
      category: 'Product',
      date: 'May 08, 2024',
      title: 'New Skincare Line Launched for Sensitive and Healthy Skin',
      image: sharedAssets.productImage,
      alt: 'ARIGEO product launch illustration',
    },
    {
      category: 'Sustainability',
      date: 'May 01, 2024',
      title: 'ARIGEO Pledges to Achieve Carbon Neutrality by 2050',
      image: sharedAssets.householdImage,
      alt: 'Sustainability editorial illustration',
    },
    {
      category: 'Lifestyle',
      date: 'Apr 28, 2024',
      title: 'Skincare Tips for Everyday Life You Can Start Today',
      image: sharedAssets.skincareImage,
      alt: 'Lifestyle skincare editorial illustration',
    },
  ],
  newsletter: {
    title: 'Stay Updated with ARIGEO',
    description:
      'Subscribe to our newsletter for the latest updates on innovation, products and everyday living.',
    placeholder: 'Your email address',
    cta: 'Subscribe',
    successTitle: 'Thanks for subscribing',
    successBody: 'You will receive the latest ARIGEO updates in your inbox soon.',
  },
  footerIntro:
    'ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care—bringing quality to everyday life for everyone.',
  footerColumns: [
    {
      title: 'About Us',
      links: ['Our Company', 'Our Philosophy', 'Leadership', 'Milestones'],
    },
    {
      title: 'Our Brands',
      links: ['Household', 'Skincare', 'Brand Portfolio'],
    },
    {
      title: 'Innovation',
      links: ['R&D', 'Technology', 'Quality Assurance'],
    },
    {
      title: 'Sustainability',
      links: ['Our Approach', 'Environment', 'Social', 'Governance'],
    },
    {
      title: 'Careers',
      links: ['Why ARIGEO', 'Open Positions', 'Life at ARIGEO'],
    },
    {
      title: 'Contact Us',
      links: ['Get in Touch', 'Media Inquiries', 'Partners'],
    },
  ],
  legalLinks: ['Terms of Use', 'Privacy Policy', 'Sitemap'],
}

const th = {
  languageLabel: 'Global',
  languageShort: 'TH',
  altLanguageShort: 'EN',
  navLinks: [
    { label: 'เกี่ยวกับเรา', href: '#about' },
    { label: 'แบรนด์ของเรา', href: '#brands' },
    { label: 'สินค้า', href: '#brands' },
    { label: 'นวัตกรรม', href: '#innovation' },
    { label: 'ความยั่งยืน', href: '#innovation' },
    { label: 'ข่าวสาร', href: '#news' },
    { label: 'ร่วมงานกับเรา', href: '#careers' },
    { label: 'ติดต่อเรา', href: '#contact' },
  ],
  hero: {
    eyebrow: 'เว็บไซต์องค์กร ARIGEO',
    title: ['ยกระดับ', 'ชีวิตประจำวัน'],
    emphasis: ['ด้วยนวัตกรรม', 'ที่เข้าใจผู้คน'],
    body:
      'ARIGEO พัฒนาผลิตภัณฑ์สำหรับบ้านและสกินแคร์ที่เชื่อถือได้ ผสานนวัตกรรม ความปลอดภัย และความใส่ใจ เพื่อยกระดับคุณภาพชีวิตในทุกวัน',
    cta: 'ดูเพิ่มเติม',
    image: sharedAssets.heroImage,
    alt: 'ภาพฮีโร่ ARIGEO พร้อมวงกลมสีแดง',
  },
  gateways: [
    {
      title: 'ของใช้ในบ้าน',
      description: 'โซลูชันอัจฉริยะเพื่อบ้านที่สะอาด ปลอดภัย และน่าอยู่สำหรับทุกคน',
      cta: 'สำรวจสินค้า',
      image: sharedAssets.householdImage,
      alt: 'ภาพหมวดของใช้ในบ้าน',
      icon: '01',
    },
    {
      title: 'สกินแคร์',
      description: 'สูตรที่ตั้งใจพัฒนาเพื่อผิวที่สุขภาพดีและสวยงามในทุกวัน',
      cta: 'สำรวจสินค้า',
      image: sharedAssets.skincareImage,
      alt: 'ภาพหมวดสกินแคร์',
      icon: '02',
    },
  ],
  values: [
    {
      title: 'นวัตกรรมเพื่อชีวิตที่ดีขึ้น',
      description: 'เราพัฒนาผลิตภัณฑ์อย่างต่อเนื่องเพื่อประสิทธิภาพที่ดียิ่งขึ้นและชีวิตประจำวันที่ดีขึ้น',
    },
    {
      title: 'ความยั่งยืนเพื่ออนาคต',
      description: 'เรามุ่งลดผลกระทบต่อสิ่งแวดล้อมและสร้างอนาคตที่ดีกว่าสำหรับคนรุ่นต่อไป',
    },
    {
      title: 'ความปลอดภัยและคุณภาพที่คุณวางใจได้',
      description: 'ทุกผลิตภัณฑ์ถูกพัฒนาและทดสอบตามมาตรฐานสูงเพื่อความปลอดภัย คุณภาพ และความน่าเชื่อถือ',
    },
  ],
  news: [
    {
      category: 'องค์กร',
      date: '12 พ.ค. 2024',
      title: 'ARIGEO เปิดวิสัยทัศน์ใหม่เพื่อชีวิตประจำวันที่ขับเคลื่อนด้วยนวัตกรรม',
      image: sharedAssets.newsroomImage,
      alt: 'ภาพข่าวองค์กร ARIGEO',
    },
    {
      category: 'ผลิตภัณฑ์',
      date: '08 พ.ค. 2024',
      title: 'เปิดตัวไลน์สกินแคร์ใหม่สำหรับผิวบอบบางและสุขภาพดี',
      image: sharedAssets.productImage,
      alt: 'ภาพเปิดตัวผลิตภัณฑ์',
    },
    {
      category: 'ความยั่งยืน',
      date: '01 พ.ค. 2024',
      title: 'ARIGEO ตั้งเป้าบรรลุคาร์บอนนิวทรัลภายในปี 2050',
      image: sharedAssets.householdImage,
      alt: 'ภาพสื่อสารความยั่งยืน',
    },
    {
      category: 'ไลฟ์สไตล์',
      date: '28 เม.ย. 2024',
      title: 'เคล็ดลับดูแลผิวในชีวิตประจำวัน เริ่มได้ตั้งแต่วันนี้',
      image: sharedAssets.skincareImage,
      alt: 'ภาพบทความไลฟ์สไตล์',
    },
  ],
  newsletter: {
    title: 'ติดตามข่าวสารจาก ARIGEO',
    description: 'สมัครรับจดหมายข่าวเพื่อรับอัปเดตล่าสุดเกี่ยวกับนวัตกรรม ผลิตภัณฑ์ และไลฟ์สไตล์',
    placeholder: 'อีเมลของคุณ',
    cta: 'สมัครรับข่าวสาร',
    successTitle: 'ขอบคุณที่สมัครรับข่าวสาร',
    successBody: 'คุณจะได้รับอัปเดตล่าสุดจาก ARIGEO ในอีเมลของคุณเร็ว ๆ นี้',
  },
  footerIntro:
    'ARIGEO พัฒนาผลิตภัณฑ์สำหรับบ้านและสกินแคร์ที่เชื่อถือได้ ผสานนวัตกรรม ความปลอดภัย และความใส่ใจ เพื่อยกระดับคุณภาพชีวิตในทุกวัน',
  footerColumns: [
    {
      title: 'เกี่ยวกับเรา',
      links: ['บริษัทของเรา', 'แนวคิดของเรา', 'ผู้นำองค์กร', 'เหตุการณ์สำคัญ'],
    },
    {
      title: 'แบรนด์ของเรา',
      links: ['ของใช้ในบ้าน', 'สกินแคร์', 'พอร์ตโฟลิโอแบรนด์'],
    },
    {
      title: 'นวัตกรรม',
      links: ['R&D', 'เทคโนโลยี', 'การประกันคุณภาพ'],
    },
    {
      title: 'ความยั่งยืน',
      links: ['แนวทางของเรา', 'สิ่งแวดล้อม', 'สังคม', 'ธรรมาภิบาล'],
    },
    {
      title: 'ร่วมงานกับเรา',
      links: ['ทำไมต้อง ARIGEO', 'ตำแหน่งที่เปิดรับ', 'ชีวิตที่ ARIGEO'],
    },
    {
      title: 'ติดต่อเรา',
      links: ['ติดต่อสอบถาม', 'สื่อและข่าวสาร', 'พันธมิตร'],
    },
  ],
  legalLinks: ['ข้อกำหนดการใช้งาน', 'นโยบายความเป็นส่วนตัว', 'แผนผังเว็บไซต์'],
}

export const supportedLocales = ['en', 'th']
export const defaultLocale = 'en'
export const contentByLocale = { en, th }

export const getLocaleContent = (locale) => contentByLocale[locale] ?? contentByLocale[defaultLocale]
