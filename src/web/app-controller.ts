import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam } from 'routing-controllers';
import {PonoLib} from "../lib";
import {Book} from "../lib/models/book.model";
import {DB_CONN_URL} from "../config/config";

@JsonController('/beers')
export class AppController {
    private ponoLib: PonoLib;

    constructor(
    ) {
        this.ponoLib = new PonoLib(DB_CONN_URL);
    }

    @Post()
    async addNewBeer(@Body() newBook: Book) {
        this.ponoLib.addBook(newBook);
    }
}
