import { Product } from '@prisma/client';
import prisma from '../client'

/**
 * Get all products in a store
 */
const getProductsByStoreId = async (storeId: number): Promise<Product[]> => {
    return prisma.product.findMany({
        where: {
            storeProducts: {
                every: {
                    store_id: storeId
                }
            }
        }
    })
}

export default {
    getProductsByStoreId
}