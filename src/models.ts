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

export interface ImportPayload {
    type: string;
    path: string;
}

export interface MessageResponse {
    error?: boolean;
    message: string;
}

