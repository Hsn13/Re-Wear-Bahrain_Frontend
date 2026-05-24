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
