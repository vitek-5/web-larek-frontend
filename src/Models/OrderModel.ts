import { EventEmitter } from "../base/Event";
import { BaseModel } from "../base/Model";
import { IOrderForm } from "../types";

export class OrderModel extends BaseModel<IOrderForm> {
    constructor(events: EventEmitter) {
        super({
            payment: '',
            address: '',
            email: '',
            phone: ''
        }, events);
    }

    validate(): boolean {
        const errors = [];
        if (!this.data.payment) errors.push('payment');
        if (!this.data.address) errors.push('address');
        if (!this.data.email) errors.push('email');
        if (!this.data.phone) errors.push('phone');

        this.emit('order:validation', { 
            valid: errors.length === 0,
            errors 
        });
        return errors.length === 0;
    }
}