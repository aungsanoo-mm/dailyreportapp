
let activities = [];

document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modalReportDate').value = today;
    
    // Load activities on page load
    searchActivities();
});

function searchActivities() {
    const staffId = document.getElementById('staffId').value;
    const staffName = document.getElementById('staffName').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    const params = new URLSearchParams();
    if (staffId) params.append('staff_id', staffId);
    if (staffName) params.append('staff_name', staffName);
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    
    fetch(`/api/activities?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            activities = data;
            displayActivities();
            updateResultCount();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading activities');
        });
}

function displayActivities() {
    const tbody = document.getElementById('activitiesTable');
    tbody.innerHTML = '';
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${activity.id}</td>
            <td>${activity.project_name}</td>
            <td>${activity.wbs_no || ''}</td>
            <td>${activity.function_id || ''}</td>
            <td>${activity.category || ''}</td>
            <td>${activity.task || ''}</td>
            <td>${activity.activity}</td>
            <td>${activity.description || ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editActivity(${activity.id})">Edit</button>
                <button class="btn btn-sm btn-outline-success" onclick="viewActivity(${activity.id})">Detail</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateResultCount() {
    document.getElementById('resultCount').textContent = `Total search result count: ${activities.length}`;
}

function resetSearch() {
    document.getElementById('staffId').value = '';
    document.getElementById('staffName').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    searchActivities();
}

function saveActivity() {
    const formData = {
        staff_id: document.getElementById('modalStaffId').value,
        staff_name: document.getElementById('modalStaffName').value,
        project_id: document.getElementById('modalProject').value,
        function_id: document.getElementById('modalFunctionId').value,
        category: document.getElementById('modalCategory').value,
        task: document.getElementById('modalTask').value,
        activity: document.getElementById('modalActivity').value,
        description: document.getElementById('modalDescription').value,
        report_date: document.getElementById('modalReportDate').value
    };
    
    if (!formData.staff_id || !formData.staff_name || !formData.project_id || !formData.activity || !formData.report_date) {
        alert('Please fill in all required fields');
        return;
    }
    
    fetch('/api/activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Activity saved successfully');
            document.getElementById('activityForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addActivityModal'));
            modal.hide();
            searchActivities();
        } else {
            alert('Error saving activity');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving activity');
    });
}

function editActivity(id) {
    alert(`Edit functionality for activity ${id} - To be implemented`);
}

function viewActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (activity) {
        alert(`Activity Details:\n\nStaff: ${activity.staff_name} (${activity.staff_id})\nProject: ${activity.project_name}\nActivity: ${activity.activity}\nDate: ${activity.report_date}`);
    }
}
