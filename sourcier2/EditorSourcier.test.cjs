const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const html=readFileSync(__dirname+'/EditorSourcier.html','utf8');
const source=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
new vm.Script(source); // Also validate the entire editor, not just extracted helpers.
const context=vm.createContext({Intl,URL,location:{href:'https://example.org/studio/'},TextEncoder,Blob});
vm.runInContext(source.slice(source.indexOf("'use strict';"),source.indexOf("const STORE="))+source.slice(source.indexOf('function safeJs('),source.indexOf('function download('))+'\nthis.api={normalizeProject,normalizeBlock,safeJs,exportPage,validDate};',context);
const {normalizeProject,normalizeBlock,safeJs,exportPage,validDate}=context.api;
test('import validates structure, versions and block types',()=>{
 for(const raw of [null,{}, {pages:[]},{version:2,pages:[{blocks:[]}]},{pages:[{blocks:[{type:'unknown'}]}]}])assert.throws(()=>normalizeProject(raw));
});
test('import repairs identifiers, URLs, styles and geometry without modifying input',()=>{
 const raw={pages:[{id:'unsafe"',slug:'same',theme:'bad',blocks:[{id:'unsafe"',type:'image',x:-1,y:999,w:999,h:100,url:'javascript:alert(1)'}]},{slug:'SAME',blocks:[]}]};
 const p=normalizeProject(raw),b=p.pages[0].blocks[0];
 assert.equal(b.w,390);assert.equal(b.x,0);assert.equal(b.y,600);assert.equal(b.url,'');assert.equal(p.pages[0].theme,'forest');assert.notEqual(p.pages[0].slug.toLowerCase(),p.pages[1].slug.toLowerCase());assert.equal(raw.pages[0].blocks[0].w,999);
 assert.equal(normalizeBlock({type:'shape',color:'red;position:fixed',opacity:8}).color,'#ffffff');
});
test('dates reject invalid calendar days; timer values are finite integers',()=>{
 assert.equal(validDate('2027-02-29'),false);assert.equal(validDate('2028-02-29'),true);
 assert.equal(normalizeBlock({type:'timer',seconds:1.5}).seconds,2);
 assert.equal(normalizeBlock({type:'timer',seconds:Infinity}).seconds,60);
});
test('export preserves special characters and cannot close its script through user text',()=>{
 const text='Écouter <le vivant> & </script>\u2028\u2029';
 assert.equal(vm.runInNewContext('('+safeJs({text})+')').text,text);
 const p=normalizeProject({pages:[{name:text,blocks:[{type:'text',text},{type:'audio',url:'',rules:[]}]}]}).pages[0];
 const out=exportPage(p);const script=out.match(/<script>([\s\S]*?)<\/script>/)[1];
 new vm.Script(script);assert.equal(out.match(/<\/script>/g).length,1);assert.ok(out.includes('&lt;le vivant&gt;'));
});
