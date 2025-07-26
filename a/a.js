// NẠP DỮ LIỆU TỪ localStorage
document.addEventListener("DOMContentLoaded", () => {
  const storedBooks = JSON.parse(localStorage.getItem("books"));
  if (storedBooks) books = storedBooks;

  Object.keys(books).forEach(renderBooks);

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", handleAddBook);
  }
});

function showAddBookModal(category = '') {
  const modal = document.getElementById("addBookModal");
  const select = document.getElementById("bookCategory");
  if (modal) modal.style.display = "block";
  if (category && select) select.value = category;
}

function closeAddBookModal() {
  const modal = document.getElementById("addBookModal");
  const form = document.querySelector("form");
  if (modal) modal.style.display = "none";
  if (form) form.reset();
}

// THÊM SÁCH MỚI
function handleAddBook(e) {
  e.preventDefault();

  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const publisher = document.getElementById("bookPublisher").value;
  const star = parseFloat(document.getElementById("bookStar").value);
  const buy = parseInt(document.getElementById("bookBuy").value);
  const pages = parseInt(document.getElementById("bookPages").value);
  const year = parseInt(document.getElementById("bookYear").value);
  const price = parseFloat(document.getElementById("bookPrice").value);
  const originalPrice = parseFloat(document.getElementById("bookOriginal").value);
  const discount = Math.round(100 - (price / originalPrice) * 100);
  const lang = document.getElementById("bookLang").value;
  const image = document.getElementById("bookImage").value;
  const description = document.getElementById("bookDesc").value;
  const category = document.getElementById("bookCategory").value;

  const newBook = {
    id: Date.now(),
    title, author, publisher, star, buy, pages, year,
    price, originalPrice, discount, lang, image, description, category
  };

  if (!books[category]) books[category] = [];
  books[category].push(newBook);
  localStorage.setItem("books", JSON.stringify(books));

  const bookDetails = JSON.parse(localStorage.getItem("bookDetails")) || {};
  bookDetails[newBook.id] = newBook;
  localStorage.setItem("bookDetails", JSON.stringify(bookDetails));

  renderBooks(category);
  closeAddBookModal();
  alert("✅ Đã thêm sách thành công!");
}

// HIỂN THỊ SÁCH THEO DANH MỤC
function renderBooks(category) {
  const container = document.getElementById(category);
  const list = books[category];
  if (!container || !list || list.length === 0) {
    container.innerHTML = `<p class="empty-state">Chưa có sách nào trong danh mục này</p>`;
    return;
  }

  container.innerHTML = list.map(book => `
    <div class="book-f2-one">
      <div class="book-card" data-id="${book.id}" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}">
        <div class="book-image" onclick="viewDetails(${book.id})">
          <img src="${book.image}" alt="${book.title}" />
        </div>
        <div class="book-content">
          <h3>${book.title}</h3>
          <p>Tác giả: ${book.author}</p>
          <p>Giá gốc: ${Number(book.originalPrice).toLocaleString('vi-VN')}.000đ</p>
          <p>Giá hiện tại: ${Number(book.price).toLocaleString('vi-VN')}.000đ</p>
        </div>
        <button onclick="deleteBook(${book.id}, '${category}')">🗑 Xóa</button>
      </div>
    </div>
  `).join('');
}

// XÓA SÁCH
function deleteBook(bookId, category) {
  if (!confirm("Bạn có chắc chắn muốn xóa sách này?")) return;

  books[category] = books[category].filter(book => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));

  const details = JSON.parse(localStorage.getItem("bookDetails")) || {};
  delete details[bookId];
  localStorage.setItem("bookDetails", JSON.stringify(details));

  renderBooks(category);
}



// CLICK XEM CHI TIẾT SÁCH
function viewDetails(id) {
  const bookDetails = JSON.parse(localStorage.getItem("bookDetails")) || {};
  const book = bookDetails[id];
  if (book) {
    localStorage.setItem("selectedBook", JSON.stringify(book));
    window.location.href = "book.html";
  }
}

// ĐÓNG MODAL KHI CLICK RA NGOÀI
window.onclick = function (e) {
  const modal = document.getElementById("addBookModal");
  if (e.target === modal) {
    closeAddBookModal();
  }
};
