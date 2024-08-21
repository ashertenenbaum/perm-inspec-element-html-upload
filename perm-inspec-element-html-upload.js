// ==UserScript==
// @name         permanant inspect element with upload of html files
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  you can upload html files which will be shown when you enter a specific website of your choosing
// @author       asherskc
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';


    var jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
    document.head.appendChild(jQueryScript);


    jQueryScript.onload = function() {
        $(document).ready(function() {

            function savePage() {
                var currentURL = window.location.href;


                $('#custom-popup').remove();


                var pageHTML = document.documentElement.outerHTML;
                localStorage.setItem(currentURL, pageHTML);
                alert('Page saved!');
            }


            function resetPage() {
                var currentURL = window.location.href;
                localStorage.removeItem(currentURL);
                alert('Saved page reset!');
                location.reload();
            }


            function resetAllPages() {
                localStorage.clear();
                alert('All saved pages reset!');
                location.reload();
            }


            function restorePage() {
                var currentURL = window.location.href;
                var savedHTML = localStorage.getItem(currentURL);
                if (savedHTML) {
                    document.open();
                    document.write(savedHTML);
                    document.close();
                }
            }


            function setupKeyListener() {
                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === 'ArrowRight') {
                        console.log('Ctrl + Right Arrow detected');
                        if ($('#custom-popup').length) {
                            $('#custom-popup').remove();
                        } else {
                            var popup = $('<div>', {
                                id: 'custom-popup',
                                css: {
                                    position: 'fixed',
                                    top: '10%',
                                    left: '10%',
                                    width: '300px',
                                    padding: '20px',
                                    backgroundColor: 'white',
                                    border: '1px solid black',
                                    zIndex: 10000,
                                    cursor: 'move'
                                }
                            });


                            var titleBar = $('<div>', {
                                css: {
                                    width: '100%',
                                    padding: '5px',
                                    backgroundColor: '#f0f0f0',
                                    cursor: 'move',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }
                            }).text('Popup Menu');

                            var urlDiv = $('<div>').append($('<strong>').text('URL: '), $('<span>').text(window.location.href));
                            var saveButton = $('<button>').text('Save Page').click(savePage);
                            var resetButton = $('<button>').text('Reset').click(resetPage);
                            var resetAllButton = $('<button>').text('Reset All').click(resetAllPages);
                            var closeButton = $('<button>').text('Close').click(function() { popup.remove(); });

                            var fileInput = $('<input>', { type: 'file' }).change(function(event) {
                                var file = event.target.files[0];
                                if (file) {
                                    var reader = new FileReader();
                                    reader.onload = function(e) {
                                        var htmlContent = e.target.result;
                                        localStorage.setItem(window.location.href, htmlContent);
                                        alert('HTML content uploaded and saved!');
                                    };
                                    reader.readAsText(file);
                                }
                            });

                            popup.append(titleBar, $('<br>'), urlDiv, $('<br>'), saveButton, $('<br>'), resetButton, $('<br>'), resetAllButton, $('<br>'), fileInput, $('<br>'), closeButton);
                            $('body').append(popup);


                            $(popup).draggable({
                                handle: titleBar
                            });
                        }
                    }
                });
            }


            setupKeyListener();


            restorePage();
        });
    };
})();
