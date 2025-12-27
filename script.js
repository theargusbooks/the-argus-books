// NAVBAR

const navbar = document.getElementById("navbar");
const navLogo = document.getElementById("navLogo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
    navLogo.src = navLogo.dataset.scrolled;
  } else {
    navbar.classList.remove("scrolled");
    navLogo.src = navLogo.dataset.default;
  }
});

// MOBILE BUTTON  //
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

mobileBtn.addEventListener("click", () => {
  mobileNav.style.display =
    mobileNav.style.display === "flex" ? "none" : "flex";
});

// // Close menu on scroll
// window.addEventListener("scroll", () => {
//   mobileNav.style.display = "none";
// });

// MENU ANIMATION

const menuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.classList.toggle("open");
});

function getDiscountedPrice(price, discount) {
  return Math.round(price - (price * discount) / 100);
}

// BOOK DATA
let books = [];

fetch("./data/books.json")
  .then((response) => response.json())
  .then((data) => {
    books = data;
    displayBooks(books);
  })
  .catch((error) => {
    console.error("Error loading books:", error);
  });
// RENDER BOOKS
const grid = document.getElementById("bookGrid");

function getDiscountedPrice(price, discount) {
  return Math.round(price - (price * discount) / 100);
}

function displayBooks(list) {
  grid.innerHTML = "";

  list.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    const finalPrice = getDiscountedPrice(book.price, book.discount);

    card.innerHTML = `
      <div class="book-img-wrap">
        <img src="${book.img}" class="book-img">
      </div>

      <div class="book-info">
        <p class="book-title">${book.title}</p>
        <p class="book-author">${book.author}</p>

        <div class="price-row">
          <span class="price-original">₹${book.price}</span>
          <span class="price-discount">${book.discount}% OFF</span>
        </div>

        <div class="price-final">₹${finalPrice}</div>

        <a href="${book.amazon}" target="_blank" class="buy-btn">
          Buy Now
        </a>
      </div>
    `;

    // Open modal when card is clicked
    card.addEventListener("click", () => {
      openModal(book);
    });

    // Prevent modal opening when Buy Now is clicked
    const buyBtn = card.querySelector(".buy-btn");
    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    grid.appendChild(card);
  });
}

displayBooks(books);

// LIVE SEARCH
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
  displayBooks(filtered);
});

// MODAL
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

function openModal(book) {
  document.getElementById("modalImg").src = book.img;
  document.getElementById("modalTitle").textContent = book.title;
  document.getElementById("modalAuthor").textContent = "Author: " + book.author;
  document.getElementById("modalFormat").textContent = "Format: " + book.format;
  document.getElementById("modalPrice").textContent = "Price: ₹" + book.price;
  document.getElementById("modalYear").textContent = "Published: " + book.year;
  document.getElementById("modalAbout").textContent = "About the Book: ";

  document.getElementById("modalDesc").textContent = book.description;

  modal.classList.add("show");
}

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// MOBILE MENU TOGGLE
menuBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.style.display === "block";

  // Toggle menu
  mobileMenu.style.display = isOpen ? "none" : "block";

  // Add/remove class to body
  if (isOpen) {
    document.body.classList.remove("menu-open");
  } else {
    document.body.classList.add("menu-open");
  }
});

// Hide menu after clicking a link
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.onclick = () => (mobileMenu.style.display = "none");
});

// BACK TO TOP BUTTON
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.opacity = "1";
  } else {
    backToTop.style.opacity = "0";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// SEARCH SUGGESTIONS DROPDOWN (ENHANCED)
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
let activeIndex = -1; // For keyboard navigation
let currentMatches = []; // Store the filtered books

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  activeIndex = -1;

  // Filter books
  currentMatches = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  // Empty or no results
  if (query.trim() === "") {
    searchResults.style.display = "none";
    return;
  }

  if (currentMatches.length === 0) {
    searchResults.innerHTML = `<div class="search-no-result">No result found</div>`;
    searchResults.style.display = "block";
    return;
  }

  // Build dropdown list
  searchResults.innerHTML = currentMatches
    .map(
      (book, index) =>
        `<div class="search-item" data-index="${index}" onclick="selectBook('${book.title}')">${book.title}</div>`
    )
    .join("");

  searchResults.style.display = "block";
});

// KEYBOARD NAVIGATION
searchInput.addEventListener("keydown", function (e) {
  const items = document.querySelectorAll(".search-item");

  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    activeIndex = (activeIndex + 1) % items.length;
    updateActiveItem(items);
    e.preventDefault();
  }

  if (e.key === "ArrowUp") {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    updateActiveItem(items);
    e.preventDefault();
  }

  if (e.key === "Enter") {
    if (activeIndex >= 0 && activeIndex < currentMatches.length) {
      selectBook(currentMatches[activeIndex].title);
      e.preventDefault();
    }
  }
});

// Highlight active item
function updateActiveItem(items) {
  items.forEach((item) => item.classList.remove("search-active"));
  if (activeIndex >= 0) {
    items[activeIndex].classList.add("search-active");
  }
}

// On clicking a suggestion
function selectBook(title) {
  // Scroll to books section
  document.getElementById("books")?.scrollIntoView({ behavior: "smooth" });

  // Auto-fill search bar
  searchInput.value = title;

  // Filter grid
  const filtered = books.filter((b) => b.title === title);
  displayBooks(filtered);

  // Hide dropdown
  searchResults.style.display = "none";
}

// Hide dropdown on outside click
document.addEventListener("click", function (e) {
  if (!document.querySelector(".hero-search").contains(e.target)) {
    searchResults.style.display = "none";
  }
});

const clearSearch = document.getElementById("clearSearch");

// Show X when typing
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    clearSearch.style.display = "none";
  } else {
    clearSearch.style.display = "block";
  }
});

// Clear search on click
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.style.display = "none";
  searchResults.style.display = "none";

  // Restore full book list
  displayBooks(books);
});

// TESTIMONIALS ANIMATION

const track = document.getElementById("testimonialTrack");
const firstSet = track.querySelector(".testimonials-set");

function setMarqueeWidth() {
  const width = firstSet.offsetWidth;
  track.style.setProperty("--marquee-width", `${width}px`);
}

setMarqueeWidth();
window.addEventListener("resize", setMarqueeWidth);
