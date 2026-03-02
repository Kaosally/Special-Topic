const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const svg = document.querySelector("svg");
const MaxPetals = 20; /* 畫面上同時最多 20 片 ，防止效能炸掉（不然一直掉一直生） */
let petals = []; /* 用來記錄「目前存在的花瓣」方便：控制數量、花瓣掉出畫面時移除 */

function createPetal(){
    if(petals.length >= MaxPetals) return;
    const isSakura = Math.random() < 0.7;
    const templateId = isSakura ? "#sakura" : "#MapleLeaves";
    const petal = document.createElementNS("http://www.w3.org/2000/svg", "use");
    petal.setAttributeNS(null, "href", templateId);
    /* 也就是說因為 要在js中複製一份svg所以用到了上面這兩行 建立svg中的use 也取得href(在定義區中拿取這個花朵的樣式); */

    const startX = Math.random() * 1200;
    const startY = -50;
    const baseScale = 0.15 + Math.random() * 0.2; /* 0.15 ~ 0.35 */
    const speed = 0.6 + Math.random() * 1; /* 0.6 ~ 1.6（每一幀往下移動的距離） */

    let angle = Math.random() * 360;
    let rotateSpeed = (Math.random() - 0.5) * 2; /* 正數	順時針 、負數	逆時針、接近 0	幾乎不轉 */
    let drift = (Math.random() - 0.5) * 1.5; /* 這片花瓣「左右飄動的強度與方向」 */

    petal.setAttributeNS(null, "opacity", 0.6 + Math.random() * 0.4);
    svg.appendChild(petal); /* 把花瓣真的加進 SVG 畫面裡 */

      let currentX = startX;
      let currentY = startY;
    /* 把出生位置複製到「現在位置」是為了動畫能從那個點開始慢慢更新、慢慢飄下來。 */

    function animate(){
      currentY += speed;
      currentX += Math.sin(currentY / 40) * drift; /* Math.sin(currentY / 40) → 產生波浪曲線（S 型軌跡） */
      angle += rotateSpeed;
      /* 這三行只是 在記憶體裡算出新的位置和旋轉角度，但只是數字，畫面上還沒有改變，這裡的變數只是計算結果，沒有任何 DOM 更新。 */
      
      petal.setAttribute("transform", `translate(${currentX}, ${currentY}) scale(${baseScale}) rotate(${angle})`);
      
      if(currentY < 450){
        requestAnimationFrame(animate);
      }
      else{
        petal.remove();
        const idx = petals.indexOf(petal);
        if(idx > -1) petals.splice(idx, 1);
      }
      /* petals 陣列記錄目前畫面上所有花瓣 ， 找到這個花瓣在陣列中的位置 → 移除
      找到 → 回傳數字索引 找不到 → 回傳 -1 ， idx → 從哪裡開始刪 1 → 刪掉幾個元素（這裡只刪掉一個）
      */
    }
    petals.push(petal);
    animate();
}  

setInterval(createPetal,500)


/* 
---

首先 createPetal 前三行表示的是找到 html 裡面的 svg（因為櫻花及楓葉動畫要運作在整個 svg 中，所有花瓣都會被 append 到這個 svg 容器裡）

且設定畫面一次只能有 20 朵花，避免過於雜亂

底下的空白陣列是用來放置目前有多少個花瓣有沒有超過 20 個，不過不是只「記數量」
是存每一個花瓣 DOM 物件本身（若超過，這次呼叫會被 return 中斷，不會建立新花瓣）

---

我繼續解釋後面的內容

底下有一個建立花瓣的函式，這個函式是用來幫助畫面產生動畫的
也就是說當畫面中一朵花都沒有的時候就會呼叫它一直到畫面已經超過 20 個
又或者說是已經滿 20 朵花時將不再進行

不過這邊正確邏輯是：
不是「沒花才呼叫」，而是固定時間一直嘗試呼叫

---

函式第一行是判斷目前畫面中的花朵數量有沒有大於或等於 20
當符合這個條件時則跳出
若還沒符合條件這行則不會進行

---

函式中的第二行及第三行表示
會隨機產生個數字介於 0~1 之間（不包含 1）
這個隨機產生的數我們用來判斷是否小於 0.7
小於則產生櫻花否則產生楓葉

結果放在 isSakura 這個變數中
因為是判斷
所以此變數的結果就是布林值 true 或 false

---

接著我們要判斷
倘若結果是 true 則產生櫻花
false 產生楓葉
放到 templateId 這個變數中

---

這一行才是真正建立花瓣 DOM 節點物件
而上面那一行只是判斷 true 或 false
不是產生結果

---

函式的第四行及第五行則表示
在文檔中創建一個命名空間（document.createElementNS）

這個方法需要兩個值
一個是哪一個命名空間
一個是要使用這個空間裡的什麼標籤

所以我們分別給了 svg 命名空間的網址及 use
也就是說要使用拿去放置在 html 中的 use 元素
去使用

這邊也就是花朵的元素

簡單說就是（在 svg 命名空間建立 use 標籤）

---

接著每一朵花都要有屬性
這個設定屬性呢要給三個值

命名空間
根據什麼東西去找
模板 Id 是屬於何者

也就是說
我們拿到了 use 標籤後
要知道它的 href 跟模板 Id
才可以確定這個屬性是要崁在櫻花元素上還是楓葉元素上

---

接下來我們要讓每一朵櫻花及楓葉的出生位置 xy 軸是落在隨機位置
且大小及落下的速度也要不同

這麼做的原因是因為
我們想要讓每一朵櫻花跟楓葉是從各個不同地方出現
且大小速度不一
也是為了畫面更加美好所設計的

---

單單只有這些會有些差強人意的感覺
所以我們要讓每一朵櫻花及楓葉旋轉的方向
跟順時針會逆時針旋轉有所不同

這樣能造成更豐富的感覺
因為落下總覺得單調

若是落下的同時還有旋轉
及慢慢地往某一方向旋轉
就會為這朵花添加一些生動的氛圍

另外
為了更加更加的靈動
添加的左右飄移的效果
這些花就更加有靈氣了

---

因為每一朵花的透明度都是 1 的話太過死板了
所以我們讓每個透明度都是隨機的
有淺有實
也不會那麼怪異

（這邊使用 setAttributeNS 進行改變）

---

加入到 svg 中（svg.appendChild(petal);）
才可以讓真正顯示出這朵花

因為我們不是用 js 字串的方式
所以創建花辮的函式中
把每一朵花處理好後
加上這行才可以使畫面真正出現我們上述給予的所有效果

---

還有要把出生位置給予 currentX、currentY 這兩個變數

原因是因為
出生位置不可以動

我們複製出一份
方便後續的動畫可以一偵一偵的加
形成漸漸往下落的效果

（let currentX = startX; let currentY = startY;）

---

animate 這個動畫就是為了當我建立完花朵之後
每建立一朵，就立刻啟動這一朵自己的動畫

前面三行就是要讓每一朵花
有每一偵往下移動的距離不同（改變 y 軸）

為了不想單調的關係
所以讓 x 軸有 s 型曲線
且左右飄移的感覺會更加靈動

這三行只是算數算出來每一偵的變化

這行
(petal.setAttribute("transform", translate(${currentX}, ${currentY}) scale(${baseScale}) rotate(${angle}));)
則是把算出來的數字套用在每一朵花上

---

接著判斷這一個花朵有沒有掉出限制的區域中

如果沒有
則繼續每一偵都呼叫

若是有
則移除且找到這個花朵的索引值

找到 → 回傳數字索引
找不到 → 回傳 -1

倘若是還存在不是 -1
那麼就根據這個索引值找到這個東西
刪除這個索引值處的第一個

---

最後就是把創造出來的花朵放到陣列中
（因為要看索引值、控制最大數量、管理目前存活的花瓣等等的）

呼叫動畫就會在畫面中看到了

---

setInterval(createPetal,500)

這部分則是每 0.5 秒鐘呼叫一次創建花朵的動畫
（裡面也有動畫函式）

---


*/


window.addEventListener('load', function() {
    const container = document.querySelector('.container');
    if (container) { /* 檢查容器是否存在 */
        setTimeout(() => {
            container.classList.add('start-writing'); /* 把 start-writing class 加到 .container 上 */
        }, 5000);
    }
});

/* 避免你在 DOM 還沒出現前就 querySelector，導致抓不到元素。 */
document.addEventListener('DOMContentLoaded', () => {
    const section2 = document.querySelector('.section2');
    /* 如果頁面上 根本沒有 .section2 就直接停止執行，避免後面報錯 */
    if (!section2) return;

    /* IntersectionObserver 是專門用來「監控元素有沒有進入視窗」的工具*/
    /* 觀察員會觀察「這個變數所指向的 DOM 元素」， 不是變數本身，而是它指到的 .section2 元素。 */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { /* true：元素「有碰到」視窗（超過 threshold） */
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
    /* 這裡開始是 設定選項 */
    /* 只要有 0.1% 的元素進入視窗，就算「進入」 */
        threshold: 0.001 
    });

    observer.observe(section2);
});

/* IntersectionObserver 就像你雇了一個觀察員，他把符合或不符合條件的人寫成筆記（entries），下班交給你，你再逐一處理（forEach）並決定要做什麼（加/移除 class）。 */
/* 只有當你想知道「某個元素是不是出現在使用者視窗內」時，就會寫這個 IntersectionObserver。 */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d'); /* Canvas 的 2D 繪圖筆，之後所有的「畫圓、清畫面、填色」都靠它 。 可以把 ctx 想成：「拿在手上的畫筆」*/
const section = document.getElementById('main-section');
const mainImage = document.getElementById('mainImage');
const displayPath = document.getElementById('displayPath');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

canvas.width = canvas.height = 450;
/* 粒子現在要不要「集合成形狀」的開關 */
/* 目前是第幾頁 / 第幾個畫面 */
let particles = []; isAssembling = false; currentIndex = 0;
const particleCount = 450;

/* 每一個物件 = 一頁畫面要用到的「全部資訊」 */
const pages = [
    { title: "提供寵物們安全庇護", desc: "我們走入街頭與荒野，為受困的生命提供避風港，終止流浪的惡性循環。", shapeId: "path1", img: "https://images.unsplash.com/photo-1687702563085-2f550461f24c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "全方位的醫療修復", desc: "寵物入所即享有完整健檢與疫苗。我們用細心醫治看不見的外傷，更用耐心縫補受驚的心靈。", shapeId: "path2", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500" },
    { title: "重新學習與人相處", desc: "透過專業的減敏訓練與社交互動，幫助毛孩褪去恐懼，練習成為未來家人最溫暖的伴侶。", shapeId: "path3", img: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=500" },
    { title: "尋找永遠的避風港", desc: "我們嚴格篩選領養家庭，並提供後續追蹤與建議。讓每一份救援的初衷，都能圓滿落腳。", shapeId: "path4", img: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=500" }
]

/* 傳進來的是：pathId：字串 */
function getTargetPoints(pathId){
     /* temp = temporary（暫時的） */
    const tempPath = document.getElementById(pathId);
    if(!tempPath) return []; /* 「如果沒有拿到那條 SVG 路徑，就不要繼續算了，直接回傳空陣列」 */
    /* 這條 SVG path「沿著線走」的實際總長度（像素）*/
    const points = [], length = tempPath.getTotalLength();
    for(let i = 0;i<particleCount;i++){
        /* (i / particleCount) * length = 沿路徑的實際距離，把整條路徑平均分成 450 等份 */
        const pt = tempPath.getPointAtLength((i/particleCount) * length);
        /* 先算出這顆粒子在路徑上的比例位置（0~1），再乘上路徑總長度得到實際距離，然後用 tempPath.getPointAtLength() 取得這個距離對應的 x, y 座標，這個座標就是粒子要移動到的目標位置。 */
        points.push({x: pt.x * 2.25, y: pt.y * 2.25});
        /* 想把 200 的座標放到 450 的畫布上，比例 = 450 ÷ 200 =  2.25 */
    }
    return points;
}

class Particle{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        /* Math.random() - 0.5 → 會得到 -0.5 ~ 0.5，乘 4 → 最終水平速度在 -2 ~ +2 之間 */
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        /* Math.random() * 2 → 0 ~ 2，+1 → 最終範圍 1 ~ 3 */
        this.r = Math.random() * 2 + 1;
        this.targetX = this.targetY = null; /* 初始設為 null，因為一開始粒子還沒被分配到路徑上的位置 */
    }
    update(){
        /* 如果動畫在組合階段，而且粒子有目標，就進入「飛向目標」模式 */
        if(isAssembling && this.targetX!=null){
            this.x += (this.targetX-this.x) * 0.12;
            this.y += (this.targetY-this.y) * 0.12;
        }else{
            /* 粒子按照自己初始的速度 (vx, vy) 移動 */
            this.x += this.vx; this.y += this.vy;
            /* this.vx *= -1 → 水平速度反向 this.vy *= -1 → 垂直速度反向 */
            if(this.x < 0 || this.x > canvas.width)this.vx *= -1;
            if(this.y < 0 || this.y > canvas.height)this.vy *= -1;
        }
    }
    draw(){
        ctx.beginPath();
        /* this.x, this.y → 圓心座標 this.r → 半徑（大小）0 → 起始角度 Math.PI * 2 → 結束角度（360°） */
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = '#2a5a5a';
        ctx.fill();
    }
}

/* targetIndex → 目標頁面的索引（第幾頁） */
function handleMorph(targetIndex){
    currentIndex = targetIndex;
    const pageDate = pages[currentIndex];

    /* 粒子還在飛，按鈕暫時鎖住，等動畫結束再解鎖 */
    prevBtn.disabled = nextBtn.disabled = true;
    section.classList.remove('is-completed');
    section.classList.add('is-morphing');

    /* 也就是 先把上一頁的粒子全部丟掉
    準備裝下一頁的粒子 */
    particles = [];
    for(let i=0; i<particleCount; i++) particles.push(new Particle());
    isAssembling = false;

    const nextTargetPoints = getTargetPoints(pageDate.shapeId);

    setTimeout(()=>{
        isAssembling = true;
        particles.forEach((p,i)=>{
            /* i % nextTargetPoints.length，% → 餘數運算符，作用：保證索引不會超過陣列長度 */
            const target = nextTargetPoints[i%nextTargetPoints.length];
            p.targetX = target.x; p.targetY = target.y;
        })
    },600)

    setTimeout(()=>{
        /* 只取得或設定 純文字，HTML 標籤會被當作文字 */
        document.getElementById('title').innerText = pageDate.title;
        document.getElementById('desc').innerHTML = pageDate.desc;
        mainImage.setAttribute('href',pageDate.img);
        displayPath.setAttribute('d',document.getElementById(pageDate.shapeId).getAttribute('d'));

    },1200)

    setTimeout(()=>{
        section.classList.remove('is-morphing');
        section.classList.add('is-completed');
        prevBtn.disabled = (currentIndex === 0);
        nextBtn.disabled = (currentIndex === pages.length - 1);
    },2000)
}
function prevPage(){ if(currentIndex > 0) handleMorph(currentIndex-1);}
function nextPage(){ if(currentIndex < pages.length-1) handleMorph(currentIndex+1);}

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    if(section.classList.contains('is-morphing')){
        particles.forEach(p => { p.update(); p.draw(); });
    }
    requestAnimationFrame(animate);
}
animate();

/* / ＝ 除法 → 算比例（用來把數值壓到 0~1 之間）
    % ＝ 取餘數 → 做循環（超過某個數會從 0 重新開始） */


const pages2 = {
  title: "跳跳糖",
  desc: "他在一個暴雨後的廢棄畫室旁被發現。當時的他，毛髮沾滿了乾掉的顏料與汙泥，蜷縮在角落，像一塊被畫家遺棄、不再修補的殘破畫布。雖然起名為『跳跳糖』，是希望他能擁有彈珠汽水般的快樂，但沒人知道他在街頭獨自流浪了多久。初到中心時，他總是低著頭，拒絕任何眼神接觸，彷彿只要不看世界，心就不會再碎一次。經過半年的修復，跳跳糖終於學會了重新信任。他不需要昂貴的禮物，他只需要一個永遠不會再轉身離去的背影，讓他在這輩子最後的一幅畫裡，畫出關於『家』的模樣。",
  shapeId: "#path-droplet",
  img: "YOUR_THIRD_IMAGE_URL",
  stats: {
    lively: 45,
    friendly: 90,
    calm: 95
  }
}

function activateSection3(){
    const story = document.querySelector('.story');
    setTimeout(()=>{
        story.classList.add('active');
        document.getElementById('bar-lively').style.width = pages2.stats.lively + '%';
        document.getElementById('bar-friendly').style.width = pages2.stats.friendly + '%';
        document.getElementById('bar-calm').style.width = pages2.stats.calm + '%';
    },150)
}

activateSection3();

// 取得顯示數字的 HTML 元素
const numberElement = document.getElementById('circle-number');
const targetValue = 92; // 目標百分比
let currentValue = 0;   // 起始值

// 計算跳動速度：3500ms (3.5秒) / 92次 ≈ 38ms 增加一次
// 這樣數字會跟著圓環動畫一起跑完
const duration = 2000; 
const stepTime = duration / targetValue;

const counter = setInterval(() => {
    currentValue++;
    numberElement.innerText = currentValue;

    // 當數字達到 92 時停止計時器
    if (currentValue >= targetValue) {
        clearInterval(counter);
    }
}, stepTime);

const container = document.getElementById('fragment-container');
const section3 = document.getElementById('shatter-section'); /* 這通常是觸發條件的區塊 */
let hasActivated = false;

const slider = document.getElementById('number_s');
const number_s = document.getElementById('lively-value');

slider.oninput = function(){
    number_s.innerHTML = this.value;
}

const evaluate_btn = document.querySelector('.evaluate-btn');
const evaluate_container = document.querySelector('.evaluate-container');
const closeText = document.getElementById('closeText');
const story = document.querySelector('.story');
const navBtnOut = document.querySelector('.nav-btn-out');

evaluate_btn.addEventListener('click', ()=>{
    evaluate_container.classList.add('active');
    
    
    /* .section3.active .story 裡面使用了 animation，而動畫（Animation）的權重在瀏覽器渲染中非常高，會蓋過你在 JS 寫的 style.opacity = "0"。 */
    story.style.setProperty('opacity', '0', 'important');
    navBtnOut.style.display = "none";

})

closeText.addEventListener('click', ()=>{
    evaluate_container.classList.remove('active');
    story.style.setProperty('opacity', '1', 'important');
    navBtnOut.style.display = "flex";
})


const rows = 6;
const cols = 8;
/* 🔹 寬度相關 → 除以 cols
🔹 高度相關 → 除以 rows */
for(let r=0; r<rows;r++){
    for(let c=0; c<cols;c++){
        const frag = document.createElement('div');
        frag.className ='fragment';
        frag.style.width = (100/cols) + '%';
        frag.style.height = (100/rows) + '%';
        /* r = 0 → top = 0%
        r = 1 → top = 16.67%
        r = 2 → top = 33.33%
        👉 每一列往下推一格。 */
        frag.style.top = (r*(100/rows)) + '%';
        frag.style.left = (c*(100/cols)) + '%'; /* 每一欄往右推一格。 */
        container.appendChild(frag);
    }
}

function shatter(){
    const frags = document.querySelectorAll('.fragment');
    const navBtns = document.querySelectorAll('.nav-btn');
    frags.forEach(f =>{
        const x = (Math.random()-0.5)*1000;
        const y = (Math.random()-0.5)*1000;
        const rz = (Math.random()-0.5) *720;
        /* scale(0) 會把元素縮到 完全消失（0% 大小）， scale(0) → 像碎片縮成一點消失 */
        f.style.transform = `translate(${x}px, ${y}px) rotate(${rz}deg) scale(0)`
        f.style.opacity = '0' 
    })
    setTimeout(()=>{
        section3.classList.add('active');
    },300)

    setTimeout(()=>{
        
        const p = data[0];
        const circle = document.querySelector('.circle-inside');
        const numElement = document.getElementById('circle-number');

        circle.style.transition = 'none';
        circle.style.strokeDashoffset = '220';
        
        /* 這是關鍵！「強迫」瀏覽器算一下寬度，讓它知道我們要重啟動畫了 */
        void circle.offsetWidth; 

        circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        const offsetValue = 220 - (220 * (p.num / 100));
        circle.style.strokeDashoffset = offsetValue;

        document.getElementById('bar-lively').style.width = p.lively + "%";
        document.getElementById('bar-friendly').style.width = p.friendly + "%";
        document.getElementById('bar-calm').style.width = p.calm + "%";

        animateNumber(numElement, p.num);
        
    }, 1400);

    setTimeout(()=>{
        navBtns.forEach(btn => {
            btn.classList.add('active');
            const btn2 = document.querySelector('.evaluate-btn');
            btn2.classList.add('active')
        });
    },1500)
}

window.addEventListener('scroll',()=>{
    /* 取得 section3 在目前視窗的位置與大小資訊 */ 
    const rect = section3.getBoundingClientRect();
    const targetPoint = rect.height / 2; /* 區塊三高度的一半 */
    /* 當 section3 的頂部距離視窗頂部（rect.top）小於「視窗高度減去區塊一半高度」」
→ 也就是「section3 已經進入畫面超過一半」  且 還沒有被執行過 那就把變數改成啟用 且呼叫shatter */
    if(rect.top<window.innerHeight-targetPoint && !hasActivated){
        hasActivated = true;
        shatter();
    }
})

const data = [
    { 
        name: "跳跳糖", 
        story: "他在一個暴雨後的廢棄畫室旁被發現。當時他毛髮沾滿了乾掉的顏料與汙泥，蜷縮在角落，像被遺棄的殘破畫布。初到中心時，他總是低著頭，拒絕任何眼神接觸，彷彿只要不看世界，心就不會再碎。經過半年的修復，跳跳糖終於開始重新信任人。他需要一個永遠不會再轉身離去的背影。", 
        lively: 45, friendly: 80, calm: 95, num: 92 
    },

    { 
        name: "小米（狗）", 
        story: "在通往村莊的小路邊被發現，安靜地坐著看遠方。她親人溫柔，很喜歡散步，是會默默陪伴型的小女孩。", 
        lively: 60, friendly: 85, calm: 70, num: 78 
    },

    { 
        name: "布丁（貓）", 
        story: "原本是家貓，因主人突發變故無法繼續照顧。她其實很黏人，熟悉後會主動跳上膝蓋陪伴。", 
        lively: 50, friendly: 75, calm: 85, num: 83 
    },

    { 
        name: "奶茶（狗）", 
        story: "在公園流浪了一段時間才被救援。個性溫和穩定，喜歡慢慢散步，也很會等門。", 
        lively: 55, friendly: 88, calm: 80, num: 81 
    },

    { 
        name: "阿橘（貓）", 
        story: "市場附近出生的小浪貓，從小就親人。喜歡曬太陽，也喜歡跟人聊天。", 
        lively: 75, friendly: 90, calm: 60, num: 86 
    },

    { 
        name: "小豆（狗）", 
        story: "被發現在大馬路旁徘徊，對人有點小心，但其實內心很黏。需要一點時間建立信任。", 
        lively: 65, friendly: 70, calm: 68, num: 74 
    },

    { 
        name: "芝麻（貓）", 
        story: "從工廠區救援出來的小女生。膽子不大，但一旦熟悉會主動撒嬌。", 
        lively: 40, friendly: 72, calm: 88, num: 79 
    },

    { 
        name: "阿福（狗）", 
        story: "因家庭搬遷無法繼續飼養。穩重懂事，會握手，也聽得懂自己的名字。", 
        lively: 58, friendly: 92, calm: 85, num: 90 
    },

    { 
        name: "糖糖（貓）", 
        story: "社區媽媽餵養的小貓。親人愛撒嬌，是典型的跟前跟後型貓咪。", 
        lively: 70, friendly: 88, calm: 65, num: 84 
    },

    { 
        name: "樂樂（狗）", 
        story: "在夜市附近被發現。看到人就搖尾巴，是活潑開朗的小男生。", 
        lively: 85, friendly: 90, calm: 55, num: 87 
    },

    { 
        name: "花花（貓）", 
        story: "三花小女生，原本躲在倉庫裡。熟悉後會用呼嚕聲表達喜歡。", 
        lively: 55, friendly: 76, calm: 82, num: 80 
    },

    { 
        name: "圓圓（狗）", 
        story: "從收容所轉出。喜歡吃也喜歡抱抱，是療癒系的大眼睛女孩。", 
        lively: 62, friendly: 89, calm: 75, num: 88 
    },

    { 
        name: "可可（貓）", 
        story: "被發現在學校圍牆邊。安靜獨立，但晚上會主動來蹭手。", 
        lively: 48, friendly: 73, calm: 90, num: 82 
    },

    { 
        name: "阿弟（狗）", 
        story: "因主人年邁無法照顧而送養。性格穩定，非常適合有規律生活的家庭。", 
        lively: 52, friendly: 86, calm: 92, num: 89 
    },

    { 
        name: "咪咪（貓）", 
        story: "從停車場救援。膽小但溫柔，喜歡躲在毯子裡觀察世界。", 
        lively: 35, friendly: 68, calm: 93, num: 77 
    },

    { 
        name: "小虎（狗）", 
        story: "山區流浪犬，體力很好。喜歡奔跑，也很聰明，學指令很快。", 
        lively: 88, friendly: 84, calm: 60, num: 85 
    },

    { 
        name: "毛毛（貓）", 
        story: "原本在巷弄生活，現在已經習慣室內環境。很喜歡被梳毛。", 
        lively: 60, friendly: 82, calm: 78, num: 83 
    },

    { 
        name: "小雪（狗）", 
        story: "冬天被發現時瘦得只剩骨架。現在恢復健康，依然保有溫柔的眼神。", 
        lively: 50, friendly: 87, calm: 88, num: 91 
    },

    { 
        name: "豆花（貓）", 
        story: "在市場被撿到的小奶貓。現在已長大，依然喜歡黏在人身旁。", 
        lively: 72, friendly: 91, calm: 70, num: 90 
    },

    { 
        name: "阿寶（狗）", 
        story: "被綁在老屋前等待救援。對人極度忠誠，會默默守在門口。", 
        lively: 58, friendly: 93, calm: 85, num: 92 
    }
];


let idx = 0;
let busy = false; /* 它的作用是：當動畫正在跑的時候，我們會把它變成 true，這時就算使用者再點按鈕，JS 也會直接不理他。 */

/* element (要顯示數字的 HTML 元素) 和 target (最終的目標數字)。 */
function animateNumber(element, target) {
    let current = 0;
    const counter = setInterval(() => {
        current += 1;
        element.innerText = current;
        if (current >= target) { 
            clearInterval(counter);
        }
    }, 15); // 每 15 毫秒執行一次
}

window.onload = () => {
    const circle = document.querySelector('.circle-inside');
    circle.style.transition = 'none'; // 先關掉動畫，不要讓觀眾看到它在歸零
    circle.style.strokeDashoffset = '220'; 

    setTimeout(() => {
        const p = data[0];

        circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        /* void circle.offsetWidth 的作用：這是一記「響亮的耳光」
這行程式碼其實是在做一件跟動畫無關的事：詢問這個圓圈目前的寬度。

當妳寫下這行時，瀏覽器會突然驚醒：

「哎呀！使用者現在要問我這個圓圈精確的寬度，我必須立刻、馬上把剛才排隊的指令（關閉動畫、設為 220）通通算好，我才能告訴她正確的寬度！」 */
        void circle.offsetWidth;
        /* 我們為什麼要除以 100？因為要把 「百分比（1~100）」 轉換成 「比例（0~1）」。 */
        /* 如果妳不除以 100，妳的公式就會變成：
            220 * 80 = 17600（這數字太大了，圓圈會直接飛出宇宙）。
            但如果除以 100：
            220 * 0.8 = 176（這才是圓圈總長度 220 裡面佔掉的正確份額） */
        /* 這行指令同時包含了 「給值」 和 「觸發動作」。 */
        document.querySelector('.circle-inside').style.strokeDashoffset = 220 - (220 * (p.num / 100));

        /* 直接抓數字標籤並跑計數器 (合體！) */
        animateNumber(document.getElementById('circle-number'), p.num);
        
    }, 1500); 
};

/* dir是方向 */
function changePet(dir) {
    if (busy) return;
    /* 如果妳在函式裡面寫 let busy = true;，電腦會以為妳在建立一個「全新的、只屬於這個函式」的小 busy。但我們需要的是那個**「全域的、管整張網頁」**的大 busy */
    busy = true;

    /* 因為妳後面還有 「第二幕」和「第三幕」 才不會要一直在文檔裡找人  */
    const story = document.querySelector('.story');
    const circle = document.querySelector('.circle-inside');
    const num = document.getElementById('circle-number');

    circle.style.transition = 'none';
    circle.style.strokeDashoffset = '220'; 
    /* 數字變 0 則是因為要抹除上一隻寵物的分數，準備讓 animateNumber 接手跑新數字。 */
    /* innerText 不用使用 style */
    num.innerText = "0";

    /* 防止 Opening 動畫重啟 */
    story.style.animation = "none";
    /*後兩行就像是「拍照存證」。不管動畫怎麼變，面板的基本形狀（切角）和能見度（透明度）必須是我們指定的樣子，不能跑掉。 */
    story.style.opacity = "1";
    story.style.clipPath = "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)";

    const byeStyle = dir === 'next'? 'fold-next': 'fold-prev';
    const helloStyle = dir === 'next'? 'unfold-next': 'unfold-prev';

    /* 如果妳不撕掉，面板身上就會貼滿了「標籤貼紙」。想像一下：第一次妳按了 next，面板貼上了 fold-next。第二次妳改按 prev，面板如果沒撕掉舊的，身上就會同時有 fold-next 和 fold-prev。 */
    story.classList.remove('fold-next', 'unfold-next', 'fold-prev', 'unfold-prev');
    story.classList.add(byeStyle); /* 先加 byeStyle 是因為不管是 next 還是 prev，都要先完成撤場。這是一個配套動作：現在貼 byeStyle 縮小面板，等一下（setTimeout）才會輪到 helloStyle 展開，兩者是接力賽關係。 */

    void story.offsetWidth;  /* 保留 */

    setTimeout(()=>{
        /* 如果是 next：索引加 1，但如果超過最後一隻（data.length），就用「餘數」繞回第 0 隻。如果是 prev：索引減 1，但為了怕減成負數，先加上總長度再取餘數。 */
        idx = (dir==='next')? (idx+1) % data.length: (idx-1+data.length) % data.length;
        const p = data[idx];

        document.querySelector('.pet-name').innerText = p.name;
        document.querySelector('.pet-story').innerText = p.story;

        /* 因為取得新的內容的索引 (包括替換索引) 跟名字還有故事 都是摺疊動畫時所偷偷做的 而顯示時則是展開動畫所做的所以才要移掉折疊變成展開*/
        story.classList.remove(byeStyle);
        story.classList.add(helloStyle);

        setTimeout(()=>{
            document.getElementById('bar-lively').style.width = p.lively + "%";
            document.getElementById('bar-friendly').style.width = p.friendly + "%";
            document.getElementById('bar-calm').style.width = p.calm + "%";

            circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            const offsetValue = 220 -(220*(p.num/100));
            circle.style.strokeDashoffset = offsetValue;

            animateNumber(num, p.num);

            setTimeout(()=>{
                story.classList.remove(helloStyle); /* 如果有加收尾：動畫演完就撕掉，面板恢復乾淨，下次要按 prev 時，就不會被舊的 next 標籤干擾。 */
                busy = false; /* 動畫跑完（2.2秒），busy 變回 false，使用者可以按下一張。 */
                const btn = document.querySelector('.evaluate-btn');
                btn.classList.add('active');
            },1200)
        },860);
    },400)
}

// ==========================================
// 1. 核心變數與初始化
// ==========================================
// 確保原本的 idx, busy, data 等全域變數已經存在
// let idx = 0; 
// let busy = false; (請確認這行在全域有定義)

const submitBtn = document.querySelector('.submit');

// ==========================================
// 2. 提交問卷邏輯 (具備防禦機制)
// ==========================================
// ==========================================
// 1. 提交問卷邏輯 (去掉開場動畫版)
// ==========================================
submitBtn.onclick = async (event) => {
    event.preventDefault();

    // 忙碌鎖：防止動畫中重複點擊
    if (busy) return; 

    const selectedSpecies = document.querySelector('input[name="dog_cat"]:checked');
    const selectedKid = document.querySelector('input[name="has_kid"]:checked');
    const energyValue = document.getElementById('number_s').value;
    const livingSpace = document.querySelector('select').value;

    if (!selectedSpecies || !selectedKid) {
        alert("請完整勾選選項喔！");
        return;
    }

    // 啟動鎖定
    busy = true; 
    submitBtn.innerText = "分析中...";
    submitBtn.style.opacity = "0.5";

    const userSelection = {
        species: selectedSpecies.value === 'dog' ? '狗' : '貓',
        hasChild: selectedKid.value === 'yes',
        energy: parseInt(energyValue),
        space: livingSpace
    };

    try {
        const response = await fetch('http://localhost:3000/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userSelection)
        });

        if (!response.ok) throw new Error("伺服器沒回應");
        const bestPet = await response.json();

        // 成功後直接進入結果處理
        handleResultEffect(bestPet);

    } catch (error) {
        console.error("錯誤：", error);
        alert("連線失敗！");
        busy = false; 
        submitBtn.innerText = "重新匹配";
        submitBtn.style.opacity = "1";
    }
};

// ==========================================
// 2. 結果展示動畫 (直接摺疊/展開)
// ==========================================
function handleResultEffect(bestPet) {
    // 關閉問卷容器
    evaluate_container.classList.remove('active');
    
    // 確保故事面板是顯示的，但先透明
    story.style.display = "block";
    story.style.setProperty('opacity', '1', 'important');
    // 去掉 Opening 動畫，改用直接賦予基本形狀
    story.style.animation = "none"; 
    story.style.clipPath = "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)";

    // 1. 先執行摺疊撤場 (如果有舊資料)
    story.classList.remove('unfold-next', 'unfold-prev');
    story.classList.add('fold-next');

    const circle = document.querySelector('.circle-inside');
    const numElement = document.getElementById('circle-number');

    setTimeout(() => {
        // 2. 偷偷更換數據
        const targetPet = data.find(p => p.name.includes(bestPet.name)) || data[0];

        document.querySelector('.pet-name').innerText = targetPet.name;
        document.querySelector('.pet-story').innerText = targetPet.story;
        document.getElementById('bar-lively').style.width = targetPet.lively + "%";
        document.getElementById('bar-friendly').style.width = targetPet.friendly + "%";
        document.getElementById('bar-calm').style.width = targetPet.calm + "%";

        // 重置圓環與數字
        circle.style.transition = 'none';
        circle.style.strokeDashoffset = '220';
        numElement.innerText = "0";
        void circle.offsetWidth; 

        // 3. 執行展開進場
        story.classList.remove('fold-next');
        story.classList.add('unfold-next');
        
        if (navBtnOut) navBtnOut.style.display = "flex";

        // 4. 跑分動畫
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            circle.style.strokeDashoffset = 220 - (220 * (targetPet.num / 100));
            animateNumber(numElement, targetPet.num);

            // 5. 解鎖
            setTimeout(() => {
                busy = false; 
                submitBtn.innerText = "重新送出匹配"; 
                submitBtn.style.opacity = "1";
            }, 1500);
        }, 300);

    }, 800); // 縮短等待時間，讓節奏快一點
}

/* --- 動畫換幕時間軸 --- */
// 0ms   : 執行 byeStyle，面板開始縮小 (舊寵物撤場)
// 400ms : 面板縮到最小！偷偷換資料、歸零圓圈，改噴 helloStyle (新寵物進場)
// 860ms : 面板展開中，數值條 & 圓圈正式開始衝刺表演 (數據秀)
// 2200ms: 全部表演結束！撕掉標籤、解除 busy 鎖定 (恢復自由身)

const starsContainer = document.querySelector('.stars');
for(let i = 0; i<100;i++){
    const star = document.createElement('div');
    star.classList = 'star';
    star.style.top = Math.random() * 100 + "%"; /* 讓數值變成 0 ~ 100 之間 */
    star.style.left = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3.5 + 1 + "px"; /* 是在產生一個 1 ~ 4.5 之間的隨機數字。 */
    star.style.height = Math.random() * 3.5 + 1 + "px";
    starsContainer.append(star);
}

