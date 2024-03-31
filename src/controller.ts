import {NewBook} from "./models";
import {PrismaClient} from "@prisma/client";
export class Controller {
    static async addBook(prisma: PrismaClient, newBook: NewBook): Promise<any> {
        await prisma.book.create({
            data: {
                ...newBook,
                publicationDate: new Date(newBook.publicationDate),
                pages: {
                    create: newBook.pages,
                }
            }
        });
    }
}
