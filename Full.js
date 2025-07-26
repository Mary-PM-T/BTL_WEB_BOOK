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

/* ===== Lọc sách theo giá và tác giả ===== */
function setupFilters() {
  const $priceFilters = $('.filter-section.price a');
  const $authorFilters = $('.filter-section.author a');

  if (!$priceFilters.length && !$authorFilters.length) return;

  let priceMin = 0, priceMax = Infinity;
  let selectedAuthor = 'all';

  $priceFilters.on('click', function (e) {
    e.preventDefault();
    priceMin = parseInt($(this).data('min'));
    priceMax = parseInt($(this).data('max'));
    setActive($priceFilters, $(this));
    applyFilters();
  });

  $authorFilters.on('click', function (e) {
    e.preventDefault();
    selectedAuthor = $(this).data('author');
    setActive($authorFilters, $(this));
    applyFilters();
  });

  function applyFilters() {
    $('.book-card').each(function () {
      const price = parseInt($(this).data('price'));
      const author = $(this).data('author');

      const matchPrice = price >= priceMin && price <= priceMax;
      const matchAuthor = selectedAuthor === 'all' || author === selectedAuthor;

      $(this).parent().css('display', matchPrice && matchAuthor ? 'flex' : 'none');
    });
  }

  function setActive($list, $active) {
    $list.removeClass('active');
    $active.addClass('active');
  }
}
