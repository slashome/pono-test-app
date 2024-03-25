import {Book, bookValidator} from "./models/book.model";

export class PonoLib {
  constructor(dbConnection: string) {
    console.log('PonoLib constructor');
  }

  addBook(book: Book) {
    bookValidator.validate(book);
    AddBook(book);
  }
}



function AddBook(book: Book) {
}
