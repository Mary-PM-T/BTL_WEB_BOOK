// CẤU TRÚC DANH MỤC SÁCH
let books = {
  'Book-TTT': [],
  'Book-KT': [],
  'Book-VH': [],
  'Book-TN': [],
  'Book-KN': [],
  'Book-TL': [],
  'Book-GK': [],
  'BookNew': []
};

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
    document.getElementById('addBookModal').style.display = 'block';
    if (category) {
        document.getElementById('bookCategory').value = category;
    }
}

function closeAddBookModal() {
    document.getElementById('addBookModal').style.display = 'none';
    document.getElementById('addBookForm').reset();
}

// THÊM SÁCH MỚI
function handleAddBook(e) {
  e.preventDefault();

  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const publisher = document.getElementById("bookPublisher").value;
  const pages = parseInt(document.getElementById("bookPages").value);
  const year = parseInt(document.getElementById("bookYear").value);
  const price = parseFloat(document.getElementById("bookPrice").value);
  const originalPrice = parseFloat(document.getElementById("bookOriginal").value);
  const image = document.getElementById("bookImage").value;
  const description = document.getElementById("bookDesc").value;
  const category = document.getElementById("bookCategory").value;

  const newBook = {
    id: Date.now(),
    title,
    author,
    publisher,
    pages,
    year,
    price,
    originalPrice,
    image,
    description,
    category
  };

  // Thêm vào mảng theo danh mục
  if (!books[category]) books[category] = [];
  books[category].push(newBook);
  localStorage.setItem("books", JSON.stringify(books));

  // Lưu chi tiết để hiển thị ở Book.html
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
  if (!container) return;

  const categoryBooks = books[category];
  if (!categoryBooks || categoryBooks.length === 0) {
    container.innerHTML = `<p class="empty">Chưa có sách nào.</p>`;
    return;
  }

  container.innerHTML = categoryBooks.map(book => `
    <div class="book-f2-one">
      <div class="book-card" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}">
        <div class="book-image">
          <img src="${book.image}" alt="${book.title}">
        </div>
        <div class="book-content">
          <h3>${book.title}</h3>
          <p>Tác giả: ${book.author}</p>
          <p>Giá: ${book.price.toLocaleString()}đ</p>
        </div>
        <button class="delete-btn" onclick="deleteBook(${book.id}, '${category}')">🗑 Xóa</button>
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

// MỞ MODAL THÊM SÁCH
function showAddBookModal(category = '') {
  const modal = document.getElementById("addBookModal");
  const select = document.getElementById("bookCategory");
  if (modal) modal.style.display = "block";
  if (category && select) select.value = category;
}

// ĐÓNG MODAL THÊM SÁCH
function closeAddBookModal() {
  const modal = document.getElementById("addBookModal");
  const form = document.querySelector("form");
  if (modal) modal.style.display = "none";
  if (form) form.reset();
}

// TÌM KIẾM SÁCH TRONG DANH MỤC
function searchBook() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  if (!searchTerm) {
    alert("Vui lòng nhập tên sách để tìm kiếm.");
    return;
  }

  let found = false;
  for (const category in books) {
    const container = document.getElementById(category);
    if (!container) continue;

    const matched = books[category].filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );

    if (matched.length > 0) {
      found = true;
      container.innerHTML = matched.map(book => `
        <div class="book-f2-one">
          <div class="book-card" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}">
            <div class="book-image">
              <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-content">
              <h3>${book.title}</h3>
              <p>Tác giả: ${book.author}</p>
              <p>Giá: ${book.price.toLocaleString()}đ</p>
            </div>
            <button class="delete-btn" onclick="deleteBook(${book.id}, '${category}')">🗑 Xóa</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (!found) alert("Không tìm thấy sách nào phù hợp.");
}

// ĐÓNG MODAL KHI CLICK RA NGOÀI
window.onclick = function (e) {
  const modal = document.getElementById("addBookModal");
  if (e.target === modal) {
    closeAddBookModal();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const bookTitles = document.querySelectorAll('.book-title');

  bookTitles.forEach(title => {
    title.addEventListener('click', (e) => {
      const bookName = e.target.innerText.trim();
      const allBooks = JSON.parse(localStorage.getItem('books')) || [];

      const found = allBooks.find(book => book.title === bookName);
      if (found) {
        localStorage.setItem('selectedBook', JSON.stringify(found));
        window.location.href = 'bookDetail.html'; 
      }
    });
  });
});


// CLICK VAO DE XEM CHI TIET SACH
function renderBooks(category) {
  const container = document.getElementById(category);
  container.innerHTML = books[category].map(book => `
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
        <button onclick="deleteBook(${book.id}, '${category}')">🗑 Xóa</button>
      </div>
    </div>
  `).join('');
}

function viewDetails(id) {
  const bookDetails = JSON.parse(localStorage.getItem("bookDetails")) || {};
  const book = bookDetails[id];
  if (book) {
    localStorage.setItem("selectedBook", JSON.stringify(book));
    window.location.href = "book.html";
  }
}
