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
    const accordionHeadings = document.querySelectorAll('.accordion-heading');
    if (accordionHeadings.length > 0) {
        for(let heading of accordionHeadings) {
            let svgIcon = createSVGtoggleIcon();
            let removeSpan = heading.querySelector("span");
            let headingText = removeSpan.innerText;
            let btn = document.createElement("button");
            let textWrap = document.createElement("div");
            textWrap.append(headingText);
            btn.setAttribute("aria-expanded", "false");
            btn.setAttribute("aria-label", "Expand all " + headingText + " accordion sections");
            btn.append(textWrap);
            btn.append(svgIcon);
            heading.append(btn);
            removeSpan.remove();
        }
    }
    const accordionItems = document.querySelectorAll(".accordion-item");
    if (accordionItems.length > 0) {
        for(let item of accordionItems) {
            if (item.querySelector(".panel-heading") !== null) { // if this fails, fail early
                let svgIcon = createSVGtoggleIcon();
                let panelHeading = item.querySelector(".panel-heading"); 
                let removeSpan = panelHeading.querySelector("span");
                let headingText = removeSpan.hasChildNodes() ? removeSpan.innerHTML : removeSpan.innerText;
                let panelContent = item.querySelector(".accordion-content");
                let panelDisplay = panelHeading.dataset['accordionCollapsed'];
                let btn = document.createElement("button");
                let textWrap = document.createElement("div");
                if (panelDisplay == "true") {
                    panelContent.hidden = true;
                    btn.setAttribute("aria-expanded", "false");
                } else {
                    panelContent.hidden = false;
                    btn.setAttribute("aria-expanded", "true");
                }
                textWrap.innerHTML = headingText;
                btn.append(textWrap);
                btn.append(svgIcon);
                panelHeading.append(btn);
                removeSpan.remove();
            }
        }
    }
    document.addEventListener('click', function(event) {
        if (event.target.matches('.panel-heading button, .panel-heading button *')) {
            let target = event.target.closest('button');
            let accordionItem = target.closest('.accordion-item');
            let accordionHeading = accordionItem.querySelector('.panel-heading');
            let accordionContent = accordionItem.querySelector('.accordion-content');
            let panelDisplay = accordionContent.hidden;
            if (panelDisplay == true) {
                accordionContent.hidden = false;
                target.setAttribute("aria-expanded", "true");
                accordionHeading.dataset['accordionCollapsed'] = "false";
            } else {
                accordionContent.hidden = true;
                target.setAttribute("aria-expanded", "false");
                accordionHeading.dataset['accordionCollapsed'] = "true";
            }
        }
        if (event.target.matches('.accordion-heading button, .accordion-heading button *')) {
            let target = event.target.closest('button');
            let accordionContainer = target.closest('.cpt-accordion');
            let accordionItems = accordionContainer.querySelectorAll('.accordion-item');
            let accordionHeading = accordionContainer.querySelector('.accordion-heading');
            let accordionHeadingButton = accordionHeading.querySelector('button');
            if (accordionHeadingButton.getAttribute("aria-expanded") == "true") {
                accordionHeading.dataset['accordionCollapsed'] = "true";
                accordionHeadingButton.setAttribute("aria-expanded", "false");
                for (let item of accordionItems) {
                    item.querySelector('.accordion-content').hidden = true;
                    item.querySelector('.panel-heading').dataset['accordionCollapsed'] = "false";
                    item.querySelector('button').setAttribute("aria-expanded", "false");
                }
            } else {
                accordionHeading.dataset['accordionCollapsed'] = "false";
                accordionHeadingButton.setAttribute("aria-expanded", "true");
                for (let item of accordionItems) {
                    item.querySelector('.accordion-content').hidden = false;
                    item.querySelector('.panel-heading').dataset['accordionCollapsed'] = "true";
                    item.querySelector('button').setAttribute("aria-expanded", "true");
                }
            }
        }
    }, false);
}