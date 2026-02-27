// ─────────────────────────────────────────────────
// SPOTS DATA — Add more by copying the pattern
// Coordinates: Google Maps → right-click → copy
// ─────────────────────────────────────────────────
const SPOTS_DATA = [
  {
    id: 1, name: "Pai Dosa Stall", area: "Broadway, Fort Kochi",
    type: "hidden", lat: 9.9664, lng: 76.2432, emoji: "🫓", color: "#e74c3c",
    desc: "A legendary 5am dosa stall feeding dock workers for 40+ years. The sambar is cooked overnight on firewood. No signboard — just follow the crowd.",
    price: "₹30–60", timing: "5am – 10am", must: "Ghee Roast Dosa",
    contact: "+91 94470 00001", rating: 4.8,
    photos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Masala_Dosa.JPG/640px-Masala_Dosa.JPG"],
    menu: [{ name: "Plain Dosa", price: 30, veg: true },{ name: "Masala Dosa", price: 45, veg: true },{ name: "Ghee Roast Dosa", price: 60, veg: true },{ name: "Sambar Vada", price: 35, veg: true }],
    reviews: [{ name: "Rahul M", rating: 5, text: "Best dosa in Kochi! The sambar is out of this world." },{ name: "Priya K", rating: 5, text: "Worth waking up at 4am for. Authentic Kerala flavours." }]
  },
  {
    id: 2, name: "Old Harbour Tea Stall", area: "Fort Kochi Jetty",
    type: "hidden", lat: 9.9640, lng: 76.2460, emoji: "🍵", color: "#8B4513",
    desc: "Operating since 1978 at the edge of the fishing harbour. Chai brewed with cardamom, ginger, and a secret spice mix. Pairs with fresh banana fritters.",
    price: "₹15–40", timing: "4am – 9am", must: "Harbour Chai + Ethakka Appam",
    contact: "+91 94470 00002", rating: 4.7,
    photos: [],
    menu: [{ name: "Masala Chai", price: 15, veg: true },{ name: "Black Tea", price: 10, veg: true },{ name: "Ethakka Appam", price: 25, veg: true },{ name: "Bonda", price: 20, veg: true }],
    reviews: [{ name: "Joseph T", rating: 5, text: "The tea here is something else. Reminds me of childhood mornings." }]
  },
  {
    id: 3, name: "Loafer's Corner Canteen", area: "Princess Street, Fort Kochi",
    type: "local", lat: 9.9672, lng: 76.2448, emoji: "🍲", color: "#27ae60",
    desc: "A 50-year-old joint where fishermen, artists, and students share benches. Appam and fish stew fresh every morning. Get here before 9am or it's gone.",
    price: "₹50–100", timing: "6am – 12pm", must: "Appam + Fish Stew",
    contact: "+91 94470 00003", rating: 4.6,
    photos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/640px-A_small_cup_of_coffee.JPG"],
    menu: [{ name: "Appam + Fish Stew", price: 80, veg: false },{ name: "Appam + Veg Stew", price: 60, veg: true },{ name: "Puttu + Curry", price: 70, veg: false },{ name: "Filter Coffee", price: 20, veg: true }],
    reviews: [{ name: "Meera V", rating: 4, text: "Classic Kochi breakfast. Go early!" }]
  },
  {
    id: 4, name: "Kallu Shappu Meals", area: "Mattancherry",
    type: "local", lat: 9.9573, lng: 76.2562, emoji: "🍛", color: "#27ae60",
    desc: "A no-frills toddy shop doubling as a Kerala meals paradise. Rice, fish curry, and thoran you genuinely won't find in any restaurant.",
    price: "₹80–150", timing: "11am – 3pm", must: "Fish Curry Meals",
    contact: "+91 94470 00004", rating: 4.5,
    photos: [],
    menu: [{ name: "Full Kerala Meals", price: 120, veg: false },{ name: "Veg Meals", price: 90, veg: true },{ name: "Fish Curry Rice", price: 100, veg: false },{ name: "Tapioca + Fish", price: 80, veg: false }],
    reviews: [{ name: "Anand R", rating: 5, text: "This is the real Kerala. No tourists, no pretence." }]
  },
  {
    id: 5, name: "Irfan's Biriyani Corner", area: "Near Ernakulam Market",
    type: "hidden", lat: 9.9843, lng: 76.2810, emoji: "🍚", color: "#e74c3c",
    desc: "Tucked behind the main market, Irfan's has a cult following. Only 30 plates daily — sold out by 1pm. Dum cooked in a sealed earthen pot.",
    price: "₹120–180", timing: "12pm – 2pm", must: "Mutton Dum Biriyani",
    contact: "+91 94470 00005", rating: 4.9,
    photos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Biryani_Home_made.jpg/640px-Biryani_Home_made.jpg"],
    menu: [{ name: "Mutton Dum Biriyani", price: 180, veg: false },{ name: "Chicken Biriyani", price: 150, veg: false },{ name: "Egg Biriyani", price: 120, veg: false },{ name: "Raita", price: 20, veg: true }],
    reviews: [{ name: "Farhan A", rating: 5, text: "Sold out by 12:30 most days. Plan accordingly!" },{ name: "Divya S", rating: 5, text: "Best biriyani in Kochi. Period." }]
  },
  {
    id: 6, name: "Chettiyar Kadai", area: "Jew Town, Mattancherry",
    type: "street", lat: 9.9548, lng: 76.2590, emoji: "🌶️", color: "#e8a034",
    desc: "An ancient street stall with pepper-heavy snacks passed through generations. A rare Kochi fusion nobody talks about online.",
    price: "₹20–50", timing: "3pm – 8pm", must: "Pepper Bonda",
    contact: "+91 94470 00006", rating: 4.4,
    photos: [],
    menu: [{ name: "Pepper Bonda", price: 20, veg: true },{ name: "Masala Vada", price: 25, veg: true },{ name: "Murukku", price: 30, veg: true }],
    reviews: [{ name: "Lalitha P", rating: 4, text: "Unique flavours you won't find anywhere else." }]
  },
  {
    id: 7, name: "The Port Canteen", area: "Willingdon Island",
    type: "hidden", lat: 9.9637, lng: 76.2684, emoji: "🐟", color: "#e74c3c",
    desc: "A workers' canteen inside the port area that outsiders almost never find. Incredible Karimeen fry and rice for almost nothing.",
    price: "₹60–100", timing: "7am – 4pm", must: "Karimeen Fry + Rice",
    contact: "+91 94470 00007", rating: 4.7,
    photos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Karimeen_pollichathu.jpg/640px-Karimeen_pollichathu.jpg"],
    menu: [{ name: "Karimeen Fry + Rice", price: 100, veg: false },{ name: "Prawns Fry", price: 120, veg: false },{ name: "Fish Curry Rice", price: 80, veg: false }],
    reviews: [{ name: "Sebastian K", rating: 5, text: "Freshest fish you'll ever eat. Still swimming at 6am." }]
  },
  {
    id: 8, name: "Saap Chaat Cart", area: "MG Road Junction, Ernakulam",
    type: "street", lat: 9.9830, lng: 76.2910, emoji: "🌮", color: "#e8a034",
    desc: "A bicycle cart appearing every evening at 6pm sharp. Sells chaat with a Kerala twist — raw mango pulihora and coconut sev.",
    price: "₹25–60", timing: "6pm – 10pm", must: "Raw Mango Chaat",
    contact: "+91 94470 00008", rating: 4.3,
    photos: [],
    menu: [{ name: "Raw Mango Chaat", price: 40, veg: true },{ name: "Pani Puri", price: 30, veg: true },{ name: "Bhel Puri", price: 35, veg: true }],
    reviews: [{ name: "Shreya N", rating: 4, text: "The raw mango twist is genius. Addictive." }]
  },
  {
    id: 9, name: "Darvesh Hotel", area: "Kaloor",
    type: "local", lat: 10.0050, lng: 76.2960, emoji: "🫓", color: "#27ae60",
    desc: "Beloved by auto drivers and college students alike. The Pathiri and Coconut Mutton Ishtu here rivals any upscale Kerala restaurant.",
    price: "₹70–130", timing: "7am – 10pm", must: "Pathiri + Coconut Mutton Ishtu",
    contact: "+91 94470 00009", rating: 4.6,
    photos: [],
    menu: [{ name: "Pathiri + Mutton Ishtu", price: 130, veg: false },{ name: "Pathiri + Chicken Curry", price: 110, veg: false },{ name: "Appam + Stew", price: 90, veg: false },{ name: "Porotta + Beef", price: 100, veg: false }],
    reviews: [{ name: "Roshan M", rating: 5, text: "My go-to for Pathiri. Nothing else comes close." }]
  },
  {
    id: 10, name: "Rajan's Parotta Kadai", area: "Kaloor Bus Stand",
    type: "street", lat: 10.0030, lng: 76.2920, emoji: "🥙", color: "#e8a034",
    desc: "Open since midnight, Rajan's feeds night owls and bus drivers with flaky layered parottas and a beef curry simmering all night.",
    price: "₹50–100", timing: "12am – 6am", must: "Parotta + Beef Curry",
    contact: "+91 94470 00010", rating: 4.5,
    photos: [],
    menu: [{ name: "Parotta + Beef", price: 80, veg: false },{ name: "Parotta + Egg Curry", price: 60, veg: false },{ name: "Parotta + Dal", price: 50, veg: true }],
    reviews: [{ name: "Vishnu T", rating: 5, text: "The only midnight option worth going to." }]
  },
  {
    id: 11, name: "Amma's Kitchen", area: "Thevara",
    type: "local", lat: 9.9467, lng: 76.3006, emoji: "🍱", color: "#27ae60",
    desc: "A retired teacher serves authentic Onam sadhya-style meals from her home to just 15 guests per day. The Avial alone is worth the trip.",
    price: "₹150–200", timing: "12pm – 2pm (pre-book)", must: "Avial + Olan combo",
    contact: "+91 94470 00011", rating: 4.9,
    photos: [],
    menu: [{ name: "Full Sadhya (15+ items)", price: 200, veg: true },{ name: "Avial + Rice", price: 150, veg: true }],
    reviews: [{ name: "Geetha N", rating: 5, text: "Like eating at grandma's. Pure Onam magic." }]
  },
  {
    id: 12, name: "Cherai Beach Seafood Shack", area: "Cherai Beach",
    type: "seafood", lat: 10.1337, lng: 76.1831, emoji: "🦐", color: "#3498db",
    desc: "A fisherman-turned-cook grills his morning catch right on the beach under a coconut thatch roof. Prawns, squid, and crab cooked in minutes.",
    price: "₹150–400", timing: "10am – 5pm", must: "Grilled Prawns",
    contact: "+91 94470 00012", rating: 4.7,
    photos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Grilled_Tiger_Prawns.jpg/640px-Grilled_Tiger_Prawns.jpg"],
    menu: [{ name: "Grilled Prawns (6 pcs)", price: 280, veg: false },{ name: "Squid Fry", price: 200, veg: false },{ name: "Crab Curry", price: 350, veg: false },{ name: "Coconut Water", price: 40, veg: true }],
    reviews: [{ name: "Sunita R", rating: 5, text: "Ate with sand between my toes. Magical." }]
  },
  {
    id: 13, name: "Moolayil Bakery", area: "Palluruthy",
    type: "local", lat: 9.9330, lng: 76.2950, emoji: "🍞", color: "#27ae60",
    desc: "A 70-year-old family wood-fired bakery. Kerala bread, Achappam, and Unnakaya made fresh. Tourists never reach Palluruthy — their loss.",
    price: "₹10–80", timing: "6am – 7pm", must: "Unnakaya + Kerala Bread",
    contact: "+91 94470 00013", rating: 4.6,
    photos: [],
    menu: [{ name: "Kerala Bread (loaf)", price: 35, veg: true },{ name: "Unnakaya (6 pcs)", price: 60, veg: false },{ name: "Achappam (dozen)", price: 80, veg: true },{ name: "Banana Cake", price: 50, veg: true }],
    reviews: [{ name: "Thomas J", rating: 5, text: "My family has bought bread here for 30 years." }]
  },
  {
    id: 14, name: "Marine Drive Evening Stalls", area: "Marine Drive, Ernakulam",
    type: "street", lat: 9.9816, lng: 76.2766, emoji: "🌽", color: "#e8a034",
    desc: "As the sun sets over the backwaters, pushcart vendors serve bhel puri, pav bhaji, and grilled corn with Kerala spices along the promenade.",
    price: "₹30–80", timing: "5pm – 10pm", must: "Spiced Grilled Corn",
    contact: "+91 94470 00014", rating: 4.2,
    photos: [],
    menu: [{ name: "Spiced Corn", price: 30, veg: true },{ name: "Pav Bhaji", price: 60, veg: true },{ name: "Bhel Puri", price: 40, veg: true }],
    reviews: [{ name: "Nisha P", rating: 4, text: "Perfect evening snack with a sunset view!" }]
  },
  {
    id: 15, name: "Njarackal Fish Market Stalls", area: "Njarackal",
    type: "seafood", lat: 10.0990, lng: 76.2120, emoji: "🐠", color: "#3498db",
    desc: "Right next to the fish auction, vendors cook whatever excess catch is left. Some of the cheapest and freshest seafood in Kerala — straight from the auction.",
    price: "₹40–120", timing: "6am – 10am", must: "Tapioca + Fresh Fish Fry",
    contact: "+91 94470 00015", rating: 4.5,
    photos: [],
    menu: [{ name: "Tapioca + Fish Fry", price: 80, veg: false },{ name: "Pearl Spot Fry", price: 100, veg: false },{ name: "Prawns Masala", price: 120, veg: false }],
    reviews: [{ name: "Mathew P", rating: 5, text: "If you know, you know. Freshest fish in Kochi." }]
  },
  {
    id: 16, name: "Thevara Ferry Fish Fry", area: "Thevara Ferry Junction",
    type: "seafood", lat: 9.9450, lng: 76.3020, emoji: "🐟", color: "#3498db",
    desc: "A shack next to the ferry serving the freshest fish fry in Kochi — direct from the morning catch. No menu, whatever came in that morning is what you eat.",
    price: "₹80–200", timing: "11am – 4pm", must: "Fresh Catch Fish Fry",
    contact: "+91 94470 00016", rating: 4.7,
    photos: [],
    menu: [{ name: "Today's Catch Fry", price: 150, veg: false },{ name: "Karimeen Pollichathu", price: 200, veg: false }],
    reviews: [{ name: "Alex J", rating: 5, text: "Amazing. Whatever they're cooking that day is perfect." }]
  },
  {
    id: 17, name: "Janaki Amma's Idli", area: "Near Mattancherry Palace",
    type: "hidden", lat: 9.9557, lng: 76.2580, emoji: "🍽️", color: "#e74c3c",
    desc: "A widow runs this stall from outside her home — soft rice idlis with a coconut chutney recipe unchanged since the 1960s. Only 50 plates daily.",
    price: "₹25–45", timing: "6am – 9am", must: "Mini Idli Set",
    contact: "+91 94470 00017", rating: 4.8,
    photos: [],
    menu: [{ name: "Mini Idli Set (12 pcs)", price: 45, veg: true },{ name: "Regular Idli (4 pcs)", price: 30, veg: true },{ name: "Sambar Vada", price: 35, veg: true }],
    reviews: [{ name: "Lakshmi R", rating: 5, text: "The chutney is the star. 60 years of perfection." }]
  },
  {
    id: 18, name: "Edapally Junction Vada", area: "Edapally",
    type: "street", lat: 10.0220, lng: 76.3080, emoji: "🍩", color: "#e8a034",
    desc: "A 4am stall at the highway junction serving uzhunnu vada and sambar to truckers and travellers. Often called the best vada in greater Kochi.",
    price: "₹15–35", timing: "4am – 10am", must: "Uzhunnu Vada + Sambar",
    contact: "+91 94470 00018", rating: 4.5,
    photos: [],
    menu: [{ name: "Uzhunnu Vada (2 pcs)", price: 25, veg: true },{ name: "Medu Vada + Sambar", price: 35, veg: true },{ name: "Tea", price: 15, veg: true }],
    reviews: [{ name: "Driver Suresh", rating: 5, text: "Pit stop every single trip. Never disappoints." }]
  },
  {
    id: 19, name: "Aluva Ferry Snacks", area: "Aluva Ferry Ghat",
    type: "street", lat: 10.1070, lng: 76.3570, emoji: "🍌", color: "#e8a034",
    desc: "While waiting for the ferry, vendors sell crispy banana chips, roasted peanuts, and tender coconut. A time-capsule Kochi experience.",
    price: "₹20–60", timing: "7am – 7pm", must: "Fresh Banana Chips",
    contact: "+91 94470 00019", rating: 4.3,
    photos: [],
    menu: [{ name: "Banana Chips (100g)", price: 40, veg: true },{ name: "Coconut Water", price: 30, veg: true },{ name: "Roasted Peanuts", price: 20, veg: true }],
    reviews: [{ name: "Biji M", rating: 4, text: "Best chips I've had. Very fresh." }]
  },
  {
    id: 20, name: "Vytilla Hub Meals", area: "Vytilla Junction",
    type: "local", lat: 9.9640, lng: 76.3190, emoji: "🍛", color: "#27ae60",
    desc: "Inside the bus hub complex, this canteen-style spot serves unlimited Kerala meals to hundreds of commuters daily. Chaotic, loud, and absolutely worth it.",
    price: "₹60–90", timing: "11am – 3pm", must: "Unlimited Kerala Meals",
    contact: "+91 94470 00020", rating: 4.2,
    photos: [],
    menu: [{ name: "Unlimited Kerala Meals", price: 90, veg: false },{ name: "Veg Meals", price: 60, veg: true }],
    reviews: [{ name: "Pradeep V", rating: 4, text: "Can't beat the value. Unlimited rice!" }]
  }
];

function getAllSpots() {
  let userSpots = [];
  try { userSpots = JSON.parse(localStorage.getItem('adukalUserSpots') || '[]'); } catch(e) {}
  return [...SPOTS_DATA, ...userSpots];
}

function getSpotById(id) {
  return getAllSpots().find(s => s.id === id);
}

function saveUserSpot(spot) {
  let userSpots = [];
  try { userSpots = JSON.parse(localStorage.getItem('adukalUserSpots') || '[]'); } catch(e) {}
  userSpots.push(spot);
  localStorage.setItem('adukalUserSpots', JSON.stringify(userSpots));
}