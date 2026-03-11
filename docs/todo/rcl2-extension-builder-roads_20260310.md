# TODO: RCL2 擴張 - Extension、Builder、道路建造

## 來源

- PRD: `docs/prd/rcl2-extension-builder-roads_20260310.md`

## 前置依賴（建議先完成）

| PRD | 說明 |
|-----|------|
| path-memory | 道路建造需 `room.memory.frequentPaths` |
| creep-level-spawn-rcl2 | Builder 生產條件、數量、CreepRole.BUILDER |

建議實作順序：**Path Memory → Creep Level Spawn → RCL2 Extension Builder Roads**

---

## TODO List（勾選追蹤）

- [x] #1 RoomPlanner 骨架與 planExtensions
- [x] #2 Extension ConstructionSite 建立流程
- [x] #3 Builder 骨架與 Memory
- [x] #4 creepActions 擴充 build/repair
- [x] #5 Builder harvesting 行為
- [x] #6 Builder building 行為與 getNextBuildTarget
- [x] #7 道路建造 createRoadConstructionSites
- [x] #8 道路建造觸發與整合
- [ ] #9 SpawnController 與 CreepController 整合

---

## 任務清單（每項 ≤ 1 天）

| # | 任務 | 預估 | 依賴 | 驗證 |
|---|------|------|------|------|
| 1 | RoomPlanner 骨架與 planExtensions | 4h | - | planExtensions 單元測試、回傳 5 個合法座標 |
| 2 | Extension ConstructionSite 建立流程 | 3h | 1 | RCL >= 2 時建立 5 個 Extension 工地 |
| 3 | Builder 骨架與 Memory | 4h | - | BuilderMemory、BuilderCreep、builderMachine 建立 |
| 4 | creepActions 擴充 build/repair | 2h | - | build、repair 單元測試 |
| 5 | Builder harvesting 行為 | 3h | 3, 4 | store 空時採集 Source |
| 6 | Builder building 行為與 getNextBuildTarget | 5h | 3, 4, 5 | Extension 優先於道路、target 完成後找下一個 |
| 7 | 道路建造 createRoadConstructionSites | 4h | 1, path-memory | 依 frequentPaths 建立 ConstructionSite 單元測試 |
| 8 | 道路建造觸發與整合 | 3h | 2, 6, 7 | Extension 數量 >= 5 後建立道路工地 |
| 9 | SpawnController 與 CreepController 整合 | 4h | 3, creep-level-spawn | Builder 生產條件、CreepController 分派 builder |

---

## 任務詳述

### #1 RoomPlanner 骨架與 planExtensions

- 新建 `src/structures/room/RoomPlanner.ts`
- 實作 `planExtensions(room, spawn)`：與 Spawn 距離 2 格、Extension 之間空一格、選 5 個候選
- 單元測試：`RoomPlanner.test.ts`，驗證回傳 5 個座標、非牆地形

### #2 Extension ConstructionSite 建立流程

- 在 `gameRunner` 或 RoomPlanner 中：RCL >= 2 時呼叫 `planExtensions` 並 `room.createConstructionSite`
- 需檢查是否已有 5 個 Extension（含 Structure + ConstructionSite），避免重複建立

### #3 Builder 骨架與 Memory

- `memory.d.ts`：新增 `CreepRole.BUILDER`、`BuilderMemory`（含 `buildingTargetId?`）
- 新建 `src/creeps/builder/BuilderCreep.ts`、`builderMachine.ts`
- 狀態機：harvesting ↔ building（參考 Miner 的 XState 模式）

### #4 creepActions 擴充 build/repair

- `creepActions.ts`：新增 `build(creep, target)`、`repair(creep, target)`
- 單元測試：`creepActions.test.ts`

### #5 Builder harvesting 行為

- builderMachine harvesting 狀態：store 空時採集 Source
- 可複用 `creepActions.harvestEnergy`

### #6 Builder building 行為與 getNextBuildTarget

- 實作 `getNextBuildTarget(creep)`：Extension ConstructionSite 優先於道路
- building 狀態：有 target 時前往建造，完成後清除 target 並找下一個
- 單元測試：getNextBuildTarget 優先順序、target 完成後更新 memory

### #7 道路建造 createRoadConstructionSites

- `RoomPlanner.ts`：`createRoadConstructionSites(room)`
- 遍歷 `room.memory.frequentPaths`，排除已有建築座標（依該座標能否放下建築物判定：Structure 或 ConstructionSite 存在則跳過），建立 `STRUCTURE_ROAD` ConstructionSite
- 單元測試：依 frequentPaths 建立、排除已有建築

### #8 道路建造觸發與整合

- `RoomPlanner.ts`：`ensureRoadConstructionSites(room)`，Extension 數量 >= 5 時呼叫 `createRoadConstructionSites`
- `gameRunner.ts`：於 `ensureExtensionConstructionSites` 後呼叫 `ensureRoadConstructionSites`
- Builder 的 getNextBuildTarget 已支援道路，無需額外修改

### #9 SpawnController 與 CreepController 整合

- SpawnController：Builder 生產條件（Extension 存在或 Extension ConstructionSite 存在）
- Spawn.ts：`spawnBuilder`
- CreepController：分派 `builder` 角色至 BuilderCreep

---

## 建議順序

1. **並行可做**：#1、#3、#4（無相互依賴）
2. **#2** 依賴 #1
3. **#5** 依賴 #3、#4
4. **#6** 依賴 #3、#4、#5
5. **#7** 依賴 #1、path-memory PRD
6. **#8** 依賴 #2、#6、#7
7. **#9** 依賴 #3、creep-level-spawn PRD

**推薦執行順序**：1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

---

## 驗證對照（PRD §6）

| 驗證項目 | 對應任務 |
|----------|----------|
| planExtensions 回傳 5 個合法座標 | #1 |
| createRoadConstructionSites 依 frequentPaths 建立 | #7 |
| Builder 狀態轉換 harvesting ↔ building | #3, #5, #6 |
| getNextBuildTarget Extension 優先於道路 | #6 |
| Builder 完成後找下一個 | #6 |
| RCL 2 建立 5 個 Extension ConstructionSite | #2 |
| Builder 依序建造 Extension | #5, #6 |
| Extension 完成後建立道路 ConstructionSite | #8 |
| Builder 在常走路徑上蓋道路 | #6, #8 |
| Builder store 空時採集 Source | #5 |
