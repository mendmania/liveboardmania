import { EXCHANGE } from "~/constants/exchangeRate";

export const getFormatedPurse = (purse) => {
    let amount = purse.amount;
    let currency = purse.currency;

    if (purse.currency === 'GBP') {
        amount = (purse.amount * EXCHANGE.GBPtoEURO).toFixed(2);
        currency = 'EUR';
    }

    return `${amount} ${currency}`;
};