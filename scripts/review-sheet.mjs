import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
mkdirSync('/tmp/nodit-review',{recursive:true});
const files=readdirSync('design/screens').filter(f=>f.endsWith('.png'));
for(let i=0;i<files.length;i+=12) {
 const batch=files.slice(i,i+12);const inputs=[];
 for(let j=0;j<batch.length;j++) {
  const thumb=await sharp(`design/screens/${batch[j]}`).resize(260,240,{fit:'inside'}).extend({top:20,bottom:0,left:0,right:0,background:'#FFFFFF'}).png().toBuffer();
  inputs.push({input:thumb,left:j%4*280,top:Math.floor(j/4)*280});
 }
 await sharp({create:{width:1120,height:840,channels:3,background:'#DCE0E7'}}).composite(inputs).png().toFile(`/tmp/nodit-review/screens-${i/12}.png`);
}
for(const font of ['archivo-black','bricolage-grotesque','unbounded']) {
 for(const width of [390,844]) {
  const height=width===390?844:390;
  await sharp(`design/screens/fonts/${font}-${width}.png`).extract({left:0,top:0,width,height:height*2+8}).png().toFile(`/tmp/nodit-review/${font}-${width}.png`);
 }
}
console.log(files.length+' screenshots indexed in /tmp/nodit-review');
