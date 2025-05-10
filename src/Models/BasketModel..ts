import { EventEmitter } from "../base/Event";
import { BaseModel } from "../base/Model";
import { ProductModel } from "./ProductModel.";

interface BasketData {
    items: ProductModel[];
    total: number;
}

export class BasketModel extends BaseModel<BasketData> {
    constructor(events: EventEmitter) {
        super({ items: [], total: 0 }, events);
    }

    addItem(product: ProductModel) {
        if (!this.data.items.some(item => item.id === product.id)) {
            this.data.items.push(product);
            this.calculateTotal();
            this.emit('basket:changed');
        }
    }

    removeItem(id: string) {
        this.data.items = this.data.items.filter(item => item.id !== id);
        this.calculateTotal();
        this.emit('basket:changed');
    }

    clear() {
        this.data.items = [];
        this.data.total = 0;
        this.emit('basket:changed');
    }

    private calculateTotal() {
        this.data.total = this.data.items.reduce(
            (sum, item) => sum + (item.price || 0), 0
        );
    }
}