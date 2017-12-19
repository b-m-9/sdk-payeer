### Installation
```
npm install --save lib-payeer
```
require module
```javascript
const Payeer = require('lib-payeer');
```
## Merchant Documentation:
Init
```javascript
const config_id = 0;
const config_secret = 0;
const payeerMerchant = new Payeer.merchant(config_id, config_secret, {debug: false});
```
### Create payment
```javascript

payeerMerchant
    .getOrderId({
        m_amount: 10.121,
        m_curr: 'usd',
        m_desc: 'Hello World'
    })
    .then(res => {
        return payeerMerchant.formaterData(res);
    })
    .then(res => {
        return payeerMerchant.createPaymet(res)
    })
    .then(console.log)
    .catch((error) => {
        console.error('Create Error,', error);
    });

```
### Browse function:
```javascript
function payment(param) {
    var method = param.method || "post";
    var form = document.createElement("form");
    form.setAttribute("method", param.method);
    form.setAttribute("action", param.url);
    for (var key in param.data) {
        if (param.data.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", param.data[key]);

            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}
```

## API Documentation:

```javascript
const config_api_account = '';
const config_api_id = '63432005';
const config_api_secret = 'secret';
const payeer = new Payeer.api(config_api_account, config_api_id,config_api_secret, {});

```
methods:
```javascript
payeer.getBalance().then(console.log).catch(console.error);
```

```javascript
payeer.getExchangeRate().then(console.log).catch(console.error);
```

```javascript
payeer.checkAccountNumber('P13159502').then(console.log).catch(console.error);
```

```javascript
payeer.getPaySystems().then(console.log).catch(console.error);
```

```javascript
payeer.transfer({curIn:'USD',curOut:'USD',to:'P13159502',sum:1,protectCode:'12345'}).then(console.log).catch(console.error);

```