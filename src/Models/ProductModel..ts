import { EventEmitter } from '../base/Event';

export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    description: string;
    image: string;
    inBasket?: boolean;
}

export class ProductModel {
    constructor(
        public data: IProduct = {
            id: '',
            title: '',
            price: null,
            category: '',
            description: '',
            image: '',
            inBasket: false
        },
        private events: EventEmitter
    ) { }

    get id() { return this.data.id; }
    get title() { return this.data.title; }
    get price() { return this.data.price; }
    get category() { return this.data.category; }
    get description() { return this.data.description; }
    get image() { return this.data.image; }

    toggleBasket() {
        if (this.data.inBasket) {
            this.removeFromBasket();
        } else {
            this.addToBasket();
        }
    }

    addToBasket() {
        if (!this.data.inBasket) {
            this.data.inBasket = true;
            this.events.emit('basket:add', this);
            this.events.emit('model:updated');
        }
    }

    removeFromBasket() {
        if (this.data.inBasket) {
            this.data.inBasket = false;
            this.events.emit('basket:remove', { id: this.id });
            this.events.emit('model:updated');
        }
    }

    isInBasket(): boolean {
        return this.data.inBasket || false;
    }

    onChange(callback: () => void) {
        this.events.on('model:updated', callback);
    }

    renderID(element: HTMLElement) {
        element.dataset.id = this.id;
        return element;
    }
}