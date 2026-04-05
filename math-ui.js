(function () {
    const { memo, useState, useEffect, useRef } = React;

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
        const [showLongPressHint, setShowLongPressHint] = useState(false);
        const longPressRef = useRef(null);
        const hintTimerRef = useRef(null);

        if (!visible) return null;

        const showHint = () => {
            setShowLongPressHint(true);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            hintTimerRef.current = setTimeout(() => setShowLongPressHint(false), 3000);
        };

        const handleBackspaceDown = (e) => {
            e.preventDefault();
            showHint();
            longPressRef.current = setTimeout(() => {
                longPressRef.current = null;
                onClear();
            }, 500);
        };
        const handleBackspaceUp = () => {
            if (longPressRef.current) {
                clearTimeout(longPressRef.current);
                longPressRef.current = null;
                onBackspace();
            }
        };
        const handleBackspaceLeave = () => {
            if (longPressRef.current) {
                clearTimeout(longPressRef.current);
                longPressRef.current = null;
            }
        };

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
                    React.createElement('div', { className: 'flex items-center px-3 pt-3 pb-2 gap-2' },
                        React.createElement('div', {
                            className: `flex-1 flex items-center justify-end transition-all duration-500 ${showLongPressHint ? 'opacity-100' : 'opacity-0'}`
                        },
                            React.createElement('span', {
                                className: 'text-[12px] font-bold text-[#7A7470] tracking-[0.06em]'
                            }, '長按 ⌫ 清除全部')
                        ),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onDone,
                            className: 'rounded-[1rem] border border-[rgba(201,166,161,0.38)] bg-[linear-gradient(180deg,rgba(219,196,190,0.32)_0%,rgba(201,166,161,0.26)_100%)] px-6 py-2 text-[0.88rem] font-black tracking-[0.12em] text-[#7A4A46] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_rgba(185,148,142,0.14)] active:scale-[0.98]'
                        }, 'DONE')
                    ),
                    React.createElement('div', { className: 'grid grid-cols-4 gap-px bg-[rgba(210,204,200,0.48)] p-px' },
                        rows.flat().map((key) => {
                            const isOperator = /[+\-×÷]/.test(key);
                            if (key === '⌫') {
                                return React.createElement('button', {
                                    key,
                                    type: 'button',
                                    onPointerDown: handleBackspaceDown,
                                    onPointerUp: handleBackspaceUp,
                                    onPointerLeave: handleBackspaceLeave,
                                    className: 'min-h-[4.4rem] bg-[linear-gradient(180deg,rgba(219,196,190,0.22)_0%,rgba(201,166,161,0.16)_100%)] transition active:scale-[0.985] text-[2.8rem] font-black text-[#7A4A46] select-none'
                                }, key);
                            }
                            return React.createElement('button', {
                                key,
                                type: 'button',
                                onClick: () => onInsert(key),
                                className: `min-h-[4.4rem] bg-[linear-gradient(180deg,rgba(250,249,246,0.99)_0%,rgba(242,240,236,0.95)_100%)] transition shadow-[inset_0_1px_0_rgba(255,255,255,0.94)] active:scale-[0.985] ${isOperator ? 'text-[2.15rem] font-normal text-[#8A6A64]' : 'text-[2rem] font-medium text-[#1C1A18]'}`
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
