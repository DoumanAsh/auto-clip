'use strict';

function init(settings) {
    //In case of array... cuz firefox
    if (settings.length) settings = settings[0];

    browser.storage.onChanged.addListener(function(changes, area) {
        Object.keys(changes).forEach(function(key) {
            settings[key] = changes[key].newValue;
        });
    });

    function clean_selection_if() {
        if (settings.select_clean) {
            if (window.getSelection) window.getSelection().removeAllRanges();
            else if (document.selection) document.selection.empty();
        }
    }

    document.addEventListener("mouseup", function() {
        var selected_text = window.getSelection().toString().trim();

        if (selected_text) {
            document.execCommand("Copy");
            clean_selection_if();
        }
    });
}

function on_error(error) {
    console.log(`Error: ${error}`);
}

browser.storage.local.get(null).then(init, on_error);
