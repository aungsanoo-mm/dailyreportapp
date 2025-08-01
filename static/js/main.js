
function viewDetails(reportId) {
    fetch(`/api/report/${reportId}`)
        .then(response => response.json())
        .then(data => {
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Report Date:</strong> ${data.report_date}</p>
                        <p><strong>Project:</strong> ${data.project_no} - ${data.project_name}</p>
                        <p><strong>Staff:</strong> ${data.user_name}</p>
                        <p><strong>Department:</strong> ${data.department}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Task:</strong> ${data.task}</p>
                        <p><strong>Status:</strong> <span class="badge bg-primary">${data.status}</span></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p><strong>Activity:</strong></p>
                        <p>${data.activity}</p>
                    </div>
                </div>
            `;
            const modal = new bootstrap.Modal(document.getElementById('detailModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading report details');
        });
}

// Set today's date as default for date inputs
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        if (!input.value && input.id === 'report_date') {
            input.value = today;
        }
    });
});
