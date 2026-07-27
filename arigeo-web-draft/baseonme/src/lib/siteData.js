const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const images = {
  heroProducts: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/e6b862d31_generated_image.png',
  household: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/39d521111_generated_image.png',
  skincare: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/42edd0de7_generated_image.png',
  news1: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/9d619c070_generated_image.png',
  news2: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/7d38bb940_generated_image.png',
  news3: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/429f06405_generated_image.png',
  news4: 'https://media.db.com/images/public/6a571622876e88ba12b774f8/0e6b9efeb_generated_image.png',
};

export const navLinks = [
  { label: 'About Us', path: '#about' },
  { label: 'Our Brands', path: '#products' },
  { label: 'Products', path: '#products' },
  { label: 'Innovation', path: '#innovation' },
  { label: 'Sustainability', path: '#innovation' },
  { label: 'Newsroom', path: '#news' },
  { label: 'Careers', path: '#careers' },
  { label: 'Contact Us', path: '#contact' },
];

export const newsArticles = [
  {
    id: 1,
    category: 'Corporate',
    date: 'January 15, 2024',
    title: 'ARIGEO Unveils New Vision for Global Expansion',
    image: images.news1,
  },
  {
    id: 2,
    category: 'Product',
    date: 'January 8, 2024',
    title: 'New Skincare Line Launched with Advanced Formula',
    image: images.news2,
  },
  {
    id: 3,
    category: 'Sustainability',
    date: 'December 20, 2023',
    title: 'ARIGEO Pledges to Achieve Carbon Neutrality by 2030',
    image: images.news3,
  },
  {
    id: 4,
    category: 'Lifestyle',
    date: 'December 10, 2023',
    title: 'Skincare Tips for Healthy, Beautiful Skin Every Day',
    image: images.news4,
  },
];

export const footerColumns = [
  {
    title: 'About Us',
    links: ['Company', 'Philosophy', 'Leadership', 'Milestones', 'Locations'],
  },
  {
    title: 'Our Brands',
    links: ['Household', 'Skincare', 'Portfolio'],
  },
  {
    title: 'Innovation',
    links: ['R&D', 'Technology', 'QA'],
  },
  {
    title: 'Sustainability',
    links: ['Approach', 'Environment', 'Social', 'Governance'],
  },
  {
    title: 'Careers',
    links: ['Why ARIGEO', 'Open Positions', 'Life at ARIGEO'],
  },
  {
    title: 'Contact Us',
    links: ['Get in Touch', 'Media', 'Partners'],
  },
];