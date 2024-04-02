import {Book, Collection, Prisma, PrismaClient} from "@prisma/client";
import {MessageResponse} from "../models";

export class CollectionRepository {
    constructor(
        private prisma: PrismaClient
    ) {}

    async getCollection(collectionTitle: string): Promise<Collection> {
        return this.prisma.collection.findUnique({
            where: {
                title: collectionTitle,
            }
        });
    }

    async createCollection(title: string): Promise<Collection | MessageResponse> {
        return this.prisma.collection.create({
            data: {
                title,
            }
        });
    }
}
