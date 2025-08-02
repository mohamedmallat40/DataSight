export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface CountryStats {
  country: string;
  countryCode: string;
  userCount: number;
  lat: number;
  lng: number;
  flag: string;
}

export const mockUsers: User[] = [
  // United States
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=random",
    role: "Doctor",
    joinDate: "2024-01-15",
    country: "United States",
    countryCode: "US",
    lat: 39.8283,
    lng: -98.5795,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    role: "Nurse",
    joinDate: "2024-02-01",
    country: "United States",
    countryCode: "US",
    lat: 39.8283,
    lng: -98.5795,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@example.com",
    avatar: "https://ui-avatars.com/api/?name=Mike+Davis&background=random",
    role: "Administrator",
    joinDate: "2024-01-20",
    country: "United States",
    countryCode: "US",
    lat: 39.8283,
    lng: -98.5795,
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=random",
    role: "Manager",
    joinDate: "2024-02-10",
    country: "United States",
    countryCode: "US",
    lat: 39.8283,
    lng: -98.5795,
  },

  // Saudi Arabia
  {
    id: "5",
    name: "Ahmed Al-Rashid",
    email: "ahmed.alrashid@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=random",
    role: "Doctor",
    joinDate: "2024-01-10",
    country: "Saudi Arabia",
    countryCode: "SA",
    lat: 23.8859,
    lng: 45.0792,
  },
  {
    id: "6",
    name: "Fatima Al-Zahra",
    email: "fatima.alzahra@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=Fatima+Al-Zahra&background=random",
    role: "Nurse",
    joinDate: "2024-01-25",
    country: "Saudi Arabia",
    countryCode: "SA",
    lat: 23.8859,
    lng: 45.0792,
  },
  {
    id: "7",
    name: "Mohammed Sultan",
    email: "demo@sultan.sa",
    avatar:
      "https://ui-avatars.com/api/?name=Mohammed+Sultan&background=random",
    role: "Administrator",
    joinDate: "2024-01-01",
    country: "Saudi Arabia",
    countryCode: "SA",
    lat: 23.8859,
    lng: 45.0792,
  },

  // Canada
  {
    id: "8",
    name: "David Wilson",
    email: "david.wilson@example.com",
    avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=random",
    role: "Doctor",
    joinDate: "2024-02-05",
    country: "Canada",
    countryCode: "CA",
    lat: 56.1304,
    lng: -106.3468,
  },
  {
    id: "9",
    name: "Lisa Thompson",
    email: "lisa.thompson@example.com",
    avatar: "https://ui-avatars.com/api/?name=Lisa+Thompson&background=random",
    role: "Nurse",
    joinDate: "2024-02-15",
    country: "Canada",
    countryCode: "CA",
    lat: 56.1304,
    lng: -106.3468,
  },

  // United Kingdom
  {
    id: "10",
    name: "James Brown",
    email: "james.brown@example.com",
    avatar: "https://ui-avatars.com/api/?name=James+Brown&background=random",
    role: "Manager",
    joinDate: "2024-01-30",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 55.3781,
    lng: -3.436,
  },
  {
    id: "11",
    name: "Emma Taylor",
    email: "emma.taylor@example.com",
    avatar: "https://ui-avatars.com/api/?name=Emma+Taylor&background=random",
    role: "Receptionist",
    joinDate: "2024-02-12",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 55.3781,
    lng: -3.436,
  },

  // Germany
  {
    id: "12",
    name: "Hans Mueller",
    email: "hans.mueller@example.com",
    avatar: "https://ui-avatars.com/api/?name=Hans+Mueller&background=random",
    role: "Doctor",
    joinDate: "2024-01-18",
    country: "Germany",
    countryCode: "DE",
    lat: 51.1657,
    lng: 10.4515,
  },
  {
    id: "13",
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    avatar: "https://ui-avatars.com/api/?name=Anna+Schmidt&background=random",
    role: "Nurse",
    joinDate: "2024-02-08",
    country: "Germany",
    countryCode: "DE",
    lat: 51.1657,
    lng: 10.4515,
  },

  // France
  {
    id: "14",
    name: "Pierre Dubois",
    email: "pierre.dubois@example.com",
    avatar: "https://ui-avatars.com/api/?name=Pierre+Dubois&background=random",
    role: "Doctor",
    joinDate: "2024-01-22",
    country: "France",
    countryCode: "FR",
    lat: 46.6034,
    lng: 1.8883,
  },

  // Australia
  {
    id: "15",
    name: "William Anderson",
    email: "william.anderson@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=William+Anderson&background=random",
    role: "Manager",
    joinDate: "2024-02-03",
    country: "Australia",
    countryCode: "AU",
    lat: -25.2744,
    lng: 133.7751,
  },

  // Japan
  {
    id: "16",
    name: "Hiroshi Tanaka",
    email: "hiroshi.tanaka@example.com",
    avatar: "https://ui-avatars.com/api/?name=Hiroshi+Tanaka&background=random",
    role: "Doctor",
    joinDate: "2024-01-28",
    country: "Japan",
    countryCode: "JP",
    lat: 36.2048,
    lng: 138.2529,
  },

  // Brazil
  {
    id: "17",
    name: "Carlos Silva",
    email: "carlos.silva@example.com",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Silva&background=random",
    role: "Nurse",
    joinDate: "2024-02-07",
    country: "Brazil",
    countryCode: "BR",
    lat: -14.235,
    lng: -51.9253,
  },

  // India
  {
    id: "18",
    name: "Raj Patel",
    email: "raj.patel@example.com",
    avatar: "https://ui-avatars.com/api/?name=Raj+Patel&background=random",
    role: "Administrator",
    joinDate: "2024-01-16",
    country: "India",
    countryCode: "IN",
    lat: 20.5937,
    lng: 78.9629,
  },
];

export const getCountryStats = (): CountryStats[] => {
  const countryMap = new Map<string, CountryStats>();

  mockUsers.forEach((user) => {
    const existing = countryMap.get(user.country);

    if (existing) {
      existing.userCount++;
    } else {
      countryMap.set(user.country, {
        country: user.country,
        countryCode: user.countryCode,
        userCount: 1,
        lat: user.lat,
        lng: user.lng,
        flag: getCountryFlag(user.countryCode),
      });
    }
  });

  return Array.from(countryMap.values())
    .sort((a, b) => b.userCount - a.userCount)
    .slice(0, 10);
};

export const getUsersByCountry = (country: string): User[] => {
  return mockUsers.filter((user) => user.country === country);
};

const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    SA: "🇸🇦",
    CA: "🇨🇦",
    GB: "🇬🇧",
    DE: "🇩🇪",
    FR: "🇫🇷",
    AU: "🇦🇺",
    JP: "🇯🇵",
    BR: "🇧🇷",
    IN: "🇮🇳",
  };

  return flags[countryCode] || "🌍";
};
