const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// 1. 基礎設定：允許跨域與解析 JSON
app.use(cors());
app.use(express.json());

// 2. 重要修正：讓 Express 能夠讀取同層級的 css 和 js 資料夾
// 這能解決你截圖中看到的 404 Failed to load resource 錯誤
app.use(express.static(path.join(__dirname)));

// 3. 寵物資料庫 (包含 story 欄位防止前端顯示 undefined)
const data = [
    { name: "跳跳糖", species: "狗", lively: 45, friendly: 80, calm: 95, num: 92, story: "性格穩定，最喜歡陪在主人身邊看書。" },
    { name: "小米", species: "狗", lively: 60, friendly: 85, calm: 70, num: 78, story: "充滿好奇心，是全家人的開心果。" },
    { name: "布丁", species: "貓", lively: 50, friendly: 75, calm: 85, num: 83, story: "優雅的貓紳士，偶爾會主動討摸摸。" },
    { name: "奶茶", species: "狗", lively: 55, friendly: 88, calm: 80, num: 81, story: "對人非常溫柔，特別適合有小朋友的家庭。" },
    { name: "阿橘", species: "貓", lively: 75, friendly: 90, calm: 60, num: 86, story: "活動力驚人，家裡的每個高處都是牠的領地。" },
    { name: "小豆", species: "狗", lively: 65, friendly: 70, calm: 68, num: 74, story: "勇敢聰明，學指令的速度非常快。" },
    { name: "芝麻", species: "貓", lively: 40, friendly: 72, calm: 88, num: 79, story: "安靜沉穩，喜歡獨自待在溫暖的陽光下。" },
    { name: "阿福", species: "狗", lively: 58, friendly: 92, calm: 85, num: 90, story: "非常有靈性，能感受到主人的情緒變化。" },
    { name: "糖糖", species: "貓", lively: 70, friendly: 88, calm: 65, num: 84, story: "活潑愛玩，隨便一個紙箱就能玩很久。" },
    { name: "樂樂", species: "狗", lively: 85, friendly: 90, calm: 55, num: 87, story: "體力旺盛，需要一位能陪牠長跑的主人。" },
    { name: "花花", species: "貓", lively: 55, friendly: 76, calm: 82, num: 80, story: "雖然慢熟，但一旦認認可你就會非常黏人。" },
    { name: "圓圓", species: "狗", lively: 62, friendly: 89, calm: 75, num: 88, story: "脾氣非常好，能和其他寵物和平共處。" },
    { name: "可可", species: "貓", lively: 48, friendly: 73, calm: 90, num: 82, story: "喜歡獨處的哲學家，最愛盯著窗外發呆。" },
    { name: "阿弟", species: "狗", lively: 52, friendly: 86, calm: 92, num: 89, story: "忠誠守本分，是看家護院的最佳人選。" },
    { name: "咪咪", species: "貓", lively: 35, friendly: 68, calm: 93, num: 77, story: "文靜內斂，適合安靜的小坪數居住環境。" },
    { name: "小虎", species: "狗", lively: 88, friendly: 84, calm: 60, num: 85, story: "熱情如火，見到每個人都會瘋狂搖尾巴。" },
    { name: "毛毛", species: "貓", lively: 60, friendly: 82, calm: 78, num: 83, story: "愛撒嬌的毛球，睡覺一定要擠在主人腳邊。" },
    { name: "小雪", species: "狗", lively: 50, friendly: 87, calm: 88, num: 91, story: "高雅大方，總是能維持優雅的儀態。" },
    { name: "豆花", species: "貓", lively: 72, friendly: 91, calm: 70, num: 90, story: "聰明伶俐，懂得如何開門跟你要零食。" },
    { name: "阿寶", species: "狗", lively: 58, friendly: 93, calm: 85, num: 92, story: "大智若愚，總是給人一種憨厚踏實的感覺。" }
];

// 4. 設定首頁路由 (解決 Cannot GET / 的問題)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

// 5. 匹配演算法 API
app.post('/api/match', (req, res) => {
    try {
        const { species, hasChild, energy, space = "" } = req.body; 

        // 過濾物種
        let filteredData = data.filter(p => p.species === species);
        if (filteredData.length === 0) filteredData = data;

        let matchResults = filteredData.map(pet => {
            let score = 0;
            
            // 活潑度配對 (40%)
            let livelyDiff = Math.abs(pet.lively - energy);
            score += (100 - livelyDiff) * 0.4;

            // 小孩相容性 (30%)
            if (hasChild && (pet.friendly > 80 || pet.calm > 80)) {
                score += 30;
            } else if (!hasChild) {
                score += 30; 
            }

            // 空間加成 (30%)
            if (space.includes("透天") && pet.lively > 70) {
                score += 30;
            } else if (space.includes("公寓") && pet.lively <= 60) {
                score += 30;
            } else {
                score += 15;
            }

            return { ...pet, finalScore: Math.round(score) };
        });

        // 按分數排序並回傳最高分者
        matchResults.sort((a, b) => b.finalScore - a.finalScore);
        res.json(matchResults[0] || data[0]);

    } catch (error) {
        console.error("API 發生錯誤:", error);
        res.status(500).json({ error: "伺服器內部錯誤" });
    }
});

// 6. 監聽埠號：適應 Render 雲端環境
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`伺服器已啟動，正在監聽埠號: ${PORT}`);
});
