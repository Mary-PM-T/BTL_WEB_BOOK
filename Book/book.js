// =============== book.js ==================
// Lấy dữ liệu từ localStorage
const selectedBook = JSON.parse(localStorage.getItem('selectedBook'));
const allBooks = JSON.parse(localStorage.getItem('books')) || [];

document.addEventListener("DOMContentLoaded", () => {
  quantitySelector();
  const book = getBookID(selectedBook?.id);
  if (book) rDetail(book);
  renderBookInfo();
  renderRelatedBooks();
});

/* Lien ket  */
document.addEventListener("DOMContentLoaded", () => {
  const selectedBook = JSON.parse(localStorage.getItem('selectedBook'));
  if (!selectedBook) return;

  // Ví dụ cập nhật vào HTML
  document.querySelector('.book-title').innerText = selectedBook.title;
  document.querySelector('.book-author').innerText = selectedBook.author;
  document.querySelector('.book-price').innerText = selectedBook.price + "đ";
  document.querySelector('.book-image').src = selectedBook.image;
  // ... các trường khác
});

/* QUANTITY */
function quantitySelector() {
  const dec = document.getElementById("dec-btn");
  const inc = document.getElementById("inc-btn");
  const qty = document.getElementById("qty");
  if (!dec || !inc || !qty) return;

  let count = parseInt(qty.value, 10) || 1;
  const updateButtons = () => {
    qty.value = count;
    dec.disabled = count <= 1;
    inc.disabled = count >= 10;
  };
  dec.addEventListener("click", () => {
    if (count > 1) {
      count--;
      updateButtons();
    }
  });
  inc.addEventListener("click", () => {
    if (count < 10) {
      count++;
      updateButtons();
    }
  });
  updateButtons();
}

function getBookID(id) {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  return books.find(book => book.id == id);
}

function rDetail(book) {
  const discount = Math.round(100 - (book.Original / book.Price) * 100);
  document.getElementById("bookDetail").innerHTML = `
    <div class="l">
        <div class="book-image">
            <img src="${book.image}" alt="${book.title}" style="width: 40%;"/>
        </div>
    </div>
    <div class="r">
        <div class="book-info">
            <h1>${book.title}</h1>
            <div class="author">Tác giả: ${book.author}</div>
            <div class="author">NXB: ${book.publisher || '---'}</div>
            <div class="price">Giá: ${book.price} đ <span style="color:red">(-${discount}%)</span></div>
        </div>
    </div>
  `;
}

function renderBookInfo() {
  if (!selectedBook) return;
  document.getElementById('bookTitle').textContent = selectedBook.title;
  document.getElementById('bookAuthor').textContent = selectedBook.author;
  document.getElementById('bookPublisher').textContent = selectedBook.publisher || '---';
  document.getElementById('bookPrice').textContent = `Giá: ${selectedBook.price} đ`;
  document.getElementById('bookId').textContent = selectedBook.id || '---';
  document.getElementById('detailAuthor').textContent = selectedBook.author;
  document.getElementById('detailPublisher').textContent = selectedBook.publisher || '---';
  const img = document.createElement('img');
  img.src = selectedBook.image || '';
  img.style.maxHeight = '100%';
  img.style.maxWidth = '100%';
  document.getElementById('bookImage').innerHTML = '';
  document.getElementById('bookImage').appendChild(img);
}

// Thêm vào giỏ hàng
function addToCart() {
  let quantity = parseInt(document.getElementById('quantity').value);
  if (!selectedBook || isNaN(quantity) || quantity < 1) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let index = cart.findIndex(item => item.id === selectedBook.id);
  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ ...selectedBook, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
}

// Tăng/giảm số lượng
function changeQuantity(change) {
  const quantityInput = document.getElementById('quantity');
  let value = parseInt(quantityInput.value);
  value = isNaN(value) ? 1 : value + change;
  quantityInput.value = value < 1 ? 1 : value;
}

// Gợi ý sách liên quan cùng danh mục
function renderRelatedBooks() {
  if (!selectedBook || !selectedBook.category || allBooks.length === 0) return;
  const related = allBooks.filter(book =>
    book.category === selectedBook.category && book.id !== selectedBook.id
  ).slice(0, 12);

  const container = document.getElementById('relatedBooks');
  container.innerHTML = '';

  related.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.onclick = () => {
      localStorage.setItem('selectedBook', JSON.stringify(book));
      window.location.href = 'book.html';
    };
    div.innerHTML = `
      <div class="book-item-cover"><img src="${book.image}" style="max-width:100%; max-height:100%;"></div>
      <div class="book-item-title">${book.title}</div>
      <div class="book-item-author">${book.author}</div>
      <div class="book-item-price">${book.price} đ</div>
    `;
    container.appendChild(div);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const book = JSON.parse(localStorage.getItem("selectedBook"));
  if (!book) return;

  document.getElementById('bookTitle').textContent = book.title;
  document.getElementById('bookAuthor').textContent = book.author;
  document.getElementById('bookPublisher').textContent = book.publisher || "---";
  document.getElementById('bookPrice').textContent = `Giá: ${book.price}đ`;
  document.getElementById('bookId').textContent = book.id;

  const img = document.createElement("img");
  img.src = book.image;
  document.getElementById('bookImage').innerHTML = "";
  document.getElementById('bookImage').appendChild(img);

  renderRelatedBooks(book);
});

function renderRelatedBooks(selected) {
  const all = JSON.parse(localStorage.getItem("books")) || {};
  const list = Object.values(all).flat().filter(b => b.category === selected.category && b.id !== selected.id).slice(0, 6);

  const container = document.getElementById("relatedBooks");
  container.innerHTML = list.map(b => `
    <div class="book-item" onclick="viewDetails(${b.id})">
      <img src="${b.image}" alt="${b.title}" />
      <div>${b.title}</div>
      <div>${b.author}</div>
      <div>${b.price}đ</div>
    </div>
  `).join('');
}
