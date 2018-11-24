let k = {}

let handler = {
    get: function (target, property, receiver) {

        return target.property;
    },
    set: function (target, property, value, receiver) {
        target.property=value
        return true;
    }
}

let proxy = new Proxy(k, handler);

proxy.a = 10;
console.log(proxy.a);
// console.log(proxy);