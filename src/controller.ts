import {NewBook} from "./models";
export class Controller {
    static async addBook(newBook: NewBook): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(newBook);
        });

        // console.log('newBook', newBook);
//        const pages = PageSchema.collection.insertMany(newBook.pages);
//         console.log('pages', pages);
//         return pages;
        // const book = new BookSchema({
        //     ...newBook,
        //     publicationDate: new Date(newBook.publicationDate),
        //     resume: null,
        // });
        // return book.save();
    }
}
