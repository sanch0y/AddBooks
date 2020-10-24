/*Local Storage Enabled*/
class Book {
  constructor(bookId, title, author, year) {
    this.bookId = bookId;
    this.title = title;
    this.author = author;
    this.year = year;
  }

}

class UI {
  //____________________________________________________________________________
  addRow(book) {
    const tbody = document.getElementById('book-list');

    let row = document.createElement('tr');
    //*
    row.innerHTML = `
    <td style='display:none'>${book.bookId}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.year}</td>
    <td>
    <button type="button" class="btn btn-warning btn-sm edit">Edit</button>
    <button type="button" class="btn btn-danger btn-sm delete">Delete</button>
    </td>
    `
    //*/
    tbody.appendChild(row);
  }
  //____________________________________________________________________________
  putFields(book) {
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('publish').value = book.year;
  }
  //____________________________________________________________________________
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('publish').value = '';
  }
  //____________________________________________________________________________
  alertMsg(message, cls) {
    let div = document.createElement('div');
    div.className = `alert ${cls}`;
    let divText = document.createTextNode(message);
    div.appendChild(divText);

    let container = document.querySelector('.container');
    let form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }
  //____________________________________________________________________________
  editRow(target) {
    console.log(target);
    let id = target.parentNode.parentNode.firstElementChild;
    let title = id.nextElementSibling;
    let author = title.nextElementSibling;
    let publishyear = author.nextElementSibling;
    const book = new Book(id.textContent, title.textContent, author.textContent, publishyear.textContent);
    ui.putFields(book);
    let editBtn = document.getElementById('submit');
    editBtn.value = 'Edit Book Info';
    let counter = 0;
    editBtn.addEventListener('click', (event) => {
      event.preventDefault();
      
      const books = Store.getBooks();
      books.forEach((book, index) => {
        if (book.bookId == id.textContent) {
          counter++;
          // console.log('counter',counter);
          if(counter == 1){
            book.title = document.getElementById('title').value;
            book.author = document.getElementById('author').value;
            book.year = document.getElementById('publish').value;
            books.splice(index, 1, book);

            title.innerText = document.getElementById('title').value;
            author.innerText = document.getElementById('author').value;
            publishyear.innerText = document.getElementById('publish').value;

            ui.clearFields();

            editBtn.value = 'Add New Book';
          }
        }
      });

      localStorage.setItem('books', JSON.stringify(books));
    });
    return 'edited';
  }
  //____________________________________________________________________________
  deleteRow(target) {
    target.parentNode.parentNode.remove();
    return 'deleted';
  }

}

class Store {
  //____________________________________________________________________________
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  //____________________________________________________________________________
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => {
      const ui = new UI();
      ui.addRow(book);
    });
  }
  //____________________________________________________________________________
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  //____________________________________________________________________________
  static removeBook(target) {
    let a = target;
    let td = target.parentNode;
    let tr = td.parentNode;
    let td_id = tr.firstElementChild;
    let id = td_id.textContent;

    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.bookId == id) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

const form = document.getElementById('book-form');
const ui = new UI();

let assignBookId;
if (localStorage.getItem('books') === null || localStorage.getItem('books').length === 2) {
  assignBookId = 0;
} else {
  assignBookId = JSON.parse(localStorage.getItem('books'))[JSON.parse(localStorage.getItem('books')).length - 1].bookId;
}

form.addEventListener('submit', formListener);
//______________________________________________________________________________
function formListener(evnt) {
  evnt.preventDefault();
  let title = document.getElementById('title').value;
  let author = document.getElementById('author').value;
  let year = document.getElementById('publish').value;

  const book = new Book(++assignBookId, title, author, year);
  console.log(book);

  if (title === '' || author === '' || year === '') {
    ui.alertMsg('Please Fill Up All Fields', 'error');
  } else {
    ui.addRow(book);

    //Adding to Local Storage
    Store.addBook(book);

    ui.clearFields();
    ui.alertMsg('Book Added Successfully', 'success');
  }
}

const tbody = document.getElementById('book-list');
tbody.addEventListener('click', editOrDeleteEvent);
//______________________________________________________________________________
function editOrDeleteEvent(evnt) {
  // evnt.stopImmediatePropagation();
  evnt.preventDefault();
  let status = '';
  if (evnt.target.classList.contains('edit')) {
    status = ui.editRow(evnt.target);
    if (status === 'edited') {
      ui.alertMsg('Book Record Edited', 'success');
    }
  } else if (evnt.target.classList.contains('delete')) {
    status = ui.deleteRow(evnt.target);
    if (status === 'deleted') {
      ui.alertMsg('Book Record Deleted', 'success');
    }
    //Delete from localStorage
    Store.removeBook(evnt.target);
  }
}


//Display from localStorage when DOM is loaded
document.addEventListener('DOMContentLoaded', Store.displayBooks);
