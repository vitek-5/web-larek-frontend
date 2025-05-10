export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const ProductCategories: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard'
};

export const Events = {
    CARD_SELECT: 'card:select',
    BASKET_ADD: 'basket:add',
    BASKET_REMOVE: 'basket:remove',
    BASKET_OPEN: 'basket:open',
    ORDER_SUBMIT: 'order:submit',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close'
} as const;