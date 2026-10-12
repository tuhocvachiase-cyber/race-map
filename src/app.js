(function(){
"use strict";
/* ---------- theme: light by default, dark on request ---------- */
const root=document.documentElement;
let mode="light";
try{const m=localStorage.getItem("racemap-mode");if(m==="dark")mode="dark"}catch(e){}
root.setAttribute("data-mode",mode);

/* ---------- data ---------- */
const DATA=JSON.parse(document.getElementById("data").textContent);
let races=DATA.races.slice();
const VNPATH=document.getElementById("vnpath").textContent.trim();
const now=new Date();
const TODAY=new Date(now.getFullYear(),now.getMonth(),now.getDate());
const toD=s=>s?new Date(s+"T00:00:00"):null;

const PLACES=[
["Hà Nội",21.03,105.85,"bac"],["Hải Phòng",20.85,106.69,"bac"],["Quảng Ninh (Hạ Long)",20.96,107.05,"bac"],["Quảng Ninh (Yên Tử)",21.15,106.72,"bac"],
["Bắc Ninh",21.18,106.07,"bac"],["Bắc Ninh (Bắc Giang)",21.27,106.2,"bac"],["Hưng Yên",20.65,106.05,"bac"],["Ninh Bình",20.25,105.9,"bac"],["Ninh Bình (Cúc Phương)",20.3,105.6,"bac"],
["Thanh Hoá",19.81,105.78,"bac"],["Thanh Hoá (Sầm Sơn)",19.73,105.9,"bac"],["Thanh Hoá (Pù Luông)",20.45,105.13,"bac"],["Lào Cai",22.49,103.97,"bac"],["Lào Cai (Sa Pa)",22.34,103.84,"bac"],
["Lào Cai (Mù Cang Chải)",21.85,104.09,"bac"],["Sơn La (Mộc Châu)",20.85,104.65,"bac"],["Cao Bằng",22.67,106.26,"bac"],["Hà Giang / Tuyên Quang",22.82,104.98,"bac"],["Lạng Sơn",21.85,106.76,"bac"],["Điện Biên",21.39,103.02,"bac"],["Hòa Bình / Phú Thọ",20.82,105.34,"bac"],
["Nghệ An (Vinh)",18.67,105.69,"trung"],["Nghệ An (Cửa Lò)",18.81,105.72,"trung"],["Hà Tĩnh",18.34,105.9,"trung"],["Quảng Trị",16.75,107.19,"trung"],["Huế",16.46,107.59,"trung"],["Đà Nẵng",16.06,108.22,"trung"],
["Đà Nẵng (Hội An)",15.88,108.33,"trung"],["Quảng Ngãi",15.12,108.8,"trung"],["Quảng Ngãi (Măng Đen)",14.6,108.3,"trung"],["Gia Lai (Pleiku)",13.98,108.0,"trung"],["Gia Lai (Quy Nhơn)",13.77,109.22,"trung"],
["Đắk Lắk (Buôn Ma Thuột)",12.67,108.04,"trung"],["Đắk Lắk (Tuy Hòa)",13.09,109.3,"trung"],["Khánh Hoà (Nha Trang)",12.24,109.19,"trung"],["Lâm Đồng (Đà Lạt)",11.94,108.44,"trung"],["Lâm Đồng (Phan Thiết/Mũi Né)",10.93,108.1,"trung"],["Khánh Hoà (Phan Rang)",11.56,108.99,"trung"],
["TP.HCM",10.78,106.7,"nam"],["TP.HCM (Thủ Đức)",10.77,106.73,"nam"],["TP.HCM (Củ Chi)",11.0,106.5,"nam"],["TP.HCM (Cần Giờ)",10.41,106.95,"nam"],["TP.HCM (Vũng Tàu)",10.35,107.08,"nam"],["TP.HCM (Côn Đảo)",8.69,106.61,"nam"],
["Đồng Nai",10.95,106.84,"nam"],["Tây Ninh",11.31,106.1,"nam"],["Cần Thơ",10.03,105.79,"nam"],["Vĩnh Long / Bến Tre",10.25,105.97,"nam"],["Đồng Tháp",10.46,105.63,"nam"],["An Giang (Long Xuyên)",10.38,105.44,"nam"],
["An Giang (Phú Quốc)",10.2,103.96,"nam"],["Cà Mau",9.18,105.15,"nam"]
];

/* ---------- language ---------- */
let lang="vi";
try{const l=localStorage.getItem("racemap-lang");if(l==="vi"||l==="en")lang=l;else if(location.hash==="#en")lang="en";else if(!/^vi/i.test(navigator.language||"vi"))lang="en"}catch(e){}
if(location.hash==="#en")lang="en";
if(location.hash==="#vi")lang="vi";
const I18N={
vi:{
  title:"Bản đồ Race Việt Nam",
  h1:'Bản đồ Race <span>Việt Nam</span> · 13 tháng tới',
  sub:(a,b)=>`Road, trail và các giải khác từ ${a} (1 tháng trước) tới ${b} (13 tháng tới). Bấm cột tháng để lọc, bấm ghim hoặc thẻ để xem chi tiết.`,
  add:"+ Thêm giải",logout:"Thoát quản trị",dark:"☾ Giao diện tối",light:"☀ Giao diện sáng",langBtn:"EN",langAria:"Switch to English",
  legend:"Chú giải",lgRoad:"Road",lgTrail:"Trail / City trail",lgOther:"Băng đồng · Ironman · Fun run",lgEst:"Dự kiến",
  filters:"Bộ lọc",fType:"Loại",fDist:"Cự ly",fRegion:"Miền",fStatus:"Đăng ký",
  all:"Tất cả",other:"Khác",allRegion:"Cả nước",bac:"Bắc",trung:"Trung",nam:"Nam",
  cOpen:"Đang mở",cClosed:"Hết vé",cTbd:"Chưa công bố",cEst:"Dự kiến",
  months:"Lọc theo tháng",mAll:"Đang xem: tất cả các tháng · cột màu = số giải theo loại",mOne:(m,y)=>`Đang xem: tháng ${m}/${y}`,mShowAll:"Xem tất cả tháng",mAria:(l,n)=>`${l}: ${n} giải`,
  mapAria:"Bản đồ Việt Nam với vị trí các giải chạy",zoomAria:"Phóng to theo vùng",zAll:"Toàn quốc",zBac:"Miền Bắc",zTrung:"Miền Trung",zNam:"Miền Nam",
  count:n=>n+" giải",sum:(a,b,c,d,e)=>`${a} road · ${b} trail · ${c} khác · ${d} đang mở đăng ký`+(e?` · ${e} đã diễn ra`:""),
  empty:"Không có giải nào khớp bộ lọc. Thử bỏ bớt điều kiện hoặc chọn tháng khác.",
  group:(m,y)=>`Tháng ${m} · ${y}`,est:"dự kiến",now:"đang diễn ra",tomorrow:"ngày mai",inDays:n=>`còn ${n} ngày`,
  region:r=>"Miền "+({bac:"Bắc",trung:"Trung",nam:"Nam"}[r]||""),edit:"Sửa",site:"Đăng ký ↗",fanpage:"Fanpage ↗",
  st:{open:"Đang mở",closed:"Hết vé / đã đóng",tbd:"Chưa công bố / chưa mở",est:"Dự kiến",done:"Đã diễn ra"},ago:n=>n<=1?"hôm qua":`${n} ngày trước`,cDone:"Đã diễn ra",pastGroup:"Đã diễn ra trong 1 tháng qua",
  MN:["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"],
  isl:["QĐ Hoàng Sa","QĐ Trường Sa"],cities:["Hà Nội","Đà Nẵng","TP.HCM","Đà Lạt","Sa Pa","Nha Trang"],
  foot:u=>`<p style="margin:0 0 6px">Dữ liệu cập nhật lần cuối ${u}. Thông tin được tổng hợp từ nhiều nguồn công khai (trang chính thức của ban tổ chức, cổng bán vé, báo chí) và có thể thay đổi bất cứ lúc nào. Giải ghi "Dự kiến" chưa được ban tổ chức công bố, tháng hiển thị được suy từ lịch năm trước. Vị trí ghim là gần đúng theo tỉnh/thành.</p><p style="margin:0"><b>Miễn trừ trách nhiệm:</b> trang chỉ mang tính tham khảo và không phải kênh chính thức của bất kỳ giải chạy nào. Vui lòng tự kiểm chứng ngày thi đấu, cự ly, lệ phí và trạng thái đăng ký tại trang chính thức của từng giải trước khi đăng ký hoặc thanh toán. Người lập trang không chịu trách nhiệm về sai lệch thông tin hay thiệt hại phát sinh từ việc sử dụng trang này.</p>`,
  admin:"Quản trị",lastLbl:(y,n)=>`Lần gần nhất (${y})${n?": "+n+" VĐV":""}`,nfmt:(n,q)=>(q==="+"?"hơn ":q==="~"?"gần ":"")+n.toLocaleString("vi-VN"),res:"Kết quả",full:"Tra kết quả đầy đủ",resHide:"Ẩn kết quả",dist:"Cự ly",men:"Nhất nam",women:"Nhất nữ",noRes:"Chưa có thông tin người về nhất.",src:"Nguồn",prov:"Kết quả tạm thời theo báo chí.",org:"BTC",orgTitle:"Xem các giải của đơn vị này",orgFilter:"Ban tổ chức",clear:"Bỏ lọc"
},
en:{
  title:"Vietnam Race Map",
  h1:'Vietnam <span>Race Map</span> · next 13 months',
  sub:(a,b)=>`Road, trail and other running events in Vietnam from ${a} (past month) to ${b} (next 13 months). Tap a month bar to filter, tap a pin or card for details.`,
  add:"+ Add race",logout:"Log out",dark:"☾ Dark mode",light:"☀ Light mode",langBtn:"VI",langAria:"Chuyển sang tiếng Việt",
  legend:"Legend",lgRoad:"Road",lgTrail:"Trail / City trail",lgOther:"Cross-country · Ironman · Fun run",lgEst:"Expected",
  filters:"Filters",fType:"Type",fDist:"Distance",fRegion:"Region",fStatus:"Registration",
  all:"All",other:"Other",allRegion:"All Vietnam",bac:"North",trung:"Central",nam:"South",
  cOpen:"Open",cClosed:"Sold out",cTbd:"Not announced",cEst:"Expected",
  months:"Filter by month",mAll:"Showing: all months · bar colours = races by type",mOne:(m,y)=>`Showing: ${m} ${y}`,mShowAll:"Show all months",mAria:(l,n)=>`${l}: ${n} races`,
  mapAria:"Map of Vietnam showing race locations",zoomAria:"Zoom to region",zAll:"All Vietnam",zBac:"North",zTrung:"Central",zNam:"South",
  count:n=>n+(n===1?" race":" races"),sum:(a,b,c,d,e)=>`${a} road · ${b} trail · ${c} other · ${d} open for registration`+(e?` · ${e} finished`:""),
  empty:"No races match these filters. Try removing a filter or picking another month.",
  group:(m,y)=>`${m} ${y}`,est:"expected",now:"happening now",tomorrow:"tomorrow",inDays:n=>`in ${n} days`,
  region:r=>({bac:"North",trung:"Central",nam:"South"}[r]||""),edit:"Edit",site:"Register ↗",fanpage:"Facebook ↗",
  st:{open:"Registration open",closed:"Sold out / closed",tbd:"Not announced yet",est:"Expected",done:"Finished"},ago:n=>n<=1?"yesterday":`${n} days ago`,cDone:"Finished",pastGroup:"Finished in the past month",
  MN:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  isl:["Hoàng Sa Archipelago","Trường Sa Archipelago"],cities:["Hanoi","Da Nang","Ho Chi Minh City","Da Lat","Sa Pa","Nha Trang"],
  foot:u=>`<p style="margin:0 0 6px">Data last updated ${u}. Information is compiled from multiple public sources (organisers' official websites, ticketing platforms, news media) and may change at any time. Races marked "Expected" have not been announced by the organiser yet; the month shown is based on the previous year's calendar. Pin locations are approximate, by province or city.</p><p style="margin:0"><b>Disclaimer:</b> this page is for reference only and is not an official channel of any race. Please verify race dates, distances, fees and registration status on each race's official website before registering or paying. The page author accepts no liability for inaccurate information or any loss arising from use of this page.</p>`,
  admin:"Admin",lastLbl:(y,n)=>`Last edition (${y})${n?": "+n+" runners":""}`,nfmt:(n,q)=>(q==="~"?"~":"")+n.toLocaleString("en-US")+(q==="+"?"+":""),res:"Results",full:"Full results",resHide:"Hide results",dist:"Distance",men:"Men's winner",women:"Women's winner",noRes:"No winner information yet.",src:"Source",prov:"Provisional results reported by the press.",org:"Organiser",orgTitle:"Show all races by this organiser",orgFilter:"Organiser",clear:"Clear"
}};
const t=k=>I18N[lang][k];
const KIND_EN={"Road (đêm)":"Road (night)","Road (tối)":"Road (evening)","Road (đèo)":"Road (mountain pass)","Băng đồng":"Cross-country","Ba môn":"Ironman","Khác":"Other"};
const trKind=k=>lang==="en"?(KIND_EN[k]||k):k;
const trDist=d=>lang==="en"?String(d||"").replace(/nhiều cự ly/i,"multiple distances").replace(/chưa công bố/i,"TBA").replace(/dặm/g,"miles"):d;
const trProv=p=>lang==="en"?String(p||"").replace(/^TP\.HCM/,"Ho Chi Minh City").replace(/^Hà Nội/,"Hanoi"):p;
const trNote=r=>lang==="en"?(r.note_en||""):r.note;

/* ---------- helpers ---------- */
const NS="http://www.w3.org/2000/svg";
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const el=(tg,a={},p)=>{const e=document.createElementNS(NS,tg);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const K=100,C=Math.cos(16*Math.PI/180);
const P=(lon,lat)=>[(lon-102)*K*C,(23.6-lat)*K];
const mKey=d=>d.getFullYear()*12+d.getMonth();
const STATUS_KEYS=["open","closed","tbd","est"];
const REG={bac:"Bắc",trung:"Trung",nam:"Nam"};
const distB=r=>r.max==null||r.max===""?null:(r.max<=21?"s":r.max<=42?"m":"u");
const fmtD=d=>String(d.getDate()).padStart(2,"0");
const mm=d=>String(d.getMonth()+1).padStart(2,"0");
function dateRange(r){const s=toD(r.start),e=toD(r.end);const MN=t("MN");
  if(lang==="en"){if(r.status==="est")return MN[s.getMonth()]+" "+s.getFullYear();if(!e)return s.getDate()+" "+MN[s.getMonth()]+" "+s.getFullYear();return s.getDate()+(s.getMonth()===e.getMonth()?"":" "+MN[s.getMonth()])+"–"+e.getDate()+" "+MN[e.getMonth()]+" "+e.getFullYear()}
  if(r.status==="est")return"Tháng "+(s.getMonth()+1)+"/"+s.getFullYear();if(!e)return fmtD(s)+"/"+mm(s)+"/"+s.getFullYear();return fmtD(s)+(s.getMonth()===e.getMonth()?"":"/"+mm(s))+"–"+fmtD(e)+"/"+mm(e)+"/"+e.getFullYear()}
function slug(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"race"}

const PAST=new Date(TODAY.getFullYear(),TODAY.getMonth()-1,TODAY.getDate());
const FUTURE=new Date(TODAY.getFullYear(),TODAY.getMonth()+13,TODAY.getDate());
const MONTHS=[];for(let d=new Date(PAST.getFullYear(),PAST.getMonth(),1);d<=FUTURE;d=new Date(d.getFullYear(),d.getMonth()+1,1))MONTHS.push(d);
const isPast=r=>toD(r.end||r.start)<TODAY;
const es=r=>isPast(r)?"done":(STATUS_KEYS.includes(r.status)?r.status:"tbd");
const openRes=new Set();
const state={type:"all",dist:"all",region:"all",status:"all",org:null,month:null,sel:null,zoom:"all"};
let canEditPage=false,artifactNS=null,gh=null;

/* ---------- shell ---------- */
$("root").innerHTML=`<div class="wrap">
<header>
  <div>
    <h1 id="h1"></h1>
    <p class="sub" id="sub"></p>
  </div>
  <div class="actions">
    <button type="button" class="btn primary" id="addBtn" data-i="add" hidden></button>
    <button type="button" class="btn" id="logoutBtn" data-i="logout" hidden></button>
    <button type="button" class="btn" id="langBtn"></button>
    <button type="button" class="btn" id="modeBtn" aria-pressed="false"></button>
  </div>
</header>
<div class="legend" data-ia="legend">
  <span><i style="background:var(--road)"></i><span data-i="lgRoad"></span></span>
  <span><i style="background:var(--trail)"></i><span data-i="lgTrail"></span></span>
  <span><i style="background:var(--other)"></i><span data-i="lgOther"></span></span>
  <span><i style="background:transparent;border:1.5px dashed var(--est)"></i><span data-i="lgEst"></span></span>
</div>
<div class="filters" role="group" data-ia="filters">
  <div class="fg" id="fType"><b data-i="fType"></b></div>
  <div class="fg" id="fDist"><b data-i="fDist"></b></div>
  <div class="fg" id="fRegion"><b data-i="fRegion"></b></div>
  <div class="fg" id="fStatus"><b data-i="fStatus"></b></div>
  <div class="fg" id="fOrg" hidden><b data-i="orgFilter"></b><button type="button" class="chip" aria-pressed="true" id="orgChip"></button></div>
</div>
<div>
  <div class="months" id="months" role="group" data-ia="months"></div>
  <div class="mhint"><span id="mlabel"></span><button id="mall" type="button" data-i="mShowAll" hidden></button></div>
</div>
<main>
  <div class="mapbox" id="mapbox">
    <svg id="map" viewBox="0 0 1300 1560" role="img" data-ia="mapAria">
      <path class="land" d="${VNPATH}"/>
      <g id="islands"></g><g id="cities"></g><g id="pins"></g>
    </svg>
    <div class="zoom" role="group" data-ia="zoomAria">
      <button type="button" data-z="all" data-i="zAll" aria-pressed="true"></button>
      <button type="button" data-z="bac" data-i="zBac" aria-pressed="false"></button>
      <button type="button" data-z="trung" data-i="zTrung" aria-pressed="false"></button>
      <button type="button" data-z="nam" data-i="zNam" aria-pressed="false"></button>
    </div>
    <div class="tip" id="tip" hidden></div>
  </div>
  <section class="list" aria-live="polite">
    <div class="lhead"><h2 id="lcount"></h2><span id="lsum"></span><button type="button" class="btn" id="suggestBtn" hidden></button></div>
    <div id="cards"></div>
  </section>
</main>
<footer id="foot"></footer>
<p class="byline">© ${new Date().getFullYear()} xekovo · Bản đồ Race Việt Nam</p>
</div>
<div class="shade" id="shade" hidden></div>
<div class="saving" id="saving" hidden></div>`;

/* theme button */
function paintMode(){root.setAttribute("data-mode",mode);const b=$("modeBtn");b.textContent=mode==="dark"?t("light"):t("dark");b.setAttribute("aria-pressed",String(mode==="dark"))}
$("modeBtn").onclick=()=>{mode=mode==="dark"?"light":"dark";try{localStorage.setItem("racemap-mode",mode)}catch(e){}paintMode()};

function paintMeta(){
  const last=races.map(r=>toD(r.end||r.start)).sort((a,b)=>b-a)[0];
  const MN=t("MN");
  const fd=d=>lang==="en"?d.getDate()+" "+MN[d.getMonth()]+" "+d.getFullYear():`${fmtD(d)}/${mm(d)}/${d.getFullYear()}`;
  const a=fd(PAST);const b=fd(FUTURE);
  $("sub").textContent=t("sub")(a,b);
  $("foot").innerHTML=t("foot")(esc(DATA.updated||""))+(FB.url?`<p style="margin:6px 0 0"><button type="button" class="edit" id="fbLink" style="color:var(--road)">${ft("general")}</button></p>`:"")+(ADMIN_OK&&!gh&&!artifactNS?`<p style="margin:6px 0 0"><button type="button" class="edit" id="adminLink">${t("admin")}</button></p>`:"");
  const al=$("adminLink");if(al)al.onclick=openLogin;const fl=$("fbLink");if(fl)fl.onclick=()=>openFeedback("general");
}

/* filters */
const chipLists=[];
function chips(id,key,opts){const g=$(id);opts.forEach(([v,lk])=>{const b=document.createElement("button");b.type="button";b.className="chip";b.dataset.v=v;b.dataset.lk=lk;b.setAttribute("aria-pressed",String(state[key]===v));b.onclick=()=>{state[key]=v;g.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.v===v)));render()};g.appendChild(b)})}
chips("fType","type",[["all","all"],["road","=Road"],["trail","=Trail"],["other","other"]]);
chips("fDist","dist",[["all","all"],["s","=≤ 21K"],["m","=Marathon 42K"],["u","=Ultra > 42K"]]);
chips("fRegion","region",[["all","allRegion"],["bac","bac"],["trung","trung"],["nam","nam"]]);
chips("fStatus","status",[["all","all"],["open","cOpen"],["closed","cClosed"],["tbd","cTbd"],["est","cEst"],["done","cDone"]]);

const visible=r=>toD(r.end||r.start)>=PAST&&toD(r.start)<=FUTURE;
const baseFilter=r=>visible(r)&&(state.type==="all"||r.type===state.type)&&(state.dist==="all"||distB(r)===state.dist)&&(state.region==="all"||r.region===state.region)&&(state.status==="all"||es(r)===state.status)&&(!state.org||r.org===state.org);
const filtered=()=>races.filter(r=>baseFilter(r)&&(state.month==null||mKey(toD(r.start))===state.month)).sort((a,b)=>toD(a.start)-toD(b.start)||a.name.localeCompare(b.name));

/* static map layers */
function paintMapLabels(){
  const isl=$("islands");isl.innerHTML="";[[112.3,16.5],[114.2,10.2]].forEach(([lo,la],i)=>{const [x,y]=P(lo,la);for(let k=0;k<7;k++)el("circle",{class:"isl",cx:x+Math.cos(k*1.7)*(18+k*4),cy:y+Math.sin(k*2.3)*(14+k*3),r:2.4},isl);el("text",{class:"isltxt",x:x,y:y+44,"text-anchor":"middle","font-size":22},isl).textContent=t("isl")[i]});
  const cities=$("cities");cities.innerHTML="";[[105.85,21.03],[108.22,16.05],[106.7,10.78],[108.44,11.94],[103.84,22.34],[109.19,12.24]].forEach(([lo,la],i)=>{const [x,y]=P(lo,la);el("text",{class:"city",x:x+12,y:y-10,"font-size":18},cities).textContent=t("cities")[i]});
}

const VB={all:[0,0,1300,1560],bac:[150,0,560,560],trung:[380,560,520,760],nam:[180,1100,560,440]};
document.querySelectorAll(".zoom button").forEach(b=>b.onclick=()=>{state.zoom=b.dataset.z;document.querySelectorAll(".zoom button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));$("map").setAttribute("viewBox",VB[state.zoom].join(" "));render()});

function layout(list,scale){const pts=list.map(r=>{const [x,y]=P(+r.lon,+r.lat);return{r,x,y,ox:x,oy:y}});const th=13*scale,used=new Set();pts.forEach((p,i)=>{if(used.has(i))return;const grp=[i];pts.forEach((q,j)=>{if(j>i&&!used.has(j)&&Math.hypot(p.ox-q.ox,p.oy-q.oy)<th)grp.push(j)});if(grp.length>1)grp.forEach((g,k)=>{used.add(g);const ang=k*2.399963,rad=th*0.62*Math.sqrt(k+0.6);pts[g].x=p.ox+Math.cos(ang)*rad;pts[g].y=p.oy+Math.sin(ang)*rad})});return pts}

function renderMonths(){const MN=t("MN");const box=$("months");box.innerHTML="";box.style.setProperty("--mc",MONTHS.length);const base=races.filter(baseFilter);const counts=MONTHS.map(m=>{const k=mKey(m);const rs=base.filter(r=>mKey(toD(r.start))===k);return{k,m,road:rs.filter(r=>r.type==="road").length,trail:rs.filter(r=>r.type==="trail").length,other:rs.filter(r=>r.type==="other").length,n:rs.length}});const mx=Math.max(4,...counts.map(c=>c.n));const h=v=>(v/mx*58).toFixed(1)+"px";counts.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="mbar"+(c.k<mKey(TODAY)?" pastm":c.k===mKey(TODAY)?" nowm":"")+(state.month===c.k?" on":"")+(state.month!=null&&state.month!==c.k?" dim":"");b.setAttribute("aria-pressed",String(state.month===c.k));b.setAttribute("aria-label",t("mAria")(MN[c.m.getMonth()]+" "+c.m.getFullYear(),c.n));b.innerHTML=`<div class="col"><div class="n">${c.n||"–"}</div><div class="stack"><span style="height:${h(c.road)};background:var(--road)"></span><span style="height:${h(c.trail)};background:var(--trail)"></span><span style="height:${h(c.other)};background:var(--other)"></span></div></div><div class="lb">${MN[c.m.getMonth()]}<br>${String(c.m.getFullYear()).slice(2)}</div>`;b.onclick=()=>{state.month=state.month===c.k?null:c.k;render()};box.appendChild(b)});if(state.month==null){$("mlabel").textContent=t("mAll");$("mall").hidden=true}else{const mo=state.month%12,y=Math.floor(state.month/12);$("mlabel").textContent=t("mOne")(lang==="en"?MN[mo]:mo+1,y);$("mall").hidden=false}}
$("mall").onclick=()=>{state.month=null;render()};
$("orgChip").onclick=()=>{state.org=null;render()};

const tip=$("tip"),mapbox=$("mapbox");
function showTip(r,evt){tip.innerHTML=`<b>${esc(r.name)}</b>${esc(dateRange(r))} · ${esc(trDist(r.dist))}<br>${esc(trProv(r.prov))}${r.org?" · "+esc(r.org):""}`;tip.hidden=false;const bb=mapbox.getBoundingClientRect();let x=evt.clientX-bb.left+12,y=evt.clientY-bb.top+12;if(x>bb.width-230)x-=240;tip.style.left=x+"px";tip.style.top=y+"px"}

function renderPins(list){const g=$("pins");g.innerHTML="";const scale=VB[state.zoom][2]/1300*2;const pts=layout(list,scale);pts.sort((a,b)=>(a.r.id===state.sel)-(b.r.id===state.sel));pts.forEach(p=>{const r=p.r;const gg=el("g",{class:"pin"+(r.status==="est"?" est":"")+(isPast(r)?" past":""),tabindex:"0",role:"button","aria-label":r.name},g);const mx=+r.max;const rad=(mx>42?9:mx===42?7.5:6)*scale;if(p.x!==p.ox||p.y!==p.oy)el("line",{x1:p.ox,y1:p.oy,x2:p.x,y2:p.y,stroke:"var(--landEdge)","stroke-width":1,"vector-effect":"non-scaling-stroke"},gg);el("circle",{class:"core",cx:p.x,cy:p.y,r:rad,fill:`var(--${r.type})`},gg);if(r.id===state.sel)el("circle",{class:"ring",cx:p.x,cy:p.y,r:rad+5*scale},gg);gg.addEventListener("mousemove",e=>showTip(r,e));gg.addEventListener("mouseleave",()=>tip.hidden=true);gg.addEventListener("click",()=>select(r.id,true));gg.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(r.id,true)}})})}

function renderCards(list){const MN=t("MN");const box=$("cards");box.innerHTML="";$("lcount").textContent=t("count")(list.length);$("lsum").textContent=t("sum")(list.filter(r=>r.type==="road").length,list.filter(r=>r.type==="trail").length,list.filter(r=>r.type==="other").length,list.filter(r=>es(r)==="open").length,list.filter(isPast).length);if(!list.length){box.innerHTML=`<div class="empty">${t("empty")}</div>`;return}let lastM=null;list.forEach(r=>{const s=toD(r.start),e=toD(r.end);const k=mKey(s);if(k!==lastM){lastM=k;const h=document.createElement("div");h.className="mgroup";h.textContent=t("group")(lang==="en"?MN[s.getMonth()]:s.getMonth()+1,s.getFullYear());box.appendChild(h)}const c=document.createElement("article");c.className="card"+(r.id===state.sel?" sel":"")+(isPast(r)?" past":"");c.id="c-"+r.id;c.tabIndex=0;c.style.setProperty("--c",`var(--${r.type})`);const dt=Math.round((s-TODAY)/864e5);const past=isPast(r);const ago=Math.round((TODAY-toD(r.end||r.start))/864e5);const cd=past?t("ago")(ago):r.status==="est"?t("est"):dt<=0?t("now"):dt===1?t("tomorrow"):t("inDays")(dt);const sk=es(r);const note=trNote(r);c.innerHTML=`<div class="date">${r.status==="est"?`<span class="d">${lang==="en"?MN[s.getMonth()]:"T"+(s.getMonth()+1)}</span><span class="m">${s.getFullYear()}</span>`:`<span class="d">${fmtD(s)}${e?"<small>–"+fmtD(e)+"</small>":""}</span><span class="m">${MN[s.getMonth()]} · ${String(s.getFullYear()).slice(2)}</span>`}<span class="cd">${cd}</span></div><div class="info"><h3>${esc(r.name)}</h3><div class="meta"><span>${esc(trProv(r.prov))}</span><span>${t("region")(r.region)}</span><span>${esc(dateRange(r))}</span>${r.org?`<span>${t("org")}: <button type="button" class="edit orglink" data-org="${esc(r.org)}" title="${esc(t("orgTitle"))}">${esc(r.org)}</button></span>`:""}</div><div class="tags"><span class="tag t">${esc(trKind(r.kind))}</span><span class="tag">${esc(trDist(r.dist))}</span><span class="st ${sk}">${t("st")[sk]}</span><span class="links">${canEditPage?`<button type="button" class="edit" data-edit="${esc(r.id)}">${t("edit")}</button>`:""}${FB.url?`<button type="button" class="edit" data-report="${esc(r.id)}">${ft("report")}</button>`:""}${r.fb?`<a href="${esc(r.fb)}" target="_blank" rel="noopener">${t("fanpage")}</a>`:""}${r.link?`<a href="${esc(r.link)}" target="_blank" rel="noopener">${t("site")}</a>`:""}</span></div>${note?`<div class="note">${esc(note)}</div>`:""}${lastHtml(r)}</div>`;c.onclick=ev=>{if(ev.target.closest("a"))return;const ed=ev.target.closest("[data-edit]");if(ed){openEditor(ed.dataset.edit);return}const rs=ev.target.closest("[data-res]");if(rs){const id=rs.dataset.res;openRes.has(id)?openRes.delete(id):openRes.add(id);render();return}if(ev.target.closest(".res"))return;const og=ev.target.closest("[data-org]");if(og){setOrg(og.dataset.org);return}const rp=ev.target.closest("[data-report]");if(rp){openFeedback("report",rp.dataset.report);return}select(r.id,false)};c.onkeydown=ev=>{if(ev.key==="Enter"&&ev.target===c)select(r.id,false)};box.appendChild(c)})}

function lastHtml(r){const L=r.last;if(!L||!L.y)return"";const n=L.n?t("nfmt")(+L.n,L.q):"";const w0=0;const w=Array.isArray(L.w)?L.w.filter(x=>x&&(x[1]||x[3])):[];const open=openRes.has(r.id);
  const cell=(nm,tm)=>nm?`${esc(nm)}${tm?` <b>${esc(tm)}</b>`:""}`:"—";
  let h=`<div class="last"><span>${t("lastLbl")(L.y,n)}</span>${w.length?`<button type="button" class="edit" data-res="${esc(r.id)}" aria-expanded="${open}">${open?t("resHide")+" ▴":t("res")+" ▾"}</button>`:""}${L.full?`<a href="${esc(L.full)}" target="_blank" rel="noopener">${t("full")} ↗</a>`:""}${!w.length&&L.src?`<a href="${esc(L.src)}" target="_blank" rel="noopener">${t("src")} ↗</a>`:""}</div>`;
  if(w.length&&open){h+=`<div class="res"><div class="restbl"><table><thead><tr><th>${t("dist")}</th><th>${t("men")}</th><th>${t("women")}</th></tr></thead><tbody>${w.map(x=>`<tr><td>${esc(x[0])}</td><td>${cell(x[1],x[2])}</td><td>${cell(x[3],x[4])}</td></tr>`).join("")}</tbody></table></div><div class="resnote">${L.prov?t("prov")+" ":""}${L.src?`<a href="${esc(L.src)}" target="_blank" rel="noopener">${t("src")} ↗</a>`:""}</div></div>`}
  return h}
function select(id,fromMap){state.sel=state.sel===id?null:id;render();if(state.sel==null)return;if(fromMap){const c=$("c-"+id);if(c)c.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})}else if(innerWidth<=860){mapbox.scrollIntoView({behavior:"smooth",block:"start"})}}

function paintOrg(){const g=$("fOrg");g.hidden=!state.org;if(state.org){const c=$("orgChip");c.textContent=state.org+"  ✕";c.setAttribute("aria-label",t("clear")+": "+state.org)}}
function setOrg(o){state.org=state.org===o?null:o;state.month=null;render();const top=$("fOrg");if(state.org&&top)top.scrollIntoView({behavior:"smooth",block:"center"})}
function render(){paintOrg();const list=filtered();if(state.sel!=null&&!list.some(r=>r.id===state.sel))state.sel=null;renderMonths();renderPins(list);renderCards(list)}

function applyLang(){
  root.setAttribute("lang",lang);document.title=t("title");
  $("h1").innerHTML=t("h1");
  document.querySelectorAll("[data-i]").forEach(e=>{e.textContent=t(e.dataset.i)});
  document.querySelectorAll("[data-ia]").forEach(e=>{e.setAttribute("aria-label",t(e.dataset.ia))});
  document.querySelectorAll(".chip[data-lk]").forEach(b=>{const k=b.dataset.lk;b.textContent=k[0]==="="?k.slice(1):t(k)});
  const lb=$("langBtn");lb.textContent=t("langBtn");lb.setAttribute("aria-label",t("langAria"));lb.setAttribute("lang",lang==="vi"?"en":"vi");
  paintMode();paintMapLabels();paintFeedback();paintMeta();render();
}
$("langBtn").onclick=()=>{lang=lang==="vi"?"en":"vi";try{localStorage.setItem("racemap-lang",lang)}catch(e){}applyLang()};

/* ---------- editor (owner/editors only) ---------- */
const shade=$("shade");
function opt(v,l,cur){return `<option value="${esc(v)}"${String(v)===String(cur)?" selected":""}>${esc(l)}</option>`}
function openEditor(id){
  const r=id?races.find(x=>x.id===id):null;
  const v=r||{name:"",start:"",end:"",type:"road",kind:"Road",dist:"5–42K",max:42,prov:"",region:"nam",lat:"",lon:"",status:"open",link:"",note:""};
  const placeIdx=PLACES.findIndex(p=>Math.abs(p[1]-v.lat)<0.02&&Math.abs(p[2]-v.lon)<0.02);
  shade.innerHTML=`<form class="drawer" id="edForm" role="dialog" aria-modal="true" aria-labelledby="edTitle" novalidate>
  <h2 id="edTitle">${r?"Sửa giải":"Thêm giải mới"}</h2>
  <div class="fgrid">
    <div class="field full"><label for="f-name">Tên giải</label><input id="f-name" required value="${esc(v.name)}" placeholder="VD: Techcombank HCMC International Marathon"></div>
    <div class="field"><label for="f-start">Ngày bắt đầu</label><input id="f-start" type="date" required value="${esc(v.start)}"></div>
    <div class="field"><label for="f-end">Ngày kết thúc</label><input id="f-end" type="date" value="${esc(v.end||"")}"><small>Để trống nếu chạy 1 ngày</small></div>
    <div class="field"><label for="f-type">Loại (màu ghim)</label><select id="f-type">${opt("road","Road",v.type)}${opt("trail","Trail / City trail",v.type)}${opt("other","Khác (băng đồng, Ironman, fun run)",v.type)}</select></div>
    <div class="field"><label for="f-kind">Nhãn hiển thị</label><input id="f-kind" value="${esc(v.kind)}" placeholder="Road, Road (đêm), City trail…"></div>
    <div class="field"><label for="f-dist">Các cự ly</label><input id="f-dist" value="${esc(v.dist)}" placeholder="5–42K"></div>
    <div class="field"><label for="f-max">Cự ly dài nhất (km)</label><input id="f-max" type="number" min="0" step="0.1" value="${v.max==null?"":esc(v.max)}"><small>Dùng cho bộ lọc cự ly</small></div>
    <div class="field full"><label for="f-place">Địa điểm (đặt ghim)</label><select id="f-place">${opt("","— Tự nhập tọa độ —",placeIdx<0?"":"x")}${PLACES.map((p,i)=>opt(i,p[0],placeIdx===i?i:"x")).join("")}</select></div>
    <div class="field full"><label for="f-prov">Tên địa điểm hiển thị</label><input id="f-prov" value="${esc(v.prov)}" placeholder="TP.HCM (Thủ Đức)"></div>
    <div class="field"><label for="f-lat">Vĩ độ</label><input id="f-lat" type="number" step="0.0001" value="${esc(v.lat)}"></div>
    <div class="field"><label for="f-lon">Kinh độ</label><input id="f-lon" type="number" step="0.0001" value="${esc(v.lon)}"></div>
    <div class="field"><label for="f-region">Miền</label><select id="f-region">${opt("bac","Bắc",v.region)}${opt("trung","Trung",v.region)}${opt("nam","Nam",v.region)}</select></div>
    <div class="field"><label for="f-status">Đăng ký</label><select id="f-status">${STATUS_KEYS.map(k=>opt(k,I18N.vi.st[k],v.status)).join("")}</select></div>
    <div class="field full"><label for="f-org">Đơn vị tổ chức</label><input id="f-org" list="orgList" value="${esc(v.org||"")}" placeholder="VD: VietRace365"><datalist id="orgList">${[...new Set(races.map(x=>x.org).filter(Boolean))].sort().map(o=>`<option value="${esc(o)}">`).join("")}</datalist></div>
    <div class="field full"><label for="f-link">Trang đăng ký chính thức</label><input id="f-link" type="url" value="${esc(v.link)}" placeholder="https://"></div>
    <div class="field full"><label for="f-fb">Fanpage chính thức</label><input id="f-fb" type="url" value="${esc(v.fb||"")}" placeholder="https://www.facebook.com/…"><small>Chỉ dán fanpage đã kiểm chứng, nhiều giải có trang giả mạo</small></div>
    <div class="field"><label for="f-ly">Năm tổ chức gần nhất</label><input id="f-ly" type="number" min="2000" max="2100" value="${esc((v.last&&v.last.y)||"")}"></div>
    <div class="field"><label for="f-ln">Số VĐV lần đó</label><input id="f-ln" type="number" min="0" value="${esc((v.last&&v.last.n)||"")}"><small>Để trống nếu chưa rõ</small></div>
    <div class="field full"><label for="f-lq">Cách ghi số VĐV</label><select id="f-lq">${opt("","Đúng số",(v.last&&v.last.q)||"")}${opt("+","Hơn …",(v.last&&v.last.q)||"")}${opt("~","Gần / khoảng …",(v.last&&v.last.q)||"")}</select></div>
    <div class="field full"><label for="f-lw">Người về nhất (mỗi cự ly một dòng)</label><textarea id="f-lw" style="min-height:90px;font-family:ui-monospace,monospace;font-size:12.5px" placeholder="42K | Huỳnh Anh Khôi | 2:25:15 | Phạm Thị Hồng Lệ | 2:53:57">${esc(((v.last&&v.last.w)||[]).map(x=>x.join(" | ")).join("\n"))}</textarea><small>Cự ly | Nhất nam | Thời gian | Nhất nữ | Thời gian. Bỏ trống ô nào chưa rõ.</small></div>
    <div class="field full"><label for="f-ls">Nguồn kết quả (link bài báo)</label><input id="f-ls" type="url" value="${esc((v.last&&v.last.src)||"")}" placeholder="https://"></div>
    <div class="field full"><label for="f-lf">Trang tra kết quả đầy đủ (vd. sportstats.one)</label><input id="f-lf" type="url" value="${esc((v.last&&v.last.full)||"")}" placeholder="https://sportstats.one/vi/event/…"></div>
    <div class="field full"><label for="f-note">Ghi chú ngắn (tiếng Việt)</label><textarea id="f-note">${esc(v.note)}</textarea></div>
    <div class="field full"><label for="f-note-en">Ghi chú tiếng Anh (cho khách nước ngoài)</label><textarea id="f-note-en" placeholder="VD: AIMS-certified, good for a PR">${esc(v.note_en||"")}</textarea><small>Để trống thì bản tiếng Anh không hiện ghi chú</small></div>
  </div>
  <div class="msg" id="edMsg" role="status"></div>
  <div class="confirm" id="edConfirm" hidden><span>Xóa giải này khỏi bản đồ?</span><button type="button" class="btn danger" id="edYes">Xóa hẳn</button><button type="button" class="btn" id="edNo">Không</button></div>
  <div class="dact">${r?`<button type="button" class="btn danger" id="edDel">Xóa</button>`:""}<span class="sp"></span><button type="button" class="btn" id="edCancel">Hủy</button><button type="submit" class="btn primary" id="edSave">Lưu vào bản đồ</button></div>
</form>`;
  shade.hidden=false;
  const f=$("edForm");
  $("f-place").onchange=e=>{const p=PLACES[+e.target.value];if(!p)return;$("f-lat").value=p[1];$("f-lon").value=p[2];$("f-region").value=p[3];if(!$("f-prov").value)$("f-prov").value=p[0]};
  $("f-type").onchange=e=>{const k=$("f-kind");if(["Road","Trail","Khác",""].includes(k.value))k.value={road:"Road",trail:"Trail",other:"Khác"}[e.target.value]};
  $("edCancel").onclick=closeEditor;
  shade.onclick=e=>{if(e.target===shade)closeEditor()};
  if(r){$("edDel").onclick=()=>{$("edConfirm").hidden=false;$("edYes").focus()};$("edNo").onclick=()=>{$("edConfirm").hidden=true};$("edYes").onclick=()=>save(races.filter(x=>x.id!==r.id),"Đã xóa","Xóa giải: "+r.name)}
  f.onsubmit=e=>{e.preventDefault();const msg=$("edMsg");msg.className="msg err";
    const name=$("f-name").value.trim(),start=$("f-start").value,end=$("f-end").value,lat=parseFloat($("f-lat").value),lon=parseFloat($("f-lon").value);
    if(!name){msg.textContent="Nhập tên giải.";$("f-name").focus();return}
    if(!start){msg.textContent="Chọn ngày bắt đầu.";$("f-start").focus();return}
    if(end&&end<start){msg.textContent="Ngày kết thúc phải sau ngày bắt đầu.";$("f-end").focus();return}
    if(!(lat>=8&&lat<=23.5&&lon>=102&&lon<=117)){msg.textContent="Chọn địa điểm trong danh sách hoặc nhập tọa độ trong lãnh thổ Việt Nam.";$("f-place").focus();return}
    const maxv=$("f-max").value===""?null:+$("f-max").value;
    const rec={id:r?r.id:uniqueId(name,start),name,start,end:end||null,type:$("f-type").value,kind:$("f-kind").value.trim()||"Road",dist:$("f-dist").value.trim(),max:maxv,prov:$("f-prov").value.trim()||"—",region:$("f-region").value,lat,lon,status:$("f-status").value,link:$("f-link").value.trim(),fb:$("f-fb").value.trim(),org:$("f-org").value.trim(),note:$("f-note").value.trim(),note_en:$("f-note-en").value.trim()};
    {const ly=+$("f-ly").value;if(ly){const w=$("f-lw").value.split("\n").map(l=>l.split("|").map(x=>x.trim())).filter(a=>a[0]).map(a=>[a[0],a[1]||"",a[2]||"",a[3]||"",a[4]||""]);rec.last={y:ly,n:$("f-ln").value?+$("f-ln").value:null,q:$("f-lq").value,src:$("f-ls").value.trim(),full:$("f-lf").value.trim(),w};if(r&&r.last&&r.last.prov&&r.last.y===ly)rec.last.prov=1}}
    const next=r?races.map(x=>x.id===r.id?rec:x):races.concat([rec]);
    save(next,r?"Đã lưu thay đổi":"Đã thêm giải",(r?"Sửa giải: ":"Thêm giải: ")+name);
  };
  $("f-name").focus();
}
function uniqueId(name,start){let base=slug(name)+"-"+start.slice(0,4),id=base,i=2;while(races.some(x=>x.id===id))id=base+"-"+i++;return id}
function closeEditor(){shade.hidden=true;shade.innerHTML=""}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!shade.hidden)closeEditor()});
$("addBtn").onclick=()=>openEditor(null);

/* ---------- save = republish the page with new data ---------- */
function buildDoc(list){
  const d=new Date();const stamp=fmtD(d)+"/"+mm(d)+"/"+d.getFullYear();
  const json=JSON.stringify({updated:stamp,races:list}).replace(/</g,"\\u003c");
  const S="scr"+"ipt";
  return "<!doctype html><html><head><meta charset=utf8><meta name=viewport content=\"width=device-width,initial-scale=1,viewport-fit=cover\"><style>"+((document.head&&document.head.querySelector("style"))||{textContent:""}).textContent+"</style></head><body>"
   +"<title>Bản đồ Race Việt Nam</title>\n"
   +'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap">\n'
   +'<style id="css">'+$("css").textContent+"</style>\n"
   +'<div id="root"></div>\n'
   +"<"+S+' type="text/plain" id="vnpath">'+VNPATH+"</"+S+">\n"
   +"<"+S+' type="application/json" id="data">'+json+"</"+S+">\n"
   +"<"+S+' id="app">'+$("app").textContent+"</"+S+">\n"
   +"</body></html>";
}
async function save(list,okText,label){
  const btns=shade.querySelectorAll("button");btns.forEach(b=>b.disabled=true);
  const sv=$("saving");sv.textContent="Đang lưu…";sv.hidden=false;
  const fail=t=>{sv.hidden=true;btns.forEach(b=>b.disabled=false);const msg=$("edMsg");if(msg){msg.className="msg err";msg.textContent=t}};
  if(gh){
    try{
      await ghSave(list,label||okText);
      races=list;paintMeta();render();closeEditor();
      sv.textContent=okText+" · website cập nhật sau 1–2 phút";setTimeout(()=>{sv.hidden=true},4000);
    }catch(e){
      if(e.status===409||e.status===422){await ghLoad().catch(()=>{});render();fail("Dữ liệu vừa được sửa ở nơi khác. Mình đã tải bản mới nhất, bạn đóng form và thao tác lại nhé.")}
      else if(e.status===401){fail("Token hết hạn hoặc sai. Bấm Thoát quản trị rồi đăng nhập lại.")}
      else if(e.status===403||e.status===404){fail("Token không có quyền ghi vào repo race-map (cần Contents: Read and write).")}
      else fail("Chưa lưu được ("+(e.status||e.message||"lỗi mạng")+"). Thử lại sau ít phút.");
    }
    return;
  }
  if(!artifactNS){fail("Chưa đăng nhập quản trị.");return}
  try{await artifactNS.publish(buildDoc(list));sv.textContent=okText+" · đang tải lại"}
  catch(e){const code=e&&e.code;
    if(code==="conflict")fail("Vừa có người lưu bản khác trước bạn. Trang sẽ tải lại bản mới nhất, bạn nhập lại thay đổi nhé.");
    else if(code==="not_writer"||code==="not_granted"){fail("Bạn chỉ có quyền xem trang này nên không lưu được.");canEditPage=false;$("addBtn").hidden=true}
    else fail("Chưa lưu được ("+(code||"lỗi không rõ")+"). Thử lại sau ít phút.")}
}

/* ---------- admin on the website: commit races.json through the GitHub API ---------- */
const GH={owner:"tuhocvachiase-cyber",repo:"race-map",path:"races.json",branch:"main"};
const GH_KEY="racemap-gh-token";
const ADMIN_OK=/github\.io$/.test(location.hostname)||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)||location.hash==="#admin";
const b64dec=c=>new TextDecoder().decode(Uint8Array.from(atob(c.replace(/\s/g,"")),ch=>ch.charCodeAt(0)));
const b64enc=str=>{const bytes=new TextEncoder().encode(str);let bin="";for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));return btoa(bin)};
async function ghApi(method,body){
  const r=await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.path}`+(method==="GET"?`?ref=${GH.branch}&t=${Date.now()}`:""),{method,headers:{Authorization:"Bearer "+gh.token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},body:body?JSON.stringify(body):undefined,cache:"no-store"});
  if(!r.ok){const e=new Error("HTTP "+r.status);e.status=r.status;throw e}
  return r.json();
}
async function ghLoad(){const j=await ghApi("GET");gh.sha=j.sha;const data=JSON.parse(b64dec(j.content));if(Array.isArray(data.races)){races=data.races;if(data.updated)DATA.updated=data.updated;races.forEach(r=>{if(!r.id)r.id=uniqueId(r.name,r.start)})}}
function serialize(list,stamp){return '{\n"updated": '+JSON.stringify(stamp)+',\n"races": [\n'+list.map(r=>JSON.stringify(r)).join(",\n")+"\n]}\n"}
async function ghSave(list,label){
  const d=new Date();const stamp=fmtD(d)+"/"+mm(d)+"/"+d.getFullYear();
  const res=await ghApi("PUT",{message:label,content:b64enc(serialize(list,stamp)),sha:gh.sha,branch:GH.branch});
  gh.sha=res.content.sha;DATA.updated=stamp;
}
function adminOn(){canEditPage=true;$("addBtn").hidden=false;$("logoutBtn").hidden=!gh;paintMeta();render()}
$("logoutBtn").onclick=()=>{try{localStorage.removeItem(GH_KEY)}catch(e){}gh=null;canEditPage=!!artifactNS;$("addBtn").hidden=!canEditPage;$("logoutBtn").hidden=true;paintMeta();render()};
function openLogin(){
  shade.innerHTML=`<form class="drawer" id="lgForm" role="dialog" aria-modal="true" aria-labelledby="lgTitle" novalidate>
  <h2 id="lgTitle">Đăng nhập quản trị</h2>
  <p class="note" style="margin:0">Trang lưu dữ liệu bằng cách ghi file <b>races.json</b> vào repo GitHub <b>${GH.owner}/${GH.repo}</b>. Bạn cần một token GitHub chỉ có quyền với repo này.</p>
  <ol class="note" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px">
    <li>Mở <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style="color:var(--road)">tạo Fine-grained token</a>.</li>
    <li>Repository access: <b>Only select repositories</b> → chọn <b>${GH.repo}</b>.</li>
    <li>Permissions → Repository → <b>Contents: Read and write</b>.</li>
    <li>Generate token, chép chuỗi bắt đầu bằng <code>github_pat_</code> dán vào dưới.</li>
  </ol>
  <div class="field"><label for="lg-token">Token GitHub</label><input id="lg-token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></div>
  <label class="note" style="display:flex;gap:8px;align-items:center;margin:0"><input type="checkbox" id="lg-remember" checked> Ghi nhớ trên trình duyệt này (chỉ dùng trên máy riêng)</label>
  <div class="msg" id="edMsg" role="status"></div>
  <div class="dact"><span class="sp"></span><button type="button" class="btn" id="edCancel">Hủy</button><button type="submit" class="btn primary" id="lgGo">Đăng nhập</button></div>
</form>`;
  shade.hidden=false;
  $("edCancel").onclick=closeEditor;shade.onclick=e=>{if(e.target===shade)closeEditor()};
  $("lgForm").onsubmit=async e=>{e.preventDefault();const t=$("lg-token").value.trim();const msg=$("edMsg");msg.className="msg";
    if(!t){msg.className="msg err";msg.textContent="Dán token vào ô trên.";return}
    msg.textContent="Đang kiểm tra…";$("lgGo").disabled=true;
    const ok=await connectGH(t);
    if(!ok){$("lgGo").disabled=false;msg.className="msg err";msg.textContent=ghErr;return}
    if($("lg-remember").checked){try{localStorage.setItem(GH_KEY,t)}catch(e2){}}
    closeEditor();const sv=$("saving");sv.textContent="Đã vào chế độ quản trị";sv.hidden=false;setTimeout(()=>{sv.hidden=true},2500)};
  $("lg-token").focus();
}
let ghErr="";
async function connectGH(token){
  gh={token,sha:null};
  try{await ghLoad();
    const r=await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}`,{headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json"}});
    const j=r.ok?await r.json():null;
    if(j&&j.permissions&&!j.permissions.push){gh=null;ghErr="Token này chỉ đọc được, chưa có quyền ghi (Contents: Read and write).";return false}
    adminOn();return true}
  catch(e){gh=null;ghErr=e.status===401?"Token không đúng hoặc đã hết hạn.":e.status===404||e.status===403?"Token không truy cập được repo "+GH.repo+". Kiểm tra lại mục Repository access.":"Không kết nối được GitHub ("+(e.status||"mạng")+").";return false}
}

/* ---------- feedback: sends to a Google Apps Script web app (URL in config.json) ---------- */
const FB={url:""};
const FBT={
vi:{report:"Báo sai",suggest:"+ Đề xuất giải",general:"Góp ý cho trang",
  tReport:"Báo thông tin sai",tSuggest:"Đề xuất giải mới",tGeneral:"Góp ý cho trang",
  race:"Giải",issue:"Sai ở đâu?",issues:{date:"Sai ngày thi đấu",closed:"Đã hết vé / đóng đăng ký",opened:"Đã mở đăng ký",dist:"Sai cự ly",place:"Sai địa điểm",link:"Link hỏng / sai link",org:"Sai đơn vị tổ chức",cancel:"Giải bị hủy / hoãn",other:"Khác"},
  detail:"Thông tin đúng là gì?",detailPh:"VD: BTC đã dời sang 22/11, xem fanpage…",
  nName:"Tên giải",nDate:"Ngày thi đấu",nDatePh:"VD: 15/03/2027 hoặc tháng 3/2027",nPlace:"Địa điểm",nPlacePh:"Tỉnh/thành, VD: Đà Lạt",nLink:"Link trang giải / đăng ký",nMsg:"Thêm thông tin (cự ly, loại road/trail…)",
  msg:"Nội dung góp ý",contact:"Liên hệ (không bắt buộc)",contactPh:"Email hoặc Zalo",contactNote:"Chỉ dùng để hỏi lại khi cần, không công khai.",
  send:"Gửi góp ý",cancel:"Hủy",sending:"Đang gửi…",close:"Đóng",
  thanks:"Cảm ơn bạn!",thanksBody:"Góp ý đã được gửi. Thông tin sẽ được kiểm tra trước khi cập nhật lên bản đồ.",
  errReq:"Vui lòng điền các ô bắt buộc.",errRate:"Bạn vừa gửi khá nhiều góp ý. Thử lại sau ít phút nhé.",errNet:"Chưa gửi được. Kiểm tra mạng rồi thử lại."},
en:{report:"Report error",suggest:"+ Suggest a race",general:"Send feedback",
  tReport:"Report incorrect info",tSuggest:"Suggest a new race",tGeneral:"Feedback about this page",
  race:"Race",issue:"What is wrong?",issues:{date:"Wrong race date",closed:"Sold out / registration closed",opened:"Registration now open",dist:"Wrong distances",place:"Wrong location",link:"Broken or wrong link",org:"Wrong organiser",cancel:"Race cancelled / postponed",other:"Other"},
  detail:"What is the correct information?",detailPh:"e.g. The organiser moved it to 22 Nov, see their Facebook page…",
  nName:"Race name",nDate:"Race date",nDatePh:"e.g. 15/03/2027 or March 2027",nPlace:"Location",nPlacePh:"Province or city, e.g. Da Lat",nLink:"Race / registration website",nMsg:"More details (distances, road or trail…)",
  msg:"Your feedback",contact:"Contact (optional)",contactPh:"Email or phone",contactNote:"Only used to follow up if needed. Never published.",
  send:"Send",cancel:"Cancel",sending:"Sending…",close:"Close",
  thanks:"Thank you!",thanksBody:"Your feedback has been sent. It will be checked before the map is updated.",
  errReq:"Please fill in the required fields.",errRate:"You have sent several messages just now. Please try again in a few minutes.",errNet:"Could not send. Check your connection and try again."}};
const ft=k=>FBT[lang][k];
function fbCid(){let c=null;try{c=localStorage.getItem("racemap-cid");if(!c){c=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem("racemap-cid",c)}}catch(e){}return c||"anon"}
function fbRateOk(){try{const now=Date.now();const a=JSON.parse(localStorage.getItem("racemap-fb")||"[]").filter(x=>now-x<600000);if(a.length>=5)return false;a.push(now);localStorage.setItem("racemap-fb",JSON.stringify(a))}catch(e){}return true}
function openFeedback(kind,raceId){
  const r=raceId?races.find(x=>x.id===raceId):null;
  const req='<span aria-hidden="true" style="color:var(--closed)"> *</span>';
  let body="";
  if(kind==="report"){
    body=`<div class="field full"><label>${ft("race")}</label><div style="font-weight:600">${esc(r?r.name:"")}<div class="note" style="margin:2px 0 0">${esc(r?dateRange(r)+" · "+trProv(r.prov):"")}</div></div></div>
    <div class="field full"><label for="fb-issue">${ft("issue")}${req}</label><select id="fb-issue">${Object.entries(ft("issues")).map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join("")}</select></div>
    <div class="field full"><label for="fb-msg">${ft("detail")}</label><textarea id="fb-msg" maxlength="1500" placeholder="${esc(ft("detailPh"))}"></textarea></div>`;
  }else if(kind==="suggest"){
    body=`<div class="field full"><label for="fb-name">${ft("nName")}${req}</label><input id="fb-name" maxlength="200"></div>
    <div class="field"><label for="fb-date">${ft("nDate")}${req}</label><input id="fb-date" maxlength="40" placeholder="${esc(ft("nDatePh"))}"></div>
    <div class="field"><label for="fb-place">${ft("nPlace")}${req}</label><input id="fb-place" maxlength="200" placeholder="${esc(ft("nPlacePh"))}"></div>
    <div class="field full"><label for="fb-link">${ft("nLink")}</label><input id="fb-link" type="url" maxlength="500" placeholder="https://"></div>
    <div class="field full"><label for="fb-msg">${ft("nMsg")}</label><textarea id="fb-msg" maxlength="1500"></textarea></div>`;
  }else{
    body=`<div class="field full"><label for="fb-msg">${ft("msg")}${req}</label><textarea id="fb-msg" maxlength="2000" style="min-height:110px"></textarea></div>`;
  }
  shade.innerHTML=`<form class="drawer" id="fbForm" role="dialog" aria-modal="true" aria-labelledby="fbTitle" novalidate>
  <h2 id="fbTitle">${ft(kind==="report"?"tReport":kind==="suggest"?"tSuggest":"tGeneral")}</h2>
  <div class="fgrid">${body}
    <div class="field full"><label for="fb-contact">${ft("contact")}</label><input id="fb-contact" maxlength="200" autocomplete="email" placeholder="${esc(ft("contactPh"))}"><small>${ft("contactNote")}</small></div>
    <div style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><label for="fb-website">Website</label><input id="fb-website" tabindex="-1" autocomplete="off"></div>
  </div>
  <div class="msg" id="edMsg" role="status"></div>
  <div class="dact"><span class="sp"></span><button type="button" class="btn" id="edCancel">${ft("cancel")}</button><button type="submit" class="btn primary" id="fbSend">${ft("send")}</button></div>
</form>`;
  shade.hidden=false;
  $("edCancel").onclick=closeEditor;shade.onclick=e=>{if(e.target===shade)closeEditor()};
  const v=id=>{const e=$(id);return e?e.value.trim():""};
  $("fbForm").onsubmit=async e=>{e.preventDefault();const msg=$("edMsg");msg.className="msg err";
    const data={kind,lang,cid:fbCid(),page:location.href.slice(0,300),website:v("fb-website"),contact:v("fb-contact"),message:v("fb-msg")};
    if(kind==="report"){Object.assign(data,{raceId:r.id,raceName:r.name,issue:$("fb-issue").value});if(data.issue==="other"&&!data.message){msg.textContent=ft("errReq");$("fb-msg").focus();return}}
    else if(kind==="suggest"){Object.assign(data,{newName:v("fb-name"),newDate:v("fb-date"),newPlace:v("fb-place"),newLink:v("fb-link")});if(!data.newName||!data.newDate||!data.newPlace){msg.textContent=ft("errReq");return}}
    else if(!data.message){msg.textContent=ft("errReq");$("fb-msg").focus();return}
    if(!fbRateOk()){msg.textContent=ft("errRate");return}
    const btn=$("fbSend");btn.disabled=true;btn.textContent=ft("sending");msg.className="msg";msg.textContent="";
    try{
      const res=await fetch(FB.url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
      const j=await res.json().catch(()=>({ok:res.ok}));
      if(!j.ok)throw new Error(j.error||"fail");
      $("fbForm").innerHTML=`<h2>${ft("thanks")}</h2><p style="margin:0">${ft("thanksBody")}</p><div class="dact"><span class="sp"></span><button type="button" class="btn primary" id="edCancel">${ft("close")}</button></div>`;
      $("edCancel").onclick=closeEditor;$("edCancel").focus();
    }catch(err){btn.disabled=false;btn.textContent=ft("send");msg.className="msg err";msg.textContent=String(err&&err.message)==="rate"?ft("errRate"):ft("errNet")}
  };
  const first=shade.querySelector("select,input:not(#fb-website),textarea");if(first)first.focus();
}
function paintFeedback(){const b=$("suggestBtn");if(b){b.hidden=!FB.url;b.textContent=ft("suggest")}}

$("suggestBtn").onclick=()=>openFeedback("suggest");
/* ---------- boot ---------- */
races.forEach(r=>{if(!r.id)r.id=uniqueId(r.name,r.start)});
applyLang();
if(ADMIN_OK){let t=null;try{t=localStorage.getItem(GH_KEY)}catch(e){}if(t)connectGH(t).then(ok=>{if(!ok){try{localStorage.removeItem(GH_KEY)}catch(e){}}})}
if(ADMIN_OK&&location.hash==="#admin"&&!gh)setTimeout(()=>{if(!gh)openLogin()},300);
if(/^https?:$/.test(location.protocol)){fetch("config.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(c=>{if(c&&/^https:\/\/script\.google\.com\//.test(c.feedbackUrl||"")){FB.url=c.feedbackUrl;paintFeedback();paintMeta();render()}}).catch(()=>{})}
/* on a normal website: load the latest data from races.json next to the page */
if(/^https?:$/.test(location.protocol)){fetch("races.json",{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(j=>{if(gh||!j||!Array.isArray(j.races)||!j.races.length)return;races=j.races;if(j.updated)DATA.updated=j.updated;races.forEach(r=>{if(!r.id)r.id=uniqueId(r.name,r.start)});paintMeta();render()}).catch(()=>{})}
(async()=>{try{
  if(!window.claude||!window.claude.use)return;
  const [a,u]=await Promise.all([window.claude.use("artifact"),window.claude.use("user")]);
  if(!a)return;
  let ok=null;
  if(u){ok=await u.canEdit()}
  if(ok===false)return;
  artifactNS=a;canEditPage=true;$("addBtn").hidden=false;render();
}catch(e){}})();
})();
