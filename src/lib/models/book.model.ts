import Joi from "joi";
import {Page} from "./page.model";

// Joi validation schema for book
export const bookValidator = Joi.object({
    uuid: Joi.string().guid(),

    title: Joi.string()
        .max(255),

    author: Joi.string(),

    publicationDate: Joi.date().iso(),

    pages: Joi.object()
        .custom((pages: Page[], helpers) => {
            const duplicates = pages.filter((item: Page, index: number) => pages.indexOf(item) !== index);

            if (duplicates.length > 0) {
                const err =  helpers.error('array.unique');
                err.message = 'Pages must be unique';
                return err;
            }

            // check if pages missing ? missing pages can be blank pages ?
            return pages;
        }),
})
    .with('uuid', ['title', 'author', 'publicationDate']);

// Book interface
export interface Book {
    uuid: string;
    title: string;
    author: string;
    publicationDate: Date;
    pages: Page[];
}
