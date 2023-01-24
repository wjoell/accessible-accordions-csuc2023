var rootElement = document.documentElement;
var supportsES6 = function() {
    try {
        new Function("(a = 0) => a");
        return true;
    }
    catch (err) {
        return false;
    }
}();
if (supportsES6) {
    rootElement.classList.add("es6", "js");
    rootElement.classList.remove("no-js", "no-es");

    // SVG Icon Renderer
    let createSVGtoggleIcon = function() {
        let iconWrap = document.createElement('div');
        let toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let iconPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        toggleIcon.setAttribute('viewBox', '0 0 100 100');
        toggleIcon.setAttribute('role', 'presentation');
        toggleIcon.classList.add('accordion-toggle');
        iconWrap.classList.add('icon');
        iconPath.setAttribute(
            'd',
            'M74.7 54.5H54.5v20.1h-9.1V54.5H25.3v-9.1h20.1V25.3h9.1v20.1h20.1l.1 9.1zM90 50c0-22.1-17.9-40-40-40S10 27.9 10 50s17.9 40 40 40 40-17.9 40-40'
        );
        
        toggleIcon.appendChild(iconPath);
        iconWrap.appendChild(toggleIcon);
        return iconWrap;
    }
    /***
     * Create a button wrapper and icon for an accordion heading
     * 
     * @param headingElement {Node} - The heading element to update with button and icon
     * @param useAriaLabel {Boolean} - Use an aria-label on the button for accordion group headings
     * 
     * @returns {Node} - The updated heading element
     */
    let createHeadingButton = function(headingElement, useAriaLabel) {
        if (headingElement.querySelector("span") === null) return; // fail early if there's no text to wrap
        let svgIcon = createSVGtoggleIcon();
        let textWrap = headingElement.querySelector("span");
        let headingTextAttr = textWrap.textContent; // grab a text version for aria-label in case there are child nodes
        let btn = document.createElement("button");
        btn.setAttribute("aria-expanded", "false");
        if (useAriaLabel) {
            btn.setAttribute("aria-label", `Expand all ${headingTextAttr} accordion sections`);
        }
        btn.append(textWrap);
        btn.append(svgIcon);
        headingElement.append(btn);
        return headingElement;
    }

    // Find all accordions; add buttons and icons
    const accordionHeadings = document.querySelectorAll('.accordion-heading');
    if (accordionHeadings !== null) {
        for(let heading of accordionHeadings) {
            createHeadingButton(heading, true);
        }
    }
    const accordionItems = document.querySelectorAll(".accordion-item");
    if (accordionItems !== null) {
        for(let item of accordionItems) {
            if (item.querySelector(".panel-heading") !== null) { // if this fails, fail early
                let panelHeading = item.querySelector(".panel-heading");
                createHeadingButton(panelHeading, false);
                let panelContent = item.querySelector(".accordion-content");
                let panelDisplay = panelHeading.dataset['accordionCollapsed'];
                if (panelDisplay == "true") {
                    panelContent.hidden = true;
                    panelHeading.querySelector('button').setAttribute("aria-expanded", "false");
                } else {
                    panelContent.hidden = false;
                    panelHeading.querySelector('button').setAttribute("aria-expanded", "true");
                }
            }
        }
    }

    // Click event listeners for accordion headings
    document.addEventListener('click', function(event) {
        if (event.target.closest('.panel-heading button')) {
            let target = event.target.closest('button');
            let accordionItem = target.closest('.accordion-item');
            let panelHeading = accordionItem.querySelector('.panel-heading');
            let accordionContent = accordionItem.querySelector('.accordion-content');
            let panelDisplay = accordionContent.hidden;
            if (panelDisplay == true) {
                accordionContent.hidden = false;
                target.setAttribute("aria-expanded", "true");
                panelHeading.dataset['accordionCollapsed'] = "false";
                history.pushState(null, null, `#${panelHeading.getAttribute('id')}`);
                target.closest('.panel-heading').scrollIntoView();
            } else {
                accordionContent.hidden = true;
                target.setAttribute("aria-expanded", "false");
                panelHeading.dataset['accordionCollapsed'] = "true";
                history.replaceState(null, null, ' ');
            }
        }
        if (event.target.closest('.accordion-heading button')) {
            let target = event.target.closest('button');
            let accordionContainer = target.closest('.cpt-accordion');
            let accordionItems = accordionContainer.querySelectorAll('.accordion-item');
            let accordionHeading = accordionContainer.querySelector('.accordion-heading');
            let accordionHeadingButton = accordionHeading.querySelector('button');
            if (accordionHeadingButton.getAttribute("aria-expanded") == "true") {
                accordionHeading.dataset['accordionCollapsed'] = "true";
                accordionHeadingButton.setAttribute("aria-expanded", "false");
                let accordionHeadingButtonLabel = accordionHeadingButton.getAttribute("aria-label");
                accordionHeadingButton.setAttribute("aria-label", accordionHeadingButtonLabel.replace("Collapse", "Expand"));
                history.replaceState(null, null, ' ');
                for (let item of accordionItems) {
                    item.querySelector('.accordion-content').hidden = true;
                    item.querySelector('.panel-heading').dataset['accordionCollapsed'] = "true";
                    item.querySelector('button').setAttribute("aria-expanded", "false");
                }
            } else {
                accordionHeading.dataset['accordionCollapsed'] = "false";
                accordionHeadingButton.setAttribute("aria-expanded", "true");
                let accordionHeadingButtonLabel = accordionHeadingButton.getAttribute("aria-label");
                accordionHeadingButton.setAttribute("aria-label", accordionHeadingButtonLabel.replace("Expand", "Collapse"));
                history.pushState(null, null, `#${accordionHeading.getAttribute('id')}`);
                for (let item of accordionItems) {
                    item.querySelector('.accordion-content').hidden = false;
                    item.querySelector('.panel-heading').dataset['accordionCollapsed'] = "false";
                    item.querySelector('button').setAttribute("aria-expanded", "true");
                }
                accordionHeading.scrollIntoView();
            }
        }
    }, false);

    // If the user presses F3 or Ctrl+F, expand all accordions
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F3' || ((event.ctrlKey || event.metaKey) && event.key === 'f')) {
            const accordions = document.querySelectorAll('.cpt-accordion');
            if (accordions !== null) {
                for (let accordion of accordions) {
                    if (accordion.querySelector('.accordion-heading button') !== null) {
                        let accordionHeading = accordion.querySelector('.accordion-heading');
                        let accordionHeadingButton = accordionHeading.querySelector('button');
                        accordionHeading.dataset['accordionCollapsed'] = "false";
                        accordionHeadingButton.setAttribute("aria-expanded", "true");
                        accordionHeadingButton.setAttribute("aria-label", accordionHeadingButton.getAttribute("aria-label").replace("Expand", "Collapse"));
                    }
                    let accordionItems = accordion.querySelectorAll('.accordion-item');
                    for (let item of accordionItems) {
                        let panelHeading = item.querySelector('.panel-heading');
                        let panelContent = item.querySelector('.accordion-content');
                        let panelHeadingButton = panelHeading.querySelector('button');
                        panelContent.hidden = false;
                        panelHeading.dataset['accordionCollapsed'] = "false";
                        panelHeadingButton.setAttribute("aria-expanded", "true");
                    }
                }
            }
        }
    }, false);

    // Hash events
    if (window.location.hash !== '') {
        let target = document.querySelector(`${window.location.hash} button`);
        if (target !== null && target.closest('.panel-heading, .accordion-heading') !== null) {
            target.click();
            target.closest('.panel-heading, .accordion-heading').scrollIntoView();
        }
    }
}