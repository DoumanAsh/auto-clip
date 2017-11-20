'use strict'

function set_option(event) {
    event.preventDefault()

    var setting = {}

    if (event.target.type === "checkbox") setting[event.target.id] = event.target.checked

    browser.storage.local.set(setting)
}

function init() {
    var settings = document.querySelectorAll("form > input")

    for (var idx = 0; idx < settings.length; idx += 1) {
        settings[idx].addEventListener("change", set_option)
    }

    function set(result) {
        document.getElementById("select_clean").checked = result["select_clean"] || false
        document.getElementById("select_trim").checked = result["select_trim"] || false
        document.getElementById("copy_img_on_click").checked = result["copy_img_on_click"] || false
    }

    function on_error(error) {
        console.log(`Error: ${error}`)
    }

    browser.storage.local.get(null).then(set, on_error)
}


document.addEventListener("DOMContentLoaded", init)
