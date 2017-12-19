## Init class (lib-payeer):
```javascript
const Payeer = require('lib-payeer');
const config_id = 0;
const config_secret = 0;
const payeerMerchant = new Payeer.merchant(config_id, config_secret, {debug: false});
```
## Create payment
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
##Browse function:
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

