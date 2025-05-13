document.addEventListener('DOMContentLoaded', function () {
    // Accordion logic
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((accordion, idx) => {
        accordion.addEventListener('click', function () {
            accordions.forEach((acc, i) => {
                acc.classList.remove('active');
                acc.nextElementSibling.classList.remove('show');
            });
            this.classList.add('active');
            this.nextElementSibling.classList.add('show');
        });
    });
    if (accordions.length > 0) {
        accordions[0].classList.add('active');
        accordions[0].nextElementSibling.classList.add('show');
    }

    // Status logic and progress tracker
    const statusOrder = ['Pending', 'Done', 'Revise'];
    const statusClass = {
        'Pending': 'pending',
        'Done': 'done',
        'Revise': 'revise'
    };
    const statusColor = {
        'Pending': '#ff9800',
        'Done': '#4caf50',
        'Revise': '#2196f3'
    };
    function updateStatusAppearance(span, status) {
        span.textContent = status;
        span.className = 'status ' + statusClass[status];
        span.style.background = 'none';
        span.style.color = statusColor[status];
        span.style.border = 'none';
    }
    function updateProgress() {
        // Only count .status in .module-table tbody (lectures)
        const allLectureStatus = Array.from(document.querySelectorAll('.module-table tbody .status'));
        const total = allLectureStatus.length;
        let completed = 0;
        allLectureStatus.forEach(span => {
            if (span.textContent === 'Done' || span.textContent === 'Revise') {
                completed++;
            }
        });
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const percentStr = percent + '%';
        const bar = document.getElementById('progress-bar-fill') || document.getElementById('progress-bar');
        document.getElementById('progress-percent').textContent = percentStr;
        if (bar) bar.style.width = percentStr;
        document.getElementById('progress-count').textContent = completed + '/' + total;
    }
    // Only attach click to .module-table tbody .status (lectures)
    document.querySelectorAll('.module-table tbody .status').forEach(span => {
        updateStatusAppearance(span, 'Pending');
        span.addEventListener('click', function () {
            let current = span.textContent;
            let idx = statusOrder.indexOf(current);
            let next = statusOrder[(idx + 1) % statusOrder.length];
            updateStatusAppearance(span, next);
            updateProgress();
        });
    });
    // Roadmap card status cycling (does not affect progress)
    document.querySelectorAll('.roadmap-card .status').forEach(span => {
        updateStatusAppearance(span, 'Pending');
        span.addEventListener('click', function () {
            let current = span.textContent;
            let idx = statusOrder.indexOf(current);
            let next = statusOrder[(idx + 1) % statusOrder.length];
            updateStatusAppearance(span, next);
        });
    });
    updateProgress();
});

// Add status color classes
const style = document.createElement('style');
style.innerHTML = `
.status.pending { color: #ff9800 !important; background: none !important; border: none !important; }
.status.done { color: #4caf50 !important; background: none !important; border: none !important; }
.status.revise { color: #2196f3 !important; background: none !important; border: none !important; }
`;
document.head.appendChild(style); 