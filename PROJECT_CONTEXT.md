# Project Context

Read this file before editing code, formulas, storage logic, or UI behavior.

## Project Overview

- Repo: `my-react-app`
- Current app shape: single-page shopping calculator / travel shopping helper
- Stack: static HTML + React 18 UMD + ReactDOM UMD + Babel Standalone + Tailwind CDN
- No package manager, no bundler, no TypeScript, no server build pipeline detected

## Source of Truth

| File | Purpose |
|------|---------|
| `index.html` | Main UI, React components, styles, app bootstrapping |
| `formulas.js` | Shared constants, calculation rules, storage helpers, rate fetching |
| `ORIGINAL_FORMULAS_BACKUP.txt` | Backup reference only, not the primary runtime file |

## Technical Notes

- The app runs directly in the browser from `index.html`.
- React is loaded from CDN and JSX is transpiled in-browser by Babel Standalone.
- Tailwind is loaded from CDN; there is no local Tailwind config file.
- Any performance or UX changes should respect the "no build step" architecture.

## Editing Rules

1. Do not assume hidden framework tooling exists.
2. Prefer small, direct edits over architecture rewrites.
3. If changing calculations, verify both UI display and copy/export text paths.
4. If changing storage keys or saved data shape, preserve backward compatibility unless explicitly asked not to.
5. If changing UI behavior, document the user-facing effect in the update log.
6. If adding new AI guidance files, keep them consistent with this file.

## Code Navigation（Grep 前先查這裡）

| 位置 | 行號 | 說明 |
|------|------|------|
| `index.html:368` | 368 | RateInput 元件 |
| `index.html:450` | 450 | StrategySettings 元件 |
| `index.html:513` | 513 | CardSettings 元件 |
| `index.html:644` | 644 | BreakdownPanel 元件 |
| `index.html:781` | 781 | GeneralMode 元件 |
| `index.html:1004` | 1004 | DutyFreeMode 元件 |
| `index.html:1248` | 1248 | App 元件 |
| `index.html:1363` | 1363 | header JSX |
| `formulas.js:2` | 2 | COPY 常數 |
| `formulas.js:317` | 317 | estimateKoreaRefundKRW()（高風險）|
| `formulas.js:487` | 487 | buildCalcResult()（高風險）|
| `formulas.js:716` | 716 | fetchExchangeRates() |
| `math-ui.js:4` | 4 | detectCoarsePointer() |
| `math-ui.js:28` | 28 | MathKeypad 元件 |

> 每次修改後若行號位移，更新此表格。

## Review Focus

When auditing this repo, prioritize:

- Calculation correctness
- React state consistency inside `index.html`
- Local storage safety and fallback handling
- Clipboard / share / screenshot flows
- Mobile layout and PWA behavior
- CDN/runtime failure edge cases

## Update Log

Rules:

- Add one new entry per completed session/commit.
- Do not overwrite another editor's entry.
- If correcting a previous entry, add a follow-up entry.
- Use Taiwan local time.

Entry format:

- `YYYY-MM-DD`
  `Updated at: YYYY-MM-DD HH:MM CST`
  `Updated by: Codex | Claude Code | Gemini | User`
  `Type: Bug Fix | Optimization | UI | Data | Docs | Infra | Review`
  `Summary: ...`
  `Files: ...`

- 2026-04-03
  Updated at: 2026-04-03 20:02 CST
  Updated by: Codex
  Type: Docs, Infra
  Summary: Added reusable AI collaboration framework files tailored to this static React UMD project, including role-specific entry files and review guidance.
  Files: `AGENTS.md`, `PROJECT_CONTEXT.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `REVIEW_PROMPT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:00 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: Full app audit — fixed 7 bugs across 2 files. (1) Clipboard 改用 navigator.clipboard.writeText() 含 fallback，修復 iOS PWA 靜默失敗。(2) Icon 組件加入 className prop + span wrapper，修復刷新按鈕 spin-anim 永遠無效問題。(3) 策略設定三個數字欄位（rate/cap/minSpend）加 NaN 防護，避免計算錯誤。(4) 套利建議費率條件從 isBankAccount 改為 isMobilePay && isBankAccount，與實際計算邏輯一致。(5) fetchExchangeRates 加 AbortController 5 秒 timeout，避免 UI 卡在「更新中」。(6) 反向匯率 onChange 加 parseFloat(v) > 0 防護，避免輸入 0 時產生 Infinity。(7) allStrategies catch block 改回傳 deep copy，避免污染 DEFAULT_STRATEGIES_MAP 原始物件。
  Files: `index.html`, `formulas.js`

- 2026-04-04
  Updated at: 2026-04-04 00:05 CST
  Updated by: Claude Code
  Type: Infra, PWA
  Summary: 新增 Service Worker，完成 PWA 離線能力。sw.js 實作：install precache（index.html + formulas.js）+ skipWaiting；activate 清舊 cache + clients.claim；fetch 攔截 navigate 請求（Promise.race 4 秒 timeout，失敗回落 cached index.html）、app shell cache-first 背景更新、外部 CDN/API origin 不攔截。index.html 加 SW 註冊：updateViaCache:'none'，立即 requestUpdate()，visibilitychange 觸發更新，controllerchange → reload once。設計參考旅遊 APP 已驗證架構，避免 navigate 掛住與 requestUpdate 雙打問題。
  Files: `sw.js`（新增）, `index.html`

- 2026-04-04
  Updated at: 2026-04-04 00:15 CST
  Updated by: Claude Code
  Type: Bug Fix, Data
  Summary: 換算公式完整審查與稅法更新。(1) 韓國退稅門檻依 2026 年新規從 15,000 KRW 降至 5,000 KRW，補建 5,000-9,999（+300 KRW）及 10,000-14,999（+700 KRW）兩個退稅金額區間。(2) 更新退稅門檻警告文字。(3) index.html 門檻判斷同步更新為 5,000 KRW。(4) 修正 spreadCost 手續費計算使用 || 導致 mobileSpread=0 時錯誤回退為 1.0% 的 bug，改用 ?? nullish coalescing 運算子。其餘公式（匯率換算、卡別 spread、免稅品返點、回饋策略計算）審查無誤。
  Files: `formulas.js`, `index.html`

- 2026-04-04
  Updated at: 2026-04-04 00:08 CST
  Updated by: Codex
  Type: UI
  Summary: 首頁視覺改版為接近旅遊 App 的 iOS 26 莫蘭迪風格，統一 header、工具按鈕、模式切換、匯率面板、三組主輸入卡與成本試算明細卡的玻璃質感、圓角、間距與字級層次，讓首頁更像同系列 Calm Travel 體驗。
  Files: `index.html`

- 2026-04-04
  Updated at: 2026-04-04 00:23 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: 查證韓國退稅門檻後，將先前誤改的 5,000 KRW 門檻更正回 15,000 KRW，並移除 5,000-9,999 / 10,000-14,999 兩段非官方退稅區間；同步修正前端提示門檻文字與判斷。更正依據為 VISITKOREA 官方退稅指南當前頁面所示各類 tax refund / immediate tax refund 最低金額皆為 KRW 15,000。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:27 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: 完整檢查一般模式換算後，修正韓國「現場折抵」與「事後退稅」原本共用同一成本基礎的錯誤。現場折抵改為先扣除退稅額，再以實際刷卡金額計算手續費、平台匯差與卡片回饋；事後退稅則維持先刷原價、之後另退稅。同步更新總節省百分比的比較基準為原始含稅售價。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:32 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: 依文件導向重新整理韓國退稅模式：新增可實際運作的 manual 退稅額輸入（KRW），auto 模式加上估算提示；manual 與 auto 在「現場折抵」下都改為先扣除退稅額再計算刷卡成本，避免只有 auto 走正確流程的分支不一致問題。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:36 CST
  Updated by: Codex
  Type: Data
  Summary: 將韓國退稅 auto 模式改為多業者公開級距的加權平均估算，取代原本偏向單一表的級距。15,000 KRW 門檻維持官方規則；15,000-499,999 KRW 採加權級距表，500,000 KRW 以上改用 6.4% 有效退稅率近似估算，並在 UI 提示 auto 為估算值、manual 為實際值覆蓋。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:38 CST
  Updated by: Codex
  Type: Data
  Summary: 依使用需求進一步把韓國退稅 auto 模式改成隱藏式多模型自動估算，不提供使用者手動選業者。背景同時計算 Global Blue、Global Tax Free、Easy Tax Refund 與加權平均表，最後取中位帶中心值作為 auto 結果，降低單一業者表造成的偏差。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:40 CST
  Updated by: Codex
  Type: UI, Bug Fix
  Summary: 修正現場折抵在成本試算卡的可理解性問題。付款金額列改為顯示原始含稅售價；當退稅方式為現場折抵時，額外顯示「實際刷卡金額」，並把退稅列改標示為「現場折抵（結帳時已扣）」，避免看起來像在明細中重複扣兩次。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:44 CST
  Updated by: Codex
  Type: UI, Bug Fix
  Summary: 修正退稅設定區上方備註在「事後退稅」與「現場折抵」之間容易顯示相同文字的問題。提示卡改為直接比較兩種退稅方式各自的 final cost，再依目前選取方式顯示「已選最優」或「改選另一種更省」的動態文案；差異極小時則顯示兩者接近。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:47 CST
  Updated by: Codex
  Type: UI
  Summary: 在退稅比較提示卡內加入低干擾的差額公式說明「差額來源 = 退稅額 × (回饋率 - 成本率)」，作為輔助理解文字，只在可比較事後退稅與現場折抵時顯示，避免主畫面資訊過度擁擠。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:49 CST
  Updated by: Codex
  Type: UI
  Summary: 將一般模式首頁匯率卡的預設顯示方向改為「TWD ➔ KRW」，讓畫面一進來就先顯示台幣換韓元。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:51 CST
  Updated by: Codex
  Type: UI
  Summary: 重新設計首頁 header 區塊，移除低資訊量的國旗與搜尋按鈕，改用購物袋品牌圖示、精簡排版與狀態膠囊呈現，僅保留設定與更新匯率兩個實用工具按鈕，並同步調整標題與副標字體節奏。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 00:52 CST
  Updated by: Codex
  Type: UI
  Summary: 依使用情境將 header 搜尋功能補回，按鈕改為直接開啟 Creatrip 匯率頁（https://creatrip.com/exchange），用於查詢韓國當地現鈔匯率，不再使用通用 Google 搜尋。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:00 CST
  Updated by: Codex
  Type: UI
  Summary: 重新收斂首頁 header 的文字排列，移除英文堆字副標與兩個狀態膠囊，改為更簡潔的中文副標「首爾購物試算器」，並微調品牌區與按鈕區比例，降低視覺雜訊。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:03 CST
  Updated by: Codex
  Type: UI
  Summary: 將首頁品牌副標改為英文「Seoul Shopping Calculator」，並調整字級、字距與大小寫風格，讓 header 更接近品牌標語感而不是功能描述。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:04 CST
  Updated by: Codex
  Type: UI
  Summary: 將首頁品牌副標再收斂為更品牌化的英文文案「Seoul Shopping Studio」。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:21 CST
  Updated by: Codex
  Type: UI
  Summary: 重新協調首頁品牌區字體與 UI 的一致性，降低主標字重與字距張力、縮小品牌圖示，並把副標改成較低字距的句式排法「Seoul shopping studio」，讓 header 更融入整體玻璃卡片風格。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:23 CST
  Updated by: Codex
  Type: UI
  Summary: 將首頁品牌區左側圖示改為與主畫面相同的 app icon，取代原本用途不明的抽象功能圖示，讓 header 更像品牌識別而非工具列。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:26 CST
  Updated by: Codex
  Type: UI
  Summary: 依使用者回饋修正首頁品牌區圖示方向，移除剛加入的偏綠 app icon，改回與目前暖灰新 UI 一致的品牌標記，避免 header 色系與主畫面風格衝突。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:27 CST
  Updated by: Codex
  Type: UI, Docs
  Summary: 將原本內嵌在 index.html 的 apple-touch-icon 抽出為獨立檔案 icon.svg，並改成由 index.html 直接引用，方便後續單獨編修主畫面圖示。
  Files: `icon.svg`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:29 CST
  Updated by: Codex
  Type: UI
  Summary: 重新設計主畫面圖示 icon.svg，將原本偏舊的綠底白線袋子改為暖灰莫蘭迪漸層、柔和內卡片與簡化購物袋構圖，使其更接近目前主畫面的玻璃感 UI 風格。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:31 CST
  Updated by: Codex
  Type: UI
  Summary: 依需求將 icon.svg 再次重做，完全跳脫既有購物袋框架，改成暖灰莫蘭迪底上的抽象雙緞帶品牌符號，讓主畫面圖示更偏品牌識別而非具象功能圖示。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:32 CST
  Updated by: Codex
  Type: UI
  Summary: 再次重新設計 icon.svg，改為更幾何、品牌字母感的圖示方向，使用暖灰玻璃卡片底搭配抽象字形構圖，進一步拉開與前一版緞帶風格的差異。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:33 CST
  Updated by: Codex
  Type: UI
  Summary: 依需求將 icon.svg 調整為更具用途辨識度的版本，加入購物袋外型與計算機面板語意，讓圖示能更直接傳達「購物／試算」用途，同時保留暖灰莫蘭迪質感。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:33 CST
  Updated by: Codex
  Type: UI
  Summary: 再次重新設計 icon.svg，改為「計算機 + 價格標籤」的俐落構圖，完全避開最早的線框購物袋方向，也不沿用前一版購物袋主體。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:36 CST
  Updated by: Codex
  Type: UI
  Summary: 將主畫面 icon.svg 再換成新的一組「收據價格牌 + 計算鍵盤」構圖，拿掉前幾版偏抽象或過度裝飾的品牌符號，改以更直接的購物試算語意搭配暖灰莫蘭迪玻璃底，讓圖示一眼更像購物計算工具。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:38 CST
  Updated by: Codex
  Type: UI
  Summary: 依最新方向把主畫面圖示再收斂為單一計算機設計，移除收據與價格牌等混合語意，只保留圓角裝置、顯示幕與鍵盤按鍵，讓 icon 更乾淨俐落且更像獨立工具 App。
  Files: `icon.svg`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:46 CST
  Updated by: Codex
  Type: UI, PWA
  Summary: 修正 iPhone 主畫面圖示未連動更新的問題。新增標準 `apple-touch-icon.png`，將 index.html 的 apple-touch-icon 從 SVG 改為 PNG，並同步把 `icon.svg` 與 `apple-touch-icon.png` 納入 Service Worker app shell 並更新 cache 名稱，降低手機端沿用舊 icon 的機率。
  Files: `index.html`, `sw.js`, `apple-touch-icon.png`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:47 CST
  Updated by: Codex
  Type: UI, PWA
  Summary: 將頁面標題與 iPhone 主畫面名稱從帶版本號的 `購黑皮 V125` 收斂為純 `購黑皮`，避免加到主畫面後顯示過長且像測試版名稱的文字。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:51 CST
  Updated by: Codex
  Type: UI, Optimization
  Summary: 移除右下角只有微調 padding 的 Screenshot Mode 浮動按鈕，並清掉目前沒有任何觸發入口的 InstallPrompt 元件、對應 state 與 copy 文案，收斂頁面上低價值且未實際運作的 UI 功能。
  Files: `index.html`, `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 01:59 CST
  Updated by: Codex
  Type: UI, Optimization
  Summary: 重新整理信用卡設定頁的資訊架構，在不更動既有卡片資料結構的前提下，將每張卡片改為「基本卡片 / 加碼活動 / 支付成本」三段式版面，補上提示文字並重新命名行動支付、銀行帳戶綁定、平台匯差等欄位；同步把 header 英文副標改為更貼近功能含義的 `Seoul Shopping Calculator`。
  Files: `index.html`, `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:02 CST
  Updated by: Codex
  Type: UI
  Summary: 依回饋補強信用卡設定中「綁定銀行帳戶 / TWQR」的重要提示，將標題直接改為含 `免 1.5%` 的版本，並新增醒目的 `免 1.5%` 小標與更明確的說明文字，避免這個影響試算結果的關鍵條件被看漏。
  Files: `index.html`, `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:03 CST
  Updated by: Codex
  Type: UI
  Summary: 重新校正策略相關文案，將原本容易誤解為單獨滿額禮的描述改為更貼近實際邏輯的「在基本回饋上疊加活動」，並同步調整策略設定提示與 badge 名稱，明確表達這是信用卡基本回饋之外的額外加碼。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:17 CST
  Updated by: Codex
  Type: Optimization, UI
  Summary: 在備份目前版本後，先對既有回饋模型做相容升級：公式正式拆出 `基本回饋` 與 `活動加碼` 兩段計算，策略層新增每層回饋、cap、吃滿上限所需消費與下一個最接近 cap 的活動輸出；明細卡同步顯示基本回饋/活動加碼拆分與「再刷多少可吃滿」提示，作為後續多層活動規則引擎的過渡版本。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:20 CST
  Updated by: Codex
  Type: Data, Optimization
  Summary: 將中信 LINE Pay Visa 預設策略直接更新為本次活動結構：`LINE Pay 通用 10%`、`Visa 指定加碼 12%`、`中信額外 5.2%`（520 點上限），保留 2.8% 為卡片基本回饋；另外新增舊版預設策略 migration，只有偵測到仍是舊的 `銀行加碼 / VISA 滿額` 預設組合時才自動升級，避免覆蓋使用者自訂策略。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:24 CST
  Updated by: Codex
  Type: UI, Data
  Summary: 依補充資料修正中信活動各層 cap，將 `LINE Pay 通用 10%` 設為 1000 點上限、`Visa 指定加碼 12%` 設為 1200 點上限；同時進一步拉開信用卡設定頁三個分區的色塊與視覺層次，讓基本卡片、活動加碼、支付成本更容易一眼分辨。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:28 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: 修正百分比回饋計算的浮點誤差，避免像 `10000 × 2.8%` 被錯算成 279 點。新增安全百分比回饋計算函式後，中信 LINE Pay Visa 驗算已回到 `基本 280 + 加碼 2720 = 3000 點 / 30.0%` 的正確結果。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:30 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: 修正中信預設策略 migration 同步不完整的問題。原先已升級為 `LINE Pay 通用 / Visa 指定加碼 / 中信額外 5.2%` 的本機資料，若 cap 仍停留在舊值或 0，現在會在載入時一併補正為 `1000 / 1200 / 520` 點上限，避免策略設定視窗與實際公式不同步。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:34 CST
  Updated by: Codex
  Type: UI
  Summary: 補上活動加碼與行動支付之間的依賴提示。當卡片已啟用活動加碼但未開啟行動支付時，信用卡設定頁會直接顯示 LINE Pay / 通路加碼不生效的警示，避免公式條件藏在設定內造成誤解。
  Files: `index.html`, `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:35 CST
  Updated by: Codex
  Type: Bug Fix, Optimization
  Summary: 依規則收斂行動支付成本邏輯，移除先前誤加的 `平台匯差 / 額外成本` 概念與 slider，公式改為行動支付本身不產生額外費用；支付成本只保留真正會影響結果的 `綁定銀行帳戶 / TWQR 免 1.5%` 條件。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:37 CST
  Updated by: Codex
  Type: UI
  Summary: 將原本殘留舊語意的「支付成本」區塊改名為「活動條件」，並把「行動支付」改成更直接的「LINE Pay 通路」，避免在已移除額外成本後仍讓人誤會這一區是在設定費用。
  Files: `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:38 CST
  Updated by: Codex
  Type: UI
  Summary: 移除我額外長出的獨立條件區塊，將 LINE Pay 條件收回到「加碼活動」設定內，只保留一個精簡的 `使用 LINE Pay` 開關與 `免 1.5%` 條件，避免畫面多出一整欄與原本設定流程脫節。
  Files: `index.html`, `formulas.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:42 CST
  Updated by: Codex
  Type: Bug Fix, UI
  Summary: 收回先前多做的 LINE Pay 通路開關，避免把公式條件硬塞成新的操作流程。中信 LINE Pay 預設三層活動改為直接由卡片公式判斷，不再要求額外開啟 `LINE Pay 通路`；信用卡設定頁同步回到以 `支付成本` 與 `免 1.5%` 為主，保留其他卡片的行動支付開關但移除中信卡上多餘的條件欄位。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 02:42 CST
  Updated by: Codex
  Type: Cache
  Summary: 為手機端延遲更新補強快取版本管理。首頁 icon 與 `apple-touch-icon` 改帶版本 query string，`sw.js` cache name 也同步升版，降低 iPhone 主畫面與 Safari 持續命中舊快取導致畫面、圖示與資料不同步的機率。
  Files: `index.html`, `sw.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:34 CST
  Updated by: Codex
  Type: UI
  Summary: 微調成本試算明細內活動加碼下方的 cap 進度提示字色，將「再刷 NT$... 可吃滿...」由過淡的淺灰改為較深的暖灰，保留低干擾感但提高手機閱讀清晰度。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:44 CST
  Updated by: Codex
  Type: UI, Formula
  Summary: 修正現場折抵時的回饋率顯示語意。原本 `LINE POINTS (30.0%)` 容易讓人誤會是以原價計算，現在改成 `LINE POINTS (實刷 30.0%)`，明示回饋率是套用在現場折抵後的實際刷卡金額上，與公式一致。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:48 CST
  Updated by: Codex
  Type: UI
  Summary: 依需求移除回饋主標中的 `實刷` 字樣，將現場折抵的回饋基準改為在主列下方補一行公式提示：`實刷金額 × 回饋率 ≈ 回饋金額`。提示字色與活動加碼下方的 cap 進度說明一致，讓主列維持乾淨、下方再補足理解所需資訊。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:50 CST
  Updated by: Codex
  Type: UI
  Summary: 進一步收斂回饋主列下方的實刷公式提示，移除與右側綠字重複的 `回饋金額` 尾句，只保留 `實刷金額 × 回饋率`；同時壓縮與主列之間的垂直間距，讓兩行資訊更緊密、更像同一組說明。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:55 CST
  Updated by: Codex
  Type: UI
  Summary: 再次收緊回饋主列與實刷公式提示之間的上下間距，直接縮短回饋主列高度並將下方公式再上提，避免兩行之間保留過多留白。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 11:59 CST
  Updated by: Codex
  Type: UI
  Summary: 在成本試算明細標題下方新增小型圖例，直接標示 `＋ 增加成本`、`－ 抵減成本`，降低手續費、回饋與現場折抵同時出現時的誤判成本；保留原本正負號結構，但讓閱讀邏輯更直觀。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:03 CST
  Updated by: Codex
  Type: UI
  Summary: 依需求移除成本試算明細標題下方的 `＋ 增加成本 / － 抵減成本` 圖例，回到更乾淨的版面呈現，避免額外標示破壞視覺整體性。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:07 CST
  Updated by: Codex
  Type: UI, Formula
  Summary: 依新邏輯重整一般購物與免稅購物共用的明細表結構。中段改為先呈現 `總優惠`（回饋點數 + 退稅／現場折抵），再顯示 `成本扣除`（刷卡手續費），最後以 `淨回饋價值` 統整結果；回饋拆分與 cap 提示保留在總優惠區內，讓整體閱讀順序從「先加總拿到多少、再扣除成本」更直觀。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:15 CST
  Updated by: Codex
  Type: UI
  Summary: 修正新版明細表的兩個可讀性問題。將 `回饋總價值` / `手續費成本` / 最下方 `總回饋價值` 的標題字級與色彩拉回明顯層級，避免看起來像消失；同時移除手續費成本卡內重複顯示的金額，只保留單一一筆 `刷卡手續費`，避免被誤認為重複扣款。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:19 CST
  Updated by: Codex
  Type: UI
  Summary: 調整回饋總價值卡的閱讀順序，將原本掛在卡片右上角的 `+$3,637` 移到區塊底部，改成在回饋點數與退稅／現場折抵都列完後再顯示 `優惠合計`；讓畫面邏輯回到「先列項目，再做加總，再往下扣手續費」。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:22 CST
  Updated by: Codex
  Type: UI
  Summary: 重新收斂綠色 `回饋總價值` 區塊的字體層級與排版，往前一版的視覺語言靠攏：標題改回較輕的次標層級、回饋主列改成兩行結構、右側金額與區塊底部的 `優惠合計` 也改回較自然的非 monospace 大小，避免看起來像另一套設計語言。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:25 CST
  Updated by: Codex
  Type: UI
  Summary: 微調綠色回饋主列資訊順序，將 `(30.0%)` 與 `不含手續費` 的位置交換，改成先看到回饋率、再看到補充說明，讓主資訊更集中在同一視線上。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:26 CST
  Updated by: Codex
  Type: UI
  Summary: 依需求移除回饋主列中的 `不含手續費` 膠囊，避免與下方已獨立列出的手續費成本重複說明，讓回饋主列只保留必要資訊。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:28 CST
  Updated by: Codex
  Type: UI
  Summary: 將回饋主列左側資訊改回單行並排，讓 `LINE POINTS (30.0%)` 放在同一行；同時微調下方公式提示的上距，維持主列與說明之間的緊密度。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:33 CST
  Updated by: Codex
  Type: UI
  Summary: 依確認版本微調綠色卡文案：區塊標題改為 `優惠內容`，主列改成 `LINE POINTS 回饋 (30.0%)` / `現金回饋 (3.0%)` 的語氣，移除原本重複且不自然的 `回饋點數` 前綴。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 12:51 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: BreakdownPanel 公式及文字全面審查。確認退稅門檻 15,000 KRW 在三個位置（lookupRefundFromTable、estimateKoreaRefundKRW、index.html 判斷）皆正確。所有計算公式與截圖數字交叉驗證無誤。修正唯一顯示 bug：displayOriginal 未四捨五入，從 TWD 或 USD 換算出的 KRW 值帶浮點小數（如 466,598.059），改為 Math.round(targetAmount)，與 getCopyText 行為一致。
  Files: `formulas.js`

- 2026-04-04
  Updated at: 2026-04-04 13:09 CST
  Updated by: Codex
  Type: Feature
  Summary: 金額輸入欄位新增四則運算表達式支援，使用者可直接輸入 `+ - * / ()` 算式，於 blur 或 Enter 確認後自動收斂成結果值，再沿用當下最新匯率與既有試算公式。一般購物三個幣別欄位與免稅購物的原價 / 實付款欄位皆同步支援；核心換算、免稅折扣判斷與一般轉免稅預填也改成讀取算式結果，不新增額外欄位。
  Files: `formulas.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 13:15 CST
  Updated by: Codex
  Type: UI, Feature
  Summary: 將四則運算輸入升級成計算機式即時預覽：當使用者在金額欄位輸入如 `500000/2` 的算式時，欄位上方以淡字保留原式，主數字區即時顯示計算結果，確認後仍會自動收斂成最終結果值並同步帶入其他匯率欄位換算。一般購物與免稅購物金額欄位皆套用相同互動。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 14:22 CST
  Updated by: Codex
  Type: UI, Feature
  Summary: 針對行動裝置修正算式輸入鍵盤體驗：一般購物三個金額欄位與免稅購物兩個金額欄位改為使用 app 內建數學鍵盤，避免跳出一般文字鍵盤，同時保留淡色原式、即時結果預覽與確認後收斂成最終數值的流程；編輯中也補上藍色游標提示。
  Files: `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 14:42 CST
  Updated by: Codex
  Type: UI, Infra
  Summary: 將數學鍵盤 / 算式輸入輔助邏輯抽到 `math-ui.js`，把匯率載入、快取、背景刷新與自訂匯率覆寫抽到 `rate-manager.js`，讓 `index.html` 回到偏組裝層；同時更新 service worker cache shell 納入新檔，避免快取漏載。
  Files: `index.html`, `math-ui.js`, `rate-manager.js`, `sw.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 14:51 CST
  Updated by: Codex
  Type: UI
  Summary: 修正行動端算式鍵盤視覺與排版：金額欄位右側加上安全留白避免輸入值被清除鈕遮住，欄位啟動時會自動捲動到較易閱讀的位置，並將自訂數學鍵盤改為和整體玻璃卡片一致的淺色高質感樣式，同時縮減鍵盤開啟時造成的額外留白。
  Files: `index.html`, `math-ui.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 15:01 CST
  Updated by: Claude Code
  Type: UI, Bug Fix
  Summary: 修正鍵盤相關四項問題。(1) 台幣欄被鍵盤遮住 + 中間空白：scrollIntoView 從 block:'center' 改為 block:'start'，讓點選欄位後捲動到畫面頂部，確保 TWD 在鍵盤上方清楚可見，GeneralMode 和 DutyFreeMode 皆修正。(2) 算式截圖效果：移除 absolute 絕對定位的算式覆蓋層，改為正常流布局——算式文字小號顯示於上，計算結果大號顯示於下，視覺乾淨不疊加。(3) 鍵盤顏色：暖化背景漸層（移除偏綠色調，對齊 section-card 暖灰奶油系），DONE 按鈕加入玫瑰系漸層與深玫瑰文字色，提升識別度與主題一致性。(4) SW 版本 bump 至 v5-20260404-1501。
  Files: `index.html`, `math-ui.js`, `sw.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 20:07 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: 修正 DONE 按鈕清空算式結果的問題。ReactDOM.createPortal 把鍵盤掛在 document.body，iOS Safari 中 portal callback 可能捕捉到 stale closure（舊的 genInput/dfInput/activeField props）導致 commitGeneralInput 拿到空值然後 setGenInput({ val: '' })。修法：GeneralMode 和 DutyFreeMode 各增加 useRef 追蹤最新的 genInput/dfInput/activeField，portal 的所有 callback（onInsert/onBackspace/onClear/onDone）全部改為讀 ref.current 而非 closure 捕捉的 props，確保任何時間點按下 DONE 都能拿到最新輸入值。SW v14。
  Files: `index.html`, `sw.js`, `PROJECT_CONTEXT.md`

- 2026-04-04
  Updated at: 2026-04-04 19:52 CST
  Updated by: Claude Code
  Type: Bug Fix, UI
  Summary: 修正 iOS Safari 鍵盤被 header 截斷 + 捲動定位不準兩個根本問題。(1) z-index 截斷：<main> 帶有 backdrop-blur-sm，在 iOS Safari 成為 fixed 子元素的 containing block，導致 MathKeypad 頂部被 header 覆蓋。改用 ReactDOM.createPortal(_, document.body) 把鍵盤掛在 body 根層，完全跳出 main 的 stacking context。(2) 捲動定位：改用 getBoundingClientRect + 動態量測 #math-keypad.offsetHeight，只在欄位底部實際被鍵盤遮住時才觸發捲動（field.bottom > keypadTop - 8），精確讓被點擊欄位顯示在鍵盤正上方，模擬 iOS 原生鍵盤定位效果。SW bump v13。
  Files: `index.html`, `math-ui.js`, `sw.js`, `PROJECT_CONTEXT.md`
