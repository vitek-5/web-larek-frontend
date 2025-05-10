import { EventEmitter } from "../base/Event";
import { AppState } from "../Models/AppState";
import { BasketView } from "../Views/BasketView";

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
        this.view.render({
            items: this.state.getBasketItems(),
            total: this.state.getBasketTotal()
        });
    }
}