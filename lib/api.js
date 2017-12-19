"use strict";
const crypto = require("crypto");
const rp = require('request-promise');

class API {
    constructor(account, apiId, apiPass, options) {
        this.name = 'payeer';
        this.url = 'https://payeer.com/ajax/api/api.php';
        this.agent = 'Mozilla/5.0 (Windows NT 6.1; rv:12.0) Gecko/20100101 Firefox/12.0';
        if (!account) throw Error('account is not correct (Merchant settings ID:)');
        if (!apiId) throw Error('apiId is not correct (Merchant settings Secret key:)');
        if (!apiPass) throw Error('apiPass is not correct (Merchant settings Secret key:)');

        this.account = account;
        this.apiId = apiId;
        this.apiPass = apiPass;

        this.language = 'ru';
        if (options && options.language) {
            this.language = options.language
        }
        this.debug = false;
        if (options && options.debug === true)
            this.debug = true;
        if (options && options.shopId)
            this.shopId = options.shopId;
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'constructor', this.account, this.apiId, this.apiPass);

    }

    async update() {

    }


    getResponse(options) {
        if (!options) {
            console.error('getResponse', options)
        }
        let opt = {
            method: 'POST',
            uri: this.url,
            form: {
                ...options,
                account: this.account,
                apiId: this.apiId,
                apiPass: this.apiPass
            },
            headers: {
                'User-Agent': this.agent
            },
            json: true // Automatically stringifies the body to JSON
        };
        return rp(opt).then(res => {
            if (!res.auth_error)
                return Promise.reject('Error auth API:' + this.name);
            else return Promise.resolve(res);
        });
    }

    getBalance(_type) {
        return payeer.getResponse({action: 'balance'}).then(res => {
            let balance = {};
            for (let type in res.balance) {
                if (_type) {
                    if (type === _type)
                        balance[type] = +res.balance[type].DOSTUPNO;
                } else
                    balance[type] = +res.balance[type].DOSTUPNO;
            }
            return balance;
        })
    }

    getExchangeRate() {
        return payeer.getResponse({action: 'getExchangeRate'}).then(res => {
            return res.rate;
        })
    }

    checkAccountNumber(numberAccount) {
        return payeer.getResponse({action: 'checkUser', user: numberAccount}).then(res => {
            return !res.errors.length;
        })
    }

    getPaySystems() {
        return payeer.getResponse({action: 'getPaySystems'}).then(res => {
            let data = [];
            for (let ids in res.list) {
                res.list[ids].ids = ids;
                data.push(res.list[ids]);
            }
            return data;
        })
    }

    transfer(param) {
        /*
            @param.curIn - USD
            @param.curOut - USD
            @param.sumIn - 1
            OR
            @param.sumOut - 1
            @param.to - P1000000 or email
            @param.comment - desc
            @param.protectCode - number(5)

         */
        if (!param) return Promise.reject('error param');
        if (!param.curIn) return Promise.reject('error param.curIn');
        if (!param.curOut) return Promise.reject('error param.curOut');
        if (!param.to) return Promise.reject('error param.to');
        if (!param.sum && isNaN(+param.sum) && +param.sum < 1) return Promise.reject('error !param.sumIn && isNaN(param.sumIn) && param.sumIn >= 1');

        if (param.protectCode && param.protectCode.length === 5) {
            param.protect = 'Y';
            param.protectPeriod = '3';
        } else if (param.protectCode && param.protectCode.length !== 5) return Promise.reject('error param.protect_code !== 5');
        return payeer.getResponse({
            ...param,
            action: 'transfer'
        }).then(res => {
            return res;
        })
    }

    getShopOrderInfo(orderId) {
        if (!this.shopId) return Promise.reject('this.shopId is not active constructor');
        return payeer.getResponse({action: 'getShopOrderInfo', shopId: this.shopId, orderId: orderId}).then(res => {
            return res;
        })
    }

}


module.exports = API;