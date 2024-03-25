import Joi from "joi";

// Joi validation schema for page
export const pageValidator = Joi.object({
    index: Joi.number(),

    content: Joi.string(),
})
    .with('index', ['title', 'content']);

// Page interface
export interface Page {
    index: number;
    content: string;
}
