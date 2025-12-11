(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();const re=globalThis,Ce=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Oe=Symbol(),Re=new WeakMap;let qe=class{constructor(e,s,i){if(this._$cssResult$=!0,i!==Oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o;const s=this.t;if(Ce&&e===void 0){const i=s!==void 0&&s.length===1;i&&(e=Re.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Re.set(s,e))}return e}toString(){return this.cssText}};const ct=t=>new qe(typeof t=="string"?t:t+"",void 0,Oe),g=(t,...e)=>{const s=t.length===1?t[0]:e.reduce(((i,r,a)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[a+1]),t[0]);return new qe(s,t,Oe)},ut=(t,e)=>{if(Ce)t.adoptedStyleSheets=e.map((s=>s instanceof CSSStyleSheet?s:s.styleSheet));else for(const s of e){const i=document.createElement("style"),r=re.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}},ze=Ce?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(const i of e.cssRules)s+=i.cssText;return ct(s)})(t):t;const{is:pt,defineProperty:ht,getOwnPropertyDescriptor:gt,getOwnPropertyNames:ft,getOwnPropertySymbols:mt,getPrototypeOf:bt}=Object,me=globalThis,Ne=me.trustedTypes,vt=Ne?Ne.emptyScript:"",yt=me.reactiveElementPolyfillSupport,I=(t,e)=>t,se={toAttribute(t,e){switch(e){case Boolean:t=t?vt:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},Ae=(t,e)=>!pt(t,e),je={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:Ae};Symbol.metadata??=Symbol("metadata"),me.litPropertyMetadata??=new WeakMap;let N=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=je){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,s);r!==void 0&&ht(this.prototype,e,r)}}static getPropertyDescriptor(e,s,i){const{get:r,set:a}=gt(this.prototype,e)??{get(){return this[s]},set(o){this[s]=o}};return{get:r,set(o){const c=r?.call(this);a?.call(this,o),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??je}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;const e=bt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){const s=this.properties,i=[...ft(s),...mt(s)];for(const r of i)this.createProperty(r,s[r])}const e=this[Symbol.metadata];if(e!==null){const s=litPropertyMetadata.get(e);if(s!==void 0)for(const[i,r]of s)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[s,i]of this.elementProperties){const r=this._$Eu(s,i);r!==void 0&&this._$Eh.set(r,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const s=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)s.unshift(ze(r))}else e!==void 0&&s.push(ze(e));return s}static _$Eu(e,s){const i=s.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ut(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,s,i){this._$AK(e,i)}_$ET(e,s){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){const a=(i.converter?.toAttribute!==void 0?i.converter:se).toAttribute(s,i.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,s){const i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const a=i.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:se;this._$Em=r;const c=o.fromAttribute(s,a.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(e,s,i){if(e!==void 0){const r=this.constructor,a=this[e];if(i??=r.getPropertyOptions(e),!((i.hasChanged??Ae)(a,s)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,s,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:i,reflect:r,wrapped:a},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??s??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(s=void 0),this._$AL.set(e,s)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,a]of i){const{wrapped:o}=a,c=this[r];o!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,a,c)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),this._$EO?.forEach((i=>i.hostUpdate?.())),this.update(s)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(s)}willUpdate(e){}_$AE(e){this._$EO?.forEach((s=>s.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((s=>this._$ET(s,this[s]))),this._$EM()}updated(e){}firstUpdated(e){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[I("elementProperties")]=new Map,N[I("finalized")]=new Map,yt?.({ReactiveElement:N}),(me.reactiveElementVersions??=[]).push("2.1.1");const Ee=globalThis,ie=Ee.trustedTypes,Ue=ie?ie.createPolicy("lit-html",{createHTML:t=>t}):void 0,We="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+S,$t=`<${Ke}>`,E=document,q=()=>E.createComment(""),W=t=>t===null||typeof t!="object"&&typeof t!="function",De=Array.isArray,_t=t=>De(t)||typeof t?.[Symbol.iterator]=="function",_e=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,Le=/>/g,O=RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,He=/"/g,Ze=/^(?:script|style|textarea|title)$/i,xt=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),n=xt(1),j=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Be=new WeakMap,A=E.createTreeWalker(E,129);function Qe(t,e){if(!De(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(e):e}const wt=(t,e)=>{const s=t.length-1,i=[];let r,a=e===2?"<svg>":e===3?"<math>":"",o=V;for(let c=0;c<s;c++){const d=t[c];let m,v,p=-1,x=0;for(;x<d.length&&(o.lastIndex=x,v=o.exec(d),v!==null);)x=o.lastIndex,o===V?v[1]==="!--"?o=Me:v[1]!==void 0?o=Le:v[2]!==void 0?(Ze.test(v[2])&&(r=RegExp("</"+v[2],"g")),o=O):v[3]!==void 0&&(o=O):o===O?v[0]===">"?(o=r??V,p=-1):v[1]===void 0?p=-2:(p=o.lastIndex-v[2].length,m=v[1],o=v[3]===void 0?O:v[3]==='"'?He:Fe):o===He||o===Fe?o=O:o===Me||o===Le?o=V:(o=O,r=void 0);const P=o===O&&t[c+1].startsWith("/>")?" ":"";a+=o===V?d+$t:p>=0?(i.push(m),d.slice(0,p)+We+d.slice(p)+S+P):d+S+(p===-2?c:P)}return[Qe(t,a+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class K{constructor({strings:e,_$litType$:s},i){let r;this.parts=[];let a=0,o=0;const c=e.length-1,d=this.parts,[m,v]=wt(e,s);if(this.el=K.createElement(m,i),A.currentNode=this.el.content,s===2||s===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=A.nextNode())!==null&&d.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(We)){const x=v[o++],P=r.getAttribute(p).split(S),ee=/([.?@])?(.*)/.exec(x);d.push({type:1,index:a,name:ee[2],strings:P,ctor:ee[1]==="."?St:ee[1]==="?"?Ct:ee[1]==="@"?Ot:be}),r.removeAttribute(p)}else p.startsWith(S)&&(d.push({type:6,index:a}),r.removeAttribute(p));if(Ze.test(r.tagName)){const p=r.textContent.split(S),x=p.length-1;if(x>0){r.textContent=ie?ie.emptyScript:"";for(let P=0;P<x;P++)r.append(p[P],q()),A.nextNode(),d.push({type:2,index:++a});r.append(p[x],q())}}}else if(r.nodeType===8)if(r.data===Ke)d.push({type:2,index:a});else{let p=-1;for(;(p=r.data.indexOf(S,p+1))!==-1;)d.push({type:7,index:a}),p+=S.length-1}a++}}static createElement(e,s){const i=E.createElement("template");return i.innerHTML=e,i}}function U(t,e,s=t,i){if(e===j)return e;let r=i!==void 0?s._$Co?.[i]:s._$Cl;const a=W(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(t),r._$AT(t,s,i)),i!==void 0?(s._$Co??=[])[i]=r:s._$Cl=r),r!==void 0&&(e=U(t,r._$AS(t,e.values),r,i)),e}class Pt{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:s},parts:i}=this._$AD,r=(e?.creationScope??E).importNode(s,!0);A.currentNode=r;let a=A.nextNode(),o=0,c=0,d=i[0];for(;d!==void 0;){if(o===d.index){let m;d.type===2?m=new Q(a,a.nextSibling,this,e):d.type===1?m=new d.ctor(a,d.name,d.strings,this,e):d.type===6&&(m=new At(a,this,e)),this._$AV.push(m),d=i[++c]}o!==d?.index&&(a=A.nextNode(),o++)}return A.currentNode=E,r}p(e){let s=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,s),s+=i.strings.length-2):i._$AI(e[s])),s++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,s,i,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&e?.nodeType===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=U(this,e,s),W(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==j&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):_t(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:s,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=K.createElement(Qe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(s);else{const a=new Pt(r,this),o=a.u(this.options);a.p(s),this.T(o),this._$AH=a}}_$AC(e){let s=Be.get(e.strings);return s===void 0&&Be.set(e.strings,s=new K(e)),s}k(e){De(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let i,r=0;for(const a of e)r===s.length?s.push(i=new Q(this.O(q()),this.O(q()),this,this.options)):i=s[r],i._$AI(a),r++;r<s.length&&(this._$AR(i&&i._$AB.nextSibling,r),s.length=r)}_$AR(e=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class be{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,i,r,a){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=s,this._$AM=r,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=b}_$AI(e,s=this,i,r){const a=this.strings;let o=!1;if(a===void 0)e=U(this,e,s,0),o=!W(e)||e!==this._$AH&&e!==j,o&&(this._$AH=e);else{const c=e;let d,m;for(e=a[0],d=0;d<a.length-1;d++)m=U(this,c[i+d],s,d),m===j&&(m=this._$AH[d]),o||=!W(m)||m!==this._$AH[d],m===b?e=b:e!==b&&(e+=(m??"")+a[d+1]),this._$AH[d]=m}o&&!r&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class St extends be{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}}class Ct extends be{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}}class Ot extends be{constructor(e,s,i,r,a){super(e,s,i,r,a),this.type=5}_$AI(e,s=this){if((e=U(this,e,s,0)??b)===j)return;const i=this._$AH,r=e===b&&i!==b||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==b&&(i===b||r);r&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class At{constructor(e,s,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}}const Et=Ee.litHtmlPolyfillSupport;Et?.(K,Q),(Ee.litHtmlVersions??=[]).push("3.3.1");const Dt=(t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(r===void 0){const a=s?.renderBefore??null;i._$litPart$=r=new Q(e.insertBefore(q(),a),a,void 0,s??{})}return r._$AI(t),r};const ke=globalThis;class u extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Dt(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}u._$litElement$=!0,u.finalized=!0,ke.litElementHydrateSupport?.({LitElement:u});const kt=ke.litElementPolyfillSupport;kt?.({LitElement:u});(ke.litElementVersions??=[]).push("4.2.1");const h=t=>(e,s)=>{s!==void 0?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};const Tt={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:Ae},Rt=(t=Tt,e,s)=>{const{kind:i,metadata:r}=s;let a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),a.set(s.name,t),i==="accessor"){const{name:o}=s;return{set(c){const d=e.get.call(this);e.set.call(this,c),this.requestUpdate(o,d,t)},init(c){return c!==void 0&&this.C(o,void 0,t,c),c}}}if(i==="setter"){const{name:o}=s;return function(c){const d=this[o];e.call(this,c),this.requestUpdate(o,d,t)}}throw Error("Unsupported decorator location: "+i)};function l(t){return(e,s)=>typeof s=="object"?Rt(t,e,s):((i,r,a)=>{const o=r.hasOwnProperty(a);return r.constructor.createProperty(a,i),o?Object.getOwnPropertyDescriptor(r,a):void 0})(t,e,s)}function f(t){return l({...t,state:!0,attribute:!1})}const Ye=[{key:"code",label:"Code",type:"product-link",filterable:!1,sortable:!0},{key:"productName",label:"Product Name",type:"simple-text",filterable:!0,sortable:!0},{key:"brand",label:"Brand",type:"simple-text",filterable:!0,sortable:!0},{key:"description",label:"Description",type:"truncated-text",filterable:!0,sortable:!1},{key:"category",label:"Category",type:"simple-text",filterable:!0,sortable:!0},{key:"sku",label:"SKU",type:"simple-text",filterable:!0,sortable:!0},{key:"modelNumber",label:"Model Number",type:"simple-text",filterable:!0,sortable:!0},{key:"barcode",label:"Barcode",type:"simple-text",filterable:!0,sortable:!0},{key:"firstName",label:"First Name",type:"simple-text",filterable:!0,sortable:!0},{key:"lastName",label:"Last Name",type:"simple-text",filterable:!0,sortable:!0},{key:"supplierEmail",label:"Supplier Email",type:"simple-text",filterable:!0,sortable:!0},{key:"supplierPhone",label:"Supplier Phone",type:"simple-text",filterable:!0,sortable:!0},{key:"price",label:"Price",type:"decimal-units",filterable:!0,sortable:!0},{key:"cost",label:"Cost",type:"decimal-units",filterable:!0,sortable:!0},{key:"wholesalePrice",label:"Wholesale Price",type:"decimal-units",filterable:!0,sortable:!0},{key:"currencyCode",label:"Currency",type:"simple-text",filterable:!0,sortable:!0},{key:"taxRate",label:"Tax Rate",type:"decimal-units",unit:"%",filterable:!0,sortable:!0},{key:"discountPercent",label:"Discount %",type:"decimal-units",unit:"%",filterable:!0,sortable:!0},{key:"stockQuantity",label:"Stock",type:"large-counter",filterable:!0,sortable:!0},{key:"unitsSold",label:"Units Sold",type:"large-counter",filterable:!0,sortable:!0},{key:"reorderLevel",label:"Reorder Level",type:"large-counter",filterable:!0,sortable:!0},{key:"warehouseLocation",label:"Warehouse",type:"simple-text",filterable:!0,sortable:!0},{key:"qualityScore",label:"Quality Score",type:"progress-bar",filterable:!0,sortable:!0},{key:"customerRating",label:"Rating",type:"star-rating",filterable:!0,sortable:!0},{key:"reviewCount",label:"Reviews",type:"large-counter",filterable:!0,sortable:!0},{key:"grade",label:"Grade",type:"grade-badge",filterable:!0,sortable:!0},{key:"safetyRating",label:"Safety Rating",type:"nova-dots",filterable:!0,sortable:!0},{key:"ecoScore",label:"Eco Score",type:"progress-bar",filterable:!0,sortable:!0},{key:"createdDate",label:"Created",type:"absolute-date",filterable:!1,sortable:!0},{key:"lastUpdated",label:"Last Updated",type:"relative-date",filterable:!1,sortable:!0},{key:"releaseDate",label:"Release Date",type:"absolute-date",filterable:!1,sortable:!0},{key:"nextRestockDate",label:"Next Restock",type:"absolute-date",filterable:!1,sortable:!0},{key:"inStock",label:"In Stock",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"isFeatured",label:"Featured",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"isBestSeller",label:"Best Seller",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"requiresShipping",label:"Requires Shipping",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"isDigital",label:"Digital",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"hasWarranty",label:"Has Warranty",type:"boolean-yesno",filterable:!0,sortable:!0},{key:"thumbnailUrl",label:"Image",type:"product-image",filterable:!1,sortable:!1},{key:"color",label:"Color",type:"color-pill",filterable:!0,sortable:!0},{key:"originCountry",label:"Origin Country",type:"simple-text",filterable:!0,sortable:!0},{key:"manufacturerCountry",label:"Manufacturer Country",type:"simple-text",filterable:!0,sortable:!0},{key:"productLanguage",label:"Language",type:"simple-text",filterable:!0,sortable:!0},{key:"shippingZone",label:"Shipping Zone",type:"simple-text",filterable:!0,sortable:!0},{key:"supplierTaxId",label:"Tax ID",type:"simple-text",filterable:!0,sortable:!0},{key:"material",label:"Material",type:"simple-text",filterable:!0,sortable:!0},{key:"size",label:"Size",type:"simple-text",filterable:!0,sortable:!0},{key:"weightKg",label:"Weight (kg)",type:"decimal-units",unit:"kg",filterable:!0,sortable:!0},{key:"dimensionsCm",label:"Dimensions (cm)",type:"simple-text",filterable:!0,sortable:!0},{key:"certification",label:"Certification",type:"simple-text",filterable:!0,sortable:!0},{key:"warrantyMonths",label:"Warranty (months)",type:"large-counter",filterable:!0,sortable:!0},{key:"shippingDepartureTime",label:"Departure Time",type:"time-format",filterable:!1,sortable:!0},{key:"flightDurationHours",label:"Flight Duration (hrs)",type:"decimal-units",unit:"hrs",filterable:!0,sortable:!0}];function we(t){return Ye.find(e=>e.key===t)}function Ve(t){return we(t)?.type??"simple-text"}function Ie(t){const e={code:String(t.id),productName:t.product_name,category:t.category,createdDate:new Date(t.created_date),lastUpdated:new Date(t.last_updated)};return t.brand&&(e.brand=t.brand),t.description&&(e.description=t.description),t.sku&&(e.sku=t.sku),t.model_number&&(e.modelNumber=t.model_number),t.barcode&&(e.barcode=t.barcode),t.first_name&&(e.firstName=t.first_name),t.last_name&&(e.lastName=t.last_name),t.supplier_email&&(e.supplierEmail=t.supplier_email),t.supplier_phone&&(e.supplierPhone=t.supplier_phone),t.price&&(e.price=t.price),t.cost&&(e.cost=t.cost),t.wholesale_price&&(e.wholesalePrice=t.wholesale_price),t.currency_code&&(e.currencyCode=t.currency_code),t.tax_rate!==void 0&&(e.taxRate=t.tax_rate),t.discount_percent!==void 0&&(e.discountPercent=t.discount_percent),t.stock_quantity!==void 0&&(e.stockQuantity=t.stock_quantity),t.units_sold!==void 0&&(e.unitsSold=t.units_sold),t.reorder_level!==void 0&&(e.reorderLevel=t.reorder_level),t.warehouse_location&&(e.warehouseLocation=t.warehouse_location),t.quality_score!==void 0&&(e.qualityScore=t.quality_score),t.customer_rating!==void 0&&(e.customerRating=t.customer_rating),t.review_count!==void 0&&(e.reviewCount=t.review_count),t.grade&&(e.grade=t.grade),t.safety_rating!==void 0&&(e.safetyRating=t.safety_rating),t.eco_score!==void 0&&(e.ecoScore=t.eco_score),t.release_date&&(e.releaseDate=new Date(t.release_date)),t.next_restock_date&&(e.nextRestockDate=new Date(t.next_restock_date)),t.in_stock!==void 0&&(e.inStock=t.in_stock),t.is_featured!==void 0&&(e.isFeatured=t.is_featured),t.is_best_seller!==void 0&&(e.isBestSeller=t.is_best_seller),t.requires_shipping!==void 0&&(e.requiresShipping=t.requires_shipping),t.is_digital!==void 0&&(e.isDigital=t.is_digital),t.has_warranty!==void 0&&(e.hasWarranty=t.has_warranty),t.image_url&&(e.imageUrl=t.image_url),t.color&&(e.color=t.color),t.thumbnail_url&&(e.thumbnailUrl=t.thumbnail_url),t.origin_country&&(e.originCountry=t.origin_country),t.manufacturer_country&&(e.manufacturerCountry=t.manufacturer_country),t.product_language&&(e.productLanguage=t.product_language),t.shipping_zone&&(e.shippingZone=t.shipping_zone),t.supplier_tax_id&&(e.supplierTaxId=t.supplier_tax_id),t.material&&(e.material=t.material),t.size&&(e.size=t.size),t.weight_kg!==void 0&&(e.weightKg=t.weight_kg),t.dimensions_cm&&(e.dimensionsCm=t.dimensions_cm),t.certification&&(e.certification=t.certification),t.warranty_months!==void 0&&(e.warrantyMonths=t.warranty_months),t.shipping_departure_time&&(e.shippingDepartureTime=t.shipping_departure_time),t.flight_duration_hours!==void 0&&(e.flightDurationHours=t.flight_duration_hours),e}const Ge="http://localhost:3001/api";function zt(t,e=1,s=50){const i=(e-1)*s;return`${Ge}/products?category=${encodeURIComponent(t)}&limit=${s}&skip=${i}`}function Nt(t){return`${Ge}/products/${t}`}const Pe=[{id:"angular",name:"Angular",devPort:3005,color:"#dd0031"},{id:"react",name:"React",devPort:3002,color:"#61dafb"},{id:"svelte",name:"Svelte",devPort:3003,color:"#ff3e00"},{id:"solid",name:"Solid",devPort:3004,color:"#2c4f7c"}],jt=8888;function Ut(t,e,s,i){const r=i===String(jt),a=Pe.find(o=>o.id===e);if(!a)return s;if(r){const c=(s.match(/\/[^/]+(\/.*)/)||[null,"/list"])[1]||"/list";return`/${e}${c}`}else{const o=s.split("/").filter(Boolean),c=o.length>0?`/${o.join("/")}`:"/list";return`http://localhost:${a.devPort}${c}`}}var Mt=Object.getOwnPropertyDescriptor,Lt=(t,e,s,i)=>{for(var r=i>1?void 0:i?Mt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=o(r)||r);return r};const xe="lit";let Se=class extends u{render(){const t=Pe.find(e=>e.id===xe)?.name||"Lit";return n`
      <header class="framework-header">
        <span class="current-framework">${t}</span>
        <nav class="framework-nav">
          ${Pe.map(e=>n`
            <a
              href=${Ut(xe,e.id,window.location.pathname,window.location.port)}
              class="framework-link ${e.id===xe?"active":""}"
              style="--framework-color: ${e.color}"
            >
              ${e.name}
            </a>
          `)}
        </nav>
      </header>
    `}};Se.styles=g`
    :host {
      display: block;
    }

    .framework-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: #1a1a2e;
      border-bottom: 1px solid #333;
    }

    .current-framework {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
    }

    .framework-nav {
      display: flex;
      gap: 0.5rem;
    }

    .framework-link {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #ccc;
      background: transparent;
      border: 1px solid #444;
      transition: all 0.2s ease;
    }

    .framework-link:hover {
      color: #fff;
      border-color: var(--framework-color);
      background: color-mix(in srgb, var(--framework-color) 20%, transparent);
    }

    .framework-link.active {
      color: #fff;
      background: var(--framework-color);
      border-color: var(--framework-color);
      cursor: default;
      pointer-events: none;
    }
  `;Se=Lt([h("framework-header")],Se);const Je={async getProductsByCategory(t,e,s){const i=zt(t,e,s),a=await(await fetch(i)).json();return a?.products?{products:a.products.map(Ie),total:a.total||0}:{products:[],total:0}},async getProduct(t){const e=Nt(t),s=await fetch(e);if(!s.ok)return null;const i=await s.json();return Ie(i)}};var Ft=Object.defineProperty,Ht=Object.getOwnPropertyDescriptor,ve=(t,e,s,i)=>{for(var r=i>1?void 0:i?Ht(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Ft(e,s,r),r};let M=class extends u{constructor(){super(...arguments),this.disabled=!1,this.size="md",this.variant="secondary"}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent("button-click"))}render(){return n`
      <button
        type="button"
        class="btn btn-${this.size} btn-${this.variant}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        <slot></slot>
      </button>
    `}};M.styles=g`
    :host {
      display: inline-block;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      background: #fff;
      color: #333;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      line-height: 1;
    }

    .btn:focus {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 14px;
      min-height: 28px;
    }

    .btn-md {
      padding: 8px 12px;
      font-size: 16px;
      min-height: 36px;
    }

    .btn-lg {
      padding: 12px 16px;
      font-size: 18px;
      min-height: 44px;
    }

    .btn-primary {
      background: #007bff;
      color: #fff;
      border-color: #007bff;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
      border-color: #0056b3;
    }

    .btn-secondary {
      background: #fff;
      color: #333;
      border-color: #e0e0e0;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #007bff;
    }

    .btn-outline {
      background: transparent;
      color: #007bff;
      border: none;
    }

    .btn-outline:hover:not(:disabled) {
      background: #f8f9fa;
    }
  `;ve([l({type:Boolean})],M.prototype,"disabled",2);ve([l({type:String})],M.prototype,"size",2);ve([l({type:String})],M.prototype,"variant",2);M=ve([h("lit-button")],M);var Bt=Object.defineProperty,Vt=Object.getOwnPropertyDescriptor,$=(t,e,s,i)=>{for(var r=i>1?void 0:i?Vt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Bt(e,s,r),r};let y=class extends u{constructor(){super(...arguments),this.columns=[],this.value=[],this.totalPages=0,this.page=0,this.pageSize=50,this.pageSizes=[10,25,50],this.showFilterRow=!1,this.emptyText="No data available"}get hasData(){return this.value&&this.value.length>0}get isValidPageSize(){return this.pageSizes.includes(this.pageSize)}getRowTrackValue(t,e){return this.trackBy&&t[this.trackBy]!==void 0?t[this.trackBy]:e}onFirstPage(){this.dispatchEvent(new CustomEvent("page-change",{detail:0}))}onPreviousPage(){this.page>0&&this.dispatchEvent(new CustomEvent("page-change",{detail:this.page-1}))}onNextPage(){this.page<this.totalPages-1&&this.dispatchEvent(new CustomEvent("page-change",{detail:this.page+1}))}onLastPage(){this.dispatchEvent(new CustomEvent("page-change",{detail:this.totalPages-1}))}handlePageSizeChange(t){const e=t.target;this.dispatchEvent(new CustomEvent("page-size-change",{detail:Number(e.value)}))}render(){return this.hasData?n`
      <div class="table-wrapper">
        <table class="data-table">
          <thead class="table-header">
            <tr class="header-row">
              ${this.columns.map(t=>n`
                <th class="header-cell" scope="col">
                  ${this.renderHeader?this.renderHeader(t):t}
                </th>
              `)}
            </tr>

            ${this.showFilterRow?n`
              <tr class="filter-row">
                ${this.columns.map(t=>n`
                  <th class="filter-cell" scope="col">
                    ${this.renderFilter?.(t)}
                  </th>
                `)}
              </tr>
            `:""}
          </thead>

          <tbody class="table-body">
            ${this.value.map((t,e)=>n`
              <tr class="data-row" data-key=${this.getRowTrackValue(t,e)}>
                ${this.columns.map(s=>n`
                  <td class="data-cell">
                    ${this.renderCell?this.renderCell(t[s],s,t):t[s]}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div class="table-paginator">
        <div class="page-size-selector">
          <label for="pageSize">Items per page:</label>
          <select
            id="pageSize"
            .value=${String(this.pageSize)}
            class=${this.isValidPageSize?"":"error"}
            @change=${this.handlePageSizeChange}
          >
            ${this.pageSizes.map(t=>n`
              <option value=${t} ?selected=${t===this.pageSize}>${t}</option>
            `)}
          </select>
          ${this.isValidPageSize?"":n`
            <span class="error-message">Invalid page size: ${this.pageSize}</span>
          `}
        </div>

        <div class="pagination-controls">
          <lit-button ?disabled=${this.page===0} @button-click=${this.onFirstPage} size="sm">
            First
          </lit-button>

          <lit-button ?disabled=${this.page===0} @button-click=${this.onPreviousPage} size="sm">
            Previous
          </lit-button>

          <span class="page-info">
            Page ${this.page+1} of ${this.totalPages}
          </span>

          <lit-button ?disabled=${this.page>=this.totalPages-1} @button-click=${this.onNextPage} size="sm">
            Next
          </lit-button>

          <lit-button ?disabled=${this.page>=this.totalPages-1} @button-click=${this.onLastPage} size="sm">
            Last
          </lit-button>
        </div>
      </div>
    `:n`
        <div class="empty-state">
          <p class="empty-text">${this.emptyText}</p>
        </div>
      `}};y.styles=g`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .table-wrapper {
      flex: 1;
      overflow: auto;
      min-height: 0;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .header-cell,
    .filter-cell,
    .data-cell {
      padding: 0.375rem 0.5rem;
      text-align: left;
      vertical-align: middle;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .header-cell:first-child,
    .filter-cell:first-child,
    .data-cell:first-child {
      border-left: 1px solid #e0e0e0;
    }

    .header-row {
      background: #f5f5f5;
    }

    .header-cell {
      position: sticky;
      top: 0;
      z-index: 12;
      background: #f5f5f5;
      font-weight: 600;
      color: #333;
      min-width: 80px;
      border-top: 1px solid #e0e0e0;
      height: 2.5rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    .filter-row {
      background: #fafafa;
    }

    .filter-cell {
      position: sticky;
      top: 2.5rem;
      z-index: 11;
      background: #fafafa;
      padding: 0.25rem 0.5rem;
      min-width: 80px;
      overflow: visible;
    }

    .data-cell {
      background: #fff;
      overflow: hidden;
    }

    .data-row:hover .data-cell {
      background: #f8f9fa;
    }

    .table-paginator {
      flex-shrink: 0;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      z-index: 10;
      margin-top: auto;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-size-selector label {
      font-size: 14px;
      color: #666;
    }

    .page-size-selector select {
      padding: 4px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fff;
    }

    .page-size-selector select.error {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-left: 8px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-info {
      font-size: 14px;
      color: #666;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #666;
    }

    .empty-text {
      font-size: 16px;
      margin: 0;
    }
  `;$([l({type:Array})],y.prototype,"columns",2);$([l({type:Array})],y.prototype,"value",2);$([l({type:Number})],y.prototype,"totalPages",2);$([l({type:Number})],y.prototype,"page",2);$([l({type:Number})],y.prototype,"pageSize",2);$([l({type:Array})],y.prototype,"pageSizes",2);$([l({type:Boolean})],y.prototype,"showFilterRow",2);$([l({type:String})],y.prototype,"emptyText",2);$([l({type:String})],y.prototype,"trackBy",2);$([l({attribute:!1})],y.prototype,"renderHeader",2);$([l({attribute:!1})],y.prototype,"renderFilter",2);$([l({attribute:!1})],y.prototype,"renderCell",2);y=$([h("data-table")],y);var It=Object.defineProperty,qt=Object.getOwnPropertyDescriptor,Xe=(t,e,s,i)=>{for(var r=i>1?void 0:i?qt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&It(e,s,r),r};let ae=class extends u{constructor(){super(...arguments),this.value=""}get gradeClass(){switch(this.value?.toUpperCase()){case"A":return"grade-a";case"B":return"grade-b";case"C":return"grade-c";case"D":return"grade-d";case"F":return"grade-f";default:return"grade-unknown"}}render(){return n`<span class="grade-badge ${this.gradeClass}">${this.value}</span>`}};ae.styles=g`
    .grade-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 13px;
      text-align: center;
      min-width: 56px;
      color: white;
      line-height: 1;
    }

    .grade-a {
      background-color: #4caf50;
    }

    .grade-b {
      background-color: #2196f3;
    }

    .grade-c {
      background-color: #ff9800;
    }

    .grade-d {
      background-color: #f57c00;
    }

    .grade-f {
      background-color: #f44336;
    }

    .grade-unknown {
      background-color: #9e9e9e;
    }
  `;Xe([l({type:String})],ae.prototype,"value",2);ae=Xe([h("grade-badge")],ae);var Wt=Object.defineProperty,Kt=Object.getOwnPropertyDescriptor,et=(t,e,s,i)=>{for(var r=i>1?void 0:i?Kt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Wt(e,s,r),r};let oe=class extends u{constructor(){super(...arguments),this.value=0}get percentage(){return this.value<0?0:this.value>100?100:this.value}get colorClass(){const t=this.percentage;return t>=70?"high":t>=40?"medium":"low"}render(){return n`
      <div class="progress-bar-container">
        <div class="progress-bar ${this.colorClass}">
          <div class="progress-fill" style="width: ${this.percentage}%"></div>
        </div>
        <span class="progress-text">${this.percentage}%</span>
      </div>
    `}};oe.styles=g`
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar {
      flex: 1;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      min-width: 60px;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      border-radius: 10px;
    }

    .progress-bar.high .progress-fill {
      background-color: #4caf50;
    }

    .progress-bar.medium .progress-fill {
      background-color: #ff9800;
    }

    .progress-bar.low .progress-fill {
      background-color: #f44336;
    }

    .progress-text {
      font-size: 12px;
      font-weight: 500;
      min-width: 35px;
      text-align: right;
      color: #666;
    }
  `;et([l({type:Number})],oe.prototype,"value",2);oe=et([h("progress-bar")],oe);var Zt=Object.defineProperty,Qt=Object.getOwnPropertyDescriptor,Y=(t,e,s,i)=>{for(var r=i>1?void 0:i?Qt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Zt(e,s,r),r};let D=class extends u{constructor(){super(...arguments),this.value="",this.size="small",this.imageLoaded=!1,this.imageError=!1}handleLoad(){this.imageLoaded=!0}handleError(){this.imageError=!0}render(){return n`
      <div class="product-image ${this.size}">
        ${this.imageError?n`<div class="image-placeholder">No image</div>`:n`
              <img
                src="${this.value}"
                alt="Product image"
                class="${this.imageLoaded?"loaded":""}"
                @load="${this.handleLoad}"
                @error="${this.handleError}"
              />
            `}
      </div>
    `}};D.styles=g`
    .product-image {
      display: inline-block;
    }

    .product-image img {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-image img.loaded {
      opacity: 1;
    }

    .product-image.small img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    .product-image.large img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      color: #999;
      font-size: 12px;
    }

    .small .image-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    .large .image-placeholder {
      width: 200px;
      height: 200px;
      border-radius: 8px;
    }
  `;Y([l({type:String})],D.prototype,"value",2);Y([l({type:String})],D.prototype,"size",2);Y([f()],D.prototype,"imageLoaded",2);Y([f()],D.prototype,"imageError",2);D=Y([h("product-image")],D);var Yt=Object.defineProperty,Gt=Object.getOwnPropertyDescriptor,tt=(t,e,s,i)=>{for(var r=i>1?void 0:i?Gt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Yt(e,s,r),r};let ne=class extends u{constructor(){super(...arguments),this.value=""}handleClick(t){t.preventDefault(),window.location.href=`/detail/${this.value}`}render(){return n`
      <a href="/detail/${this.value}" class="product-link" @click="${this.handleClick}">
        ${this.value}
      </a>
    `}};ne.styles=g`
    .product-link {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }

    .product-link:hover {
      color: #004499;
    }

    .product-link:visited {
      color: #551a8b;
    }
  `;tt([l({type:String})],ne.prototype,"value",2);ne=tt([h("product-link")],ne);var Jt=Object.defineProperty,Xt=Object.getOwnPropertyDescriptor,ye=(t,e,s,i)=>{for(var r=i>1?void 0:i?Xt(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Jt(e,s,r),r};let L=class extends u{constructor(){super(...arguments),this.value="",this.maxLength=50,this.isExpanded=!1}get shouldTruncate(){return(this.value?.length??0)>this.maxLength}get displayText(){const t=this.value||"";return this.shouldTruncate&&!this.isExpanded?t.substring(0,this.maxLength-3)+"...":t}toggleExpanded(){this.isExpanded=!this.isExpanded}render(){return n`
      <div class="truncated-text">
        <span class="text-content">${this.displayText}</span>
        ${this.shouldTruncate?n`
              <button
                class="toggle-button"
                @click="${this.toggleExpanded}"
                type="button"
              >
                ${this.isExpanded?"Show less":"Show more"}
              </button>
            `:""}
      </div>
    `}};L.styles=g`
    .truncated-text {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-content {
      flex: 1;
      word-break: break-word;
    }

    .toggle-button {
      background: none;
      border: none;
      color: #0066cc;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 6px;
      text-decoration: underline;
      white-space: nowrap;
    }

    .toggle-button:hover {
      color: #004499;
    }

    .toggle-button:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `;ye([l({type:String})],L.prototype,"value",2);ye([l({type:Number})],L.prototype,"maxLength",2);ye([f()],L.prototype,"isExpanded",2);L=ye([h("truncated-text")],L);var er=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,G=(t,e,s,i)=>{for(var r=i>1?void 0:i?tr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&er(e,s,r),r};const rr=/^([£$€¥₹])?([0-9,.-]+)([£$€¥₹])?$/,sr={$:"USD","£":"GBP","€":"EUR","¥":"JPY","₹":"INR"};let k=class extends u{constructor(){super(...arguments),this.value="",this.unit="",this.decimals=2,this.currencyCode=""}get formattedValue(){const t=this.value;if(t==null||t==="")return"";let e,s;if(typeof t=="number")e=t;else{const r=t.trim().match(rr);if(r){const a=r[1]||r[3];a&&(s=sr[a]);const o=r[2].replace(/,/g,"");e=parseFloat(o)}else{const a=t.replace(/[^0-9.-]/g,"");e=parseFloat(a)}}if(isNaN(e))return"";const i=this.currencyCode||s;return i?new Intl.NumberFormat("en-US",{style:"currency",currency:i,currencyDisplay:"symbol",minimumFractionDigits:this.decimals,maximumFractionDigits:this.decimals}).format(e):e.toFixed(this.decimals)}render(){return n`
      <span class="decimal-units">
        ${this.formattedValue}
        ${this.unit?n`<span class="unit">${this.unit}</span>`:""}
      </span>
    `}};k.styles=g`
    .decimal-units {
      font-variant-numeric: tabular-nums;
    }

    .unit {
      margin-left: 0.25rem;
      color: #6b7280;
      font-size: 0.75rem;
    }
  `;G([l({type:String})],k.prototype,"value",2);G([l({type:String})],k.prototype,"unit",2);G([l({type:Number})],k.prototype,"decimals",2);G([l({type:String})],k.prototype,"currencyCode",2);k=G([h("decimal-units")],k);var ir=Object.defineProperty,ar=Object.getOwnPropertyDescriptor,rt=(t,e,s,i)=>{for(var r=i>1?void 0:i?ar(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&ir(e,s,r),r};let le=class extends u{constructor(){super(...arguments),this.value=""}get formattedTime(){if(!this.value)return"";const[t,e]=this.value.split(":").map(Number),s=new Date;return s.setHours(t,e,0,0),new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(s)}render(){return n`<span class="time-format">${this.formattedTime}</span>`}};le.styles=g`
    .time-format {
      font-variant-numeric: tabular-nums;
    }
  `;rt([l({type:String})],le.prototype,"value",2);le=rt([h("time-format")],le);var or=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,st=(t,e,s,i)=>{for(var r=i>1?void 0:i?nr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&or(e,s,r),r};let de=class extends u{constructor(){super(...arguments),this.value=""}get formattedDate(){return this.value?new Date(this.value).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):""}render(){return n`<span class="absolute-date">${this.formattedDate}</span>`}};de.styles=g`
    .absolute-date {
      color: #333;
    }
  `;st([l({type:String})],de.prototype,"value",2);de=st([h("absolute-date")],de);var lr=Object.defineProperty,dr=Object.getOwnPropertyDescriptor,it=(t,e,s,i)=>{for(var r=i>1?void 0:i?dr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&lr(e,s,r),r};let ce=class extends u{constructor(){super(...arguments),this.value=""}get relativeTime(){if(!this.value)return"";const t=new Date(this.value),s=new Date().getTime()-t.getTime(),i=Math.floor(s/6e4),r=Math.floor(s/36e5),a=Math.floor(s/864e5);return i<1?"just now":i<60?`${i} min${i>1?"s":""} ago`:r<24?`${r} hour${r>1?"s":""} ago`:`${a} day${a>1?"s":""} ago`}render(){return n`<span class="relative-date">${this.relativeTime}</span>`}};ce.styles=g`
    .relative-date {
      color: #333;
    }
  `;it([l({type:String})],ce.prototype,"value",2);ce=it([h("relative-date")],ce);var cr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,at=(t,e,s,i)=>{for(var r=i>1?void 0:i?ur(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&cr(e,s,r),r};let ue=class extends u{constructor(){super(...arguments),this.value=!1}render(){return this.value?n`<span class="boolean-yesno yes">Yes</span>`:n`<span class="boolean-yesno no">No</span>`}};ue.styles=g`
    .boolean-yesno {
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .yes {
      color: #4caf50;
      background-color: #e8f5e9;
    }

    .no {
      color: #666;
      background-color: #f5f5f5;
    }
  `;at([l({type:Boolean})],ue.prototype,"value",2);ue=at([h("boolean-yesno")],ue);var pr=Object.defineProperty,hr=Object.getOwnPropertyDescriptor,ot=(t,e,s,i)=>{for(var r=i>1?void 0:i?hr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&pr(e,s,r),r};let pe=class extends u{constructor(){super(...arguments),this.value=1}get rating(){return this.value<1?1:this.value>4?4:Math.floor(this.value)}get dots(){const t=this.rating,e=[];for(let s=1;s<=4;s++)e.push({filled:s<=t});return e}render(){return n`
      <div class="nova-dots">
        ${this.dots.map(t=>n`<span class="dot ${t.filled?"filled":""}"></span>`)}
      </div>
    `}};pe.styles=g`
    .nova-dots {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #0066cc;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }

    .dot.filled {
      background-color: #0066cc;
    }

    .dot:hover {
      transform: scale(1.1);
    }
  `;ot([l({type:Number})],pe.prototype,"value",2);pe=ot([h("nova-dots")],pe);var gr=Object.defineProperty,fr=Object.getOwnPropertyDescriptor,nt=(t,e,s,i)=>{for(var r=i>1?void 0:i?fr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&gr(e,s,r),r};let he=class extends u{constructor(){super(...arguments),this.value=""}render(){return n`
      <span
        class="color-pill"
        style="background-color: ${this.value}"
        title="${this.value}"
      ></span>
    `}};he.styles=g`
    .color-pill {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      border: 1px solid #ddd;
      cursor: help;
    }
  `;nt([l({type:String})],he.prototype,"value",2);he=nt([h("color-pill")],he);var mr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,lt=(t,e,s,i)=>{for(var r=i>1?void 0:i?br(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&mr(e,s,r),r};let ge=class extends u{constructor(){super(...arguments),this.value=void 0}get formattedValue(){const t=this.value;return t==null?"0":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?t.toLocaleString("en-US"):t.toString()}render(){return n`<span class="large-counter">${this.formattedValue}</span>`}};ge.styles=g`
    .large-counter {
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      color: #333;
    }
  `;lt([l({type:Number})],ge.prototype,"value",2);ge=lt([h("large-counter")],ge);var vr=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,Te=(t,e,s,i)=>{for(var r=i>1?void 0:i?yr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&vr(e,s,r),r};let Z=class extends u{constructor(){super(...arguments),this.value=0,this.maxStars=5}get stars(){const t=Number(this.value)||0,e=Math.floor(t),s=t%1>=.5,i=this.maxStars-e-(s?1:0);return{full:Array(e).fill(0),half:s?[0]:[],empty:Array(Math.max(0,i)).fill(0)}}render(){const t=this.stars;return n`
      <div class="star-rating">
        ${t.full.map(()=>n`<span class="star full">★</span>`)}
        ${t.half.map(()=>n`<span class="star half">★</span>`)}
        ${t.empty.map(()=>n`<span class="star empty">☆</span>`)}
        <span class="rating-value">${this.value}</span>
      </div>
    `}};Z.styles=g`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }

    .star {
      font-size: 1.25rem;
      line-height: 1;
    }

    .star.full {
      color: #ffc107;
    }

    .star.half {
      color: #ffc107;
      position: relative;
    }

    .star.half::after {
      content: "☆";
      position: absolute;
      left: 0;
      color: #e0e0e0;
      clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    }

    .star.empty {
      color: #e0e0e0;
    }

    .rating-value {
      margin-left: 0.5rem;
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 500;
    }
  `;Te([l({type:Number})],Z.prototype,"value",2);Te([l({type:Number})],Z.prototype,"maxStars",2);Z=Te([h("star-rating")],Z);var $r=Object.defineProperty,_r=Object.getOwnPropertyDescriptor,H=(t,e,s,i)=>{for(var r=i>1?void 0:i?_r(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&$r(e,s,r),r};let T=class extends u{constructor(){super(...arguments),this.value=null,this.dataType="simple-text",this.column="",this.row={}}createRenderRoot(){return this}render(){switch(this.dataType){case"product-link":return n`<product-link .value=${this.value}></product-link>`;case"progress-bar":return n`<progress-bar .value=${this.value}></progress-bar>`;case"grade-badge":return n`<grade-badge .value=${this.value}></grade-badge>`;case"nova-dots":return n`<nova-dots .value=${this.value}></nova-dots>`;case"boolean-yesno":return n`<boolean-yesno .value=${this.value}></boolean-yesno>`;case"large-counter":return n`<large-counter .value=${this.value}></large-counter>`;case"product-image":return n`<product-image .value=${this.value}></product-image>`;case"decimal-units":return n`<decimal-units .value=${this.value} .unit=${this.unit}></decimal-units>`;case"color-pill":return n`<color-pill .value=${this.value}></color-pill>`;case"relative-date":return n`<relative-date .value=${this.value}></relative-date>`;case"time-format":return n`<time-format .value=${this.value}></time-format>`;case"absolute-date":return n`<absolute-date .value=${this.value}></absolute-date>`;case"truncated-text":return n`<truncated-text .value=${this.value}></truncated-text>`;case"star-rating":return n`<star-rating .value=${this.value}></star-rating>`;default:return n`${this.value??""}`}}};H([l({type:Object})],T.prototype,"value",2);H([l({type:String})],T.prototype,"dataType",2);H([l({type:String})],T.prototype,"column",2);H([l({type:Object})],T.prototype,"row",2);H([l({type:String})],T.prototype,"unit",2);T=H([h("cell-renderer")],T);var xr=Object.defineProperty,wr=Object.getOwnPropertyDescriptor,$e=(t,e,s,i)=>{for(var r=i>1?void 0:i?wr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&xr(e,s,r),r};let F=class extends u{constructor(){super(...arguments),this.placeholder="Search",this.resetTrigger=0,this.inputValue="",this.lastResetTrigger=0}updated(t){t.has("resetTrigger")&&this.resetTrigger!==this.lastResetTrigger&&(this.lastResetTrigger=this.resetTrigger,this.resetTrigger>0&&(this.inputValue=""))}handleInput(t){const e=t.target.value;this.inputValue=e,this.dispatchEvent(new CustomEvent("value-change",{detail:e}))}render(){return n`
      <input
        type="text"
        class="text-search"
        placeholder=${this.placeholder}
        .value=${this.inputValue}
        @input=${this.handleInput}
      />
    `}};F.styles=g`
    :host {
      display: block;
    }

    .text-search {
      width: 100%;
      padding: 0.25rem 0.375rem;
      font-size: 0.8125rem;
      font-family: inherit;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .text-search:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
    }

    .text-search::placeholder {
      color: #999;
    }
  `;$e([l({type:String})],F.prototype,"placeholder",2);$e([l({type:Number})],F.prototype,"resetTrigger",2);$e([f()],F.prototype,"inputValue",2);F=$e([h("text-search")],F);var Pr=Object.defineProperty,Sr=Object.getOwnPropertyDescriptor,B=(t,e,s,i)=>{for(var r=i>1?void 0:i?Sr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Pr(e,s,r),r};let C=class extends u{constructor(){super(...arguments),this.min=0,this.max=100,this.resetTrigger=0,this.minValue=0,this.maxValue=100,this.lastResetTrigger=0,this.initialized=!1}updated(t){this.initialized||(this.minValue=this.min,this.maxValue=this.max,this.initialized=!0),t.has("resetTrigger")&&this.resetTrigger!==this.lastResetTrigger&&(this.lastResetTrigger=this.resetTrigger,this.resetTrigger>0&&(this.minValue=this.min,this.maxValue=this.max))}handleMinChange(t){const e=t.target;let s=Number(e.value);s>this.maxValue&&(s=this.maxValue),this.minValue=s,this.dispatchEvent(new CustomEvent("value-change",{detail:{min:this.minValue,max:this.maxValue}}))}handleMaxChange(t){const e=t.target;let s=Number(e.value);s<this.minValue&&(s=this.minValue),this.maxValue=s,this.dispatchEvent(new CustomEvent("value-change",{detail:{min:this.minValue,max:this.maxValue}}))}render(){return n`
      <div class="range-slider">
        <input
          type="number"
          class="range-input"
          .value=${String(this.minValue)}
          min=${this.min}
          max=${this.maxValue}
          @input=${this.handleMinChange}
        />
        <span class="separator">-</span>
        <input
          type="number"
          class="range-input"
          .value=${String(this.maxValue)}
          min=${this.minValue}
          max=${this.max}
          @input=${this.handleMaxChange}
        />
      </div>
    `}};C.styles=g`
    :host {
      display: block;
    }

    .range-slider {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .range-input {
      width: 60px;
      padding: 4px 6px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .range-input:focus {
      outline: none;
      border-color: #0066cc;
    }

    .separator {
      color: #999;
    }
  `;B([l({type:Number})],C.prototype,"min",2);B([l({type:Number})],C.prototype,"max",2);B([l({type:Number})],C.prototype,"resetTrigger",2);B([f()],C.prototype,"minValue",2);B([f()],C.prototype,"maxValue",2);C=B([h("range-slider")],C);var Cr=Object.defineProperty,Or=Object.getOwnPropertyDescriptor,J=(t,e,s,i)=>{for(var r=i>1?void 0:i?Or(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Cr(e,s,r),r};let R=class extends u{constructor(){super(...arguments),this.options=[],this.resetTrigger=0,this.selected=new Set,this.isOpen=!1,this.lastResetTrigger=0}updated(t){t.has("resetTrigger")&&this.resetTrigger!==this.lastResetTrigger&&(this.lastResetTrigger=this.resetTrigger,this.resetTrigger>0&&(this.selected=new Set))}toggleDropdown(){this.isOpen=!this.isOpen}toggleOption(t){const e=new Set(this.selected);e.has(t)?e.delete(t):e.add(t),this.selected=e,this.dispatchEvent(new CustomEvent("value-change",{detail:[...e]}))}get displayText(){return this.selected.size===0?"All":`${this.selected.size} selected`}render(){return n`
      <button type="button" class="select-button" @click=${this.toggleDropdown}>
        ${this.displayText}
        <span class="arrow">${this.isOpen?"▲":"▼"}</span>
      </button>

      ${this.isOpen?n`
        <div class="dropdown">
          ${this.options.map(t=>n`
            <label class="option">
              <input
                type="checkbox"
                .checked=${this.selected.has(t)}
                @change=${()=>this.toggleOption(t)}
              />
              ${t}
            </label>
          `)}
        </div>
      `:""}
    `}};R.styles=g`
    :host {
      display: block;
      position: relative;
    }

    .select-button {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }

    .select-button:hover {
      border-color: #0066cc;
    }

    .arrow {
      font-size: 10px;
      color: #999;
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 2px;
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      cursor: pointer;
      font-size: 13px;
    }

    .option:hover {
      background-color: #f5f5f5;
    }

    .option input[type="checkbox"] {
      cursor: pointer;
    }
  `;J([l({type:Array})],R.prototype,"options",2);J([l({type:Number})],R.prototype,"resetTrigger",2);J([f()],R.prototype,"selected",2);J([f()],R.prototype,"isOpen",2);R=J([h("multi-select")],R);var Ar=Object.defineProperty,Er=Object.getOwnPropertyDescriptor,w=(t,e,s,i)=>{for(var r=i>1?void 0:i?Er(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Ar(e,s,r),r};let _=class extends u{constructor(){super(...arguments),this.products=[],this.productsState="initial",this.currentPage=0,this.pageSize=50,this.totalProducts=0,this.error=null,this.filterResetTrigger=0,this.filters={},this.columnKeys=Ye.map(t=>t.key),this.renderHeader=t=>n`<strong>${this.getColumnTitle(t)}</strong>`,this.renderFilter=t=>{const e=Ve(t);return e==="progress-bar"?n`
        <range-slider
          min="0"
          max="100"
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></range-slider>
      `:e==="grade-badge"?n`
        <multi-select
          .options=${["A","B","C","D","E","F"]}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></multi-select>
      `:e==="nova-dots"?n`
        <multi-select
          .options=${["1","2","3","4"]}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></multi-select>
      `:e==="boolean-yesno"?n`
        <multi-select
          .options=${["Yes","No"]}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></multi-select>
      `:e==="large-counter"?n`
        <range-slider
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></range-slider>
      `:e!=="product-image"?n`
        <text-search
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${s=>this.updateFilter(t,s.detail)}
        ></text-search>
      `:null},this.renderCell=(t,e,s)=>{const i=Ve(e),r=this.getColumnUnit(e);return n`<cell-renderer .value=${t} .dataType=${i} .column=${e} .row=${s} .unit=${r}></cell-renderer>`}}connectedCallback(){super.connectedCallback(),this.loadProducts()}get totalPages(){return Math.ceil(this.totalProducts/this.pageSize)}getColumnTitle(t){return we(t)?.label??t}getColumnUnit(t){return we(t)?.unit}async loadProducts(){try{this.productsState="loading";const t=await Je.getProductsByCategory("all",this.currentPage+1,this.pageSize);this.products=t.products,this.totalProducts=t.total,this.productsState="loaded"}catch(t){this.error=t instanceof Error?t:new Error("An unknown error occurred"),this.productsState="error"}}updateFilter(t,e){this.filters={...this.filters,[t]:e}}resetFilters(){this.filters={},this.filterResetTrigger++}handlePageChange(t){this.currentPage=t.detail,this.loadProducts()}handlePageSizeChange(t){this.pageSize=t.detail,this.currentPage=0,this.loadProducts()}render(){return n`
      <div class="page-header-row">
        <h1>Products</h1>
        <button class="reset-button" @click=${this.resetFilters} type="button">
          Reset Filters
        </button>
      </div>

      ${this.productsState==="loading"?n`
        <div class="loading-indicator">⏳ Loading...</div>
      `:""}

      ${this.productsState==="loaded"&&this.products.length>0?n`
        <data-table
          .columns=${this.columnKeys}
          .value=${this.products}
          .totalPages=${this.totalPages}
          .page=${this.currentPage}
          .pageSize=${this.pageSize}
          .showFilterRow=${!0}
          trackBy="code"
          .renderHeader=${this.renderHeader}
          .renderFilter=${this.renderFilter}
          .renderCell=${this.renderCell}
          @page-change=${this.handlePageChange}
          @page-size-change=${this.handlePageSizeChange}
        ></data-table>
      `:""}

      ${this.productsState==="error"?n`
        <p class="error-message">Error loading products: ${this.error?.message??"Unknown"}</p>
      `:""}

      ${this.productsState==="loaded"&&this.products.length===0?n`
        <p>No products found.</p>
      `:""}
    `}};_.styles=g`
    :host {
      display: block;
      padding: 1.25rem;
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-shrink: 0;
    }

    .page-header-row h1 {
      color: #333;
      margin: 0;
    }

    .reset-button {
      padding: 8px 16px;
      background-color: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .reset-button:hover {
      background-color: #004499;
    }

    .reset-button:active {
      transform: translateY(1px);
    }

    .loading-indicator {
      padding: 0.5rem 1rem;
      background-color: #f0f8ff;
      border-left: 4px solid #0066cc;
      margin-bottom: 1rem;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
    }

    .error-message {
      color: #dc3545;
      padding: 1rem;
    }

    data-table {
      flex: 1;
      min-height: 0;
    }
  `;w([f()],_.prototype,"products",2);w([f()],_.prototype,"productsState",2);w([f()],_.prototype,"currentPage",2);w([f()],_.prototype,"pageSize",2);w([f()],_.prototype,"totalProducts",2);w([f()],_.prototype,"error",2);w([f()],_.prototype,"filterResetTrigger",2);w([f()],_.prototype,"filters",2);_=w([h("product-list")],_);var Dr=Object.defineProperty,kr=Object.getOwnPropertyDescriptor,X=(t,e,s,i)=>{for(var r=i>1?void 0:i?kr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Dr(e,s,r),r};function te(t){if(!t)return"";try{const e=t instanceof Date?t:new Date(t);return isNaN(e.getTime())?"":e.toISOString()}catch{return""}}let z=class extends u{constructor(){super(...arguments),this.code="",this.product=null,this.loadingState="loading",this.errorMessage=""}updated(t){t.has("code")&&this.code&&this.loadProduct()}connectedCallback(){super.connectedCallback(),this.code&&this.loadProduct()}async loadProduct(){this.loadingState="loading";try{const t=await Je.getProduct(this.code);t?(this.product=t,this.loadingState="loaded"):(this.loadingState="error",this.errorMessage="Product not found")}catch(t){this.loadingState="error",this.errorMessage=t instanceof Error?t.message:"Unknown error"}}navigateToList(){this.dispatchEvent(new CustomEvent("navigate",{detail:"/list"}))}get createdDateStr(){return this.product?.createdDate?te(this.product.createdDate):""}get lastUpdatedStr(){return this.product?.lastUpdated?te(this.product.lastUpdated):""}get releaseDateStr(){return this.product?.releaseDate?te(this.product.releaseDate):""}get nextRestockDateStr(){return this.product?.nextRestockDate?te(this.product.nextRestockDate):""}render(){return n`
      <button @click=${this.navigateToList} class="back-button">← Back to List</button>

      ${this.loadingState==="loaded"&&this.product?n`
        <div class="product-detail">
          <div class="header-section">
            <h1>${this.product.productName||"Unknown Product"}</h1>
            <div class="header-meta">
              <span class="product-code">Code: ${this.product.code}</span>
              ${this.product.qualityScore?n`
                <progress-bar .value=${this.product.qualityScore}></progress-bar>
              `:""}
            </div>
          </div>

          <div class="content-grid">
            ${this.product.imageUrl?n`
              <div class="image-gallery">
                <h2>Product Images</h2>
                <div class="main-image">
                  <product-image .value=${this.product.imageUrl} size="large"></product-image>
                </div>
              </div>
            `:""}

            <div class="info-section">
              <h2>Basic Information</h2>
              <dl class="info-list">
                <dt>Product Name</dt>
                <dd>${this.product.productName||"N/A"}</dd>

                <dt>Brand</dt>
                <dd>${this.product.brand||"N/A"}</dd>

                <dt>Category</dt>
                <dd>${this.product.category||"N/A"}</dd>

                ${this.product.description?n`
                  <dt>Description</dt>
                  <dd><truncated-text .value=${this.product.description}></truncated-text></dd>
                `:""}

                ${this.product.sku?n`
                  <dt>SKU</dt>
                  <dd>${this.product.sku}</dd>
                `:""}

                ${this.product.modelNumber?n`
                  <dt>Model Number</dt>
                  <dd>${this.product.modelNumber}</dd>
                `:""}

                ${this.product.barcode?n`
                  <dt>Barcode</dt>
                  <dd>${this.product.barcode}</dd>
                `:""}

                ${this.product.color?n`
                  <dt>Color</dt>
                  <dd><color-pill .value=${this.product.color}></color-pill></dd>
                `:""}

                ${this.product.material?n`
                  <dt>Material</dt>
                  <dd>${this.product.material}</dd>
                `:""}

                ${this.product.size?n`
                  <dt>Size</dt>
                  <dd>${this.product.size}</dd>
                `:""}

                ${this.product.weightKg?n`
                  <dt>Weight</dt>
                  <dd><decimal-units .value=${this.product.weightKg} unit="kg"></decimal-units></dd>
                `:""}

                ${this.product.dimensionsCm?n`
                  <dt>Dimensions</dt>
                  <dd>${this.product.dimensionsCm}</dd>
                `:""}

                <dt>Created</dt>
                <dd><absolute-date .value=${this.createdDateStr}></absolute-date></dd>

                <dt>Last Updated</dt>
                <dd><relative-date .value=${this.lastUpdatedStr}></relative-date></dd>

                ${this.releaseDateStr?n`
                  <dt>Release Date</dt>
                  <dd><absolute-date .value=${this.releaseDateStr}></absolute-date></dd>
                `:""}
              </dl>
            </div>

            ${this.product.grade||this.product.safetyRating||this.product.customerRating||this.product.ecoScore?n`
              <div class="health-section">
                <h2>Quality & Ratings</h2>
                <div class="score-grid">
                  ${this.product.grade?n`
                    <div class="score-item">
                      <span class="score-label">Grade</span>
                      <grade-badge .value=${this.product.grade}></grade-badge>
                    </div>
                  `:""}

                  ${this.product.safetyRating?n`
                    <div class="score-item">
                      <span class="score-label">Safety Rating</span>
                      <nova-dots .value=${this.product.safetyRating}></nova-dots>
                    </div>
                  `:""}

                  ${this.product.ecoScore?n`
                    <div class="score-item">
                      <span class="score-label">Eco Score</span>
                      <progress-bar .value=${this.product.ecoScore}></progress-bar>
                    </div>
                  `:""}
                </div>
              </div>
            `:""}

            ${this.product.unitsSold||this.product.reviewCount?n`
              <div class="stats-section">
                <h2>Statistics</h2>
                <dl class="info-list">
                  ${this.product.unitsSold?n`
                    <dt>Units Sold</dt>
                    <dd><large-counter .value=${this.product.unitsSold}></large-counter></dd>
                  `:""}

                  ${this.product.reviewCount?n`
                    <dt>Review Count</dt>
                    <dd><large-counter .value=${this.product.reviewCount}></large-counter></dd>
                  `:""}

                  ${this.product.customerRating?n`
                    <dt>Customer Rating</dt>
                    <dd><star-rating .value=${this.product.customerRating}></star-rating></dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.price||this.product.cost||this.product.wholesalePrice?n`
              <div class="pricing-section">
                <h2>Pricing & Financial</h2>
                <dl class="info-list">
                  ${this.product.price?n`
                    <dt>Price</dt>
                    <dd><decimal-units .value=${this.product.price} .unit=${this.product.currencyCode||""}></decimal-units></dd>
                  `:""}

                  ${this.product.cost?n`
                    <dt>Cost</dt>
                    <dd><decimal-units .value=${this.product.cost} .unit=${this.product.currencyCode||""}></decimal-units></dd>
                  `:""}

                  ${this.product.wholesalePrice?n`
                    <dt>Wholesale Price</dt>
                    <dd><decimal-units .value=${this.product.wholesalePrice} .unit=${this.product.currencyCode||""}></decimal-units></dd>
                  `:""}

                  ${this.product.taxRate!==void 0?n`
                    <dt>Tax Rate</dt>
                    <dd><decimal-units .value=${this.product.taxRate} unit="%"></decimal-units></dd>
                  `:""}

                  ${this.product.discountPercent!==void 0?n`
                    <dt>Discount</dt>
                    <dd><decimal-units .value=${this.product.discountPercent} unit="%"></decimal-units></dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.stockQuantity!==void 0||this.product.warehouseLocation||this.product.reorderLevel!==void 0?n`
              <div class="inventory-section">
                <h2>Inventory</h2>
                <dl class="info-list">
                  ${this.product.stockQuantity!==void 0?n`
                    <dt>Stock Quantity</dt>
                    <dd><decimal-units .value=${this.product.stockQuantity}></decimal-units></dd>
                  `:""}

                  ${this.product.reorderLevel!==void 0?n`
                    <dt>Reorder Level</dt>
                    <dd><decimal-units .value=${this.product.reorderLevel}></decimal-units></dd>
                  `:""}

                  ${this.product.warehouseLocation?n`
                    <dt>Warehouse Location</dt>
                    <dd>${this.product.warehouseLocation}</dd>
                  `:""}

                  ${this.product.inStock!==void 0?n`
                    <dt>In Stock</dt>
                    <dd><boolean-yesno .value=${this.product.inStock}></boolean-yesno></dd>
                  `:""}

                  ${this.nextRestockDateStr?n`
                    <dt>Next Restock</dt>
                    <dd><absolute-date .value=${this.nextRestockDateStr}></absolute-date></dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.originCountry||this.product.manufacturerCountry||this.product.shippingZone?n`
              <div class="geographic-section">
                <h2>Geographic Information</h2>
                <dl class="info-list">
                  ${this.product.originCountry?n`
                    <dt>Origin Country</dt>
                    <dd>${this.product.originCountry}</dd>
                  `:""}

                  ${this.product.manufacturerCountry?n`
                    <dt>Manufacturer Country</dt>
                    <dd>${this.product.manufacturerCountry}</dd>
                  `:""}

                  ${this.product.shippingZone?n`
                    <dt>Shipping Zone</dt>
                    <dd>${this.product.shippingZone}</dd>
                  `:""}

                  ${this.product.productLanguage?n`
                    <dt>Product Language</dt>
                    <dd>${this.product.productLanguage}</dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.firstName||this.product.lastName||this.product.supplierEmail||this.product.supplierPhone?n`
              <div class="supplier-section">
                <h2>Supplier Contact</h2>
                <dl class="info-list">
                  ${this.product.firstName||this.product.lastName?n`
                    <dt>Contact Name</dt>
                    <dd>${this.product.firstName} ${this.product.lastName}</dd>
                  `:""}

                  ${this.product.supplierEmail?n`
                    <dt>Email</dt>
                    <dd><span class="truncate-ellipsis" title=${this.product.supplierEmail}>${this.product.supplierEmail}</span></dd>
                  `:""}

                  ${this.product.supplierPhone?n`
                    <dt>Phone</dt>
                    <dd>${this.product.supplierPhone}</dd>
                  `:""}

                  ${this.product.supplierTaxId?n`
                    <dt>Tax ID</dt>
                    <dd>${this.product.supplierTaxId}</dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.isFeatured!==void 0||this.product.isBestSeller!==void 0||this.product.requiresShipping!==void 0||this.product.isDigital!==void 0||this.product.hasWarranty!==void 0?n`
              <div class="features-section">
                <h2>Product Features</h2>
                <dl class="info-list">
                  ${this.product.isFeatured!==void 0?n`
                    <dt>Featured</dt>
                    <dd><boolean-yesno .value=${this.product.isFeatured}></boolean-yesno></dd>
                  `:""}

                  ${this.product.isBestSeller!==void 0?n`
                    <dt>Best Seller</dt>
                    <dd><boolean-yesno .value=${this.product.isBestSeller}></boolean-yesno></dd>
                  `:""}

                  ${this.product.requiresShipping!==void 0?n`
                    <dt>Requires Shipping</dt>
                    <dd><boolean-yesno .value=${this.product.requiresShipping}></boolean-yesno></dd>
                  `:""}

                  ${this.product.isDigital!==void 0?n`
                    <dt>Digital Product</dt>
                    <dd><boolean-yesno .value=${this.product.isDigital}></boolean-yesno></dd>
                  `:""}

                  ${this.product.hasWarranty!==void 0?n`
                    <dt>Has Warranty</dt>
                    <dd><boolean-yesno .value=${this.product.hasWarranty}></boolean-yesno></dd>
                  `:""}

                  ${this.product.warrantyMonths!==void 0?n`
                    <dt>Warranty Period</dt>
                    <dd><decimal-units .value=${this.product.warrantyMonths} unit="months"></decimal-units></dd>
                  `:""}

                  ${this.product.certification?n`
                    <dt>Certification</dt>
                    <dd>${this.product.certification}</dd>
                  `:""}
                </dl>
              </div>
            `:""}

            ${this.product.shippingDepartureTime||this.product.flightDurationHours!==void 0?n`
              <div class="shipping-section">
                <h2>Shipping Information</h2>
                <dl class="info-list">
                  ${this.product.shippingDepartureTime?n`
                    <dt>Departure Time</dt>
                    <dd><time-format .value=${this.product.shippingDepartureTime}></time-format></dd>
                  `:""}

                  ${this.product.flightDurationHours!==void 0?n`
                    <dt>Flight Duration</dt>
                    <dd><decimal-units .value=${this.product.flightDurationHours} unit="hours"></decimal-units></dd>
                  `:""}
                </dl>
              </div>
            `:""}
          </div>
        </div>
      `:""}

      ${this.loadingState==="loading"?n`
        <div class="loading-state">
          <p>⏳ Loading product...</p>
        </div>
      `:""}

      ${this.loadingState==="error"?n`
        <div class="error-state">
          <p>Error loading product: ${this.errorMessage}</p>
        </div>
      `:""}
    `}};z.styles=g`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      padding-bottom: 8rem;
      overflow-y: auto;
      height: calc(100vh - 40px);
      box-sizing: border-box;
    }

    .back-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 2rem;
      transition: background 0.2s;
    }

    .back-button:hover {
      background: #0056b3;
    }

    .product-detail {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      padding-bottom: 8rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e9ecef;
    }

    .header-section h1 {
      margin: 0 0 1rem 0;
      color: #212529;
      font-size: 2rem;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .product-code {
      color: #6c757d;
      font-size: 0.95rem;
      font-family: monospace;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .image-gallery {
      grid-column: 1 / -1;
    }

    .image-gallery h2 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.5rem;
    }

    .main-image {
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.25rem;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 0.5rem;
    }

    .info-list {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 0.75rem 1rem;
      margin: 0;
    }

    dt {
      font-weight: 600;
      color: #495057;
      align-self: start;
    }

    dd {
      margin: 0;
      color: #212529;
      min-width: 0;
    }

    .truncate-ellipsis {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: help;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .score-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .score-label {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }

    .loading-state,
    .error-state,
    .not-found-state {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
    }

    .error-state {
      color: #dc3545;
    }

    .loading-state p {
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      .product-detail {
        padding: 1rem;
      }

      .header-section h1 {
        font-size: 1.5rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .info-list {
        grid-template-columns: 120px 1fr;
        gap: 0.5rem 0.75rem;
      }
    }
  `;X([l({type:String})],z.prototype,"code",2);X([f()],z.prototype,"product",2);X([f()],z.prototype,"loadingState",2);X([f()],z.prototype,"errorMessage",2);z=X([h("product-detail")],z);var Tr=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,dt=(t,e,s,i)=>{for(var r=i>1?void 0:i?Rr(e,s):e,a=t.length-1,o;a>=0;a--)(o=t[a])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Tr(e,s,r),r};let fe=class extends u{constructor(){super(...arguments),this.route={page:"list"}}connectedCallback(){super.connectedCallback(),this.handleRoute(),window.addEventListener("popstate",()=>this.handleRoute())}handleRoute(){const t=window.location.pathname,e="/".replace(/\/$/,"")||"",s=e?t.replace(e,""):t;if(s.startsWith("/detail/")){const i=s.replace("/detail/","");this.route={page:"detail",params:{code:i}}}else s==="/list"||s==="/"||s===""?this.route={page:"list"}:this.route={page:"list"}}navigate(t){const e="/".replace(/\/$/,"")||"";window.history.pushState({},"",e+t),this.handleRoute()}render(){return n`
      <framework-header></framework-header>
      ${this.route.page==="list"?n`<product-list @navigate=${t=>this.navigate(t.detail)}></product-list>`:n`<product-detail
            .code=${this.route.params?.code||""}
            @navigate=${t=>this.navigate(t.detail)}
          ></product-detail>`}
    `}};fe.styles=g`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
  `;dt([f()],fe.prototype,"route",2);fe=dt([h("lit-app")],fe);
