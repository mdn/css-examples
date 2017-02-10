(function () {
    var $styleSelect = document.querySelector('#style-select'),
        $demoList = document.querySelector('#demo-list'),
        $codeContainer = document.querySelector('#code');
    var examples = {
        'cyclic': {
            code: [
                '@counter-style blacknwhite {\n',
                '  system: cyclic;\n',
                '  symbols: ◆ ◇;\n',
                '  suffix: " ";\n',
                '}\n\n',
                'ul {\n',
                '  list-style: blacknwhite;\n',
                '}'
            ].join('')
        },

        'fixed': {
            code: [
                '@counter-style circled-digits {\n',
                '  system: fixed;\n',
                '  symbols:          ;\n',
                '  suffix: " ";\n',
                '}\n\n',
                'ul {\n',
                '  list-style: circled-digits;\n',
                '}'
            ].join('')
        },

        'symbolic': {
            code: [
                '@counter-style cs-symbolic {\n',
                '  system: symbolic;\n',
                "  symbols: '0' '1' '2' '3' '4' '5' '6' '7' '8' '9';\n",
                '  range: 1 15;\n',
                '  suffix: " ";\n',
                '}\n\n',
                'ul {\n',
                '  list-style: cs-symbolic;\n',
                '}'
            ].join('')
        },

        'alphabetic': {
            code: [
                '@counter-style cs-alphabetic {\n',
                '  system: alphabetic;\n',
                "  symbols: A B C D E;\n",
                '  suffix: " ";\n',
                '}\n\n',
                'ul {\n',
                '  list-style: cs-alphabetic;\n',
                '}'
            ].join('')
        },

        'numeric': {
            code: [
                '@counter-style cs-numeric {\n',
                '  system: numeric;\n',
                "  symbols: A B C D E;\n",
                '  suffix: " ";\n',
                '}\n\n',
                'ul {\n',
                '  list-style: cs-numeric;\n',
                '}'
            ].join('')
        },

        'additive': {
            code: [
                '@counter-style cs-additive-roman {\n',
                '  system: additive;\n',
                "  range: 1 100;\n",
                '  additive-symbols: 100 C, 90 XC, 50 L, 40 XL, 10 X, 9 IX, 5 V, 4 IV, 1 I;\n',
                '}\n\n',
                'ul {\n',
                '  list-style: cs-additive-roman;\n',
                '}'
            ].join('')
        },

        'extends': {
            code: [
                '@counter-style cs-extends {\n',
                '  system: extends decimal;\n',
                "  prefix: '(';\n",
                "  suffix: ') ';\n",
                '}\n\n',
                'ul {\n',
                '  list-style: cs-extends;\n',
                '}'
            ].join('')
        },

        'decimal': {
            code: [
                'ul {\n',
                '  list-style: decimal;\n',
                '}',
            ].join('')
        },

        'decimal-leading-zero': {
            code: [
                'ul {\n',
                '  list-style: decimal-leading-zero;\n',
                '}',
            ].join('')
        },

        'arabic-indic': {
            code: [
                'ul {\n',
                '  list-style: arabic-indic;\n',
                '}',
            ].join('')
        },

        'armenian': {
            code: [
                'ul {\n',
                '  list-style: armenian;\n',
                '}',
            ].join('')
        },

        'upper-armenian': {
            code: [
                'ul {\n',
                '  list-style: upper-armenian;\n',
                '}',
            ].join('')
        },

        'lower-armenian': {
            code: [
                'ul {\n',
                '  list-style: lower-armenian;\n',
                '}',
            ].join('')
        },

        'bengali': {
            code: [
                'ul {\n',
                '  list-style: bengali;\n',
                '}',
            ].join('')
        },

        'cambodian': {
            code: [
                'ul {\n',
                '  list-style: cambodian;\n',
                '}',
            ].join('')
        },

        'khmer': {
            code: [
                'ul {\n',
                '  list-style: khmer;\n',
                '}',
            ].join('')
        },

        'cjk-decimal': {
            code: [
                'ul {\n',
                '  list-style: cjk-decimal;\n',
                '}',
            ].join('')
        },

        'devanagiri': {
            code: [
                'ul {\n',
                '  list-style: devanagiri;\n',
                '}',
            ].join('')
        },

        'georgian': {
            code: [
                'ul {\n',
                '  list-style: georgian;\n',
                '}',
            ].join('')
        },

        'gujarati': {
            code: [
                'ul {\n',
                '  list-style: gujarati;\n',
                '}',
            ].join('')
        },

        'gurmukhi': {
            code: [
                'ul {\n',
                '  list-style: gurmukhi;\n',
                '}',
            ].join('')
        },

        'hebrew': {
            code: [
                'ul {\n',
                '  list-style: hebrew;\n',
                '}',
            ].join('')
        },

        'kannada': {
            code: [
                'ul {\n',
                '  list-style: kannada;\n',
                '}',
            ].join('')
        },

        'lao': {
            code: [
                'ul {\n',
                '  list-style: lao;\n',
                '}',
            ].join('')
        },

        'malayalam': {
            code: [
                'ul {\n',
                '  list-style: malayalam;\n',
                '}',
            ].join('')
        },

        'mongolian': {
            code: [
                'ul {\n',
                '  list-style: mongolian;\n',
                '}',
            ].join('')
        },

        'myanmar': {
            code: [
                'ul {\n',
                '  list-style: myanmar;\n',
                '}',
            ].join('')
        },

        'oriya': {
            code: [
                'ul {\n',
                '  list-style: oriya;\n',
                '}',
            ].join('')
        },

        'persian': {
            code: [
                'ul {\n',
                '  list-style: persian;\n',
                '}',
            ].join('')
        },

        'lower-roman': {
            code: [
                'ul {\n',
                '  list-style: lower-roman;\n',
                '}',
            ].join('')
        },

        'upper-roman': {
            code: [
                'ul {\n',
                '  list-style: upper-roman;\n',
                '}',
            ].join('')
        },

        'telugu': {
            code: [
                'ul {\n',
                '  list-style: telugu;\n',
                '}',
            ].join('')
        },

        'thai': {
            code: [
                'ul {\n',
                '  list-style: thai;\n',
                '}',
            ].join('')
        },

        'tibetan': {
            code: [
                'ul {\n',
                '  list-style: tibetan;\n',
                '}',
            ].join('')
        },

        'lower-alpha': {
            code: [
                'ul {\n',
                '  list-style: lower-alpha;\n',
                '}',
            ].join('')
        },

        'lower-latin': {
            code: [
                'ul {\n',
                '  list-style: lower-latin;\n',
                '}',
            ].join('')
        },

        'upper-alpha': {
            code: [
                'ul {\n',
                '  list-style: upper-alpha;\n',
                '}',
            ].join('')
        },

        'upper-latin': {
            code: [
                'ul {\n',
                '  list-style: upper-latin;\n',
                '}',
            ].join('')
        },

        'cjk-earthly-branch': {
            code: [
                'ul {\n',
                '  list-style: cjk-earthly-branch;\n',
                '}',
            ].join('')
        },

        'cjk-heavenly-stem': {
            code: [
                'ul {\n',
                '  list-style: cjk-heavenly-stem;\n',
                '}',
            ].join('')
        },

        'lower-greek': {
            code: [
                'ul {\n',
                '  list-style: lower-greek;\n',
                '}',
            ].join('')
        },

        'hiragana': {
            code: [
                'ul {\n',
                '  list-style: hiragana;\n',
                '}',
            ].join('')
        },

        'hiragana-iroha': {
            code: [
                'ul {\n',
                '  list-style: hiragana-iroha;\n',
                '}',
            ].join('')
        },

        'katakana': {
            code: [
                'ul {\n',
                '  list-style: katakana;\n',
                '}',
            ].join('')
        },

        'katakana-iroha': {
            code: [
                'ul {\n',
                '  list-style: katakana-iroha;\n',
                '}',
            ].join('')
        },

        'disc': {
            code: [
                'ul {\n',
                '  list-style: disc;\n',
                '}',
            ].join('')
        },

        'circle': {
            code: [
                'ul {\n',
                '  list-style: circle;\n',
                '}',
            ].join('')
        },

        'square': {
            code: [
                'ul {\n',
                '  list-style: square;\n',
                '}',
            ].join('')
        },

        'disclosure-open': {
            code: [
                'ul {\n',
                '  list-style: disclosure-open;\n',
                '}',
            ].join('')
        },

        'disclosure-closed': {
            code: [
                'ul {\n',
                '  list-style: disclosure-closed;\n',
                '}',
            ].join('')
        },

        'japanese-informal': {
            code: [
                'ul {\n',
                '  list-style: japanese-informal;\n',
                '}',
            ].join('')
        },

        'japanese-formal': {
            code: [
                'ul {\n',
                '  list-style: japanese-formal;\n',
                '}',
            ].join('')
        },

        'korean-hangul-formal': {
            code: [
                'ul {\n',
                '  list-style: korean-hangul-formal;\n',
                '}',
            ].join('')
        },

        'korean-hanja-informal': {
            code: [
                'ul {\n',
                '  list-style: korean-hanja-informal;\n',
                '}',
            ].join('')
        },

        'korean-hanja-formal': {
            code: [
                'ul {\n',
                '  list-style: korean-hanja-formal;\n',
                '}',
            ].join('')
        },

        'simp-chinese-informal': {
            code: [
                'ul {\n',
                '  list-style: simp-chinese-informal;\n',
                '}',
            ].join('')
        },

        'simp-chinese-formal': {
            code: [
                'ul {\n',
                '  list-style: simp-chinese-formal;\n',
                '}',
            ].join('')
        },

        'trad-chinese-informal': {
            code: [
                'ul {\n',
                '  list-style: trad-chinese-informal;\n',
                '}',
            ].join('')
        },

        'trad-chinese-formal': {
            code: [
                'ul {\n',
                '  list-style: trad-chinese-formal;\n',
                '}',
            ].join('')
        },

        'cjk-ideographic': {
            code: [
                'ul {\n',
                '  list-style: cjk-ideographic;\n',
                '}',
            ].join('')
        },

        'ethiopic-numeric': {
            code: [
                'ul {\n',
                '  list-style: ethiopic-numeric;\n',
                '}',
            ].join('')
        }
    };

    $styleSelect.value = 'cyclic';

    $styleSelect.addEventListener('change', function (e) {
        var selectedKey = $styleSelect.value;
        $codeContainer.innerHTML = examples[selectedKey].code;
        $demoList.className = 'demo-' + selectedKey;
    });
})();