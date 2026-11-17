export interface Destination {
  id: string;
  title: string;
  category: string;
  code: string;
  image: string;
  alt: string;
  overview: string;
  bestTime: string;
  metro: string;
  highlights: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'lujiazui',
    title: 'Lujiazui & Shanghai Tower',
    category: 'Skyline / Pudong Financial District',
    code: '2099 SECTOR 01',
    image: '/images/shanghai_lujiazui_tower_1794638679436.jpg',
    alt: 'Panoramic view of Lujiazui skyline and Shanghai Tower at dusk',
    overview:
      'Rising 632 meters above the Pudong peninsula, Shanghai Tower offers one of the highest viewpoints on Earth. Surrounded by vibrant plazas, elevated walkways, and neighboring landmarks like Jin Mao Tower, Lujiazui is the ultimate stop to experience Shanghai’s modern energy from street level to the clouds.',
    bestTime: '17:30 – 20:30 CST (Golden sunset transitioning into full city lights)',
    metro: 'Line 2 & Line 14 — Lujiazui Station (Exit 6, direct access to the elevated pedestrian ring)',
    highlights: [
      'Top of Shanghai observation deck on the 118th floor reached by ultra-fast elevators',
      'Circular skywalk above Lujiazui roundabout for sweeping, unobstructed city views',
      'Riverside promenade along Binjiang Avenue for relaxed evening strolls facing The Bund',
    ],
  },
  {
    id: 'the-bund',
    title: 'The Bund (Waitan)',
    category: 'Waterfront / Huangpu River Promenade',
    code: '31.2397° N',
    image: '/images/shanghai_the_bund_1794638680117.jpg',
    alt: 'The Bund waterfront promenade in Shanghai overlooking the Pudong skyline',
    overview:
      'Stretching 1.5 kilometers along the western bank of the Huangpu River, The Bund is Shanghai’s most iconic waterfront walk. With cool river breezes on one side and grand historic avenues on the other, this promenade brings together morning tai chi locals, evening travelers, and unmatched views of the glowing Pudong skyline across the water.',
    bestTime: '06:00 – 07:30 CST (Quiet morning light) or 19:00 – 22:00 CST (Illuminated skyline)',
    metro: 'Line 2 & Line 10 — East Nanjing Road Station (Exit 2, 8-minute walk east)',
    highlights: [
      'Two-tier riverside boardwalk offering front-row views of Lujiazui across the Huangpu',
      'Evening Huangpu River cruises departing near Shiliupu Wharf for waterside sightseeing',
      'Scenic walk north toward Waibaidu Bridge and Suzhou Creek’s lively riverside cafés',
    ],
  },
  {
    id: 'yu-garden',
    title: 'Yu Garden (Yuyuan)',
    category: 'Heritage Oasis / Old City',
    code: 'MING 1559',
    image: '/images/shanghai_yu_garden_1794638680704.jpg',
    alt: 'Traditional Ming Dynasty pavilions and winding pond bridges at Yu Garden in Shanghai',
    overview:
      'Dating back to 1559 during the Ming Dynasty, Yu Garden is a peaceful sanctuary tucked inside Shanghai’s bustling Old City. Winding pathways lead visitors past koi-filled lotus ponds, shady rockeries, and serene courtyards, right beside the lively Yuyuan Bazaar famous for local snacks and handmade crafts.',
    bestTime: '08:30 – 10:30 CST (Soft morning light and fewer crowds along the garden paths)',
    metro: 'Line 10 & Line 14 — Yuyuan Garden Station (Exit 1 or 7)',
    highlights: [
      'The Zigzag Nine-Turn Bridge crossing the lotus pond toward the historic Huxinting Teahouse',
      'Authentic steamed soup dumplings (xiaolongbao) and street treats at nearby Yuyuan Bazaar',
      'Tranquil inner courtyards, bonsai displays, and peaceful water features away from city traffic',
    ],
  },
  {
    id: 'nanjing-road',
    title: 'Nanjing Road Pedestrian',
    category: 'City Pulse / Central Promenade',
    code: '5.5KM STRIP',
    image: '/images/shanghai_nanjing_road_1794638681080.jpg',
    alt: 'Nanjing Road Pedestrian Street in central Shanghai illuminated at dusk',
    overview:
      'As China’s busiest shopping and walking avenue, Nanjing Road captures the nonstop energy of downtown Shanghai. Stretching from People’s Square toward The Bund, this car-free boulevard is packed with flagship boutiques, century-old pastry shops, street life, and dazzling neon signs that light up the night.',
    bestTime: '18:00 – 22:30 CST (Peak evening atmosphere under glowing neon signs)',
    metro: 'Line 1, 2 & 8 — People’s Square Station to East Nanjing Road Station',
    highlights: [
      'Evening stroll down the pedestrian-only east corridor straight toward The Bund waterfront',
      'Classic Shanghai snack houses offering freshly baked pastries, sweets, and silk goods',
      'Open-air street atmosphere, sightseeing mini-trains, and lively plazas connecting side-street eateries',
    ],
  },
  {
    id: 'old-millfun',
    title: '1933 Old Millfun',
    category: 'Creative Hub / Hongkou District',
    code: '1933 HUB',
    image: '/images/shanghai_old_millfun_1794638681603.jpg',
    alt: 'Multi-level walkways and spiral staircases inside 1933 Old Millfun in Shanghai',
    overview:
      'Tucked away in Hongkou District, 1933 Old Millfun has been reborn from a historic 1930s landmark into one of Shanghai’s most atmospheric cultural hangouts. Today its dramatic multi-level walkways, sunlit central court, and maze-like corridors house independent cafés, boutique studios, creative markets, and intimate performance spaces.',
    bestTime: '13:00 – 16:00 CST (Afternoon sunlight filtering through the central courtyard)',
    metro: 'Line 4 & Line 10 — Hailun Road Station (Exit 2, 10-minute walk)',
    highlights: [
      'Photogenic crisscrossing bridges and spiral stairs weaving through five stories of open walkways',
      'Specialty coffee roasters, indie design shops, and quiet creative corners to explore',
      'Art exhibitions, pop-up markets, and small theater performances on the upper floors',
    ],
  },
  {
    id: 'zhujiajiao',
    title: 'Zhujiajiao Water Town',
    category: 'Canal Escape / Qingpu District',
    code: 'JIANGNAN',
    image: '/images/shanghai_zhujiajiao_canal_1794638681851.jpg',
    alt: 'Five-arch stone bridge and tranquil waterways in Zhujiajiao Water Town, Shanghai',
    overview:
      'Located on the southwestern edge of Shanghai, Zhujiajiao is a 1,700-year-old canal town that feels worlds away from the city’s skyscrapers. Visitors can wander narrow stone alleys, browse waterside teahouses, cross 36 ancient bridges, and drift past lantern-lit lanes aboard traditional wooden rowboats.',
    bestTime: '15:30 – 18:00 CST (Warm afternoon glow reflecting off the peaceful canals)',
    metro: 'Line 17 — Zhujiajiao Station (Exit 1, followed by a 12-minute walk to the canals)',
    highlights: [
      'Iconic Fangsheng Bridge spanning the main waterway with sweeping views of the old town',
      'Traditional wooden gondola rides gliding under stone arches and willow-lined banks',
      'Waterside tea rooms, local street snacks along North Street, and the serene Kezhi Garden',
    ],
  },
];
