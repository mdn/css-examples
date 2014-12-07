(function () {
    var $styleSelect = document.querySelector('#style-select'),
        $demoList = document.querySelector('#demo-list'),
        $codeContainer = document.querySelector('#code');
    var examples = {
        'cyclic': {
            code: [
                '@counter-style alternating {\n',
                '  system: cyclic;\n',
                '  symbols: ◆ ◇;\n',
                '  suffix: " ";\n',
                '}'
            ].join('')
        },
        'fixed': {
            code: [
                '@counter-style circled-digits {\n',
                '  system: fixed;\n',
                '  symbols:          ;\n',
                '  suffix: " ";\n',
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
                '}'
            ].join('')
        },
        'lower-alpha': {
            code: [
                'ul {\n',
                '  list-style: lower-alpha;\n',
                '}'
            ].join('')
        },
        'upper-alpha': {
            code: [
                "ul {\n",
                '  list-style: upper-alpha;\n',
                '}'
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