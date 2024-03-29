export interface Page {
    content: string;
    pageNumber: number;
}

export interface NewBook {
    author: string;
    title: string;
    publicationDate: Date;
    pages: Page[];
}
