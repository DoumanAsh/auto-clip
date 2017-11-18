'use strict'

function init(settings) {
    //In case of array... cuz firefox
    if (settings.length) settings = settings[0]

    browser.storage.onChanged.addListener(function(changes, area) {
        Object.keys(changes).forEach(function(key) {
            settings[key] = changes[key].newValue
        })
    })

    function clean_selection_if() {
        if (settings.select_clean) {
            if (window.getSelection) window.getSelection().removeAllRanges()
            else if (document.selection) document.selection.empty()
        }
    }

    function set_clipboard(text, mime) {
        const setClipboardData = evt => {
            document.removeEventListener("copy", setClipboardData, true)
            evt.stopImmediatePropagation()
            evt.preventDefault()
            evt.clipboardData.setData(mime, text)
        }

        document.addEventListener("copy", setClipboardData, true)
        document.execCommand("copy")
    }

    document.addEventListener("mouseup", function() {
        var selected_text = settings.select_trim === true ? window.getSelection().toString().trim() : window.getSelection().toString()

        if (selected_text) {
            set_clipboard(selected_text, "text/plain")
            clean_selection_if()
        }
    })
}

function on_error(error) {
    console.log(`Error: ${error}`)
}

browser.storage.local.get(null).then(init, on_error)
