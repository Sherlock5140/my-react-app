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
