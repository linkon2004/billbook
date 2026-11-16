/* Tiny offline QR encoder: byte mode, ECC level M, versions 1-10, mask 0 */
(function(){
function mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z}
function rsDiv(d){const r=new Array(d).fill(0);r[d-1]=1;let root=1;for(let i=0;i<d;i++){for(let j=0;j<d;j++){r[j]=mul(r[j],root);if(j+1<d)r[j]^=r[j+1]}root=mul(root,2)}return r}
function rsRem(data,div){const r=div.map(()=>0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>r[i]^=mul(c,f))}return r}
const ECC=[10,16,26,18,24,16,18,22,22,26],NB=[1,1,1,2,2,4,4,4,5,5];
function raw(v){let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r}
window.makeQR=function(text){
  const bytes=Array.from(new TextEncoder().encode(text));
  let v=1;
  for(;v<=10;v++){const dc=Math.floor(raw(v)/8)-ECC[v-1]*NB[v-1];if(4+(v<10?8:16)+8*bytes.length<=dc*8)break}
  if(v>10)throw new Error('Text too long for QR');
  const total=Math.floor(raw(v)/8),eccLen=ECC[v-1],nb=NB[v-1],dcw=total-eccLen*nb;
  const bits=[],put=(val,n)=>{for(let i=n-1;i>=0;i--)bits.push((val>>>i)&1)};
  put(4,4);put(bytes.length,v<10?8:16);bytes.forEach(b=>put(b,8));
  put(0,Math.min(4,dcw*8-bits.length));while(bits.length%8)bits.push(0);
  const data=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=b<<1|bits[i+j];data.push(b)}
  for(let p=0xEC;data.length<dcw;p^=0xEC^0x11)data.push(p);
  const div=rsDiv(eccLen),blocks=[],numShort=nb-total%nb,shortLen=Math.floor(total/nb);
  for(let i=0,k=0;i<nb;i++){
    const len=shortLen-eccLen+(i<numShort?0:1),d=data.slice(k,k+len);k+=len;
    const e=rsRem(d,div);if(i<numShort)d.push(0);blocks.push(d.concat(e));
  }
  const all=[];
  for(let i=0;i<blocks[0].length;i++)blocks.forEach((bk,j)=>{if(i!=shortLen-eccLen||j>=numShort)all.push(bk[i])});
  const size=v*4+17,m=[],fn=[];
  for(let i=0;i<size;i++){m.push(new Array(size).fill(false));fn.push(new Array(size).fill(false))}
  const set=(x,y,d)=>{m[y][x]=d;fn[y][x]=true};
  for(let i=0;i<size;i++){set(6,i,i%2==0);set(i,6,i%2==0)}
  [[3,3],[size-4,3],[3,size-4]].forEach(([cx,cy])=>{
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
      const x=cx+dx,y=cy+dy;
      if(x>=0&&x<size&&y>=0&&y<size){const d=Math.max(Math.abs(dx),Math.abs(dy));set(x,y,d!=2&&d!=4)}
    }
  });
  if(v>1){
    const n=Math.floor(v/7)+2,step=Math.ceil((v*4+4)/(n*2-2))*2,pos=[6];
    for(let p=size-7;pos.length<n;p-=step)pos.splice(1,0,p);
    pos.forEach((a,i)=>pos.forEach((b,j)=>{
      if((i==0&&j==0)||(i==0&&j==n-1)||(i==n-1&&j==0))return;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(a+dx,b+dy,Math.max(Math.abs(dx),Math.abs(dy))!=1);
    }));
  }
  const fmt=mask=>{
    const d=mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);
    const b=((d<<10)|r)^0x5412,g=i=>((b>>>i)&1)!=0;
    for(let i=0;i<=5;i++)set(8,i,g(i));
    set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));
    for(let i=9;i<15;i++)set(14-i,8,g(i));
    for(let i=0;i<8;i++)set(size-1-i,8,g(i));
    for(let i=8;i<15;i++)set(8,size-15+i,g(i));
    set(8,size-8,true);
  };
  fmt(0);
  if(v>=7){
    let r=v;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);
    const b=(v<<12)|r;
    for(let i=0;i<18;i++){const c=((b>>>i)&1)!=0,a=size-11+i%3,d=Math.floor(i/3);set(a,d,c);set(d,a,c)}
  }
  let k=0;
  for(let r=size-1;r>=1;r-=2){
    if(r==6)r=5;
    for(let vt=0;vt<size;vt++)for(let j=0;j<2;j++){
      const x=r-j,up=((r+1)&2)==0,y=up?size-1-vt:vt;
      if(!fn[y][x]&&k<all.length*8){m[y][x]=((all[k>>>3]>>>(7-(k&7)))&1)!=0;k++}
    }
  }
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!fn[y][x]&&(x+y)%2==0)m[y][x]=!m[y][x];
  fmt(0);
  return m;
};
})();
