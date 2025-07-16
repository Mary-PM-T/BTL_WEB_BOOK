document.addEventListener("DOMContentLoaded", () =>{
    quantitySelector();
    getBookID(id);
    rDetail(book);
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
    const p = JSON.parse(localStorage("books") || "[]");
    return books.find(book => book.id == id);
}

function rDetail(book) {
    const discount = Math.round(100 - (book.Original / book.Price)*100);
    document.getElementById("bookDetail").innerHTML = `
    <div class="l">
        <div class="book-image">
            <img src="${book.image}" alt="${book.title}"/>
        </div>
        <div ></div>
    </div>
    <div class="r">
        <div class="book-info">
            <div class="book"></div>
        </div>
    </div>
    `;
}
