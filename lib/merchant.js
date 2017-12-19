"use strict";
const crypto = require("crypto");
const {promisify} = require('util');

/*
    @succes_url: https://proexchanger.net/payments/check/success/payeer
    @fail_url: https://proexchanger.net/payments/check/error/payeer
    @status_url: https://proexchanger.net/payments/check/status/payeer
 */
class Merchant {
    constructor(m_shop, m_key, options) {
        this.name = 'payeer';
        if (!m_shop) throw Error('m_shop is not correct (Merchant settings ID:)');
        if (!m_key) throw Error('m_key is not correct (Merchant settings Secret key:)');

        if (!options || !options.db) {
            //fs
            this.db = null;
            this.db_type = 'fs';

        } else {
            this.db = options.db;
            this.db_mongoose = require("mongoose");
            this.db_type = 'mongodb';
            //mongodb
        }

        if (options && options.express) {
            //create express route
        }
        this.debug = false;
        if (options && options.debug === true)
            this.debug = true;
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'constructor', m_shop, m_key);


        this.m_shop = m_shop;
        this.m_key = m_key;
    }


     checkOptions(options) {
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'checkOptions', options);

        if (!options.m_amount) return Promise.reject('m_amount undefined');
        if (isNaN(+options.m_amount)) return Promise.reject('m_amount NaN');
        if (+options.m_amount < 0) return Promise.reject('m_amount < 0');
        if (!options.m_orderid) return Promise.reject('m_orderid undefined');
        if (!options.m_curr) return Promise.reject('m_curr undefined');
        if (['USD', 'EUR', 'RUB'].indexOf(options.m_curr.toUpperCase()) === -1) return Promise.reject('m_curr is not valid [USD, EUR, RUB]');
        return Promise.resolve(options);
    }

    async formaterData(options) {

        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'formaterData in', options);
        let checkOptions = await this.checkOptions(options);
        if (!checkOptions) {
            console.error('[Pay]->Merchant->' + this.name + ', Error function getHash! return checkOptions:', checkOptions);
            return Promise.reject('[Pay]->Merchant->' + this.name + ', Error function getHash! return checkOptions#1');
        }
        let desc = '';
        if (options.m_desc)
            desc = new Buffer(options.m_desc).toString('base64');
        let result = {
            m_shop: this.m_shop,
            m_key: this.m_key,
            m_orderid: options.m_orderid,
            m_amount: (+options.m_amount).toFixed(2),
            m_curr: options.m_curr.toUpperCase(),
            m_desc: desc
        };
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'formaterData result', result);
        return Promise.resolve(result);
    }

    async getHash(options) {
        let data = await this.formaterData(options);
        if (data === null) {
            console.error('getHash null ^^^');
            return Promise.reject('[Pay]->Merchant->' + this.name + ', Error function getHash! return checkOptions:'+JSON.stringify(options));


        }
        let string_hash = data.m_shop + ':' + data.m_orderid + ':' + data.m_amount + ':' + data.m_curr + ':' + data.m_desc + ':' + data.m_key;
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'string_to_hash', string_hash);
        let sha256 = crypto.createHash('sha256').update(string_hash).digest('hex').toUpperCase();
        if (this.debug) console.log('[Pay]->Merchant->' + this.name + ',' + 'hash_sha256', sha256);
        return sha256;

    }

    getOrderId(options) {
        return new Promise((resolve, reject) => {
            options.m_orderid = new Date().getTime();
            resolve(options);
        });
    }

    async createPaymet(options) {
        let form = await this.formaterData(options);
        let hash = await this.getHash(options);
        if (!options.m_orderid)
            options.m_orderid = await this.getOrderId(options);
        let data = {
            m_shop: form.m_shop,
            m_orderid: options.m_orderid,
            m_amount: form.m_amount,
            m_curr: form.m_curr,
            m_desc: form.m_desc,
            m_sign: hash
        };
        let res = {action: 'redirect', metod: 'post', data: data, url: 'https://payeer.com/merchant/'};
        return res;
    }

    checkPayment(options) {
        return options;
    }


}

// console.log(h);

module.exports = Merchant;