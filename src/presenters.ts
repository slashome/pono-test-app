import {Book} from "@prisma/client";

export function bookPresenter(book: Book) {
    return {
        title: book.title,
        publicationDate: formatDate(book.publicationDate),
    }
}

export function fullBookPresenter(book: Book) {
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
    console.log('DATE', dateString);
    return formatter.format(date);
}
