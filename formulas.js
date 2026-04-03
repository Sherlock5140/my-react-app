(function () {
    const COPY = {
        installTitle: '安裝到主畫面',
        installBody: '請點擊分享按鈕，選擇「加入主畫面」。',
        confirmLabel: '知道了',
        strategyTitle: '策略設定',
        strategyEditingPrefix: '正在設定：',
        strategyHint: '設定滿額禮與加碼 (所有項目皆可自訂)。',
        strategySave: '儲存設定',
        strategyNamePlaceholder: '新策略',
        capLabel: '上限',
        thresholdLabel: '低消',
        twdLabel: 'TWD',
        pointsLabel: '點',
        cardSettingsTitle: '信用卡設定',
        cardNamePlaceholder: '卡片名稱',
        smartStrategyBadge: '智慧攻略',
        baseRewardLabel: '基本回饋',
        linePointShort: 'LINE P',
        cashRewardShort: '現金',
        stackStrategyLabel: '疊加自訂策略',
        configureLabel: '設定',
        shoppingBindingLabel: '行動支付/綁定',
        bankAccountBindingLabel: '綁定銀行帳戶/TWQR (免1.5%)',
        mobileSpreadLabel: '額外平台手續費/匯差',
        foreignFeeLabel: '海外手續費',
        finishSettings: '完成設定',
        receiptTitle: '成本試算明細',
        copyLabel: '複製',
        copiedLabel: '已複製',
        paymentAmountLabel: '付款金額',
        feeLabelPrefix: '+ 刷卡手續費',
        totalSavedLabel: '總回饋價值',
        finalCostLabel: '最終入手價 (TWD)',
        thresholdHintTitle: '消費門檻提示',
        thresholdHintBody: ({ currency, diff, name }) => `再消費約 ${currency} ${diff.toLocaleString()}，可觸發「${name}」。`,
        rewardExcludingFee: '不含手續費',
        postTaxBadge: '事後退稅 (機場/市區)',
        immediateBadge: '現場折抵',
        immediateAppliedLabel: '現場折抵（結帳時已扣）',
        chargedAmountLabel: '實際刷卡金額',
        refundErrorPrefix: '預估誤差: ±NT$',
        taxSettingsLabel: '退稅設定',
        taxAutoHint: '自動模式會在背景綜合 Global Blue、Global Tax Free、Easy Tax Refund 與加權平均模型，自動輸出較穩定的估算值；實際金額仍以店家與退稅單為準。',
        taxManualLabel: '手動退稅額',
        taxManualHint: '依退稅單或店家結帳畫面的實際退稅額輸入（KRW）。',
        taxModeOptions: [
            { key: 'auto', label: '自動' },
            { key: 'manual', label: '手動' },
            { key: 'off', label: '關閉' }
        ],
        refundMethodOptions: [
            { key: 'airport', label: '事後退稅' },
            { key: 'immediate', label: '現場折抵' }
        ],
        arbitrageTitle: '刷卡回饋套利',
        airportBetterActive: (netGain) => `已選【事後退稅】，比現場折抵多省約 NT$${netGain}`,
        airportBetterSwitch: (netGain) => `改選【事後退稅】可多省約 NT$${netGain}`,
        immediateBetterActive: (netGain) => `已選【現場折抵】，比事後退稅多省約 NT$${netGain}`,
        immediateBetterSwitch: (netGain) => `改選【現場折抵】可多省約 NT$${netGain}`,
        methodsNearEqual: '兩種退稅方式差異很小，可依現場流程方便性選擇',
        methodDiffFormula: '差額來源 = 退稅額 × (回饋率 - 成本率)',
        taxThresholdWarning: '未達退稅門檻 (需滿 15,000 KRW)',
        overLimitAdvice: '⚠️ 超過 100 萬：已達現場折抵上限，請改用【事後退稅】',
        dutyFreeOriginalLabel: '吊牌原價 (USD)',
        dutyFreePaidLabel: '打折後實付款 (USD)',
        dutyFreeInstantRatePrefix: '≈ 即時匯率換算 NT$',
        dutyFreeRateLabel: '匯率',
        dutyFreeSafe: '安全',
        dutyFreeWarning: '注意',
        dutyFreeRebateLabel: '返點設定 (Rebate %)',
        screenshotMode: 'Screenshot Mode',
        exitScreenshotMode: 'Exit Screenshot Mode',
        appSubtitle: 'Calm travel calculator for Seoul shopping',
        deleteConfirm: '確定刪除？',
        loadingStatus: '載入中...',
        updatingStatus: '更新中...',
        offlineStatus: '離線模式',
        unknownCard: '未知卡片',
        discountFold: (value) => `${value}折`,
        modeButtons: {
            general: '一般',
            dutyfree: '免稅'
        },
        rateHeaderGeneral: {
            forward: 'KRW ➔ TWD',
            inverse: 'TWD ➔ KRW',
            usdToTwd: 'USD ➔ TWD'
        },
        rateHeaderDutyFree: {
            usdToCny: 'USD ➔ CNY',
            cnyToTwd: 'CNY ➔ TWD',
            usdToTwd: 'USD ➔ TWD'
        },
        rateFooterPrefix: '1 KRW ≈',
        rateFooterSuffix: 'TWD',
        cardTypes: [
            { key: 'jcb', label: 'JCB', note: '(原始)' },
            { key: 'visa', label: 'VISA', note: '(+1.0%)' },
            { key: 'master', label: 'MASTER', note: '(+0.8%)' }
        ],
        currencies: {
            usd: { label: 'USD', prefix: '$', emoji: '🇺🇸' },
            target: { label: 'KRW', prefix: '₩', emoji: '🇰🇷' },
            twd: { label: 'TWD', prefix: 'NT', emoji: '🇹🇼' }
        },
        dutyFreeDiscounts: [95, 90, 85, 80]
    };

    const STORAGE_KEY = 'shopping_app_v125_settings';
    const STRATEGY_STORAGE_KEY = 'shopping_app_v102_strategies_map';
    const RATE_STORAGE_KEY = 'shopping_app_v87_rates';
    const CUSTOM_RATES_STORAGE_KEY = 'shopping_app_v87_custom_rates';
    const RATE_CACHE_TTL = 3600 * 1000;
    const AUTO_REFRESH_INTERVAL = 60 * 60 * 1000;
    const KOREA_REFUND_TABLE_GLOBAL_BLUE = [
        { max: 29999, refund: 1000 },
        { max: 49999, refund: 1500 },
        { max: 74999, refund: 3500 },
        { max: 99999, refund: 5000 },
        { max: 124999, refund: 6500 },
        { max: 149999, refund: 8000 },
        { max: 174999, refund: 9500 },
        { max: 199999, refund: 11000 },
        { max: 224999, refund: 12500 },
        { max: 249999, refund: 14000 },
        { max: 274999, refund: 16000 },
        { max: 299999, refund: 17000 },
        { max: 324999, refund: 19000 },
        { max: 349999, refund: 21000 },
        { max: 374999, refund: 23000 },
        { max: 399999, refund: 24500 },
        { max: 424999, refund: 26000 },
        { max: 449999, refund: 28000 },
        { max: 474999, refund: 30000 },
        { max: 499999, refund: 32000 }
    ];
    const KOREA_REFUND_TABLE_GLOBAL_TAX_FREE = [
        { max: 29999, refund: 1000 },
        { max: 49999, refund: 2000 },
        { max: 74999, refund: 3000 },
        { max: 99999, refund: 5000 },
        { max: 124999, refund: 7000 },
        { max: 149999, refund: 8000 },
        { max: 174999, refund: 9000 },
        { max: 199999, refund: 10000 },
        { max: 224999, refund: 12200 },
        { max: 249999, refund: 13000 },
        { max: 274999, refund: 15000 },
        { max: 299999, refund: 17000 },
        { max: 324999, refund: 19000 },
        { max: 349999, refund: 21000 },
        { max: 374999, refund: 23000 },
        { max: 399999, refund: 25000 },
        { max: 424999, refund: 27000 },
        { max: 449999, refund: 28000 },
        { max: 474999, refund: 30000 },
        { max: 499999, refund: 32000 }
    ];
    const KOREA_REFUND_TABLE_EASY_TAX = [
        { max: 29999, refund: 1000 },
        { max: 49999, refund: 2000 },
        { max: 74999, refund: 3000 },
        { max: 99999, refund: 5000 },
        { max: 124999, refund: 6000 },
        { max: 149999, refund: 8000 },
        { max: 174999, refund: 9000 },
        { max: 199999, refund: 10000 },
        { max: 224999, refund: 12000 },
        { max: 249999, refund: 13000 },
        { max: 274999, refund: 15000 },
        { max: 299999, refund: 17000 },
        { max: 324999, refund: 19000 },
        { max: 349999, refund: 21000 },
        { max: 374999, refund: 23000 },
        { max: 399999, refund: 25000 },
        { max: 424999, refund: 27000 },
        { max: 449999, refund: 28000 },
        { max: 474999, refund: 30000 },
        { max: 499999, refund: 32000 }
    ];
    const KOREA_REFUND_TABLE_WEIGHTED = [
        { max: 29999, refund: 1000 },
        { max: 49999, refund: 1800 },
        { max: 74999, refund: 3200 },
        { max: 99999, refund: 5000 },
        { max: 124999, refund: 6500 },
        { max: 149999, refund: 8000 },
        { max: 174999, refund: 9200 },
        { max: 199999, refund: 10300 },
        { max: 224999, refund: 12200 },
        { max: 249999, refund: 13500 },
        { max: 274999, refund: 15500 },
        { max: 299999, refund: 17000 },
        { max: 324999, refund: 19000 },
        { max: 349999, refund: 21000 },
        { max: 374999, refund: 23000 },
        { max: 399999, refund: 24800 },
        { max: 424999, refund: 26500 },
        { max: 449999, refund: 28000 },
        { max: 474999, refund: 30000 },
        { max: 499999, refund: 32000 }
    ];

    const DEFAULT_STRATEGIES_MAP = {
        1: [{ id: 'c1', name: '銀行加碼', rate: 2.2, cap: 660, capUnit: 'points', active: true, type: 'general', minSpend: 0, thresholdUnit: 'twd' }, { id: 'c2', name: 'VISA 滿額', rate: 10.0, cap: 3000, capUnit: 'points', active: true, type: 'threshold', minSpend: 190000, thresholdUnit: 'foreign' }],
        2: [{ id: 'f1', name: '韓國加碼', rate: 3.0, cap: 600, capUnit: 'points', active: true, type: 'general', minSpend: 0, thresholdUnit: 'twd' }],
        3: [{ id: 'q1', name: '切換權益', rate: 3.0, cap: 0, capUnit: 'twd', active: true, type: 'general', minSpend: 0, thresholdUnit: 'twd' }],
        4: [{ id: 't1', name: '活動回饋', rate: 10.0, cap: 500, capUnit: 'points', active: true, type: 'general', minSpend: 0, thresholdUnit: 'twd' }]
    };

    const DEFAULT_SETTINGS = {
        country: 'KR', mode: 'general', fee: 1.5, reward: 3.0, rewardType: 'points',
        taxMode: 'auto', refundMethod: 'airport', dutyFreeRebate: 36, manualRefundKRW: '',
        cardPresets: [
            { id: 1, name: '中信 LINE Pay', type: 'visa', reward: 2.8, rewardType: 'points', isMobilePay: false, isBankAccount: false, mobileSpread: 0, enabled: true, useStrategy: true },
            { id: 2, name: '富邦 J', type: 'jcb', reward: 3.0, rewardType: 'points', isMobilePay: false, enabled: true, useStrategy: false },
            { id: 3, name: '國泰CUBE', type: 'master', reward: 3.0, rewardType: 'cash', isMobilePay: false, enabled: true, useStrategy: false },
            { id: 4, name: '台灣Pay', type: 'visa', reward: 2.0, rewardType: 'cash', isMobilePay: true, isBankAccount: true, mobileSpread: 1.0, enabled: true, useStrategy: false }
        ],
        activePresetId: 1
    };

    function safeGetStorage(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    function safeSetStorage(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }

    function lookupRefundFromTable(amount, table, fallbackRate = 0.064) {
        if (!amount || amount < 15000) return 0;
        const matched = table.find((row) => amount <= row.max);
        if (matched) return matched.refund;
        return Math.round((amount * fallbackRate) / 100) * 100;
    }

    function estimateKoreaRefundKRW(amount) {
        if (!amount || amount < 15000) return 0;
        const providerValues = [
            lookupRefundFromTable(amount, KOREA_REFUND_TABLE_GLOBAL_BLUE, 0.062),
            lookupRefundFromTable(amount, KOREA_REFUND_TABLE_GLOBAL_TAX_FREE, 0.065),
            lookupRefundFromTable(amount, KOREA_REFUND_TABLE_EASY_TAX, 0.064),
            lookupRefundFromTable(amount, KOREA_REFUND_TABLE_WEIGHTED, 0.064)
        ].sort((a, b) => a - b);
        const centerAverage = (providerValues[1] + providerValues[2]) / 2;
        return Math.round(centerAverage / 100) * 100;
    }

    function calcRewardSystem({ totalNTD, targetAmount, strategies, rates, country, baseRate = 0 }) {
        let totalStrategyPoints = 0;
        let nextThresholdMsg = null;
        let minDiffToNext = Infinity;
        const capWarnings = [];
        const basePoints = Math.floor(totalNTD * (baseRate / 100));
        const activeStrategies = strategies.filter((s) => s.active);
        const currentCurrencyRate = rates.krw;

        activeStrategies.forEach((st) => {
            const threshold = st.minSpend || 0;
            let currentAmountForCheck = 0;
            let currencyLabel = '';
            if (st.thresholdUnit === 'foreign') {
                currentAmountForCheck = targetAmount;
                currencyLabel = 'KRW';
            } else {
                currentAmountForCheck = totalNTD;
                currencyLabel = 'TWD';
            }
            if (currentAmountForCheck < threshold) {
                const diff = threshold - currentAmountForCheck;
                if (diff > 0 && diff < minDiffToNext) {
                    minDiffToNext = diff;
                    const projectedTWD = st.thresholdUnit === 'foreign' ? (threshold * currentCurrencyRate) : threshold;
                    let effectiveCapTWD = Infinity;
                    if (st.cap && st.cap > 0) effectiveCapTWD = st.capUnit === 'twd' ? st.cap : (st.cap / (st.rate / 100));
                    const eligibleTWD = Math.min(projectedTWD, effectiveCapTWD);
                    const estimatedGain = Math.floor(eligibleTWD * (st.rate / 100));
                    nextThresholdMsg = { name: st.name, diff: Math.ceil(diff), potentialGain: estimatedGain, currency: currencyLabel };
                }
                return;
            }

            let effectiveCapTWD = Infinity;
            if (st.cap && st.cap > 0) effectiveCapTWD = st.capUnit === 'twd' ? st.cap : (st.cap / (st.rate / 100));
            const eligibleTWD = Math.min(totalNTD, effectiveCapTWD);
            const potentialPoints = totalNTD * (st.rate / 100);
            const actualPoints = eligibleTWD * (st.rate / 100);
            if (potentialPoints > 0 && (potentialPoints - actualPoints) / potentialPoints > 0.3) {
                capWarnings.push({ name: st.name, loss: Math.floor(potentialPoints - actualPoints) });
            }
            totalStrategyPoints += actualPoints;
        });

        const finalTotalPoints = basePoints + Math.floor(totalStrategyPoints);
        const totalRate = totalNTD > 0 ? (finalTotalPoints / totalNTD) * 100 : 0;
        return {
            totalPoints: finalTotalPoints,
            totalRate: isNaN(totalRate) ? '0.0' : totalRate.toFixed(1),
            suggestionMsg: nextThresholdMsg,
            mode: 'dynamic',
            actPoints: Math.floor(totalStrategyPoints),
            basePoints,
            capWarnings
        };
    }

    function normalizeRates(rates, customRates) {
        return {
            ...rates,
            krw: parseFloat(customRates.krw) || rates.krw,
            usd: parseFloat(customRates.usd) || rates.usd,
            usdToCny: parseFloat(customRates.usdToCny) || rates.usdToCny,
            cny: parseFloat(customRates.cny) || rates.cny
        };
    }

    function buildCalcResult({ settings, genInput, dfInput, effectiveRates, allStrategies }) {
        const rawInput = settings.mode === 'general' ? genInput.val : dfInput.payVal;
        if (!rawInput) return { twdBase: 0 };
        const num = parseFloat(rawInput);
        if (isNaN(num)) return { twdBase: 0 };

        const spread = settings.cardType === 'jcb' ? 0 : (settings.cardType === 'master' ? 0.8 : 1.0);
        const bankSpread = 1 + (spread / 100);
        const rUsd = effectiveRates.usd * bankSpread;

        let twdBase = 0;
        let targetAmount = 0;
        let displayOriginal = 0;
        let displayCode = '';
        let targetRate = 0;
        if (settings.mode === 'general') {
            targetRate = effectiveRates.krw * bankSpread;
            if (genInput.type === 'twd') {
                twdBase = num;
                targetAmount = twdBase / targetRate;
            } else if (genInput.type === 'usd') {
                twdBase = num * rUsd;
                targetAmount = twdBase / targetRate;
            } else {
                targetAmount = num;
                twdBase = num * targetRate;
            }
            displayOriginal = targetAmount;
            displayCode = 'KRW';
        } else {
            twdBase = num * rUsd;
            targetAmount = num;
            displayCode = 'USD';
            displayOriginal = num;
        }

        const grossTwdBase = twdBase;
        const grossTargetAmount = targetAmount;

        let refundTwd = 0;
        let refundNative = 0;
        if (settings.mode === 'general') {
            if (settings.taxMode === 'manual') {
                refundNative = Math.max(0, parseFloat(settings.manualRefundKRW) || 0);
            } else if (settings.taxMode === 'auto') {
                refundNative = estimateKoreaRefundKRW(grossTargetAmount);
            }
            refundTwd = Math.round(refundNative * effectiveRates.krw);
        } else {
            const rebateUsd = num * (settings.dutyFreeRebate / 100);
            refundTwd = Math.round(rebateUsd * effectiveRates.usdToCny * effectiveRates.cny);
        }

        const isImmediateTaxRefund = settings.mode === 'general' && settings.taxMode !== 'off' && settings.refundMethod === 'immediate';
        const paymentTargetAmount = isImmediateTaxRefund ? Math.max(grossTargetAmount - refundNative, 0) : grossTargetAmount;
        const paymentTwdBase = isImmediateTaxRefund ? Math.round(paymentTargetAmount * targetRate) : grossTwdBase;
        const postPurchaseRefundTwd = isImmediateTaxRefund ? 0 : refundTwd;

        const displayRefund = refundTwd;
        const effectiveFee = settings.isMobilePay && settings.isBankAccount ? 0 : settings.fee;
        const mobileSpread = settings.mobileSpread ?? (settings.isBankAccount ? 1 : 0);
        const spreadCost = settings.isMobilePay ? paymentTwdBase * (mobileSpread / 100) : 0;
        const feeAmount = Math.round(paymentTwdBase * (effectiveFee / 100));

        let rewardAmount = 0;
        let campaignData = null;
        const activeCard = settings.cardPresets.find((c) => c.id === settings.activePresetId);

        let strategyTargetAmount = paymentTargetAmount;
        if (settings.mode === 'dutyfree') {
            strategyTargetAmount = (num * effectiveRates.usd) / effectiveRates.krw;
        }

        if (activeCard && activeCard.useStrategy) {
            const calculationStrategies = allStrategies[settings.activePresetId] || [];
            const v95 = calcRewardSystem({
                totalNTD: paymentTwdBase,
                targetAmount: strategyTargetAmount,
                strategies: calculationStrategies,
                rates: effectiveRates,
                country: settings.country,
                baseRate: activeCard.reward
            });
            rewardAmount = v95.totalPoints;
            campaignData = { v95 };
        } else {
            rewardAmount = Math.round(paymentTwdBase * (settings.reward / 100));
            campaignData = { effectiveRate: settings.reward };
        }

        const finalCost = Math.round(paymentTwdBase + feeAmount + spreadCost - rewardAmount - postPurchaseRefundTwd);
        const totalSaved = Math.round(grossTwdBase - finalCost);
        const refundLabel = settings.mode === 'dutyfree'
            ? `返點 (${settings.dutyFreeRebate}% | USD>CNY>TWD)`
            : `退稅 (${grossTwdBase > 0 ? ((displayRefund / grossTwdBase) * 100).toFixed(1) : 0}%)`;

        return {
            twdBase: Math.round(paymentTwdBase),
            grossTwdBase: Math.round(grossTwdBase),
            finalCost,
            totalSaved,
            refundTwd,
            feeAmount,
            rewardAmount,
            isWaived: effectiveFee === 0,
            spreadCost: Math.round(spreadCost),
            targetAmount: grossTargetAmount,
            displayOriginal,
            displayCode,
            refundLabel,
            displayRefund,
            isImmediateTaxRefund,
            campaignData,
            totalRate: campaignData && campaignData.v95 ? campaignData.v95.totalRate : settings.reward
        };
    }

    function buildAdvice(settings, calcResult) {
        if (settings.mode === 'general' && calcResult.targetAmount > 1000000 && settings.refundMethod === 'immediate') {
            return { type: 'warn', msg: COPY.overLimitAdvice };
        }
        return null;
    }

    function getDisplayVal(field, genInput, rates) {
        if (!genInput.val || isNaN(parseFloat(genInput.val))) return '';
        if (genInput.type === field) return genInput.val;
        const num = parseFloat(genInput.val);
        const rKrw = rates.krw;
        const rUsd = rates.usd;
        const targetRate = rKrw || 1;
        let twdBase = 0;
        if (genInput.type === 'usd') twdBase = num * rUsd;
        else if (genInput.type === 'twd') twdBase = num;
        else twdBase = num * targetRate;
        if (field === 'usd') return (twdBase / rUsd).toFixed(2);
        if (field === 'twd') return Math.round(twdBase).toString();
        if (field === 'target') return Math.round(twdBase / targetRate).toString();
        return '';
    }

    function getCopyText(displayOriginal, displayCode, feeAmount, spreadCost, rewardAmount, displayRefund, finalCost) {
        return `[購黑皮試算]\n付款: ${Math.round(displayOriginal).toLocaleString()} ${displayCode}\n+手續費: ${feeAmount + spreadCost}\n-回饋: ${rewardAmount}\n-退稅/返點: ${displayRefund}\n=入手價: NT$${finalCost.toLocaleString()}`;
    }

    function getRewardLabel(rewardType) {
        return rewardType === 'points' ? 'LINE POINTS' : '現金回饋';
    }

    function getErrorMargin(displayRefund) {
        return Math.max(5, Math.round(displayRefund * 0.015));
    }

    function getDutyFreeDiscountStatus(tagPrice, payVal) {
        if (!tagPrice || !payVal) return null;
        const original = parseFloat(tagPrice);
        const finalValue = parseFloat(payVal);
        if (isNaN(original) || isNaN(finalValue) || original === 0) return null;
        const pct = Math.round((finalValue / original) * 100);
        const fold = pct % 10 === 0 ? pct / 10 : (pct / 10).toFixed(1);
        return {
            isSafe: (finalValue / original) >= 0.7,
            text: `${(finalValue / original) >= 0.7 ? COPY.dutyFreeSafe : COPY.dutyFreeWarning} (${fold}折)`
        };
    }

    function applyDutyFreeDiscount(tagPrice, percent) {
        if (!tagPrice) return '';
        const original = parseFloat(tagPrice);
        if (isNaN(original)) return '';
        return (original * (percent / 100)).toFixed(2).replace(/\.00$/, '');
    }

    function adjustDutyFreeRebate(currentValue, delta) {
        return Math.max(0, Math.min(40, (parseFloat(currentValue) || 0) + delta));
    }

    function convertGeneralInputToDutyFreeTagPrice(genInput, effectiveRates) {
        if (!genInput.val) return '';
        const num = parseFloat(genInput.val);
        if (isNaN(num)) return '';
        let usdVal = 0;
        if (genInput.type === 'usd') usdVal = num;
        else if (genInput.type === 'twd') usdVal = num / effectiveRates.usd;
        else usdVal = (num * effectiveRates.krw) / effectiveRates.usd;
        return usdVal > 0 ? usdVal.toFixed(2) : '';
    }

    async function fetchExchangeRates() {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        try {
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD?t=${Date.now()}`, { signal: controller.signal });
            const data = await res.json();
            if (!data.rates.TWD) throw new Error('Missing rates');
            return {
                usd: data.rates.TWD,
                krw: data.rates.TWD / data.rates.KRW,
                cny: data.rates.TWD / data.rates.CNY,
                usdToCny: data.rates.CNY
            };
        } finally {
            clearTimeout(id);
        }
    }

    window.APP_CORE = Object.freeze({
        COPY,
        STORAGE_KEY,
        STRATEGY_STORAGE_KEY,
        RATE_STORAGE_KEY,
        CUSTOM_RATES_STORAGE_KEY,
        RATE_CACHE_TTL,
        AUTO_REFRESH_INTERVAL,
        DEFAULT_STRATEGIES_MAP,
        DEFAULT_SETTINGS,
        safeGetStorage,
        safeSetStorage,
        calcRewardSystem,
        normalizeRates,
        buildCalcResult,
        buildAdvice,
        getDisplayVal,
        getCopyText,
        getRewardLabel,
        getErrorMargin,
        getDutyFreeDiscountStatus,
        applyDutyFreeDiscount,
        adjustDutyFreeRebate,
        convertGeneralInputToDutyFreeTagPrice,
        fetchExchangeRates,
        estimateKoreaRefundKRW
    });
})();
