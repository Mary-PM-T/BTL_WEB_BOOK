$(document).ready(function () {
  maintainLayoutScale();
  setupSearch();
  setupFilters();
  setupLanguageToggle();
  // Tự động gọi tìm kiếm mỗi khi input thay đổi
  $('#searchInput').on('input', searchBooks);
});

/* ===== Giữ tỷ lệ giao diện theo kích thước cửa sổ ===== */
function maintainLayoutScale() {
  const baseWidth = 1440; // width chuẩn để scale
  const $container = $('.container');
  if (!$container.length) return;

  function scale() {
    const ratio = Math.min($(window).width() / baseWidth, 1);
    $container.css({
      transform: `scale(${ratio})`,
      transformOrigin: 'top center'
    });
  }

  $(window).on('resize', scale);
  scale();
}

/* ===== Hàm tìm kiếm sách theo tên hoặc tác giả ===== */
function setupSearch() {
  // Khi nhập liệu hoặc gọi thủ công đều lọc sách
  function searchBooks() {
    const keyword = $('#searchInput').val().trim().toLowerCase();

    $('.book-card').each(function () {
      const title = ($(this).data('title') || '').toLowerCase();
      const author = ($(this).data('author') || '').toLowerCase();
      const $parent = $(this).parent();

      // Hiện nếu trùng tên hoặc tác giả, hoặc keyword rỗng
      if (!keyword || title.includes(keyword) || author.includes(keyword)) {
        $parent.css('display', 'flex');
      } else {
        $parent.css('display', 'none');
      }
    });
  }

  // Expose cho sự kiện input
  window.searchBooks = searchBooks;
  searchBooks(); // gọi ngay 1 lần khi load
}

/* ===== Toggle hiển thị cờ ngôn ngữ ===== */
function setupLanguageToggle() {
  $('#togg').on('click', () => {
    $('#nation').toggleClass('visible hidden');
  });
}

function selectFlag(langCode) {
  let flagUrl = '';
  switch (langCode) {
    case 'vn':
      flagUrl = 'https://flagcdn.com/w40/vn.png';
      break;
    case 'us':
      flagUrl = 'https://flagcdn.com/w40/us.png';
      break;
  }

  $('#selectedFlag')
    .attr('src', flagUrl)
    .attr('alt', langCode.toUpperCase());

  $('#nation').removeClass('visible').addClass('hidden');
}
/* ---------- XEM CHI TIET SACH ----------*/
function viewData(id) {
  const books = JSON.parse(localStorage.getItem("books"));
  let book = null;
  for(const category in books){
    book = books[category].find( ma => ma.id === id);
    if(book) break;
  }
  if(book){
    localStorage.setItem("selectedBook", JSON.stringify(book));
    window.location.href = "Book.html";
  }
}
window.viewDetails = viewData;

/* ---------- NẠP DỮ LIỆU VÀ HIỂN THỊ ----------*/

function loadBook() {
    const books = JSON.parse(localStorage.getItem("books"));

    $.each(books, (category, booksInC) => {  // $.each(object, (key,value) => {}); - object
        renderBooks(category, booksInC);
    });
}

/* ---------- HIỂN THỊ SÁCH THEO FORM AND DANH MỤC ----------*/

function renderBooks(category, booksInC){
    const $container = $("#" + category); // theo ID

    if(!$container.length) return;
    if(!booksInC.length) {
        $container.html("<p>Chưa có sách nào.</p>");
        return;
    }

    const max = 4;
    const limitedBooks = booksInC.slice(0, max); // Hien thi toi da 4 sach dau
    
    const html = booksInC.map(book => {
        const discount = Math.round(100 - (book.price/ book.originalPrice)*100);

    return `
        <div class="book-f2-one">
        <div class="book-card" data-id="${book.id}">
            <div class="book-image">
            <img src="${book.image || 'https://via.placeholder.com/150'}" alt="${book.title}">
            </div>
            <div class="book-content">
            <h3>${book.title}</h3>
            <p>Tác giả: ${book.author}</p>
            </div>
            <div class="book-price">
            ${book.originalPrice ? `<div class="original-price">${book.originalPrice.toLocaleString()}.000đ</div>` : ""}
            <div class="P">
                <div class="current-price">${book.price.toLocaleString()}.000đ</div>
                ${discount > 0 ? `<div class="dis-icon">-${discount}%</div>` : ""}
            </div>
            </div>
        </div>
        </div>
    `;
    }).join('');
    $container.html(html); // chen HTML

    $container.find(".book-card").on("click", function() {
        const id = $(this).data("id"); // lay du lieu tu id
        viewData(id);
    });
}
