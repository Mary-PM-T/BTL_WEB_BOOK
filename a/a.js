let books = {};
document.addEventListener("DOMContentLoaded", () => {
    const storedBooks = JSON.parse(localStorage.getItem("books"));
    if (storedBooks) books = storedBooks;

    Object.keys(books).forEach(category => renderBooks(category, books[category]));

    const form = document.querySelector("#addBookForm");
    if (form) form.addEventListener("submit", handleAddBook);
});

function showAddBookModal(category = '') {
    const modal = document.getElementById("addBookModal");
    const select = document.getElementById("bookCategory");
    if (modal) modal.style.display = "block";
    if (category && select) select.value = category;
}

function closeAddBookModal() {
    const modal = document.getElementById("addBookModal");
    const form = document.querySelector("#addBookForm");
    if (modal) modal.style.display = "none";
    if (form) form.reset();
}

// THÊM SÁCH MỚI
function handleAddBook(e) {
    e.preventDefault(); // 

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const publisher = document.getElementById("bookPublisher").value.trim();
    const star = parseFloat(document.getElementById("bookStar").value);
    const buy = parseInt(document.getElementById("bookBuy").value);
    const pages = parseInt(document.getElementById("bookPages").value);
    const year = parseInt(document.getElementById("bookYear").value);
    const price = parseFloat(document.getElementById("bookPrice").value);
    const originalPrice = parseFloat(document.getElementById("bookOriginal").value);
    const discount = Math.round(100 - (price / originalPrice) * 100);
    const lang = document.getElementById("bookLang").value;
    const image = document.getElementById("bookImage").value.trim();
    const description = document.getElementById("bookDesc").value.trim();
    const category = document.getElementById("bookCategory").value;

    if (!title || !author || !publisher || !lang || !image || !category) {
        alert("❌ Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (price <= 0 || originalPrice <= 0 || pages <= 0 || year < 1000 || star < 0 || star > 5) {
        alert("❌ Vui lòng nhập dữ liệu hợp lệ!");
        return;
    }

    const newBook = {
        id: Date.now(),
        title, author, publisher, star, buy, pages, year,
        price, originalPrice, discount, lang, image, description, category
    };

    if (!books[category]) books[category] = [];
    books[category].push(newBook);
    localStorage.setItem("books", JSON.stringify(books));

    renderBooks(category, books[category]);
    closeAddBookModal();
    alert("✅ Đã thêm sách thành công!");
}

// XÓA SÁCH
function deleteBook(bookId, category) {
    if (!confirm("Bạn có chắc chắn muốn xóa sách này?")) return;

    books[category] = books[category].filter(book => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));

    const details = JSON.parse(localStorage.getItem("bookDetails")) || {};
    delete details[bookId];
    localStorage.setItem("bookDetails", JSON.stringify(details));

    renderBooks(category, books[category]);
}
// ĐÓNG MODAL KHI CLICK RA NGOÀI
window.onclick = function (e) {
    const modal = document.getElementById("addBookModal");
    if (e.target === modal) {
        closeAddBookModal();
    }
};
