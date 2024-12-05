(function () {
    var accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var item = this.parentElement;
            var content = this.nextElementSibling;
            var isExpanded = this.getAttribute('data-expanded') === 'true';

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(function (otherItem) {
                var otherHeader = otherItem.querySelector('.accordion-header');
                var otherContent = otherItem.querySelector('.accordion-content');
                otherHeader.setAttribute('data-expanded', 'false');
                otherContent.classList.add('hidden');
            });

            // Toggle current item if it was not already open
            if (!isExpanded) {
                this.setAttribute('data-expanded', 'true');
                content.classList.remove('hidden');
            }
        });
    });

    // Ensure first accordion is open by default
    var firstHeader = document.querySelector('.accordion-header');
    var firstContent = firstHeader.nextElementSibling;
    firstHeader.setAttribute('data-expanded', 'true');
    firstContent.classList.remove('hidden');
})();

(function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments)
    };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "p8sofyj5fn");

let pickupLinesData = {};
let selectedCategory = null;
let userSelectedCategory = false;

// Enhanced background animations
function createFloatingElement() {
    const elements = [
        // Hearts
        `<svg class="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        // Circles
        `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-300"></div>`,
        // Stars
        `<svg class="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
        // Diamonds
        `<div class="w-8 h-8 transform rotate-45 bg-gradient-to-tr from-pink-300 to-purple-300"></div>`,
        // Sparkles
        `<svg class="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>`
    ];

    const animations = ['float-up', 'float-diagonal', 'float-zigzag'];
    const element = document.createElement('div');
    element.className = `floating-element ${animations[Math.floor(Math.random() * animations.length)]}`;

    if (Math.random() > 0.5) {
        element.classList.add('rotate-animation');
    }
    if (Math.random() > 0.7) {
        element.classList.add('pulse-animation');
    }

    element.style.left = Math.random() * 100 + 'vw';
    element.style.opacity = (Math.random() * 0.3 + 0.1).toString();
    element.innerHTML = elements[Math.floor(Math.random() * elements.length)];

    document.getElementById('animation-container').appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 20000);
}

// Create sparkle effect
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    const size = Math.random() * 20 + 5;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
}

// Create multiple floating elements periodically
setInterval(() => {
    for (let i = 0; i < 2; i++) {
        setTimeout(() => createFloatingElement(), i * 500);
    }
}, 2000);


// Load pickup lines
fetch('data/res.json')
    .then(response => response.json())
    .then(data => {
        pickupLinesData = data;
    });

// Category selection
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        document.querySelectorAll('.category-btn').forEach(b => {
            b.classList.remove('bg-[#DB2777]', 'text-white');
        });
        if (selectedCategory === category) {
            selectedCategory = null;
            userSelectedCategory = false;
        } else {
            selectedCategory = category;
            userSelectedCategory = true;
            btn.classList.add('bg-[#DB2777]', 'text-white');
        }
    });
});

// Generate button
document.getElementById('generateBtn').addEventListener('click', async () => {
    const loadingIcon = document.getElementById('loadingIcon');
    const pickupLineElement = document.getElementById('pickupLine');

    // Clear previous selection if it wasn't user-selected
    if (!userSelectedCategory) {
        selectedCategory = null;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('bg-[#DB2777]', 'text-white');
        });
    }

    // If no category selected, choose random category
    if (!selectedCategory) {
        const categories = Object.keys(pickupLinesData).filter(cat =>
            pickupLinesData[cat] && pickupLinesData[cat].length > 0
        );
        if (categories.length > 0) {
            selectedCategory = categories[Math.floor(Math.random() * categories.length)];
            if (!userSelectedCategory) {
                document.querySelector(`[data-category="${selectedCategory}"]`)?.classList.add('bg-[#DB2777]', 'text-white');
            }
        }
    }

    loadingIcon.classList.remove('hidden');
    document.getElementById("generateBtn").disabled = true;

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!pickupLinesData[selectedCategory] || pickupLinesData[selectedCategory].length === 0) {
        pickupLineElement.textContent = 'No more pickup lines available for this category!';
    } else {
        const lines = pickupLinesData[selectedCategory];
        const randomIndex = Math.floor(Math.random() * lines.length);
        const line = lines[randomIndex];

        // Remove the used line
        pickupLinesData[selectedCategory] = lines.filter((_, index) => index !== randomIndex);
        pickupLineElement.textContent = line;
        pickupLineElement.classList.add("text-black");
        pickupLineElement.classList.remove('text-gray-500')
        createSparkle(window.innerWidth / 2, window.innerHeight / 2);

    }

    loadingIcon.classList.add('hidden')
    document.getElementById("generateBtn").disabled = false;
});

// Copy button
document.getElementById('copyBtn').addEventListener('click', () => {
    const pickupLine = document.getElementById('pickupLine').textContent;
    navigator.clipboard.writeText(pickupLine);

    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
});
