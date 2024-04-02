export interface BookPriceFromAPI {
    bookId: number;
    price: number;
}

export class PriceApi {
    // create fake API to get price for a book with a timeInterval to fake the delay
    async getPrice(bookId: number): Promise<BookPriceFromAPI> {
        const randomDelay = this.getRandomFromRange(10, 1000);
        const randomPrice = this.getRandomFromRange(3, 50);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    bookId: bookId,
                    price: randomPrice
                });
            }, randomDelay);
        });
    }

    private getRandomFromRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
