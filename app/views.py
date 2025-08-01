from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from datetime import datetime, date
from app.models import db, DailyReport, Project, User

views_bp = Blueprint('views', __name__)

@views_bp.route('/')
@login_required
def dashboard():
    return render_template('dashboard.html')

@views_bp.route('/daily-activity')
@login_required
def daily_activity():
    # Get filter parameters
    staff_id = request.args.get('staff_id', '')
    staff_name = request.args.get('staff_name', '')
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')
    attendance = request.args.get('attendance', '')
    approve_status = request.args.get('approve_status', '')

    # Build query
    query = DailyReport.query.join(User).join(Project)

    if staff_id:
        query = query.filter(User.id == staff_id)
    if staff_name:
        query = query.filter(User.username.contains(staff_name))
    if date_from:
        query = query.filter(DailyReport.report_date >= datetime.strptime(date_from, '%Y-%m-%d').date())
    if date_to:
        query = query.filter(DailyReport.report_date <= datetime.strptime(date_to, '%Y-%m-%d').date())
    if approve_status:
        query = query.filter(DailyReport.status == approve_status)

    reports = query.all()
    users = User.query.all()
    projects = Project.query.all()

    return render_template('daily_activity.html', 
                         reports=reports, 
                         users=users, 
                         projects=projects,
                         filters={
                             'staff_id': staff_id,
                             'staff_name': staff_name,
                             'date_from': date_from,
                             'date_to': date_to,
                             'attendance': attendance,
                             'approve_status': approve_status
                         })

@views_bp.route('/add-report', methods=['GET', 'POST'])
@login_required
def add_report():
    if request.method == 'POST':
        report = DailyReport(
            report_date=datetime.strptime(request.form['report_date'], '%Y-%m-%d').date(),
            user_id=current_user.id,
            project_id=request.form['project_id'],
            task=request.form['task'],
            activity=request.form['activity'],
            department=request.form['department'],
            status=request.form.get('status', 'In Progress')
        )
        db.session.add(report)
        db.session.commit()
        flash('Report added successfully')
        return redirect(url_for('views.daily_activity'))

    projects = Project.query.all()
    return render_template('add_report.html', projects=projects)

@views_bp.route('/api/report/<int:report_id>')
@login_required
def get_report(report_id):
    report = DailyReport.query.get_or_404(report_id)
    return jsonify({
        'id': report.id,
        'report_date': report.report_date.isoformat(),
        'task': report.task,
        'activity': report.activity,
        'department': report.department,
        'status': report.status,
        'project_name': report.project.project_name,
        'project_no': report.project.project_no,
        'user_name': report.user.username
    })

@views_bp.route('/projects')
@login_required
def projects():
    projects = Project.query.all()
    return render_template('projects.html', projects=projects)

@views_bp.route('/add-project', methods=['GET', 'POST'])
@login_required
def add_project():
    if request.method == 'POST':
        project = Project(
            project_name=request.form['project_name'],
            project_no=request.form['project_no'],
            wbs_no=request.form['wbs_no'],
            function_id=request.form['function_id'],
            category=request.form['category'],
            description=request.form['description']
        )
        db.session.add(project)
        db.session.commit()
        flash('Project added successfully')
        return redirect(url_for('views.projects'))

    return render_template('add_project.html')

@views_bp.route('/create-sample-data')
@login_required
def create_sample_data():
    # Create sample projects
    if not Project.query.first():
        projects = [
            Project(project_name='OC Development', wbs_no='EAS'),
            Project(project_name='Project Knowledge Improvement & Training', wbs_no='YES'),
            Project(project_name='AWS Training', wbs_no=''),
            Project(project_name='Project Management Operation and Maintenance', wbs_no='')
        ]

        for project in projects:
            db.session.add(project)

        db.session.commit()
        flash('Sample data created successfully')
    else:
        flash('Sample data already exists')

    return redirect(url_for('views.daily_activity'))