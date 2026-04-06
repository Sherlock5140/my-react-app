(function () {
    const { useState, useEffect, useCallback, useMemo } = React;

    function getEmptyCustomRates() {
        return { krw: '', usd: '', usdToCny: '', cny: '' };
    }

    function useRateManager({
        COPY,
        safeGetStorage,
        safeSetStorage,
        RATE_STORAGE_KEY,
        CUSTOM_RATES_STORAGE_KEY,
        RATE_CACHE_TTL,
        AUTO_REFRESH_INTERVAL,
        fetchExchangeRates,
        normalizeRates
    }) {
        const [rates, setRates] = useState({ krw: 0.023, usd: 32.5, usdToCny: 7.2, cny: 4.5 });
        const [customRates, setCustomRates] = useState(() => {
            try {
                const saved = safeGetStorage(CUSTOM_RATES_STORAGE_KEY);
                return saved ? JSON.parse(saved) : getEmptyCustomRates();
            } catch (e) {
                return getEmptyCustomRates();
            }
        });
        const [lastUpdated, setLastUpdated] = useState(COPY.loadingStatus);
        const [isRefreshing, setIsRefreshing] = useState(false);

        useEffect(() => {
            safeSetStorage(CUSTOM_RATES_STORAGE_KEY, JSON.stringify(customRates));
        }, [customRates, CUSTOM_RATES_STORAGE_KEY, safeSetStorage]);

        const fetchRates = useCallback(async () => {
            setIsRefreshing(true);
            setLastUpdated(COPY.updatingStatus);
            setCustomRates(getEmptyCustomRates());
            try {
                const newRates = await fetchExchangeRates();
                const timeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
                setRates(newRates);
                setLastUpdated(timeStr);
                safeSetStorage(RATE_STORAGE_KEY, JSON.stringify({
                    rates: newRates,
                    timeStr,
                    timestamp: Date.now()
                }));
            } catch (e) {
                setLastUpdated(COPY.offlineStatus);
            } finally {
                setTimeout(() => setIsRefreshing(false), 800);
            }
        }, [COPY.offlineStatus, COPY.updatingStatus, RATE_STORAGE_KEY, fetchExchangeRates, safeSetStorage]);

        useEffect(() => {
            const init = () => {
                const savedRates = safeGetStorage(RATE_STORAGE_KEY);
                if (savedRates) {
                    try {
                        const parsed = JSON.parse(savedRates);
                        if (Date.now() - parsed.timestamp < RATE_CACHE_TTL) {
                            setRates(parsed.rates);
                            setLastUpdated(parsed.timeStr);
                            return;
                        }
                    } catch (e) {}
                }
                fetchRates();
            };

            const handleVisibilityChange = () => {
                if (document.visibilityState !== 'visible') return;
                const savedRates = safeGetStorage(RATE_STORAGE_KEY);
                if (!savedRates) return;
                try {
                    const parsed = JSON.parse(savedRates);
                    if (Date.now() - parsed.timestamp > AUTO_REFRESH_INTERVAL) {
                        fetchRates();
                    }
                } catch (e) {}
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            init();
            return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        }, [AUTO_REFRESH_INTERVAL, RATE_CACHE_TTL, RATE_STORAGE_KEY, fetchRates, safeGetStorage]);

        const handleCustomRate = useCallback((type, value) => {
            setCustomRates((prev) => ({
                ...prev,
                [type]: value === undefined || value === null ? '' : value.toString()
            }));
        }, []);

        const effectiveRates = useMemo(() => normalizeRates(rates, customRates), [rates, customRates, normalizeRates]);

        return {
            rates,
            customRates,
            lastUpdated,
            isRefreshing,
            fetchRates,
            handleCustomRate,
            effectiveRates
        };
    }

    window.APP_RATE_MANAGER = Object.freeze({
        getEmptyCustomRates,
        useRateManager
    });
})();
