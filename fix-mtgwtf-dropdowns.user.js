// ==UserScript==
// @name         Searchable dropdown for MTG.wtf Sealed
// @namespace    anbasement
// @version      3.1
// @description  Fixes duplicate-ID bug so all three set dropdowns get the site's own Select2 search box
// @match        https://mtg.wtf/sealed*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function upgradeDropdown(selectElement, index) {

        if (selectElement.dataset.searchAdded === 'true') {
            return;
        }
        selectElement.dataset.searchAdded = 'true';

        // Give dropdown unique ID
        const uniqueId = 'set_fixed_' + index;
        selectElement.id = uniqueId;

        // Sort the options alphabetically, so browsing is easier
        const options = Array.from(selectElement.options);
        options.sort(function (a, b) {
            return a.text.localeCompare(b.text);
        });
        options.forEach(function (option) {
            selectElement.appendChild(option);
        });

        // If the dropdown is already a Select2 box, skip it.
        if (selectElement.classList.contains('select2-hidden-accessible')) {
            return;
        }

        // Check that jQuery and Select2 are actually available.
        if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
            return;
        }

        // Turn dropdown into a Select2 searchable box.
        jQuery(selectElement).select2();
    }

    function upgradeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.pack_selection select[name="set[]"]');
        dropdowns.forEach(function (dropdown, index) {
            upgradeDropdown(dropdown, index);
        });
        return dropdowns.length;
    }

    const found = upgradeAllDropdowns();

    if (found === 0) {
        let attempts = 0;
        const retryTimer = setInterval(function () {
            attempts++;
            const foundNow = upgradeAllDropdowns();
            if (foundNow > 0 || attempts > 20) {
                clearInterval(retryTimer);
            }
        }, 500);
    }
})();
