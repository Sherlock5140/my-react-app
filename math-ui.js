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
            hintTimerRef.current = setTimeout(() => setShowLongPressHint(false), 2000);
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
                            className: `flex-1 flex items-center justify-end transition-all duration-300 ${showLongPressHint ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`
                        },
                            React.createElement('div', {
                                className: 'flex items-center gap-1.5 bg-[rgba(238,235,231,0.96)] border border-[rgba(210,204,200,0.88)] rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(94,90,84,0.12)]'
                            },
                                React.createElement('span', { className: 'text-[#484846] text-[0.82rem] font-bold' }, '長按'),
                                React.createElement('svg', {
                                    width: 17, height: 17, viewBox: '0 0 24 24',
                                    fill: 'none', stroke: '#7A4A46',
                                    strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round'
                                },
                                    React.createElement('path', { d: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z' }),
                                    React.createElement('line', { x1: 18, y1: 9, x2: 12, y2: 15 }),
                                    React.createElement('line', { x1: 12, y1: 9, x2: 18, y2: 15 })
                                ),
                                React.createElement('span', { className: 'text-[#484846] text-[0.82rem] font-bold' }, '清除內容')
                            )
                        ),
                        React.createElement('button', {
                            type: 'button',
                            onClick: onDone,
                            className: 'rounded-[1rem] border border-[rgba(201,166,161,0.38)] bg-[linear-gradient(180deg,rgba(219,196,190,0.32)_0%,rgba(201,166,161,0.26)_100%)] px-6 py-2 text-[0.88rem] font-black tracking-[0.12em] text-[#7A4A46] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_rgba(185,148,142,0.14)] active:scale-[0.98]'
                        }, 'DONE')
                    ),
                    React.createElement('div', { className: 'grid grid-cols-4 gap-px bg-[rgba(200,196,192,0.32)] p-px' },
                        rows.flat().map((key) => {
                            const isOperator = /[+\-×÷]/.test(key);
                            const isDecimal = key === '.';
                            if (key === '⌫') {
                                return React.createElement('button', {
                                    key,
                                    type: 'button',
                                    onPointerDown: handleBackspaceDown,
                                    onPointerUp: handleBackspaceUp,
                                    onPointerLeave: handleBackspaceLeave,
                                    className: 'min-h-[4.8rem] bg-[linear-gradient(180deg,rgba(219,196,190,0.22)_0%,rgba(201,166,161,0.16)_100%)] transition active:scale-[0.985] flex items-center justify-center select-none'
                                },
                                    React.createElement('svg', {
                                        width: 44, height: 44, viewBox: '0 0 24 24',
                                        fill: 'none', stroke: '#7A4A46',
                                        strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round'
                                    },
                                        React.createElement('path', { d: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z' }),
                                        React.createElement('line', { x1: 18, y1: 9, x2: 12, y2: 15 }),
                                        React.createElement('line', { x1: 12, y1: 9, x2: 18, y2: 15 })
                                    )
                                );
                            }
                            return React.createElement('button', {
                                key,
                                type: 'button',
                                onClick: () => onInsert(key),
                                className: `min-h-[4.8rem] bg-[linear-gradient(180deg,rgba(250,249,246,0.99)_0%,rgba(242,240,236,0.95)_100%)] transition shadow-[inset_0_1px_0_rgba(255,255,255,0.94)] active:scale-[0.985] ${isOperator ? 'text-[2rem] font-semibold text-[#9A7066]' : isDecimal ? 'text-[3rem] font-black text-[#1A1816] leading-none' : 'text-[2rem] font-semibold text-[#1A1816]'}`
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
