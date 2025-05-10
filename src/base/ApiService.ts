import { IProduct } from "../Models/ProductModel.";
import { IOrder } from "../types";
import { CDN_URL } from "../utils/constants";

export class ApiService {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/weblarek/product`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки товаров: ${response.status}`);
            }
            const data = await response.json();
            return data.items.map((item: IProduct) => ({
                ...item,
                image: item.image ? `${CDN_URL}/${item.image}` : ''
            }));
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            throw error;
        }
    }

    async createOrder(order: IOrder): Promise<{ id: string, total: number }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/weblarek/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при создании заказа');
            }

            return response.json();
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}