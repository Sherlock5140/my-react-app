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
                className: 'fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(env(safe-area-inset-bottom),0.9rem)] animate-fade-in'
            },
                React.createElement('div', {
                    className: 'overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.72)] bg-[rgba(33,37,43,0.94)] shadow-[0_-24px_60px_rgba(17,24,39,0.3)] backdrop-blur-2xl'
                },
                    React.createElement('div', { className: 'flex items-center gap-2 px-3 pt-3 pb-2' },
                        ['(', ')'].map((key) => React.createElement('button', {
                            key,
                            type: 'button',
                            onClick: () => onInsert(key),
                            className: 'flex-1 rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2 text-[1.05rem] font-semibold text-white/90 active:scale-[0.98]'
                        }, key)),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClear,
                            className: 'rounded-[1rem] border border-white/10 bg-white/5 px-4 py-2 text-[0.82rem] font-bold tracking-[0.18em] text-white/70 active:scale-[0.98]'
                        }, 'CLEAR'),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onDone,
                            className: 'rounded-[1rem] bg-white px-4 py-2 text-[0.88rem] font-black tracking-[0.12em] text-[#20242A] active:scale-[0.98]'
                        }, 'DONE')
                    ),
                    React.createElement('div', { className: 'grid grid-cols-4 gap-px bg-white/10 p-px' },
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
                                className: `min-h-[4.4rem] bg-[rgba(40,45,53,0.96)] transition active:scale-[0.985] ${isOperator ? 'text-[2.15rem] font-light text-white/80' : 'text-[2rem] font-light text-white'} ${key === '⌫' ? 'text-[1.3rem] font-semibold tracking-[0.08em]' : ''}`
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
