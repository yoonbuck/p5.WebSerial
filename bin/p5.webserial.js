!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):((e="undefined"!=typeof globalThis?globalThis:e||self).p5=e.p5||{},e.p5.WebSerial=t())}(this,(function(){"use strict";const e=new WeakMap;return class{constructor(){this.serialBuffer=[],this.serialConnected=!1,this.portOpen=!1,this.emitter=new EventTarget}async requestPort(e=[{usbVendorId:9025}]){this.port=await navigator.serial.requestPort({filters:e}),this.portInfo=this.port.getInfo(),this.emit("portavailable",this.portInfo)}async getPorts(e=(e=>e[0])){const t=await navigator.serial.getPorts();let r;t.length&&(r=e(t)),r?(this.port=r,this.portInfo=this.port.getInfo(),this.emit("portavailable",this.portInfo)):this.emit("noport")}async open(e={baudRate:9600}){if(!this.port)throw new Error("Call getPorts() or requestPort() before open() to select a port.");await this.port.open(e),this.portOpen=!0,this.emit("open"),this.readLoop()}async close(){if(!this.portOpen)throw new Error("");await this.port.close(),this.portOpen=!1,this.emit("close")}async readLoop(){for(;this.port.readable;){const e=this.port.readable.getReader();try{for(;;){const{value:t,done:r}=await e.read();if(r){e.releaseLock();break}t&&(this.serialBuffer=this.serialBuffer.concat(Array.from(t)),this.emit("data"))}}catch(e){this.emit("readerror",e)}}}read(){return this.serialBuffer.length>0?this.serialBuffer.shift():-1}readChar(){return this.serialBuffer.length>0?String.fromCharCode(this.serialBuffer.shift()):null}readBytes(){let e=new Uint8Array(this.serialBuffer);return this.serialBuffer.length=0,e}readBytesUntil(e,t=!1){if(-1===this.serialBuffer.indexOf(e.charCodeAt(0)))return t?this.readBytes():null}bufferAsString(){let e=new Array(this.serialBuffer.length);for(let t=0;t<this.serialBuffer.length;t++)e[t]=String.fromCharCode(this.serialBuffer[t]);return e.join("")}readString(){let e=this.bufferAsString();return this.serialBuffer.length=0,e}readStringUntil(e,t=!1){let r=this.bufferAsString(),i=r.indexOf(e);if(i>-1){let t=r.substr(0,i);return this.serialBuffer=this.serialBuffer.slice(i+e.length),t}return t?(this.serialBuffer.length=0,r):null}readLine(){return this.readStringUntil("\r\n")}available(){return this.serialBuffer.length}clear(){this.serialBuffer.length=0}emit(e,t){this.emitter.dispatchEvent(new CustomEvent(e,{detail:t}))}on(t,r){let i=({detail:e})=>r(e);e.set(r,i),this.emitter.addEventListener(t,i)}off(t,r){let i=e.get(r);this.emitter.removeEventListener(t,i)}static checkSupport(){return"serial"in navigator}}}));