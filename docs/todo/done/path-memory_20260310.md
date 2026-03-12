# TODO: 常走路徑紀錄 (Path Memory)

## 來源

- PRD: `docs/prd/path-memory_20260310.md`

---

## TODO List（勾選追蹤）

- [x] #1 RoomMemory 型別與 recordFrequentPath 實作
- [x] #2 CreepController 整合路徑紀錄

---

## 任務清單（每項 ≤ 1 天）

| # | 任務 | 預估 | 依賴 | 驗證 |
|---|------|------|------|------|
| 1 | RoomMemory 型別與 recordFrequentPath 實作 | 4h | - | pathRecord.test.ts 單元測試、`npm test`、`npm run build` |
| 2 | CreepController 整合路徑紀錄 | 2h | 1 | Creep run() 前呼叫 recordFrequentPath、遊戲內 frequentPaths 累積 |

---

## 任務詳述

### #1 RoomMemory 型別與 recordFrequentPath 實作

**目標**：建立路徑紀錄基礎設施，符合 PRD 2.1、2.2、2.3、2.4、5.1、5.3

**步驟**（TDD）：
1. 於 `src/types/memory.d.ts` 新增 `RoomMemory.frequentPaths?: Record<string, boolean>`
2. 建立 `src/utils/pathRecord.ts`，實作 `recordFrequentPath(creep: Creep)`
3. 建立 `src/utils/__tests__/pathRecord.test.ts`，涵蓋：
   - RCL 1 時記錄座標至 frequentPaths
   - RCL 3 時不記錄
   - 重複座標不覆寫
   - 自動初始化 frequentPaths 物件

**驗證**：`npm test`、`npm run build`

---

### #2 CreepController 整合路徑紀錄

**目標**：於 Creep 行動前呼叫路徑紀錄，符合 PRD 5.2

**步驟**：
1. 於 `src/creeps/CreepController.ts` 的 `run()` 中，對每個 Creep 在執行角色行為前呼叫 `recordFrequentPath(creep)`
2. 確認不影響既有 Creep 行為

**驗證**：
- `npm run build`
- 遊戲內：RCL 1~2 時 `room.memory.frequentPaths` 隨 Creep 移動逐漸累積；RCL 3+ 不再記錄

---

## 建議順序

1. 先完成 #1（型別與核心邏輯）
2. 再完成 #2（整合至 CreepController）
