'use strict'

let storage_get;
if (typeof browser !== 'undefined') {
    //Firefox
    storage_get = function(keys, callback, error_cb) {
        browser.storage.local.get(keys).then(callback, error_cb)
    }
} else if (typeof chrome !== 'undefined') {
    //Chrome
    var browser = chrome
    storage_get = function(keys, callback) {
        chrome.storage.local.get(keys, callback)
    }
} else {
    throw "Unsupported browser type"
}

function init(settings) {
    //In case of array... cuz firefox
    if (settings.length) settings = settings[0]

    function _clean_selection() {
        if (window.getSelection) window.getSelection().removeAllRanges()
        else if (document.selection) document.selection.empty()
    }
    function _copy_img_on_click(target) {
        if (target.tagName === 'IMG') {
            set_clipboard(target.src, "text/plain")
        }
    }

    let clean_selection_if = settings.select_clean ? _clean_selection : function() {}
    let copy_img_on_click_if = settings.copy_img_on_click ? _copy_img_on_click : function() {}

    browser.storage.onChanged.addListener(function(changes, area) {
        Object.keys(changes).forEach(function(key) {
            settings[key] = changes[key].newValue

            if (key === 'select_clean') {
                clean_selection_if = settings[key] ? _clean_selection : function() {}
            }
            else if (key === 'copy_img_on_click') {
                copy_img_on_click_if = settings[key] ? _copy_img_on_click : function() {}
            }
        })
    })

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

    document.addEventListener("click", function(event) {
        copy_img_on_click_if(event.target);
    })

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

storage_get(null, init, on_error)
