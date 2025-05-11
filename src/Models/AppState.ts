import { EventEmitter } from "../base/Event";
import { ProductModel } from "./ProductModel.";

export class AppState {
    private basket: ProductModel[] = [];
    private catalog: ProductModel[] = [];

    constructor(private events: EventEmitter) {
        events.on('basket:add', this.addToBasket.bind(this));
        events.on('basket:remove', this.removeFromBasket.bind(this));
    }

    getBasketItems(): ProductModel[] {
        return this.basket;
    }

    clearBasket() {
        this.basket.forEach(item => {
            if (item && item.data) {
                item.data.inBasket = false;
            }
        });
        this.basket = [];
        this.events.emit('basket:changed');
        this.events.emit('catalog:changed', this.catalog);
    }

    getCatalog(): ProductModel[] {
        return this.catalog;
    }

    isInBasket(id: string): boolean {
        return this.basket.some(item => item.id === id);
    }

    getBasketCount(): number {
        return this.basket.length;
    }

    addToBasket(product: ProductModel) {
        // Добавляем проверку
        if (!product) {
            console.error('Attempt to add undefined product to basket');
            return;
        }

        if (!this.isInBasket(product.id)) {
            // Добавляем проверку на существование data
            if (product.data) {
                product.data.inBasket = true;
            }
            this.basket.push(product);
            this.events.emit('basket:changed', this.basket);
            this.events.emit('catalog:changed', this.catalog);
        }
    }

    removeFromBasket(event: { id: string }) {  // Ожидаем объект с id
        const id = event.id;
        const product = this.catalog.find(p => p.id === id);
        if (product) {
            product.data.inBasket = false;
        }

        this.basket = this.basket.filter(item => item.id !== id);
        this.events.emit('basket:changed', this.basket);
        this.events.emit('catalog:changed', this.catalog);
    }

    setCatalog(products: ProductModel[]) {
        this.catalog = products;
        this.events.emit('catalog:changed', this.catalog);
    }

    getBasketTotal() {
        return this.basket.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}