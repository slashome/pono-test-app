import {Book, Page} from "@prisma/client";

export function bookPresenter(book: Book) {
    let bookPrice;
    if (book.price) {
        bookPrice = {price: book.price};
    }
    return {
        title: book.title,
        publicationDate: formatDate(book.publicationDate),
        ...bookPrice,
    }
}

export function fullBookPresenter(book: Book) {
    // order pages by pageNumber
    book.pages = book.pages.sort((a: Page, b: Page) => a.pageNumber - b.pageNumber);
    return {
        ...book,
        publicationDate: formatDate(book.publicationDate),
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-EN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(date);
}
