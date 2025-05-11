import { EventEmitter } from "../base/Event";
import { AppState } from "../Models/AppState";
import { BasketView } from "../Views/BasketView";
import { BasketItemView } from "../Views/BasketItemView";
import { cloneTemplate } from "../utils/utils";

export class BasketPresenter {
    constructor(
        private state: AppState,
        private view: BasketView,
        private events: EventEmitter
    ) {
        this.initialize();
    }

    private initialize() {
        this.events.on('basket:changed', () => this.updateBasket());
        this.view.onCheckout(() => this.events.emit('order:start'));
    }

    private updateBasket() {
        // Преобразуем ProductModel[] в HTMLElement[]
        const basketItems = this.state.getBasketItems().map((item, index) => {
            const element = cloneTemplate('#card-basket');
            const view = new BasketItemView(element, this.events);
            return view.render({
                ...item.data,
                index
            });
        });

        this.view.render({
            items: basketItems, // Теперь это HTMLElement[]
            total: this.state.getBasketTotal()
        });
    }
}