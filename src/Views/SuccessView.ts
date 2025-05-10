import { EventEmitter } from "../base/Event";
import { BaseView } from "../base/View";
import { ensureElement } from "../utils/utils";

interface SuccessData {
    total: number;
}

export class SuccessView extends BaseView<SuccessData> {
    protected description: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.description = ensureElement('.order-success__description', container);
        this.closeButton = ensureElement('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            events.emit('modal:close');
        });
    }

    render(data: SuccessData): HTMLElement {
        this.setText(this.description, `Списано ${data.total} синапсов`);
        return this.container;
    }
}