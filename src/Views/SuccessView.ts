import { BaseView } from "../base/View";
import { ensureElement } from "../utils/utils";

interface SuccessData {
    total: number;
}

export class SuccessView extends BaseView<SuccessData> {
    constructor(container: HTMLElement) { // Только 1 параметр
        super(container);

        const successButton = ensureElement('.order-success__close', container);
        successButton.addEventListener('click', () => {
            container.dispatchEvent(new Event('success:close', { bubbles: true }));
        });
    }

    render(data: SuccessData): HTMLElement {
        const description = ensureElement('.order-success__description', this.container);
        description.textContent = `Списано ${data.total} синапсов`;
        return this.container;
    }
}