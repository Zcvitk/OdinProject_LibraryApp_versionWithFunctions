/*The displayBooks function gets a list of books from a store and then calls the 
addBookToList function for each book in the list.*/

const UI = {
  
    displayBooks: function() {                                                 
      const books = Store.getBooks();
      books.forEach((book) => this.addBookToList(book));
    },
  
/*The addBookToList function creates a table row element and then sets the values of
the book's title, author, number and read status in the row.*/

    addBookToList: function(book) {
      const list = document.querySelector('#book-list');
          
//Create a table row element
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.number}</td>
        <td>${book.read}</td>
        <td><a href="#" class="btn btn-danger btn-sm
        delete">X</a></td>
      `;
              
      list.appendChild(row);
    },

/*The deleteBook function removes a book from the UI when the delete button is clicked.*/

    deleteBook: function(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();   
      }
    },

/*The showAlert function displays an alert message on the UI. The message will stay visible
for 3 seconds before it is removed.*/

    showAlert: function(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // Make alert go away after 3 seconds
      setTimeout(() => div.remove(), 3000);
    },
        
/*The clearFields function clears the input fields of the form.*/

    clearFields: function() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#number').value = '';
      document.querySelector('#read').checked = false;
    }
  };
  
/*The getBooks function retrieves an array of books from the local storage.
If no books exist, it creates an empty array.*/ 

const Store = {
    getBooks: function() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
    },
  
/*The addBook function adds a book to the local storage. It takes the book object
as an argument, and pushes that object into an array of books.*/

    addBook: function(book) {
      const books = this.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    },
    
/*The removeBook function removes a book from the local storage. It takes the read
property of the book object as an argument and then searches the array of books for
the matching book. Once the book is found, it is removed from the array.*/
    removeBook: function(read) {
      const books = this.getBooks();
  
      books.forEach((book, index) => {
        if(book.read === read) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  };
  
/*The DOMContentLoaded event is triggered when the page has been loaded. It calls the 
UI.displayBooks function to display the books in the UI.*/

  document.addEventListener('DOMContentLoaded', () => {
    UI.displayBooks();
  });
  
//Event: Add a book
/*The submit event is triggered when the form is submitted. It calls the UI.addBookToList
function to add the book to the UI, the Store.addBook function to add the book to the local
storage, and the UI.showAlert and UI.clearFields functions to show a success message and clear
the form fields respectively.*/

  document.querySelector('#book-form').addEventListener('submit', (e) => {
//Prevent actual submit
    e.preventDefault();
    
//Get form values
/*This code is grabbing the values from the HTML elements with the ids title, author, number and 
read. The value property will grab the value of an input element, such as the value of a text field
or a dropdown.
The checked property will check if a checkbox is checked or not, and return a boolean (true or false).
The ternary operator (? :) then converts this boolean to a string (yes or no).*/

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const number = document.querySelector('#number').value;
    const read = document.querySelector('#read').checked ? 'yes' : 'no';
  
//Validation
    if(title === '' || author === '' || number === '') {
      UI.showAlert('Please fill all fields', 'danger');
    } else {
//Instantiate book
      const book = new Book(title, author, number, read);
  
//Add book to UI
      UI.addBookToList(book);
      
//Add book to store
      Store.addBook(book);
  
//Success message popup
      UI.showAlert('Book added to the list', 'success');
  
//Clear fields
      UI.clearFields();
    }
  });
 
/*This code adds an event listener to the element with the ID book-list.
When the event is triggered, it will call the UI.deleteBook()function to remove
the book from the user interface (UI). It then calls the Store.removeBook()
function to remove the book from the store. Finally, it calls the UI.showAlert()
function to show a success message that the book has been removed from the list.*/  

//Event: Remove a book

  document.querySelector('#book-list').addEventListener('click', (e) => {
//Removes book from the UI
    UI.deleteBook(e.target);
  
//Removes book from the Store
    const read = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(read);
  
//Book deleted message
    UI.showAlert('Book removed from the list', 'success');
  });

/*This code creates a Book constructor function which can be used to create book objects.
The Book constructor function takes four parameters - title, author, number and read.
These parameters are used to assign values to the properties of the book object.*/

  function Book(title, author, number, read) {
    this.title = title;
    this.author = author;
    this.number = number;
    this.read = read;
  }

