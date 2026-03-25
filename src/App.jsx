import { useState, useEffect } from "react";

// ─── بيانات المستويات ────────────────────────────────────────────────────────
const tiers = [
  {
    id: "green", name: "الأخضر", nameEn: "Green", color: "#22c55e",
    miles: 0, flights: 0, icon: "🌿",
    perks: ["كسب الأميال واستبدالها", "أولوية في قوائم الانتظار", "عروض حصرية مع الشركاء"],
  },
  {
    id: "silver", name: "الفضي", nameEn: "Silver – النخبة", color: "#94a3b8",
    miles: 25000, flights: 20, icon: "🥈",
    perks: ["اختيار المقعد مسبقاً", "وزن أمتعة إضافي", "أولوية في الصعود", "25% أميال مكافآت إضافية"],
  },
  {
    id: "gold", name: "الذهبي", nameEn: "Gold – النخبة بلس", color: "#f59e0b",
    miles: 40000, flights: 30, icon: "👑",
    perks: ["50% أميال مكافآت إضافية", "دخول صالات الفرسان حول العالم", "أولوية ترقية مجانية", "وزن أمتعة إضافي مميز", "أولوية في الصعود القصوى"],
  },
];

// ─── جدول استبدال أميال المكافآت (اتجاه واحد) ────────────────────────────────
// المصدر: الجدول الرسمي من موقع الخطوط السعودية
// درجة الضيافة (X): مكافأة / مكافأة بلس
// درجة الأعمال (O): مكافأة / مكافأة بلس
// الدرجة الأولى (A): مكافأة فقط
const rewardTickets = [
  {
    zone: "جميع الوجهات الداخلية", flag: "🇸🇦",
    economy: { reward: 4500,  rewardPlus: 9000  },
    business:{ reward: 15000, rewardPlus: 30000 },
    first:   { reward: 22500, rewardPlus: null  },
  },
  {
    zone: "الخليج العربي: الإمارات، البحرين، الكويت، قطر، وعُمان", flag: "🌍",
    economy: { reward: 5000,  rewardPlus: 10000 },
    business:{ reward: 24000, rewardPlus: 48000 },
    first:   { reward: 35000, rewardPlus: null  },
  },
  {
    zone: "الشرق الأوسط: الأردن، مصر، والعراق", flag: "🌍",
    economy: { reward: 6500,  rewardPlus: 13000 },
    business:{ reward: 28000, rewardPlus: 56000 },
    first:   { reward: 40000, rewardPlus: null  },
  },
  {
    zone: "أفريقيا – (الشرق): إثيوبيا، كينيا، والسودان", flag: "🌍",
    economy: { reward: 12000, rewardPlus: 24000 },
    business:{ reward: 36500, rewardPlus: 73000 },
    first:   { reward: 52500, rewardPlus: null  },
  },
  {
    zone: "أفريقيا – (الشمال): المغرب، تونس، أوغندا، والجزائر", flag: "🌍",
    economy: { reward: 10000, rewardPlus: 20000 },
    business:{ reward: 46000, rewardPlus: 92000 },
    first:   { reward: 62500, rewardPlus: null  },
  },
  {
    zone: "أفريقيا – (الجنوب): جنوب أفريقيا، نيجيريا، وموريشيوس", flag: "🌍",
    economy: { reward: 9000,  rewardPlus: 18000 },
    business:{ reward: 47500, rewardPlus: 95000 },
    first:   { reward: 70000, rewardPlus: null  },
  },
  {
    zone: "أوروبا (أ): تركيا فقط", flag: "🇹🇷",
    economy: { reward: 11500, rewardPlus: 23000 },
    business:{ reward: 37000, rewardPlus: 74000 },
    first:   { reward: 52500, rewardPlus: null  },
  },
  {
    zone: "أوروبا (ب): جميع دول أوروبا ما عدا تركيا", flag: "🇪🇺",
    economy: { reward: 12000, rewardPlus: 24000 },
    business:{ reward: 44000, rewardPlus: 88000 },
    first:   { reward: 62500, rewardPlus: null  },
  },
  {
    zone: "شبه القارة الهندية (أ): باكستان، شمال الهند", flag: "🇮🇳",
    economy: { reward: 9000,  rewardPlus: 18000 },
    business:{ reward: 34000, rewardPlus: 68000 },
    first:   { reward: 47500, rewardPlus: null  },
  },
  {
    zone: "شبه القارة الهندية (ب): جنوب الهند، سريلانكا، بنجلاديش، والمالديف", flag: "🇮🇳",
    economy: { reward: 12000, rewardPlus: 24000 },
    business:{ reward: 37000, rewardPlus: 74000 },
    first:   { reward: 52500, rewardPlus: null  },
  },
  {
    zone: "الشرق الأقصى: ماليزيا، سنغافورة، إندونيسيا، الصين، الفلبين، كوريا الجنوبية وتايلاند", flag: "🌏",
    economy: { reward: 18000, rewardPlus: 36000 },
    business:{ reward: 64000, rewardPlus: 128000 },
    first:   { reward: 90000, rewardPlus: null  },
  },
  {
    zone: "أمريكا الشمالية (أ): الولايات المتحدة باستثناء لوس أنجلوس", flag: "🇺🇸",
    economy: { reward: 22000, rewardPlus: 44000 },
    business:{ reward: 65000, rewardPlus: 130000 },
    first:   { reward: 105000, rewardPlus: null },
  },
  {
    zone: "أمريكا الشمالية (ب): لوس أنجلوس فقط", flag: "🇺🇸",
    economy: { reward: 25000, rewardPlus: 50000 },
    business:{ reward: 80000, rewardPlus: 160000 },
    first:   { reward: 120000, rewardPlus: null },
  },
];

// ─── بيانات المطارات ─────────────────────────────────────────────────────────
const AIRPORTS = [
  { code:"JED",name:"جدة",nameEn:"Jeddah",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"RUH",name:"الرياض",nameEn:"Riyadh",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"DMM",name:"الدمام",nameEn:"Dammam",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"MED",name:"المدينة المنورة",nameEn:"Madinah",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"AHB",name:"أبها",nameEn:"Abha",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"TUU",name:"تبوك",nameEn:"Tabuk",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"GIZ",name:"جيزان",nameEn:"Jazan",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"HOF",name:"الهفوف",nameEn:"Al-Ahsa",country:"السعودية",zone:"domestic",flag:"🇸🇦"},
  { code:"DXB",name:"دبي",nameEn:"Dubai",country:"الإمارات",zone:"z1",flag:"🇦🇪"},
  { code:"AUH",name:"أبوظبي",nameEn:"Abu Dhabi",country:"الإمارات",zone:"z1",flag:"🇦🇪"},
  { code:"SHJ",name:"الشارقة",nameEn:"Sharjah",country:"الإمارات",zone:"z1",flag:"🇦🇪"},
  { code:"KWI",name:"الكويت",nameEn:"Kuwait",country:"الكويت",zone:"z1",flag:"🇰🇼"},
  { code:"BAH",name:"البحرين",nameEn:"Bahrain",country:"البحرين",zone:"z1",flag:"🇧🇭"},
  { code:"DOH",name:"الدوحة",nameEn:"Doha",country:"قطر",zone:"z1",flag:"🇶🇦"},
  { code:"MCT",name:"مسقط",nameEn:"Muscat",country:"عُمان",zone:"z1",flag:"🇴🇲"},
  { code:"AMM",name:"عمّان",nameEn:"Amman",country:"الأردن",zone:"z1",flag:"🇯🇴"},
  { code:"BEY",name:"بيروت",nameEn:"Beirut",country:"لبنان",zone:"z1",flag:"🇱🇧"},
  { code:"CAI",name:"القاهرة",nameEn:"Cairo",country:"مصر",zone:"z1",flag:"🇪🇬"},
  { code:"HRG",name:"الغردقة",nameEn:"Hurghada",country:"مصر",zone:"z1",flag:"🇪🇬"},
  { code:"BGW",name:"بغداد",nameEn:"Baghdad",country:"العراق",zone:"z1",flag:"🇮🇶"},
  { code:"BSR",name:"البصرة",nameEn:"Basra",country:"العراق",zone:"z1",flag:"🇮🇶"},
  { code:"SAH",name:"صنعاء",nameEn:"Sana'a",country:"اليمن",zone:"z1",flag:"🇾🇪"},
  { code:"ADE",name:"عدن",nameEn:"Aden",country:"اليمن",zone:"z1",flag:"🇾🇪"},
  { code:"DAM",name:"دمشق",nameEn:"Damascus",country:"سوريا",zone:"z1",flag:"🇸🇾"},
  { code:"KRT",name:"الخرطوم",nameEn:"Khartoum",country:"السودان",zone:"z1",flag:"🇸🇩"},
  { code:"ADD",name:"أديس أبابا",nameEn:"Addis Ababa",country:"إثيوبيا",zone:"z2",flag:"🇪🇹"},
  { code:"NBO",name:"نيروبي",nameEn:"Nairobi",country:"كينيا",zone:"z2",flag:"🇰🇪"},
  { code:"DAR",name:"دار السلام",nameEn:"Dar es Salaam",country:"تنزانيا",zone:"z2",flag:"🇹🇿"},
  { code:"KHI",name:"كراتشي",nameEn:"Karachi",country:"باكستان",zone:"z2",flag:"🇵🇰"},
  { code:"LHE",name:"لاهور",nameEn:"Lahore",country:"باكستان",zone:"z2",flag:"🇵🇰"},
  { code:"ISB",name:"إسلام آباد",nameEn:"Islamabad",country:"باكستان",zone:"z2",flag:"🇵🇰"},
  { code:"PEW",name:"بيشاور",nameEn:"Peshawar",country:"باكستان",zone:"z2",flag:"🇵🇰"},
  { code:"CMN",name:"الدار البيضاء",nameEn:"Casablanca",country:"المغرب",zone:"z2",flag:"🇲🇦"},
  { code:"TUN",name:"تونس",nameEn:"Tunis",country:"تونس",zone:"z2",flag:"🇹🇳"},
  { code:"ALG",name:"الجزائر",nameEn:"Algiers",country:"الجزائر",zone:"z2",flag:"🇩🇿"},
  { code:"TIP",name:"طرابلس",nameEn:"Tripoli",country:"ليبيا",zone:"z2",flag:"🇱🇾"},
  { code:"IST",name:"إسطنبول",nameEn:"Istanbul",country:"تركيا",zone:"z3",flag:"🇹🇷"},
  { code:"LHR",name:"لندن هيثرو",nameEn:"London Heathrow",country:"المملكة المتحدة",zone:"z3",flag:"🇬🇧"},
  { code:"LGW",name:"لندن غاتويك",nameEn:"London Gatwick",country:"المملكة المتحدة",zone:"z3",flag:"🇬🇧"},
  { code:"MAN",name:"مانشستر",nameEn:"Manchester",country:"المملكة المتحدة",zone:"z3",flag:"🇬🇧"},
  { code:"CDG",name:"باريس",nameEn:"Paris CDG",country:"فرنسا",zone:"z3",flag:"🇫🇷"},
  { code:"FRA",name:"فرانكفورت",nameEn:"Frankfurt",country:"ألمانيا",zone:"z3",flag:"🇩🇪"},
  { code:"MUC",name:"ميونيخ",nameEn:"Munich",country:"ألمانيا",zone:"z3",flag:"🇩🇪"},
  { code:"AMS",name:"أمستردام",nameEn:"Amsterdam",country:"هولندا",zone:"z3",flag:"🇳🇱"},
  { code:"ZRH",name:"زيورخ",nameEn:"Zurich",country:"سويسرا",zone:"z3",flag:"🇨🇭"},
  { code:"GVA",name:"جنيف",nameEn:"Geneva",country:"سويسرا",zone:"z3",flag:"🇨🇭"},
  { code:"MAD",name:"مدريد",nameEn:"Madrid",country:"إسبانيا",zone:"z3",flag:"🇪🇸"},
  { code:"BCN",name:"برشلونة",nameEn:"Barcelona",country:"إسبانيا",zone:"z3",flag:"🇪🇸"},
  { code:"FCO",name:"روما",nameEn:"Rome",country:"إيطاليا",zone:"z3",flag:"🇮🇹"},
  { code:"MXP",name:"ميلانو",nameEn:"Milan",country:"إيطاليا",zone:"z3",flag:"🇮🇹"},
  { code:"ATH",name:"أثينا",nameEn:"Athens",country:"اليونان",zone:"z3",flag:"🇬🇷"},
  { code:"VIE",name:"فيينا",nameEn:"Vienna",country:"النمسا",zone:"z3",flag:"🇦🇹"},
  { code:"BRU",name:"بروكسل",nameEn:"Brussels",country:"بلجيكا",zone:"z3",flag:"🇧🇪"},
  { code:"CPH",name:"كوبنهاغن",nameEn:"Copenhagen",country:"الدنمارك",zone:"z3",flag:"🇩🇰"},
  { code:"OSL",name:"أوسلو",nameEn:"Oslo",country:"النرويج",zone:"z3",flag:"🇳🇴"},
  { code:"STO",name:"ستوكهولم",nameEn:"Stockholm",country:"السويد",zone:"z3",flag:"🇸🇪"},
  { code:"HEL",name:"هلسنكي",nameEn:"Helsinki",country:"فنلندا",zone:"z3",flag:"🇫🇮"},
  { code:"WAW",name:"وارسو",nameEn:"Warsaw",country:"بولندا",zone:"z3",flag:"🇵🇱"},
  { code:"MOW",name:"موسكو",nameEn:"Moscow",country:"روسيا",zone:"z3",flag:"🇷🇺"},
  { code:"DEL",name:"نيودلهي",nameEn:"New Delhi",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"BOM",name:"مومباي",nameEn:"Mumbai",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"MAA",name:"تشيناي",nameEn:"Chennai",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"BLR",name:"بنغالور",nameEn:"Bangalore",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"HYD",name:"حيدر آباد",nameEn:"Hyderabad",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"COK",name:"كوتشي",nameEn:"Kochi",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"TRV",name:"ترياندروم",nameEn:"Thiruvananthapuram",country:"الهند",zone:"z3",flag:"🇮🇳"},
  { code:"BKK",name:"بانكوك",nameEn:"Bangkok",country:"تايلاند",zone:"z4",flag:"🇹🇭"},
  { code:"KUL",name:"كوالالمبور",nameEn:"Kuala Lumpur",country:"ماليزيا",zone:"z4",flag:"🇲🇾"},
  { code:"SIN",name:"سنغافورة",nameEn:"Singapore",country:"سنغافورة",zone:"z4",flag:"🇸🇬"},
  { code:"CGK",name:"جاكرتا",nameEn:"Jakarta",country:"إندونيسيا",zone:"z4",flag:"🇮🇩"},
  { code:"MNL",name:"مانيلا",nameEn:"Manila",country:"الفلبين",zone:"z4",flag:"🇵🇭"},
  { code:"PEK",name:"بكين",nameEn:"Beijing",country:"الصين",zone:"z4",flag:"🇨🇳"},
  { code:"PVG",name:"شنغهاي",nameEn:"Shanghai",country:"الصين",zone:"z4",flag:"🇨🇳"},
  { code:"CAN",name:"قوانغتشو",nameEn:"Guangzhou",country:"الصين",zone:"z4",flag:"🇨🇳"},
  { code:"NRT",name:"طوكيو",nameEn:"Tokyo",country:"اليابان",zone:"z4",flag:"🇯🇵"},
  { code:"ICN",name:"سيول",nameEn:"Seoul",country:"كوريا الجنوبية",zone:"z4",flag:"🇰🇷"},
  { code:"SYD",name:"سيدني",nameEn:"Sydney",country:"أستراليا",zone:"z4",flag:"🇦🇺"},
  { code:"JFK",name:"نيويورك",nameEn:"New York JFK",country:"الولايات المتحدة",zone:"z5",flag:"🇺🇸"},
  { code:"LAX",name:"لوس أنجلوس",nameEn:"Los Angeles",country:"الولايات المتحدة",zone:"z5",flag:"🇺🇸"},
  { code:"IAD",name:"واشنطن",nameEn:"Washington Dulles",country:"الولايات المتحدة",zone:"z5",flag:"🇺🇸"},
  { code:"YYZ",name:"تورنتو",nameEn:"Toronto",country:"كندا",zone:"z5",flag:"🇨🇦"},
];

// ─── جدول أميال الترقية (من الضيافة إلى الأعمال) ────────────────────────────
// المصدر: الجدول الرسمي من موقع الخطوط السعودية
// 3 أعمدة: أساسي | مرن | مميز
const UPGRADE_ZONES = [
  {
    id: "domestic",
    label: "جميع الوجهات الداخلية",
    flag: "🇸🇦",
    airports: ["JED","RUH","DMM","MED","AHB","TUU","GIZ","HOF"],
    econToB: { basic: 10500, flex: 7875, premium: 5250 },
  },
  {
    id: "gulf",
    label: "الخليج العربي: الإمارات، البحرين، الكويت، قطر وعُمان",
    flag: "🌍",
    airports: ["DXB","AUH","SHJ","KWI","BAH","DOH","MCT"],
    econToB: { basic: 19000, flex: 14250, premium: 9500 },
  },
  {
    id: "middleeast",
    label: "الشرق الأوسط: الأردن، مصر، والعراق",
    flag: "🌍",
    airports: ["AMM","BEY","CAI","HRG","BGW","BSR","DAM","SAH","ADE","KRT"],
    econToB: { basic: 21500, flex: 16125, premium: 10750 },
  },
  {
    id: "africa_east",
    label: "أفريقيا – (الشرق): إثيوبيا، كينيا، والسودان",
    flag: "🌍",
    airports: ["ADD","NBO","DAR"],
    econToB: { basic: 24500, flex: 18375, premium: 12250 },
  },
  {
    id: "africa_north",
    label: "أفريقيا – (الشمال): المغرب، تونس، أوغندا، والجزائر",
    flag: "🌍",
    airports: ["CMN","TUN","ALG","TIP"],
    econToB: { basic: 36000, flex: 27000, premium: 18000 },
  },
  {
    id: "africa_south",
    label: "أفريقيا – (الجنوب): جنوب أفريقيا، نيجيريا وموريشيوس",
    flag: "🌍",
    airports: [],
    econToB: { basic: 38500, flex: 28875, premium: 19250 },
  },
  {
    id: "europe_a",
    label: "أوروبا (أ): تركيا فقط",
    flag: "🇹🇷",
    airports: ["IST"],
    econToB: { basic: 25500, flex: 19125, premium: 12750 },
  },
  {
    id: "europe_b",
    label: "أوروبا (ب): جميع دول أوروبا ما عدا تركيا",
    flag: "🇪🇺",
    airports: ["LHR","LGW","MAN","CDG","FRA","MUC","AMS","ZRH","GVA","MAD","BCN","FCO","MXP","ATH","VIE","BRU","CPH","OSL","STO","HEL","WAW","MOW"],
    econToB: { basic: 34000, flex: 25500, premium: 17000 },
  },
  {
    id: "subcon_a",
    label: "شبه القارة الهندية (أ): باكستان، شمال الهند",
    flag: "🇮🇳",
    airports: ["KHI","LHE","ISB","PEW","DEL"],
    econToB: { basic: 25000, flex: 18750, premium: 12500 },
  },
  {
    id: "subcon_b",
    label: "شبه القارة الهندية (ب): جنوب الهند، سريلانكا، بنجلاديش، والمالديف",
    flag: "🇮🇳",
    airports: ["BOM","MAA","BLR","HYD","COK","TRV"],
    econToB: { basic: 25000, flex: 18750, premium: 12500 },
  },
  {
    id: "fareast",
    label: "الشرق الأقصى: ماليزيا، سنغافورة، إندونيسيا، الصين، الفلبين، كوريا الجنوبية وتايلاند",
    flag: "🌏",
    airports: ["BKK","KUL","SIN","CGK","MNL","PEK","PVG","CAN","NRT","ICN","SYD"],
    econToB: { basic: 46000, flex: 34500, premium: 23000 },
  },
  {
    id: "america_a",
    label: "أمريكا الشمالية (أ): الولايات المتحدة باستثناء لوس أنجلوس",
    flag: "🇺🇸",
    airports: ["JFK","IAD","YYZ"],
    econToB: { basic: 48500, flex: 36375, premium: 24250 },
  },
  {
    id: "america_b",
    label: "أمريكا الشمالية (ب): لوس أنجلوس فقط",
    flag: "🇺🇸",
    airports: ["LAX"],
    econToB: { basic: 60000, flex: 45000, premium: 30000 },
  },
];

// بناء UPGRADE_TABLE من UPGRADE_ZONES لدعم كود الحاسبة
const UPGRADE_TABLE = {};
UPGRADE_ZONES.forEach(z => {
  UPGRADE_TABLE[z.id] = {
    econToB: { flex: z.econToB.premium, semiFlex: z.econToB.flex, basic: z.econToB.basic },
    bizToF:  { flex: Math.round(z.econToB.premium*1.5), semiFlex: Math.round(z.econToB.flex*1.5), basic: Math.round(z.econToB.basic*1.5) },
  };
});

// دالة تحديد المنطقة حسب كود المطار
function getZoneForAirport(code) {
  for (const z of UPGRADE_ZONES) {
    if (z.airports.includes(code)) return z.id;
  }
  return null;
}

const ZONE_LABELS = Object.fromEntries(UPGRADE_ZONES.map(z => [z.id, z.label]));

const FARE_INFO = {
  basic:   { label:"ضيافة (أساسي)",  desc:"Guest Basic – أعلى عدد أميال",    color:"#fb923c", codes:"T N V"       },
  semiFlex:{ label:"ضيافة (مرن)",    desc:"Guest Flex – متوسط",               color:"#60a5fa", codes:"K H L Q M B Y" },
  flex:    { label:"ضيافة (مميز)",   desc:"Guest Premium – أقل أميال",        color:"#34d399", codes:"درجة مميزة"   },
};

// ─── مكوّن اختيار المطار ──────────────────────────────────────────────────────
function AirportPicker({ label, value, onChange, exclude }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = AIRPORTS.find(a => a.code === value);
  const filtered = AIRPORTS.filter(a =>
    a.code !== exclude &&
    (a.name.includes(query) || a.nameEn.toLowerCase().includes(query.toLowerCase()) ||
     a.code.toLowerCase().includes(query.toLowerCase()) || a.country.includes(query))
  ).slice(0, 30);

  return (
    <div style={{ position:"relative", flex:1 }}>
      <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#64748b", fontWeight:700 }}>{label}</p>
      <div onClick={() => { setOpen(!open); setQuery(""); }} style={{
        background: open ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
        border:`1px solid ${open?"#6366f1":"rgba(255,255,255,0.1)"}`,
        borderRadius:"14px", padding:"12px 14px", cursor:"pointer",
        minHeight:"52px", display:"flex", flexDirection:"column", justifyContent:"center",
      }}>
        {selected
          ? <><p style={{margin:0,fontSize:"18px",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{selected.flag} {selected.code}</p>
               <p style={{margin:"2px 0 0",fontSize:"11px",color:"#64748b"}}>{selected.name}</p></>
          : <p style={{margin:0,fontSize:"13px",color:"#475569"}}>اختر المطار...</p>}
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, left:0, zIndex:200,
          background:"#0f172a", border:"1px solid rgba(99,102,241,0.3)",
          borderRadius:"16px", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.9)" }}>
          <div style={{ padding:"10px" }}>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الكود..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"10px", padding:"9px 12px", color:"#f1f5f9", fontSize:"13px",
                outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
          </div>
          <div style={{ maxHeight:"220px", overflowY:"auto" }}>
            {filtered.length === 0 && <p style={{padding:"14px",fontSize:"12px",color:"#475569",textAlign:"center",margin:0}}>لا توجد نتائج</p>}
            {filtered.map(a => (
              <div key={a.code} onClick={() => { onChange(a.code); setOpen(false); }}
                style={{ padding:"10px 14px", cursor:"pointer", display:"flex",
                  justifyContent:"space-between", alignItems:"center",
                  background: a.code===value ? "rgba(99,102,241,0.15)" : "transparent",
                  borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <span style={{fontSize:"13px",color:"#e2e8f0",fontWeight:600}}>{a.flag} {a.name}</span>
                  <span style={{fontSize:"11px",color:"#475569",marginRight:"6px"}}>{a.country}</span>
                </div>
                <span style={{fontSize:"12px",fontWeight:800,color:"#6366f1",
                  background:"rgba(99,102,241,0.15)",padding:"2px 8px",borderRadius:"6px"}}>{a.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── تبويب حاسبة الترقية ──────────────────────────────────────────────────────
function UpgradeCalculator() {
  const [from, setFrom] = useState("JED");
  const [to,   setTo]   = useState("");
  const [fare, setFare] = useState("flex");
  const [path, setPath] = useState("econToB");

  const fromAirport = AIRPORTS.find(a => a.code === from);
  const toAirport   = AIRPORTS.find(a => a.code === to);

  const getZone = () => {
    if (!toAirport) return null;
    if (fromAirport.zone === "domestic" && toAirport.zone === "domestic") return "domestic";
    // المنطقة = وجهة المطار غير السعودي
    const intlAirport = fromAirport.zone === "domestic" ? toAirport : fromAirport;
    return getZoneForAirport(intlAirport.code);
  };
  const zone      = getZone();
  const milesData = zone ? UPGRADE_TABLE[zone] : null;
  const miles     = milesData ? milesData[path][fare] : null;
  const swap = () => { if (to) { setFrom(to); setTo(from); } };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

      {/* Airport pickers */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px", padding:"16px" }}>
        <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
          <AirportPicker label="✈️ من" value={from} onChange={setFrom} exclude={to} />
          <button onClick={swap} style={{ flexShrink:0, marginBottom:"2px", width:"38px", height:"38px",
            background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)",
            borderRadius:"10px", cursor:"pointer", fontSize:"16px", color:"#818cf8" }}>⇄</button>
          <AirportPicker label="🛬 إلى" value={to} onChange={setTo} exclude={from} />
        </div>
        {zone && (
          <div style={{ marginTop:"10px", padding:"7px 12px", background:"rgba(99,102,241,0.08)",
            border:"1px solid rgba(99,102,241,0.2)", borderRadius:"9px" }}>
            <span style={{ fontSize:"11px", color:"#a5b4fc" }}>📍 {ZONE_LABELS[zone]}</span>
          </div>
        )}
      </div>

      {/* Path selector */}
      <div>
        <p style={{ margin:"0 0 8px", fontSize:"12px", color:"#64748b", fontWeight:700 }}>مسار الترقية</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {[
            { key:"econToB", label:"الضيافة ← الأعمال", icon:"💺" },
            { key:"bizToF",  label:"الأعمال ← الأولى",  icon:"👑" },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setPath(key)} style={{
              padding:"11px 8px", borderRadius:"12px", border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:"12px", fontWeight:700,
              background: path===key ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              color: path===key ? "#a5b4fc" : "#475569",
              border: path===key ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.06)",
              boxShadow: path===key ? "0 0 20px rgba(99,102,241,0.15)" : "none",
            }}>{icon} {label}</button>
          ))}
        </div>
      </div>

      {/* Fare selector */}
      <div>
        <p style={{ margin:"0 0 8px", fontSize:"12px", color:"#64748b", fontWeight:700 }}>نوع تذكرتك</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
          {Object.entries(FARE_INFO).map(([key, info]) => (
            <button key={key} onClick={() => setFare(key)} style={{
              padding:"11px 14px", borderRadius:"12px", border:"none", cursor:"pointer",
              fontFamily:"inherit", textAlign:"right",
              background: fare===key ? `${info.color}12` : "rgba(255,255,255,0.03)",
              border: fare===key ? `1px solid ${info.color}40` : "1px solid rgba(255,255,255,0.06)",
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <div>
                <p style={{margin:0,fontSize:"13px",fontWeight:700,color:fare===key?info.color:"#64748b"}}>{info.label}</p>
                <p style={{margin:"2px 0 0",fontSize:"11px",color:"#334155"}}>{info.desc}</p>
              </div>
              <span style={{fontSize:"10px",color:"#334155",background:"rgba(255,255,255,0.05)",
                padding:"2px 6px",borderRadius:"6px",fontFamily:"monospace",flexShrink:0}}>{info.codes}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {!to ? (
        <div style={{ textAlign:"center", padding:"24px 0", color:"#334155" }}>
          <p style={{ fontSize:"32px", margin:"0 0 8px" }}>🗺️</p>
          <p style={{ margin:0, fontSize:"13px" }}>اختر مطار الوجهة لعرض الأميال المطلوبة</p>
        </div>
      ) : miles ? (
        <>
          {/* Result card */}
          <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.05))",
            border:"1px solid rgba(99,102,241,0.35)", borderRadius:"22px", padding:"24px 18px",
            textAlign:"center", boxShadow:"0 0 50px rgba(99,102,241,0.15)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-30px",right:"-30px",width:"120px",height:"120px",
              borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",pointerEvents:"none" }} />
            <p style={{margin:"0 0 3px",fontSize:"12px",color:"#6366f1",fontWeight:700}}>
              {fromAirport?.flag} {fromAirport?.name} ← {toAirport?.flag} {toAirport?.name}
            </p>
            <p style={{margin:"0 0 14px",fontSize:"11px",color:"#334155"}}>
              {path==="econToB" ? "الضيافة → الأعمال" : "الأعمال → الأولى"} · {FARE_INFO[fare].label}
            </p>
            <span style={{fontSize:"48px",fontWeight:900,
              background:"linear-gradient(135deg,#818cf8,#c7d2fe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>
              {miles.toLocaleString()}
            </span>
            <p style={{margin:"6px 0 18px",fontSize:"13px",color:"#6366f1",fontWeight:700}}>ميل لكل قطاع</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {[
                { label:"ذهاب وإياب", val:(miles*2).toLocaleString()+" ميل", color:"#c7d2fe" },
                { label:"المنطقة",    val:ZONE_LABELS[zone],                 color:"#818cf8" },
              ].map((item,i) => (
                <div key={i} style={{background:"rgba(0,0,0,0.2)",borderRadius:"10px",padding:"10px"}}>
                  <p style={{margin:"0 0 3px",fontSize:"10px",color:"#475569"}}>{item.label}</p>
                  <p style={{margin:0,fontSize:"12px",fontWeight:700,color:item.color,lineHeight:1.3}}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fare comparison */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"14px"}}>
            <p style={{margin:"0 0 10px",fontSize:"12px",color:"#64748b",fontWeight:700}}>مقارنة أنواع التذاكر على نفس الرحلة</p>
            {Object.entries(FARE_INFO).map(([key, info]) => {
              const m = milesData[path][key];
              const isActive = key === fare;
              return (
                <div key={key} onClick={() => setFare(key)} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"9px 12px",marginBottom:"6px",cursor:"pointer",
                  background:isActive?`${info.color}10`:"rgba(255,255,255,0.02)",
                  border:`1px solid ${isActive?info.color+"35":"rgba(255,255,255,0.04)"}`,
                  borderRadius:"9px",
                }}>
                  <span style={{fontSize:"12px",color:isActive?info.color:"#64748b",fontWeight:isActive?700:400}}>{info.label}</span>
                  <span style={{fontSize:"15px",fontWeight:900,color:isActive?info.color:"#475569"}}>{m.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div style={{background:"rgba(251,146,60,0.06)",border:"1px solid rgba(251,146,60,0.15)",borderRadius:"12px",padding:"13px"}}>
            <p style={{margin:"0 0 7px",fontSize:"12px",color:"#fb923c",fontWeight:700}}>⚠️ ملاحظات مهمة</p>
            {[
              "الأميال لكل قطاع (اتجاه واحد) على رحلات السعودية فقط",
              "ضيافة أساسي: أعلى عدد أميال (فئات T, N, V)",
              "ضيافة مرن: متوسط (فئات K, H, L, Q, M, B, Y)",
              "ضيافة مميز: أقل عدد أميال (الدرجة المميزة)",
              "تذاكر Guest Saver (U) غير مؤهلة للترقية",
              "ترقية درجة واحدة فقط لكل قطاع",
            ].map((note,i) => (
              <p key={i} style={{margin:"0 0 3px",fontSize:"11px",color:"#78350f",display:"flex",gap:"6px"}}>
                <span style={{color:"#fb923c"}}>•</span>{note}
              </p>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

// ─── التطبيق الرئيسي ──────────────────────────────────────────────────────────
// ─── حاسبة قيمة الأميال ──────────────────────────────────────────────────────
function MilesCalculator() {
  const [pricePerMile,  setPricePerMile]  = useState("");
  const [milesCount,    setMilesCount]    = useState("");
  const [taxAmount,     setTaxAmount]     = useState("");
  const [cashPrice,     setCashPrice]     = useState("");

  const p = parseFloat(pricePerMile)  || 0;
  const m = parseFloat(milesCount)    || 0;
  const t = parseFloat(taxAmount)     || 0;
  const c = parseFloat(cashPrice)     || 0;

  const totalSAR = (p * m) / 100 + t;
  const diff = totalSAR - c;
  const hasResult = m > 0 && p > 0;
  const hasDiff   = hasResult && c > 0;
  const fmt = (n) => n.toLocaleString("ar-SA", { minimumFractionDigits:2, maximumFractionDigits:2 });

  const fields = [
    { label:"سعر الميل",     sub:"بالهللة",              val:pricePerMile, setter:setPricePerMile, icon:"💰", color:"#60a5fa", placeholder:"مثال: 10" },
    { label:"عدد الأميال",   sub:"أميال المكافآت",        val:milesCount,   setter:setMilesCount,   icon:"✈️", color:"#a78bfa", placeholder:"مثال: 25000" },
    { label:"قيمة الضريبة", sub:"بالريال السعودي",       val:taxAmount,    setter:setTaxAmount,    icon:"🧾", color:"#fbbf24", placeholder:"مثال: 50" },
    { label:"سعر التذكرة",  sub:"كاش بالريال السعودي",   val:cashPrice,    setter:setCashPrice,    icon:"🎫", color:"#34d399", placeholder:"مثال: 1500" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:"16px", padding:"14px 16px", display:"flex", gap:"10px", alignItems:"center" }}>
        <span style={{ fontSize:"26px" }}>🧮</span>
        <div>
          <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#e2e8f0" }}>حاسبة قيمة الأميال</p>
          <p style={{ margin:0, fontSize:"11px", color:"#475569", lineHeight:1.5 }}>احسب هل الأميال أوفر من شراء التذكرة كاش</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {fields.map(({ label, sub, val, setter, icon, color, placeholder }, i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${color}20`,
            borderRadius:"14px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"22px", flexShrink:0 }}>{icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 2px", fontSize:"12px", fontWeight:700, color }}>{label}</p>
              <p style={{ margin:"0 0 8px", fontSize:"10px", color:"#475569" }}>{sub}</p>
              <input type="number" value={val} onChange={e => setter(e.target.value)}
                placeholder={placeholder} min="0"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${color}30`,
                  borderRadius:"10px", padding:"10px 12px", color:"#f1f5f9", fontSize:"15px", fontWeight:700,
                  outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
          </div>
        ))}
      </div>

      {hasResult && (
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>

          <div style={{ background:"linear-gradient(135deg,rgba(96,165,250,0.15),rgba(96,165,250,0.05))",
            border:"1px solid rgba(96,165,250,0.35)", borderRadius:"18px", padding:"20px",
            textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-20px",right:"-20px",width:"100px",height:"100px",
              borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.15) 0%,transparent 70%)",pointerEvents:"none" }} />
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#60a5fa", fontWeight:700 }}>💳 المجموع بالريال</p>
            <p style={{ margin:"0 0 8px", fontSize:"11px", color:"#334155" }}>
              ({p} هللة × {m.toLocaleString()} ÷ 100) + {fmt(t)} ضريبة
            </p>
            <p style={{ margin:0, fontSize:"44px", fontWeight:900,
              background:"linear-gradient(135deg,#60a5fa,#93c5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>
              {fmt(totalSAR)}
            </p>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#60a5fa", fontWeight:600 }}>ريال سعودي</p>
          </div>

          {hasDiff && (
            <div style={{ background: diff > 0
                ? "linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))"
                : "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))",
              border:`1px solid ${diff > 0 ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
              borderRadius:"18px", padding:"20px", textAlign:"center" }}>
              <p style={{ margin:"0 0 6px", fontSize:"13px", fontWeight:700,
                color: diff > 0 ? "#f87171" : "#4ade80" }}>
                {diff > 0 ? "⚠️ الأميال أغلى من الكاش" : "✅ الأميال أوفر من الكاش"}
              </p>
              <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#334155" }}>
                {fmt(totalSAR)} − {fmt(c)} =
              </p>
              <p style={{ margin:0, fontSize:"44px", fontWeight:900, lineHeight:1,
                color: diff > 0 ? "#f87171" : "#4ade80" }}>
                {diff > 0 ? "+" : ""}{fmt(diff)}
              </p>
              <p style={{ margin:"4px 0 0", fontSize:"13px", fontWeight:600,
                color: diff > 0 ? "#f87171" : "#4ade80" }}>ريال سعودي</p>
              <p style={{ margin:"10px 0 0", fontSize:"11px", color:"#475569", lineHeight:1.5 }}>
                {diff > 0
                  ? `الأميال تكلفك ${fmt(diff)} ريال أكثر من شراء التذكرة نقداً`
                  : `توفر ${fmt(Math.abs(diff))} ريال باستخدام الأميال بدلاً من الكاش`}
              </p>
            </div>
          )}

          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:"14px", padding:"14px 16px" }}>
            <p style={{ margin:"0 0 10px", fontSize:"12px", color:"#64748b", fontWeight:700 }}>📊 تفاصيل الحساب</p>
            {[
              { label:"سعر الأميال (قبل الضريبة)", val:`${fmt((p*m)/100)} ريال`,  color:"#a78bfa" },
              { label:"الضريبة",                   val:`${fmt(t)} ريال`,           color:"#fbbf24" },
              { label:"المجموع الكلي",              val:`${fmt(totalSAR)} ريال`,    color:"#60a5fa" },
              ...(c > 0 ? [{ label:"سعر التذكرة كاش",    val:`${fmt(c)} ريال`,          color:"#34d399" }] : []),
              ...(c > 0 ? [{ label:"قيمة الميل الفعلية", val:`${((c/m)*100).toFixed(2)} هللة`, color:"#fb923c" }] : []),
            ].map((row,i,arr) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"7px 0", borderBottom:i < arr.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize:"12px", color:"#475569" }}>{row.label}</span>
                <span style={{ fontSize:"13px", fontWeight:700, color:row.color }}>{row.val}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.15)",
        borderRadius:"12px", padding:"12px", display:"flex", gap:"10px" }}>
        <span style={{ fontSize:"16px", flexShrink:0 }}>💡</span>
        <p style={{ margin:0, fontSize:"11px", color:"#fbbf24", lineHeight:1.6 }}>
          سعر الميل السعودي يتراوح بين 6–12 هللة. أفضل قيمة في رحلات الدرجة الأولى والأعمال على المسافات الطويلة.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentMiles,   setCurrentMiles]   = useState("");
  const [currentFlights, setCurrentFlights] = useState("");
  const [activeTab,      setActiveTab]      = useState("progress");

  const miles   = parseInt(currentMiles)   || 0;
  const flights = parseInt(currentFlights) || 0;

  const getCurrentTier = () => {
    if (miles >= 40000 || flights >= 30) return tiers[2];
    if (miles >= 25000 || flights >= 20) return tiers[1];
    return tiers[0];
  };
  const getNextTier = () => {
    const c = getCurrentTier();
    if (c.id === "gold")   return null;
    if (c.id === "silver") return tiers[2];
    return tiers[1];
  };

  const currentTier = getCurrentTier();
  const nextTier    = getNextTier();
  const milesProgress    = nextTier ? Math.min(100, ((miles   - currentTier.miles)   / (nextTier.miles   - currentTier.miles))   * 100) : 100;
  const flightsProgress  = nextTier ? Math.min(100, ((flights - currentTier.flights) / (nextTier.flights - currentTier.flights)) * 100) : 100;
  const milesRemaining   = nextTier ? Math.max(0, nextTier.miles   - miles)   : 0;
  const flightsRemaining = nextTier ? Math.max(0, nextTier.flights - flights) : 0;

  const TABS = [
    { id:"progress", label:"مراحل الترقية",  icon:"🏆" },
    { id:"redeem",   label:"استبدال الأميال", icon:"🎫" },
    { id:"upgrade",  label:"ترقية الدرجة",    icon:"⬆️" },
    { id:"profile",  label:"عضويتي",          icon:"👤" },
    { id:"calc",     label:"حاسبة الأميال",   icon:"🧮" },
  ];

  return (
    <div dir="rtl" style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#0a0a0f 0%,#0f1629 50%,#0a0a0f 100%)",
      fontFamily:"'Cairo','Noto Sans Arabic',sans-serif",
      color:"#e2e8f0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:"linear-gradient(180deg,rgba(16,24,48,0.97) 0%,transparent)",
        padding:"24px 20px 16px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"4px" }}>
          <span style={{ fontSize:"34px" }}>✈️</span>
          <h1 style={{ margin:0, fontSize:"24px", fontWeight:900,
            background:"linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>فرسان السعودية</h1>
        </div>
        <p style={{ margin:0, fontSize:"12px", color:"#94a3b8" }}>حاسبة النقاط والترقية</p>
      </div>

      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"18px 16px" }}>

        {/* ── Tabs — 5 ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:"5px", marginBottom:"16px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:"10px 4px", borderRadius:"12px", border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:"9px", fontWeight:700, transition:"all 0.2s",
              background: activeTab===tab.id ? "linear-gradient(135deg,#1e3a5f,#1e40af)" : "rgba(255,255,255,0.04)",
              color: activeTab===tab.id ? "#93c5fd" : "#64748b",
              border: activeTab===tab.id ? "1px solid #3b82f640" : "1px solid rgba(255,255,255,0.06)",
              display:"flex", flexDirection:"column", alignItems:"center", gap:"3px",
            }}>
              <span style={{fontSize:"17px"}}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab: مراحل الترقية ── */}
        {activeTab === "progress" && (
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {tiers.map(tier => {
              const isActive = tier.id === currentTier.id;
              const isPast = (tier.id==="green" && currentTier.id!=="green") || (tier.id==="silver" && currentTier.id==="gold");
              return (
                <div key={tier.id} style={{
                  background: isActive?"linear-gradient(135deg,rgba(0,0,0,0.5),rgba(0,0,0,0.3))":"rgba(255,255,255,0.02)",
                  border:`1px solid ${isActive?tier.color+"50":"rgba(255,255,255,0.06)"}`,
                  borderRadius:"16px", padding:"16px",
                  boxShadow: isActive?`0 0 30px ${tier.color}10`:"none",
                  opacity: isPast?0.5:1, position:"relative", overflow:"hidden",
                }}>
                  {isActive && <div style={{position:"absolute",top:"10px",left:"10px",background:tier.color,
                    borderRadius:"6px",padding:"2px 8px",fontSize:"10px",fontWeight:700,color:"#000"}}>مستواك الآن</div>}
                  {isPast && <div style={{position:"absolute",top:"10px",left:"10px",background:"#22c55e",
                    borderRadius:"6px",padding:"2px 8px",fontSize:"10px",fontWeight:700,color:"#000"}}>✓ محقق</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                    <div>
                      <h3 style={{margin:0,fontSize:"18px",fontWeight:900,color:tier.color}}>{tier.icon} {tier.name}</h3>
                      <p style={{margin:"2px 0 0",fontSize:"11px",color:"#475569"}}>{tier.nameEn}</p>
                    </div>
                    <div style={{textAlign:"left"}}>
                      {tier.miles > 0
                        ? <><p style={{margin:"0 0 2px",fontSize:"12px",color:"#64748b"}}><span style={{color:tier.color,fontWeight:700}}>{tier.miles.toLocaleString()}</span> ميل</p>
                             <p style={{margin:0,fontSize:"12px",color:"#64748b"}}>أو <span style={{color:tier.color,fontWeight:700}}>{tier.flights}</span> رحلة</p></>
                        : <p style={{margin:0,fontSize:"12px",color:"#22c55e",fontWeight:700}}>مجاني عند التسجيل</p>
                      }
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {tier.perks.map((p,i) => (
                      <span key={i} style={{background:`${tier.color}15`,border:`1px solid ${tier.color}25`,
                        borderRadius:"7px",padding:"3px 8px",fontSize:"11px",color:tier.color,fontWeight:600}}>{p}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Tab: استبدال الأميال ── */}
        {activeTab === "redeem" && (
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>

            {/* Legend */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"12px",padding:"12px"}}>
                <p style={{margin:"0 0 4px",fontSize:"12px",fontWeight:700,color:"#22c55e"}}>🎫 مكافأة</p>
                <p style={{margin:0,fontSize:"11px",color:"#64748b",lineHeight:1.5}}>أميال أقل – توفر محدود</p>
              </div>
              <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"12px",padding:"12px"}}>
                <p style={{margin:"0 0 4px",fontSize:"12px",fontWeight:700,color:"#fbbf24"}}>🎫 مكافأة بلس</p>
                <p style={{margin:0,fontSize:"11px",color:"#64748b",lineHeight:1.5}}>أميال أكثر – توفر أعلى</p>
              </div>
            </div>

            {/* Table header legend */}
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"4px",alignItems:"center"}}>
                <p style={{margin:0,fontSize:"11px",color:"#64748b",fontWeight:700}}>الوجهة</p>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0,fontSize:"10px",color:"#60a5fa",fontWeight:700}}>الضيافة (X)</p>
                </div>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0,fontSize:"10px",color:"#a78bfa",fontWeight:700}}>الأعمال (O)</p>
                </div>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0,fontSize:"10px",color:"#f59e0b",fontWeight:700}}>الأولى (A)</p>
                </div>
              </div>
            </div>

            {/* Zone rows */}
            {rewardTickets.map((z,i) => (
              <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"14px"}}>
                {/* Zone name */}
                <p style={{margin:"0 0 10px",fontSize:"12px",fontWeight:700,color:"#e2e8f0",lineHeight:1.4}}>{z.flag} {z.zone}</p>

                {/* Column headers */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"4px",marginBottom:"5px"}}>
                  <div/>
                  {[
                    {label:"الضيافة",color:"#60a5fa"},
                    {label:"الأعمال",color:"#a78bfa"},
                    {label:"الأولى", color:"#f59e0b"},
                  ].map((col,ci)=>(
                    <p key={ci} style={{margin:0,fontSize:"10px",color:col.color,fontWeight:700,textAlign:"center"}}>{col.label}</p>
                  ))}
                </div>

                {/* مكافأة row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"4px",
                  padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{fontSize:"10px",color:"#22c55e",fontWeight:700,alignSelf:"center"}}>مكافأة</span>
                  {[z.economy.reward, z.business.reward, z.first.reward].map((val,vi)=>(
                    <p key={vi} style={{margin:0,fontSize:"12px",fontWeight:700,textAlign:"center",color:val?"#e2e8f0":"#334155"}}>
                      {val ? val.toLocaleString() : "—"}
                    </p>
                  ))}
                </div>

                {/* مكافأة بلس row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"4px",padding:"6px 0 0"}}>
                  <span style={{fontSize:"10px",color:"#fbbf24",fontWeight:700,alignSelf:"center"}}>بلس</span>
                  {[z.economy.rewardPlus, z.business.rewardPlus, z.first.rewardPlus].map((val,vi)=>(
                    <p key={vi} style={{margin:0,fontSize:"12px",fontWeight:700,textAlign:"center",color:val?"#94a3b8":"#334155"}}>
                      {val ? val.toLocaleString() : "—"}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:"12px",padding:"12px",display:"flex",gap:"10px"}}>
              <span style={{fontSize:"16px",flexShrink:0}}>ℹ️</span>
              <p style={{margin:0,fontSize:"11px",color:"#93c5fd",lineHeight:1.6}}>
                الأميال لاتجاه واحد. الدرجة الأولى (A) بـ"مكافأة" فقط — غير متاحة بمكافأة بلس. للذهاب والإياب اضرب في 2.
              </p>
            </div>

            <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"13px",padding:"13px",display:"flex",gap:"10px",alignItems:"center"}}>
              <span style={{fontSize:"22px"}}>💡</span>
              <p style={{margin:0,fontSize:"12px",color:"#fbbf24",lineHeight:1.5}}>
                شراء أميال إضافية بحد أقصى 150,000 ميل سنوياً · الأميال صالحة 3 سنوات
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: ترقية الدرجة ── */}
        {activeTab === "upgrade" && <UpgradeCalculator />}


        {/* ── Tab: عضويتي ── */}
        {activeTab === "profile" && (
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>

            {/* Input Card */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"20px", padding:"20px" }}>
              <h2 style={{ margin:"0 0 14px", fontSize:"14px", fontWeight:700, color:"#cbd5e1" }}>أدخل بيانات عضويتك</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                {[
                  { label:"🏆 أميال العضوية", val:currentMiles,   setter:setCurrentMiles   },
                  { label:"✈️ عدد الرحلات",   val:currentFlights, setter:setCurrentFlights },
                ].map(({ label, val, setter }, i) => (
                  <div key={i}>
                    <label style={{ display:"block", fontSize:"12px", color:"#64748b", marginBottom:"6px", fontWeight:600 }}>{label}</label>
                    <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder="0" min="0"
                      style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                        borderRadius:"12px", padding:"11px 14px", color:"#f1f5f9", fontSize:"16px", fontWeight:700,
                        outline:"none", boxSizing:"border-box", textAlign:"center", fontFamily:"inherit" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div style={{ background:"linear-gradient(135deg,rgba(0,0,0,0.4),rgba(0,0,0,0.2))",
              border:`1px solid ${currentTier.color}40`, borderRadius:"20px", padding:"20px",
              boxShadow:`0 0 40px ${currentTier.color}12`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute",top:"-40px",left:"-40px",width:"160px",height:"160px",
                borderRadius:"50%",background:`radial-gradient(circle,${currentTier.color}15 0%,transparent 70%)`,pointerEvents:"none" }} />

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                <div>
                  <p style={{margin:"0 0 4px",fontSize:"12px",color:"#64748b",fontWeight:600}}>مستواك الحالي</p>
                  <h3 style={{margin:0,fontSize:"22px",fontWeight:900,color:currentTier.color}}>{currentTier.icon} {currentTier.name}</h3>
                  <p style={{margin:"2px 0 0",fontSize:"11px",color:"#475569"}}>{currentTier.nameEn}</p>
                </div>
                {currentTier.id==="gold" && (
                  <div style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:"10px",
                    padding:"5px 12px",fontSize:"11px",fontWeight:700,color:"#000"}}>✨ أعلى مستوى</div>
                )}
              </div>

              <div style={{ marginBottom:nextTier?"16px":"0" }}>
                <p style={{margin:"0 0 7px",fontSize:"12px",color:"#64748b",fontWeight:600}}>مزاياك الحالية:</p>
                {currentTier.perks.map((p,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#94a3b8",marginBottom:"4px"}}>
                    <span style={{color:currentTier.color,fontSize:"9px"}}>●</span>{p}
                  </div>
                ))}
              </div>

              {nextTier && (
                <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"14px",padding:"14px",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <p style={{margin:"0 0 10px",fontSize:"12px",color:"#64748b",fontWeight:600}}>
                    التقدم نحو {nextTier.icon} {nextTier.name}
                  </p>
                  {[
                    { label:"🏆 الأميال",  cur:miles,   total:nextTier.miles,   prog:milesProgress,   rem:`${milesRemaining.toLocaleString()} ميل` },
                    { label:"✈️ الرحلات", cur:flights, total:nextTier.flights, prog:flightsProgress, rem:`${flightsRemaining} رحلة` },
                  ].map((item,i) => (
                    <div key={i} style={{marginBottom:i===0?"10px":"0"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                        <span style={{fontSize:"12px",color:"#94a3b8"}}>{item.label}</span>
                        <span style={{fontSize:"12px",fontWeight:700,color:item.prog>=100?nextTier.color:"#64748b"}}>
                          {item.prog>=100?"✅ مكتمل":`متبقي ${item.rem}`}
                        </span>
                      </div>
                      <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"6px",height:"7px",overflow:"hidden"}}>
                        <div style={{width:`${item.prog}%`,height:"100%",
                          background:`linear-gradient(90deg,${nextTier.color}80,${nextTier.color})`,
                          borderRadius:"6px",transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}} />
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:"3px"}}>
                        <span style={{fontSize:"10px",color:"#475569"}}>{item.cur.toLocaleString ? item.cur.toLocaleString() : item.cur}</span>
                        <span style={{fontSize:"10px",color:"#475569"}}>{item.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  <p style={{margin:"10px 0 0",fontSize:"11px",color:"#475569",textAlign:"center"}}>
                    * يكفي تحقيق أحد الشرطين للترقية
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: حاسبة الأميال ── */}
        {activeTab === "calc" && <MilesCalculator />}

        <p style={{textAlign:"center",fontSize:"11px",color:"#334155",marginTop:"24px",lineHeight:1.6}}>
          البيانات للتوجيه العام · للتفاصيل الرسمية تفضل بزيارة موقع الخطوط السعودية
        </p>
      </div>
    </div>
  );
}
