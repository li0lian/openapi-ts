'use strict';var A=async(t,r)=>{let e=typeof r=="function"?await r(t):r;if(e)return t.scheme==="bearer"?`Bearer ${e}`:t.scheme==="basic"?`Basic ${btoa(e)}`:e},z=(t,r,e)=>{typeof e=="string"||e instanceof Blob?t.append(r,e):t.append(r,JSON.stringify(e));},j=(t,r,e)=>{typeof e=="string"?t.append(r,e):t.append(r,JSON.stringify(e));},v={bodySerializer:t=>{let r=new FormData;return Object.entries(t).forEach(([e,i])=>{i!=null&&(Array.isArray(i)?i.forEach(a=>z(r,e,a)):z(r,e,i));}),r}},b={bodySerializer:t=>JSON.stringify(t,(r,e)=>typeof e=="bigint"?e.toString():e)},$={bodySerializer:t=>{let r=new URLSearchParams;return Object.entries(t).forEach(([e,i])=>{i!=null&&(Array.isArray(i)?i.forEach(a=>j(r,e,a)):j(r,e,i));}),r}},T=t=>{switch(t){case "label":return ".";case "matrix":return ";";case "simple":return ",";default:return "&"}},U=t=>{switch(t){case "form":return ",";case "pipeDelimited":return "|";case "spaceDelimited":return "%20";default:return ","}},k=t=>{switch(t){case "label":return ".";case "matrix":return ";";case "simple":return ",";default:return "&"}},S=({allowReserved:t,explode:r,name:e,style:i,value:a})=>{if(!r){let s=(t?a:a.map(l=>encodeURIComponent(l))).join(U(i));switch(i){case "label":return `.${s}`;case "matrix":return `;${e}=${s}`;case "simple":return s;default:return `${e}=${s}`}}let o=T(i),n=a.map(s=>i==="label"||i==="simple"?t?s:encodeURIComponent(s):d({allowReserved:t,name:e,value:s})).join(o);return i==="label"||i==="matrix"?o+n:n},d=({allowReserved:t,name:r,value:e})=>{if(e==null)return "";if(typeof e=="object")throw new Error("Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these.");return `${r}=${t?e:encodeURIComponent(e)}`},O=({allowReserved:t,explode:r,name:e,style:i,value:a})=>{if(a instanceof Date)return `${e}=${a.toISOString()}`;if(i!=="deepObject"&&!r){let s=[];Object.entries(a).forEach(([p,c])=>{s=[...s,p,t?c:encodeURIComponent(c)];});let l=s.join(",");switch(i){case "form":return `${e}=${l}`;case "label":return `.${l}`;case "matrix":return `;${e}=${l}`;default:return l}}let o=k(i),n=Object.entries(a).map(([s,l])=>d({allowReserved:t,name:i==="deepObject"?`${e}[${s}]`:s,value:l})).join(o);return i==="label"||i==="matrix"?o+n:n};var _=/\{[^{}]+\}/g,D=({path:t,url:r})=>{let e=r,i=r.match(_);if(i)for(let a of i){let o=false,n=a.substring(1,a.length-1),s="simple";n.endsWith("*")&&(o=true,n=n.substring(0,n.length-1)),n.startsWith(".")?(n=n.substring(1),s="label"):n.startsWith(";")&&(n=n.substring(1),s="matrix");let l=t[n];if(l==null)continue;if(Array.isArray(l)){e=e.replace(a,S({explode:o,name:n,style:s,value:l}));continue}if(typeof l=="object"){e=e.replace(a,O({explode:o,name:n,style:s,value:l}));continue}if(s==="matrix"){e=e.replace(a,`;${d({name:n,value:l})}`);continue}let p=encodeURIComponent(s==="label"?`.${l}`:l);e=e.replace(a,p);}return e},q=({allowReserved:t,array:r,object:e}={})=>a=>{let o=[];if(a&&typeof a=="object")for(let n in a){let s=a[n];if(s!=null){if(Array.isArray(s)){o=[...o,S({allowReserved:t,explode:true,name:n,style:"form",value:s,...r})];continue}if(typeof s=="object"){o=[...o,O({allowReserved:t,explode:true,name:n,style:"deepObject",value:s,...e})];continue}o=[...o,d({allowReserved:t,name:n,value:s})];}}return o.join("&")},E=t=>{if(!t)return "stream";let r=t.split(";")[0]?.trim();if(r){if(r.startsWith("application/json")||r.endsWith("+json"))return "json";if(r==="multipart/form-data")return "formData";if(["application/","audio/","image/","video/"].some(e=>r.startsWith(e)))return "blob";if(r.startsWith("text/"))return "text"}},P=async({security:t,...r})=>{for(let e of t){let i=await A(e,r.auth);if(!i)continue;let a=e.name??"Authorization";switch(e.in){case "query":r.query||(r.query={}),r.query[a]=i;break;case "header":default:r.headers.set(a,i);break}return}},R=t=>H({baseUrl:t.baseUrl??"",path:t.path,query:t.query,querySerializer:typeof t.querySerializer=="function"?t.querySerializer:q(t.querySerializer),url:t.url}),H=({baseUrl:t,path:r,query:e,querySerializer:i,url:a})=>{let o=a.startsWith("/")?a:`/${a}`,n=t+o;r&&(n=D({path:r,url:n}));let s=e?i(e):"";return s.startsWith("?")&&(s=s.substring(1)),s&&(n+=`?${s}`),n},C=(t,r)=>{let e={...t,...r};return e.baseUrl?.endsWith("/")&&(e.baseUrl=e.baseUrl.substring(0,e.baseUrl.length-1)),e.headers=x(t.headers,r.headers),e},x=(...t)=>{let r=new Headers;for(let e of t){if(!e||typeof e!="object")continue;let i=e instanceof Headers?e.entries():Object.entries(e);for(let[a,o]of i)if(o===null)r.delete(a);else if(Array.isArray(o))for(let n of o)r.append(a,n);else o!==undefined&&r.set(a,typeof o=="object"?JSON.stringify(o):o);}return r},y=class{_fns;constructor(){this._fns=[];}clear(){this._fns=[];}exists(r){return this._fns.indexOf(r)!==-1}eject(r){let e=this._fns.indexOf(r);e!==-1&&(this._fns=[...this._fns.slice(0,e),...this._fns.slice(e+1)]);}use(r){this._fns=[...this._fns,r];}},I=()=>({error:new y,request:new y,response:new y}),B=q({allowReserved:false,array:{explode:true,style:"form"},object:{explode:true,style:"deepObject"}}),W={"Content-Type":"application/json"},w=(t={})=>({...b,baseUrl:"",headers:W,parseAs:"auto",querySerializer:B,...t});var N=(t={})=>{let r=C(w(),t),e=()=>({...r}),i=n=>(r=C(r,n),e()),a=I(),o=async n=>{let s={...r,...n,fetch:n.fetch??r.fetch??globalThis.fetch,headers:x(r.headers,n.headers)};s.security&&await P({...s,security:s.security}),s.body&&s.bodySerializer&&(s.body=s.bodySerializer(s.body)),s.body||s.headers.delete("Content-Type");for(let u of a.request._fns)await u(s);let l=R(s),p=s.fetch,c=await p(l,{...s,body:s.body});for(let u of a.response._fns)c=await u(c,s);let h={response:c};if(c.ok){if(c.status===204||c.headers.get("Content-Length")==="0")return {data:{},...h};let u=(s.parseAs==="auto"?E(c.headers.get("Content-Type")):s.parseAs)??"json";if(u==="stream")return {data:c.body,...h};let g=await c[u]();return u==="json"&&(s.responseValidator&&await s.responseValidator(g),s.responseTransformer&&(g=await s.responseTransformer(g))),{data:g,...h}}let m=await c.text();try{m=JSON.parse(m);}catch{}let f=m;for(let u of a.error._fns)f=await u(m,c,s);if(f=f||{},s.throwOnError)throw f;return {error:f,...h}};return {buildUrl:R,connect:n=>o({...n,method:"CONNECT"}),delete:n=>o({...n,method:"DELETE"}),get:n=>o({...n,method:"GET"}),getConfig:e,head:n=>o({...n,method:"HEAD"}),interceptors:a,options:n=>o({...n,method:"OPTIONS"}),patch:n=>o({...n,method:"PATCH"}),post:n=>o({...n,method:"POST"}),put:n=>o({...n,method:"PUT"}),request:o,setConfig:i,trace:n=>o({...n,method:"TRACE"})}};exports.createClient=N;exports.createConfig=w;exports.formDataBodySerializer=v;exports.jsonBodySerializer=b;exports.urlSearchParamsBodySerializer=$;//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map