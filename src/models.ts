export interface NewPage {
    content: string;
    pageNumber: number;
}

export interface NewBook {
    author: string;
    title: string;
    publicationDate: Date;
    pages: NewPage[];
}

export interface Pagination {
    skip: number;
    take: number;
}
