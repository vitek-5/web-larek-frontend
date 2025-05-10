import { EventEmitter } from "../base/Event";
import { BaseView } from "../base/View";
import { OrderFormViewData } from "../types";
import { ensureAllElements, ensureElement } from "../utils/utils";

export class OrderFormView extends BaseView<OrderFormViewData> {
    private paymentButtons: HTMLButtonElement[];
    private addressInput: HTMLInputElement;
    private nextButton: HTMLButtonElement;
    private errorContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', container);
        this.errorContainer = ensureElement('.form__errors', container);

        this.setupEventHandlers();
    }

    getData(): OrderFormViewData {
        return {
            payment: this.paymentButtons.find(b => b.classList.contains('button_alt-active'))?.name as 'card' | 'cash' || '',
            address: this.addressInput.value,
            email: '',
            phone: '',
            valid: this.nextButton.disabled === false,
            errors: {}
        };
    }

    private setupEventHandlers() {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { name: button.name as 'card' | 'cash' });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order.address:change', { value: this.addressInput.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:next');
        });
    }

    render(data: OrderFormViewData): HTMLElement {
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === data.payment);
        });

        this.addressInput.value = data.address || '';
        this.nextButton.disabled = !data.valid;

        const errorMessages = Object.values(data.errors).filter(Boolean);
        this.setText(this.errorContainer, errorMessages.join('; '));

        return this.container;
    }
}