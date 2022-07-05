function makeMap(e,t){const n=Object.create(null);var r=e.split(",");for(let e=0;e<r.length;e++)n[r[e]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}const GLOBALS_WHITE_LISTED="Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt",isGloballyWhitelisted=makeMap(GLOBALS_WHITE_LISTED),specialBooleanAttrs="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",isSpecialBooleanAttr=makeMap(specialBooleanAttrs);function includeBooleanAttr(e){return !!e||""===e}function normalizeStyle(t){if(isArray$1(t)){const o={};for(let e=0;e<t.length;e++){var n=t[e],r=(isString$1(n)?parseStringStyle:normalizeStyle)(n);if(r)for(const s in r)o[s]=r[s];}return o}return isString$1(t)||isObject$1(t)?t:void 0}const listDelimiterRE=/;(?![^(]*\))/g,propertyDelimiterRE=/:(.+)/;function parseStringStyle(e){const n={};return e.split(listDelimiterRE).forEach(e=>{if(e){const t=e.split(propertyDelimiterRE);1<t.length&&(n[t[0].trim()]=t[1].trim());}}),n}function normalizeClass(t){let n="";if(isString$1(t))n=t;else if(isArray$1(t))for(let e=0;e<t.length;e++){var r=normalizeClass(t[e]);r&&(n+=r+" ");}else if(isObject$1(t))for(const e in t)t[e]&&(n+=e+" ");return n.trim()}const HTML_TAGS="html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot",SVG_TAGS="svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposample,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view",isHTMLTag=makeMap(HTML_TAGS),isSVGTag=makeMap(SVG_TAGS);const EMPTY_OBJ=Object.freeze({}),EMPTY_ARR=Object.freeze([]),NOOP=()=>{},NO=()=>!1,onRE=/^on[^a-z]/,isOn=e=>onRE.test(e),isModelListener=e=>e.startsWith("onUpdate:"),extend=Object.assign,remove=(e,t)=>{t=e.indexOf(t);-1<t&&e.splice(t,1);},hasOwnProperty$1=Object.prototype.hasOwnProperty,hasOwn$1=(e,t)=>hasOwnProperty$1.call(e,t),isArray$1=Array.isArray,isMap=e=>"[object Map]"===toTypeString$1(e),isSet=e=>"[object Set]"===toTypeString$1(e),isFunction$1=e=>"function"==typeof e,isString$1=e=>"string"==typeof e,isSymbol=e=>"symbol"==typeof e,isObject$1=e=>null!==e&&"object"==typeof e,isPromise=e=>isObject$1(e)&&isFunction$1(e.then)&&isFunction$1(e.catch),objectToString$1=Object.prototype.toString,toTypeString$1=e=>objectToString$1.call(e),toRawType=e=>toTypeString$1(e).slice(8,-1),isPlainObject$1=e=>"[object Object]"===toTypeString$1(e),isIntegerKey=e=>isString$1(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,isReservedProp=makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),isBuiltInDirective=makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"),cacheStringFunction=t=>{const n=Object.create(null);return e=>{return n[e]||(n[e]=t(e))}},camelizeRE=/-(\w)/g,camelize=cacheStringFunction(e=>e.replace(camelizeRE,(e,t)=>t?t.toUpperCase():"")),hyphenateRE=/\B([A-Z])/g,hyphenate=cacheStringFunction(e=>e.replace(hyphenateRE,"-$1").toLowerCase()),capitalize=cacheStringFunction(e=>e.charAt(0).toUpperCase()+e.slice(1)),toHandlerKey=cacheStringFunction(e=>e?`on${capitalize(e)}`:""),hasChanged=(e,t)=>!Object.is(e,t),invokeArrayFns=(t,n)=>{for(let e=0;e<t.length;e++)t[e](n);},def=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n});},toNumber=e=>{var t=parseFloat(e);return isNaN(t)?e:t};let _globalThis$1;const getGlobalThis$1=()=>_globalThis$1=_globalThis$1||("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{});function warn$1(e,...t){console.warn(`[Vue warn] ${e}`,...t);}let activeEffectScope;class EffectScope{constructor(e=!1){this.active=!0,this.effects=[],this.cleanups=[],!e&&activeEffectScope&&(this.parent=activeEffectScope,this.index=(activeEffectScope.scopes||(activeEffectScope.scopes=[])).push(this)-1);}run(e){if(this.active){var t=activeEffectScope;try{return activeEffectScope=this,e()}finally{activeEffectScope=t;}}else warn$1("cannot run an inactive effect scope.");}on(){activeEffectScope=this;}off(){activeEffectScope=this.parent;}stop(n){if(this.active){let e,t;for(e=0,t=this.effects.length;e<t;e++)this.effects[e].stop();for(e=0,t=this.cleanups.length;e<t;e++)this.cleanups[e]();if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].stop(!0);if(this.parent&&!n){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index);}this.active=!1;}}}function recordEffectScope(e,t=activeEffectScope){t&&t.active&&t.effects.push(e);}const createDep=e=>{const t=new Set(e);return t.w=0,t.n=0,t},wasTracked=e=>0<(e.w&trackOpBit),newTracked=e=>0<(e.n&trackOpBit),initDepMarkers=({deps:t})=>{if(t.length)for(let e=0;e<t.length;e++)t[e].w|=trackOpBit;},finalizeDepMarkers=n=>{const r=n["deps"];if(r.length){let t=0;for(let e=0;e<r.length;e++){const o=r[e];wasTracked(o)&&!newTracked(o)?o.delete(n):r[t++]=o,o.w&=~trackOpBit,o.n&=~trackOpBit;}r.length=t;}},targetMap=new WeakMap;let effectTrackDepth=0,trackOpBit=1;const maxMarkerBits=30;let activeEffect;const ITERATE_KEY=Symbol("iterate"),MAP_KEY_ITERATE_KEY=Symbol("Map key iterate");class ReactiveEffect{constructor(e,t=null,n){this.fn=e,this.scheduler=t,this.active=!0,this.deps=[],this.parent=void 0,recordEffectScope(this,n);}run(){if(!this.active)return this.fn();let e=activeEffect;for(var t=shouldTrack;e;){if(e===this)return;e=e.parent;}try{return this.parent=activeEffect,activeEffect=this,shouldTrack=!0,trackOpBit=1<<++effectTrackDepth,(effectTrackDepth<=maxMarkerBits?initDepMarkers:cleanupEffect)(this),this.fn()}finally{effectTrackDepth<=maxMarkerBits&&finalizeDepMarkers(this),trackOpBit=1<<--effectTrackDepth,activeEffect=this.parent,shouldTrack=t,this.parent=void 0,this.deferStop&&this.stop();}}stop(){activeEffect===this?this.deferStop=!0:this.active&&(cleanupEffect(this),this.onStop&&this.onStop(),this.active=!1);}}function cleanupEffect(t){const n=t["deps"];if(n.length){for(let e=0;e<n.length;e++)n[e].delete(t);n.length=0;}}let shouldTrack=!0;const trackStack=[];function pauseTracking(){trackStack.push(shouldTrack),shouldTrack=!1;}function resetTracking(){var e=trackStack.pop();shouldTrack=void 0===e||e;}function track(n,r,o){if(shouldTrack&&activeEffect){let e=targetMap.get(n);e||targetMap.set(n,e=new Map);let t=e.get(o);t||e.set(o,t=createDep());o={effect:activeEffect,target:n,type:r,key:o};trackEffects(t,o);}}function trackEffects(e,t){let n=!1;effectTrackDepth<=maxMarkerBits?newTracked(e)||(e.n|=trackOpBit,n=!wasTracked(e)):n=!e.has(activeEffect),n&&(e.add(activeEffect),activeEffect.deps.push(e),activeEffect.onTrack&&activeEffect.onTrack(Object.assign({effect:activeEffect},t)));}function trigger(e,t,r,o,s,a){const i=targetMap.get(e);if(i){let n=[];if("clear"===t)n=[...i.values()];else if("length"===r&&isArray$1(e))i.forEach((e,t)=>{("length"===t||o<=t)&&n.push(e);});else switch(void 0!==r&&n.push(i.get(r)),t){case"add":isArray$1(e)?isIntegerKey(r)&&n.push(i.get("length")):(n.push(i.get(ITERATE_KEY)),isMap(e)&&n.push(i.get(MAP_KEY_ITERATE_KEY)));break;case"delete":isArray$1(e)||(n.push(i.get(ITERATE_KEY)),isMap(e)&&n.push(i.get(MAP_KEY_ITERATE_KEY)));break;case"set":isMap(e)&&n.push(i.get(ITERATE_KEY));}a={target:e,type:t,key:r,newValue:o,oldValue:s,oldTarget:a};if(1===n.length)n[0]&&triggerEffects(n[0],a);else {const l=[];for(const c of n)c&&l.push(...c);triggerEffects(createDep(l),a);}}}function triggerEffects(e,t){for(const n of isArray$1(e)?e:[...e])n===activeEffect&&!n.allowRecurse||(n.onTrigger&&n.onTrigger(extend({effect:n},t)),n.scheduler?n.scheduler():n.run());}const isNonTrackableKeys=makeMap("__proto__,__v_isRef,__isVue"),builtInSymbols=new Set(Object.getOwnPropertyNames(Symbol).map(e=>Symbol[e]).filter(isSymbol)),get=createGetter(),shallowGet=createGetter(!1,!0),readonlyGet=createGetter(!0),shallowReadonlyGet=createGetter(!0,!0),arrayInstrumentations=createArrayInstrumentations();function createArrayInstrumentations(){const e={};return ["includes","indexOf","lastIndexOf"].forEach(r=>{e[r]=function(...e){const n=toRaw(this);for(let e=0,t=this.length;e<t;e++)track(n,"get",e+"");var t=n[r](...e);return -1===t||!1===t?n[r](...e.map(toRaw)):t};}),["push","pop","shift","unshift","splice"].forEach(t=>{e[t]=function(...e){pauseTracking();e=toRaw(this)[t].apply(this,e);return resetTracking(),e};}),e}function createGetter(o=!1,s=!1){return function(e,t,n){if("__v_isReactive"===t)return !o;if("__v_isReadonly"===t)return o;if("__v_isShallow"===t)return s;if("__v_raw"===t&&n===(o?s?shallowReadonlyMap:readonlyMap:s?shallowReactiveMap:reactiveMap).get(e))return e;var r=isArray$1(e);if(!o&&r&&hasOwn$1(arrayInstrumentations,t))return Reflect.get(arrayInstrumentations,t,n);n=Reflect.get(e,t,n);return (isSymbol(t)?builtInSymbols.has(t):isNonTrackableKeys(t))?n:(o||track(e,"get",t),s?n:isRef(n)?!r||!isIntegerKey(t)?n.value:n:isObject$1(n)?(o?readonly:reactive)(n):n)}}const set=createSetter(),shallowSet=createSetter(!0);function createSetter(i=!1){return function(e,t,n,r){let o=e[t];if(isReadonly(o)&&isRef(o)&&!isRef(n))return !1;if(!i&&!isReadonly(n)&&(isShallow(n)||(n=toRaw(n),o=toRaw(o)),!isArray$1(e)&&isRef(o)&&!isRef(n)))return o.value=n,!0;var s=isArray$1(e)&&isIntegerKey(t)?Number(t)<e.length:hasOwn$1(e,t),a=Reflect.set(e,t,n,r);return e===toRaw(r)&&(s?hasChanged(n,o)&&trigger(e,"set",t,n,o):trigger(e,"add",t,n)),a}}function deleteProperty(e,t){var n=hasOwn$1(e,t),r=e[t],o=Reflect.deleteProperty(e,t);return o&&n&&trigger(e,"delete",t,void 0,r),o}function has(e,t){var n=Reflect.has(e,t);return isSymbol(t)&&builtInSymbols.has(t)||track(e,"has",t),n}function ownKeys(e){return track(e,"iterate",isArray$1(e)?"length":ITERATE_KEY),Reflect.ownKeys(e)}const mutableHandlers={get:get,set:set,deleteProperty:deleteProperty,has:has,ownKeys:ownKeys},readonlyHandlers={get:readonlyGet,set(e,t){return warn$1(`Set operation on key "${String(t)}" failed: target is readonly.`,e),!0},deleteProperty(e,t){return warn$1(`Delete operation on key "${String(t)}" failed: target is readonly.`,e),!0}},shallowReactiveHandlers=extend({},mutableHandlers,{get:shallowGet,set:shallowSet}),shallowReadonlyHandlers=extend({},readonlyHandlers,{get:shallowReadonlyGet}),toShallow=e=>e,getProto=e=>Reflect.getPrototypeOf(e);function get$1(e,t,n=!1,r=!1){var o=toRaw(e=e.__v_raw),s=toRaw(t);t!==s&&(n||track(o,"get",t)),n||track(o,"get",s);const a=getProto(o)["has"],i=r?toShallow:n?toReadonly:toReactive;return a.call(o,t)?i(e.get(t)):a.call(o,s)?i(e.get(s)):void(e!==o&&e.get(t))}function has$1(e,t=!1){const n=this.__v_raw;var r=toRaw(n),o=toRaw(e);return e!==o&&(t||track(r,"has",e)),t||track(r,"has",o),e===o?n.has(e):n.has(e)||n.has(o)}function size(e,t=!1){return e=e.__v_raw,t||track(toRaw(e),"iterate",ITERATE_KEY),Reflect.get(e,"size",e)}function add(e){e=toRaw(e);const t=toRaw(this),n=getProto(t);return n.has.call(t,e)||(t.add(e),trigger(t,"add",e,e)),this}function set$1(e,t){t=toRaw(t);const n=toRaw(this),{has:r,get:o}=getProto(n);let s=r.call(n,e);s?checkIdentityKeys(n,r,e):(e=toRaw(e),s=r.call(n,e));var a=o.call(n,e);return n.set(e,t),s?hasChanged(t,a)&&trigger(n,"set",e,t,a):trigger(n,"add",e,t),this}function deleteEntry(e){const t=toRaw(this),{has:n,get:r}=getProto(t);let o=n.call(t,e);o?checkIdentityKeys(t,n,e):(e=toRaw(e),o=n.call(t,e));var s=r?r.call(t,e):void 0,a=t.delete(e);return o&&trigger(t,"delete",e,void 0,s),a}function clear(){const e=toRaw(this);var t=0!==e.size,n=new(isMap(e)?Map:Set)(e),r=e.clear();return t&&trigger(e,"clear",void 0,void 0,n),r}function createForEach(a,i){return function(n,r){const o=this,e=o.__v_raw;var t=toRaw(e);const s=i?toShallow:a?toReadonly:toReactive;return a||track(t,"iterate",ITERATE_KEY),e.forEach((e,t)=>n.call(r,s(e),s(t),o))}}function createIterableMethod(i,l,c){return function(...e){const t=this.__v_raw;var n=toRaw(t),r=isMap(n);const o="entries"===i||i===Symbol.iterator&&r;r="keys"===i&&r;const s=t[i](...e),a=c?toShallow:l?toReadonly:toReactive;return l||track(n,"iterate",r?MAP_KEY_ITERATE_KEY:ITERATE_KEY),{next(){var{value:e,done:t}=s.next();return t?{value:e,done:t}:{value:o?[a(e[0]),a(e[1])]:a(e),done:t}},[Symbol.iterator](){return this}}}}function createReadonlyMethod(t){return function(...e){e=e[0]?`on key "${e[0]}" `:"";return console.warn(`${capitalize(t)} operation ${e}failed: target is readonly.`,toRaw(this)),"delete"!==t&&this}}function createInstrumentations(){const t={get(e){return get$1(this,e)},get size(){return size(this)},has:has$1,add:add,set:set$1,delete:deleteEntry,clear:clear,forEach:createForEach(!1,!1)},n={get(e){return get$1(this,e,!1,!0)},get size(){return size(this)},has:has$1,add:add,set:set$1,delete:deleteEntry,clear:clear,forEach:createForEach(!1,!0)},r={get(e){return get$1(this,e,!0)},get size(){return size(this,!0)},has(e){return has$1.call(this,e,!0)},add:createReadonlyMethod("add"),set:createReadonlyMethod("set"),delete:createReadonlyMethod("delete"),clear:createReadonlyMethod("clear"),forEach:createForEach(!0,!1)},o={get(e){return get$1(this,e,!0,!0)},get size(){return size(this,!0)},has(e){return has$1.call(this,e,!0)},add:createReadonlyMethod("add"),set:createReadonlyMethod("set"),delete:createReadonlyMethod("delete"),clear:createReadonlyMethod("clear"),forEach:createForEach(!0,!0)},e=["keys","values","entries",Symbol.iterator];return e.forEach(e=>{t[e]=createIterableMethod(e,!1,!1),r[e]=createIterableMethod(e,!0,!1),n[e]=createIterableMethod(e,!1,!0),o[e]=createIterableMethod(e,!0,!0);}),[t,r,n,o]}const[mutableInstrumentations,readonlyInstrumentations,shallowInstrumentations,shallowReadonlyInstrumentations]=createInstrumentations();function createInstrumentationGetter(r,e){const o=e?r?shallowReadonlyInstrumentations:shallowInstrumentations:r?readonlyInstrumentations:mutableInstrumentations;return (e,t,n)=>"__v_isReactive"===t?!r:"__v_isReadonly"===t?r:"__v_raw"===t?e:Reflect.get(hasOwn$1(o,t)&&t in e?o:e,t,n)}const mutableCollectionHandlers={get:createInstrumentationGetter(!1,!1)},shallowCollectionHandlers={get:createInstrumentationGetter(!1,!0)},readonlyCollectionHandlers={get:createInstrumentationGetter(!0,!1)},shallowReadonlyCollectionHandlers={get:createInstrumentationGetter(!0,!0)};function checkIdentityKeys(e,t,n){var r=toRaw(n);r!==n&&t.call(e,r)&&(e=toRawType(e),console.warn(`Reactive ${e} contains both the raw and reactive `+`versions of the same object${"Map"===e?" as keys":""}, `+"which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible."));}const reactiveMap=new WeakMap,shallowReactiveMap=new WeakMap,readonlyMap=new WeakMap,shallowReadonlyMap=new WeakMap;function targetTypeMap(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function getTargetType(e){return e.__v_skip||!Object.isExtensible(e)?0:targetTypeMap(toRawType(e))}function reactive(e){return isReadonly(e)?e:createReactiveObject(e,!1,mutableHandlers,mutableCollectionHandlers,reactiveMap)}function shallowReactive(e){return createReactiveObject(e,!1,shallowReactiveHandlers,shallowCollectionHandlers,shallowReactiveMap)}function readonly(e){return createReactiveObject(e,!0,readonlyHandlers,readonlyCollectionHandlers,readonlyMap)}function shallowReadonly(e){return createReactiveObject(e,!0,shallowReadonlyHandlers,shallowReadonlyCollectionHandlers,shallowReadonlyMap)}function createReactiveObject(e,t,n,r,o){if(!isObject$1(e))return console.warn(`value cannot be made reactive: ${String(e)}`),e;if(e.__v_raw&&(!t||!e.__v_isReactive))return e;t=o.get(e);if(t)return t;t=getTargetType(e);if(0===t)return e;n=new Proxy(e,2===t?r:n);return o.set(e,n),n}function isReactive(e){return isReadonly(e)?isReactive(e.__v_raw):!(!e||!e.__v_isReactive)}function isReadonly(e){return !(!e||!e.__v_isReadonly)}function isShallow(e){return !(!e||!e.__v_isShallow)}function isProxy(e){return isReactive(e)||isReadonly(e)}function toRaw(e){var t=e&&e.__v_raw;return t?toRaw(t):e}function markRaw(e){return def(e,"__v_skip",!0),e}const toReactive=e=>isObject$1(e)?reactive(e):e,toReadonly=e=>isObject$1(e)?readonly(e):e;function trackRefValue(e){shouldTrack&&activeEffect&&trackEffects((e=toRaw(e)).dep||(e.dep=createDep()),{target:e,type:"get",key:"value"});}function triggerRefValue(e,t){(e=toRaw(e)).dep&&triggerEffects(e.dep,{target:e,type:"set",key:"value",newValue:t});}function isRef(e){return !(!e||!0!==e.__v_isRef)}function ref(e){return createRef(e,!1)}function createRef(e,t){return isRef(e)?e:new RefImpl(e,t)}class RefImpl{constructor(e,t){this.__v_isShallow=t,this.dep=void 0,this.__v_isRef=!0,this._rawValue=t?e:toRaw(e),this._value=t?e:toReactive(e);}get value(){return trackRefValue(this),this._value}set value(e){e=this.__v_isShallow?e:toRaw(e),hasChanged(e,this._rawValue)&&(this._rawValue=e,this._value=this.__v_isShallow?e:toReactive(e),triggerRefValue(this,e));}}function unref(e){return isRef(e)?e.value:e}const shallowUnwrapHandlers={get:(e,t,n)=>unref(Reflect.get(e,t,n)),set:(e,t,n,r)=>{const o=e[t];return isRef(o)&&!isRef(n)?(o.value=n,!0):Reflect.set(e,t,n,r)}};function proxyRefs(e){return isReactive(e)?e:new Proxy(e,shallowUnwrapHandlers)}class ComputedRefImpl{constructor(e,t,n,r){this._setter=t,this.dep=void 0,this.__v_isRef=!0,this._dirty=!0,this.effect=new ReactiveEffect(e,()=>{this._dirty||(this._dirty=!0,triggerRefValue(this));}),(this.effect.computed=this).effect.active=this._cacheable=!r,this.__v_isReadonly=n;}get value(){const e=toRaw(this);return trackRefValue(e),!e._dirty&&e._cacheable||(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e);}}function computed(e,t,n=!1){let r,o;var s=isFunction$1(e);o=s?(r=e,()=>{console.warn("Write operation failed: computed value is readonly");}):(r=e.get,e.set);const a=new ComputedRefImpl(r,o,s||!o,n);return t&&!n&&(a.effect.onTrack=t.onTrack,a.effect.onTrigger=t.onTrigger),a}const stack=[];function pushWarningContext(e){stack.push(e);}function popWarningContext(){stack.pop();}function warn$1$1(e,...t){pauseTracking();const n=stack.length?stack[stack.length-1].component:null;var r=n&&n.appContext.config.warnHandler;const o=getComponentTrace();if(r)callWithErrorHandling(r,n,11,[e+t.join(""),n&&n.proxy,o.map(({vnode:e})=>`at <${formatComponentName(n,e.type)}>`).join("\n"),o]);else {const s=[`[Vue warn]: ${e}`,...t];o.length&&s.push("\n",...formatTrace(o)),console.warn(...s);}resetTracking();}function getComponentTrace(){let e=stack[stack.length-1];if(!e)return [];const t=[];for(;e;){const r=t[0];r&&r.vnode===e?r.recurseCount++:t.push({vnode:e,recurseCount:0});var n=e.component&&e.component.parent;e=n&&n.vnode;}return t}function formatTrace(e){const n=[];return e.forEach((e,t)=>{n.push(...0===t?[]:["\n"],...formatTraceEntry(e));}),n}function formatTraceEntry({vnode:e,recurseCount:t}){var n=0<t?`... (${t} recursive calls)`:"",t=!!e.component&&null==e.component.parent,t=` at <${formatComponentName(e.component,e.type,t)}`,n=">"+n;return e.props?[t,...formatProps(e.props),n]:[t+n]}function formatProps(t){const n=[],e=Object.keys(t);return e.slice(0,3).forEach(e=>{n.push(...formatProp(e,t[e]));}),3<e.length&&n.push(" ..."),n}function formatProp(e,t,n){return isString$1(t)?(t=JSON.stringify(t),n?t:[`${e}=${t}`]):"number"==typeof t||"boolean"==typeof t||null==t?n?t:[`${e}=${t}`]:isRef(t)?(t=formatProp(e,toRaw(t.value),!0),n?t:[`${e}=Ref<`,t,">"]):isFunction$1(t)?[`${e}=fn${t.name?`<${t.name}>`:""}`]:(t=toRaw(t),n?t:[`${e}=`,t])}const ErrorTypeStrings={sp:"serverPrefetch hook",bc:"beforeCreate hook",c:"created hook",bm:"beforeMount hook",m:"mounted hook",bu:"beforeUpdate hook",u:"updated",bum:"beforeUnmount hook",um:"unmounted hook",a:"activated hook",da:"deactivated hook",ec:"errorCaptured hook",rtc:"renderTracked hook",rtg:"renderTriggered hook",[0]:"setup function",1:"render function",2:"watcher getter",3:"watcher callback",4:"watcher cleanup function",5:"native event handler",6:"component event handler",7:"vnode hook",8:"directive hook",9:"transition hook",10:"app errorHandler",11:"app warnHandler",12:"ref function",13:"async component loader",14:"scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"};function callWithErrorHandling(e,t,n,r){let o;try{o=r?e(...r):e();}catch(e){handleError(e,t,n);}return o}function callWithAsyncErrorHandling(t,n,r,o){if(isFunction$1(t)){const e=callWithErrorHandling(t,n,r,o);return e&&isPromise(e)&&e.catch(e=>{handleError(e,n,r);}),e}const s=[];for(let e=0;e<t.length;e++)s.push(callWithAsyncErrorHandling(t[e],n,r,o));return s}function handleError(t,n,r,e=!0){var o=n?n.vnode:null;if(n){let e=n.parent;for(var s=n.proxy,a=ErrorTypeStrings[r];e;){const i=e.ec;if(i)for(let e=0;e<i.length;e++)if(!1===i[e](t,s,a))return;e=e.parent;}n=n.appContext.config.errorHandler;if(n)return void callWithErrorHandling(n,null,10,[t,s,a])}logError(t,r,o,e);}function logError(e,t,n,r=!0){t=ErrorTypeStrings[t];if(n&&pushWarningContext(n),warn$1$1(`Unhandled error${t?` during execution of ${t}`:""}`),n&&popWarningContext(),r)throw e;console.error(e);}let isFlushing=!1,isFlushPending=!1;const queue=[];let flushIndex=0;const pendingPreFlushCbs=[];let activePreFlushCbs=null,preFlushIndex=0;const pendingPostFlushCbs=[];let activePostFlushCbs=null,postFlushIndex=0;const resolvedPromise=Promise.resolve();let currentFlushPromise=null,currentPreFlushParentJob=null;const RECURSION_LIMIT=100;function nextTick(e){const t=currentFlushPromise||resolvedPromise;return e?t.then(this?e.bind(this):e):t}function findInsertionIndex(e){let t=flushIndex+1,n=queue.length;for(;t<n;){var r=t+n>>>1;getId(queue[r])<e?t=1+r:n=r;}return t}function queueJob(e){queue.length&&queue.includes(e,isFlushing&&e.allowRecurse?flushIndex+1:flushIndex)||e===currentPreFlushParentJob||(null==e.id?queue.push(e):queue.splice(findInsertionIndex(e.id),0,e),queueFlush());}function queueFlush(){isFlushing||isFlushPending||(isFlushPending=!0,currentFlushPromise=resolvedPromise.then(flushJobs));}function invalidateJob(e){e=queue.indexOf(e);e>flushIndex&&queue.splice(e,1);}function queueCb(e,t,n,r){isArray$1(e)?n.push(...e):t&&t.includes(e,e.allowRecurse?r+1:r)||n.push(e),queueFlush();}function queuePreFlushCb(e){queueCb(e,activePreFlushCbs,pendingPreFlushCbs,preFlushIndex);}function queuePostFlushCb(e){queueCb(e,activePostFlushCbs,pendingPostFlushCbs,postFlushIndex);}function flushPreFlushCbs(e,t=null){if(pendingPreFlushCbs.length){for(currentPreFlushParentJob=t,activePreFlushCbs=[...new Set(pendingPreFlushCbs)],pendingPreFlushCbs.length=0,e=e||new Map,preFlushIndex=0;preFlushIndex<activePreFlushCbs.length;preFlushIndex++)checkRecursiveUpdates(e,activePreFlushCbs[preFlushIndex])||activePreFlushCbs[preFlushIndex]();activePreFlushCbs=null,preFlushIndex=0,currentPreFlushParentJob=null,flushPreFlushCbs(e,t);}}function flushPostFlushCbs(e){if(pendingPostFlushCbs.length){var t=[...new Set(pendingPostFlushCbs)];if(pendingPostFlushCbs.length=0,activePostFlushCbs)activePostFlushCbs.push(...t);else {for(activePostFlushCbs=t,e=e||new Map,activePostFlushCbs.sort((e,t)=>getId(e)-getId(t)),postFlushIndex=0;postFlushIndex<activePostFlushCbs.length;postFlushIndex++)checkRecursiveUpdates(e,activePostFlushCbs[postFlushIndex])||activePostFlushCbs[postFlushIndex]();activePostFlushCbs=null,postFlushIndex=0;}}}const getId=e=>null==e.id?1/0:e.id;function flushJobs(e){isFlushPending=!1,isFlushing=!0,flushPreFlushCbs(e=e||new Map),queue.sort((e,t)=>getId(e)-getId(t));try{for(flushIndex=0;flushIndex<queue.length;flushIndex++){var t=queue[flushIndex];t&&!1!==t.active&&(checkRecursiveUpdates(e,t)||callWithErrorHandling(t,null,14));}}finally{flushIndex=0,queue.length=0,flushPostFlushCbs(e),isFlushing=!1,currentFlushPromise=null,(queue.length||pendingPreFlushCbs.length||pendingPostFlushCbs.length)&&flushJobs(e);}}function checkRecursiveUpdates(e,t){if(e.has(t)){var n=e.get(t);if(n>RECURSION_LIMIT){var r=t.ownerInstance,r=r&&getComponentName(r.type);return warn$1$1(`Maximum recursive updates exceeded${r?` in component <${r}>`:""}. `+"This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function."),!0}e.set(t,n+1);}else e.set(t,1);}let isHmrUpdating=!1;const hmrDirtyComponents=new Set;getGlobalThis$1().__VUE_HMR_RUNTIME__={createRecord:tryWrap(createRecord),rerender:tryWrap(rerender),reload:tryWrap(reload)};const map=new Map;function registerHMR(e){var t=e.type.__hmrId;let n=map.get(t);n||(createRecord(t,e.type),n=map.get(t)),n.instances.add(e);}function unregisterHMR(e){map.get(e.type.__hmrId).instances.delete(e);}function createRecord(e,t){return !map.has(e)&&(map.set(e,{initialDef:normalizeClassComponent(t),instances:new Set}),!0)}function normalizeClassComponent(e){return isClassComponent(e)?e.__vccOpts:e}function rerender(e,t){const n=map.get(e);n&&(n.initialDef.render=t,[...n.instances].forEach(e=>{t&&(e.render=t,normalizeClassComponent(e.type).render=t),e.renderCache=[],isHmrUpdating=!0,e.update(),isHmrUpdating=!1;}));}function reload(e,t){var n=map.get(e);if(n){t=normalizeClassComponent(t),updateComponentDef(n.initialDef,t);const o=[...n.instances];for(const s of o){var r=normalizeClassComponent(s.type);hmrDirtyComponents.has(r)||(r!==n.initialDef&&updateComponentDef(r,t),hmrDirtyComponents.add(r)),s.appContext.optionsCache.delete(s.type),s.ceReload?(hmrDirtyComponents.add(r),s.ceReload(t.styles),hmrDirtyComponents.delete(r)):s.parent?(queueJob(s.parent.update),s.parent.type.__asyncLoader&&s.parent.ceReload&&s.parent.ceReload(t.styles)):s.appContext.reload?s.appContext.reload():"undefined"!=typeof window?window.location.reload():console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");}queuePostFlushCb(()=>{for(const e of o)hmrDirtyComponents.delete(normalizeClassComponent(e.type));});}}function updateComponentDef(e,t){extend(e,t);for(const n in e)"__file"===n||n in t||delete e[n];}function tryWrap(n){return (e,t)=>{try{return n(e,t)}catch(e){console.error(e),console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.");}}}let devtools$1,buffer=[],devtoolsNotInstalled=!1;function emit(e,...t){devtools$1?devtools$1.emit(e,...t):devtoolsNotInstalled||buffer.push({event:e,args:t});}function setDevtoolsHook(e,t){if(devtools$1=e,devtools$1)devtools$1.enabled=!0,buffer.forEach(({event:e,args:t})=>devtools$1.emit(e,...t)),buffer=[];else if("undefined"==typeof window||!window.HTMLElement||null!==(e=null===(e=window.navigator)||void 0===e?void 0:e.userAgent)&&void 0!==e&&e.includes("jsdom"))devtoolsNotInstalled=!0,buffer=[];else {const n=t.__VUE_DEVTOOLS_HOOK_REPLAY__=t.__VUE_DEVTOOLS_HOOK_REPLAY__||[];n.push(e=>{setDevtoolsHook(e,t);}),setTimeout(()=>{devtools$1||(t.__VUE_DEVTOOLS_HOOK_REPLAY__=null,devtoolsNotInstalled=!0,buffer=[]);},3e3);}}function devtoolsInitApp(e,t){emit("app:init",e,t,{Fragment:Fragment,Text:Text,Comment:Comment,Static:Static});}function devtoolsUnmountApp(e){emit("app:unmount",e);}const devtoolsComponentAdded=createDevtoolsComponentHook("component:added"),devtoolsComponentUpdated=createDevtoolsComponentHook("component:updated"),devtoolsComponentRemoved=createDevtoolsComponentHook("component:removed");function createDevtoolsComponentHook(t){return e=>{emit(t,e.appContext.app,e.uid,e.parent?e.parent.uid:void 0,e);}}const devtoolsPerfStart=createDevtoolsPerformanceHook("perf:start"),devtoolsPerfEnd=createDevtoolsPerformanceHook("perf:end");function createDevtoolsPerformanceHook(r){return (e,t,n)=>{emit(r,e.appContext.app,e.uid,e,t,n);}}function devtoolsComponentEmit(e,t,n){emit("component:emit",e.appContext.app,e,t,n);}function emit$1(r,o,...s){if(!r.isUnmounted){var a=r.vnode.props||EMPTY_OBJ,{emitsOptions:i,propsOptions:[l]}=r;if(i)if(o in i){const u=i[o];isFunction$1(u)&&(u(...s)||warn$1$1(`Invalid event arguments: event validation failed for event "${o}".`));}else l&&toHandlerKey(o)in l||warn$1$1(`Component emitted event "${o}" but it is neither declared in `+`the emits option nor as an "${toHandlerKey(o)}" prop.`);let e=s;var c=o.startsWith("update:"),i=c&&o.slice(7);i&&i in a&&({number:l,trim:i}=a[`${"modelValue"===i?"model":i}Modifiers`]||EMPTY_OBJ,i?e=s.map(e=>e.trim()):l&&(e=s.map(toNumber))),devtoolsComponentEmit(r,o,e);s=o.toLowerCase();s!==o&&a[toHandlerKey(s)]&&warn$1$1(`Event "${s}" is emitted in component `+`${formatComponentName(r,r.type)} but the handler is registered for "${o}". `+"Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. "+`You should probably use "${hyphenate(o)}" instead of "${o}".`);let t,n=a[t=toHandlerKey(o)]||a[t=toHandlerKey(camelize(o))];!n&&c&&(n=a[t=toHandlerKey(hyphenate(o))]),n&&callWithAsyncErrorHandling(n,r,6,e);a=a[t+"Once"];if(a){if(r.emitted){if(r.emitted[t])return}else r.emitted={};r.emitted[t]=!0,callWithAsyncErrorHandling(a,r,6,e);}}}function normalizeEmitsOptions(e,t,n=!1){const r=t.emitsCache;var o=r.get(e);if(void 0!==o)return o;const s=e.emits;let a={},i=!1;return isFunction$1(e)||(o=e=>{e=normalizeEmitsOptions(e,t,!0);e&&(i=!0,extend(a,e));},!n&&t.mixins.length&&t.mixins.forEach(o),e.extends&&o(e.extends),e.mixins&&e.mixins.forEach(o)),s||i?(isArray$1(s)?s.forEach(e=>a[e]=null):extend(a,s),r.set(e,a),a):(r.set(e,null),null)}function isEmitListener(e,t){return !(!e||!isOn(t))&&(t=t.slice(2).replace(/Once$/,""),hasOwn$1(e,t[0].toLowerCase()+t.slice(1))||hasOwn$1(e,hyphenate(t))||hasOwn$1(e,t))}let currentRenderingInstance=null,currentScopeId=null;function setCurrentRenderingInstance(e){var t=currentRenderingInstance;return currentRenderingInstance=e,currentScopeId=e&&e.type.__scopeId||null,t}function withCtx(n,r=currentRenderingInstance,e){if(!r)return n;if(n._n)return n;const o=(...e)=>{o._d&&setBlockTracking(-1);var t=setCurrentRenderingInstance(r),e=n(...e);return setCurrentRenderingInstance(t),o._d&&setBlockTracking(1),devtoolsComponentUpdated(r),e};return o._n=!0,o._c=!0,o._d=!0,o}let accessedAttrs=!1;function markAttrsAccessed(){accessedAttrs=!0;}function renderComponentRoot(t){const{type:e,vnode:n,proxy:r,withProxy:o,props:s,propsOptions:[a],slots:i,attrs:l,emit:c,render:u,renderCache:d,data:p,setupState:f,ctx:h,inheritAttrs:m}=t;let v,g;var y=setCurrentRenderingInstance(t);accessedAttrs=!1;try{if(4&n.shapeFlag){var b=o||r;v=normalizeVNode(u.call(b,b,d,s,f,p,h)),g=l;}else {const u=e;l===s&&markAttrsAccessed(),v=normalizeVNode(1<u.length?u(s,{get attrs(){return markAttrsAccessed(),l},slots:i,emit:c}):u(s,null)),g=e.props?l:getFunctionalFallthrough(l);}}catch(e){handleError(e,t,1),v=createVNode(Comment);}let C=v,w=void 0;if(0<v.patchFlag&&2048&v.patchFlag&&([C,w]=getChildRoot(v)),g&&!1!==m){const _=Object.keys(g);var t=C["shapeFlag"];if(_.length)if(7&t)a&&_.some(isModelListener)&&(g=filterModelListeners(g,a)),C=cloneVNode(C,g);else if(!accessedAttrs&&C.type!==Comment){var S=Object.keys(l);const k=[],T=[];for(let e=0,t=S.length;e<t;e++){const R=S[e];isOn(R)?isModelListener(R)||k.push(R[2].toLowerCase()+R.slice(3)):T.push(R);}T.length&&warn$1$1("Extraneous non-props attributes ("+`${T.join(", ")}) `+"were passed to component but could not be automatically inherited because component renders fragment or text root nodes."),k.length&&warn$1$1("Extraneous non-emits event listeners ("+`${k.join(", ")}) `+'were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.');}}return n.dirs&&(isElementRoot(C)||warn$1$1("Runtime directive used on component with non-element root node. The directives will not function as intended."),C.dirs=C.dirs?C.dirs.concat(n.dirs):n.dirs),n.transition&&(isElementRoot(C)||warn$1$1("Component inside <Transition> renders non-element root node that cannot be animated."),C.transition=n.transition),w?w(C):v=C,setCurrentRenderingInstance(y),v}const getChildRoot=t=>{const n=t.children,r=t.dynamicChildren;var e=filterSingleRoot(n);if(!e)return [t,void 0];const o=n.indexOf(e),s=r?r.indexOf(e):-1;return [normalizeVNode(e),e=>{n[o]=e,r&&(-1<s?r[s]=e:0<e.patchFlag&&(t.dynamicChildren=[...r,e]));}]};function filterSingleRoot(t){let n;for(let e=0;e<t.length;e++){var r=t[e];if(!isVNode(r))return;if(r.type!==Comment||"v-if"===r.children){if(n)return;n=r;}}return n}const getFunctionalFallthrough=e=>{let t;for(const n in e)"class"!==n&&"style"!==n&&!isOn(n)||((t=t||{})[n]=e[n]);return t},filterModelListeners=(e,t)=>{const n={};for(const r in e)isModelListener(r)&&r.slice(9)in t||(n[r]=e[r]);return n},isElementRoot=e=>7&e.shapeFlag||e.type===Comment;function shouldUpdateComponent(e,t,n){var{props:r,children:o,component:s}=e,{props:a,children:i,patchFlag:e}=t,l=s.emitsOptions;if((o||i)&&isHmrUpdating)return !0;if(t.dirs||t.transition)return !0;if(!(n&&0<=e))return !(!o&&!i||i&&i.$stable)||r!==a&&(r?!a||hasPropsChanged(r,a,l):!!a);if(1024&e)return !0;if(16&e)return r?hasPropsChanged(r,a,l):!!a;if(8&e){var c=t.dynamicProps;for(let e=0;e<c.length;e++){var u=c[e];if(a[u]!==r[u]&&!isEmitListener(l,u))return !0}}return !1}function hasPropsChanged(t,n,r){var o=Object.keys(n);if(o.length!==Object.keys(t).length)return !0;for(let e=0;e<o.length;e++){var s=o[e];if(n[s]!==t[s]&&!isEmitListener(r,s))return !0}return !1}function updateHOCHostEl({vnode:e,parent:t},n){for(;t&&t.subTree===e;)(e=t.vnode).el=n,t=t.parent;}const isSuspense=e=>e.__isSuspense;function queueEffectWithSuspense(e,t){t&&t.pendingBranch?isArray$1(e)?t.effects.push(...e):t.effects.push(e):queuePostFlushCb(e);}function provide(t,n){if(currentInstance){let e=currentInstance.provides;var r=currentInstance.parent&&currentInstance.parent.provides;r===e&&(e=currentInstance.provides=Object.create(r)),e[t]=n;}else warn$1$1("provide() can only be used inside setup().");}function inject(e,t,n=!1){var r=currentInstance||currentRenderingInstance;if(r){var o=null==r.parent?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides;return o&&e in o?o[e]:1<arguments.length?n&&isFunction$1(t)?t.call(r.proxy):t:void warn$1$1(`injection "${String(e)}" not found.`)}warn$1$1("inject() can only be used inside setup() or functional components.");}const INITIAL_WATCHER_VALUE={};function watch(e,t,n){return isFunction$1(t)||warn$1$1("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."),doWatch(e,t,n)}function doWatch(e,t,{immediate:n,deep:r,flush:o,onTrack:s,onTrigger:a}=EMPTY_OBJ){t||(void 0!==n&&warn$1$1('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'),void 0!==r&&warn$1$1('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'));const i=e=>{warn$1$1("Invalid watch source: ",e,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");},l=currentInstance;let c,u=!1,d=!1;if(isRef(e)?(c=()=>e.value,u=isShallow(e)):isReactive(e)?(c=()=>e,r=!0):isArray$1(e)?(d=!0,u=e.some(isReactive),c=()=>e.map(e=>isRef(e)?e.value:isReactive(e)?traverse(e):isFunction$1(e)?callWithErrorHandling(e,l,2):void i(e))):isFunction$1(e)?c=t?()=>callWithErrorHandling(e,l,2):()=>{if(!l||!l.isUnmounted)return p&&p(),callWithAsyncErrorHandling(e,l,3,[f])}:(c=NOOP,i(e)),t&&r){const y=c;c=()=>traverse(y());}let p,f=e=>{p=g.onStop=()=>{callWithErrorHandling(e,l,4);};},h=d?[]:INITIAL_WATCHER_VALUE;const m=()=>{if(g.active)if(t){const e=g.run();(r||u||(d?e.some((e,t)=>hasChanged(e,h[t])):hasChanged(e,h)))&&(p&&p(),callWithAsyncErrorHandling(t,l,3,[e,h===INITIAL_WATCHER_VALUE?void 0:h,f]),h=e);}else g.run();};m.allowRecurse=!!t;let v;v="sync"===o?m:"post"===o?()=>queuePostRenderEffect(m,l&&l.suspense):()=>{!l||l.isMounted?queuePreFlushCb(m):m();};const g=new ReactiveEffect(c,v);return g.onTrack=s,g.onTrigger=a,t?n?m():h=g.run():"post"===o?queuePostRenderEffect(g.run.bind(g),l&&l.suspense):g.run(),()=>{g.stop(),l&&l.scope&&remove(l.scope.effects,g);}}function instanceWatch(e,t,n){const r=this.proxy;var o=isString$1(e)?e.includes(".")?createPathGetter(r,e):()=>r[e]:e.bind(r,r);let s;isFunction$1(t)?s=t:(s=t.handler,n=t);t=currentInstance;setCurrentInstance(this);n=doWatch(o,s.bind(r),n);return t?setCurrentInstance(t):unsetCurrentInstance(),n}function createPathGetter(e,t){const n=t.split(".");return ()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}function traverse(t,n){if(!isObject$1(t)||t.__v_skip)return t;if((n=n||new Set).has(t))return t;if(n.add(t),isRef(t))traverse(t.value,n);else if(isArray$1(t))for(let e=0;e<t.length;e++)traverse(t[e],n);else if(isSet(t)||isMap(t))t.forEach(e=>{traverse(e,n);});else if(isPlainObject$1(t))for(const e in t)traverse(t[e],n);return t}function useTransitionState(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return onMounted(()=>{e.isMounted=!0;}),onBeforeUnmount(()=>{e.isUnmounting=!0;}),e}const TransitionHookValidator=[Function,Array],BaseTransitionImpl={name:"BaseTransition",props:{mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:TransitionHookValidator,onEnter:TransitionHookValidator,onAfterEnter:TransitionHookValidator,onEnterCancelled:TransitionHookValidator,onBeforeLeave:TransitionHookValidator,onLeave:TransitionHookValidator,onAfterLeave:TransitionHookValidator,onLeaveCancelled:TransitionHookValidator,onBeforeAppear:TransitionHookValidator,onAppear:TransitionHookValidator,onAfterAppear:TransitionHookValidator,onAppearCancelled:TransitionHookValidator},setup(d,{slots:e}){const p=getCurrentInstance(),f=useTransitionState();let h;return ()=>{var n=e.default&&getTransitionRawChildren(e.default(),!0);if(n&&n.length){let t=n[0];if(1<n.length){let e=!1;for(const c of n)if(c.type!==Comment){if(e){warn$1$1("<transition> can only be used on a single element or component. Use <transition-group> for lists.");break}t=c,e=!0;}}var r=toRaw(d),o=r["mode"];if(o&&"in-out"!==o&&"out-in"!==o&&"default"!==o&&warn$1$1(`invalid <transition> mode: ${o}`),f.isLeaving)return emptyPlaceholder(t);var s=getKeepAliveChild(t);if(!s)return emptyPlaceholder(t);const a=resolveTransitionHooks(s,r,f,p);setTransitionHooks(s,a);n=p.subTree;const i=n&&getKeepAliveChild(n);let e=!1;const l=s.type["getTransitionKey"];if(l&&(n=l(),void 0===h?h=n:n!==h&&(h=n,e=!0)),i&&i.type!==Comment&&(!isSameVNodeType(s,i)||e)){const u=resolveTransitionHooks(i,r,f,p);if(setTransitionHooks(i,u),"out-in"===o)return f.isLeaving=!0,u.afterLeave=()=>{f.isLeaving=!1,p.update();},emptyPlaceholder(t);"in-out"===o&&s.type!==Comment&&(u.delayLeave=(e,t,n)=>{const r=getLeavingNodesForType(f,i);r[String(i.key)]=i,e._leaveCb=()=>{t(),e._leaveCb=void 0,delete a.delayedLeave;},a.delayedLeave=n;});}return t}}}},BaseTransition=BaseTransitionImpl;function getLeavingNodesForType(e,t){const n=e["leavingVNodes"];let r=n.get(t.type);return r||(r=Object.create(null),n.set(t.type,r)),r}function resolveTransitionHooks(s,t,a,n){const{appear:i,mode:e,persisted:r=!1,onBeforeEnter:o,onEnter:l,onAfterEnter:c,onEnterCancelled:u,onBeforeLeave:d,onLeave:p,onAfterLeave:f,onLeaveCancelled:h,onBeforeAppear:m,onAppear:v,onAfterAppear:g,onAppearCancelled:y}=t,b=String(s.key),C=getLeavingNodesForType(a,s),w=(e,t)=>{e&&callWithAsyncErrorHandling(e,n,9,t);},S={mode:e,persisted:r,beforeEnter(e){let t=o;if(!a.isMounted){if(!i)return;t=m||o;}e._leaveCb&&e._leaveCb(!0);const n=C[b];n&&isSameVNodeType(s,n)&&n.el._leaveCb&&n.el._leaveCb(),w(t,[e]);},enter(t){let e=l,n=c,r=u;if(!a.isMounted){if(!i)return;e=v||l,n=g||c,r=y||u;}let o=!1;var s=t._enterCb=e=>{o||(o=!0,e?w(r,[t]):w(n,[t]),S.delayedLeave&&S.delayedLeave(),t._enterCb=void 0);};e?(e(t,s),e.length<=1&&s()):s();},leave(t,n){const r=String(s.key);if(t._enterCb&&t._enterCb(!0),a.isUnmounting)return n();w(d,[t]);let o=!1;var e=t._leaveCb=e=>{o||(o=!0,n(),e?w(h,[t]):w(f,[t]),t._leaveCb=void 0,C[r]===s&&delete C[r]);};C[r]=s,p?(p(t,e),p.length<=1&&e()):e();},clone(e){return resolveTransitionHooks(e,t,a,n)}};return S}function emptyPlaceholder(e){if(isKeepAlive(e))return (e=cloneVNode(e)).children=null,e}function getKeepAliveChild(e){return isKeepAlive(e)?e.children?e.children[0]:void 0:e}function setTransitionHooks(e,t){6&e.shapeFlag&&e.component?setTransitionHooks(e.component.subTree,t):128&e.shapeFlag?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t;}function getTransitionRawChildren(t,n=!1,r){let o=[],s=0;for(let e=0;e<t.length;e++){var a=t[e],i=null==r?a.key:String(r)+String(null!=a.key?a.key:e);a.type===Fragment?(128&a.patchFlag&&s++,o=o.concat(getTransitionRawChildren(a.children,n,i))):!n&&a.type===Comment||o.push(null!=i?cloneVNode(a,{key:i}):a);}if(1<s)for(let e=0;e<o.length;e++)o[e].patchFlag=-2;return o}const isAsyncWrapper=e=>!!e.type.__asyncLoader;const isKeepAlive=e=>e.type.__isKeepAlive;function onActivated(e,t){registerKeepAliveHook(e,"a",t);}function onDeactivated(e,t){registerKeepAliveHook(e,"da",t);}function registerKeepAliveHook(t,n,r=currentInstance){var o=t.__wdc||(t.__wdc=()=>{let e=r;for(;e;){if(e.isDeactivated)return;e=e.parent;}return t()});if(injectHook(n,o,r),r){let e=r.parent;for(;e&&e.parent;)isKeepAlive(e.parent.vnode)&&injectToKeepAliveRoot(o,n,r,e),e=e.parent;}}function injectToKeepAliveRoot(e,t,n,r){const o=injectHook(t,e,r,!0);onUnmounted(()=>{remove(r[t],o);},n);}function injectHook(t,n,r=currentInstance,e=!1){if(r){const s=r[t]||(r[t]=[]);var o=n.__weh||(n.__weh=(...e)=>{if(!r.isUnmounted){pauseTracking(),setCurrentInstance(r);e=callWithAsyncErrorHandling(n,r,t,e);return unsetCurrentInstance(),resetTracking(),e}});return e?s.unshift(o):s.push(o),o}warn$1$1(`${toHandlerKey(ErrorTypeStrings[t].replace(/ hook$/,""))} is called when there is no active component instance to be `+"associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.");}const createHook=n=>(e,t=currentInstance)=>(!isInSSRComponentSetup||"sp"===n)&&injectHook(n,e,t),onBeforeMount=createHook("bm"),onMounted=createHook("m"),onBeforeUpdate=createHook("bu"),onUpdated=createHook("u"),onBeforeUnmount=createHook("bum"),onUnmounted=createHook("um"),onServerPrefetch=createHook("sp"),onRenderTriggered=createHook("rtg"),onRenderTracked=createHook("rtc");function onErrorCaptured(e,t=currentInstance){injectHook("ec",e,t);}function createDuplicateChecker(){const n=Object.create(null);return (e,t)=>{n[t]?warn$1$1(`${e} property "${t}" is already defined in ${n[t]}.`):n[t]=e;}}let shouldCacheAccess=!0;function applyOptions(e){var t=resolveMergedOptions(e);const n=e.proxy;var r=e.ctx;shouldCacheAccess=!1,t.beforeCreate&&callHook(t.beforeCreate,e,"bc");const{data:o,computed:s,methods:a,watch:i,provide:l,inject:c,created:u,beforeMount:d,mounted:p,beforeUpdate:f,updated:h,activated:m,deactivated:v,beforeUnmount:g,unmounted:y,render:b,renderTracked:C,renderTriggered:w,errorCaptured:S,serverPrefetch:_,expose:k,inheritAttrs:T,components:R,directives:E}=t,x=createDuplicateChecker();var[t]=e.propsOptions;if(t)for(const P in t)x("Props",P);if(c&&resolveInjections(c,r,x,e.appContext.config.unwrapInjectedRef),a)for(const M in a){const N=a[M];isFunction$1(N)?(Object.defineProperty(r,M,{value:N.bind(n),configurable:!0,enumerable:!0,writable:!0}),x("Methods",M)):warn$1$1(`Method "${M}" has type "${typeof N}" in the component definition. `+"Did you reference the function correctly?");}if(o){isFunction$1(o)||warn$1$1("The data option must be a function. Plain object usage is no longer supported.");const $=o.call(n,n);if(isPromise($)&&warn$1$1("data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."),isObject$1($)){e.data=reactive($);for(const F in $)x("Data",F),"$"!==F[0]&&"_"!==F[0]&&Object.defineProperty(r,F,{configurable:!0,enumerable:!0,get:()=>$[F],set:NOOP});}else warn$1$1("data() should return an object.");}if(shouldCacheAccess=!0,s)for(const V in s){const H=s[V];var O=isFunction$1(H)?H.bind(n,n):isFunction$1(H.get)?H.get.bind(n,n):NOOP;O===NOOP&&warn$1$1(`Computed property "${V}" has no getter.`);var I=!isFunction$1(H)&&isFunction$1(H.set)?H.set.bind(n):()=>{warn$1$1(`Write operation failed: computed property "${V}" is readonly.`);};const j=computed$1({get:O,set:I});Object.defineProperty(r,V,{enumerable:!0,configurable:!0,get:()=>j.value,set:e=>j.value=e}),x("Computed",V);}if(i)for(const B in i)createWatcher(i[B],r,n,B);if(l){const D=isFunction$1(l)?l.call(n):l;Reflect.ownKeys(D).forEach(e=>{provide(e,D[e]);});}function A(t,e){isArray$1(e)?e.forEach(e=>t(e.bind(n))):e&&t(e.bind(n));}if(u&&callHook(u,e,"c"),A(onBeforeMount,d),A(onMounted,p),A(onBeforeUpdate,f),A(onUpdated,h),A(onActivated,m),A(onDeactivated,v),A(onErrorCaptured,S),A(onRenderTracked,C),A(onRenderTriggered,w),A(onBeforeUnmount,g),A(onUnmounted,y),A(onServerPrefetch,_),isArray$1(k))if(k.length){const L=e.exposed||(e.exposed={});k.forEach(t=>{Object.defineProperty(L,t,{get:()=>n[t],set:e=>n[t]=e});});}else e.exposed||(e.exposed={});b&&e.render===NOOP&&(e.render=b),null!=T&&(e.inheritAttrs=T),R&&(e.components=R),E&&(e.directives=E);}function resolveInjections(e,n,r=NOOP,o=!1){for(const a in e=isArray$1(e)?normalizeInject(e):e){var s=e[a];let t;t=isObject$1(s)?"default"in s?inject(s.from||a,s.default,!0):inject(s.from||a):inject(s),isRef(t)?o?Object.defineProperty(n,a,{enumerable:!0,configurable:!0,get:()=>t.value,set:e=>t.value=e}):(warn$1$1(`injected property "${a}" is a ref and will be auto-unwrapped `+"and no longer needs `.value` in the next minor release. To opt-in to the new behavior now, set `app.config.unwrapInjectedRef = true` (this config is temporary and will not be needed in the future.)"),n[a]=t):n[a]=t,r("Inject",a);}}function callHook(e,t,n){callWithAsyncErrorHandling(isArray$1(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n);}function createWatcher(e,t,n,r){var o,s=r.includes(".")?createPathGetter(n,r):()=>n[r];isString$1(e)?(o=t[e],isFunction$1(o)?watch(s,o):warn$1$1(`Invalid watch handler specified by key "${e}"`,o)):isFunction$1(e)?watch(s,e.bind(n)):isObject$1(e)?isArray$1(e)?e.forEach(e=>createWatcher(e,t,n,r)):(o=isFunction$1(e.handler)?e.handler.bind(n):t[e.handler],isFunction$1(o)?watch(s,o,e):warn$1$1(`Invalid watch handler specified by key "${e.handler}"`,o)):warn$1$1(`Invalid watch option: "${r}"`,e);}function resolveMergedOptions(e){var t=e.type,{mixins:n,extends:r}=t;const{mixins:o,optionsCache:s,config:{optionMergeStrategies:a}}=e.appContext;e=s.get(t);let i;return e?i=e:o.length||n||r?(i={},o.length&&o.forEach(e=>mergeOptions(i,e,a,!0)),mergeOptions(i,t,a)):i=t,s.set(t,i),i}function mergeOptions(t,e,n,r=!1){const{mixins:o,extends:s}=e;s&&mergeOptions(t,s,n,!0),o&&o.forEach(e=>mergeOptions(t,e,n,!0));for(const a in e)if(r&&"expose"===a)warn$1$1('"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.');else {const i=internalOptionMergeStrats[a]||n&&n[a];t[a]=i?i(t[a],e[a]):e[a];}return t}const internalOptionMergeStrats={data:mergeDataFn,props:mergeObjectOptions,emits:mergeObjectOptions,methods:mergeObjectOptions,computed:mergeObjectOptions,beforeCreate:mergeAsArray,created:mergeAsArray,beforeMount:mergeAsArray,mounted:mergeAsArray,beforeUpdate:mergeAsArray,updated:mergeAsArray,beforeDestroy:mergeAsArray,beforeUnmount:mergeAsArray,destroyed:mergeAsArray,unmounted:mergeAsArray,activated:mergeAsArray,deactivated:mergeAsArray,errorCaptured:mergeAsArray,serverPrefetch:mergeAsArray,components:mergeObjectOptions,directives:mergeObjectOptions,watch:mergeWatchOptions,provide:mergeDataFn,inject:mergeInject};function mergeDataFn(e,t){return t?e?function(){return extend(isFunction$1(e)?e.call(this,this):e,isFunction$1(t)?t.call(this,this):t)}:t:e}function mergeInject(e,t){return mergeObjectOptions(normalizeInject(e),normalizeInject(t))}function normalizeInject(t){if(isArray$1(t)){const n={};for(let e=0;e<t.length;e++)n[t[e]]=t[e];return n}return t}function mergeAsArray(e,t){return e?[...new Set([].concat(e,t))]:t}function mergeObjectOptions(e,t){return e?extend(extend(Object.create(null),e),t):t}function mergeWatchOptions(e,t){if(!e)return t;if(!t)return e;const n=extend(Object.create(null),e);for(const r in t)n[r]=mergeAsArray(e[r],t[r]);return n}function initProps(e,t,n,r=!1){const o={};var s={};def(s,InternalObjectKey,1),e.propsDefaults=Object.create(null),setFullProps(e,t,o,s);for(const a in e.propsOptions[0])a in o||(o[a]=void 0);validateProps(t||{},o,e),n?e.props=r?o:shallowReactive(o):e.type.props?e.props=o:e.props=s,e.attrs=s;}function updateProps(t,n,r,e){const{props:o,attrs:s,vnode:{patchFlag:a}}=t;var i=toRaw(o),[l]=t.propsOptions;let c=!1;if(t.type.__hmrId||t.parent&&t.parent.type.__hmrId||!(e||0<a)||16&a){setFullProps(t,n,o,s)&&(c=!0);let e;for(const f in i)n&&(hasOwn$1(n,f)||(e=hyphenate(f))!==f&&hasOwn$1(n,e))||(l?!r||void 0===r[f]&&void 0===r[e]||(o[f]=resolvePropValue(l,i,f,void 0,t,!0)):delete o[f]);if(s!==i)for(const h in s)n&&hasOwn$1(n,h)||(delete s[h],c=!0);}else if(8&a){var u=t.vnode.dynamicProps;for(let e=0;e<u.length;e++){var d,p=u[e];isEmitListener(t.emitsOptions,p)||(d=n[p],!l||hasOwn$1(s,p)?d!==s[p]&&(s[p]=d,c=!0):(p=camelize(p),o[p]=resolvePropValue(l,i,p,d,t,!1)));}}c&&trigger(t,"set","$attrs"),validateProps(n||{},o,t);}function setFullProps(t,n,r,o){const[s,a]=t.propsOptions;let i=!1,l;if(n)for(var c in n)if(!isReservedProp(c)){var u=n[c];let e;s&&hasOwn$1(s,e=camelize(c))?a&&a.includes(e)?(l=l||{})[e]=u:r[e]=u:isEmitListener(t.emitsOptions,c)||c in o&&u===o[c]||(o[c]=u,i=!0);}if(a){var d=toRaw(r),p=l||EMPTY_OBJ;for(let e=0;e<a.length;e++){var f=a[e];r[f]=resolvePropValue(s,d,f,p[f],t,!hasOwn$1(p,f));}}return i}function resolvePropValue(e,t,n,r,o,s){var a=e[n];if(null!=a){e=hasOwn$1(a,"default");if(e&&void 0===r){const i=a.default;if(a.type!==Function&&isFunction$1(i)){const l=o["propsDefaults"];n in l?r=l[n]:(setCurrentInstance(o),r=l[n]=i.call(null,t),unsetCurrentInstance());}else r=i;}a[0]&&(s&&!e?r=!1:!a[1]||""!==r&&r!==hyphenate(n)||(r=!0));}return r}function normalizePropsOptions(e,n,t=!1){const r=n.propsCache;var o=r.get(e);if(o)return o;var s=e.props;const a={},i=[];let l=!1;if(isFunction$1(e)||(f=e=>{l=!0;var[t,e]=normalizePropsOptions(e,n,!0);extend(a,t),e&&i.push(...e);},!t&&n.mixins.length&&n.mixins.forEach(f),e.extends&&f(e.extends),e.mixins&&e.mixins.forEach(f)),!s&&!l)return r.set(e,EMPTY_ARR),EMPTY_ARR;if(isArray$1(s))for(let e=0;e<s.length;e++){isString$1(s[e])||warn$1$1("props must be strings when using array syntax.",s[e]);var c=camelize(s[e]);validatePropName(c)&&(a[c]=EMPTY_OBJ);}else if(s){isObject$1(s)||warn$1$1("invalid props options",s);for(const h in s){var u=camelize(h);if(validatePropName(u)){var d,p=s[h];const m=a[u]=isArray$1(p)||isFunction$1(p)?{type:p}:p;m&&(d=getTypeIndex(Boolean,m.type),p=getTypeIndex(String,m.type),m[0]=-1<d,m[1]=p<0||d<p,(-1<d||hasOwn$1(m,"default"))&&i.push(u));}}}var f=[a,i];return r.set(e,f),f}function validatePropName(e){return "$"!==e[0]||(warn$1$1(`Invalid prop name: "${e}" is a reserved property.`),!1)}function getType(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:null===e?"null":""}function isSameType(e,t){return getType(e)===getType(t)}function getTypeIndex(t,e){return isArray$1(e)?e.findIndex(e=>isSameType(e,t)):isFunction$1(e)&&isSameType(e,t)?0:-1}function validateProps(e,t,n){var r=toRaw(t),o=n.propsOptions[0];for(const a in o){var s=o[a];null!=s&&validateProp(a,r[a],s,!hasOwn$1(e,a)&&!hasOwn$1(e,hyphenate(a)));}}function validateProp(e,n,t,r){const{type:o,required:s,validator:a}=t;if(s&&r)warn$1$1('Missing required prop: "'+e+'"');else if(null!=n||t.required){if(null!=o&&!0!==o){let t=!1;var i=isArray$1(o)?o:[o];const u=[];for(let e=0;e<i.length&&!t;e++){var{valid:l,expectedType:c}=assertType(n,i[e]);u.push(c||""),t=l;}if(!t)return void warn$1$1(getInvalidTypeMessage(e,n,u))}a&&!a(n)&&warn$1$1('Invalid prop: custom validator check failed for prop "'+e+'".');}}const isSimpleType=makeMap("String,Number,Boolean,Function,Symbol,BigInt");function assertType(e,t){let n;const r=getType(t);var o;return isSimpleType(r)?(o=typeof e,n=o===r.toLowerCase(),n||"object"!=o||(n=e instanceof t)):n="Object"===r?isObject$1(e):"Array"===r?isArray$1(e):"null"===r?null===e:e instanceof t,{valid:n,expectedType:r}}function getInvalidTypeMessage(e,t,n){let r=`Invalid prop: type check failed for prop "${e}".`+` Expected ${n.map(capitalize).join(" | ")}`;var o=n[0],s=toRawType(t),e=styleValue(t,o),t=styleValue(t,s);return 1===n.length&&isExplicable(o)&&!isBoolean$1(o,s)&&(r+=` with value ${e}`),r+=`, got ${s} `,isExplicable(s)&&(r+=`with value ${t}.`),r}function styleValue(e,t){return "String"===t?`"${e}"`:"Number"===t?`${Number(e)}`:`${e}`}function isExplicable(t){return ["string","number","boolean"].some(e=>t.toLowerCase()===e)}function isBoolean$1(...e){return e.some(e=>"boolean"===e.toLowerCase())}const isInternalKey=e=>"_"===e[0]||"$stable"===e,normalizeSlotValue=e=>isArray$1(e)?e.map(normalizeVNode):[normalizeVNode(e)],normalizeSlot=(t,n,e)=>{const r=withCtx((...e)=>(currentInstance&&warn$1$1(`Slot "${t}" invoked outside of the render function: `+"this will not track dependencies used in the slot. Invoke the slot function inside the render function instead."),normalizeSlotValue(n(...e))),e);return r._c=!1,r},normalizeObjectSlots=(e,t,n)=>{var r=e._ctx;for(const s in e)if(!isInternalKey(s)){var o=e[s];if(isFunction$1(o))t[s]=normalizeSlot(s,o,r);else if(null!=o){warn$1$1(`Non-function value encountered for slot "${s}". `+"Prefer function slots for better performance.");const a=normalizeSlotValue(o);t[s]=()=>a;}}},normalizeVNodeSlots=(e,t)=>{isKeepAlive(e.vnode)||warn$1$1("Non-function value encountered for default slot. Prefer function slots for better performance.");const n=normalizeSlotValue(t);e.slots.default=()=>n;},initSlots=(e,t)=>{var n;32&e.vnode.shapeFlag?(n=t._)?(e.slots=toRaw(t),def(t,"_",n)):normalizeObjectSlots(t,e.slots={}):(e.slots={},t&&normalizeVNodeSlots(e,t)),def(e.slots,InternalObjectKey,1);},updateSlots=(e,t,n)=>{const{vnode:r,slots:o}=e;let s=!0,a=EMPTY_OBJ;var i;if(32&r.shapeFlag?((i=t._)?isHmrUpdating?extend(o,t):n&&1===i?s=!1:(extend(o,t),n||1!==i||delete o._):(s=!t.$stable,normalizeObjectSlots(t,o)),a=t):t&&(normalizeVNodeSlots(e,t),a={default:1}),s)for(const l in o)isInternalKey(l)||l in a||delete o[l];};function validateDirectiveName(e){isBuiltInDirective(e)&&warn$1$1("Do not use built-in directive ids as custom directive id: "+e);}function invokeDirectiveHook(t,n,r,o){var s=t.dirs,a=n&&n.dirs;for(let e=0;e<s.length;e++){const l=s[e];a&&(l.oldValue=a[e].value);var i=l.dir[o];i&&(pauseTracking(),callWithAsyncErrorHandling(i,r,8,[t.el,l,t,n]),resetTracking());}}function createAppContext(){return {app:null,config:{isNativeTag:NO,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let uid=0;function createAppAPI(c,u){return function(o,s=null){isFunction$1(o)||(o=Object.assign({},o)),null==s||isObject$1(s)||(warn$1$1("root props passed to app.mount() must be an object."),s=null);const a=createAppContext(),n=new Set;let i=!1;const l=a.app={_uid:uid++,_component:o,_props:s,_container:null,_context:a,_instance:null,version:version,get config(){return a.config},set config(e){warn$1$1("app.config cannot be replaced. Modify individual options instead.");},use(e,...t){return n.has(e)?warn$1$1("Plugin has already been applied to target app."):e&&isFunction$1(e.install)?(n.add(e),e.install(l,...t)):isFunction$1(e)?(n.add(e),e(l,...t)):warn$1$1('A plugin must either be a function or an object with an "install" function.'),l},mixin(e){return a.mixins.includes(e)?warn$1$1("Mixin has already been applied to target app"+(e.name?`: ${e.name}`:"")):a.mixins.push(e),l},component(e,t){return validateComponentName(e,a.config),t?(a.components[e]&&warn$1$1(`Component "${e}" has already been registered in target app.`),a.components[e]=t,l):a.components[e]},directive(e,t){return validateDirectiveName(e),t?(a.directives[e]&&warn$1$1(`Directive "${e}" has already been registered in target app.`),a.directives[e]=t,l):a.directives[e]},mount(e,t,n){if(!i){const r=createVNode(o,s);return r.appContext=a,a.reload=()=>{c(cloneVNode(r),e,n);},t&&u?u(r,e):c(r,e,n),i=!0,(l._container=e).__vue_app__=l,l._instance=r.component,devtoolsInitApp(l,version),getExposeProxy(r.component)||r.component.proxy}warn$1$1("App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`");},unmount(){i?(c(null,l._container),l._instance=null,devtoolsUnmountApp(l),delete l._container.__vue_app__):warn$1$1("Cannot unmount an app that is not mounted.");},provide(e,t){return e in a.provides&&warn$1$1(`App already provides property with key "${String(e)}". `+"It will be overwritten with the new value."),a.provides[e]=t,l}};return l}}function setRef(t,n,r,o,s=!1){if(isArray$1(t))t.forEach((e,t)=>setRef(e,n&&(isArray$1(n)?n[t]:n),r,o,s));else if(!isAsyncWrapper(o)||s){const a=4&o.shapeFlag?getExposeProxy(o.component)||o.component.proxy:o.el,i=s?null:a,{i:l,r:c}=t;if(l){const u=n&&n.r,d=l.refs===EMPTY_OBJ?l.refs={}:l.refs,p=l.setupState;if(null!=u&&u!==c&&(isString$1(u)?(d[u]=null,hasOwn$1(p,u)&&(p[u]=null)):isRef(u)&&(u.value=null)),isFunction$1(c))callWithErrorHandling(c,l,12,[i,d]);else {const f=isString$1(c);var e=isRef(c);f||e?(e=()=>{if(t.f){const e=f?d[c]:c.value;s?isArray$1(e)&&remove(e,a):isArray$1(e)?e.includes(a)||e.push(a):f?(d[c]=[a],hasOwn$1(p,c)&&(p[c]=d[c])):(c.value=[a],t.k&&(d[t.k]=c.value));}else f?(d[c]=i,hasOwn$1(p,c)&&(p[c]=i)):isRef(c)?(c.value=i,t.k&&(d[t.k]=i)):warn$1$1("Invalid template ref type:",c,`(${typeof c})`);},i?(e.id=-1,queuePostRenderEffect(e,r)):e()):warn$1$1("Invalid template ref type:",c,`(${typeof c})`);}}else warn$1$1("Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.");}}let supported,perf;function startMeasure(e,t){e.appContext.config.performance&&isSupported()&&perf.mark(`vue-${t}-${e.uid}`),devtoolsPerfStart(e,t,(isSupported()?perf:Date).now());}function endMeasure(e,t){var n,r;e.appContext.config.performance&&isSupported()&&(r=(n=`vue-${t}-${e.uid}`)+":end",perf.mark(r),perf.measure(`<${formatComponentName(e,e.type)}> ${t}`,n,r),perf.clearMarks(n),perf.clearMarks(r)),devtoolsPerfEnd(e,t,(isSupported()?perf:Date).now());}function isSupported(){return void 0!==supported||("undefined"!=typeof window&&window.performance?(supported=!0,perf=window.performance):supported=!1),supported}const queuePostRenderEffect=queueEffectWithSuspense;function createRenderer(e){return baseCreateRenderer(e)}function baseCreateRenderer(e,t){const n=getGlobalThis$1();n.__VUE__=!0,setDevtoolsHook(n.__VUE_DEVTOOLS_GLOBAL_HOOK__,n);const{insert:g,remove:c,patchProp:b,createElement:y,createText:v,createComment:o,setText:C,setElementText:w,parentNode:S,nextSibling:_,setScopeId:s=NOOP,insertStaticContent:k}=e,x=(e,t,n,r=null,o=null,s=null,a=!1,i=null,l=!isHmrUpdating&&!!t.dynamicChildren)=>{if(e!==t){e&&!isSameVNodeType(e,t)&&(r=D(e),j(e,o,s,!0),e=null),-2===t.patchFlag&&(l=!1,t.dynamicChildren=null);const{type:f,ref:h,shapeFlag:m}=t;switch(f){case Text:((e,t,n,r)=>{if(e==null)g(t.el=v(t.children),n,r);else {const o=t.el=e.el;if(t.children!==e.children)C(o,t.children);}})(e,t,n,r);break;case Comment:T(e,t,n,r);break;case Static:null==e?(c=t,u=n,d=r,p=a,[c.el,c.anchor]=k(c.children,u,d,p,c.el,c.anchor)):((e,t,n,r)=>{if(t.children!==e.children){const o=_(e.anchor);R(e);[t.el,t.anchor]=k(t.children,n,o,r);}else {t.el=e.el;t.anchor=e.anchor;}})(e,t,n,a);break;case Fragment:((e,t,n,r,o,s,a,i,l)=>{const c=t.el=e?e.el:v(""),u=t.anchor=e?e.anchor:v("");let{patchFlag:d,dynamicChildren:p,slotScopeIds:f}=t;if(isHmrUpdating){d=0;l=false;p=null;}if(f)i=i?i.concat(f):f;if(e==null){g(c,n,r);g(u,n,r);I(t.children,n,u,o,s,a,i,l);}else if(d>0&&d&64&&p&&e.dynamicChildren){P(e.dynamicChildren,p,n,o,s,a,i);if(o&&o.type.__hmrId)traverseStaticChildren(e,t);else if(t.key!=null||o&&t===o.subTree)traverseStaticChildren(e,t,true);}else V(e,t,n,u,o,s,a,i,l);})(e,t,n,r,o,s,a,i,l);break;default:1&m?((e,t,n,r,o,s,a,i,l)=>{if(a=a||t.type==="svg",e==null)E(t,n,r,o,s,a,i,l);else A(e,t,o,s,a,i,l);})(e,t,n,r,o,s,a,i,l):6&m?((e,t,n,r,o,s,a,i,l)=>{if(t.slotScopeIds=i,e==null)if(t.shapeFlag&512)o.ctx.activate(t,n,r,a,l);else N(t,n,r,o,s,a,l);else $(e,t,l);})(e,t,n,r,o,s,a,i,l):64&m||128&m?f.process(e,t,n,r,o,s,a,i,l,L):warn$1$1("Invalid VNode type:",f,`(${typeof f})`);}var c,u,d,p;null!=h&&o&&setRef(h,e&&e.ref,s,t||e,!t);}},T=(e,t,n,r)=>{null==e?g(t.el=o(t.children||""),n,r):t.el=e.el;},R=({el:e,anchor:t})=>{for(var n;e&&e!==t;)n=_(e),c(e),e=n;c(t);},E=(e,t,n,r,o,s,a,i)=>{let l,c;const{type:u,props:d,shapeFlag:p,transition:f,dirs:h}=e;if(l=e.el=y(e.type,s,d&&d.is,d),8&p?w(l,e.children):16&p&&I(e.children,l,null,r,o,s&&"foreignObject"!==u,a,i),h&&invokeDirectiveHook(e,null,r,"created"),d){for(const v in d)"value"===v||isReservedProp(v)||b(l,v,null,d[v],s,e.children,r,o,B);"value"in d&&b(l,"value",null,d.value),(c=d.onVnodeBeforeMount)&&invokeVNodeHook(c,r,e);}O(l,e,e.scopeId,a,r),Object.defineProperty(l,"__vnode",{value:e,enumerable:!1}),Object.defineProperty(l,"__vueParentComponent",{value:r,enumerable:!1}),h&&invokeDirectiveHook(e,null,r,"beforeMount");const m=(!o||!o.pendingBranch)&&f&&!f.persisted;m&&f.beforeEnter(l),g(l,t,n),((c=d&&d.onVnodeMounted)||m||h)&&queuePostRenderEffect(()=>{c&&invokeVNodeHook(c,r,e),m&&f.enter(l),h&&invokeDirectiveHook(e,null,r,"mounted");},o);},O=(t,n,e,r,o)=>{if(e&&s(t,e),r)for(let e=0;e<r.length;e++)s(t,r[e]);if(o){let e=o.subTree;0<e.patchFlag&&2048&e.patchFlag&&(e=filterSingleRoot(e.children)||e),n===e&&(n=o.vnode,O(t,n,n.scopeId,n.slotScopeIds,o.parent));}},I=(t,n,r,o,s,a,i,l,c=0)=>{for(let e=c;e<t.length;e++){var u=t[e]=(l?cloneIfMounted:normalizeVNode)(t[e]);x(null,u,n,r,o,s,a,i,l);}},A=(t,e,n,r,o,s,a)=>{var i=e.el=t.el;let{patchFlag:l,dynamicChildren:c,dirs:u}=e;l|=16&t.patchFlag;var d=t.props||EMPTY_OBJ,p=e.props||EMPTY_OBJ;let f;n&&toggleRecurse(n,!1),(f=p.onVnodeBeforeUpdate)&&invokeVNodeHook(f,n,e,t),u&&invokeDirectiveHook(e,t,n,"beforeUpdate"),n&&toggleRecurse(n,!0),isHmrUpdating&&(l=0,a=!1,c=null);var h=o&&"foreignObject"!==e.type;if(c?(P(t.dynamicChildren,c,i,n,r,h,s),n&&n.type.__hmrId&&traverseStaticChildren(t,e)):a||V(t,e,i,null,n,r,h,s,!1),0<l){if(16&l)M(i,e,d,p,n,r,o);else if(2&l&&d.class!==p.class&&b(i,"class",null,p.class,o),4&l&&b(i,"style",d.style,p.style,o),8&l){var m=e.dynamicProps;for(let e=0;e<m.length;e++){var v=m[e],g=d[v],y=p[v];y===g&&"value"!==v||b(i,v,g,y,o,t.children,n,r,B);}}1&l&&t.children!==e.children&&w(i,e.children);}else a||null!=c||M(i,e,d,p,n,r,o);((f=p.onVnodeUpdated)||u)&&queuePostRenderEffect(()=>{f&&invokeVNodeHook(f,n,e,t),u&&invokeDirectiveHook(e,t,n,"updated");},r);},P=(t,n,r,o,s,a,i)=>{for(let e=0;e<n.length;e++){var l=t[e],c=n[e],u=l.el&&(l.type===Fragment||!isSameVNodeType(l,c)||70&l.shapeFlag)?S(l.el):r;x(l,c,u,null,o,s,a,i,!0);}},M=(e,t,n,r,o,s,a)=>{if(n!==r){for(const c in r){var i,l;isReservedProp(c)||(i=r[c])!==(l=n[c])&&"value"!==c&&b(e,c,l,i,a,t.children,o,s,B);}if(n!==EMPTY_OBJ)for(const u in n)isReservedProp(u)||u in r||b(e,u,n[u],null,a,t.children,o,s,B);"value"in r&&b(e,"value",n.value,r.value);}},N=(e,t,n,r,o,s,a)=>{const i=e.component=createComponentInstance(e,r,o);if(i.type.__hmrId&&registerHMR(i),pushWarningContext(e),startMeasure(i,"mount"),isKeepAlive(e)&&(i.ctx.renderer=L),startMeasure(i,"init"),setupComponent(i),endMeasure(i,"init"),i.asyncDep)return o&&o.registerDep(i,l),void(e.el||(r=i.subTree=createVNode(Comment),T(null,r,t,n)));l(i,e,t,n,o,s,a),popWarningContext(),endMeasure(i,"mount");},$=(e,t,n)=>{const r=t.component=e.component;shouldUpdateComponent(e,t,n)?r.asyncDep&&!r.asyncResolved?(pushWarningContext(t),F(r,t,n),popWarningContext()):(r.next=t,invalidateJob(r.update),r.update()):(t.component=e.component,t.el=e.el,r.vnode=t);},l=(d,p,f,h,m,v,g)=>{const e=d.effect=new ReactiveEffect(()=>{if(d.isMounted){let{next:e,bu:t,u:n,parent:r,vnode:o}=d;var a=e;let s;pushWarningContext(e||d.vnode),toggleRecurse(d,!1),e?(e.el=o.el,F(d,e,g)):e=o,t&&invokeArrayFns(t),(s=e.props&&e.props.onVnodeBeforeUpdate)&&invokeVNodeHook(s,r,e,o),toggleRecurse(d,!0),startMeasure(d,"render");var i=renderComponentRoot(d);endMeasure(d,"render");var l=d.subTree;d.subTree=i,startMeasure(d,"patch"),x(l,i,S(l.el),D(l),d,m,v),endMeasure(d,"patch"),e.el=i.el,null===a&&updateHOCHostEl(d,i.el),n&&queuePostRenderEffect(n,m),(s=e.props&&e.props.onVnodeUpdated)&&queuePostRenderEffect(()=>invokeVNodeHook(s,r,e,o),m),devtoolsComponentUpdated(d),popWarningContext();}else {let e;const{el:t,props:n}=p,{bm:r,m:o,parent:s}=d;a=isAsyncWrapper(p);if(toggleRecurse(d,!1),r&&invokeArrayFns(r),!a&&(e=n&&n.onVnodeBeforeMount)&&invokeVNodeHook(e,s,p),toggleRecurse(d,!0),t&&z){const c=()=>{startMeasure(d,"render"),d.subTree=renderComponentRoot(d),endMeasure(d,"render"),startMeasure(d,"hydrate"),z(t,d.subTree,d,m,null),endMeasure(d,"hydrate");};a?p.type.__asyncLoader().then(()=>!d.isUnmounted&&c()):c();}else {startMeasure(d,"render");i=d.subTree=renderComponentRoot(d);endMeasure(d,"render"),startMeasure(d,"patch"),x(null,i,f,h,d,m,v),endMeasure(d,"patch"),p.el=i.el;}if(o&&queuePostRenderEffect(o,m),!a&&(e=n&&n.onVnodeMounted)){const u=p;queuePostRenderEffect(()=>invokeVNodeHook(e,s,u),m);}256&p.shapeFlag&&d.a&&queuePostRenderEffect(d.a,m),d.isMounted=!0,devtoolsComponentAdded(d),p=f=h=null;}},()=>queueJob(d.update),d.scope),t=d.update=e.run.bind(e);t.id=d.uid,toggleRecurse(d,!0),e.onTrack=d.rtc?e=>invokeArrayFns(d.rtc,e):void 0,e.onTrigger=d.rtg?e=>invokeArrayFns(d.rtg,e):void 0,t.ownerInstance=d,t();},F=(e,t,n)=>{var r=(t.component=e).vnode.props;e.vnode=t,e.next=null,updateProps(e,t.props,r,n),updateSlots(e,t.children,n),pauseTracking(),flushPreFlushCbs(void 0,e.update),resetTracking();},V=(e,t,n,r,o,s,a,i,l=!1)=>{var c=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:e,shapeFlag:t}=t;if(0<e){if(128&e)return void p(c,d,n,r,o,s,a,i,l);if(256&e)return void((e,t,n,r,o,s,a,i,l)=>{e=e||EMPTY_ARR,t=t||EMPTY_ARR;const c=e.length,u=t.length,d=Math.min(c,u);let p;for(p=0;p<d;p++){const f=t[p]=l?cloneIfMounted(t[p]):normalizeVNode(t[p]);x(e[p],f,n,null,o,s,a,i,l);}if(c>u)B(e,o,s,true,false,d);else I(t,n,r,o,s,a,i,l,d);})(c,d,n,r,o,s,a,i,l)}8&t?(16&u&&B(c,o,s),d!==c&&w(n,d)):16&u?16&t?p(c,d,n,r,o,s,a,i,l):B(c,o,s,!0):(8&u&&w(n,""),16&t&&I(d,n,r,o,s,a,i,l));},p=(e,s,a,i,l,c,u,d,p)=>{let f=0;var h=s.length;let m=e.length-1,v=h-1;for(;f<=m&&f<=v;){var t=e[f],n=s[f]=(p?cloneIfMounted:normalizeVNode)(s[f]);if(!isSameVNodeType(t,n))break;x(t,n,a,null,l,c,u,d,p),f++;}for(;f<=m&&f<=v;){var r=e[m],o=s[v]=(p?cloneIfMounted:normalizeVNode)(s[v]);if(!isSameVNodeType(r,o))break;x(r,o,a,null,l,c,u,d,p),m--,v--;}if(f>m){if(f<=v)for(var g=v+1,y=g<h?s[g].el:i;f<=v;)x(null,s[f]=(p?cloneIfMounted:normalizeVNode)(s[f]),a,y,l,c,u,d,p),f++;}else if(f>v)for(;f<=m;)j(e[f],l,c,!0),f++;else {var g=f,b=f;const R=new Map;for(f=b;f<=v;f++){var C=s[f]=(p?cloneIfMounted:normalizeVNode)(s[f]);null!=C.key&&(R.has(C.key)&&warn$1$1("Duplicate keys found during update:",JSON.stringify(C.key),"Make sure keys are unique."),R.set(C.key,f));}let t,n=0;var w=v-b+1;let r=!1,o=0;const E=new Array(w);for(f=0;f<w;f++)E[f]=0;for(f=g;f<=m;f++){var S=e[f];if(n>=w)j(S,l,c,!0);else {let e;if(null!=S.key)e=R.get(S.key);else for(t=b;t<=v;t++)if(0===E[t-b]&&isSameVNodeType(S,s[t])){e=t;break}void 0===e?j(S,l,c,!0):(E[e-b]=f+1,e>=o?o=e:r=!0,x(S,s[e],a,null,l,c,u,d,p),n++);}}var _=r?getSequence(E):EMPTY_ARR;for(t=_.length-1,f=w-1;0<=f;f--){var k=b+f,T=s[k],k=k+1<h?s[k+1].el:i;0===E[f]?x(null,T,a,k,l,c,u,d,p):r&&(t<0||f!==_[t]?H(T,a,k,2):t--);}}},H=(e,t,n,r,o=null)=>{const{el:s,type:a,transition:i,children:l,shapeFlag:c}=e;if(6&c)H(e.component.subTree,t,n,r);else if(128&c)e.suspense.move(t,n,r);else if(64&c)a.move(e,t,n,L);else if(a!==Fragment)if(a!==Static)if(2!==r&&1&c&&i)if(0===r)i.beforeEnter(s),g(s,t,n),queuePostRenderEffect(()=>i.enter(s),o);else {const{leave:u,delayLeave:d,afterLeave:p}=i,f=()=>g(s,t,n);o=()=>{u(s,()=>{f(),p&&p();});};d?d(s,f,o):o();}else g(s,t,n);else (({el:e,anchor:t},n,r)=>{for(var o;e&&e!==t;)o=_(e),g(e,n,r),e=o;g(t,n,r);})(e,t,n);else {g(s,t,n);for(let e=0;e<l.length;e++)H(l[e],t,n,r);g(e.anchor,t,n);}},j=(t,n,r,o=!1,s=!1)=>{var{type:a,props:i,ref:e,children:l,dynamicChildren:c,shapeFlag:u,patchFlag:d,dirs:p}=t;if(null!=e&&setRef(e,null,r,t,!0),256&u)n.ctx.deactivate(t);else {const f=1&u&&p;p=!isAsyncWrapper(t);let e;if(p&&(e=i&&i.onVnodeBeforeUnmount)&&invokeVNodeHook(e,n,t),6&u)m(t.component,r,o);else {if(128&u)return void t.suspense.unmount(r,o);f&&invokeDirectiveHook(t,null,n,"beforeUnmount"),64&u?t.type.remove(t,n,r,s,L,o):c&&(a!==Fragment||0<d&&64&d)?B(c,n,r,!1,!0):(a===Fragment&&384&d||!s&&16&u)&&B(l,n,r),o&&h(t);}(p&&(e=i&&i.onVnodeUnmounted)||f)&&queuePostRenderEffect(()=>{e&&invokeVNodeHook(e,n,t),f&&invokeDirectiveHook(t,null,n,"unmounted");},r);}},h=e=>{const{type:t,el:n,anchor:r,transition:o}=e;if(t!==Fragment)if(t!==Static){const a=()=>{c(n),o&&!o.persisted&&o.afterLeave&&o.afterLeave();};if(1&e.shapeFlag&&o&&!o.persisted){const{leave:i,delayLeave:l}=o;var s=()=>i(n,a);l?l(e.el,a,s):s();}else a();}else R(e);else 0<e.patchFlag&&2048&e.patchFlag&&o&&!o.persisted?e.children.forEach(e=>{e.type===Comment?c(e.el):h(e);}):((e,t)=>{let n;while(e!==t){n=_(e);c(e);e=n;}c(t);})(n,r);},m=(e,t,n)=>{e.type.__hmrId&&unregisterHMR(e);const{bum:r,scope:o,update:s,subTree:a,um:i}=e;r&&invokeArrayFns(r),o.stop(),s&&(s.active=!1,j(a,e,t,n)),i&&queuePostRenderEffect(i,t),queuePostRenderEffect(()=>{e.isUnmounted=!0;},t),t&&t.pendingBranch&&!t.isUnmounted&&e.asyncDep&&!e.asyncResolved&&e.suspenseId===t.pendingId&&(t.deps--,0===t.deps&&t.resolve()),devtoolsComponentRemoved(e);},B=(t,n,r,o=!1,s=!1,a=0)=>{for(let e=a;e<t.length;e++)j(t[e],n,r,o,s);},D=e=>6&e.shapeFlag?D(e.component.subTree):128&e.shapeFlag?e.suspense.next():_(e.anchor||e.el);var r=(e,t,n)=>{null==e?t._vnode&&j(t._vnode,null,null,!0):x(t._vnode||null,e,t,null,null,null,n),flushPostFlushCbs(),t._vnode=e;};const L={p:x,um:j,m:H,r:h,mt:N,mc:I,pc:V,pbc:P,n:D,o:e};let a,z;return t&&([a,z]=t(L)),{render:r,hydrate:a,createApp:createAppAPI(r,a)}}function toggleRecurse({effect:e,update:t},n){e.allowRecurse=t.allowRecurse=n;}function traverseStaticChildren(e,t,n=!1){var r=e.children;const o=t.children;if(isArray$1(r)&&isArray$1(o))for(let t=0;t<r.length;t++){var s=r[t];let e=o[t];1&e.shapeFlag&&!e.dynamicChildren&&((e.patchFlag<=0||32===e.patchFlag)&&(e=o[t]=cloneIfMounted(o[t]),e.el=s.el),n||traverseStaticChildren(s,e)),e.type!==Comment||e.el||(e.el=s.el);}}function getSequence(e){const t=e.slice(),n=[0];let r,o,s,a,i;var l=e.length;for(r=0;r<l;r++){var c=e[r];if(0!==c)if(e[o=n[n.length-1]]<c)t[r]=o,n.push(r);else {for(s=0,a=n.length-1;s<a;)i=s+a>>1,e[n[i]]<c?s=1+i:a=i;c<e[n[s]]&&(0<s&&(t[r]=n[s-1]),n[s]=r);}}for(s=n.length,a=n[s-1];0<s--;)n[s]=a,a=t[a];return n}const isTeleport=e=>e.__isTeleport;const NULL_DYNAMIC_COMPONENT=Symbol();const Fragment=Symbol("Fragment"),Text=Symbol("Text"),Comment=Symbol("Comment"),Static=Symbol("Static");let currentBlock=null;let isBlockTreeEnabled=1;function setBlockTracking(e){isBlockTreeEnabled+=e;}function isVNode(e){return !!e&&!0===e.__v_isVNode}function isSameVNodeType(e,t){return !(6&t.shapeFlag&&hmrDirtyComponents.has(t.type))&&(e.type===t.type&&e.key===t.key)}const createVNodeWithArgsTransform=(...e)=>_createVNode(...e),InternalObjectKey="__vInternal",normalizeKey=({key:e})=>null!=e?e:null,normalizeRef=({ref:e,ref_key:t,ref_for:n})=>null!=e?isString$1(e)||isRef(e)||isFunction$1(e)?{i:currentRenderingInstance,r:e,k:t,f:!!n}:e:null;function createBaseVNode(e,t=null,n=null,r=0,o=null,s=e===Fragment?0:1,a=!1,i=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&normalizeKey(t),ref:t&&normalizeRef(t),scopeId:currentScopeId,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null};return i?(normalizeChildren(l,n),128&s&&e.normalize(l)):n&&(l.shapeFlag|=isString$1(n)?8:16),l.key!=l.key&&warn$1$1("VNode created with invalid key (NaN). VNode type:",l.type),0<isBlockTreeEnabled&&!a&&currentBlock&&(0<l.patchFlag||6&s)&&32!==l.patchFlag&&currentBlock.push(l),l}const createVNode=createVNodeWithArgsTransform;function _createVNode(e,n=null,t=null,r=0,o=null,s=!1){if(e&&e!==NULL_DYNAMIC_COMPONENT||(e||warn$1$1(`Invalid vnode type when creating vnode: ${e}.`),e=Comment),isVNode(e)){var a=cloneVNode(e,n,!0);return t&&normalizeChildren(a,t),a}if(isClassComponent(e)&&(e=e.__vccOpts),n){let{class:e,style:t}=n=guardReactiveProps(n);e&&!isString$1(e)&&(n.class=normalizeClass(e)),isObject$1(t)&&(isProxy(t)&&!isArray$1(t)&&(t=extend({},t)),n.style=normalizeStyle(t));}a=isString$1(e)?1:isSuspense(e)?128:isTeleport(e)?64:isObject$1(e)?4:isFunction$1(e)?2:0;return 4&a&&isProxy(e)&&warn$1$1("Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.","\nComponent that was made reactive: ",e=toRaw(e)),createBaseVNode(e,n,t,r,o,a,s,!0)}function guardReactiveProps(e){return e?isProxy(e)||InternalObjectKey in e?extend({},e):e:null}function cloneVNode(e,t,n=!1){const{props:r,ref:o,patchFlag:s,children:a}=e;var i=t?mergeProps(r||{},t):r;return {__v_isVNode:!0,__v_skip:!0,type:e.type,props:i,key:i&&normalizeKey(i),ref:t&&t.ref?n&&o?isArray$1(o)?o.concat(normalizeRef(t)):[o,normalizeRef(t)]:normalizeRef(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:-1===s&&isArray$1(a)?a.map(deepCloneVNode):a,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Fragment?-1===s?16:16|s:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&cloneVNode(e.ssContent),ssFallback:e.ssFallback&&cloneVNode(e.ssFallback),el:e.el,anchor:e.anchor}}function deepCloneVNode(e){const t=cloneVNode(e);return isArray$1(e.children)&&(t.children=e.children.map(deepCloneVNode)),t}function createTextVNode(e=" ",t=0){return createVNode(Text,null,e,t)}function normalizeVNode(e){return null==e||"boolean"==typeof e?createVNode(Comment):isArray$1(e)?createVNode(Fragment,null,e.slice()):"object"==typeof e?cloneIfMounted(e):createVNode(Text,null,String(e))}function cloneIfMounted(e){return null===e.el||e.memo?e:cloneVNode(e)}function normalizeChildren(e,t){let n=0;var r=e["shapeFlag"];if(null==t)t=null;else if(isArray$1(t))n=16;else if("object"==typeof t){if(65&r){const s=t.default;return void(s&&(s._c&&(s._d=!1),normalizeChildren(e,s()),s._c&&(s._d=!0)))}n=32;var o=t._;o||InternalObjectKey in t?3===o&&currentRenderingInstance&&(1===currentRenderingInstance.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=currentRenderingInstance;}else isFunction$1(t)?(t={default:t,_ctx:currentRenderingInstance},n=32):(t=String(t),64&r?(n=16,t=[createTextVNode(t)]):n=8);e.children=t,e.shapeFlag|=n;}function mergeProps(...t){const n={};for(let e=0;e<t.length;e++){var r=t[e];for(const s in r)if("class"===s)n.class!==r.class&&(n.class=normalizeClass([n.class,r.class]));else if("style"===s)n.style=normalizeStyle([n.style,r.style]);else if(isOn(s)){const a=n[s];var o=r[s];!o||a===o||isArray$1(a)&&a.includes(o)||(n[s]=a?[].concat(a,o):o);}else ""!==s&&(n[s]=r[s]);}return n}function invokeVNodeHook(e,t,n,r=null){callWithAsyncErrorHandling(e,t,7,[n,r]);}const getPublicInstance=e=>e?isStatefulComponent(e)?getExposeProxy(e)||e.proxy:getPublicInstance(e.parent):null,publicPropertiesMap=extend(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>shallowReadonly(e.props),$attrs:e=>shallowReadonly(e.attrs),$slots:e=>shallowReadonly(e.slots),$refs:e=>shallowReadonly(e.refs),$parent:e=>getPublicInstance(e.parent),$root:e=>getPublicInstance(e.root),$emit:e=>e.emit,$options:e=>resolveMergedOptions(e),$forceUpdate:e=>()=>queueJob(e.update),$nextTick:e=>nextTick.bind(e.proxy),$watch:e=>instanceWatch.bind(e)}),PublicInstanceProxyHandlers={get({_:e},t){const{ctx:n,setupState:r,data:o,props:s,accessCache:a,type:i,appContext:l}=e;if("__isVue"===t)return !0;if(r!==EMPTY_OBJ&&r.__isScriptSetup&&hasOwn$1(r,t))return r[t];if("$"!==t[0]){var c=a[t];if(void 0!==c)switch(c){case 1:return r[t];case 2:return o[t];case 4:return n[t];case 3:return s[t]}else {if(r!==EMPTY_OBJ&&hasOwn$1(r,t))return a[t]=1,r[t];if(o!==EMPTY_OBJ&&hasOwn$1(o,t))return a[t]=2,o[t];if((c=e.propsOptions[0])&&hasOwn$1(c,t))return a[t]=3,s[t];if(n!==EMPTY_OBJ&&hasOwn$1(n,t))return a[t]=4,n[t];shouldCacheAccess&&(a[t]=0);}}const u=publicPropertiesMap[t];let d,p;return u?("$attrs"===t&&(track(e,"get",t),markAttrsAccessed()),u(e)):(d=i.__cssModules)&&(d=d[t])?d:n!==EMPTY_OBJ&&hasOwn$1(n,t)?(a[t]=4,n[t]):(p=l.config.globalProperties,hasOwn$1(p,t)?p[t]:void(!currentRenderingInstance||isString$1(t)&&0===t.indexOf("__v")||(o===EMPTY_OBJ||"$"!==t[0]&&"_"!==t[0]||!hasOwn$1(o,t)?e===currentRenderingInstance&&warn$1$1(`Property ${JSON.stringify(t)} was accessed during render `+"but is not defined on instance."):warn$1$1(`Property ${JSON.stringify(t)} must be accessed via $data because it starts with a reserved `+'character ("$" or "_") and is not proxied on the render context.'))))},set({_:e},t,n){const{data:r,setupState:o,ctx:s}=e;return o!==EMPTY_OBJ&&hasOwn$1(o,t)?(o[t]=n,!0):r!==EMPTY_OBJ&&hasOwn$1(r,t)?(r[t]=n,!0):hasOwn$1(e.props,t)?(warn$1$1(`Attempting to mutate prop "${t}". Props are readonly.`,e),!1):"$"===t[0]&&t.slice(1)in e?(warn$1$1(`Attempting to mutate public property "${t}". `+"Properties starting with $ are reserved and readonly.",e),!1):(t in e.appContext.config.globalProperties?Object.defineProperty(s,t,{enumerable:!0,configurable:!0,value:n}):s[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:o,propsOptions:s}},a){return !!n[a]||e!==EMPTY_OBJ&&hasOwn$1(e,a)||t!==EMPTY_OBJ&&hasOwn$1(t,a)||(s=s[0])&&hasOwn$1(s,a)||hasOwn$1(r,a)||hasOwn$1(publicPropertiesMap,a)||hasOwn$1(o.config.globalProperties,a)},defineProperty(e,t,n){return null!=n.get?e._.accessCache[t]=0:hasOwn$1(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)},ownKeys:e=>(warn$1$1("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."),Reflect.ownKeys(e))};extend({},PublicInstanceProxyHandlers,{get(e,t){if(t!==Symbol.unscopables)return PublicInstanceProxyHandlers.get(e,t,e)},has(e,t){var n="_"!==t[0]&&!isGloballyWhitelisted(t);return !n&&PublicInstanceProxyHandlers.has(e,t)&&warn$1$1(`Property ${JSON.stringify(t)} should not start with _ which is a reserved prefix for Vue internals.`),n}});function createDevRenderContext(t){const n={};return Object.defineProperty(n,"_",{configurable:!0,enumerable:!1,get:()=>t}),Object.keys(publicPropertiesMap).forEach(e=>{Object.defineProperty(n,e,{configurable:!0,enumerable:!1,get:()=>publicPropertiesMap[e](t),set:NOOP});}),n}function exposePropsOnRenderContext(t){const{ctx:n,propsOptions:[e]}=t;e&&Object.keys(e).forEach(e=>{Object.defineProperty(n,e,{enumerable:!0,configurable:!0,get:()=>t.props[e],set:NOOP});});}function exposeSetupStateOnRenderContext(e){const{ctx:t,setupState:n}=e;Object.keys(toRaw(n)).forEach(e=>{n.__isScriptSetup||("$"!==e[0]&&"_"!==e[0]?Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:()=>n[e],set:NOOP}):warn$1$1(`setup() return property ${JSON.stringify(e)} should not start with "$" or "_" `+"which are reserved prefixes for Vue internals."));});}const emptyAppContext=createAppContext();let uid$1=0;function createComponentInstance(e,t,n){var r=e.type,o=(t||e).appContext||emptyAppContext;const s={uid:uid$1++,vnode:e,type:r,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,scope:new EffectScope(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:normalizePropsOptions(r,o),emitsOptions:normalizeEmitsOptions(r,o),emit:null,emitted:null,propsDefaults:EMPTY_OBJ,inheritAttrs:r.inheritAttrs,ctx:EMPTY_OBJ,data:EMPTY_OBJ,props:EMPTY_OBJ,attrs:EMPTY_OBJ,slots:EMPTY_OBJ,refs:EMPTY_OBJ,setupState:EMPTY_OBJ,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx=createDevRenderContext(s),s.root=t?t.root:s,s.emit=emit$1.bind(null,s),e.ce&&e.ce(s),s}let currentInstance=null;const getCurrentInstance=()=>currentInstance||currentRenderingInstance,setCurrentInstance=e=>{(currentInstance=e).scope.on();},unsetCurrentInstance=()=>{currentInstance&&currentInstance.scope.off(),currentInstance=null;},isBuiltInTag=makeMap("slot,component");function validateComponentName(e,t){const n=t.isNativeTag||NO;(isBuiltInTag(e)||n(e))&&warn$1$1("Do not use built-in or reserved HTML elements as component id: "+e);}function isStatefulComponent(e){return 4&e.vnode.shapeFlag}let isInSSRComponentSetup=!1;function setupComponent(e,t=!1){isInSSRComponentSetup=t;var{props:n,children:r}=e.vnode,o=isStatefulComponent(e);initProps(e,n,o,t),initSlots(e,r);t=o?setupStatefulComponent(e,t):void 0;return isInSSRComponentSetup=!1,t}function setupStatefulComponent(t,n){var e=t.type;if(e.name&&validateComponentName(e.name,t.appContext.config),e.components){var r=Object.keys(e.components);for(let e=0;e<r.length;e++)validateComponentName(r[e],t.appContext.config);}if(e.directives){var o=Object.keys(e.directives);for(let e=0;e<o.length;e++)validateDirectiveName(o[e]);}e.compilerOptions&&isRuntimeOnly()&&warn$1$1('"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'),t.accessCache=Object.create(null),t.proxy=markRaw(new Proxy(t.ctx,PublicInstanceProxyHandlers)),exposePropsOnRenderContext(t);var s=e["setup"];if(s){var a=t.setupContext=1<s.length?createSetupContext(t):null;setCurrentInstance(t),pauseTracking();const i=callWithErrorHandling(s,t,0,[shallowReadonly(t.props),a]);if(resetTracking(),unsetCurrentInstance(),isPromise(i)){if(i.then(unsetCurrentInstance,unsetCurrentInstance),n)return i.then(e=>{handleSetupResult(t,e,n);}).catch(e=>{handleError(e,t,0);});t.asyncDep=i,t.suspense||warn$1$1(`Component <${null!==(e=e.name)&&void 0!==e?e:"Anonymous"}>: setup function returned a promise, but no `+"<Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.");}else handleSetupResult(t,i,n);}else finishComponentSetup(t,n);}function handleSetupResult(e,t,n){isFunction$1(t)?e.render=t:isObject$1(t)?(isVNode(t)&&warn$1$1("setup() should not return VNodes directly - return a render function instead."),e.devtoolsRawSetupState=t,e.setupState=proxyRefs(t),exposeSetupStateOnRenderContext(e)):void 0!==t&&warn$1$1(`setup() should return an object. Received: ${null===t?"null":typeof t}`),finishComponentSetup(e,n);}let compile,installWithProxy;const isRuntimeOnly=()=>!compile;function finishComponentSetup(e,t,n){const r=e.type;var o,s,a,i,l;e.render||(t||!compile||r.render||(o=r.template)&&(startMeasure(e,"compile"),{isCustomElement:s,compilerOptions:a}=e.appContext.config,{delimiters:i,compilerOptions:l}=r,l=extend(extend({isCustomElement:s,delimiters:i},a),l),r.render=compile(o,l),endMeasure(e,"compile")),e.render=r.render||NOOP,installWithProxy),setCurrentInstance(e),pauseTracking(),applyOptions(e),resetTracking(),unsetCurrentInstance(),r.render||e.render!==NOOP||t||(r.template?warn$1$1('Component provided template option but runtime compilation is not supported in this build of Vue. Use "vue.esm-browser.js" instead.'):warn$1$1("Component is missing template or render function."));}function createAttrsProxy(n){return new Proxy(n.attrs,{get(e,t){return markAttrsAccessed(),track(n,"get","$attrs"),e[t]},set(){return warn$1$1("setupContext.attrs is readonly."),!1},deleteProperty(){return warn$1$1("setupContext.attrs is readonly."),!1}})}function createSetupContext(n){let e;return Object.freeze({get attrs(){return e=e||createAttrsProxy(n)},get slots(){return shallowReadonly(n.slots)},get emit(){return (e,...t)=>n.emit(e,...t)},expose:e=>{n.exposed&&warn$1$1("expose() should be called only once per setup()."),n.exposed=e||{};}})}function getExposeProxy(n){if(n.exposed)return n.exposeProxy||(n.exposeProxy=new Proxy(proxyRefs(markRaw(n.exposed)),{get(e,t){return t in e?e[t]:t in publicPropertiesMap?publicPropertiesMap[t](n):void 0}}))}const classifyRE=/(?:^|[-_])(\w)/g,classify=e=>e.replace(classifyRE,e=>e.toUpperCase()).replace(/[-_]/g,"");function getComponentName(e){return isFunction$1(e)&&e.displayName||e.name}function formatComponentName(e,n,t=!1){let r=getComponentName(n);var o;return r||!n.__file||(o=n.__file.match(/([^/\\]+)\.\w+$/))&&(r=o[1]),!r&&e&&e.parent&&(o=e=>{for(const t in e)if(e[t]===n)return t},r=o(e.components||e.parent.type.components)||o(e.appContext.components)),r?classify(r):t?"App":"Anonymous"}function isClassComponent(e){return isFunction$1(e)&&"__vccOpts"in e}const computed$1=(e,t)=>computed(e,t,isInSSRComponentSetup);function h(e,t,n){var r=arguments.length;return 2===r?isObject$1(t)&&!isArray$1(t)?isVNode(t)?createVNode(e,null,[t]):createVNode(e,t):createVNode(e,null,t):(3<r?n=Array.prototype.slice.call(arguments,2):3===r&&isVNode(n)&&(n=[n]),createVNode(e,t,n))}function initCustomFormatter(){if("undefined"!=typeof window){const t={style:"color:#3ba776"},s={style:"color:#0b1bc9"},a={style:"color:#b62e24"},i={style:"color:#9d288c"};var e={header(e){return isObject$1(e)?e.__isVue?["div",t,"VueInstance"]:isRef(e)?["div",{},["span",t,function(e){if(isShallow(e))return "ShallowRef";if(e.effect)return "ComputedRef";return "Ref"}(e)],"<",n(e.value),">"]:isReactive(e)?["div",{},["span",t,isShallow(e)?"ShallowReactive":"Reactive"],"<",n(e),`>${isReadonly(e)?" (readonly)":""}`]:isReadonly(e)?["div",{},["span",t,isShallow(e)?"ShallowReadonly":"Readonly"],"<",n(e),">"]:null:null},hasBody(e){return e&&e.__isVue},body(e){if(e&&e.__isVue)return ["div",{},...function(e){const t=[];e.type.props&&e.props&&t.push(r("props",toRaw(e.props)));e.setupState!==EMPTY_OBJ&&t.push(r("setup",e.setupState));e.data!==EMPTY_OBJ&&t.push(r("data",toRaw(e.data)));var n=o(e,"computed");n&&t.push(r("computed",n));n=o(e,"inject");n&&t.push(r("injected",n));return t.push(["div",{},["span",{style:i.style+";opacity:0.66"},"$ (internal): "],["object",{object:e}]]),t}(e.$)]}};function r(e,t){return t=extend({},t),Object.keys(t).length?["div",{style:"line-height:1.25em;margin-bottom:0.6em"},["div",{style:"color:#476582"},e],["div",{style:"padding-left:1.25em"},...Object.keys(t).map(e=>["div",{},["span",i,e+": "],n(t[e],!1)])]]:["span",{}]}function n(e,t=!0){return "number"==typeof e?["span",s,e]:"string"==typeof e?["span",a,JSON.stringify(e)]:"boolean"==typeof e?["span",i,e]:isObject$1(e)?["object",{object:t?toRaw(e):e}]:["span",a,String(e)]}function o(e,t){var n=e.type;if(!isFunction$1(n)){const r={};for(const o in e.ctx)!function t(e,n,r){const o=e[r];if(isArray$1(o)&&o.includes(n)||isObject$1(o)&&n in o)return !0;if(e.extends&&t(e.extends,n,r))return !0;if(e.mixins&&e.mixins.some(e=>t(e,n,r)))return !0}(n,o,t)||(r[o]=e.ctx[o]);return r}}window.devtoolsFormatters?window.devtoolsFormatters.push(e):window.devtoolsFormatters=[e];}}const version="3.2.33",svgNS="http://www.w3.org/2000/svg",doc="undefined"!=typeof document?document:null,templateContainer=doc&&doc.createElement("template"),nodeOps={insert:(e,t,n)=>{t.insertBefore(e,n||null);},remove:e=>{const t=e.parentNode;t&&t.removeChild(e);},createElement:(e,t,n,r)=>{const o=t?doc.createElementNS(svgNS,e):doc.createElement(e,n?{is:n}:void 0);return "select"===e&&r&&null!=r.multiple&&o.setAttribute("multiple",r.multiple),o},createText:e=>doc.createTextNode(e),createComment:e=>doc.createComment(e),setText:(e,t)=>{e.nodeValue=t;},setElementText:(e,t)=>{e.textContent=t;},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>doc.querySelector(e),setScopeId(e,t){e.setAttribute(t,"");},cloneNode(e){const t=e.cloneNode(!0);return "_value"in e&&(t._value=e._value),t},insertStaticContent(e,t,n,r,o,s){var a=n?n.previousSibling:t.lastChild;if(o&&(o===s||o.nextSibling)){for(;;)if(t.insertBefore(o.cloneNode(!0),n),o===s||!(o=o.nextSibling))break}else {templateContainer.innerHTML=r?`<svg>${e}</svg>`:e;const l=templateContainer.content;if(r){for(var i=l.firstChild;i.firstChild;)l.appendChild(i.firstChild);l.removeChild(i);}t.insertBefore(l,n);}return [a?a.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};function patchClass(e,t,n){var r=e._vtc;null==(t=r?(t?[t,...r]:[...r]).join(" "):t)?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t;}function patchStyle(e,t,n){const r=e.style;var o=isString$1(n);if(n&&!o){for(const a in n)setStyle(r,a,n[a]);if(t&&!isString$1(t))for(const i in t)null==n[i]&&setStyle(r,i,"");}else {var s=r.display;o?t!==n&&(r.cssText=n):t&&e.removeAttribute("style"),"_vod"in e&&(r.display=s);}}const importantRE=/\s*!important$/;function setStyle(t,n,e){var r;isArray$1(e)?e.forEach(e=>setStyle(t,n,e)):(null==e&&(e=""),n.startsWith("--")?t.setProperty(n,e):(r=autoPrefix(t,n),importantRE.test(e)?t.setProperty(hyphenate(r),e.replace(importantRE,""),"important"):t[r]=e));}const prefixes=["Webkit","Moz","ms"],prefixCache={};function autoPrefix(t,n){var e=prefixCache[n];if(e)return e;let r=camelize(n);if("filter"!==r&&r in t)return prefixCache[n]=r;r=capitalize(r);for(let e=0;e<prefixes.length;e++){var o=prefixes[e]+r;if(o in t)return prefixCache[n]=o}return n}const xlinkNS="http://www.w3.org/1999/xlink";function patchAttr(e,t,n,r,o){r&&t.startsWith("xlink:")?null==n?e.removeAttributeNS(xlinkNS,t.slice(6,t.length)):e.setAttributeNS(xlinkNS,t,n):(r=isSpecialBooleanAttr(t),null==n||r&&!includeBooleanAttr(n)?e.removeAttribute(t):e.setAttribute(t,r?"":n));}function patchDOMProp(t,n,r,e,o,s,a){if("innerHTML"===n||"textContent"===n)return e&&a(e,o,s),void(t[n]=null==r?"":r);if("value"===n&&"PROGRESS"!==t.tagName&&!t.tagName.includes("-")){var i=null==(t._value=r)?"":r;return t.value===i&&"OPTION"!==t.tagName||(t.value=i),void(null==r&&t.removeAttribute(n))}let l=!1;""!==r&&null!=r||("boolean"==(i=typeof t[n])?r=includeBooleanAttr(r):null==r&&"string"==i?(r="",l=!0):"number"==i&&(r=0,l=!0));try{t[n]=r;}catch(e){warn$1$1(`Failed setting prop "${n}" on <${t.tagName.toLowerCase()}>: `+`value ${r} is invalid.`,e);}l&&t.removeAttribute(n);}const[_getNow,skipTimestampCheck]=(()=>{let e=Date.now,t=!1;var n;return "undefined"!=typeof window&&(Date.now()>document.createEvent("Event").timeStamp&&(e=()=>performance.now()),n=navigator.userAgent.match(/firefox\/(\d+)/i),t=!!(n&&Number(n[1])<=53)),[e,t]})();let cachedNow=0;const p=Promise.resolve(),reset=()=>{cachedNow=0;},getNow=()=>cachedNow||(p.then(reset),cachedNow=_getNow());function addEventListener(e,t,n,r){e.addEventListener(t,n,r);}function removeEventListener(e,t,n,r){e.removeEventListener(t,n,r);}function patchEvent(e,t,n,r,o=null){const s=e._vei||(e._vei={}),a=s[t];var i,l;r&&a?a.value=r:([i,l]=parseName(t),r?addEventListener(e,i,s[t]=createInvoker(r,o),l):a&&(removeEventListener(e,i,a,l),s[t]=void 0));}const optionsModifierRE=/(?:Once|Passive|Capture)$/;function parseName(t){let n;if(optionsModifierRE.test(t)){n={};let e;for(;e=t.match(optionsModifierRE);)t=t.slice(0,t.length-e[0].length),n[e[0].toLowerCase()]=!0;}return [hyphenate(t.slice(2)),n]}function createInvoker(e,n){const r=e=>{var t=e.timeStamp||_getNow();(skipTimestampCheck||t>=r.attached-1)&&callWithAsyncErrorHandling(patchStopImmediatePropagation(e,r.value),n,5,[e]);};return r.value=e,r.attached=getNow(),r}function patchStopImmediatePropagation(e,t){if(isArray$1(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0;},t.map(t=>e=>!e._stopped&&t&&t(e))}return t}const nativeOnRE=/^on[a-z]/,patchProp=(e,t,n,r,o=!1,s,a,i,l)=>{"class"===t?patchClass(e,r,o):"style"===t?patchStyle(e,n,r):isOn(t)?isModelListener(t)||patchEvent(e,t,n,r,a):("."===t[0]?(t=t.slice(1),1):"^"===t[0]?(t=t.slice(1),0):shouldSetAsProp(e,t,r,o))?patchDOMProp(e,t,r,s,a,i,l):("true-value"===t?e._trueValue=r:"false-value"===t&&(e._falseValue=r),patchAttr(e,t,r,o));};function shouldSetAsProp(e,t,n,r){return r?"innerHTML"===t||"textContent"===t||!!(t in e&&nativeOnRE.test(t)&&isFunction$1(n)):"spellcheck"!==t&&"draggable"!==t&&"translate"!==t&&("form"!==t&&(("list"!==t||"INPUT"!==e.tagName)&&(("type"!==t||"TEXTAREA"!==e.tagName)&&((!nativeOnRE.test(t)||!isString$1(n))&&t in e))))}const TRANSITION="transition",ANIMATION="animation";const DOMTransitionPropsValidators={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},TransitionPropsValidators=extend({},BaseTransition.props,DOMTransitionPropsValidators),callHook$1=(e,t=[])=>{isArray$1(e)?e.forEach(e=>e(...t)):e&&e(...t);},hasExplicitCallback=e=>!!e&&(isArray$1(e)?e.some(e=>1<e.length):1<e.length);function resolveTransitionProps(e){const t={};for(const E in e)E in DOMTransitionPropsValidators||(t[E]=e[E]);if(!1===e.css)return t;const{name:n="v",type:s,duration:r,enterFromClass:a=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:i=`${n}-enter-to`,appearFromClass:l=a,appearActiveClass:c=o,appearToClass:u=i,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:p=`${n}-leave-active`,leaveToClass:f=`${n}-leave-to`}=e;var h=normalizeDuration(r);const m=h&&h[0],v=h&&h[1],{onBeforeEnter:g,onEnter:y,onEnterCancelled:b,onLeave:C,onLeaveCancelled:w,onBeforeAppear:S=g,onAppear:_=y,onAppearCancelled:k=b}=t,T=(e,t,n)=>{removeTransitionClass(e,t?u:i),removeTransitionClass(e,t?c:o),n&&n();},R=(e,t)=>{removeTransitionClass(e,f),removeTransitionClass(e,p),t&&t();};h=o=>(e,t)=>{const n=o?_:y,r=()=>T(e,o,t);callHook$1(n,[e,r]),nextFrame(()=>{removeTransitionClass(e,o?l:a),addTransitionClass(e,o?u:i),hasExplicitCallback(n)||whenTransitionEnds(e,s,m,r);});};return extend(t,{onBeforeEnter(e){callHook$1(g,[e]),addTransitionClass(e,a),addTransitionClass(e,o);},onBeforeAppear(e){callHook$1(S,[e]),addTransitionClass(e,l),addTransitionClass(e,c);},onEnter:h(!1),onAppear:h(!0),onLeave(e,t){const n=()=>R(e,t);addTransitionClass(e,d),forceReflow(),addTransitionClass(e,p),nextFrame(()=>{removeTransitionClass(e,d),addTransitionClass(e,f),hasExplicitCallback(C)||whenTransitionEnds(e,s,v,n);}),callHook$1(C,[e,n]);},onEnterCancelled(e){T(e,!1),callHook$1(b,[e]);},onAppearCancelled(e){T(e,!0),callHook$1(k,[e]);},onLeaveCancelled(e){R(e),callHook$1(w,[e]);}})}function normalizeDuration(e){if(null==e)return null;if(isObject$1(e))return [NumberOf(e.enter),NumberOf(e.leave)];e=NumberOf(e);return [e,e]}function NumberOf(e){e=toNumber(e);return validateDuration(e),e}function validateDuration(e){"number"!=typeof e?warn$1$1("<transition> explicit duration is not a valid number - "+`got ${JSON.stringify(e)}.`):isNaN(e)&&warn$1$1("<transition> explicit duration is NaN - the duration expression might be incorrect.");}function addTransitionClass(t,e){e.split(/\s+/).forEach(e=>e&&t.classList.add(e)),(t._vtc||(t._vtc=new Set)).add(e);}function removeTransitionClass(t,e){e.split(/\s+/).forEach(e=>e&&t.classList.remove(e));const n=t["_vtc"];n&&(n.delete(e),n.size||(t._vtc=void 0));}function nextFrame(e){requestAnimationFrame(()=>{requestAnimationFrame(e);});}let endId=0;function whenTransitionEnds(t,e,n,r){const o=t._endId=++endId,s=()=>{o===t._endId&&r();};if(n)return setTimeout(s,n);const{type:a,timeout:i,propCount:l}=getTransitionInfo(t,e);if(!a)return r();const c=a+"end";let u=0;const d=()=>{t.removeEventListener(c,p),s();},p=e=>{e.target===t&&++u>=l&&d();};setTimeout(()=>{u<l&&d();},i+1),t.addEventListener(c,p);}function getTransitionInfo(e,t){const n=window.getComputedStyle(e);var r=e=>(n[e]||"").split(", "),o=r(TRANSITION+"Delay"),s=r(TRANSITION+"Duration"),e=getTimeout(o,s),o=r(ANIMATION+"Delay"),r=r(ANIMATION+"Duration"),o=getTimeout(o,r);let a=null,i=0,l=0;t===TRANSITION?0<e&&(a=TRANSITION,i=e,l=s.length):t===ANIMATION?0<o&&(a=ANIMATION,i=o,l=r.length):(i=Math.max(e,o),a=0<i?o<e?TRANSITION:ANIMATION:null,l=a?(a===TRANSITION?s:r).length:0);r=a===TRANSITION&&/\b(transform|all)(,|$)/.test(n[TRANSITION+"Property"]);return {type:a,timeout:i,propCount:l,hasTransform:r}}function getTimeout(n,e){for(;n.length<e.length;)n=n.concat(n);return Math.max(...e.map((e,t)=>toMs(e)+toMs(n[t])))}function toMs(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function forceReflow(){return document.body.offsetHeight}const positionMap=new WeakMap,newPositionMap=new WeakMap;({name:"TransitionGroup",props:extend({},TransitionPropsValidators,{tag:String,moveClass:String}),setup(s,{slots:o}){const a=getCurrentInstance(),i=useTransitionState();let l,c;return onUpdated(()=>{if(l.length){const o=s.moveClass||`${s.name||"v"}-move`;if(hasCSSTransform(l[0].el,a.vnode.el,o)){l.forEach(callPendingCbs),l.forEach(recordPosition);const e=l.filter(applyTranslation);forceReflow(),e.forEach(e=>{const t=e.el,n=t.style;addTransitionClass(t,o),n.transform=n.webkitTransform=n.transitionDuration="";const r=t._moveCb=e=>{e&&e.target!==t||e&&!/transform$/.test(e.propertyName)||(t.removeEventListener("transitionend",r),t._moveCb=null,removeTransitionClass(t,o));};t.addEventListener("transitionend",r);});}}}),()=>{var e=toRaw(s),t=resolveTransitionProps(e),e=e.tag||Fragment;l=c,c=o.default?getTransitionRawChildren(o.default()):[];for(let e=0;e<c.length;e++){var n=c[e];null!=n.key?setTransitionHooks(n,resolveTransitionHooks(n,t,i,a)):warn$1$1("<TransitionGroup> children must be keyed.");}if(l)for(let e=0;e<l.length;e++){const r=l[e];setTransitionHooks(r,resolveTransitionHooks(r,t,i,a)),positionMap.set(r,r.el.getBoundingClientRect());}return createVNode(e,null,c)}}});function callPendingCbs(e){const t=e.el;t._moveCb&&t._moveCb(),t._enterCb&&t._enterCb();}function recordPosition(e){newPositionMap.set(e,e.el.getBoundingClientRect());}function applyTranslation(e){var t=positionMap.get(e),n=newPositionMap.get(e),r=t.left-n.left,n=t.top-n.top;if(r||n){const o=e.el.style;return o.transform=o.webkitTransform=`translate(${r}px,${n}px)`,o.transitionDuration="0s",e}}function hasCSSTransform(e,t,n){const r=e.cloneNode();e._vtc&&e._vtc.forEach(e=>{e.split(/\s+/).forEach(e=>e&&r.classList.remove(e));}),n.split(/\s+/).forEach(e=>e&&r.classList.add(e)),r.style.display="none";const o=1===t.nodeType?t:t.parentNode;o.appendChild(r);var t=getTransitionInfo(r)["hasTransform"];return o.removeChild(r),t}const rendererOptions=extend({patchProp:patchProp},nodeOps);let renderer;function ensureRenderer(){return renderer=renderer||createRenderer(rendererOptions)}const createApp=(...e)=>{const r=ensureRenderer().createApp(...e);injectNativeTagCheck(r),injectCompilerOptionsCheck(r);const o=r["mount"];return r.mount=e=>{const t=normalizeContainer(e);if(t){const n=r._component;isFunction$1(n)||n.render||n.template||(n.template=t.innerHTML),t.innerHTML="";e=o(t,!1,t instanceof SVGElement);return t instanceof Element&&(t.removeAttribute("v-cloak"),t.setAttribute("data-v-app","")),e}},r};function injectNativeTagCheck(e){Object.defineProperty(e.config,"isNativeTag",{value:e=>isHTMLTag(e)||isSVGTag(e),writable:!1});}function injectCompilerOptionsCheck(e){{const t=e.config.isCustomElement;Object.defineProperty(e.config,"isCustomElement",{get(){return t},set(){warn$1$1("The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.");}});const n=e.config.compilerOptions,r='The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom';Object.defineProperty(e.config,"compilerOptions",{get(){return warn$1$1(r),n},set(){warn$1$1(r);}});}}function normalizeContainer(e){if(isString$1(e)){var t=document.querySelector(e);return t||warn$1$1(`Failed to mount app: mount target selector "${e}" returned null.`),t}return window.ShadowRoot&&e instanceof window.ShadowRoot&&"closed"===e.mode&&warn$1$1('mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'),e}function initDev$1(){console.info("You are running a development build of Vue.\nMake sure to use the production build (*.prod.js) when deploying for production."),initCustomFormatter();}initDev$1();

const inBrowser = "undefined" != typeof window;
let mark, measure;
{
  const a = inBrowser && window.performance;
  a &&
    a.mark &&
    a.measure &&
    a.clearMarks &&
    a.clearMeasures &&
    ((mark = e => a.mark(e)),
    (measure = (e, t, n) => {
      a.measure(e, t, n), a.clearMarks(t), a.clearMarks(n);
    }));
}
const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
function format(e, ...a) {
  return (
    ((a = 1 === a.length && isObject(a[0]) ? a[0] : a) && a.hasOwnProperty) ||
      (a = {}),
    e.replace(RE_ARGS, (e, t) => (a.hasOwnProperty(t) ? a[t] : ""))
  );
}
const hasSymbol =
    "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
  makeSymbol = e => (hasSymbol ? Symbol(e) : e),
  generateFormatCacheKey = (e, t, a) =>
    friendlyJSONstringify({ l: e, k: t, s: a }),
  friendlyJSONstringify = e =>
    JSON.stringify(e)
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029")
      .replace(/\u0027/g, "\\u0027"),
  isNumber = e => "number" == typeof e && isFinite(e),
  isDate = e => "[object Date]" === toTypeString(e),
  isRegExp = e => "[object RegExp]" === toTypeString(e),
  isEmptyObject = e => isPlainObject(e) && 0 === Object.keys(e).length;
function warn(e, t) {
  "undefined" != typeof console &&
    (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
const assign = Object.assign;
let _globalThis;
const getGlobalThis = () =>
  (_globalThis =
    _globalThis ||
    ("undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : {}));
function escapeHtml(e) {
  return e
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(e, t) {
  return hasOwnProperty.call(e, t);
}
const isArray = Array.isArray,
  isFunction = e => "function" == typeof e,
  isString = e => "string" == typeof e,
  isBoolean = e => "boolean" == typeof e,
  isObject = e => null !== e && "object" == typeof e,
  objectToString = Object.prototype.toString,
  toTypeString = e => objectToString.call(e),
  isPlainObject = e => "[object Object]" === toTypeString(e),
  toDisplayString = e =>
    null == e
      ? ""
      : isArray(e) || (isPlainObject(e) && e.toString === objectToString)
      ? JSON.stringify(e, null, 2)
      : String(e),
  RANGE = 2;
function generateCodeFrame(e, a = 0, n = e.length) {
  var r,
    s,
    o,
    i = e.split(/\r?\n/);
  let l = 0;
  const c = [];
  for (let t = 0; t < i.length; t++)
    if ((l += i[t].length + 1) >= a) {
      for (let e = t - RANGE; e <= t + RANGE || n > l; e++)
        e < 0 ||
          e >= i.length ||
          ((r = e + 1),
          c.push("" + r + " ".repeat(3 - String(r).length) + "|  " + i[e]),
          (r = i[e].length),
          e === t
            ? ((o = a - (l - r) + 1),
              (s = Math.max(1, n > l ? r - o : n - a)),
              c.push("   |  " + " ".repeat(o) + "^".repeat(s)))
            : e > t &&
              (n > l &&
                ((o = Math.max(Math.min(n - l, r), 1)),
                c.push("   |  " + "^".repeat(o))),
              (l += r + 1)));
      break;
    }
  return c.join("\n");
}
function createEmitter() {
  const n = new Map();
  return {
    events: n,
    on(e, t) {
      const a = n.get(e);
      (a && a.push(t)) || n.set(e, [t]);
    },
    off(e, t) {
      const a = n.get(e);
      a && a.splice(a.indexOf(t) >>> 0, 1);
    },
    emit(t, a) {
      (n.get(t) || []).slice().map(e => e(a)),
        (n.get("*") || []).slice().map(e => e(t, a));
    },
  };
}
const pathStateMachine = [],
  literalValueRE =
    ((pathStateMachine[0] = { w: [0], i: [3, 0], "[": [4], o: [7] }),
    (pathStateMachine[1] = { w: [1], ".": [2], "[": [4], o: [7] }),
    (pathStateMachine[2] = { w: [2], i: [3, 0], [0]: [3, 0] }),
    (pathStateMachine[3] = {
      i: [3, 0],
      [0]: [3, 0],
      w: [1, 1],
      ".": [2, 1],
      "[": [4, 1],
      o: [7, 1],
    }),
    (pathStateMachine[4] = {
      "'": [5, 0],
      '"': [6, 0],
      "[": [4, 2],
      "]": [1, 3],
      o: 8,
      l: [4, 0],
    }),
    (pathStateMachine[5] = { "'": [4, 0], o: 8, l: [5, 0] }),
    (pathStateMachine[6] = { '"': [4, 0], o: 8, l: [6, 0] }),
    /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/);
function isLiteral(e) {
  return literalValueRE.test(e);
}
function stripQuotes(e) {
  var t = e.charCodeAt(0);
  return t !== e.charCodeAt(e.length - 1) || (34 !== t && 39 !== t)
    ? e
    : e.slice(1, -1);
}
function getPathCharType(e) {
  if (null == e) return "o";
  switch (e.charCodeAt(0)) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return e;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(e) {
  var t = e.trim();
  return (
    ("0" !== e.charAt(0) || !isNaN(parseInt(e))) &&
    (isLiteral(t) ? stripQuotes(t) : "*" + t)
  );
}
function parse(e) {
  const t = [];
  let a = -1,
    n = 0,
    r = 0;
  var s, o, i;
  let l, c, u;
  const m = [];
  for (
    m[0] = () => {
      void 0 === l ? (l = c) : (l += c);
    },
      m[1] = () => {
        void 0 !== l && (t.push(l), (l = void 0));
      },
      m[2] = () => {
        m[0](), r++;
      },
      m[3] = () => {
        if (!(0 < r))
          return (
            void (r = 0) !== l && !1 !== (l = formatSubPath(l)) && void m[1]()
          );
        r--, (n = 4), m[0]();
      };
    null !== n;

  )
    if (
      (a++,
      "\\" !== (s = e[a]) ||
        ((i = void 0),
        (i = e[a + 1]),
        !((5 === n && "'" === i) || (6 === n && '"' === i)) ||
          (a++, (c = "\\" + i), m[0](), 0)))
    ) {
      if (
        ((i = getPathCharType(s)),
        8 === (o = (o = pathStateMachine[n])[i] || o.l || 8))
      )
        return;
      if (
        ((n = o[0]), void 0 !== o[1] && (u = m[o[1]]) && ((c = s), !1 === u()))
      )
        return;
      if (7 === n) return t;
    }
}
const cache = new Map();
function resolveValue(e, t) {
  if (!isObject(e)) return null;
  let a = cache.get(t);
  if ((a || ((a = parse(t)) && cache.set(t, a)), !a)) return null;
  var n = a.length;
  let r = e,
    s = 0;
  for (; s < n; ) {
    var o = r[a[s]];
    if (void 0 === o) return null;
    (r = o), s++;
  }
  return r;
}
function handleFlatJson(e) {
  if (!isObject(e)) return e;
  for (const r in e)
    if (hasOwn(e, r))
      if (r.includes(".")) {
        var a = r.split("."),
          n = a.length - 1;
        let t = e;
        for (let e = 0; e < n; e++) a[e] in t || (t[a[e]] = {}), (t = t[a[e]]);
        (t[a[n]] = e[r]),
          delete e[r],
          isObject(t[a[n]]) && handleFlatJson(t[a[n]]);
      } else isObject(e[r]) && handleFlatJson(e[r]);
  return e;
}
const DEFAULT_MODIFIER = e => e,
  DEFAULT_MESSAGE = e => "",
  DEFAULT_MESSAGE_DATA_TYPE = "text",
  DEFAULT_NORMALIZE = e => (0 === e.length ? "" : e.join("")),
  DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(e, t) {
  return (
    (e = Math.abs(e)), 2 === t ? (!e || 1 < e ? 1 : 0) : e ? Math.min(e, 2) : 0
  );
}
function getPluralIndex(e) {
  var t = isNumber(e.pluralIndex) ? e.pluralIndex : -1;
  return e.named && (isNumber(e.named.count) || isNumber(e.named.n))
    ? isNumber(e.named.count)
      ? e.named.count
      : isNumber(e.named.n)
      ? e.named.n
      : t
    : t;
}
function normalizeNamed(e, t) {
  t.count || (t.count = e), t.n || (t.n = e);
}
function createMessageContext(a = {}) {
  var e = a.locale;
  const t = getPluralIndex(a),
    n =
      isObject(a.pluralRules) && isString(e) && isFunction(a.pluralRules[e])
        ? a.pluralRules[e]
        : pluralDefault,
    r =
      isObject(a.pluralRules) && isString(e) && isFunction(a.pluralRules[e])
        ? pluralDefault
        : void 0;
  const s = a.list || [];
  const o = a.named || {};
  isNumber(a.pluralIndex) && normalizeNamed(t, o);
  function i(e) {
    var t = isFunction(a.messages)
      ? a.messages(e)
      : !!isObject(a.messages) && a.messages[e];
    return t || (a.parent ? a.parent.message(e) : DEFAULT_MESSAGE);
  }
  var e =
      isPlainObject(a.processor) && isFunction(a.processor.normalize)
        ? a.processor.normalize
        : DEFAULT_NORMALIZE,
    l =
      isPlainObject(a.processor) && isFunction(a.processor.interpolate)
        ? a.processor.interpolate
        : DEFAULT_INTERPOLATE;
  const c = {
    list: e => s[e],
    named: e => o[e],
    plural: e => e[n(t, e.length, r)],
    linked: (e, t) => {
      e = i(e)(c);
      return isString(t)
        ? ((t = t), (a.modifiers ? a.modifiers[t] : DEFAULT_MODIFIER)(e))
        : e;
    },
    message: i,
    type:
      isPlainObject(a.processor) && isString(a.processor.type)
        ? a.processor.type
        : DEFAULT_MESSAGE_DATA_TYPE,
    interpolate: l,
    normalize: e,
  };
  return c;
}
const errorMessages$2 = {
  [0]: "Expected token: '{0}'",
  1: "Invalid token in placeholder: '{0}'",
  2: "Unterminated single quote in placeholder",
  3: "Unknown escape sequence: \\{0}",
  4: "Invalid unicode escape sequence: {0}",
  5: "Unbalanced closing brace",
  6: "Unterminated closing brace",
  7: "Empty placeholder",
  8: "Not allowed nest placeholder",
  9: "Invalid linked format",
  10: "Plural must have messages",
  11: "Unexpected empty linked modifier",
  12: "Unexpected empty linked key",
  13: "Unexpected lexical analysis in token: '{0}'",
};
function createCompileError(e, t, a = {}) {
  var { domain: a, messages: n, args: r } = a,
    n = format((n || errorMessages$2)[e] || "", ...(r || []));
  const s = new SyntaxError(String(n));
  return (s.code = e), t && (s.location = t), (s.domain = a), s;
}
const IntlifyDevToolsHooks = {
  I18nInit: "i18n:init",
  FunctionTranslate: "function:translate",
};
let devtools = null;
function setDevToolsHook(e) {
  devtools = e;
}
function initI18nDevTools(e, t, a) {
  devtools &&
    devtools.emit(IntlifyDevToolsHooks.I18nInit, {
      timestamp: Date.now(),
      i18n: e,
      version: t,
      meta: a,
    });
}
const translateDevTools = createDevToolsHook(
  IntlifyDevToolsHooks.FunctionTranslate
);
function createDevToolsHook(t) {
  return e => devtools && devtools.emit(t, e);
}
const warnMessages$1 = {
  [0]: "Not found '{key}' key in '{locale}' locale messages.",
  1: "Fall back to translate '{key}' key with '{target}' locale.",
  2: "Cannot format a number value due to not supported Intl.NumberFormat.",
  3: "Fall back to number format '{key}' key with '{target}' locale.",
  4: "Cannot format a date value due to not supported Intl.DateTimeFormat.",
  5: "Fall back to datetime format '{key}' key with '{target}' locale.",
};
function getWarnMessage$1(e, ...t) {
  return format(warnMessages$1[e], ...t);
}
const VERSION$1 = "9.1.10",
  NOT_REOSLVED = -1,
  MISSING_RESOLVE_VALUE = "";
function getDefaultLinkedModifiers() {
  return {
    upper: e => (isString(e) ? e.toUpperCase() : e),
    lower: e => (isString(e) ? e.toLowerCase() : e),
    capitalize: e =>
      isString(e) ? "" + e.charAt(0).toLocaleUpperCase() + e.substr(1) : e,
  };
}
let _compiler,
  _additionalMeta = null;
const setAdditionalMeta = e => {
    _additionalMeta = e;
  },
  getAdditionalMeta = () => _additionalMeta;
let _cid = 0;
function createCoreContext(e = {}) {
  var t = isString(e.version) ? e.version : VERSION$1,
    a = isString(e.locale) ? e.locale : "en-US",
    n =
      isArray(e.fallbackLocale) ||
      isPlainObject(e.fallbackLocale) ||
      isString(e.fallbackLocale) ||
      !1 === e.fallbackLocale
        ? e.fallbackLocale
        : a,
    r = isPlainObject(e.messages) ? e.messages : { [a]: {} },
    s = isPlainObject(e.datetimeFormats) ? e.datetimeFormats : { [a]: {} },
    o = isPlainObject(e.numberFormats) ? e.numberFormats : { [a]: {} },
    i = assign({}, e.modifiers || {}, getDefaultLinkedModifiers()),
    l = e.pluralRules || {},
    c = isFunction(e.missing) ? e.missing : null,
    u =
      (!isBoolean(e.missingWarn) && !isRegExp(e.missingWarn)) || e.missingWarn,
    m =
      (!isBoolean(e.fallbackWarn) && !isRegExp(e.fallbackWarn)) ||
      e.fallbackWarn,
    g = !!e.fallbackFormat,
    p = !!e.unresolving,
    f = isFunction(e.postTranslation) ? e.postTranslation : null,
    d = isPlainObject(e.processor) ? e.processor : null,
    b = !isBoolean(e.warnHtmlMessage) || e.warnHtmlMessage,
    _ = !!e.escapeParameter,
    v = isFunction(e.messageCompiler) ? e.messageCompiler : _compiler,
    y = isFunction(e.onWarn) ? e.onWarn : warn,
    h = isObject(e.__datetimeFormatters) ? e.__datetimeFormatters : new Map(),
    k = isObject(e.__numberFormatters) ? e.__numberFormatters : new Map(),
    S = isObject(e.__meta) ? e.__meta : {};
  const F = {
    version: t,
    cid: ++_cid,
    locale: a,
    fallbackLocale: n,
    messages: r,
    datetimeFormats: s,
    numberFormats: o,
    modifiers: i,
    pluralRules: l,
    missing: c,
    missingWarn: u,
    fallbackWarn: m,
    fallbackFormat: g,
    unresolving: p,
    postTranslation: f,
    processor: d,
    warnHtmlMessage: b,
    escapeParameter: _,
    messageCompiler: v,
    onWarn: y,
    __datetimeFormatters: h,
    __numberFormatters: k,
    __meta: S,
  };
  return (
    (F.__v_emitter = null != e.__v_emitter ? e.__v_emitter : void 0),
    initI18nDevTools(F, t, S),
    F
  );
}
function isTranslateFallbackWarn(e, t) {
  return e instanceof RegExp ? e.test(t) : e;
}
function isTranslateMissingWarn(e, t) {
  return e instanceof RegExp ? e.test(t) : e;
}
function handleMissing(e, t, a, n, r) {
  const { missing: s, onWarn: o } = e;
  {
    const i = e.__v_emitter;
    i &&
      i.emit("missing", { locale: a, key: t, type: r, groupId: r + ":" + t });
  }
  return null !== s
    ? ((e = s(e, a, t, r)), isString(e) ? e : t)
    : (isTranslateMissingWarn(n, t) &&
        o(getWarnMessage$1(0, { key: t, locale: a })),
      t);
}
function getLocaleChain(t, a, n) {
  const r = t;
  r.__localeChainCache || (r.__localeChainCache = new Map());
  let s = r.__localeChainCache.get(n);
  if (!s) {
    s = [];
    let e = [n];
    for (; isArray(e); ) e = appendBlockToChain(s, e, a);
    t = !isArray(a) && isPlainObject(a) ? a.default || null : a;
    (e = isString(t) ? [t] : t),
      isArray(e) && appendBlockToChain(s, e, !1),
      r.__localeChainCache.set(n, s);
  }
  return s;
}
function appendBlockToChain(t, a, n) {
  let r = !0;
  for (let e = 0; e < a.length && isBoolean(r); e++) {
    var s = a[e];
    isString(s) && (r = appendLocaleToChain(t, a[e], n));
  }
  return r;
}
function appendLocaleToChain(e, t, a) {
  let n;
  const r = t.split("-");
  do {
    var s = r.join("-");
    (n = appendItemToChain(e, s, a)), r.splice(-1, 1);
  } while (r.length && !0 === n);
  return n;
}
function appendItemToChain(e, t, a) {
  let n = !1;
  return (
    e.includes(t) ||
      ((n = !0),
      t &&
        ((n = "!" !== t[t.length - 1]),
        (t = t.replace(/!/g, "")),
        e.push(t),
        (isArray(a) || isPlainObject(a)) && a[t] && (n = a[t]))),
    n
  );
}
function updateFallbackLocale(e, t, a) {
  const n = e;
  (n.__localeChainCache = new Map()), getLocaleChain(e, a, t);
}
function createCoreError(e) {
  return createCompileError(e, null, { messages: errorMessages$1 });
}
const errorMessages$1 = {
    [14]: "Invalid arguments",
    15: "The date provided is an invalid Date object.Make sure your Date represents a valid date.",
    16: "The argument provided is not a valid ISO date string",
  },
  NOOP_MESSAGE_FUNCTION = () => "",
  isMessageFunction = e => isFunction(e);
function translate(e, ...t) {
  const {
    fallbackFormat: a,
    postTranslation: n,
    unresolving: r,
    fallbackLocale: s,
    messages: o,
  } = e;
  var [t, i] = parseTranslateArgs(...t),
    l = (isBoolean(i.missingWarn) ? i : e).missingWarn,
    c = (isBoolean(i.fallbackWarn) ? i : e).fallbackWarn,
    u = (isBoolean(i.escapeParameter) ? i : e).escapeParameter,
    m = !!i.resolvedMessage,
    g =
      isString(i.default) || isBoolean(i.default)
        ? isBoolean(i.default)
          ? t
          : i.default
        : a
        ? t
        : "",
    p = a || "" !== g,
    f = (isString(i.locale) ? i : e).locale;
  u && escapeParams(i);
  let [d, b, _] = m
      ? [t, f, o[f] || {}]
      : resolveMessageFormat(e, t, f, s, c, l),
    v = t;
  if (
    (m || isString(d) || isMessageFunction(d) || (p && ((d = g), (v = d))),
    !(m || ((isString(d) || isMessageFunction(d)) && isString(b))))
  )
    return r ? NOT_REOSLVED : t;
  if (isString(d) && null == e.messageCompiler)
    return (
      warn(
        "The message format compilation is not supported in this build. Because message compiler isn't included. You need to pre-compilation all message format. " +
          `So translate function return '${t}'.`
      ),
      t
    );
  let y = !1;
  u = isMessageFunction(d)
    ? d
    : compileMessageFormat(e, t, b, d, v, () => {
        y = !0;
      });
  if (y) return d;
  (f = evaluateMessage(
    e,
    u,
    createMessageContext(getMessageContextOptions(e, b, _, i))
  )),
    (c = n ? n(f) : f);
  {
    const h = {
      timestamp: Date.now(),
      key: isString(t) ? t : isMessageFunction(d) ? d.key : "",
      locale: b || (isMessageFunction(d) ? d.locale : ""),
      format: isString(d) ? d : isMessageFunction(d) ? d.source : "",
      message: c,
    };
    (h.meta = assign({}, e.__meta, getAdditionalMeta() || {})),
      translateDevTools(h);
  }
  return c;
}
function escapeParams(t) {
  isArray(t.list)
    ? (t.list = t.list.map(e => (isString(e) ? escapeHtml(e) : e)))
    : isObject(t.named) &&
      Object.keys(t.named).forEach(e => {
        isString(t.named[e]) && (t.named[e] = escapeHtml(t.named[e]));
      });
}
function resolveMessageFormat(r, s, o, e, i, l) {
  const { messages: c, onWarn: u } = r;
  var m = getLocaleChain(r, e, o);
  let g = {},
    p,
    f = null,
    d = o;
  var b,
    _ = "translate";
  for (let n = 0; n < m.length; n++) {
    if (
      (o !== (p = b = m[n]) &&
        isTranslateFallbackWarn(i, s) &&
        u(getWarnMessage$1(1, { key: s, target: p })),
      o !== p)
    ) {
      const y = r.__v_emitter;
      y &&
        y.emit("fallback", {
          type: _,
          key: s,
          from: d,
          to: b,
          groupId: _ + ":" + s,
        });
    }
    g = c[p] || {};
    let e = null,
      t,
      a;
    if (
      (inBrowser &&
        ((e = window.performance.now()),
        (t = "intlify-message-resolve-start"),
        (a = "intlify-message-resolve-end"),
        mark && mark(t)),
      null === (f = resolveValue(g, s)) && (f = g[s]),
      inBrowser)
    ) {
      var v = window.performance.now();
      const h = r.__v_emitter;
      h &&
        e &&
        f &&
        h.emit("message-resolve", {
          type: "message-resolve",
          key: s,
          message: f,
          time: v - e,
          groupId: _ + ":" + s,
        }),
        t &&
          a &&
          mark &&
          measure &&
          (mark(a), measure("intlify message resolve", t, a));
    }
    if (isString(f) || isFunction(f)) break;
    v = handleMissing(r, s, p, l, _);
    v !== s && (f = v), (d = b);
  }
  return [f, p, g];
}
function compileMessageFormat(e, t, a, n, r, s) {
  const { messageCompiler: o, warnHtmlMessage: i } = e;
  if (isMessageFunction(n)) {
    const m = n;
    return (m.locale = m.locale || a), (m.key = m.key || t), m;
  }
  let l = null,
    c,
    u;
  inBrowser &&
    ((l = window.performance.now()),
    (c = "intlify-message-compilation-start"),
    (u = "intlify-message-compilation-end"),
    mark && mark(c));
  const m = o(n, getCompileOptions(e, a, r, n, i, s));
  if (inBrowser) {
    r = window.performance.now();
    const g = e.__v_emitter;
    g &&
      l &&
      g.emit("message-compilation", {
        type: "message-compilation",
        message: n,
        time: r - l,
        groupId: "translate:" + t,
      }),
      c &&
        u &&
        mark &&
        measure &&
        (mark(u), measure("intlify message compilation", c, u));
  }
  return (m.locale = a), (m.key = t), (m.source = n), m;
}
function evaluateMessage(e, t, a) {
  let n = null,
    r,
    s;
  inBrowser &&
    ((n = window.performance.now()),
    (r = "intlify-message-evaluation-start"),
    (s = "intlify-message-evaluation-end"),
    mark && mark(r));
  a = t(a);
  if (inBrowser) {
    var o = window.performance.now();
    const i = e.__v_emitter;
    i &&
      n &&
      i.emit("message-evaluation", {
        type: "message-evaluation",
        value: a,
        time: o - n,
        groupId: "translate:" + t.key,
      }),
      r &&
        s &&
        mark &&
        measure &&
        (mark(s), measure("intlify message evaluation", r, s));
  }
  return a;
}
function parseTranslateArgs(...e) {
  var [e, t, a] = e;
  const n = {};
  if (!isString(e) && !isNumber(e) && !isMessageFunction(e))
    throw createCoreError(14);
  e = isNumber(e) ? String(e) : (e);
  return (
    isNumber(t)
      ? (n.plural = t)
      : isString(t)
      ? (n.default = t)
      : isPlainObject(t) && !isEmptyObject(t)
      ? (n.named = t)
      : isArray(t) && (n.list = t),
    isNumber(a)
      ? (n.plural = a)
      : isString(a)
      ? (n.default = a)
      : isPlainObject(a) && assign(n, a),
    [e, n]
  );
}
function getCompileOptions(r, t, s, o, e, i) {
  return {
    warnHtmlMessage: e,
    onError: e => {
      i && i(e);
      {
        var t = "Message compilation error: " + e.message,
          a =
            e.location &&
            generateCodeFrame(
              o,
              e.location.start.offset,
              e.location.end.offset
            );
        const n = r.__v_emitter;
        n &&
          n.emit("compile-error", {
            message: o,
            error: e.message,
            start: e.location && e.location.start.offset,
            end: e.location && e.location.end.offset,
            groupId: "translate:" + s,
          }),
          console.error(
            a
              ? t +
                  `
` +
                  a
              : t
          );
      }
    },
    onCacheKey: e => generateFormatCacheKey(t, s, e),
  };
}
function getMessageContextOptions(n, r, e, t) {
  var { modifiers: a, pluralRules: s } = n;
  const o = {
    locale: r,
    modifiers: a,
    pluralRules: s,
    messages: t => {
      var a = resolveValue(e, t);
      if (isString(a)) {
        let e = !1;
        t = compileMessageFormat(n, t, r, a, t, () => {
          e = !0;
        });
        return e ? NOOP_MESSAGE_FUNCTION : t;
      }
      return isMessageFunction(a) ? a : NOOP_MESSAGE_FUNCTION;
    },
  };
  return (
    n.processor && (o.processor = n.processor),
    t.list && (o.list = t.list),
    t.named && (o.named = t.named),
    isNumber(t.plural) && (o.pluralIndex = t.plural),
    o
  );
}
const intlDefined = "undefined" != typeof Intl,
  Availabilities = {
    dateTimeFormat: intlDefined && void 0 !== Intl.DateTimeFormat,
    numberFormat: intlDefined && void 0 !== Intl.NumberFormat,
  };
function datetime(t, ...e) {
  const {
      datetimeFormats: a,
      unresolving: n,
      fallbackLocale: r,
      onWarn: s,
    } = t,
    o = t["__datetimeFormatters"];
  if (!Availabilities.dateTimeFormat)
    return s(getWarnMessage$1(4)), MISSING_RESOLVE_VALUE;
  var [i, e, l, c] = parseDateTimeArgs(...e),
    u = (isBoolean(l.missingWarn) ? l : t).missingWarn,
    m = (isBoolean(l.fallbackWarn) ? l : t).fallbackWarn,
    g = !!l.part,
    p = (isString(l.locale) ? l : t).locale,
    f = getLocaleChain(t, r, p);
  if (!isString(i) || "" === i) return new Intl.DateTimeFormat(p).format(e);
  var d;
  let b,
    _ = null,
    v = p;
  var y,
    h = "datetime format";
  for (let e = 0; e < f.length; e++) {
    if (
      (p !== (b = y = f[e]) &&
        isTranslateFallbackWarn(m, i) &&
        s(getWarnMessage$1(5, { key: i, target: b })),
      p !== b)
    ) {
      const F = t.__v_emitter;
      F &&
        F.emit("fallback", {
          type: h,
          key: i,
          from: v,
          to: y,
          groupId: h + ":" + i,
        });
    }
    if (((d = a[b] || {}), (_ = d[i]), isPlainObject(_))) break;
    handleMissing(t, i, b, u, h), (v = y);
  }
  if (!isPlainObject(_) || !isString(b)) return n ? NOT_REOSLVED : i;
  let k = b + "__" + i,
    S = (isEmptyObject(c) || (k = k + "__" + JSON.stringify(c)), o.get(k));
  return (
    S || ((S = new Intl.DateTimeFormat(b, assign({}, _, c))), o.set(k, S)),
    g ? S.formatToParts(e) : S.format(e)
  );
}
function parseDateTimeArgs(...e) {
  const [t, a, n, r] = e;
  let s = {},
    o = {},
    i;
  if (isString(t)) {
    if (!/\d{4}-\d{2}-\d{2}(T.*)?/.test(t)) throw createCoreError(16);
    i = new Date(t);
    try {
      i.toISOString();
    } catch (e) {
      throw createCoreError(16);
    }
  } else if (isDate(t)) {
    if (isNaN(t.getTime())) throw createCoreError(15);
    i = t;
  } else {
    if (!isNumber(t)) throw createCoreError(14);
    i = t;
  }
  return (
    isString(a) ? (s.key = a) : isPlainObject(a) && (s = a),
    isString(n) ? (s.locale = n) : isPlainObject(n) && (o = n),
    isPlainObject(r) && (o = r),
    [s.key || "", i, s, o]
  );
}
function clearDateTimeFormat(e, t, a) {
  const n = e;
  for (const s in a) {
    var r = t + "__" + s;
    n.__datetimeFormatters.has(r) && n.__datetimeFormatters.delete(r);
  }
}
function number(t, ...e) {
  const { numberFormats: a, unresolving: n, fallbackLocale: r, onWarn: s } = t,
    o = t["__numberFormatters"];
  if (!Availabilities.numberFormat)
    return s(getWarnMessage$1(2)), MISSING_RESOLVE_VALUE;
  var [i, e, l, c] = parseNumberArgs(...e),
    u = (isBoolean(l.missingWarn) ? l : t).missingWarn,
    m = (isBoolean(l.fallbackWarn) ? l : t).fallbackWarn,
    g = !!l.part,
    p = (isString(l.locale) ? l : t).locale,
    f = getLocaleChain(t, r, p);
  if (!isString(i) || "" === i) return new Intl.NumberFormat(p).format(e);
  var d;
  let b,
    _ = null,
    v = p;
  var y,
    h = "number format";
  for (let e = 0; e < f.length; e++) {
    if (
      (p !== (b = y = f[e]) &&
        isTranslateFallbackWarn(m, i) &&
        s(getWarnMessage$1(3, { key: i, target: b })),
      p !== b)
    ) {
      const F = t.__v_emitter;
      F &&
        F.emit("fallback", {
          type: h,
          key: i,
          from: v,
          to: y,
          groupId: h + ":" + i,
        });
    }
    if (((d = a[b] || {}), (_ = d[i]), isPlainObject(_))) break;
    handleMissing(t, i, b, u, h), (v = y);
  }
  if (!isPlainObject(_) || !isString(b)) return n ? NOT_REOSLVED : i;
  let k = b + "__" + i,
    S = (isEmptyObject(c) || (k = k + "__" + JSON.stringify(c)), o.get(k));
  return (
    S || ((S = new Intl.NumberFormat(b, assign({}, _, c))), o.set(k, S)),
    g ? S.formatToParts(e) : S.format(e)
  );
}
function parseNumberArgs(...e) {
  var [e, t, a, n] = e;
  let r = {},
    s = {};
  if (!isNumber(e)) throw createCoreError(14);
  return (
    isString(t) ? (r.key = t) : isPlainObject(t) && (r = t),
    isString(a) ? (r.locale = a) : isPlainObject(a) && (s = a),
    isPlainObject(n) && (s = n),
    [r.key || "", e, r, s]
  );
}
function clearNumberFormat(e, t, a) {
  const n = e;
  for (const s in a) {
    var r = t + "__" + s;
    n.__numberFormatters.has(r) && n.__numberFormatters.delete(r);
  }
}
const VERSION = "9.1.10";
function initDev() {
  console.info(
    "You are running a development build of vue-i18n.\nMake sure to use the production build (*.prod.js) when deploying for production."
  );
}
const warnMessages = {
  [6]: "Fall back to {type} '{key}' with root locale.",
  7: "Not supported 'preserve'.",
  8: "Not supported 'formatter'.",
  9: "Not supported 'preserveDirectiveContent'.",
  10: "Not supported 'getChoiceIndex'.",
  11: "Component name legacy compatible: '{name}' -> 'i18n'",
  12: "Not found parent scope. use the global scope.",
};
function getWarnMessage(e, ...t) {
  return format(warnMessages[e], ...t);
}
function createI18nError(e, ...t) {
  return createCompileError(e, null, { messages: errorMessages, args: t });
}
const errorMessages = {
    [14]: "Unexpected return type in composer",
    15: "Invalid argument",
    16: "Must be called at the top of a `setup` function",
    17: "Need to install with `app.use` function",
    22: "Unexpected error",
    18: "Not available in legacy mode",
    19: "Required in value: {0}",
    20: "Invalid value",
    21: "Cannot setup vue-devtools plugin",
  },
  DEVTOOLS_META = "__INTLIFY_META__",
  TransrateVNodeSymbol = makeSymbol("__transrateVNode"),
  DatetimePartsSymbol = makeSymbol("__datetimeParts"),
  NumberPartsSymbol = makeSymbol("__numberParts"),
  EnableEmitter = makeSymbol("__enableEmitter"),
  DisableEmitter = makeSymbol("__disableEmitter"),
  SetPluralRulesSymbol = makeSymbol("__setPluralRules"),
  InejctWithOption = makeSymbol("__injectWithOption");
let composerID = 0;
function defineCoreMissingHandler(r) {
  return (e, t, a, n) => r(t, a, getCurrentInstance() || void 0, n);
}
function getLocaleMessages(e, t) {
  const { messages: a, __i18n: n } = t,
    r = isPlainObject(a) ? a : isArray(n) ? {} : { [e]: {} };
  if (
    (isArray(n) &&
      n.forEach(({ locale: e, resource: t }) => {
        e ? ((r[e] = r[e] || {}), deepCopy(t, r[e])) : deepCopy(t, r);
      }),
    t.flatJson)
  )
    for (const s in r) hasOwn(r, s) && handleFlatJson(r[s]);
  return r;
}
const isNotObjectOrIsArray = e => !isObject(e) || isArray(e);
function deepCopy(e, t) {
  if (isNotObjectOrIsArray(e) || isNotObjectOrIsArray(t))
    throw createI18nError(20);
  for (const a in e)
    hasOwn(e, a) &&
      (isNotObjectOrIsArray(e[a]) || isNotObjectOrIsArray(t[a])
        ? (t[a] = e[a])
        : deepCopy(e[a], t[a]));
}
const getMetaInfo = () => {
  var e = getCurrentInstance();
  return e && e.type[DEVTOOLS_META]
    ? { [DEVTOOLS_META]: e.type[DEVTOOLS_META] }
    : null;
};
function createComposer(e = {}) {
  const l = e["__root"],
    t = void 0 === l;
  let a = !isBoolean(e.inheritLocale) || e.inheritLocale;
  const c = ref(
      l && a ? l.locale.value : isString(e.locale) ? e.locale : "en-US"
    ),
    u = ref(
      l && a
        ? l.fallbackLocale.value
        : isString(e.fallbackLocale) ||
          isArray(e.fallbackLocale) ||
          isPlainObject(e.fallbackLocale) ||
          !1 === e.fallbackLocale
        ? e.fallbackLocale
        : c.value
    ),
    m = ref(getLocaleMessages(c.value, e)),
    g = ref(
      isPlainObject(e.datetimeFormats) ? e.datetimeFormats : { [c.value]: {} }
    ),
    p = ref(
      isPlainObject(e.numberFormats) ? e.numberFormats : { [c.value]: {} }
    );
  let f = l
      ? l.missingWarn
      : (!isBoolean(e.missingWarn) && !isRegExp(e.missingWarn)) ||
        e.missingWarn,
    d = l
      ? l.fallbackWarn
      : (!isBoolean(e.fallbackWarn) && !isRegExp(e.fallbackWarn)) ||
        e.fallbackWarn,
    b = l ? l.fallbackRoot : !isBoolean(e.fallbackRoot) || e.fallbackRoot,
    n = !!e.fallbackFormat,
    r = isFunction(e.missing) ? e.missing : null,
    s = isFunction(e.missing) ? defineCoreMissingHandler(e.missing) : null,
    o = isFunction(e.postTranslation) ? e.postTranslation : null,
    i = !isBoolean(e.warnHtmlMessage) || e.warnHtmlMessage,
    _ = !!e.escapeParameter;
  const v = l ? l.modifiers : isPlainObject(e.modifiers) ? e.modifiers : {};
  let y = e.pluralRules || (l && l.pluralRules),
    h;
  updateFallbackLocale(
    (h = createCoreContext({
      version: VERSION,
      locale: c.value,
      fallbackLocale: u.value,
      messages: m.value,
      datetimeFormats: g.value,
      numberFormats: p.value,
      modifiers: v,
      pluralRules: y,
      missing: null === s ? void 0 : s,
      missingWarn: f,
      fallbackWarn: d,
      fallbackFormat: n,
      unresolving: !0,
      postTranslation: null === o ? void 0 : o,
      warnHtmlMessage: i,
      escapeParameter: _,
      __datetimeFormatters: isPlainObject(h) ? h.__datetimeFormatters : void 0,
      __numberFormatters: isPlainObject(h) ? h.__numberFormatters : void 0,
      __v_emitter: isPlainObject(h) ? h.__v_emitter : void 0,
      __meta: { framework: "vue" },
    })),
    c.value,
    u.value
  );
  var k = computed$1({
      get: () => c.value,
      set: e => {
        (c.value = e), (h.locale = c.value);
      },
    }),
    S = computed$1({
      get: () => u.value,
      set: e => {
        (u.value = e),
          (h.fallbackLocale = u.value),
          updateFallbackLocale(h, c.value, e);
      },
    }),
    F = computed$1(() => m.value),
    E = computed$1(() => g.value),
    O = computed$1(() => p.value);
  function T(e, t, a, n, r, s) {
    c.value, u.value, m.value, g.value, p.value;
    let o;
    try {
      setAdditionalMeta(getMetaInfo()), (o = e(h));
    } finally {
      setAdditionalMeta(null);
    }
    if (isNumber(o) && o === NOT_REOSLVED) {
      var [e, t] = t();
      if (
        l &&
        isString(e) &&
        ((t = t), "translate" !== a || !1 == !!t.resolvedMessage)
      ) {
        b &&
          (isTranslateFallbackWarn(d, e) || isTranslateMissingWarn(f, e)) &&
          warn(getWarnMessage(6, { key: e, type: a }));
        {
          const i = h["__v_emitter"];
          i &&
            b &&
            i.emit("fallback", {
              type: a,
              key: e,
              to: "global",
              groupId: a + ":" + e,
            });
        }
      }
      return l && b ? n(l) : r(e);
    }
    if (s(o)) return o;
    throw createI18nError(14);
  }
  function M(...t) {
    return T(
      e => translate(e, ...t),
      () => parseTranslateArgs(...t),
      "translate",
      e => e.t(...t),
      e => e,
      e => isString(e)
    );
  }
  const I = {
    normalize: function (e) {
      return e.map(e => (isString(e) ? createVNode(Text, null, e, 0) : e));
    },
    interpolate: e => e,
    type: "vnode",
  };
  function L(e) {
    return m.value[e] || {};
  }
  composerID++,
    l &&
      (watch(l.locale, e => {
        a &&
          ((c.value = e),
          (h.locale = e),
          updateFallbackLocale(h, c.value, u.value));
      }),
      watch(l.fallbackLocale, e => {
        a &&
          ((u.value = e),
          (h.fallbackLocale = e),
          updateFallbackLocale(h, c.value, u.value));
      }));
  const N = {
    id: composerID,
    locale: k,
    fallbackLocale: S,
    get inheritLocale() {
      return a;
    },
    set inheritLocale(e) {
      (a = e) &&
        l &&
        ((c.value = l.locale.value),
        (u.value = l.fallbackLocale.value),
        updateFallbackLocale(h, c.value, u.value));
    },
    get availableLocales() {
      return Object.keys(m.value).sort();
    },
    messages: F,
    datetimeFormats: E,
    numberFormats: O,
    get modifiers() {
      return v;
    },
    get pluralRules() {
      return y || {};
    },
    get isGlobal() {
      return t;
    },
    get missingWarn() {
      return f;
    },
    set missingWarn(e) {
      (f = e), (h.missingWarn = f);
    },
    get fallbackWarn() {
      return d;
    },
    set fallbackWarn(e) {
      (d = e), (h.fallbackWarn = d);
    },
    get fallbackRoot() {
      return b;
    },
    set fallbackRoot(e) {
      b = e;
    },
    get fallbackFormat() {
      return n;
    },
    set fallbackFormat(e) {
      (n = e), (h.fallbackFormat = n);
    },
    get warnHtmlMessage() {
      return i;
    },
    set warnHtmlMessage(e) {
      (i = e), (h.warnHtmlMessage = e);
    },
    get escapeParameter() {
      return _;
    },
    set escapeParameter(e) {
      (_ = e), (h.escapeParameter = e);
    },
    t: M,
    rt: function (...e) {
      var [e, t, a] = e;
      if (a && !isObject(a)) throw createI18nError(15);
      return M(e, t, assign({ resolvedMessage: !0 }, a || {}));
    },
    d: function (...t) {
      return T(
        e => datetime(e, ...t),
        () => parseDateTimeArgs(...t),
        "datetime format",
        e => e.d(...t),
        () => MISSING_RESOLVE_VALUE,
        e => isString(e)
      );
    },
    n: function (...t) {
      return T(
        e => number(e, ...t),
        () => parseNumberArgs(...t),
        "number format",
        e => e.n(...t),
        () => MISSING_RESOLVE_VALUE,
        e => isString(e)
      );
    },
    te: function (e, t) {
      return null !== resolveValue(L(isString(t) ? t : c.value), e);
    },
    tm: function (e) {
      var t = (function (t) {
        let a = null;
        var n = getLocaleChain(h, u.value, c.value);
        for (let e = 0; e < n.length; e++) {
          var r = resolveValue(m.value[n[e]] || {}, t);
          if (null != r) {
            a = r;
            break;
          }
        }
        return a;
      })(e);
      return null != t ? t : (l && l.tm(e)) || {};
    },
    getLocaleMessage: L,
    setLocaleMessage: function (e, t) {
      (m.value[e] = t), (h.messages = m.value);
    },
    mergeLocaleMessage: function (e, t) {
      (m.value[e] = m.value[e] || {}),
        deepCopy(t, m.value[e]),
        (h.messages = m.value);
    },
    getDateTimeFormat: function (e) {
      return g.value[e] || {};
    },
    setDateTimeFormat: function (e, t) {
      (g.value[e] = t),
        (h.datetimeFormats = g.value),
        clearDateTimeFormat(h, e, t);
    },
    mergeDateTimeFormat: function (e, t) {
      (g.value[e] = assign(g.value[e] || {}, t)),
        (h.datetimeFormats = g.value),
        clearDateTimeFormat(h, e, t);
    },
    getNumberFormat: function (e) {
      return p.value[e] || {};
    },
    setNumberFormat: function (e, t) {
      (p.value[e] = t), (h.numberFormats = p.value), clearNumberFormat(h, e, t);
    },
    mergeNumberFormat: function (e, t) {
      (p.value[e] = assign(p.value[e] || {}, t)),
        (h.numberFormats = p.value),
        clearNumberFormat(h, e, t);
    },
    getPostTranslationHandler: function () {
      return isFunction(o) ? o : null;
    },
    setPostTranslationHandler: function (e) {
      (o = e), (h.postTranslation = e);
    },
    getMissingHandler: function () {
      return r;
    },
    setMissingHandler: function (e) {
      null !== e && (s = defineCoreMissingHandler(e)), (r = e), (h.missing = s);
    },
    [TransrateVNodeSymbol]: function (...n) {
      return T(
        e => {
          let t;
          const a = e;
          try {
            (a.processor = I), (t = translate(a, ...n));
          } finally {
            a.processor = null;
          }
          return t;
        },
        () => parseTranslateArgs(...n),
        "translate",
        e => e[TransrateVNodeSymbol](...n),
        e => [createVNode(Text, null, e, 0)],
        e => isArray(e)
      );
    },
    [NumberPartsSymbol]: function (...t) {
      return T(
        e => number(e, ...t),
        () => parseNumberArgs(...t),
        "number format",
        e => e[NumberPartsSymbol](...t),
        () => [],
        e => isString(e) || isArray(e)
      );
    },
    [DatetimePartsSymbol]: function (...t) {
      return T(
        e => datetime(e, ...t),
        () => parseDateTimeArgs(...t),
        "datetime format",
        e => e[DatetimePartsSymbol](...t),
        () => [],
        e => isString(e) || isArray(e)
      );
    },
    [SetPluralRulesSymbol]: function (e) {
      (y = e), (h.pluralRules = y);
    },
    [InejctWithOption]: e.__injectWithOption,
  };
  return (
    (N[EnableEmitter] = e => {
      h.__v_emitter = e;
    }),
    (N[DisableEmitter] = () => {
      h.__v_emitter = void 0;
    }),
    N
  );
}
function convertComposerOptions(e) {
  var t = isString(e.locale) ? e.locale : "en-US",
    a =
      isString(e.fallbackLocale) ||
      isArray(e.fallbackLocale) ||
      isPlainObject(e.fallbackLocale) ||
      !1 === e.fallbackLocale
        ? e.fallbackLocale
        : t,
    n = isFunction(e.missing) ? e.missing : void 0,
    r =
      (!isBoolean(e.silentTranslationWarn) &&
        !isRegExp(e.silentTranslationWarn)) ||
      !e.silentTranslationWarn,
    s =
      (!isBoolean(e.silentFallbackWarn) && !isRegExp(e.silentFallbackWarn)) ||
      !e.silentFallbackWarn,
    o = !isBoolean(e.fallbackRoot) || e.fallbackRoot,
    i = !!e.formatFallbackMessages,
    l = isPlainObject(e.modifiers) ? e.modifiers : {},
    c = e.pluralizationRules,
    u = isFunction(e.postTranslation) ? e.postTranslation : void 0,
    m = !isString(e.warnHtmlInMessage) || "off" !== e.warnHtmlInMessage,
    g = !!e.escapeParameterHtml,
    p = !isBoolean(e.sync) || e.sync;
  e.formatter && warn(getWarnMessage(8)),
    e.preserveDirectiveContent && warn(getWarnMessage(9));
  let f = e.messages;
  if (isPlainObject(e.sharedMessages)) {
    const h = e.sharedMessages,
      k = Object.keys(h);
    f = k.reduce((e, t) => {
      var a = e[t] || (e[t] = {});
      return assign(a, h[t]), e;
    }, f || {});
  }
  var { __i18n: d, __root: b, __injectWithOption: _ } = e,
    v = e.datetimeFormats,
    y = e.numberFormats,
    e = e.flatJson;
  return {
    locale: t,
    fallbackLocale: a,
    messages: f,
    flatJson: e,
    datetimeFormats: v,
    numberFormats: y,
    missing: n,
    missingWarn: r,
    fallbackWarn: s,
    fallbackRoot: o,
    fallbackFormat: i,
    modifiers: l,
    pluralRules: c,
    postTranslation: u,
    warnHtmlMessage: m,
    escapeParameter: g,
    inheritLocale: p,
    __i18n: d,
    __root: b,
    __injectWithOption: _,
  };
}
function createVueI18n(a = {}) {
  const o = createComposer(convertComposerOptions(a)),
    n = {
      id: o.id,
      get locale() {
        return o.locale.value;
      },
      set locale(e) {
        o.locale.value = e;
      },
      get fallbackLocale() {
        return o.fallbackLocale.value;
      },
      set fallbackLocale(e) {
        o.fallbackLocale.value = e;
      },
      get messages() {
        return o.messages.value;
      },
      get datetimeFormats() {
        return o.datetimeFormats.value;
      },
      get numberFormats() {
        return o.numberFormats.value;
      },
      get availableLocales() {
        return o.availableLocales;
      },
      get formatter() {
        return (
          warn(getWarnMessage(8)),
          {
            interpolate() {
              return [];
            },
          }
        );
      },
      set formatter(e) {
        warn(getWarnMessage(8));
      },
      get missing() {
        return o.getMissingHandler();
      },
      set missing(e) {
        o.setMissingHandler(e);
      },
      get silentTranslationWarn() {
        return isBoolean(o.missingWarn) ? !o.missingWarn : o.missingWarn;
      },
      set silentTranslationWarn(e) {
        o.missingWarn = isBoolean(e) ? !e : e;
      },
      get silentFallbackWarn() {
        return isBoolean(o.fallbackWarn) ? !o.fallbackWarn : o.fallbackWarn;
      },
      set silentFallbackWarn(e) {
        o.fallbackWarn = isBoolean(e) ? !e : e;
      },
      get modifiers() {
        return o.modifiers;
      },
      get formatFallbackMessages() {
        return o.fallbackFormat;
      },
      set formatFallbackMessages(e) {
        o.fallbackFormat = e;
      },
      get postTranslation() {
        return o.getPostTranslationHandler();
      },
      set postTranslation(e) {
        o.setPostTranslationHandler(e);
      },
      get sync() {
        return o.inheritLocale;
      },
      set sync(e) {
        o.inheritLocale = e;
      },
      get warnHtmlInMessage() {
        return o.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(e) {
        o.warnHtmlMessage = "off" !== e;
      },
      get escapeParameterHtml() {
        return o.escapeParameter;
      },
      set escapeParameterHtml(e) {
        o.escapeParameter = e;
      },
      get preserveDirectiveContent() {
        return warn(getWarnMessage(9)), !0;
      },
      set preserveDirectiveContent(e) {
        warn(getWarnMessage(9));
      },
      get pluralizationRules() {
        return o.pluralRules || {};
      },
      __composer: o,
      t(...e) {
        var [e, t, a] = e;
        const n = {};
        let r = null,
          s = null;
        if (!isString(e)) throw createI18nError(15);
        return (
          isString(t)
            ? (n.locale = t)
            : isArray(t)
            ? (r = t)
            : isPlainObject(t) && (s = t),
          isArray(a) ? (r = a) : isPlainObject(a) && (s = a),
          o.t(e, r || s || {}, n)
        );
      },
      rt(...e) {
        return o.rt(...e);
      },
      tc(...e) {
        var [e, t, a] = e;
        const n = { plural: 1 };
        let r = null,
          s = null;
        if (!isString(e)) throw createI18nError(15);
        return (
          isString(t)
            ? (n.locale = t)
            : isNumber(t)
            ? (n.plural = t)
            : isArray(t)
            ? (r = t)
            : isPlainObject(t) && (s = t),
          isString(a)
            ? (n.locale = a)
            : isArray(a)
            ? (r = a)
            : isPlainObject(a) && (s = a),
          o.t(e, r || s || {}, n)
        );
      },
      te(e, t) {
        return o.te(e, t);
      },
      tm(e) {
        return o.tm(e);
      },
      getLocaleMessage(e) {
        return o.getLocaleMessage(e);
      },
      setLocaleMessage(e, t) {
        o.setLocaleMessage(e, t);
      },
      mergeLocaleMessage(e, t) {
        o.mergeLocaleMessage(e, t);
      },
      d(...e) {
        return o.d(...e);
      },
      getDateTimeFormat(e) {
        return o.getDateTimeFormat(e);
      },
      setDateTimeFormat(e, t) {
        o.setDateTimeFormat(e, t);
      },
      mergeDateTimeFormat(e, t) {
        o.mergeDateTimeFormat(e, t);
      },
      n(...e) {
        return o.n(...e);
      },
      getNumberFormat(e) {
        return o.getNumberFormat(e);
      },
      setNumberFormat(e, t) {
        o.setNumberFormat(e, t);
      },
      mergeNumberFormat(e, t) {
        o.mergeNumberFormat(e, t);
      },
      getChoiceIndex(e, t) {
        return warn(getWarnMessage(10)), -1;
      },
      __onComponentInstanceCreated(e) {
        const t = a["componentInstanceCreatedListener"];
        t && t(e, n);
      },
      __enableEmitter: e => {
        const t = o;
        t[EnableEmitter] && t[EnableEmitter](e);
      },
      __disableEmitter: () => {
        const e = o;
        e[DisableEmitter] && e[DisableEmitter]();
      },
    };
  return n;
}
const baseFormatProps = {
    tag: { type: [String, Object] },
    locale: { type: String },
    scope: {
      type: String,
      validator: e => "parent" === e || "global" === e,
      default: "parent",
    },
    i18n: { type: Object },
  },
  Translation = {
    name: "i18n-t",
    props: assign(
      {
        keypath: { type: String, required: !0 },
        plural: {
          type: [Number, String],
          validator: e => isNumber(e) || !isNaN(e),
        },
      },
      baseFormatProps
    ),
    setup(n, r) {
      const { slots: e, attrs: s } = r,
        o = n.i18n || useI18n({ useScope: n.scope, __useComponent: !0 }),
        i = Object.keys(e).filter(e => "_" !== e);
      return () => {
        const e = {};
        n.locale && (e.locale = n.locale),
          void 0 !== n.plural &&
            (e.plural = isString(n.plural) ? +n.plural : n.plural);
        var t = getInterpolateArg(r, i),
          t = o[TransrateVNodeSymbol](n.keypath, t, e),
          a = assign({}, s);
        return isString(n.tag) || isObject(n.tag)
          ? h(n.tag, a, t)
          : h(Fragment, a, t);
      };
    },
  };
function getInterpolateArg({ slots: n }, e) {
  return 1 === e.length && "default" === e[0]
    ? n.default
      ? n.default()
      : []
    : e.reduce((e, t) => {
        const a = n[t];
        return a && (e[t] = a()), e;
      }, {});
}
function renderFormatter(s, e, o, i) {
  const { slots: l, attrs: c } = e;
  return () => {
    const e = { part: !0 };
    let t = {};
    s.locale && (e.locale = s.locale),
      isString(s.format)
        ? (e.key = s.format)
        : isObject(s.format) &&
          (isString(s.format.key) && (e.key = s.format.key),
          (t = Object.keys(s.format).reduce(
            (e, t) => (o.includes(t) ? assign({}, e, { [t]: s.format[t] }) : e),
            {}
          )));
    const n = i(s.value, e, t);
    let a = [e.key];
    isArray(n)
      ? (a = n.map((e, t) => {
          const a = l[e.type];
          return a ? a({ [e.type]: e.value, index: t, parts: n }) : [e.value];
        }))
      : isString(n) && (a = [n]);
    var r = assign({}, c);
    return isString(s.tag) || isObject(s.tag)
      ? h(s.tag, r, a)
      : h(Fragment, r, a);
  };
}
const NUMBER_FORMAT_KEYS = [
    "localeMatcher",
    "style",
    "unit",
    "unitDisplay",
    "currency",
    "currencyDisplay",
    "useGrouping",
    "numberingSystem",
    "minimumIntegerDigits",
    "minimumFractionDigits",
    "maximumFractionDigits",
    "minimumSignificantDigits",
    "maximumSignificantDigits",
    "notation",
    "formatMatcher",
  ],
  NumberFormat = {
    name: "i18n-n",
    props: assign(
      {
        value: { type: Number, required: !0 },
        format: { type: [String, Object] },
      },
      baseFormatProps
    ),
    setup(e, t) {
      const a = e.i18n || useI18n({ useScope: "parent", __useComponent: !0 });
      return renderFormatter(e, t, NUMBER_FORMAT_KEYS, (...e) =>
        a[NumberPartsSymbol](...e)
      );
    },
  },
  DATETIME_FORMAT_KEYS = [
    "dateStyle",
    "timeStyle",
    "fractionalSecondDigits",
    "calendar",
    "dayPeriod",
    "numberingSystem",
    "localeMatcher",
    "timeZone",
    "hour12",
    "hourCycle",
    "formatMatcher",
    "weekday",
    "era",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName",
  ],
  DatetimeFormat = {
    name: "i18n-d",
    props: assign(
      {
        value: { type: [Number, Date], required: !0 },
        format: { type: [String, Object] },
      },
      baseFormatProps
    ),
    setup(e, t) {
      const a = e.i18n || useI18n({ useScope: "parent", __useComponent: !0 });
      return renderFormatter(e, t, DATETIME_FORMAT_KEYS, (...e) =>
        a[DatetimePartsSymbol](...e)
      );
    },
  };
function getComposer$2(e, t) {
  const a = e;
  return "composition" === e.mode
    ? a.__getInstance(t) || e.global
    : (null != (t = a.__getInstance(t)) ? t : e.global).__composer;
}
function vTDirective(s) {
  var e = (e, { instance: t, value: a, modifiers: n }) => {
    if (!t || !t.$) throw createI18nError(22);
    const r = getComposer$2(s, t.$);
    n.preserve && warn(getWarnMessage(7));
    t = parseValue(a);
    e.textContent = r.t(...makeParams(t));
  };
  return { beforeMount: e, beforeUpdate: e };
}
function parseValue(e) {
  if (isString(e)) return { path: e };
  if (isPlainObject(e)) {
    if ("path" in e) return e;
    throw createI18nError(19, "path");
  }
  throw createI18nError(20);
}
function makeParams(e) {
  var { path: e, locale: t, args: a, choice: n, plural: r } = e;
  const s = {};
  a = a || {};
  return (
    isString(t) && (s.locale = t),
    isNumber(n) && (s.plural = n),
    isNumber(r) && (s.plural = r),
    [e, a, s]
  );
}
function apply(e, t, ...a) {
  var a = isPlainObject(a[0]) ? a[0] : {},
    n = !!a.useI18nComponentName,
    a = !isBoolean(a.globalInstall) || a.globalInstall;
  a && n && warn(getWarnMessage(11, { name: Translation.name })),
    a &&
      (e.component(n ? "i18n" : Translation.name, Translation),
      e.component(NumberFormat.name, NumberFormat),
      e.component(DatetimeFormat.name, DatetimeFormat)),
    e.directive("t", vTDirective(t));
}
var global$1 =
  "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : "undefined" != typeof window
    ? window
    : {};
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  return "undefined" != typeof navigator
    ? window
    : void 0 !== global$1
    ? global$1
    : {};
}
const HOOK_SETUP = "devtools-plugin:setup";
function setupDevtoolsPlugin(e, t) {
  const a = getDevtoolsGlobalHook();
  if (a) a.emit(HOOK_SETUP, e, t);
  else {
    const n = getTarget(),
      r = (n.__VUE_DEVTOOLS_PLUGINS__ = n.__VUE_DEVTOOLS_PLUGINS__ || []);
    r.push({ pluginDescriptor: e, setupFn: t });
  }
}
const VueDevToolsLabels = {
    "vue-devtools-plugin-vue-i18n": "Vue I18n devtools",
    "vue-i18n-resource-inspector": "I18n Resources",
    "vue-i18n-timeline": "Vue I18n",
  },
  VueDevToolsPlaceholders = {
    "vue-i18n-resource-inspector": "Search for scopes ...",
  },
  VueDevToolsTimelineColors = { "vue-i18n-timeline": 16764185 },
  VUE_I18N_COMPONENT_TYPES = "vue-i18n: composer properties";
let devtoolsApi;
async function enableDevTools(n, r) {
  return new Promise((t, a) => {
    try {
      setupDevtoolsPlugin(
        {
          id: "vue-devtools-plugin-vue-i18n",
          label: VueDevToolsLabels["vue-devtools-plugin-vue-i18n"],
          packageName: "vue-i18n",
          homepage: "https://vue-i18n.intlify.dev",
          logo: "https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png",
          componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
          app: n,
        },
        e => {
          (devtoolsApi = e).on.visitComponentTree(
            ({ componentInstance: e, treeNode: t }) => {
              updateComponentTreeTags(e, t, r);
            }
          ),
            e.on.inspectComponent(
              ({ componentInstance: e, instanceData: t }) => {
                e.vnode.el.__VUE_I18N__ &&
                  t &&
                  ("legacy" !== r.mode ||
                    e.vnode.el.__VUE_I18N__ !== r.global.__composer) &&
                  inspectComposer(t, e.vnode.el.__VUE_I18N__);
              }
            ),
            e.addInspector({
              id: "vue-i18n-resource-inspector",
              label: VueDevToolsLabels["vue-i18n-resource-inspector"],
              icon: "language",
              treeFilterPlaceholder:
                VueDevToolsPlaceholders["vue-i18n-resource-inspector"],
            }),
            e.on.getInspectorTree(e => {
              e.app === n &&
                "vue-i18n-resource-inspector" === e.inspectorId &&
                registerScope(e, r);
            }),
            e.on.getInspectorState(e => {
              e.app === n &&
                "vue-i18n-resource-inspector" === e.inspectorId &&
                inspectScope(e, r);
            }),
            e.on.editInspectorState(e => {
              e.app === n &&
                "vue-i18n-resource-inspector" === e.inspectorId &&
                editScope(e, r);
            }),
            e.addTimelineLayer({
              id: "vue-i18n-timeline",
              label: VueDevToolsLabels["vue-i18n-timeline"],
              color: VueDevToolsTimelineColors["vue-i18n-timeline"],
            }),
            t(!0);
        }
      );
    } catch (e) {
      console.error(e), a(!1);
    }
  });
}
function updateComponentTreeTags(e, t, a) {
  var a = "composition" === a.mode ? a.global : a.global.__composer;
  e &&
    e.vnode.el.__VUE_I18N__ &&
    e.vnode.el.__VUE_I18N__ !== a &&
    ((a = e.type.name || e.type.displayName || e.type.__file),
    t.tags.push({
      label: `i18n (${a} Scope)`,
      textColor: 0,
      backgroundColor: 16764185,
    }));
}
function inspectComposer(e, t) {
  var a = VUE_I18N_COMPONENT_TYPES;
  e.state.push({ type: a, key: "locale", editable: !0, value: t.locale.value }),
    e.state.push({
      type: a,
      key: "availableLocales",
      editable: !1,
      value: t.availableLocales,
    }),
    e.state.push({
      type: a,
      key: "fallbackLocale",
      editable: !0,
      value: t.fallbackLocale.value,
    }),
    e.state.push({
      type: a,
      key: "inheritLocale",
      editable: !0,
      value: t.inheritLocale,
    }),
    e.state.push({
      type: a,
      key: "messages",
      editable: !1,
      value: getLocaleMessageValue(t.messages.value),
    }),
    e.state.push({
      type: a,
      key: "datetimeFormats",
      editable: !1,
      value: t.datetimeFormats.value,
    }),
    e.state.push({
      type: a,
      key: "numberFormats",
      editable: !1,
      value: t.numberFormats.value,
    });
}
function getLocaleMessageValue(a) {
  const n = {};
  return (
    Object.keys(a).forEach(e => {
      var t = a[e];
      isFunction(t) && "source" in t
        ? (n[e] = getMessageFunctionDetails(t))
        : isObject(t)
        ? (n[e] = getLocaleMessageValue(t))
        : (n[e] = t);
    }),
    n
  );
}
const ESC = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "&": "&amp;" };
function escape(e) {
  return e.replace(/[<>"&]/g, escapeChar);
}
function escapeChar(e) {
  return ESC[e] || e;
}
function getMessageFunctionDetails(e) {
  return {
    _custom: {
      type: "function",
      display:
        "<span>ƒ</span> " + (e.source ? `("${escape(e.source)}")` : "(?)"),
    },
  };
}
function registerScope(e, t) {
  e.rootNodes.push({ id: "global", label: "Global Scope" });
  var a,
    n,
    r,
    s = "composition" === t.mode ? t.global : t.global.__composer;
  for ([a, n] of t.__instances) {
    const o = "composition" === t.mode ? n : n.__composer;
    s !== o &&
      ((r = a.type.name || a.type.displayName || a.type.__file),
      e.rootNodes.push({ id: o.id.toString(), label: r + " Scope" }));
  }
}
function getComposer$1(t, e) {
  var a;
  return "global" === t
    ? "composition" === e.mode
      ? e.global
      : e.global.__composer
    : (a = Array.from(e.__instances.values()).find(e => e.id.toString() === t))
    ? "composition" === e.mode
      ? a
      : a.__composer
    : null;
}
function inspectScope(e, t) {
  t = getComposer$1(e.nodeId, t);
  t && (e.state = makeScopeInspectState(t));
}
function makeScopeInspectState(e) {
  const t = {};
  var a = "Locale related info",
    n = [
      { type: a, key: "locale", editable: !0, value: e.locale.value },
      {
        type: a,
        key: "fallbackLocale",
        editable: !0,
        value: e.fallbackLocale.value,
      },
      {
        type: a,
        key: "availableLocales",
        editable: !1,
        value: e.availableLocales,
      },
      { type: a, key: "inheritLocale", editable: !0, value: e.inheritLocale },
    ],
    a = ((t[a] = n), "Locale messages info"),
    n = [
      {
        type: a,
        key: "messages",
        editable: !1,
        value: getLocaleMessageValue(e.messages.value),
      },
    ],
    a = ((t[a] = n), "Datetime formats info"),
    n = [
      {
        type: a,
        key: "datetimeFormats",
        editable: !1,
        value: e.datetimeFormats.value,
      },
    ],
    a = ((t[a] = n), "Datetime formats info"),
    n = [
      {
        type: a,
        key: "numberFormats",
        editable: !1,
        value: e.numberFormats.value,
      },
    ];
  return (t[a] = n), t;
}
function addTimelineEvent(t, a) {
  if (devtoolsApi) {
    let e;
    a && "groupId" in a && ((e = a.groupId), delete a.groupId),
      devtoolsApi.addTimelineEvent({
        layerId: "vue-i18n-timeline",
        event: {
          title: t,
          groupId: e,
          time: Date.now(),
          meta: {},
          data: a || {},
          logType:
            "compile-error" === t
              ? "error"
              : "fallback" === t || "missing" === t
              ? "warning"
              : "default",
        },
      });
  }
}
function editScope(e, t) {
  const a = getComposer$1(e.nodeId, t);
  a &&
    (([t] = e.path),
    "locale" === t && isString(e.state.value)
      ? (a.locale.value = e.state.value)
      : "fallbackLocale" === t &&
        (isString(e.state.value) ||
          isArray(e.state.value) ||
          isObject(e.state.value))
      ? (a.fallbackLocale.value = e.state.value)
      : "inheritLocale" === t &&
        isBoolean(e.state.value) &&
        (a.inheritLocale = e.state.value));
}
function defineMixin(n, r, s) {
  return {
    beforeCreate() {
      var e = getCurrentInstance();
      if (!e) throw createI18nError(22);
      var t = this.$options;
      if (t.i18n) {
        const a = t.i18n;
        t.__i18n && (a.__i18n = t.__i18n),
          (a.__root = r),
          this === this.$root
            ? (this.$i18n = mergeToRoot(n, a))
            : ((a.__injectWithOption = !0), (this.$i18n = createVueI18n(a)));
      } else
        t.__i18n
          ? this === this.$root
            ? (this.$i18n = mergeToRoot(n, t))
            : (this.$i18n = createVueI18n({
                __i18n: t.__i18n,
                __injectWithOption: !0,
                __root: r,
              }))
          : (this.$i18n = n);
      n.__onComponentInstanceCreated(this.$i18n),
        s.__setInstance(e, this.$i18n),
        (this.$t = (...e) => this.$i18n.t(...e)),
        (this.$rt = (...e) => this.$i18n.rt(...e)),
        (this.$tc = (...e) => this.$i18n.tc(...e)),
        (this.$te = (e, t) => this.$i18n.te(e, t)),
        (this.$d = (...e) => this.$i18n.d(...e)),
        (this.$n = (...e) => this.$i18n.n(...e)),
        (this.$tm = e => this.$i18n.tm(e));
    },
    mounted() {
      {
        this.$el.__VUE_I18N__ = this.$i18n.__composer;
        const e = (this.__v_emitter = createEmitter()),
          t = this.$i18n;
        t.__enableEmitter && t.__enableEmitter(e), e.on("*", addTimelineEvent);
      }
    },
    beforeUnmount() {
      var e = getCurrentInstance();
      if (!e) throw createI18nError(22);
      {
        this.__v_emitter &&
          (this.__v_emitter.off("*", addTimelineEvent),
          delete this.__v_emitter);
        const t = this.$i18n;
        t.__disableEmitter && t.__disableEmitter(),
          delete this.$el.__VUE_I18N__;
      }
      delete this.$t,
        delete this.$rt,
        delete this.$tc,
        delete this.$te,
        delete this.$d,
        delete this.$n,
        delete this.$tm,
        s.__deleteInstance(e),
        delete this.$i18n;
    },
  };
}
function mergeToRoot(t, a) {
  (t.locale = a.locale || t.locale),
    (t.fallbackLocale = a.fallbackLocale || t.fallbackLocale),
    (t.missing = a.missing || t.missing),
    (t.silentTranslationWarn = a.silentTranslationWarn || t.silentFallbackWarn),
    (t.silentFallbackWarn = a.silentFallbackWarn || t.silentFallbackWarn),
    (t.formatFallbackMessages =
      a.formatFallbackMessages || t.formatFallbackMessages),
    (t.postTranslation = a.postTranslation || t.postTranslation),
    (t.warnHtmlInMessage = a.warnHtmlInMessage || t.warnHtmlInMessage),
    (t.escapeParameterHtml = a.escapeParameterHtml || t.escapeParameterHtml),
    (t.sync = a.sync || t.sync),
    t.__composer[SetPluralRulesSymbol](
      a.pluralizationRules || t.pluralizationRules
    );
  const n = getLocaleMessages(t.locale, {
    messages: a.messages,
    __i18n: a.__i18n,
  });
  return (
    Object.keys(n).forEach(e => t.mergeLocaleMessage(e, n[e])),
    a.datetimeFormats &&
      Object.keys(a.datetimeFormats).forEach(e =>
        t.mergeDateTimeFormat(e, a.datetimeFormats[e])
      ),
    a.numberFormats &&
      Object.keys(a.numberFormats).forEach(e =>
        t.mergeNumberFormat(e, a.numberFormats[e])
      ),
    t
  );
}
function createI18n(e = {}) {
  const s = !isBoolean(e.legacy) || e.legacy,
    o = !!e.globalInjection,
    a = new Map(),
    i = (s ? createVueI18n : createComposer)(e),
    l = makeSymbol("vue-i18n"),
    c = {
      get mode() {
        return s ? "legacy" : "composition";
      },
      async install(e, ...t) {
        (e.__VUE_I18N__ = c),
          (e.__VUE_I18N_SYMBOL__ = l),
          e.provide(e.__VUE_I18N_SYMBOL__, c),
          !s && o && injectGlobalFields(e, c.global),
          apply(e, c, ...t),
          s && e.mixin(defineMixin(i, i.__composer, c));
        {
          if (!(await enableDevTools(e, c))) throw createI18nError(21);
          const a = createEmitter();
          if (s) {
            const n = i;
            n.__enableEmitter && n.__enableEmitter(a);
          } else {
            const r = i;
            r[EnableEmitter] && r[EnableEmitter](a);
          }
          a.on("*", addTimelineEvent);
        }
      },
      get global() {
        return i;
      },
      __instances: a,
      __getInstance(e) {
        return a.get(e) || null;
      },
      __setInstance(e, t) {
        a.set(e, t);
      },
      __deleteInstance(e) {
        a.delete(e);
      },
    };
  return c;
}
function useI18n(a = {}) {
  var n = getCurrentInstance();
  if (null == n) throw createI18nError(16);
  if (!n.appContext.app.__VUE_I18N_SYMBOL__) throw createI18nError(17);
  var t = inject(n.appContext.app.__VUE_I18N_SYMBOL__);
  if (!t) throw createI18nError(22);
  const r = "composition" === t.mode ? t.global : t.global.__composer;
  var e = isEmptyObject(a)
    ? "__i18n" in n.type
      ? "local"
      : "global"
    : a.useScope || "local";
  if ("global" === e) {
    let t = isObject(a.messages) ? a.messages : {};
    "__i18nGlobal" in n.type &&
      (t = getLocaleMessages(r.locale.value, {
        messages: t,
        __i18n: n.type.__i18nGlobal,
      }));
    const i = Object.keys(t);
    if (
      (i.length &&
        i.forEach(e => {
          r.mergeLocaleMessage(e, t[e]);
        }),
      isObject(a.datetimeFormats))
    ) {
      const l = Object.keys(a.datetimeFormats);
      l.length &&
        l.forEach(e => {
          r.mergeDateTimeFormat(e, a.datetimeFormats[e]);
        });
    }
    if (isObject(a.numberFormats)) {
      const c = Object.keys(a.numberFormats);
      c.length &&
        c.forEach(e => {
          r.mergeNumberFormat(e, a.numberFormats[e]);
        });
    }
    return r;
  }
  if ("parent" === e) {
    let e = getComposer(t, n, a.__useComponent);
    return null == e && (warn(getWarnMessage(12)), (e = r)), e;
  }
  if ("legacy" === t.mode) throw createI18nError(18);
  const s = t;
  let o = s.__getInstance(n);
  if (null == o) {
    e = n.type;
    const u = assign({}, a);
    e.__i18n && (u.__i18n = e.__i18n),
      r && (u.__root = r),
      (o = createComposer(u)),
      setupLifeCycle(s, n, o),
      s.__setInstance(n, o);
  }
  return o;
}
function getComposer(e, t, a = !1) {
  let n = null;
  var r,
    s = t.root;
  let o = t.parent;
  for (; null != o; ) {
    const i = e;
    if (
      ("composition" === e.mode
        ? (n = i.__getInstance(o))
        : (null != (r = i.__getInstance(o)) && (n = r.__composer),
          a && n && !n[InejctWithOption] && (n = null)),
      null != n)
    )
      break;
    if (s === o) break;
    o = o.parent;
  }
  return n;
}
function setupLifeCycle(t, a, n) {
  let r = null;
  onMounted(() => {
    if (a.vnode.el) {
      (a.vnode.el.__VUE_I18N__ = n), (r = createEmitter());
      const e = n;
      e[EnableEmitter] && e[EnableEmitter](r), r.on("*", addTimelineEvent);
    }
  }, a),
    onUnmounted(() => {
      if (a.vnode.el && a.vnode.el.__VUE_I18N__) {
        r && r.off("*", addTimelineEvent);
        const e = n;
        e[DisableEmitter] && e[DisableEmitter](),
          delete a.vnode.el.__VUE_I18N__;
      }
      t.__deleteInstance(a);
    }, a);
}
const globalExportProps = ["locale", "fallbackLocale", "availableLocales"],
  globalExportMethods = ["t", "rt", "d", "n", "tm"];
function injectGlobalFields(a, n) {
  const r = Object.create(null);
  globalExportProps.forEach(e => {
    const t = Object.getOwnPropertyDescriptor(n, e);
    if (!t) throw createI18nError(22);
    var a = isRef(t.value)
      ? {
          get() {
            return t.value.value;
          },
          set(e) {
            t.value.value = e;
          },
        }
      : {
          get() {
            return t.get && t.get();
          },
        };
    Object.defineProperty(r, e, a);
  }),
    (a.config.globalProperties.$i18n = r),
    globalExportMethods.forEach(e => {
      var t = Object.getOwnPropertyDescriptor(n, e);
      if (!t || !t.value) throw createI18nError(22);
      Object.defineProperty(a.config.globalProperties, "$" + e, t);
    });
}
{
  const k7 = getGlobalThis();
  (k7.__INTLIFY__ = !0), setDevToolsHook(k7.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
initDev();

const loc = new Intl.Locale(navigator.language);

const i18n = createI18n({
  legacy: false,
  locale: loc.language,
  fallbackLocale: "en",
});

const EmailInput = {
  name: "EmailInput",
  props: ["loginHint"],
  render() {
    return h("input", {
      required: true,
      type: "email",
      name: "email",
      autocomplete: "username",
      class: "form-control form-control-lg mb-2",
      placeholder: this.t("enterEmail"),
      ...(this.loginHint ? { autocomplete: "on" } : { value: this.loginHint }),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterEmail: () => "Enter an email",
        },
        fr: {
          enterEmail: () => "Entrez un email",
        },
      },
    });
    return { t };
  },
};

const PasswordInput = {
  name: "PasswordInput",
  props: ["loginHint"],
  render() {
    return h("input", {
      type: "password",
      name: "password",
      autocomplete: "current-password",
      class: "form-control form-control-lg mb-3 signin",
      placeholder: this.t("enterPassword"),
      ...(this.loginHint ? { autocomplete: "on" } : {}),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterPassword: () => "Enter password",
        },
        fr: {
          enterPassword: () => "Entrez votre mot de passe",
        },
      },
    });
    return { t };
  },
};

const CodeInput = {
  name: "CodeInput",
  render() {
    return h("input", {
      type: "text",
      name: "code",
      autocomplete: "one-time-code",
      class: "form-control form-control-lg mb-3 signin",
      placeholder: this.t("verificationCode"),
      autofocus: "on",
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          verificationCode: () => "Enter verification code",
        },
        fr: {
          verificationCode: () => "Entrez votre code de verification",
        },
      },
    });
    return { t };
  },
};

const NameInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "name",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your name`,
        },
        fr: {
          enterText: () => `Entrez votre prénom`,
        },
      },
    });
    return { t };
  },
};

const SurnameInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "surname",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your surname`,
        },
        fr: {
          enterText: () => `Entrez votre nom de famille`,
        },
      },
    });
    return { t };
  },
};

const OrganizationInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "organization",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your organization name`,
        },
        fr: {
          enterText: () => `Entrez le nom de votre organisation`,
        },
      },
    });
    return { t };
  },
};

const PhoneInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "phone",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your phone number (optionnal)`,
        },
        fr: {
          enterText: () => `Entrez votre numéro de téléphone (optionnel)`,
        },
      },
    });
    return { t };
  },
};

const RoleInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "role",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your job (optionnal)`,
        },
        fr: {
          enterText: () => `Entrez votre poste (optionnel)`,
        },
      },
    });
    return { t };
  },
};

const SubmitButton = {
  name: "SubmitButton",
  render() {
    return h(
      "button",
      { id: "signin", type: "submit", class: "btn btn-lg float-end" },
      "Sign In"
    );
  },
};

const SendCodeButton = {
  name: "SendCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "sendcode",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        style: "text-align: left",
        formaction: `/oidc/interaction/${this.uid}/login?send-code`,
      },
      this.t("clickAction")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          clickAction: () => "Click to receive a one-time code",
        },
        fr: {
          clickAction: () =>
            "Cliquez pour recevoir un code de connexion unique",
        },
      },
    });
    return { t };
  },
};

const ResendCodeButton = {
  name: "ResendCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "sendcode",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        style: "text-align: left",
        formaction: `/oidc/interaction/${this.uid}/login?send-code`,
      },
      this.t("resendCode")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          resendCode: () => "Click to resend a one-time code",
        },
        fr: {
          resendCode: () => "Cliquez pour renvoyer un code de verification",
        },
      },
    });
    return { t };
  },
};

const SignupCodeButton = {
  name: "SignupCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "signup-code",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        formaction: `/oidc/interaction/${this.uid}/login?sign-up`,
      },
      this.t("validate")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          validate: () => "Validate sign up",
        },
        fr: {
          resendCode: () => "Valider l'inscription",
        },
      },
    });
    return { t };
  },
};

const DemoRoleSelect = {
  name: "DemoRoleSelect",
  data() {
    return {
      roles: [
        "developer",
        "administrator",
        "writer_s001",
        "writer_s002",
        "writer_p000003",
        "writer",
        "super_administrator",
        "reader_s001",
      ],
    };
  },
  render() {
    return h(
      "select",
      {
        name: "role",
        id: "roles",
        class: "form-control form-control-lg mb-3",
        form: "loginform",
      },
      this.roles.map(role => h("option", role))
    );
  },
};

const SigninForm = {
  name: "SigninForm",
  props: ["uid", "method", "loginHint"],
  computed: {
    resolveLoginForms() {
      switch (this.method) {
        case "demo":
          return [h(SigninDemo)];
        case "code":
        case "code,retry":
        case "code,reset":
        case "code,reset,retry":
          return [
            h(SigninCodeResetRetry, {
              loginHint: this.loginHint,
              method: this.method,
              uid: this.uid,
            }),
          ];
        default:
          return [h(SigninCode, { loginHint: this.loginHint, uid: this.uid })];
      }
    },
  },
  render() {
    return h(
      "form",
      {
        id: "loginform",
        autocomplete: "off",
        action: `/oidc/interaction/${this.uid}/login?sign-in`,
        method: "post",
        onKeydown: (e) => { if(e.key == "Enter") e.preventDefault(); }
      },
      [
        h("div", { class: "modal-body border-0" }, this.resolveLoginForms),
        h("div", { class: "modal-footer border-0" }, [h(SubmitButton)]),
        h("div", { class: "d-flex flex-row align-baseline mx-2" }, [
          h(SigninFooter),
        ]),
      ]
    );
  },
};

const SigninDemo = {
  name: "SigninDemo",
  render() {
    return [
      h("input", {
        required: true,
        type: "hidden",
        name: "method",
        value: "demo",
      }),
      h(DemoRoleSelect),
    ];
  },
};

const SigninCode = {
  name: "SigninCode",
  props: ["loginHint", "uid"],
  render() {
    return [
      h("input", {
        required: true,
        type: "hidden",
        name: "method",
        value: "password",
        class: "form-control",
        loginHint: this.loginHint,
      }),
      h(EmailInput, { loginHint: this.loginHint }),
      h(SendCodeButton, { uid: this.uid }),
      h("h3", { class: "mb-3 text-center info" }, this.t("or")),
      h(PasswordInput, { loginHint: this.loginHint }),
    ];
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          or: () => "OR",
        },
        fr: {
          or: () => "OU",
        },
      },
    });
    return { t };
  },
};

const SigninCodeResetRetry = {
  name: "SigninCodeResetRetry",
  props: ["method", "loginHint", "uid"],
  computed: {
    renderInputs() {
      const inputs = [
        h("input", {
          required: true,
          type: "hidden",
          name: "method",
          value: this.method.replace(/(,retry)?$/, ",retry"),
        }),
        h("input", {
          required: true,
          type: "hidden",
          name: "userid",
          value: this.loginHint,
        }),
        h(CodeInput),
        h(ResendCodeButton, { uid: this.uid }),
      ];
      if (this.method.startsWith("code,reset"))
        inputs.push(h(SigninSetPassword));
      return inputs;
    },
  },
  render() {
    return this.renderInputs;
  },
};

const SigninSetPassword = {
  name: "SigninSetPassword",
  render() {
    return h("div", { class: "form-check form-switch" }, [
      h("input", {
        type: "checkbox",
        class: "form-check-input",
        name: "changePassword",
        id: "toggle-pwd",
      }),
      h(
        "label",
        { class: "form-check-label", for: "toggle-pwd" },
        this.t("setPassword")
      ),
      h("div", { id: "password-inputs", class: "mt-3" }, [
        h("input", {
          type: "password",
          name: "password",
          autocomplete: "new-password",
          class: "form-control form-control-lg mb-3 signin",
          placeholder: this.t("choosePassword"),
        }),
        h("input", {
          type: "password",
          name: "password2",
          autocomplete: "new-password",
          class: "form-control form-control-lg mb-3 signin",
          placeholder: this.t("retypePassword"),
        }),
      ]),
    ]);
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          setPassword: () => "Optionally set a new password",
          choosePassword: () => "Choose password",
          retypePassword: () => "Retype password",
        },
        fr: {
          setPassword: () =>
            "Vous pouvez également définir un nouveau mot de passe",
          choosePassword: () => "Choisissez un mot de passe",
          retypePassword: () => "Retapez le mot de passe",
        },
      },
    });
    return { t };
  },
};

const SigninFooter = {
  name: "SigninFooter",
  render() {
    return [
      h("h6", { class: "px-2" }, [this.t("followUs")]),
      h(
        "a",
        {
          href: "https://www.linkedin.com/company/aronelogiciels/",
          target: "_blank",
        },
        [
          h("i", {
            class: "fa fa-linkedin-square ml-2",
            style: "font-size: 20px;",
          }),
        ]
      ),
    ];
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          followUs: () => "Follow us on : ",
        },
        fr: {
          followUs: () => "Suivez-nous : ",
        },
      },
    });
    return { t };
  },
};

const SignupForm = {
  props: ["uid", "loginHint", "method"],
  render() {
    return h(
      "form",
      {
        id: "loginform",
        autocomplete: "off",
        action: `/oidc/interaction/${this.uid}/login?sign-up`,
        method: "post",
        onKeydown: e => {
          if (e.key == "Enter") e.preventDefault();
        },
      },
      h("div", { class: "modal-body border-0" }, [
        h(EmailInput, { loginHint: this.loginHint }),
        h(NameInput),
        h(SurnameInput),
        h(OrganizationInput),
        h(RoleInput),
        h(PhoneInput)
      ]),
      h("div", { class: "modal-footer border-0" }, [
        h(SignupCodeButton, { uid: this.uid }),
      ]),
      h("div", { class: "d-flex flex-row align-baseline mx-2" }, [
        h(SigninFooter),
      ])
    );
  },
};

const LoginHeader = {
  name: "LoginHeader",
  props: ["title", "subtitle", "selectedTab"],
  render() {
    return h(
      "div",
      { class: "modal-header flex-column border-0 login-header" },
      [
        h(NavigationBar, {
          onChangeTab: tab => this.$emit("changeTab", tab),
          selectedTab: this.selectedTab,
        }),
        h("h1", { class: "card-title mb-md-1 mt-md-5 mt-2" }, this.title),
        h("h3", { class: "card-title mb-md-3 mt-1 mb-1" }, this.subtitle),
      ]
    );
  },
};

const Login = {
  name: "Login",
  props: ["title", "subtitle", "uid", "method", "loginHint", "flash"],
  data() {
    return {
      selectedTab: "signin",
    };
  },
  render() {
    return h(
      "div",
      { class: "modal d-block", id: "background", tabindex: "-1" },
      [
        h("div", { class: "modal-dialog rounded" }, [
          h(
            "div",
            {
              class: "modal-content rounded d-flex flex-row align-start h-100",
            },
            [
              h(
                "div",
                {
                  class:
                    "col-lg-6 col-12 rounded-md-right px-sm-5 login-body h-100 d-flex",
                },
                [
                  h(
                    "div",
                    { class: "align-self-center px-0 col" },
                    [
                      h(LoginHeader, {
                        title: this.title,
                        subtitle: this.subtitle,
                        selectedTab: this.selectedTab,
                        onChangeTab: tab => (this.selectedTab = tab),
                      }),
                      this.selectedTab == "signin"
                        ? h(SigninForm, {
                            uid: this.uid,
                            method: this.method,
                            loginHint: this.loginHint,
                          })
                        : h(SignupForm, {
                          uid: this.uid,
                          method: this.method,
                          loginHint: this.loginHint,
                        }),
                    ].concat(
                      this.flash ? [h(AlertMessage, { flash: this.flash })] : []
                    )
                  ),
                ]
              ),
              h(MainImage),
            ]
          ),
        ]),
        h(AroneLogo),
      ]
    );
  },
};

const AroneLogo = {
  name: "AroneLogo",
  render() {
    return h(
      "div",
      { class: "logo d-flex justify-content-start px-md-5 px-1 mt-2" },
      [
        h("span", this.t("poweredBy")),
        h("img", {
          src: "/assets/logo.svg",
          alt: "Arone Logo",
          class: "col-lg-auto col",
        }),
      ]
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          poweredBy: () => "Powered By ",
        },
        fr: {
          poweredBy: () => "Créé par ",
        },
      },
    });
    return { t };
  },
};

const MainImage = {
  name: "MainImage",
  render() {
    return h("div", { class: "col-6 p-5 image-container" }, [
      h("img", { src: "/assets/mainImage.svg", alt: "Main Image" }),
    ]);
  },
};

const AlertMessage = {
  name: "AlertMessage",
  props: ["flash"],
  render() {
    return h(
      "p",
      { class: "alert-message m-2 pb-1 pt-1 text-center" },
      this.flash
    );
  },
};

const NavigationBar = {
  name: "NavigationTabs",
  props: ["selectedTab"],
  methods: {
    changeTab(tab) {
      this.$emit("changeTab", tab);
    },
  },
  render() {
    return h("ul", { class: "nav ml-auto mt-2 mt-lg-0" }, [
      h("li", [
        h(
          "a",
          {
            id: "signinLink",
            class: this.selectedTab == "signin" ? "connexion h5" : "h5",
            onClick: () => this.changeTab("signin"),
          },
          this.t("signin")
        ),
      ]),
      h("li", [
        h(
          "a",
          {
            id: "signupLink",
            class:
              this.selectedTab == "signup" ? "px-4 connexion h5" : "px-4 h5",
            onClick: () => this.changeTab("signup"),
          },
          this.t("signup")
        ),
      ]),
    ]);
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          signin: () => "Sign In",
          signup: () => "Sign Up",
        },
        fr: {
          signin: () => "Connexion",
          signup: () => "Inscription",
        },
      },
    });
    return { t };
  },
};

export { AlertMessage, AroneLogo, Login, LoginHeader, MainImage, NavigationBar, createApp, h, i18n };
