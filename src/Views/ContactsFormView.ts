import { EventEmitter } from "../base/Event";
import { BaseView } from "../base/View";
import { ContactsFormViewData } from "../types";
import { ensureElement } from "../utils/utils";

export class ContactsFormView extends BaseView<ContactsFormViewData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private errorContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement('.form__errors', container);

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.emailInput.addEventListener('input', () => {
            this.events.emit('order.email:change', { value: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('order.phone:change', { value: this.phoneInput.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
    }

    render(data: ContactsFormViewData): HTMLElement {
        this.emailInput.value = data.email || '';
        this.phoneInput.value = data.phone || '';
        this.submitButton.disabled = !data.valid;

        const errorMessages = Object.values(data.errors).filter(Boolean);
        this.setText(this.errorContainer, errorMessages.join('; '));

        return this.container;
    }
}