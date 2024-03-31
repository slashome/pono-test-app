

export interface Page {
    content: string;
    pageNumber: number;
}

export interface NewBook {
    author: string;
    title: string;
    publicationDate: Date;
    pages: Page[];
    resume?: string;
}

export interface Book extends NewBook {
    // _id: ObjectId;
}

// export const PageSchema = mongoose.model('Page', new mongoose.Schema({
//     content: String,
//     pageNumber: Number,
// }));
//
// export const BookSchema = mongoose.model('Book', new mongoose.Schema({
//     author: String,
//     title: String,
//     publicationDate: Date,
//     pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
//     resume: String,
// }));
