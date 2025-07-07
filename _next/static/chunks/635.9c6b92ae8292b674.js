(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[635],{8374:function(t,o,i){let r=i(4259),n=i(3675),a=i(3406),l=i(6260);function renderCanvas(t,o,i,a,l){let s=[].slice.call(arguments,1),c=s.length,d="function"==typeof s[c-1];if(!d&&!r())throw Error("Callback required as last argument");if(d){if(c<2)throw Error("Too few arguments provided");2===c?(l=i,i=o,o=a=void 0):3===c&&(o.getContext&&void 0===l?(l=a,a=void 0):(l=a,a=i,i=o,o=void 0))}else{if(c<1)throw Error("Too few arguments provided");return 1===c?(i=o,o=a=void 0):2!==c||o.getContext||(a=i,i=o,o=void 0),new Promise(function(r,l){try{let l=n.create(i,a);r(t(l,o,a))}catch(t){l(t)}})}try{let r=n.create(i,a);l(null,t(r,o,a))}catch(t){l(t)}}o.create=n.create,o.toCanvas=renderCanvas.bind(null,a.render),o.toDataURL=renderCanvas.bind(null,a.renderToDataURL),o.toString=renderCanvas.bind(null,function(t,o,i){return l.render(t,i)})},4259:function(t){t.exports=function(){return"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then}},3124:function(t,o,i){let r=i(5317).getSymbolSize;o.getRowColCoords=function(t){if(1===t)return[];let o=Math.floor(t/7)+2,i=r(t),n=145===i?26:2*Math.ceil((i-13)/(2*o-2)),a=[i-7];for(let t=1;t<o-1;t++)a[t]=a[t-1]-n;return a.push(6),a.reverse()},o.getPositions=function(t){let i=[],r=o.getRowColCoords(t),n=r.length;for(let t=0;t<n;t++)for(let o=0;o<n;o++)(0!==t||0!==o)&&(0!==t||o!==n-1)&&(t!==n-1||0!==o)&&i.push([r[t],r[o]]);return i}},9743:function(t,o,i){let r=i(6621),n=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function AlphanumericData(t){this.mode=r.ALPHANUMERIC,this.data=t}AlphanumericData.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)},AlphanumericData.prototype.getLength=function(){return this.data.length},AlphanumericData.prototype.getBitsLength=function(){return AlphanumericData.getBitsLength(this.data.length)},AlphanumericData.prototype.write=function(t){let o;for(o=0;o+2<=this.data.length;o+=2){let i=45*n.indexOf(this.data[o]);i+=n.indexOf(this.data[o+1]),t.put(i,11)}this.data.length%2&&t.put(n.indexOf(this.data[o]),6)},t.exports=AlphanumericData},4566:function(t){function BitBuffer(){this.buffer=[],this.length=0}BitBuffer.prototype={get:function(t){return(this.buffer[Math.floor(t/8)]>>>7-t%8&1)==1},put:function(t,o){for(let i=0;i<o;i++)this.putBit((t>>>o-i-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(t){let o=Math.floor(this.length/8);this.buffer.length<=o&&this.buffer.push(0),t&&(this.buffer[o]|=128>>>this.length%8),this.length++}},t.exports=BitBuffer},6426:function(t){function BitMatrix(t){if(!t||t<1)throw Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}BitMatrix.prototype.set=function(t,o,i,r){let n=t*this.size+o;this.data[n]=i,r&&(this.reservedBit[n]=!0)},BitMatrix.prototype.get=function(t,o){return this.data[t*this.size+o]},BitMatrix.prototype.xor=function(t,o,i){this.data[t*this.size+o]^=i},BitMatrix.prototype.isReserved=function(t,o){return this.reservedBit[t*this.size+o]},t.exports=BitMatrix},4230:function(t,o,i){let r=i(2378),n=i(6621);function ByteData(t){this.mode=n.BYTE,"string"==typeof t&&(t=r(t)),this.data=new Uint8Array(t)}ByteData.getBitsLength=function(t){return 8*t},ByteData.prototype.getLength=function(){return this.data.length},ByteData.prototype.getBitsLength=function(){return ByteData.getBitsLength(this.data.length)},ByteData.prototype.write=function(t){for(let o=0,i=this.data.length;o<i;o++)t.put(this.data[o],8)},t.exports=ByteData},5256:function(t,o,i){let r=i(7682),n=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],a=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];o.getBlocksCount=function(t,o){switch(o){case r.L:return n[(t-1)*4+0];case r.M:return n[(t-1)*4+1];case r.Q:return n[(t-1)*4+2];case r.H:return n[(t-1)*4+3];default:return}},o.getTotalCodewordsCount=function(t,o){switch(o){case r.L:return a[(t-1)*4+0];case r.M:return a[(t-1)*4+1];case r.Q:return a[(t-1)*4+2];case r.H:return a[(t-1)*4+3];default:return}}},7682:function(t,o){o.L={bit:1},o.M={bit:0},o.Q={bit:3},o.H={bit:2},o.isValid=function(t){return t&&void 0!==t.bit&&t.bit>=0&&t.bit<4},o.from=function(t,i){if(o.isValid(t))return t;try{return function(t){if("string"!=typeof t)throw Error("Param is not a string");let i=t.toLowerCase();switch(i){case"l":case"low":return o.L;case"m":case"medium":return o.M;case"q":case"quartile":return o.Q;case"h":case"high":return o.H;default:throw Error("Unknown EC Level: "+t)}}(t)}catch(t){return i}}},8106:function(t,o,i){let r=i(5317).getSymbolSize;o.getPositions=function(t){let o=r(t);return[[0,0],[o-7,0],[0,o-7]]}},4510:function(t,o,i){let r=i(5317),n=r.getBCHDigit(1335);o.getEncodedBits=function(t,o){let i=t.bit<<3|o,a=i<<10;for(;r.getBCHDigit(a)-n>=0;)a^=1335<<r.getBCHDigit(a)-n;return(i<<10|a)^21522}},4464:function(t,o){let i=new Uint8Array(512),r=new Uint8Array(256);!function(){let t=1;for(let o=0;o<255;o++)i[o]=t,r[t]=o,256&(t<<=1)&&(t^=285);for(let t=255;t<512;t++)i[t]=i[t-255]}(),o.log=function(t){if(t<1)throw Error("log("+t+")");return r[t]},o.exp=function(t){return i[t]},o.mul=function(t,o){return 0===t||0===o?0:i[r[t]+r[o]]}},2216:function(t,o,i){let r=i(6621),n=i(5317);function KanjiData(t){this.mode=r.KANJI,this.data=t}KanjiData.getBitsLength=function(t){return 13*t},KanjiData.prototype.getLength=function(){return this.data.length},KanjiData.prototype.getBitsLength=function(){return KanjiData.getBitsLength(this.data.length)},KanjiData.prototype.write=function(t){let o;for(o=0;o<this.data.length;o++){let i=n.toSJIS(this.data[o]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw Error("Invalid SJIS character: "+this.data[o]+"\nMake sure your charset is UTF-8");i=(i>>>8&255)*192+(255&i),t.put(i,13)}},t.exports=KanjiData},2179:function(t,o){o.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};let i={N1:3,N2:3,N3:40,N4:10};o.isValid=function(t){return null!=t&&""!==t&&!isNaN(t)&&t>=0&&t<=7},o.from=function(t){return o.isValid(t)?parseInt(t,10):void 0},o.getPenaltyN1=function(t){let o=t.size,r=0,n=0,a=0,l=null,s=null;for(let c=0;c<o;c++){n=a=0,l=s=null;for(let d=0;d<o;d++){let o=t.get(c,d);o===l?n++:(n>=5&&(r+=i.N1+(n-5)),l=o,n=1),(o=t.get(d,c))===s?a++:(a>=5&&(r+=i.N1+(a-5)),s=o,a=1)}n>=5&&(r+=i.N1+(n-5)),a>=5&&(r+=i.N1+(a-5))}return r},o.getPenaltyN2=function(t){let o=t.size,r=0;for(let i=0;i<o-1;i++)for(let n=0;n<o-1;n++){let o=t.get(i,n)+t.get(i,n+1)+t.get(i+1,n)+t.get(i+1,n+1);(4===o||0===o)&&r++}return r*i.N2},o.getPenaltyN3=function(t){let o=t.size,r=0,n=0,a=0;for(let i=0;i<o;i++){n=a=0;for(let l=0;l<o;l++)n=n<<1&2047|t.get(i,l),l>=10&&(1488===n||93===n)&&r++,a=a<<1&2047|t.get(l,i),l>=10&&(1488===a||93===a)&&r++}return r*i.N3},o.getPenaltyN4=function(t){let o=0,r=t.data.length;for(let i=0;i<r;i++)o+=t.data[i];let n=Math.abs(Math.ceil(100*o/r/5)-10);return n*i.N4},o.applyMask=function(t,i){let r=i.size;for(let n=0;n<r;n++)for(let a=0;a<r;a++)i.isReserved(a,n)||i.xor(a,n,function(t,i,r){switch(t){case o.Patterns.PATTERN000:return(i+r)%2==0;case o.Patterns.PATTERN001:return i%2==0;case o.Patterns.PATTERN010:return r%3==0;case o.Patterns.PATTERN011:return(i+r)%3==0;case o.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(r/3))%2==0;case o.Patterns.PATTERN101:return i*r%2+i*r%3==0;case o.Patterns.PATTERN110:return(i*r%2+i*r%3)%2==0;case o.Patterns.PATTERN111:return(i*r%3+(i+r)%2)%2==0;default:throw Error("bad maskPattern:"+t)}}(t,a,n))},o.getBestMask=function(t,i){let r=Object.keys(o.Patterns).length,n=0,a=1/0;for(let l=0;l<r;l++){i(l),o.applyMask(l,t);let r=o.getPenaltyN1(t)+o.getPenaltyN2(t)+o.getPenaltyN3(t)+o.getPenaltyN4(t);o.applyMask(l,t),r<a&&(a=r,n=l)}return n}},6621:function(t,o,i){let r=i(9737),n=i(2548);o.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},o.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},o.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},o.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},o.MIXED={bit:-1},o.getCharCountIndicator=function(t,o){if(!t.ccBits)throw Error("Invalid mode: "+t);if(!r.isValid(o))throw Error("Invalid version: "+o);return o>=1&&o<10?t.ccBits[0]:o<27?t.ccBits[1]:t.ccBits[2]},o.getBestModeForData=function(t){return n.testNumeric(t)?o.NUMERIC:n.testAlphanumeric(t)?o.ALPHANUMERIC:n.testKanji(t)?o.KANJI:o.BYTE},o.toString=function(t){if(t&&t.id)return t.id;throw Error("Invalid mode")},o.isValid=function(t){return t&&t.bit&&t.ccBits},o.from=function(t,i){if(o.isValid(t))return t;try{return function(t){if("string"!=typeof t)throw Error("Param is not a string");let i=t.toLowerCase();switch(i){case"numeric":return o.NUMERIC;case"alphanumeric":return o.ALPHANUMERIC;case"kanji":return o.KANJI;case"byte":return o.BYTE;default:throw Error("Unknown mode: "+t)}}(t)}catch(t){return i}}},3971:function(t,o,i){let r=i(6621);function NumericData(t){this.mode=r.NUMERIC,this.data=t.toString()}NumericData.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},NumericData.prototype.getLength=function(){return this.data.length},NumericData.prototype.getBitsLength=function(){return NumericData.getBitsLength(this.data.length)},NumericData.prototype.write=function(t){let o,i;for(o=0;o+3<=this.data.length;o+=3)i=parseInt(this.data.substr(o,3),10),t.put(i,10);let r=this.data.length-o;r>0&&(i=parseInt(this.data.substr(o),10),t.put(i,3*r+1))},t.exports=NumericData},3006:function(t,o,i){let r=i(4464);o.mul=function(t,o){let i=new Uint8Array(t.length+o.length-1);for(let n=0;n<t.length;n++)for(let a=0;a<o.length;a++)i[n+a]^=r.mul(t[n],o[a]);return i},o.mod=function(t,o){let i=new Uint8Array(t);for(;i.length-o.length>=0;){let t=i[0];for(let n=0;n<o.length;n++)i[n]^=r.mul(o[n],t);let n=0;for(;n<i.length&&0===i[n];)n++;i=i.slice(n)}return i},o.generateECPolynomial=function(t){let i=new Uint8Array([1]);for(let n=0;n<t;n++)i=o.mul(i,new Uint8Array([1,r.exp(n)]));return i}},3675:function(t,o,i){let r=i(5317),n=i(7682),a=i(4566),l=i(6426),s=i(3124),c=i(8106),d=i(2179),u=i(5256),p=i(1365),w=i(810),g=i(4510),b=i(6621),f=i(4991);function setupFormatInfo(t,o,i){let r,n;let a=t.size,l=g.getEncodedBits(o,i);for(r=0;r<15;r++)n=(l>>r&1)==1,r<6?t.set(r,8,n,!0):r<8?t.set(r+1,8,n,!0):t.set(a-15+r,8,n,!0),r<8?t.set(8,a-r-1,n,!0):r<9?t.set(8,15-r-1+1,n,!0):t.set(8,15-r-1,n,!0);t.set(a-8,8,1,!0)}o.create=function(t,o){let i,g;if(void 0===t||""===t)throw Error("No input text");let m=n.M;return void 0!==o&&(m=n.from(o.errorCorrectionLevel,n.M),i=w.from(o.version),g=d.from(o.maskPattern),o.toSJISFunc&&r.setToSJISFunction(o.toSJISFunc)),function(t,o,i,n){let g;if(Array.isArray(t))g=f.fromArray(t);else if("string"==typeof t){let r=o;if(!r){let o=f.rawSplit(t);r=w.getBestVersionForData(o,i)}g=f.fromString(t,r||40)}else throw Error("Invalid data");let m=w.getBestVersionForData(g,i);if(!m)throw Error("The amount of data is too big to be stored in a QR Code");if(o){if(o<m)throw Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+m+".\n")}else o=m;let v=function(t,o,i){let n=new a;i.forEach(function(o){n.put(o.mode.bit,4),n.put(o.getLength(),b.getCharCountIndicator(o.mode,t)),o.write(n)});let l=r.getSymbolTotalCodewords(t),s=u.getTotalCodewordsCount(t,o),c=(l-s)*8;for(n.getLengthInBits()+4<=c&&n.put(0,4);n.getLengthInBits()%8!=0;)n.putBit(0);let d=(c-n.getLengthInBits())/8;for(let t=0;t<d;t++)n.put(t%2?17:236,8);return function(t,o,i){let n,a;let l=r.getSymbolTotalCodewords(o),s=u.getTotalCodewordsCount(o,i),c=l-s,d=u.getBlocksCount(o,i),w=l%d,g=d-w,b=Math.floor(l/d),f=Math.floor(c/d),m=f+1,v=b-f,y=new p(v),_=0,x=Array(d),C=Array(d),$=0,k=new Uint8Array(t.buffer);for(let t=0;t<d;t++){let o=t<g?f:m;x[t]=k.slice(_,_+o),C[t]=y.encode(x[t]),_+=o,$=Math.max($,o)}let R=new Uint8Array(l),S=0;for(n=0;n<$;n++)for(a=0;a<d;a++)n<x[a].length&&(R[S++]=x[a][n]);for(n=0;n<v;n++)for(a=0;a<d;a++)R[S++]=C[a][n];return R}(n,t,o)}(o,i,g),y=r.getSymbolSize(o),_=new l(y);return function(t,o){let i=t.size,r=c.getPositions(o);for(let o=0;o<r.length;o++){let n=r[o][0],a=r[o][1];for(let o=-1;o<=7;o++)if(!(n+o<=-1)&&!(i<=n+o))for(let r=-1;r<=7;r++)a+r<=-1||i<=a+r||(o>=0&&o<=6&&(0===r||6===r)||r>=0&&r<=6&&(0===o||6===o)||o>=2&&o<=4&&r>=2&&r<=4?t.set(n+o,a+r,!0,!0):t.set(n+o,a+r,!1,!0))}}(_,o),function(t){let o=t.size;for(let i=8;i<o-8;i++){let o=i%2==0;t.set(i,6,o,!0),t.set(6,i,o,!0)}}(_),function(t,o){let i=s.getPositions(o);for(let o=0;o<i.length;o++){let r=i[o][0],n=i[o][1];for(let o=-2;o<=2;o++)for(let i=-2;i<=2;i++)-2===o||2===o||-2===i||2===i||0===o&&0===i?t.set(r+o,n+i,!0,!0):t.set(r+o,n+i,!1,!0)}}(_,o),setupFormatInfo(_,i,0),o>=7&&function(t,o){let i,r,n;let a=t.size,l=w.getEncodedBits(o);for(let o=0;o<18;o++)i=Math.floor(o/3),r=o%3+a-8-3,n=(l>>o&1)==1,t.set(i,r,n,!0),t.set(r,i,n,!0)}(_,o),function(t,o){let i=t.size,r=-1,n=i-1,a=7,l=0;for(let s=i-1;s>0;s-=2)for(6===s&&s--;;){for(let i=0;i<2;i++)if(!t.isReserved(n,s-i)){let r=!1;l<o.length&&(r=(o[l]>>>a&1)==1),t.set(n,s-i,r),-1==--a&&(l++,a=7)}if((n+=r)<0||i<=n){n-=r,r=-r;break}}}(_,v),isNaN(n)&&(n=d.getBestMask(_,setupFormatInfo.bind(null,_,i))),d.applyMask(n,_),setupFormatInfo(_,i,n),{modules:_,version:o,errorCorrectionLevel:i,maskPattern:n,segments:g}}(t,i,m,g)}},1365:function(t,o,i){let r=i(3006);function ReedSolomonEncoder(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}ReedSolomonEncoder.prototype.initialize=function(t){this.degree=t,this.genPoly=r.generateECPolynomial(this.degree)},ReedSolomonEncoder.prototype.encode=function(t){if(!this.genPoly)throw Error("Encoder not initialized");let o=new Uint8Array(t.length+this.degree);o.set(t);let i=r.mod(o,this.genPoly),n=this.degree-i.length;if(n>0){let t=new Uint8Array(this.degree);return t.set(i,n),t}return i},t.exports=ReedSolomonEncoder},2548:function(t,o){let i="[0-9]+",r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";r=r.replace(/u/g,"\\u");let n="(?:(?![A-Z0-9 $%*+\\-./:]|"+r+")(?:.|[\r\n]))+";o.KANJI=RegExp(r,"g"),o.BYTE_KANJI=RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),o.BYTE=RegExp(n,"g"),o.NUMERIC=RegExp(i,"g"),o.ALPHANUMERIC=RegExp("[A-Z $%*+\\-./:]+","g");let a=RegExp("^"+r+"$"),l=RegExp("^"+i+"$"),s=RegExp("^[A-Z0-9 $%*+\\-./:]+$");o.testKanji=function(t){return a.test(t)},o.testNumeric=function(t){return l.test(t)},o.testAlphanumeric=function(t){return s.test(t)}},4991:function(t,o,i){let r=i(6621),n=i(3971),a=i(9743),l=i(4230),s=i(2216),c=i(2548),d=i(5317),u=i(5987);function getStringByteLength(t){return unescape(encodeURIComponent(t)).length}function getSegments(t,o,i){let r;let n=[];for(;null!==(r=t.exec(i));)n.push({data:r[0],index:r.index,mode:o,length:r[0].length});return n}function getSegmentsFromString(t){let o,i;let n=getSegments(c.NUMERIC,r.NUMERIC,t),a=getSegments(c.ALPHANUMERIC,r.ALPHANUMERIC,t);d.isKanjiModeEnabled()?(o=getSegments(c.BYTE,r.BYTE,t),i=getSegments(c.KANJI,r.KANJI,t)):(o=getSegments(c.BYTE_KANJI,r.BYTE,t),i=[]);let l=n.concat(a,o,i);return l.sort(function(t,o){return t.index-o.index}).map(function(t){return{data:t.data,mode:t.mode,length:t.length}})}function getSegmentBitsLength(t,o){switch(o){case r.NUMERIC:return n.getBitsLength(t);case r.ALPHANUMERIC:return a.getBitsLength(t);case r.KANJI:return s.getBitsLength(t);case r.BYTE:return l.getBitsLength(t)}}function buildSingleSegment(t,o){let i;let c=r.getBestModeForData(t);if((i=r.from(o,c))!==r.BYTE&&i.bit<c.bit)throw Error('"'+t+'" cannot be encoded with mode '+r.toString(i)+".\n Suggested mode is: "+r.toString(c));switch(i!==r.KANJI||d.isKanjiModeEnabled()||(i=r.BYTE),i){case r.NUMERIC:return new n(t);case r.ALPHANUMERIC:return new a(t);case r.KANJI:return new s(t);case r.BYTE:return new l(t)}}o.fromArray=function(t){return t.reduce(function(t,o){return"string"==typeof o?t.push(buildSingleSegment(o,null)):o.data&&t.push(buildSingleSegment(o.data,o.mode)),t},[])},o.fromString=function(t,i){let n=getSegmentsFromString(t,d.isKanjiModeEnabled()),a=function(t){let o=[];for(let i=0;i<t.length;i++){let n=t[i];switch(n.mode){case r.NUMERIC:o.push([n,{data:n.data,mode:r.ALPHANUMERIC,length:n.length},{data:n.data,mode:r.BYTE,length:n.length}]);break;case r.ALPHANUMERIC:o.push([n,{data:n.data,mode:r.BYTE,length:n.length}]);break;case r.KANJI:o.push([n,{data:n.data,mode:r.BYTE,length:getStringByteLength(n.data)}]);break;case r.BYTE:o.push([{data:n.data,mode:r.BYTE,length:getStringByteLength(n.data)}])}}return o}(n),l=function(t,o){let i={},n={start:{}},a=["start"];for(let l=0;l<t.length;l++){let s=t[l],c=[];for(let t=0;t<s.length;t++){let d=s[t],u=""+l+t;c.push(u),i[u]={node:d,lastCount:0},n[u]={};for(let t=0;t<a.length;t++){let l=a[t];i[l]&&i[l].node.mode===d.mode?(n[l][u]=getSegmentBitsLength(i[l].lastCount+d.length,d.mode)-getSegmentBitsLength(i[l].lastCount,d.mode),i[l].lastCount+=d.length):(i[l]&&(i[l].lastCount=d.length),n[l][u]=getSegmentBitsLength(d.length,d.mode)+4+r.getCharCountIndicator(d.mode,o))}}a=c}for(let t=0;t<a.length;t++)n[a[t]].end=0;return{map:n,table:i}}(a,i),s=u.find_path(l.map,"start","end"),c=[];for(let t=1;t<s.length-1;t++)c.push(l.table[s[t]].node);return o.fromArray(c.reduce(function(t,o){let i=t.length-1>=0?t[t.length-1]:null;return i&&i.mode===o.mode?t[t.length-1].data+=o.data:t.push(o),t},[]))},o.rawSplit=function(t){return o.fromArray(getSegmentsFromString(t,d.isKanjiModeEnabled()))}},5317:function(t,o){let i;let r=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];o.getSymbolSize=function(t){if(!t)throw Error('"version" cannot be null or undefined');if(t<1||t>40)throw Error('"version" should be in range from 1 to 40');return 4*t+17},o.getSymbolTotalCodewords=function(t){return r[t]},o.getBCHDigit=function(t){let o=0;for(;0!==t;)o++,t>>>=1;return o},o.setToSJISFunction=function(t){if("function"!=typeof t)throw Error('"toSJISFunc" is not a valid function.');i=t},o.isKanjiModeEnabled=function(){return void 0!==i},o.toSJIS=function(t){return i(t)}},9737:function(t,o){o.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}},810:function(t,o,i){let r=i(5317),n=i(5256),a=i(7682),l=i(6621),s=i(9737),c=r.getBCHDigit(7973);function getReservedBitsCount(t,o){return l.getCharCountIndicator(t,o)+4}o.from=function(t,o){return s.isValid(t)?parseInt(t,10):o},o.getCapacity=function(t,o,i){if(!s.isValid(t))throw Error("Invalid QR Code version");void 0===i&&(i=l.BYTE);let a=r.getSymbolTotalCodewords(t),c=n.getTotalCodewordsCount(t,o),d=(a-c)*8;if(i===l.MIXED)return d;let u=d-getReservedBitsCount(i,t);switch(i){case l.NUMERIC:return Math.floor(u/10*3);case l.ALPHANUMERIC:return Math.floor(u/11*2);case l.KANJI:return Math.floor(u/13);case l.BYTE:default:return Math.floor(u/8)}},o.getBestVersionForData=function(t,i){let r;let n=a.from(i,a.M);if(Array.isArray(t)){if(t.length>1)return function(t,i){for(let r=1;r<=40;r++){let n=function(t,o){let i=0;return t.forEach(function(t){let r=getReservedBitsCount(t.mode,o);i+=r+t.getBitsLength()}),i}(t,r);if(n<=o.getCapacity(r,i,l.MIXED))return r}}(t,n);if(0===t.length)return 1;r=t[0]}else r=t;return function(t,i,r){for(let n=1;n<=40;n++)if(i<=o.getCapacity(n,r,t))return n}(r.mode,r.getLength(),n)},o.getEncodedBits=function(t){if(!s.isValid(t)||t<7)throw Error("Invalid QR Code version");let o=t<<12;for(;r.getBCHDigit(o)-c>=0;)o^=7973<<r.getBCHDigit(o)-c;return t<<12|o}},3406:function(t,o,i){let r=i(4884);o.render=function(t,o,i){var n;let a=i,l=o;void 0!==a||o&&o.getContext||(a=o,o=void 0),o||(l=function(){try{return document.createElement("canvas")}catch(t){throw Error("You need to specify a canvas element")}}()),a=r.getOptions(a);let s=r.getImageWidth(t.modules.size,a),c=l.getContext("2d"),d=c.createImageData(s,s);return r.qrToImageData(d.data,t,a),n=l,c.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=s,n.width=s,n.style.height=s+"px",n.style.width=s+"px",c.putImageData(d,0,0),l},o.renderToDataURL=function(t,i,r){let n=r;void 0!==n||i&&i.getContext||(n=i,i=void 0),n||(n={});let a=o.render(t,i,n),l=n.type||"image/png",s=n.rendererOpts||{};return a.toDataURL(l,s.quality)}},6260:function(t,o,i){let r=i(4884);function getColorAttrib(t,o){let i=t.a/255,r=o+'="'+t.hex+'"';return i<1?r+" "+o+'-opacity="'+i.toFixed(2).slice(1)+'"':r}function svgCmd(t,o,i){let r=t+o;return void 0!==i&&(r+=" "+i),r}o.render=function(t,o,i){let n=r.getOptions(o),a=t.modules.size,l=t.modules.data,s=a+2*n.margin,c=n.color.light.a?"<path "+getColorAttrib(n.color.light,"fill")+' d="M0 0h'+s+"v"+s+'H0z"/>':"",d="<path "+getColorAttrib(n.color.dark,"stroke")+' d="'+function(t,o,i){let r="",n=0,a=!1,l=0;for(let s=0;s<t.length;s++){let c=Math.floor(s%o),d=Math.floor(s/o);c||a||(a=!0),t[s]?(l++,s>0&&c>0&&t[s-1]||(r+=a?svgCmd("M",c+i,.5+d+i):svgCmd("m",n,0),n=0,a=!1),c+1<o&&t[s+1]||(r+=svgCmd("h",l),l=0)):n++}return r}(l,a,n.margin)+'"/>',u=n.width?'width="'+n.width+'" height="'+n.width+'" ':"",p='<svg xmlns="http://www.w3.org/2000/svg" '+u+('viewBox="0 0 '+s)+" "+s+'" shape-rendering="crispEdges">'+c+d+"</svg>\n";return"function"==typeof i&&i(null,p),p}},4884:function(t,o){function hex2rgba(t){if("number"==typeof t&&(t=t.toString()),"string"!=typeof t)throw Error("Color should be defined as hex string");let o=t.slice().replace("#","").split("");if(o.length<3||5===o.length||o.length>8)throw Error("Invalid hex color: "+t);(3===o.length||4===o.length)&&(o=Array.prototype.concat.apply([],o.map(function(t){return[t,t]}))),6===o.length&&o.push("F","F");let i=parseInt(o.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:255&i,hex:"#"+o.slice(0,6).join("")}}o.getOptions=function(t){t||(t={}),t.color||(t.color={});let o=void 0===t.margin||null===t.margin||t.margin<0?4:t.margin,i=t.width&&t.width>=21?t.width:void 0,r=t.scale||4;return{width:i,scale:i?4:r,margin:o,color:{dark:hex2rgba(t.color.dark||"#000000ff"),light:hex2rgba(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},o.getScale=function(t,o){return o.width&&o.width>=t+2*o.margin?o.width/(t+2*o.margin):o.scale},o.getImageWidth=function(t,i){let r=o.getScale(t,i);return Math.floor((t+2*i.margin)*r)},o.qrToImageData=function(t,i,r){let n=i.modules.size,a=i.modules.data,l=o.getScale(n,r),s=Math.floor((n+2*r.margin)*l),c=r.margin*l,d=[r.color.light,r.color.dark];for(let o=0;o<s;o++)for(let i=0;i<s;i++){let u=(o*s+i)*4,p=r.color.light;if(o>=c&&i>=c&&o<s-c&&i<s-c){let t=Math.floor((o-c)/l),r=Math.floor((i-c)/l);p=d[a[t*n+r]?1:0]}t[u++]=p.r,t[u++]=p.g,t[u++]=p.b,t[u]=p.a}}},5987:function(t){"use strict";var o={single_source_shortest_paths:function(t,i,r){var n,a,l,s,c,d,u,p={},w={};w[i]=0;var g=o.PriorityQueue.make();for(g.push(i,0);!g.empty();)for(l in a=(n=g.pop()).value,s=n.cost,c=t[a]||{})c.hasOwnProperty(l)&&(d=s+c[l],u=w[l],(void 0===w[l]||u>d)&&(w[l]=d,g.push(l,d),p[l]=a));if(void 0!==r&&void 0===w[r])throw Error(["Could not find a path from ",i," to ",r,"."].join(""));return p},extract_shortest_path_from_predecessor_list:function(t,o){for(var i=[],r=o;r;)i.push(r),t[r],r=t[r];return i.reverse(),i},find_path:function(t,i,r){var n=o.single_source_shortest_paths(t,i,r);return o.extract_shortest_path_from_predecessor_list(n,r)},PriorityQueue:{make:function(t){var i,r=o.PriorityQueue,n={};for(i in t=t||{},r)r.hasOwnProperty(i)&&(n[i]=r[i]);return n.queue=[],n.sorter=t.sorter||r.default_sorter,n},default_sorter:function(t,o){return t.cost-o.cost},push:function(t,o){this.queue.push({value:t,cost:o}),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};t.exports=o},2378:function(t){"use strict";t.exports=function(t){for(var o=[],i=t.length,r=0;r<i;r++){var n=t.charCodeAt(r);if(n>=55296&&n<=56319&&i>r+1){var a=t.charCodeAt(r+1);a>=56320&&a<=57343&&(n=(n-55296)*1024+a-56320+65536,r+=1)}if(n<128){o.push(n);continue}if(n<2048){o.push(n>>6|192),o.push(63&n|128);continue}if(n<55296||n>=57344&&n<65536){o.push(n>>12|224),o.push(n>>6&63|128),o.push(63&n|128);continue}if(n>=65536&&n<=1114111){o.push(n>>18|240),o.push(n>>12&63|128),o.push(n>>6&63|128),o.push(63&n|128);continue}o.push(239,191,189)}return new Uint8Array(o).buffer}},635:function(t,o,i){"use strict";i.r(o),i.d(o,{W3mAllWalletsView:function(){return t5},W3mConnectingWcBasicView:function(){return tE},W3mDownloadsView:function(){return t8}});var r=i(9064),n=i(9527),a=i(3241),l=i(8113),s=i(7500),c=i(4125),d=i(446);i(2100);var u=i(5162),p=i(9793),w=i(1440),g=i(1568);i(5598),i(9556),i(5004);var b=i(4134),f=i(5729);i(6630),i(1059);var m=r.iv`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`,__decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let v=class extends r.oi{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let t="xxs";return t="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`
       --local-border-radius: var(--wui-border-radius-${t});
       --local-size: var(--wui-wallet-image-size-${this.size});
   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),r.dy`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?r.dy`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?r.dy`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:r.dy`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};v.styles=[b.ZM,b.ET,m],__decorate([(0,n.Cb)()],v.prototype,"size",void 0),__decorate([(0,n.Cb)()],v.prototype,"name",void 0),__decorate([(0,n.Cb)()],v.prototype,"imageSrc",void 0),__decorate([(0,n.Cb)()],v.prototype,"walletIcon",void 0),__decorate([(0,n.Cb)({type:Boolean})],v.prototype,"installed",void 0),__decorate([(0,n.Cb)()],v.prototype,"badgeSize",void 0),v=__decorate([(0,f.M)("wui-wallet-image")],v);var y=r.iv`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`,wui_all_wallets_image_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let _=class extends r.oi{constructor(){super(...arguments),this.walletImages=[]}render(){let t=this.walletImages.length<4;return r.dy`${this.walletImages.slice(0,4).map(({src:t,walletName:o})=>r.dy`
            <wui-wallet-image
              size="inherit"
              imageSrc=${t}
              name=${(0,u.o)(o)}
            ></wui-wallet-image>
          `)}
      ${t?[...Array(4-this.walletImages.length)].map(()=>r.dy` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};_.styles=[b.ET,y],wui_all_wallets_image_decorate([(0,n.Cb)({type:Array})],_.prototype,"walletImages",void 0),_=wui_all_wallets_image_decorate([(0,f.M)("wui-all-wallets-image")],_),i(5185);var x=r.iv`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`,wui_list_wallet_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let C=class extends r.oi{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return r.dy`
      <button ?disabled=${this.disabled} tabindex=${(0,u.o)(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?r.dy` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?r.dy` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?r.dy`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:r.dy`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?r.dy`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?r.dy`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?r.dy`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};C.styles=[b.ET,b.ZM,x],wui_list_wallet_decorate([(0,n.Cb)({type:Array})],C.prototype,"walletImages",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"imageSrc",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"name",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"tagLabel",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"tagVariant",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"icon",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"walletIcon",void 0),wui_list_wallet_decorate([(0,n.Cb)()],C.prototype,"tabIdx",void 0),wui_list_wallet_decorate([(0,n.Cb)({type:Boolean})],C.prototype,"installed",void 0),wui_list_wallet_decorate([(0,n.Cb)({type:Boolean})],C.prototype,"disabled",void 0),wui_list_wallet_decorate([(0,n.Cb)({type:Boolean})],C.prototype,"showAllWallets",void 0),wui_list_wallet_decorate([(0,n.Cb)({type:Boolean})],C.prototype,"loading",void 0),wui_list_wallet_decorate([(0,n.Cb)({type:String})],C.prototype,"loadingSpinnerColor",void 0),C=wui_list_wallet_decorate([(0,f.M)("wui-list-wallet")],C);var w3m_all_wallets_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let $=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.count=l.ApiController.state.count,this.filteredCount=l.ApiController.state.filteredWallets.length,this.isFetchingRecommendedWallets=l.ApiController.state.isFetchingRecommendedWallets,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t),l.ApiController.subscribeKey("count",t=>this.count=t),l.ApiController.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),l.ApiController.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.find(t=>"walletConnect"===t.id),{allWallets:o}=s.OptionsController.state;if(!t||"HIDE"===o||"ONLY_MOBILE"===o&&!a.j.isMobile())return null;let i=l.ApiController.state.featured.length,n=this.count+i,c=this.filteredCount>0?this.filteredCount:n<10?n:10*Math.floor(n/10),d=`${c}`;return this.filteredCount>0?d=`${this.filteredCount}`:c<n&&(d=`${c}+`),r.dy`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${d}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${(0,u.o)(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){w.X.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),g.RouterController.push("AllWallets")}};w3m_all_wallets_widget_decorate([(0,n.Cb)()],$.prototype,"tabIdx",void 0),w3m_all_wallets_widget_decorate([(0,n.SB)()],$.prototype,"connectors",void 0),w3m_all_wallets_widget_decorate([(0,n.SB)()],$.prototype,"count",void 0),w3m_all_wallets_widget_decorate([(0,n.SB)()],$.prototype,"filteredCount",void 0),w3m_all_wallets_widget_decorate([(0,n.SB)()],$.prototype,"isFetchingRecommendedWallets",void 0),$=w3m_all_wallets_widget_decorate([(0,d.Mo)("w3m-all-wallets-widget")],$);var k=i(4639),R=i(1697),w3m_connect_announced_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let S=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"ANNOUNCED"===t.type);return t?.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(R.C.showConnector).map(t=>r.dy`
              <wui-list-wallet
                imageSrc=${(0,u.o)(k.f.getConnectorImage(t))}
                name=${t.name??"Unknown"}
                @click=${()=>this.onConnector(t)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${t.id}`}
                .installed=${!0}
                tabIdx=${(0,u.o)(this.tabIdx)}
              >
              </wui-list-wallet>
            `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){"walletConnect"===t.id?a.j.isMobile()?g.RouterController.push("AllWallets"):g.RouterController.push("ConnectingWalletConnect"):g.RouterController.push("ConnectingExternal",{connector:t})}};w3m_connect_announced_widget_decorate([(0,n.Cb)()],S.prototype,"tabIdx",void 0),w3m_connect_announced_widget_decorate([(0,n.SB)()],S.prototype,"connectors",void 0),S=w3m_connect_announced_widget_decorate([(0,d.Mo)("w3m-connect-announced-widget")],S);var E=i(8859),w3m_connect_custom_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let I=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.loading=!1,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t)),a.j.isTelegram()&&a.j.isIos()&&(this.loading=!E.ConnectionController.state.wcUri,this.unsubscribe.push(E.ConnectionController.subscribeKey("wcUri",t=>this.loading=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let{customWallets:t}=s.OptionsController.state;if(!t?.length)return this.style.cssText="display: none",null;let o=this.filterOutDuplicateWallets(t);return r.dy`<wui-flex flexDirection="column" gap="xs">
      ${o.map(t=>r.dy`
          <wui-list-wallet
            imageSrc=${(0,u.o)(k.f.getWalletImage(t))}
            name=${t.name??"Unknown"}
            @click=${()=>this.onConnectWallet(t)}
            data-testid=${`wallet-selector-${t.id}`}
            tabIdx=${(0,u.o)(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(t){let o=c.M.getRecentWallets(),i=this.connectors.map(t=>t.info?.rdns).filter(Boolean),r=o.map(t=>t.rdns).filter(Boolean),n=i.concat(r);if(n.includes("io.metamask.mobile")&&a.j.isMobile()){let t=n.indexOf("io.metamask.mobile");n[t]="io.metamask"}let l=t.filter(t=>!n.includes(String(t?.rdns)));return l}onConnectWallet(t){this.loading||g.RouterController.push("ConnectingWalletConnect",{wallet:t})}};w3m_connect_custom_widget_decorate([(0,n.Cb)()],I.prototype,"tabIdx",void 0),w3m_connect_custom_widget_decorate([(0,n.SB)()],I.prototype,"connectors",void 0),w3m_connect_custom_widget_decorate([(0,n.SB)()],I.prototype,"loading",void 0),I=w3m_connect_custom_widget_decorate([(0,d.Mo)("w3m-connect-custom-widget")],I);var j=i(8314),w3m_connect_external_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let T=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"EXTERNAL"===t.type),o=t.filter(R.C.showConnector),i=o.filter(t=>t.id!==j.b.CONNECTOR_ID.COINBASE_SDK);return i?.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${i.map(t=>r.dy`
            <wui-list-wallet
              imageSrc=${(0,u.o)(k.f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              data-testid=${`wallet-selector-external-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.o)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){g.RouterController.push("ConnectingExternal",{connector:t})}};w3m_connect_external_widget_decorate([(0,n.Cb)()],T.prototype,"tabIdx",void 0),w3m_connect_external_widget_decorate([(0,n.SB)()],T.prototype,"connectors",void 0),T=w3m_connect_external_widget_decorate([(0,d.Mo)("w3m-connect-external-widget")],T);var w3m_connect_featured_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let B=class extends r.oi{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(t=>r.dy`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${(0,u.o)(k.f.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${(0,u.o)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){p.ConnectorController.selectWalletConnector(t)}};w3m_connect_featured_widget_decorate([(0,n.Cb)()],B.prototype,"tabIdx",void 0),w3m_connect_featured_widget_decorate([(0,n.Cb)()],B.prototype,"wallets",void 0),B=w3m_connect_featured_widget_decorate([(0,d.Mo)("w3m-connect-featured-widget")],B);var w3m_connect_injected_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let P=class extends r.oi{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){let t=this.connectors.filter(R.C.showConnector);return 0===t.length?(this.style.cssText="display: none",null):r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r.dy`
            <wui-list-wallet
              imageSrc=${(0,u.o)(k.f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.o)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnector(t){p.ConnectorController.setActiveConnector(t),g.RouterController.push("ConnectingExternal",{connector:t})}};w3m_connect_injected_widget_decorate([(0,n.Cb)()],P.prototype,"tabIdx",void 0),w3m_connect_injected_widget_decorate([(0,n.Cb)()],P.prototype,"connectors",void 0),P=w3m_connect_injected_widget_decorate([(0,d.Mo)("w3m-connect-injected-widget")],P);var w3m_connect_multi_chain_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let O=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"MULTI_CHAIN"===t.type&&"WalletConnect"!==t.name);return t?.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r.dy`
            <wui-list-wallet
              imageSrc=${(0,u.o)(k.f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.o)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){p.ConnectorController.setActiveConnector(t),g.RouterController.push("ConnectingMultiChain")}};w3m_connect_multi_chain_widget_decorate([(0,n.Cb)()],O.prototype,"tabIdx",void 0),w3m_connect_multi_chain_widget_decorate([(0,n.SB)()],O.prototype,"connectors",void 0),O=w3m_connect_multi_chain_widget_decorate([(0,d.Mo)("w3m-connect-multi-chain-widget")],O);var A=i(9757),L=i(2786),w3m_connect_recent_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let M=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.loading=!1,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t)),a.j.isTelegram()&&a.j.isIos()&&(this.loading=!E.ConnectionController.state.wcUri,this.unsubscribe.push(E.ConnectionController.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let t=c.M.getRecentWallets(),o=t.filter(t=>!L.J.isExcluded(t)).filter(t=>!this.hasWalletConnector(t)).filter(t=>this.isWalletCompatibleWithCurrentChain(t));return o.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${o.map(t=>r.dy`
            <wui-list-wallet
              imageSrc=${(0,u.o)(k.f.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${(0,u.o)(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){this.loading||p.ConnectorController.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some(o=>o.id===t.id||o.name===t.name)}isWalletCompatibleWithCurrentChain(t){let o=A.R.state.activeChain;return!o||!t.chains||t.chains.some(t=>{let i=t.split(":")[0];return o===i})}};w3m_connect_recent_widget_decorate([(0,n.Cb)()],M.prototype,"tabIdx",void 0),w3m_connect_recent_widget_decorate([(0,n.SB)()],M.prototype,"connectors",void 0),w3m_connect_recent_widget_decorate([(0,n.SB)()],M.prototype,"loading",void 0),M=w3m_connect_recent_widget_decorate([(0,d.Mo)("w3m-connect-recent-widget")],M);var w3m_connect_recommended_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let W=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,a.j.isTelegram()&&a.j.isIos()&&(this.loading=!E.ConnectionController.state.wcUri,this.unsubscribe.push(E.ConnectionController.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let{connectors:t}=p.ConnectorController.state,{customWallets:o,featuredWalletIds:i}=s.OptionsController.state,n=c.M.getRecentWallets(),a=t.find(t=>"walletConnect"===t.id),l=t.filter(t=>"INJECTED"===t.type||"ANNOUNCED"===t.type||"MULTI_CHAIN"===t.type),d=l.filter(t=>"Browser Wallet"!==t.name);if(!a)return null;if(i||o||!this.wallets.length)return this.style.cssText="display: none",null;let w=d.length+n.length,g=L.J.filterOutDuplicateWallets(this.wallets).slice(0,Math.max(0,2-w));return g.length?r.dy`
      <wui-flex flexDirection="column" gap="xs">
        ${g.map(t=>r.dy`
            <wui-list-wallet
              imageSrc=${(0,u.o)(k.f.getWalletImage(t))}
              name=${t?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${(0,u.o)(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){if(this.loading)return;let o=p.ConnectorController.getConnector(t.id,t.rdns);o?g.RouterController.push("ConnectingExternal",{connector:o}):g.RouterController.push("ConnectingWalletConnect",{wallet:t})}};w3m_connect_recommended_widget_decorate([(0,n.Cb)()],W.prototype,"tabIdx",void 0),w3m_connect_recommended_widget_decorate([(0,n.Cb)()],W.prototype,"wallets",void 0),w3m_connect_recommended_widget_decorate([(0,n.SB)()],W.prototype,"loading",void 0),W=w3m_connect_recommended_widget_decorate([(0,d.Mo)("w3m-connect-recommended-widget")],W);var z=i(7374),w3m_connect_walletconnect_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let D=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.connectorImages=z.W.state.connectorImages,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t),z.W.subscribeKey("connectorImages",t=>this.connectorImages=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(a.j.isMobile())return this.style.cssText="display: none",null;let t=this.connectors.find(t=>"walletConnect"===t.id);if(!t)return this.style.cssText="display: none",null;let o=t.imageUrl||this.connectorImages[t?.imageId??""];return r.dy`
      <wui-list-wallet
        imageSrc=${(0,u.o)(o)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${(0,u.o)(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(t){p.ConnectorController.setActiveConnector(t),g.RouterController.push("ConnectingWalletConnect")}};w3m_connect_walletconnect_widget_decorate([(0,n.Cb)()],D.prototype,"tabIdx",void 0),w3m_connect_walletconnect_widget_decorate([(0,n.SB)()],D.prototype,"connectors",void 0),w3m_connect_walletconnect_widget_decorate([(0,n.SB)()],D.prototype,"connectorImages",void 0),D=w3m_connect_walletconnect_widget_decorate([(0,d.Mo)("w3m-connect-walletconnect-widget")],D);var N=r.iv`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,w3m_connector_list_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let U=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=p.ConnectorController.state.connectors,this.recommended=l.ApiController.state.recommended,this.featured=l.ApiController.state.featured,this.unsubscribe.push(p.ConnectorController.subscribeKey("connectors",t=>this.connectors=t),l.ApiController.subscribeKey("recommended",t=>this.recommended=t),l.ApiController.subscribeKey("featured",t=>this.featured=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return r.dy`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){let{custom:t,recent:o,announced:i,injected:n,multiChain:a,recommended:l,featured:s,external:c}=R.C.getConnectorsByType(this.connectors,this.recommended,this.featured),d=R.C.getConnectorTypeOrder({custom:t,recent:o,announced:i,injected:n,multiChain:a,recommended:l,featured:s,external:c});return d.map(t=>{switch(t){case"injected":return r.dy`
            ${a.length?r.dy`<w3m-connect-multi-chain-widget
                  tabIdx=${(0,u.o)(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?r.dy`<w3m-connect-announced-widget
                  tabIdx=${(0,u.o)(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${n.length?r.dy`<w3m-connect-injected-widget
                  .connectors=${n}
                  tabIdx=${(0,u.o)(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return r.dy`<w3m-connect-walletconnect-widget
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return r.dy`<w3m-connect-recent-widget
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return r.dy`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return r.dy`<w3m-connect-custom-widget
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return r.dy`<w3m-connect-external-widget
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return r.dy`<w3m-connect-recommended-widget
            .wallets=${l}
            tabIdx=${(0,u.o)(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${t}`),null}})}};U.styles=N,w3m_connector_list_decorate([(0,n.Cb)()],U.prototype,"tabIdx",void 0),w3m_connector_list_decorate([(0,n.SB)()],U.prototype,"connectors",void 0),w3m_connector_list_decorate([(0,n.SB)()],U.prototype,"recommended",void 0),w3m_connector_list_decorate([(0,n.SB)()],U.prototype,"featured",void 0),U=w3m_connector_list_decorate([(0,d.Mo)("w3m-connector-list")],U);var q=i(8121),K=i(2879),H=r.iv`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`,wui_tabs_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let F=class extends r.oi{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`
      --local-tab: ${this.activeTab};
      --local-tab-width: ${this.localTabWidth};
    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((t,o)=>{let i=o===this.activeTab;return r.dy`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(o)}
          data-active=${i}
          data-testid="tab-${t.label?.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(t){return t.icon?r.dy`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,o){let i=this.buttons[this.activeTab],r=this.buttons[t],n=i?.querySelector("wui-text"),a=r?.querySelector("wui-text"),l=r?.getBoundingClientRect(),s=a?.getBoundingClientRect();i&&n&&!o&&t!==this.activeTab&&(n.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),r&&l&&s&&a&&(t!==this.activeTab||o)&&(this.localTabWidth=`${Math.round(l.width+s.width)+6}px`,r.animate([{width:`${l.width+s.width}px`}],{duration:o?0:500,fill:"forwards",easing:"ease"}),a.animate([{opacity:1}],{duration:o?0:125,delay:o?0:200,fill:"forwards",easing:"ease"}))}};F.styles=[b.ET,b.ZM,H],wui_tabs_decorate([(0,n.Cb)({type:Array})],F.prototype,"tabs",void 0),wui_tabs_decorate([(0,n.Cb)()],F.prototype,"onTabChange",void 0),wui_tabs_decorate([(0,n.Cb)({type:Array})],F.prototype,"buttons",void 0),wui_tabs_decorate([(0,n.Cb)({type:Boolean})],F.prototype,"disabled",void 0),wui_tabs_decorate([(0,n.Cb)()],F.prototype,"localTabWidth",void 0),wui_tabs_decorate([(0,n.SB)()],F.prototype,"activeTab",void 0),wui_tabs_decorate([(0,n.SB)()],F.prototype,"isDense",void 0),F=wui_tabs_decorate([(0,f.M)("wui-tabs")],F);var w3m_connecting_header_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let V=class extends r.oi{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.generateTabs();return r.dy`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let t=this.platforms.map(t=>"browser"===t?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===t?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===t?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===t?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===t?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:t})=>t),t}onTabChange(t){let o=this.platformTabs[t];o&&this.onSelectPlatfrom?.(o)}};w3m_connecting_header_decorate([(0,n.Cb)({type:Array})],V.prototype,"platforms",void 0),w3m_connecting_header_decorate([(0,n.Cb)()],V.prototype,"onSelectPlatfrom",void 0),V=w3m_connecting_header_decorate([(0,d.Mo)("w3m-connecting-header")],V);var Y=i(2858);i(1243);var J=r.iv`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`,wui_button_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let X={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},G={lg:"paragraph-600",md:"small-600"},Z={lg:"md",md:"md"},Q=class extends r.oi{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
    --local-opacity-100: ${this.loading?0:1};
    --local-opacity-000: ${this.loading?1:0};
    --local-border-radius: var(--wui-border-radius-${this.borderRadius});
    `;let t=this.textVariant??G[this.size];return r.dy`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){let t=Z[this.size],o=this.disabled?X.disabled:X[this.variant];return r.dy`<wui-loading-spinner color=${o} size=${t}></wui-loading-spinner>`}return r.dy``}};Q.styles=[b.ET,b.ZM,J],wui_button_decorate([(0,n.Cb)()],Q.prototype,"size",void 0),wui_button_decorate([(0,n.Cb)({type:Boolean})],Q.prototype,"disabled",void 0),wui_button_decorate([(0,n.Cb)({type:Boolean})],Q.prototype,"fullWidth",void 0),wui_button_decorate([(0,n.Cb)({type:Boolean})],Q.prototype,"loading",void 0),wui_button_decorate([(0,n.Cb)()],Q.prototype,"variant",void 0),wui_button_decorate([(0,n.Cb)({type:Boolean})],Q.prototype,"hasIconLeft",void 0),wui_button_decorate([(0,n.Cb)({type:Boolean})],Q.prototype,"hasIconRight",void 0),wui_button_decorate([(0,n.Cb)()],Q.prototype,"borderRadius",void 0),wui_button_decorate([(0,n.Cb)()],Q.prototype,"textVariant",void 0),Q=wui_button_decorate([(0,f.M)("wui-button")],Q),i(5642);var tt=r.iv`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`,wui_link_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let te=class extends r.oi{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return r.dy`
      <button ?disabled=${this.disabled} tabindex=${(0,u.o)(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};te.styles=[b.ET,b.ZM,tt],wui_link_decorate([(0,n.Cb)()],te.prototype,"tabIdx",void 0),wui_link_decorate([(0,n.Cb)({type:Boolean})],te.prototype,"disabled",void 0),wui_link_decorate([(0,n.Cb)()],te.prototype,"color",void 0),te=wui_link_decorate([(0,f.M)("wui-link")],te);var to=r.iv`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,wui_loading_thumbnail_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let ti=class extends r.oi{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let t=this.radius>50?50:this.radius,o=36-t;return r.dy`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${116+o} ${245+o}"
          stroke-dashoffset=${360+1.75*o}
        />
      </svg>
    `}};ti.styles=[b.ET,to],wui_loading_thumbnail_decorate([(0,n.Cb)({type:Number})],ti.prototype,"radius",void 0),ti=wui_loading_thumbnail_decorate([(0,f.M)("wui-loading-thumbnail")],ti),i(8390);var tr=r.iv`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`,wui_chip_button_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tn=class extends r.oi{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let t="sm"===this.size?"small-600":"paragraph-600";return r.dy`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?r.dy`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${t} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};tn.styles=[b.ET,b.ZM,tr],wui_chip_button_decorate([(0,n.Cb)()],tn.prototype,"variant",void 0),wui_chip_button_decorate([(0,n.Cb)()],tn.prototype,"imageSrc",void 0),wui_chip_button_decorate([(0,n.Cb)({type:Boolean})],tn.prototype,"disabled",void 0),wui_chip_button_decorate([(0,n.Cb)()],tn.prototype,"icon",void 0),wui_chip_button_decorate([(0,n.Cb)()],tn.prototype,"size",void 0),wui_chip_button_decorate([(0,n.Cb)()],tn.prototype,"text",void 0),tn=wui_chip_button_decorate([(0,f.M)("wui-chip-button")],tn);var ta=r.iv`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`,wui_cta_button_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tl=class extends r.oi{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return r.dy`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};tl.styles=[b.ET,b.ZM,ta],wui_cta_button_decorate([(0,n.Cb)({type:Boolean})],tl.prototype,"disabled",void 0),wui_cta_button_decorate([(0,n.Cb)()],tl.prototype,"label",void 0),wui_cta_button_decorate([(0,n.Cb)()],tl.prototype,"buttonLabel",void 0),tl=wui_cta_button_decorate([(0,f.M)("wui-cta-button")],tl);var ts=r.iv`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`,w3m_mobile_download_links_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tc=class extends r.oi{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:t,app_store:o,play_store:i,chrome_store:n,homepage:l}=this.wallet,s=a.j.isMobile(),c=a.j.isIos(),u=a.j.isAndroid(),p=[o,i,l,n].filter(Boolean).length>1,w=d.Hg.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return p&&!s?r.dy`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${()=>g.RouterController.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!p&&l?r.dy`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:o&&c?r.dy`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&u?r.dy`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&a.j.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&a.j.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&a.j.openHref(this.wallet.homepage,"_blank")}};tc.styles=[ts],w3m_mobile_download_links_decorate([(0,n.Cb)({type:Object})],tc.prototype,"wallet",void 0),tc=w3m_mobile_download_links_decorate([(0,d.Mo)("w3m-mobile-download-links")],tc);var td=r.iv`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`,w3m_connecting_widget_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let W3mConnectingWidget=class W3mConnectingWidget extends r.oi{constructor(){super(),this.wallet=g.RouterController.state.data?.wallet,this.connector=g.RouterController.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=k.f.getWalletImage(this.wallet)??k.f.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=E.ConnectionController.state.wcUri,this.error=E.ConnectionController.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(...[E.ConnectionController.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),E.ConnectionController.subscribeKey("wcError",t=>this.error=t)]),(a.j.isTelegram()||a.j.isSafari())&&a.j.isIos()&&E.ConnectionController.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),E.ConnectionController.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,o=`Continue in ${this.name}`;return this.error&&(o="Connection declined"),r.dy`
      <wui-flex
        data-error=${(0,u.o)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,u.o)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${o}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?r.dy`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?r.dy`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let t=this.shadowRoot?.querySelector("wui-button");t?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){E.ConnectionController.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let t=Y.ThemeController.state.themeVariables["--w3m-border-radius-master"],o=t?parseInt(t.replace("px",""),10):4;return r.dy`<wui-loading-thumbnail radius=${9*o}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(a.j.copyToClopboard(this.uri),K.SnackController.showSuccess("Link copied"))}catch{K.SnackController.showError("Failed to copy")}}};W3mConnectingWidget.styles=td,w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"isRetrying",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"uri",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"error",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"ready",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"showRetry",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"secondaryBtnLabel",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"secondaryLabel",void 0),w3m_connecting_widget_decorate([(0,n.SB)()],W3mConnectingWidget.prototype,"isLoading",void 0),w3m_connecting_widget_decorate([(0,n.Cb)({type:Boolean})],W3mConnectingWidget.prototype,"isMobile",void 0),w3m_connecting_widget_decorate([(0,n.Cb)()],W3mConnectingWidget.prototype,"onRetry",void 0);let tu=class extends W3mConnectingWidget{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;let{connectors:t}=p.ConnectorController.state,o=t.find(t=>"ANNOUNCED"===t.type&&t.info?.rdns===this.wallet?.rdns||"INJECTED"===t.type||t.name===this.wallet?.name);if(o)await E.ConnectionController.connectExternal(o,o.chain);else throw Error("w3m-connecting-wc-browser: No connector found");q.I.close(),w.X.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(t){w.X.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};tu=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,d.Mo)("w3m-connecting-wc-browser")],tu);let th=class extends W3mConnectingWidget{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:t,name:o}=this.wallet,{redirect:i,href:r}=a.j.formatNativeUrl(t,this.uri);E.ConnectionController.setWcLinking({name:o,href:r}),E.ConnectionController.setRecentWallet(this.wallet),a.j.openHref(i,"_blank")}catch{this.error=!0}}};th=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,d.Mo)("w3m-connecting-wc-desktop")],th);var tp=i(7205),w3m_connecting_wc_mobile_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tw=class extends W3mConnectingWidget{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=s.OptionsController.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:t,link_mode:o,name:i}=this.wallet,{redirect:r,redirectUniversalLink:n,href:l}=a.j.formatNativeUrl(t,this.uri,o);this.redirectDeeplink=r,this.redirectUniversalLink=n,this.target=a.j.isIframe()?"_top":"_self",E.ConnectionController.setWcLinking({name:i,href:l}),E.ConnectionController.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?a.j.openHref(this.redirectUniversalLink,this.target):a.j.openHref(this.redirectDeeplink,this.target)}catch(t){w.X.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=tp.bq.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(E.ConnectionController.subscribeKey("wcUri",()=>{this.onHandleURI()})),w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){E.ConnectionController.setWcError(!1),this.onConnect?.()}};w3m_connecting_wc_mobile_decorate([(0,n.SB)()],tw.prototype,"redirectDeeplink",void 0),w3m_connecting_wc_mobile_decorate([(0,n.SB)()],tw.prototype,"redirectUniversalLink",void 0),w3m_connecting_wc_mobile_decorate([(0,n.SB)()],tw.prototype,"target",void 0),w3m_connecting_wc_mobile_decorate([(0,n.SB)()],tw.prototype,"preferUniversalLinks",void 0),w3m_connecting_wc_mobile_decorate([(0,n.SB)()],tw.prototype,"isLoading",void 0),tw=w3m_connecting_wc_mobile_decorate([(0,d.Mo)("w3m-connecting-wc-mobile")],tw);var tg=i(8374);function isAdjecentDots(t,o,i){return t!==o&&(t-o<0?o-t:t-o)<=i+.1}let tb={generate({uri:t,size:o,logoSize:i,dotColor:n="#141414"}){let a=[],l=function(t,o){let i=Array.prototype.slice.call(tg.create(t,{errorCorrectionLevel:"Q"}).modules.data,0),r=Math.sqrt(i.length);return i.reduce((t,o,i)=>(i%r==0?t.push([o]):t[t.length-1].push(o))&&t,[])}(t,0),s=o/l.length,c=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];c.forEach(({x:t,y:o})=>{let i=(l.length-7)*s*t,d=(l.length-7)*s*o;for(let t=0;t<c.length;t+=1){let o=s*(7-2*t);a.push(r.YP`
            <rect
              fill=${2===t?n:"transparent"}
              width=${0===t?o-5:o}
              rx= ${0===t?(o-5)*.45:.45*o}
              ry= ${0===t?(o-5)*.45:.45*o}
              stroke=${n}
              stroke-width=${0===t?5:0}
              height=${0===t?o-5:o}
              x= ${0===t?d+s*t+2.5:d+s*t}
              y= ${0===t?i+s*t+2.5:i+s*t}
            />
          `)}});let d=Math.floor((i+25)/s),u=l.length/2-d/2,p=l.length/2+d/2-1,w=[];l.forEach((t,o)=>{t.forEach((t,i)=>{if(l[o][i]&&!(o<7&&i<7||o>l.length-8&&i<7||o<7&&i>l.length-8)&&!(o>u&&o<p&&i>u&&i<p)){let t=o*s+s/2,r=i*s+s/2;w.push([t,r])}})});let g={};return w.forEach(([t,o])=>{g[t]?g[t]?.push(o):g[t]=[o]}),Object.entries(g).map(([t,o])=>{let i=o.filter(t=>o.every(o=>!isAdjecentDots(t,o,s)));return[Number(t),i]}).forEach(([t,o])=>{o.forEach(o=>{a.push(r.YP`<circle cx=${t} cy=${o} fill=${n} r=${s/2.5} />`)})}),Object.entries(g).filter(([t,o])=>o.length>1).map(([t,o])=>{let i=o.filter(t=>o.some(o=>isAdjecentDots(t,o,s)));return[Number(t),i]}).map(([t,o])=>{o.sort((t,o)=>t<o?-1:1);let i=[];for(let t of o){let o=i.find(o=>o.some(o=>isAdjecentDots(t,o,s)));o?o.push(t):i.push([t])}return[t,i.map(t=>[t[0],t[t.length-1]])]}).forEach(([t,o])=>{o.forEach(([o,i])=>{a.push(r.YP`
              <line
                x1=${t}
                x2=${t}
                y1=${o}
                y2=${i}
                stroke=${n}
                stroke-width=${s/1.25}
                stroke-linecap="round"
              />
            `)})}),a}};var tf=r.iv`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`,wui_qr_code_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tm=class extends r.oi{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??"#3396ff"}
    `,r.dy`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let t="light"===this.theme?this.size:this.size-32;return r.YP`
      <svg height=${t} width=${t}>
        ${tb.generate({uri:this.uri,size:t,logoSize:this.arenaClear?0:t/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?r.dy`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?r.dy`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:r.dy`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};tm.styles=[b.ET,tf],wui_qr_code_decorate([(0,n.Cb)()],tm.prototype,"uri",void 0),wui_qr_code_decorate([(0,n.Cb)({type:Number})],tm.prototype,"size",void 0),wui_qr_code_decorate([(0,n.Cb)()],tm.prototype,"theme",void 0),wui_qr_code_decorate([(0,n.Cb)()],tm.prototype,"imageSrc",void 0),wui_qr_code_decorate([(0,n.Cb)()],tm.prototype,"alt",void 0),wui_qr_code_decorate([(0,n.Cb)()],tm.prototype,"color",void 0),wui_qr_code_decorate([(0,n.Cb)({type:Boolean})],tm.prototype,"arenaClear",void 0),wui_qr_code_decorate([(0,n.Cb)({type:Boolean})],tm.prototype,"farcaster",void 0),tm=wui_qr_code_decorate([(0,f.M)("wui-qr-code")],tm);var tv=r.iv`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`,wui_shimmer_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let ty=class extends r.oi{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);
    `,r.dy`<slot></slot>`}};ty.styles=[tv],wui_shimmer_decorate([(0,n.Cb)()],ty.prototype,"width",void 0),wui_shimmer_decorate([(0,n.Cb)()],ty.prototype,"height",void 0),wui_shimmer_decorate([(0,n.Cb)()],ty.prototype,"borderRadius",void 0),wui_shimmer_decorate([(0,n.Cb)()],ty.prototype,"variant",void 0),ty=wui_shimmer_decorate([(0,f.M)("wui-shimmer")],ty);var t_=r.iv`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;let tx=class extends r.oi{render(){return r.dy`
      <a
        data-testid="ux-branding-reown"
        href=${"https://reown.com"}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};tx.styles=[b.ET,b.ZM,t_],tx=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,f.M)("wui-ux-by-reown")],tx);var tC=r.iv`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`;let t$=class extends W3mConnectingWidget{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),r.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let t=this.getBoundingClientRect().width-40,o=this.wallet?this.wallet.name:void 0;return E.ConnectionController.setWcLinking(void 0),E.ConnectionController.setRecentWallet(this.wallet),r.dy` <wui-qr-code
      size=${t}
      theme=${Y.ThemeController.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,u.o)(k.f.getWalletImage(this.wallet))}
      color=${(0,u.o)(Y.ThemeController.state.themeVariables["--w3m-qr-color"])}
      alt=${(0,u.o)(o)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let t=!this.uri||!this.ready;return r.dy`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};t$.styles=tC,t$=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,d.Mo)("w3m-connecting-wc-qrcode")],t$);let tk=class extends r.oi{constructor(){if(super(),this.wallet=g.RouterController.state.data?.wallet,!this.wallet)throw Error("w3m-connecting-wc-unsupported: No wallet provided");w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return r.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,u.o)(k.f.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};tk=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,d.Mo)("w3m-connecting-wc-unsupported")],tk);var w3m_connecting_wc_web_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tR=class extends W3mConnectingWidget{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=tp.bq.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(E.ConnectionController.subscribeKey("wcUri",()=>{this.updateLoadingState()})),w.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:t,name:o}=this.wallet,{redirect:i,href:r}=a.j.formatUniversalUrl(t,this.uri);E.ConnectionController.setWcLinking({name:o,href:r}),E.ConnectionController.setRecentWallet(this.wallet),a.j.openHref(i,"_blank")}catch{this.error=!0}}};w3m_connecting_wc_web_decorate([(0,n.SB)()],tR.prototype,"isLoading",void 0),tR=w3m_connecting_wc_web_decorate([(0,d.Mo)("w3m-connecting-wc-web")],tR);var w3m_connecting_wc_view_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tS=class extends r.oi{constructor(){super(),this.wallet=g.RouterController.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!s.OptionsController.state.siwx,this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(s.OptionsController.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return r.dy`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?r.dy`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(t=!1){if("browser"!==this.platform&&(!s.OptionsController.state.manualWCControl||t))try{let{wcPairingExpiry:o,status:i}=E.ConnectionController.state;(t||s.OptionsController.state.enableEmbedded||a.j.isPairingExpired(o)||"connecting"===i)&&(await E.ConnectionController.connectWalletConnect(),this.isSiwxEnabled||q.I.close())}catch(t){w.X.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),E.ConnectionController.setWcError(!0),K.SnackController.showError(t.message??"Connection error"),E.ConnectionController.resetWcConnection(),g.RouterController.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:t,desktop_link:o,webapp_link:i,injected:r,rdns:n}=this.wallet,l=r?.map(({injected_id:t})=>t).filter(Boolean),c=[...n?[n]:l??[]],d=!s.OptionsController.state.isUniversalProvider&&c.length,u=E.ConnectionController.checkInstalled(c),p=d&&u,w=o&&!a.j.isMobile();p&&!A.R.state.noAdapters&&this.platforms.push("browser"),t&&this.platforms.push(a.j.isMobile()?"mobile":"qrcode"),i&&this.platforms.push("web"),w&&this.platforms.push("desktop"),p||!d||A.R.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return r.dy`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return r.dy`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return r.dy`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return r.dy`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return r.dy`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return r.dy`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){let t=this.platforms.length>1;return t?r.dy`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){let o=this.shadowRoot?.querySelector("div");o&&(await o.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,o.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};w3m_connecting_wc_view_decorate([(0,n.SB)()],tS.prototype,"platform",void 0),w3m_connecting_wc_view_decorate([(0,n.SB)()],tS.prototype,"platforms",void 0),w3m_connecting_wc_view_decorate([(0,n.SB)()],tS.prototype,"isSiwxEnabled",void 0),w3m_connecting_wc_view_decorate([(0,n.SB)()],tS.prototype,"remoteFeatures",void 0),tS=w3m_connecting_wc_view_decorate([(0,d.Mo)("w3m-connecting-wc-view")],tS);var w3m_connecting_wc_basic_view_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tE=class extends r.oi{constructor(){super(...arguments),this.isMobile=a.j.isMobile()}render(){if(this.isMobile){let{featured:t,recommended:o}=l.ApiController.state,{customWallets:i}=s.OptionsController.state,n=c.M.getRecentWallets(),a=t.length||o.length||i?.length||n.length;return r.dy`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${a?r.dy`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return r.dy`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};w3m_connecting_wc_basic_view_decorate([(0,n.SB)()],tE.prototype,"isMobile",void 0),tE=w3m_connecting_wc_basic_view_decorate([(0,d.Mo)("w3m-connecting-wc-basic-view")],tE);var tI=i(3692),tj=i(5206),tT=i(875);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let e=()=>new h;let h=class h{};let tB=new WeakMap,tP=(0,tT.XM)(class extends tj.sR{render(t){return tI.Ld}update(t,[o]){let i=o!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=o,this.ht=t.options?.host,this.rt(this.ct=t.element)),tI.Ld}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){let o=this.ht??globalThis,i=tB.get(o);void 0===i&&(i=new WeakMap,tB.set(o,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?tB.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var tO=r.iv`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`,wui_switch_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tA=class extends r.oi{constructor(){super(...arguments),this.inputElementRef=e(),this.checked=void 0}render(){return r.dy`
      <label>
        <input
          ${tP(this.inputElementRef)}
          type="checkbox"
          ?checked=${(0,u.o)(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};tA.styles=[b.ET,b.ZM,b.Bp,tO],wui_switch_decorate([(0,n.Cb)({type:Boolean})],tA.prototype,"checked",void 0),tA=wui_switch_decorate([(0,f.M)("wui-switch")],tA);var tL=r.iv`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`,wui_certified_switch_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tM=class extends r.oi{constructor(){super(...arguments),this.checked=void 0}render(){return r.dy`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${(0,u.o)(this.checked)}></wui-switch>
      </button>
    `}};tM.styles=[b.ET,b.ZM,tL],wui_certified_switch_decorate([(0,n.Cb)({type:Boolean})],tM.prototype,"checked",void 0),tM=wui_certified_switch_decorate([(0,f.M)("wui-certified-switch")],tM);var tW=r.iv`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`,wui_input_element_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tz=class extends r.oi{constructor(){super(...arguments),this.icon="copy"}render(){return r.dy`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};tz.styles=[b.ET,b.ZM,tW],wui_input_element_decorate([(0,n.Cb)()],tz.prototype,"icon",void 0),tz=wui_input_element_decorate([(0,f.M)("wui-input-element")],tz);var tD=i(8536),tN=r.iv`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`,wui_input_text_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tU=class extends r.oi{constructor(){super(...arguments),this.inputElementRef=e(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){let t=`wui-padding-right-${this.inputRightPadding}`,o=`wui-size-${this.size}`,i={[o]:!0,[t]:!!this.inputRightPadding};return r.dy`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${tP(this.inputElementRef)}
        class=${(0,tD.$)(i)}
        type=${this.type}
        enterkeyhint=${(0,u.o)(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${(0,u.o)(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?r.dy`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};tU.styles=[b.ET,b.ZM,tN],wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"size",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"icon",void 0),wui_input_text_decorate([(0,n.Cb)({type:Boolean})],tU.prototype,"disabled",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"placeholder",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"type",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"keyHint",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"value",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"inputRightPadding",void 0),wui_input_text_decorate([(0,n.Cb)()],tU.prototype,"tabIdx",void 0),tU=wui_input_text_decorate([(0,f.M)("wui-input-text")],tU);var tq=r.iv`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;let tK=class extends r.oi{constructor(){super(...arguments),this.inputComponentRef=e()}render(){return r.dy`
      <wui-input-text
        ${tP(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){let t=this.inputComponentRef.value,o=t?.inputElementRef.value;o&&(o.value="",o.focus(),o.dispatchEvent(new Event("input")))}};tK.styles=[b.ET,tq],tK=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,f.M)("wui-search-bar")],tK);let tH=r.YP`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;var tF=r.iv`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`,wui_card_select_loader_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tV=class extends r.oi{constructor(){super(...arguments),this.type="wallet"}render(){return r.dy`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?r.dy` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${tH}`:r.dy`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};tV.styles=[b.ET,b.ZM,tF],wui_card_select_loader_decorate([(0,n.Cb)()],tV.prototype,"type",void 0),tV=wui_card_select_loader_decorate([(0,f.M)("wui-card-select-loader")],tV);var tY=i(1512),tJ=r.iv`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`,wui_grid_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tX=class extends r.oi{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&tY.H.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&tY.H.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&tY.H.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&tY.H.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&tY.H.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&tY.H.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&tY.H.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&tY.H.getSpacingStyles(this.margin,3)};
    `,r.dy`<slot></slot>`}};tX.styles=[b.ET,tJ],wui_grid_decorate([(0,n.Cb)()],tX.prototype,"gridTemplateRows",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"gridTemplateColumns",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"justifyItems",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"alignItems",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"justifyContent",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"alignContent",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"columnGap",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"rowGap",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"gap",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"padding",void 0),wui_grid_decorate([(0,n.Cb)()],tX.prototype,"margin",void 0),tX=wui_grid_decorate([(0,f.M)("wui-grid")],tX);var tG=r.iv`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`,w3m_all_wallets_list_item_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let tZ=class extends r.oi{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let t=this.wallet?.badge_type==="certified";return r.dy`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${(0,u.o)(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?r.dy`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return(this.visible||this.imageSrc)&&!this.imageLoading?r.dy`
      <wui-wallet-image
        size="md"
        imageSrc=${(0,u.o)(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `:this.shimmerTemplate()}shimmerTemplate(){return r.dy`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=k.f.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await k.f.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};tZ.styles=tG,w3m_all_wallets_list_item_decorate([(0,n.SB)()],tZ.prototype,"visible",void 0),w3m_all_wallets_list_item_decorate([(0,n.SB)()],tZ.prototype,"imageSrc",void 0),w3m_all_wallets_list_item_decorate([(0,n.SB)()],tZ.prototype,"imageLoading",void 0),w3m_all_wallets_list_item_decorate([(0,n.Cb)()],tZ.prototype,"wallet",void 0),tZ=w3m_all_wallets_list_item_decorate([(0,d.Mo)("w3m-all-wallets-list-item")],tZ);var tQ=r.iv`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`,w3m_all_wallets_list_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let t0="local-paginator",t1=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!l.ApiController.state.wallets.length,this.wallets=l.ApiController.state.wallets,this.recommended=l.ApiController.state.recommended,this.featured=l.ApiController.state.featured,this.filteredWallets=l.ApiController.state.filteredWallets,this.unsubscribe.push(...[l.ApiController.subscribeKey("wallets",t=>this.wallets=t),l.ApiController.subscribeKey("recommended",t=>this.recommended=t),l.ApiController.subscribeKey("featured",t=>this.featured=t),l.ApiController.subscribeKey("filteredWallets",t=>this.filteredWallets=t)])}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return r.dy`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let t=this.shadowRoot?.querySelector("wui-grid");t&&(await l.ApiController.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,o){return[...Array(t)].map(()=>r.dy`
        <wui-card-select-loader type="wallet" id=${(0,u.o)(o)}></wui-card-select-loader>
      `)}walletsTemplate(){let t=this.filteredWallets?.length>0?a.j.uniqueBy([...this.featured,...this.recommended,...this.filteredWallets],"id"):a.j.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id"),o=L.J.markWalletsAsInstalled(t);return o.map(t=>r.dy`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:t,recommended:o,featured:i,count:r}=l.ApiController.state,n=window.innerWidth<352?3:4,a=t.length+o.length,s=Math.ceil(a/n)*n-a+n;return(s-=t.length?i.length%n:0,0===r&&i.length>0)?null:0===r||[...i,...t,...o].length<r?this.shimmerTemplate(s,t0):null}createPaginationObserver(){let t=this.shadowRoot?.querySelector(`#${t0}`);t&&(this.paginationObserver=new IntersectionObserver(([t])=>{if(t?.isIntersecting&&!this.loading){let{page:t,count:o,wallets:i}=l.ApiController.state;i.length<o&&l.ApiController.fetchWalletsByPage({page:t+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){p.ConnectorController.selectWalletConnector(t)}};t1.styles=tQ,w3m_all_wallets_list_decorate([(0,n.SB)()],t1.prototype,"loading",void 0),w3m_all_wallets_list_decorate([(0,n.SB)()],t1.prototype,"wallets",void 0),w3m_all_wallets_list_decorate([(0,n.SB)()],t1.prototype,"recommended",void 0),w3m_all_wallets_list_decorate([(0,n.SB)()],t1.prototype,"featured",void 0),w3m_all_wallets_list_decorate([(0,n.SB)()],t1.prototype,"filteredWallets",void 0),t1=w3m_all_wallets_list_decorate([(0,d.Mo)("w3m-all-wallets-list")],t1);var t3=r.iv`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`,w3m_all_wallets_search_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let t2=class extends r.oi{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?r.dy`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await l.ApiController.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:t}=l.ApiController.state,o=L.J.markWalletsAsInstalled(t);return t.length?r.dy`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${o.map(t=>r.dy`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(t)}
              .wallet=${t}
              data-testid="wallet-search-item-${t.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:r.dy`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){p.ConnectorController.selectWalletConnector(t)}};t2.styles=t3,w3m_all_wallets_search_decorate([(0,n.SB)()],t2.prototype,"loading",void 0),w3m_all_wallets_search_decorate([(0,n.Cb)()],t2.prototype,"query",void 0),w3m_all_wallets_search_decorate([(0,n.Cb)()],t2.prototype,"badge",void 0),t2=w3m_all_wallets_search_decorate([(0,d.Mo)("w3m-all-wallets-search")],t2);var w3m_all_wallets_view_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let t5=class extends r.oi{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=a.j.debounce(t=>{this.search=t})}render(){let t=this.search.length>=2;return r.dy`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?r.dy`<w3m-all-wallets-search
            query=${this.search}
            badge=${(0,u.o)(this.badge)}
          ></w3m-all-wallets-search>`:r.dy`<w3m-all-wallets-list badge=${(0,u.o)(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){if("certified"===this.badge){this.badge=void 0;return}this.badge="certified",K.SnackController.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})}qrButtonTemplate(){return a.j.isMobile()?r.dy`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){g.RouterController.push("ConnectingWalletConnect")}};w3m_all_wallets_view_decorate([(0,n.SB)()],t5.prototype,"search",void 0),w3m_all_wallets_view_decorate([(0,n.SB)()],t5.prototype,"badge",void 0),t5=w3m_all_wallets_view_decorate([(0,d.Mo)("w3m-all-wallets-view")],t5);var t4=r.iv`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`,wui_list_item_decorate=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l};let t6=class extends r.oi{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return r.dy`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${(0,u.o)(this.iconVariant)}
        tabindex=${(0,u.o)(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return r.dy`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return r.dy`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){let t=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",o="square-blue"===this.iconVariant?"mdl":"md",i=this.iconSize?this.iconSize:o;return r.dy`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${i}
          background="transparent"
          iconColor=${t}
          backgroundColor=${t}
          size=${o}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?r.dy`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:r.dy``}chevronTemplate(){return this.chevron?r.dy`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};t6.styles=[b.ET,b.ZM,t4],wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"icon",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"iconSize",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"tabIdx",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"variant",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"iconVariant",void 0),wui_list_item_decorate([(0,n.Cb)({type:Boolean})],t6.prototype,"disabled",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"imageSrc",void 0),wui_list_item_decorate([(0,n.Cb)()],t6.prototype,"alt",void 0),wui_list_item_decorate([(0,n.Cb)({type:Boolean})],t6.prototype,"chevron",void 0),wui_list_item_decorate([(0,n.Cb)({type:Boolean})],t6.prototype,"loading",void 0),t6=wui_list_item_decorate([(0,f.M)("wui-list-item")],t6);let t8=class extends r.oi{constructor(){super(...arguments),this.wallet=g.RouterController.state.data?.wallet}render(){if(!this.wallet)throw Error("w3m-downloads-view");return r.dy`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?r.dy`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?r.dy`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?r.dy`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?r.dy`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&a.j.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&a.j.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&a.j.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&a.j.openHref(this.wallet.homepage,"_blank")}};t8=function(t,o,i,r){var n,a=arguments.length,l=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,o,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(l=(a<3?n(l):a>3?n(o,i,l):n(o,i))||l);return a>3&&l&&Object.defineProperty(o,i,l),l}([(0,d.Mo)("w3m-downloads-view")],t8)}}]);