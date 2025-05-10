import { ApiService } from "../base/ApiService";
import { EventEmitter } from "../base/Event";
import { AppState } from "../Models/AppState";
import { IOrderForm, OrderFormViewData, ContactsFormViewData, FormErrors } from "../types";
import { OrderFormView } from "../Views/OrderFormView";
import { ContactsFormView } from "../Views/ContactsFormView";

export class OrderFormsPresenter {
    private orderData: IOrderForm = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };
    private isOrderValid = false;
    private isContactsValid = false;

    constructor(
        private state: AppState,
        private orderFormView: OrderFormView,
        private contactsFormView: ContactsFormView,
        private events: EventEmitter,
        private api: ApiService
    ) {
        this.initialize();
    }

    private initialize() {
        this.setupOrderFormHandlers();
        this.setupContactsFormHandlers();
    }

    private setupOrderFormHandlers() {
        this.events.on('order.payment:change', (event: { name: 'card' | 'cash' }) => {
            this.orderData.payment = event.name;
            this.validateOrderForm();
        });

        this.events.on('order.address:change', (event: { value: string }) => {
            this.orderData.address = event.value;
            this.validateOrderForm();
        });

        this.events.on('order:next', () => {
            if (this.isOrderValid) {
                this.events.emit('contacts:open');
            }
        });
    }

    private setupContactsFormHandlers() {
        this.events.on('order.email:change', (event: { value: string }) => {
            this.orderData.email = event.value;
            this.validateContactsForm();
        });

        this.events.on('order.phone:change', (event: { value: string }) => {
            this.orderData.phone = event.value;
            this.validateContactsForm();
        });

        this.events.on('order:submit', () => {
            if (this.isOrderValid && this.isContactsValid) {
                this.submitOrder();
            }
        });
    }

    private validateOrderForm(): boolean {
        const errors: FormErrors = {};

        if (!this.orderData.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.orderData.address) errors.address = 'Укажите адрес доставки';

        this.isOrderValid = Object.keys(errors).length === 0;

        const viewData: OrderFormViewData = {
            ...this.orderData,
            valid: this.isOrderValid,
            errors
        };

        this.orderFormView.render(viewData);

        return this.isOrderValid;
    }

    private validateContactsForm(): boolean {
        const errors: FormErrors = {};

        if (!this.validateEmail(this.orderData.email)) {
            errors.email = 'Введите корректный email';
        }
        if (!this.validatePhone(this.orderData.phone)) {
            errors.phone = 'Введите корректный телефон';
        }

        this.isContactsValid = Object.keys(errors).length === 0;

        const viewData: ContactsFormViewData = {
            ...this.orderData,
            valid: this.isContactsValid,
            errors
        };

        this.contactsFormView.render(viewData);

        return this.isContactsValid;
    }

    private validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private validatePhone(phone: string): boolean {
        return /^\+?[\d\s()-]{10,}$/.test(phone);
    }

    private async submitOrder() {
        try {
            const order = {
                ...this.orderData,
                items: this.state.getBasketItems()
                    .filter(item => item.price !== null) // Фильтруем товары без цены
                    .map(item => item.id),
                total: this.state.getBasketTotal()
            };

            const result = await this.api.createOrder(order);
            this.events.emit('order:success', {
                orderId: result.id,
                total: order.total // Передаем сумму заказа
            });
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            this.events.emit('order:error', {
                message: error instanceof Error ? error.message : 'Неизвестная ошибка'
            });
        }
    }
}