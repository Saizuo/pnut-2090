document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    
    // Create columns
    for (let n = 1; n <= 40; n++) {
        const column = document.createElement('div');
        column.className = `column col-${n}`;
        
        // Create spans within each column
        for (let i = 0; i < 25; i++) {
            const span = document.createElement('span');
            span.style.animationDelay = `${Math.random() * 8}s`;
            span.style.animationDuration = `${Math.random() * 4 + 2}s`;
            updateCharacter(span);
            column.appendChild(span);
        }
        
        wrapper.appendChild(column);
    }
});

function updateCharacter(span) {
    const value = Math.floor(Math.random() * 255) + 10240;
    span.innerHTML = `&#${value};`;
    requestAnimationFrame(() => {
        setTimeout(() => updateCharacter(span), 100 + Math.random() * 1000);
    });
}