const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 補齊了 species 欄位，方便過濾
const data = [
    { name: "跳跳糖", species: "狗", lively: 45, friendly: 80, calm: 95, num: 92 },
    { name: "小米", species: "狗", lively: 60, friendly: 85, calm: 70, num: 78 },
    { name: "布丁", species: "貓", lively: 50, friendly: 75, calm: 85, num: 83 },
    { name: "奶茶", species: "狗", lively: 55, friendly: 88, calm: 80, num: 81 },
    { name: "阿橘", species: "貓", lively: 75, friendly: 90, calm: 60, num: 86 },
    { name: "小豆", species: "狗", lively: 65, friendly: 70, calm: 68, num: 74 },
    { name: "芝麻", species: "貓", lively: 40, friendly: 72, calm: 88, num: 79 },
    { name: "阿福", species: "狗", lively: 58, friendly: 92, calm: 85, num: 90 },
    { name: "糖糖", species: "貓", lively: 70, friendly: 88, calm: 65, num: 84 },
    { name: "樂樂", species: "狗", lively: 85, friendly: 90, calm: 55, num: 87 },
    { name: "花花", species: "貓", lively: 55, friendly: 76, calm: 82, num: 80 },
    { name: "圓圓", species: "狗", lively: 62, friendly: 89, calm: 75, num: 88 },
    { name: "可可", species: "貓", lively: 48, friendly: 73, calm: 90, num: 82 },
    { name: "阿弟", species: "狗", lively: 52, friendly: 86, calm: 92, num: 89 },
    { name: "咪咪", species: "貓", lively: 35, friendly: 68, calm: 93, num: 77 },
    { name: "小虎", species: "狗", lively: 88, friendly: 84, calm: 60, num: 85 },
    { name: "毛毛", species: "貓", lively: 60, friendly: 82, calm: 78, num: 83 },
    { name: "小雪", species: "狗", lively: 50, friendly: 87, calm: 88, num: 91 },
    { name: "豆花", species: "貓", lively: 72, friendly: 91, calm: 70, num: 90 },
    { name: "阿寶", species: "狗", lively: 58, friendly: 93, calm: 85, num: 92 }
];

app.post('/api/match', (req, res) => {
    // hasChild 改為接收布林值或特定的字串判斷
    const { species, hasChild, energy, space } = req.body; 

    console.log(`收到匹配請求: 想要${species}, 活潑度偏好:${energy}`);

    let filteredData = data.filter(p => p.species === species);
    
    // 如果沒找到對應物種，回傳預設第一隻避免當機
    if (filteredData.length === 0) filteredData = data;

    let matchResults = filteredData.map(pet => {
        let score = 0;
        
        // 1. 活潑度配對 (40%) - 計算差距，差距越小分數越高
        let livelyDiff = Math.abs(pet.lively - energy);
        score += (100 - livelyDiff) * 0.4;

        // 2. 小孩相容性 (30%) 
        // 假設前端傳過來 true 代表有小孩
        if (hasChild && pet.friendly > 80) {
            score += 30;
        } else if (!hasChild) {
            score += 30; // 沒小孩的人對所有毛孩都適合
        }

        // 3. 空間加成 (30%) - 匹配 UI 上的字串
        if (space.includes("獨棟透天") && pet.lively > 70) {
            score += 30;
        } else if (space.includes("公寓") && pet.lively <= 60) {
            score += 30;
        } else {
            score += 15; // 基本分
        }

        return { ...pet, finalScore: Math.round(score) };
    });

    // 排序
    matchResults.sort((a, b) => b.finalScore - a.finalScore);
    const bestMatch = matchResults[0];

    res.json(bestMatch);
});

app.listen(3000, () => console.log('後端 API 已啟動：http://localhost:3000'));