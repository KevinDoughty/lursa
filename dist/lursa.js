!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Lursa=e():t.Lursa=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e),r.d(e,"lursa",(function(){return u})),r.d(e,"archive",(function(){return y})),r.d(e,"unarchive",(function(){return g}));var n=r(1),o="23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",i=o.length,u=function(t){return{archive:function(e){return y(e,t)},unarchive:function(e){return g(e,t)}}};function a(t){return void 0===t}function p(t){return!a(t)}function s(t){var e=t.value;return a(e)&&(e=t.default),e}function f(t,e){var r=t.choices;return!e&&a(r)&&(r=t.default),a(r)&&(r=t.values),a(r)&&(r=[]),r}function l(t){var e=t.type;if("bool"===e)return 1;if("group"===e)return 0;if("enum"===e||"chooser"===e){var r=f(t,!0);if(a(r))return 0;for(var n=r.length,o=0;Math.pow(2,o)<n;)o++;return o}if(p(t.size))return t.size;var i=t.min,u=t.max,s=t.wrap;if("int"===e){if(p(i)&&p(u)){var l=u-i;if(s&&l--,l<1)return 0;for(var v=0;Math.pow(2,v)<l;)v++;return v}return 0}return"float"===e&&p(i)&&p(u)?u-i:0}function v(t){var e={};return function t(e,r){if(Array.isArray(e))e.forEach((function(e){t(e,r)}));else{var n=e.id;if("group"===e.type||"chooser"===e.type){var o=f(e,"chooser"===e.type);r[n]=Object.assign({value:e.default},e),o.forEach((function(e){t(e,r)}))}else r[n]=Object.assign({value:e.default},e)}}(t,e),e}function h(t,e){if(a(t))return 0;var r=e.type;if("bool"===r)return t?1:0;if("enum"===r)return s(e);var n=e.min,o=e.max,i=l(e);if("int"===r){if(a(i))return 0;var u=Math.pow(2,i)-1,f=n,v=o;if(p(n)&&p(o)?u=o-n:p(n)?v=n+u:p(o)?f=o-u:(f=0,v=u),e.wrap){for(;t>=v;)t-=u;for(;t<f;)t+=u}else t=Math.max(f,t),t=Math.min(v,t);return t-=f,Math.round(t)}if("float"===r){if(a(i))return 0;var h=Math.pow(2,i)-1;if(p(n)&&p(o)){var c=o-n;if(e.wrap){for(;t>=o;)t-=c;for(;t<n;)t+=c}else t=Math.max(n,t),t=Math.min(o,t);t=(t-n)/c*h}else p(n)?t-=n:p(o)&&(t=t-o-h);return Math.round(t)}return t}var c=function(t,e,r){var n={};return Object.keys(t).forEach((function(e){var o=t[e],i=r[e];p(i)&&(o=function(t,e){var r=e.type,n=e.min,o=e.max,i=e.size;if("bool"===r)return!!t;if("int"===r){if(a(i))return 0;var u=Math.pow(2,i)-1;if(p(n))t=n+t;else if(p(o)){t=o-u+t}}else if("float"===r){if(a(i))return 0;var s=Math.pow(2,i)-1;if(p(n)&&p(o))t=n+(t=t/s*(o-n));else if(p(n))t=n+t;else if(p(o)){t=o-s+t}p(e.fixed)&&(t=1*t.toFixed(e.fixed))}else if("enum"===r){var f=e.values;return a(f)||!f.length?null:(a(t)&&(t=0),t<0&&(t=0),t>=f.length&&(t=f.length-1),f[t])}return a(t)&&(t=0),t}(o,i)),n[e]=o})),n},y=function(t,e){if(a(e))throw new Error("no schema to use for archiving");var r=v(e);(a(t=function(t,e,r){var n={};return Object.keys(t).forEach((function(e){var o=t[e],i=r[e];p(i)&&(o=h(o,i)),n[e]=o})),n}(t,0,r))||null===t)&&(t={}),Object.keys(t).forEach((function(e){r[e]&&(r[e].value=t[e])}));for(var u=function t(e,r,o,i){var u;if(Array.isArray(e))u=e;else{u=f(e);var a=s(e);"chooser"===e.type&&(a=u.indexOf(a))<0&&(a=0);var p=l(e);if(p){var v=Math.pow(2,p)-1;if("bool"===e.type){for(;a<0;)a+=2;for(;a>1;)a-=2}else if("int"===e.type)if(e.wrap){for(;a<0;)a+=v;for(;a>=v;)a-=v}else a<0&&(a=0),a>v&&(a=v);else if("float"===e.type)if(e.wrap){for(;a<0;)a+=v;for(;a>=v;)a-=v}else a<0&&(a=0),a>v&&(a=v);var h=n(a).shiftLeft(o);i=n(i.or(h)),o+=p}}return u.forEach((function(e){var n=t(e.id,r,o,i);i=n.number,o=n.current})),{current:o,number:i}}(e,r,0,n()).number,c="";u.greater(0);){var y=n(u);c=o.charAt(y.mod(i))+c,u=n(u.divide(i))}return c};var g=function(t,e){if(a(e))throw new Error("no schema to use for unarchiving");var r=v(e);(a(t)||null===t)&&(t="");for(var u=t.length,p=n(),y=0;y<u;y++)p=n(p.times(i).plus(o.indexOf(t.charAt(y))));var g={};return function t(e,r,o,i,u){var p=[];if(Array.isArray(r))p=r;else if("group"===r.type)p=f(r);else{var v=l(r);if(v){var c=a(u)?function(t){return h(s(t),t)}(r):n(u).shiftRight(i).and(Math.pow(2,v)-1).toJSNumber();if(i+=v,"chooser"===r.type){o[r.id]=c;var y=f(r,!0);if(c>=0&&c<y.length){var g=y[c];p.push(g)}}else o[r.id]=c}}return p.forEach((function(r){i=t(e,r,o,i,u)})),i}(r,e,g,0,u?p:void 0),c(g,0,r)}},function(t,e,r){(function(t){var n,o=function(t){"use strict";var e=9007199254740992,r=f(e),n="function"==typeof BigInt;function i(t,e,r,n){return void 0===t?i[0]:void 0!==e&&(10!=+e||r)?z(t,e,r,n):F(t)}function u(t,e){this.value=t,this.sign=e,this.isSmall=!1}function a(t){this.value=t,this.sign=t<0,this.isSmall=!0}function p(t){this.value=t}function s(t){return-e<t&&t<e}function f(t){return t<1e7?[t]:t<1e14?[t%1e7,Math.floor(t/1e7)]:[t%1e7,Math.floor(t/1e7)%1e7,Math.floor(t/1e14)]}function l(t){v(t);var e=t.length;if(e<4&&x(t,r)<0)switch(e){case 0:return 0;case 1:return t[0];case 2:return t[0]+1e7*t[1];default:return t[0]+1e7*(t[1]+1e7*t[2])}return t}function v(t){for(var e=t.length;0===t[--e];);t.length=e+1}function h(t){for(var e=new Array(t),r=-1;++r<t;)e[r]=0;return e}function c(t){return t>0?Math.floor(t):Math.ceil(t)}function y(t,e){var r,n,o=t.length,i=e.length,u=new Array(o),a=0;for(n=0;n<i;n++)a=(r=t[n]+e[n]+a)>=1e7?1:0,u[n]=r-1e7*a;for(;n<o;)a=1e7===(r=t[n]+a)?1:0,u[n++]=r-1e7*a;return a>0&&u.push(a),u}function g(t,e){return t.length>=e.length?y(t,e):y(e,t)}function d(t,e){var r,n,o=t.length,i=new Array(o);for(n=0;n<o;n++)r=t[n]-1e7+e,e=Math.floor(r/1e7),i[n]=r-1e7*e,e+=1;for(;e>0;)i[n++]=e%1e7,e=Math.floor(e/1e7);return i}function m(t,e){var r,n,o=t.length,i=e.length,u=new Array(o),a=0;for(r=0;r<i;r++)(n=t[r]-a-e[r])<0?(n+=1e7,a=1):a=0,u[r]=n;for(r=i;r<o;r++){if(!((n=t[r]-a)<0)){u[r++]=n;break}n+=1e7,u[r]=n}for(;r<o;r++)u[r]=t[r];return v(u),u}function w(t,e,r){var n,o,i=t.length,p=new Array(i),s=-e;for(n=0;n<i;n++)o=t[n]+s,s=Math.floor(o/1e7),o%=1e7,p[n]=o<0?o+1e7:o;return"number"==typeof(p=l(p))?(r&&(p=-p),new a(p)):new u(p,r)}function b(t,e){var r,n,o,i,u=t.length,a=e.length,p=h(u+a);for(o=0;o<u;++o){i=t[o];for(var s=0;s<a;++s)r=i*e[s]+p[o+s],n=Math.floor(r/1e7),p[o+s]=r-1e7*n,p[o+s+1]+=n}return v(p),p}function M(t,e){var r,n,o=t.length,i=new Array(o),u=0;for(n=0;n<o;n++)r=t[n]*e+u,u=Math.floor(r/1e7),i[n]=r-1e7*u;for(;u>0;)i[n++]=u%1e7,u=Math.floor(u/1e7);return i}function S(t,e){for(var r=[];e-- >0;)r.push(0);return r.concat(t)}function E(t,e,r){return new u(t<1e7?M(e,t):b(e,f(t)),r)}function q(t){var e,r,n,o,i=t.length,u=h(i+i);for(n=0;n<i;n++){r=0-(o=t[n])*o;for(var a=n;a<i;a++)e=o*t[a]*2+u[n+a]+r,r=Math.floor(e/1e7),u[n+a]=e-1e7*r;u[n+i]=r}return v(u),u}function O(t,e){var r,n,o,i,u=t.length,a=h(u);for(o=0,r=u-1;r>=0;--r)o=(i=1e7*o+t[r])-(n=c(i/e))*e,a[r]=0|n;return[a,0|o]}function N(t,e){var r,o=F(e);if(n)return[new p(t.value/o.value),new p(t.value%o.value)];var s,y=t.value,g=o.value;if(0===g)throw new Error("Cannot divide by zero");if(t.isSmall)return o.isSmall?[new a(c(y/g)),new a(y%g)]:[i[0],t];if(o.isSmall){if(1===g)return[t,i[0]];if(-1==g)return[t.negate(),i[0]];var d=Math.abs(g);if(d<1e7){s=l((r=O(y,d))[0]);var w=r[1];return t.sign&&(w=-w),"number"==typeof s?(t.sign!==o.sign&&(s=-s),[new a(s),new a(w)]):[new u(s,t.sign!==o.sign),new a(w)]}g=f(d)}var b=x(y,g);if(-1===b)return[i[0],t];if(0===b)return[i[t.sign===o.sign?1:-1],i[0]];s=(r=y.length+g.length<=200?function(t,e){var r,n,o,i,u,a,p,s=t.length,f=e.length,v=h(e.length),c=e[f-1],y=Math.ceil(1e7/(2*c)),g=M(t,y),d=M(e,y);for(g.length<=s&&g.push(0),d.push(0),c=d[f-1],n=s-f;n>=0;n--){for(r=1e7-1,g[n+f]!==c&&(r=Math.floor((1e7*g[n+f]+g[n+f-1])/c)),o=0,i=0,a=d.length,u=0;u<a;u++)o+=r*d[u],p=Math.floor(o/1e7),i+=g[n+u]-(o-1e7*p),o=p,i<0?(g[n+u]=i+1e7,i=-1):(g[n+u]=i,i=0);for(;0!==i;){for(r-=1,o=0,u=0;u<a;u++)(o+=g[n+u]-1e7+d[u])<0?(g[n+u]=o+1e7,o=0):(g[n+u]=o,o=1);i+=o}v[n]=r}return g=O(g,y)[0],[l(v),l(g)]}(y,g):function(t,e){for(var r,n,o,i,u,a=t.length,p=e.length,s=[],f=[];a;)if(f.unshift(t[--a]),v(f),x(f,e)<0)s.push(0);else{o=1e7*f[(n=f.length)-1]+f[n-2],i=1e7*e[p-1]+e[p-2],n>p&&(o=1e7*(o+1)),r=Math.ceil(o/i);do{if(x(u=M(e,r),f)<=0)break;r--}while(r);s.push(r),f=m(f,u)}return s.reverse(),[l(s),l(f)]}(y,g))[0];var S=t.sign!==o.sign,E=r[1],q=t.sign;return"number"==typeof s?(S&&(s=-s),s=new a(s)):s=new u(s,S),"number"==typeof E?(q&&(E=-E),E=new a(E)):E=new u(E,q),[s,E]}function x(t,e){if(t.length!==e.length)return t.length>e.length?1:-1;for(var r=t.length-1;r>=0;r--)if(t[r]!==e[r])return t[r]>e[r]?1:-1;return 0}function P(t){var e=t.abs();return!e.isUnit()&&(!!(e.equals(2)||e.equals(3)||e.equals(5))||!(e.isEven()||e.isDivisibleBy(3)||e.isDivisibleBy(5))&&(!!e.lesser(49)||void 0))}function A(t,e){for(var r,n,i,u=t.prev(),a=u,p=0;a.isEven();)a=a.divide(2),p++;t:for(n=0;n<e.length;n++)if(!t.lesser(e[n])&&!(i=o(e[n]).modPow(a,t)).isUnit()&&!i.equals(u)){for(r=p-1;0!=r;r--){if((i=i.square().mod(t)).isUnit())return!1;if(i.equals(u))continue t}return!1}return!0}u.prototype=Object.create(i.prototype),a.prototype=Object.create(i.prototype),p.prototype=Object.create(i.prototype),u.prototype.add=function(t){var e=F(t);if(this.sign!==e.sign)return this.subtract(e.negate());var r=this.value,n=e.value;return e.isSmall?new u(d(r,Math.abs(n)),this.sign):new u(g(r,n),this.sign)},u.prototype.plus=u.prototype.add,a.prototype.add=function(t){var e=F(t),r=this.value;if(r<0!==e.sign)return this.subtract(e.negate());var n=e.value;if(e.isSmall){if(s(r+n))return new a(r+n);n=f(Math.abs(n))}return new u(d(n,Math.abs(r)),r<0)},a.prototype.plus=a.prototype.add,p.prototype.add=function(t){return new p(this.value+F(t).value)},p.prototype.plus=p.prototype.add,u.prototype.subtract=function(t){var e=F(t);if(this.sign!==e.sign)return this.add(e.negate());var r=this.value,n=e.value;return e.isSmall?w(r,Math.abs(n),this.sign):function(t,e,r){var n;return x(t,e)>=0?n=m(t,e):(n=m(e,t),r=!r),"number"==typeof(n=l(n))?(r&&(n=-n),new a(n)):new u(n,r)}(r,n,this.sign)},u.prototype.minus=u.prototype.subtract,a.prototype.subtract=function(t){var e=F(t),r=this.value;if(r<0!==e.sign)return this.add(e.negate());var n=e.value;return e.isSmall?new a(r-n):w(n,Math.abs(r),r>=0)},a.prototype.minus=a.prototype.subtract,p.prototype.subtract=function(t){return new p(this.value-F(t).value)},p.prototype.minus=p.prototype.subtract,u.prototype.negate=function(){return new u(this.value,!this.sign)},a.prototype.negate=function(){var t=this.sign,e=new a(-this.value);return e.sign=!t,e},p.prototype.negate=function(){return new p(-this.value)},u.prototype.abs=function(){return new u(this.value,!1)},a.prototype.abs=function(){return new a(Math.abs(this.value))},p.prototype.abs=function(){return new p(this.value>=0?this.value:-this.value)},u.prototype.multiply=function(t){var e,r,n,o=F(t),a=this.value,p=o.value,s=this.sign!==o.sign;if(o.isSmall){if(0===p)return i[0];if(1===p)return this;if(-1===p)return this.negate();if((e=Math.abs(p))<1e7)return new u(M(a,e),s);p=f(e)}return r=a.length,n=p.length,new u(-.012*r-.012*n+15e-6*r*n>0?function t(e,r){var n=Math.max(e.length,r.length);if(n<=30)return b(e,r);n=Math.ceil(n/2);var o=e.slice(n),i=e.slice(0,n),u=r.slice(n),a=r.slice(0,n),p=t(i,a),s=t(o,u),f=t(g(i,o),g(a,u)),l=g(g(p,S(m(m(f,p),s),n)),S(s,2*n));return v(l),l}(a,p):b(a,p),s)},u.prototype.times=u.prototype.multiply,a.prototype._multiplyBySmall=function(t){return s(t.value*this.value)?new a(t.value*this.value):E(Math.abs(t.value),f(Math.abs(this.value)),this.sign!==t.sign)},u.prototype._multiplyBySmall=function(t){return 0===t.value?i[0]:1===t.value?this:-1===t.value?this.negate():E(Math.abs(t.value),this.value,this.sign!==t.sign)},a.prototype.multiply=function(t){return F(t)._multiplyBySmall(this)},a.prototype.times=a.prototype.multiply,p.prototype.multiply=function(t){return new p(this.value*F(t).value)},p.prototype.times=p.prototype.multiply,u.prototype.square=function(){return new u(q(this.value),!1)},a.prototype.square=function(){var t=this.value*this.value;return s(t)?new a(t):new u(q(f(Math.abs(this.value))),!1)},p.prototype.square=function(t){return new p(this.value*this.value)},u.prototype.divmod=function(t){var e=N(this,t);return{quotient:e[0],remainder:e[1]}},p.prototype.divmod=a.prototype.divmod=u.prototype.divmod,u.prototype.divide=function(t){return N(this,t)[0]},p.prototype.over=p.prototype.divide=function(t){return new p(this.value/F(t).value)},a.prototype.over=a.prototype.divide=u.prototype.over=u.prototype.divide,u.prototype.mod=function(t){return N(this,t)[1]},p.prototype.mod=p.prototype.remainder=function(t){return new p(this.value%F(t).value)},a.prototype.remainder=a.prototype.mod=u.prototype.remainder=u.prototype.mod,u.prototype.pow=function(t){var e,r,n,o=F(t),u=this.value,p=o.value;if(0===p)return i[1];if(0===u)return i[0];if(1===u)return i[1];if(-1===u)return o.isEven()?i[1]:i[-1];if(o.sign)return i[0];if(!o.isSmall)throw new Error("The exponent "+o.toString()+" is too large.");if(this.isSmall&&s(e=Math.pow(u,p)))return new a(c(e));for(r=this,n=i[1];!0&p&&(n=n.times(r),--p),0!==p;)p/=2,r=r.square();return n},a.prototype.pow=u.prototype.pow,p.prototype.pow=function(t){var e=F(t),r=this.value,n=e.value,o=BigInt(0),u=BigInt(1),a=BigInt(2);if(n===o)return i[1];if(r===o)return i[0];if(r===u)return i[1];if(r===BigInt(-1))return e.isEven()?i[1]:i[-1];if(e.isNegative())return new p(o);for(var s=this,f=i[1];(n&u)===u&&(f=f.times(s),--n),n!==o;)n/=a,s=s.square();return f},u.prototype.modPow=function(t,e){if(t=F(t),(e=F(e)).isZero())throw new Error("Cannot take modPow with modulus 0");var r=i[1],n=this.mod(e);for(t.isNegative()&&(t=t.multiply(i[-1]),n=n.modInv(e));t.isPositive();){if(n.isZero())return i[0];t.isOdd()&&(r=r.multiply(n).mod(e)),t=t.divide(2),n=n.square().mod(e)}return r},p.prototype.modPow=a.prototype.modPow=u.prototype.modPow,u.prototype.compareAbs=function(t){var e=F(t),r=this.value,n=e.value;return e.isSmall?1:x(r,n)},a.prototype.compareAbs=function(t){var e=F(t),r=Math.abs(this.value),n=e.value;return e.isSmall?r===(n=Math.abs(n))?0:r>n?1:-1:-1},p.prototype.compareAbs=function(t){var e=this.value,r=F(t).value;return(e=e>=0?e:-e)===(r=r>=0?r:-r)?0:e>r?1:-1},u.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=F(t),r=this.value,n=e.value;return this.sign!==e.sign?e.sign?1:-1:e.isSmall?this.sign?-1:1:x(r,n)*(this.sign?-1:1)},u.prototype.compareTo=u.prototype.compare,a.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=F(t),r=this.value,n=e.value;return e.isSmall?r==n?0:r>n?1:-1:r<0!==e.sign?r<0?-1:1:r<0?1:-1},a.prototype.compareTo=a.prototype.compare,p.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=this.value,r=F(t).value;return e===r?0:e>r?1:-1},p.prototype.compareTo=p.prototype.compare,u.prototype.equals=function(t){return 0===this.compare(t)},p.prototype.eq=p.prototype.equals=a.prototype.eq=a.prototype.equals=u.prototype.eq=u.prototype.equals,u.prototype.notEquals=function(t){return 0!==this.compare(t)},p.prototype.neq=p.prototype.notEquals=a.prototype.neq=a.prototype.notEquals=u.prototype.neq=u.prototype.notEquals,u.prototype.greater=function(t){return this.compare(t)>0},p.prototype.gt=p.prototype.greater=a.prototype.gt=a.prototype.greater=u.prototype.gt=u.prototype.greater,u.prototype.lesser=function(t){return this.compare(t)<0},p.prototype.lt=p.prototype.lesser=a.prototype.lt=a.prototype.lesser=u.prototype.lt=u.prototype.lesser,u.prototype.greaterOrEquals=function(t){return this.compare(t)>=0},p.prototype.geq=p.prototype.greaterOrEquals=a.prototype.geq=a.prototype.greaterOrEquals=u.prototype.geq=u.prototype.greaterOrEquals,u.prototype.lesserOrEquals=function(t){return this.compare(t)<=0},p.prototype.leq=p.prototype.lesserOrEquals=a.prototype.leq=a.prototype.lesserOrEquals=u.prototype.leq=u.prototype.lesserOrEquals,u.prototype.isEven=function(){return 0==(1&this.value[0])},a.prototype.isEven=function(){return 0==(1&this.value)},p.prototype.isEven=function(){return(this.value&BigInt(1))===BigInt(0)},u.prototype.isOdd=function(){return 1==(1&this.value[0])},a.prototype.isOdd=function(){return 1==(1&this.value)},p.prototype.isOdd=function(){return(this.value&BigInt(1))===BigInt(1)},u.prototype.isPositive=function(){return!this.sign},a.prototype.isPositive=function(){return this.value>0},p.prototype.isPositive=a.prototype.isPositive,u.prototype.isNegative=function(){return this.sign},a.prototype.isNegative=function(){return this.value<0},p.prototype.isNegative=a.prototype.isNegative,u.prototype.isUnit=function(){return!1},a.prototype.isUnit=function(){return 1===Math.abs(this.value)},p.prototype.isUnit=function(){return this.abs().value===BigInt(1)},u.prototype.isZero=function(){return!1},a.prototype.isZero=function(){return 0===this.value},p.prototype.isZero=function(){return this.value===BigInt(0)},u.prototype.isDivisibleBy=function(t){var e=F(t);return!e.isZero()&&(!!e.isUnit()||(0===e.compareAbs(2)?this.isEven():this.mod(e).isZero()))},p.prototype.isDivisibleBy=a.prototype.isDivisibleBy=u.prototype.isDivisibleBy,u.prototype.isPrime=function(t){var e=P(this);if(void 0!==e)return e;var r=this.abs(),n=r.bitLength();if(n<=64)return A(r,[2,3,5,7,11,13,17,19,23,29,31,37]);for(var i=Math.log(2)*n.toJSNumber(),u=Math.ceil(!0===t?2*Math.pow(i,2):i),a=[],p=0;p<u;p++)a.push(o(p+2));return A(r,a)},p.prototype.isPrime=a.prototype.isPrime=u.prototype.isPrime,u.prototype.isProbablePrime=function(t,e){var r=P(this);if(void 0!==r)return r;for(var n=this.abs(),i=void 0===t?5:t,u=[],a=0;a<i;a++)u.push(o.randBetween(2,n.minus(2),e));return A(n,u)},p.prototype.isProbablePrime=a.prototype.isProbablePrime=u.prototype.isProbablePrime,u.prototype.modInv=function(t){for(var e,r,n,i=o.zero,u=o.one,a=F(t),p=this.abs();!p.isZero();)e=a.divide(p),r=i,n=a,i=u,a=p,u=r.subtract(e.multiply(u)),p=n.subtract(e.multiply(p));if(!a.isUnit())throw new Error(this.toString()+" and "+t.toString()+" are not co-prime");return-1===i.compare(0)&&(i=i.add(t)),this.isNegative()?i.negate():i},p.prototype.modInv=a.prototype.modInv=u.prototype.modInv,u.prototype.next=function(){var t=this.value;return this.sign?w(t,1,this.sign):new u(d(t,1),this.sign)},a.prototype.next=function(){var t=this.value;return t+1<e?new a(t+1):new u(r,!1)},p.prototype.next=function(){return new p(this.value+BigInt(1))},u.prototype.prev=function(){var t=this.value;return this.sign?new u(d(t,1),!0):w(t,1,this.sign)},a.prototype.prev=function(){var t=this.value;return t-1>-e?new a(t-1):new u(r,!0)},p.prototype.prev=function(){return new p(this.value-BigInt(1))};for(var B=[1];2*B[B.length-1]<=1e7;)B.push(2*B[B.length-1]);var I=B.length,j=B[I-1];function Z(t){return Math.abs(t)<=1e7}function J(t,e,r){e=F(e);for(var n=t.isNegative(),i=e.isNegative(),u=n?t.not():t,a=i?e.not():e,p=0,s=0,f=null,l=null,v=[];!u.isZero()||!a.isZero();)p=(f=N(u,j))[1].toJSNumber(),n&&(p=j-1-p),s=(l=N(a,j))[1].toJSNumber(),i&&(s=j-1-s),u=f[0],a=l[0],v.push(r(p,s));for(var h=0!==r(n?1:0,i?1:0)?o(-1):o(0),c=v.length-1;c>=0;c-=1)h=h.multiply(j).add(o(v[c]));return h}u.prototype.shiftLeft=function(t){var e=F(t).toJSNumber();if(!Z(e))throw new Error(String(e)+" is too large for shifting.");if(e<0)return this.shiftRight(-e);var r=this;if(r.isZero())return r;for(;e>=I;)r=r.multiply(j),e-=I-1;return r.multiply(B[e])},p.prototype.shiftLeft=a.prototype.shiftLeft=u.prototype.shiftLeft,u.prototype.shiftRight=function(t){var e,r=F(t).toJSNumber();if(!Z(r))throw new Error(String(r)+" is too large for shifting.");if(r<0)return this.shiftLeft(-r);for(var n=this;r>=I;){if(n.isZero()||n.isNegative()&&n.isUnit())return n;n=(e=N(n,j))[1].isNegative()?e[0].prev():e[0],r-=I-1}return(e=N(n,B[r]))[1].isNegative()?e[0].prev():e[0]},p.prototype.shiftRight=a.prototype.shiftRight=u.prototype.shiftRight,u.prototype.not=function(){return this.negate().prev()},p.prototype.not=a.prototype.not=u.prototype.not,u.prototype.and=function(t){return J(this,t,(function(t,e){return t&e}))},p.prototype.and=a.prototype.and=u.prototype.and,u.prototype.or=function(t){return J(this,t,(function(t,e){return t|e}))},p.prototype.or=a.prototype.or=u.prototype.or,u.prototype.xor=function(t){return J(this,t,(function(t,e){return t^e}))},p.prototype.xor=a.prototype.xor=u.prototype.xor;function L(t){var e=t.value,r="number"==typeof e?e|1<<30:"bigint"==typeof e?e|BigInt(1<<30):e[0]+1e7*e[1]|1073758208;return r&-r}function U(t,e){return t=F(t),e=F(e),t.greater(e)?t:e}function k(t,e){return t=F(t),e=F(e),t.lesser(e)?t:e}function T(t,e){if(t=F(t).abs(),e=F(e).abs(),t.equals(e))return t;if(t.isZero())return e;if(e.isZero())return t;for(var r,n,o=i[1];t.isEven()&&e.isEven();)r=k(L(t),L(e)),t=t.divide(r),e=e.divide(r),o=o.multiply(r);for(;t.isEven();)t=t.divide(L(t));do{for(;e.isEven();)e=e.divide(L(e));t.greater(e)&&(n=e,e=t,t=n),e=e.subtract(t)}while(!e.isZero());return o.isUnit()?t:t.multiply(o)}u.prototype.bitLength=function(){var t=this;return t.compareTo(o(0))<0&&(t=t.negate().subtract(o(1))),0===t.compareTo(o(0))?o(0):o(function t(e,r){if(r.compareTo(e)<=0){var n=t(e,r.square(r)),i=n.p,u=n.e,a=i.multiply(r);return a.compareTo(e)<=0?{p:a,e:2*u+1}:{p:i,e:2*u}}return{p:o(1),e:0}}(t,o(2)).e).add(o(1))},p.prototype.bitLength=a.prototype.bitLength=u.prototype.bitLength;var z=function(t,e,r,n){r=r||"0123456789abcdefghijklmnopqrstuvwxyz",t=String(t),n||(t=t.toLowerCase(),r=r.toLowerCase());var o,i=t.length,u=Math.abs(e),a={};for(o=0;o<r.length;o++)a[r[o]]=o;for(o=0;o<i;o++){if("-"!==(f=t[o])&&(f in a&&a[f]>=u)){if("1"===f&&1===u)continue;throw new Error(f+" is not a valid digit in base "+e+".")}}e=F(e);var p=[],s="-"===t[0];for(o=s?1:0;o<t.length;o++){var f;if((f=t[o])in a)p.push(F(a[f]));else{if("<"!==f)throw new Error(f+" is not a valid character");var l=o;do{o++}while(">"!==t[o]&&o<t.length);p.push(F(t.slice(l+1,o)))}}return _(p,e,s)};function _(t,e,r){var n,o=i[0],u=i[1];for(n=t.length-1;n>=0;n--)o=o.add(t[n].times(u)),u=u.times(e);return r?o.negate():o}function C(t,e){if((e=o(e)).isZero()){if(t.isZero())return{value:[0],isNegative:!1};throw new Error("Cannot convert nonzero numbers to base 0.")}if(e.equals(-1)){if(t.isZero())return{value:[0],isNegative:!1};if(t.isNegative())return{value:[].concat.apply([],Array.apply(null,Array(-t.toJSNumber())).map(Array.prototype.valueOf,[1,0])),isNegative:!1};var r=Array.apply(null,Array(t.toJSNumber()-1)).map(Array.prototype.valueOf,[0,1]);return r.unshift([1]),{value:[].concat.apply([],r),isNegative:!1}}var n=!1;if(t.isNegative()&&e.isPositive()&&(n=!0,t=t.abs()),e.isUnit())return t.isZero()?{value:[0],isNegative:!1}:{value:Array.apply(null,Array(t.toJSNumber())).map(Number.prototype.valueOf,1),isNegative:n};for(var i,u=[],a=t;a.isNegative()||a.compareAbs(e)>=0;){i=a.divmod(e),a=i.quotient;var p=i.remainder;p.isNegative()&&(p=e.minus(p).abs(),a=a.next()),u.push(p.toJSNumber())}return u.push(a.toJSNumber()),{value:u.reverse(),isNegative:n}}function D(t,e,r){var n=C(t,e);return(n.isNegative?"-":"")+n.value.map((function(t){return function(t,e){return t<(e=e||"0123456789abcdefghijklmnopqrstuvwxyz").length?e[t]:"<"+t+">"}(t,r)})).join("")}function R(t){if(s(+t)){var e=+t;if(e===c(e))return n?new p(BigInt(e)):new a(e);throw new Error("Invalid integer: "+t)}var r="-"===t[0];r&&(t=t.slice(1));var o=t.split(/e/i);if(o.length>2)throw new Error("Invalid integer: "+o.join("e"));if(2===o.length){var i=o[1];if("+"===i[0]&&(i=i.slice(1)),(i=+i)!==c(i)||!s(i))throw new Error("Invalid integer: "+i+" is not a valid exponent.");var f=o[0],l=f.indexOf(".");if(l>=0&&(i-=f.length-l-1,f=f.slice(0,l)+f.slice(l+1)),i<0)throw new Error("Cannot include negative exponent part for integers");t=f+=new Array(i+1).join("0")}if(!/^([0-9][0-9]*)$/.test(t))throw new Error("Invalid integer: "+t);if(n)return new p(BigInt(r?"-"+t:t));for(var h=[],y=t.length,g=y-7;y>0;)h.push(+t.slice(g,y)),(g-=7)<0&&(g=0),y-=7;return v(h),new u(h,r)}function F(t){return"number"==typeof t?function(t){if(n)return new p(BigInt(t));if(s(t)){if(t!==c(t))throw new Error(t+" is not an integer.");return new a(t)}return R(t.toString())}(t):"string"==typeof t?R(t):"bigint"==typeof t?new p(t):t}u.prototype.toArray=function(t){return C(this,t)},a.prototype.toArray=function(t){return C(this,t)},p.prototype.toArray=function(t){return C(this,t)},u.prototype.toString=function(t,e){if(void 0===t&&(t=10),10!==t)return D(this,t,e);for(var r,n=this.value,o=n.length,i=String(n[--o]);--o>=0;)r=String(n[o]),i+="0000000".slice(r.length)+r;return(this.sign?"-":"")+i},a.prototype.toString=function(t,e){return void 0===t&&(t=10),10!=t?D(this,t,e):String(this.value)},p.prototype.toString=a.prototype.toString,p.prototype.toJSON=u.prototype.toJSON=a.prototype.toJSON=function(){return this.toString()},u.prototype.valueOf=function(){return parseInt(this.toString(),10)},u.prototype.toJSNumber=u.prototype.valueOf,a.prototype.valueOf=function(){return this.value},a.prototype.toJSNumber=a.prototype.valueOf,p.prototype.valueOf=p.prototype.toJSNumber=function(){return parseInt(this.toString(),10)};for(var G=0;G<1e3;G++)i[G]=F(G),G>0&&(i[-G]=F(-G));return i.one=i[1],i.zero=i[0],i.minusOne=i[-1],i.max=U,i.min=k,i.gcd=T,i.lcm=function(t,e){return t=F(t).abs(),e=F(e).abs(),t.divide(T(t,e)).multiply(e)},i.isInstance=function(t){return t instanceof u||t instanceof a||t instanceof p},i.randBetween=function(t,e,r){t=F(t),e=F(e);var n=r||Math.random,o=k(t,e),u=U(t,e).subtract(o).add(1);if(u.isSmall)return o.add(Math.floor(n()*u));for(var a=C(u,1e7).value,p=[],s=!0,f=0;f<a.length;f++){var l=s?a[f]:1e7,v=c(n()*l);p.push(v),v<l&&(s=!1)}return o.add(i.fromArray(p,1e7,!1))},i.fromArray=function(t,e,r){return _(t.map(F),F(e||10),r)},i}();t.hasOwnProperty("exports")&&(t.exports=o),void 0===(n=function(){return o}.call(e,r,e,t))||(t.exports=n)}).call(this,r(2)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}}])}));