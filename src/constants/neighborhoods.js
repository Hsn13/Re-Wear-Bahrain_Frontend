export const NEIGHBORHOOD_GROUPS = [
  {
    label: 'Capital Governorate',
    options: [
      'Manama', 'Juffair', 'Adliya', 'Seef', 'Sanabis', 'Zinj', 'Salmaniya',
      'Hoora', 'Gudaibiya', 'Umm Al Hassam', 'Ras Rumman', 'Karanah', 'Jidd Hafs',
    ],
  },
  {
    label: 'Muharraq Governorate',
    options: ['Muharraq', 'Hidd', 'Amwaj Islands', 'Busaiteen', 'Dair', 'Galali', 'Arad'],
  },
  {
    label: 'Northern Governorate',
    options: [
      'Saar', 'Budaiya', 'Hamala', 'Janabiyah', 'Barbar', 'Diraz',
      'Bani Jamra', 'Malkiya', 'Sehla', 'Dumistan', 'Jasra', 'Karbabad', 'Tubli',
    ],
  },
  {
    label: 'Southern Governorate',
    options: [
      'Riffa', 'East Riffa', 'West Riffa', 'Isa Town', 'Hamad Town',
      "A'ali", 'Sitra', 'Zallaq', 'Askar', 'Jaw', 'Durrat Al Bahrain',
    ],
  },
]

export const ALL_NEIGHBORHOODS = NEIGHBORHOOD_GROUPS.flatMap(g => g.options)

const NEIGHBORHOOD_AR = {
  Manama: 'المنامة', Juffair: 'الجفير', Adliya: 'العدلية', Seef: 'السيف', Sanabis: 'السنابس',
  Zinj: 'الزنج', Salmaniya: 'السلمانية', Hoora: 'الحورة', Gudaibiya: 'القضيبية',
  'Umm Al Hassam': 'أم الحصم', 'Ras Rumman': 'رأس الرمان', Karanah: 'كرانة',
  'Jidd Hafs': 'جدحفص', Muharraq: 'المحرق', Hidd: 'الحد', 'Amwaj Islands': 'جزر أمواج',
  Busaiteen: 'البسيتين', Dair: 'الدير', Galali: 'قلالي', Arad: 'عراد', Saar: 'سار',
  Budaiya: 'البديع', Hamala: 'الهملة', Janabiyah: 'الجنبية', Barbar: 'باربار',
  Diraz: 'الدراز', 'Bani Jamra': 'بني جمرة', Malkiya: 'المالكية', Sehla: 'السهلة',
  Dumistan: 'دمستان', Jasra: 'الجسرة', Karbabad: 'كرباباد', Tubli: 'توبلي',
  Riffa: 'الرفاع', 'East Riffa': 'الرفاع الشرقي', 'West Riffa': 'الرفاع الغربي',
  'Isa Town': 'مدينة عيسى', 'Hamad Town': 'مدينة حمد', "A'ali": 'عالي',
  Sitra: 'سترة', Zallaq: 'الزلاق', Askar: 'عسكر', Jaw: 'جو',
  'Durrat Al Bahrain': 'درة البحرين', Other: 'أخرى'
}

export function localizedNeighborhood(name, language) {
  return language === 'ar' ? NEIGHBORHOOD_AR[name] || name : name
}
