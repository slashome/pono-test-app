import {Book, BookSchema, NewBook, PageSchema} from "./models";
import mongoose from "mongoose";

export class Controller {
    static async addBook(mongoose: mongoose.Connection, newBook: NewBook): Promise<any> {
        console.log('newBook', newBook);
        const pages = PageSchema.collection.insertMany(newBook.pages);
        console.log('pages', pages);
        return pages;
        // const book = new BookSchema({
        //     ...newBook,
        //     publicationDate: new Date(newBook.publicationDate),
        //     resume: null,
        // });
        // return book.save();
    }
}
