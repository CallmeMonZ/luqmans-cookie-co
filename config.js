/* =========================================================
   Luqman's Cookie Co. — SITE CONTENT
   ---------------------------------------------------------
   This is the ONLY file you need to edit to change the site.
   - Keep the quotes "..." around text, and the commas at line ends.
   - Anything in [SQUARE BRACKETS] is a placeholder. The site shows
     a "coming soon" state for it until you replace it.
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
    // Example: "9715XXXXXXXX"
    whatsapp: "971557939565",
    // Instagram handle without the @. Example: "luqmanscookieco"
    instagram: "[INSTAGRAM_HANDLE]"
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

  /* ---------- Find us ---------- */
  location: {
    place: "RAK Medical & Health Sciences University",
    detail: "First floor",
    // Optional photo of the spot, e.g. "images/machine-spot.webp". Leave "" for none.
    photo: "",
    photoAlt: "The Luqman's Cookie Co. vending machine next to the coffee machine"
  },

  /* ---------- Machine problem ---------- */
  help: {
    promise: "We'll sort it out quickly.",
    // Pre-filled WhatsApp message. \n starts a new line.
    whatsappMessage: "Hi Luqman's Cookie Co., I had a problem with the vending machine.\nDate:\nTime:\nItem:\nWhat happened:"
  },

  /* ---------- About ---------- */
  about: {
    bakery: "[BAKERY NAME]",
    // {bakery} is replaced with the bakery name above.
    text: "Luqman's Cookie Co. is a Luqman Trading brand, bringing treats from {bakery}, a local bakery, to your coffee break."
  }
};
