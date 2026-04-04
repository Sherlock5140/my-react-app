(function () {
    const { memo } = React;

    function detectCoarsePointer() {
        try {
            return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        } catch (e) {
            return false;
        }
    }

    function hasExpressionOperators(value) {
        return /[+\-*/()×÷]/.test(String(value || ''));
    }

    function getPreviewNumberText(value, mode, evaluateMathExpression) {
        const evaluated = evaluateMathExpression(value);
        if (isNaN(evaluated)) return '';
        if (mode === 'decimal2') {
            return evaluated.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
        return Math.round(evaluated).toLocaleString('en-US');
    }

    const MathKeypad = memo(({ visible, onInsert, onBackspace, onClear, onDone }) => {
        if (!visible) return null;
        const rows = [
            ['7', '8', '9', '+'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '×'],
            ['.', '0', '⌫', '÷']
        ];
        return (
            React.createElement('div', {
                id: 'math-keypad',
                className: 'fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(env(safe-area-inset-bottom),0.9rem)] animate-fade-in'
            },
                React.createElement('div', {
                    className: 'overflow-hidden rounded-[2.15rem] border border-[rgba(255,255,255,0.86)] bg-[linear-gradient(180deg,rgba(249,248,245,0.97)_0%,rgba(241,239,235,0.96)_100%)] shadow-[0_-24px_56px_rgba(94,90,84,0.16)] backdrop-blur-2xl'
                },
                    React.createElement('div', { className: 'flex items-center gap-2 px-3 pt-3 pb-2' },
                        ['(', ')'].map((key) => React.createElement('button', {
                            key,
                            type: 'button',
                            onClick: () => onInsert(key),
                            className: 'flex-1 rounded-[1rem] border border-[rgba(255,255,255,0.82)] bg-[rgba(255,255,255,0.62)] px-3 py-2 text-[1.05rem] font-semibold text-[#5A5654] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] active:scale-[0.98]'
                        }, key)),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClear,
                            className: 'rounded-[1rem] border border-[rgba(210,204,200,0.88)] bg-[rgba(238,235,231,0.88)] px-4 py-2 text-[0.82rem] font-bold tracking-[0.18em] text-[#7A7470] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] active:scale-[0.98]'
                        }, 'CLEAR'),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onDone,
                            className: 'rounded-[1rem] border border-[rgba(201,166,161,0.38)] bg-[linear-gradient(180deg,rgba(219,196,190,0.32)_0%,rgba(201,166,161,0.26)_100%)] px-4 py-2 text-[0.88rem] font-black tracking-[0.12em] text-[#7A4A46] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_rgba(185,148,142,0.14)] active:scale-[0.98]'
                        }, 'DONE')
                    ),
                    React.createElement('div', { className: 'grid grid-cols-4 gap-px bg-[rgba(210,204,200,0.48)] p-px' },
                        rows.flat().map((key) => {
                            const isOperator = /[+\-×÷]/.test(key);
                            return React.createElement('button', {
                                key,
                                type: 'button',
                                onClick: () => {
                                    if (key === '⌫') {
                                        onBackspace();
                                        return;
                                    }
                                    onInsert(key);
                                },
                                className: `min-h-[4.4rem] bg-[linear-gradient(180deg,rgba(250,249,246,0.99)_0%,rgba(242,240,236,0.95)_100%)] transition shadow-[inset_0_1px_0_rgba(255,255,255,0.94)] active:scale-[0.985] ${isOperator ? 'text-[2.15rem] font-light text-[#B58E88]' : 'text-[2rem] font-light text-[#3C3A38]'} ${key === '⌫' ? 'text-[1.3rem] font-semibold tracking-[0.08em] text-[#7A7470]' : ''}`
                            }, key);
                        })
                    )
                )
            )
        );
    });

    window.APP_MATH_UI = Object.freeze({
        MathKeypad,
        detectCoarsePointer,
        hasExpressionOperators,
        getPreviewNumberText
    });
})();
