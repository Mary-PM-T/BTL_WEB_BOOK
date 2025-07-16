document.addEventListener("DOMContentLoaded", () => {
  sliderShow();
  loadBooksFromStorage();
});

/* =============================
   SLIDER TỰ ĐỘNG HIỂN THỊ ẢNH
============================= */
function sliderShow() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  let current = 0;
  const showSlide = (i) => {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  };
  const nextSlide = () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  };
  showSlide(current);
  setInterval(nextSlide, 3000);
}

/* =============================
   HIỂN THỊ SÁCH TỪ localStorage
============================= */
function loadBooksFromStorage() {
  const store = JSON.parse(localStorage.getItem("books")) || {};

  Object.keys(store).forEach(category => {
    const container = document.getElementById(category);
    if (!container) return;

    const books = store[category];
    if (books.length === 0) {
      container.innerHTML = `<p>Chưa có sách nào trong danh mục này.</p>`;
      return;
    }

    books.forEach(book => {
      const bookHTML = `
        <div class="book-f2-one">
          <div class="book-card" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}">
            <div class="book-image">
              <img src="${book.image || 'https://via.placeholder.com/150'}" alt="${book.title}">
            </div>
            <div class="book-content">
              <h3>${book.title}</h3>
              <p>Tác giả: ${book.author}</p>
              <p>Giá: ${book.price.toLocaleString()}đ</p>
            </div>
            <div class="book-price">
              ${book.originalPrice ? `<div class="original-price">${book.originalPrice.toLocaleString()}đ</div>` : ""}
              <div class="current-price">${book.price.toLocaleString()}đ</div>
              <div class="cart-icon add-cart-btn" data-id="${book.id}">🛒</div>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", bookHTML);
    });
  });

  // Gắn lại sự kiện cho nút giỏ sau khi render xong
  addToCart();
}

function loadBooksFromStorage() {
  const store = JSON.parse(localStorage.getItem("books")) || {};
  Object.keys(store).forEach(category => {
    const container = document.getElementById(category);
    container.innerHTML = store[category].map(book => `
      <div class="book-f2-one">
        <div class="book-card" data-id="${book.id}" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}">
          <div class="book-image" onclick="viewDetails(${book.id})">
            <img src="${book.image}" alt="${book.title}">
          </div>
          <div class="book-content">
            <h3>${book.title}</h3>
            <p>Tác giả: ${book.author}</p>
            <p>Giá: ${book.price.toLocaleString()}đ</p>
          </div>
        </div>
      </div>
    `).join('');
  });
}


