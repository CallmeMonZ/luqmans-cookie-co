/* =========================================================
   Luqman's Cookie Co. — SITE CONTENT
   ---------------------------------------------------------
   This is the ONLY file you need to edit to change the site.
   - Keep the quotes "..." around text, and the commas at line ends.
   - Anything in [SQUARE BRACKETS] is a placeholder. The site shows
     a "coming soon" state for it until you replace it.
   - Dates are written "YYYY-MM-DD", e.g. "2026-10-28".
   - See README.md for step-by-step instructions.
   ========================================================= */

window.SITE = {

  /* ---------- Brand (do not shorten the name) ---------- */
  brand: {
    name: "Luqman's Cookie Co.",
    parent: "Luqman Trading",
    tagline: "Freshly baked treats, right next to your coffee."
  },

  /* ---------- Contact ---------- */
  contact: {
    // WhatsApp number in international format, digits only, no + or spaces.
    whatsapp: "971557939565",
    // Instagram handle without the @. Example: "luqmanscookieco"
    instagram: "[INSTAGRAM_HANDLE]"
  },

  /* ---------- Location ---------- */
  location: {
    place: "RAK Medical & Health Sciences University",
    detail: "First floor"
  },

  /* ---------- Fresh batch badge (Menu tab) ----------
     The date the current batch was baked. The badge hides itself once the
     date is more than hideAfterDays old, so it never shows a stale date. */
  freshBatch: {
    bakedOn: "[YYYY-MM-DD]",
    hideAfterDays: 3
  },

  /* ---------- Exam season mode (Menu tab) ----------
     examMode: true shows the "Finals Fuel" banner with a countdown.
     examDate: when exams start, in UAE time (+04:00). */
  exam: {
    examMode: false,
    examDate: "2026-12-07T09:00:00+04:00",
    title: "Finals Fuel",
    message: "Exams start in",
    afterMessage: "Good luck with your exams! You've got this."
  },

  /* ---------- Menu ----------
     For each item:
       name, price (number, in AED), description
       image       – file in the images/ folder
       imageAlt    – short description of the photo (for screen readers)
       samplePhoto – true while the photo is a stock photo, false for your own
       ingredients – text, or null until you have it from the bakery
       allergens   – a list like ["Wheat (gluten)", "Milk", "Egg"],
                     or null until confirmed. NEVER guess allergens.
       soldOut / isNew / favourite / lighter – true or false (shows a badge)
  */
  menu: [
    {
      name: "Chocolate Chip Cookie",
      price: 5,
      description: "[DESCRIPTION]",
      image: "images/chocolate-chip.webp",
      imageAlt: "Chocolate chip cookies",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: false
    },
    {
      name: "Double Chocolate Cookie",
      price: 6,
      description: "[DESCRIPTION]",
      image: "images/double-chocolate.webp",
      imageAlt: "Dark chocolate cookies",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: false
    },
    {
      name: "Oat & Date Cookie",
      price: 6,
      description: "[DESCRIPTION]",
      image: "images/oat-date.webp",
      imageAlt: "A stack of oat cookies on a plate",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: true
    },
    {
      name: "Brownie",
      price: 7,
      description: "[DESCRIPTION]",
      image: "images/fudge-brownie.webp",
      imageAlt: "Stacked chocolate brownies",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: false
    },
    {
      name: "Blueberry Muffin",
      price: 7,
      description: "[DESCRIPTION]",
      image: "images/blueberry-muffin.webp",
      imageAlt: "Blueberry muffins",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: false
    },
    {
      name: "Mini Croissant",
      price: 6,
      description: "[DESCRIPTION]",
      image: "images/mini-croissant.webp",
      imageAlt: "Golden croissants",
      samplePhoto: true,
      ingredients: null,
      allergens: null,
      soldOut: false, isNew: false, favourite: false, lighter: false
    }
  ],

  /* ---------- Perfect with coffee (Menu tab) ----------
     Only suggest drinks the coffee machine actually sells. */
  pairings: [
    { treat: "Brownie", coffee: "Espresso", note: "" },
    { treat: "[TREAT]", coffee: "[COFFEE]", note: "" },
    { treat: "[TREAT]", coffee: "[COFFEE]", note: "" }
  ],

  /* ---------- About (Menu tab) ---------- */
  about: {
    bakery: "[BAKERY NAME]",
    // {bakery} is replaced with the bakery name above.
    text: "Luqman's Cookie Co. is a Luqman Trading brand, bringing treats from {bakery}, a local bakery, to your coffee break."
  },

  /* ---------- Vote for the next flavour (Vote tab) ----------
     To start a new vote: change "round" (e.g. "2026-12") so everyone can
     vote again, and replace the options. Put last month's winner below.
     Results are NOT live — count them in your Google Sheet. */
  vote: {
    round: "2026-11",
    question: "What should we bake next?",
    endsOn: "[YYYY-MM-DD]",
    options: ["[FLAVOUR OPTION 1]", "[FLAVOUR OPTION 2]", "[FLAVOUR OPTION 3]"],
    // Last month's winner, or null if this is the first vote.
    // Example: { name: "Salted Caramel", result: "52% of 180 votes" }
    lastWinner: null
  },

  /* ---------- Rate today's cookie (Vote tab) ----------
     item: which treat to ask about today, or "" to ask about any treat. */
  rate: {
    item: ""
  },

  /* ---------- Name our next cookie (Vote tab) ----------
     Hall of Fame: past winning names, credited by first name or nickname.
     Example: { cookie: "The All-Nighter", by: "Sara", month: "Oct 2026" } */
  hallOfFame: [],

  /* ---------- Group & event orders (Orders tab) ---------- */
  orders: {
    whatsappMessage: "Hi Luqman's Cookie Co., I'd like to place a group order.\nOccasion:\nDate needed:\nItems and how many:\nMy name:"
  },

  /* ---------- Help tab ---------- */
  help: {
    promise: "We'll sort it out quickly.",
    whatsappMessage: "Hi Luqman's Cookie Co., I had a problem with the vending machine.\nDate:\nTime:\nItem:\nWhat happened:",
    // Frequently asked questions. Answers in [BRACKETS] show
    // "Coming soon — ask us on WhatsApp" until you fill them in.
    //   "{location}"  → shows the location from above
    //   "{allergens}" → shows the allergen notice
    faq: [
      { q: "How do I pay?",              a: "[HOW TO PAY]" },
      { q: "Can I get a refund?",        a: "[REFUND POLICY]" },
      { q: "Is everything halal?",       a: "[HALAL STATUS]" },
      { q: "What about allergens?",      a: "{allergens}" },
      { q: "When is the machine restocked?", a: "[RESTOCK TIMES]" },
      { q: "Where is the machine?",      a: "{location}" }
    ]
  },

  /* ---------- Forms (Google Forms) ----------
     See README.md → "Connect Google Forms" for how to fill these in.
     action: the form's "formResponse" address.
     fields: the entry.XXXXXXX number of each question in your form. */
  forms: {
    action: "https://docs.google.com/forms/d/e/[FORM_ID]/formResponse",
    fields: {
      type:    "entry.[TYPE_ID]",
      choice:  "entry.[CHOICE_ID]",
      comment: "entry.[COMMENT_ID]",
      name:    "entry.[NAME_ID]",
      contact: "entry.[CONTACT_ID]",
      source:  "entry.[SOURCE_ID]"
    }
  }
};
