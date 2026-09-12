from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from attendance.models import AttendanceRecord
from calendar_app.models import CalendarEvent
from hr.models import Employee
from leave.models import LeaveRequest
from messaging.models import Message, Notification
from org.models import Department
from payroll.models import Payslip
from performance.models import PerformanceReview
from recruitment.models import Candidate, JobPosting

User = get_user_model()
DEMO_PASSWORD = "TeamHub@123"

A = {
    "davis": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "marcus": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "olivia": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "ethan": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "anya": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "nora": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "lina": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "jacob": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "mia": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "sara": "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "daniel": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "kelvin": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    "farah": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
}


class Command(BaseCommand):
    help = "Seed rich TeamHub demo data for Admin/Manager/Employee testing"

    def handle(self, *args, **options):
        depts = {}
        for name, code, head, desc, count in [
            ("Human Resources", "HR", "Davis Levin", "People operations, policies, and workforce planning", 3),
            ("Marketing", "MKT", "Marcus Brody", "Brand, campaigns, and go-to-market programs", 4),
            ("Product Design", "PD", "Ethan Ray", "Product UI/UX and design systems", 2),
            ("Operations", "OPS", "Jacob Yuen", "Site operations and compliance", 2),
            ("R&D", "RND", "Lina Armand", "Research labs and product experimentation", 1),
            ("Customer Service", "CS", "Farah Nabila", "Support, CX, and customer success", 2),
        ]:
            dept, _ = Department.objects.update_or_create(
                name=name,
                defaults={
                    "code": code,
                    "head_name": head,
                    "description": desc,
                    "member_count": count,
                    "status": "Active",
                },
            )
            depts[name] = dept

        admin = self._user("davis.levin@teamhub.corp", "Davis", "Levin", "admin", "HR Admin", A["davis"])
        manager_user = self._user(
            "marcus.brody@teamhub.corp", "Marcus", "Brody", "manager", "Marketing Manager", A["marcus"]
        )
        olivia_user = self._user(
            "olivia.chen@teamhub.corp", "Olivia", "Mason", "employee", "Marketing Executive", A["olivia"]
        )
        ethan_user = self._user(
            "ethan.ray@teamhub.corp", "Ethan", "Ray", "employee", "UI Designer", A["ethan"]
        )
        anya_user = self._user(
            "anya.rodriguez@teamhub.corp", "Anya", "Rodriguez", "employee", "Graphic Designer", A["anya"]
        )
        nora_user = self._user(
            "nora.chen@teamhub.corp", "Nora", "Chen", "employee", "Content Specialist", A["nora"]
        )

        admin_emp = self._emp("EMP-0001", admin, "Davis Levin", "HR Admin", depts["Human Resources"], A["davis"], None, "Full-Time", "Hybrid", "Active", date(2032, 1, 12))
        manager_emp = self._emp("EMP-0100", manager_user, "Marcus Brody", "Marketing & Sales Manager", depts["Marketing"], A["marcus"], None, "Full-Time", "Hybrid", "Active", date(2031, 2, 1))
        olivia = self._emp("EMP-0234", olivia_user, "Olivia Mason", "Marketing Executive", depts["Marketing"], A["olivia"], manager_emp, "Full-Time", "Hybrid", "Active", date(2034, 1, 12))
        ethan = self._emp("EMP-0178", ethan_user, "Ethan Ray", "UI Designer", depts["Product Design"], A["ethan"], manager_emp, "Full-Time", "Remote", "Active", date(2033, 3, 3))
        anya = self._emp("EMP-0275", anya_user, "Anya Rodriguez", "Graphic Designer", depts["Marketing"], A["anya"], manager_emp, "Freelance", "Remote", "Active", date(2035, 4, 6))
        nora = self._emp("EMP-0401", nora_user, "Nora Chen", "Content Specialist", depts["Marketing"], A["nora"], manager_emp, "Full-Time", "On-Site", "Active", date(2035, 1, 15))
        lina = self._emp("EMP-0312", None, "Lina Armand", "Lab Analyst", depts["R&D"], A["lina"], None, "Part-Time", "On-Site", "On Leave", date(2034, 7, 22))
        jacob = self._emp("EMP-0115", None, "Jacob Yuen", "Site Supervisor", depts["Operations"], A["jacob"], None, "Full-Time", "On-Site", "Absent", date(2032, 9, 5))
        mia = self._emp("EMP-0289", None, "Mia Torres", "HR Officer", depts["Human Resources"], A["mia"], admin_emp, "Full-Time", "Hybrid", "Active", date(2033, 2, 14))
        sara = self._emp("EMP-0356", None, "Sara Kim", "Customer Support", depts["Customer Service"], A["sara"], None, "Internship", "On-Site", "Active", date(2035, 5, 10))
        daniel = self._emp("EMP-0291", None, "Daniel Cheung", "Compliance Specialist", depts["Operations"], A["daniel"], jacob, "Full-Time", "Remote", "Active", date(2033, 11, 19))
        kelvin = self._emp("EMP-0159", None, "Kelvin Yu", "Training Coordinator", depts["Human Resources"], A["kelvin"], admin_emp, "Part-Time", "On-Site", "Active", date(2032, 6, 27))
        farah = self._emp("EMP-0320", None, "Farah Nabila", "Customer Experience Lead", depts["Customer Service"], A["farah"], None, "Full-Time", "Hybrid", "Active", date(2034, 8, 8))

        today = date.today()
        AttendanceRecord.objects.all().delete()
        for emp, st, cin, cout, dur, ot, comment, fwd, fstat, hstat, corr in [
            (olivia, "On-Time", "08:55 AM", "05:05 PM", "8h 10m", "10m", "", "", "None", "Approved", False),
            (ethan, "Late", "09:14 AM", "05:20 PM", "8h 06m", "6m", "Traffic delay.", "Marcus Brody", "Pending", "Pending", True),
            (anya, "On-Time", "08:50 AM", "05:00 PM", "8h 10m", "10m", "", "", "None", "None", False),
            (nora, "On-Time", "09:00 AM", "05:30 PM", "8h 30m", "30m", "", "", "None", "None", False),
            (lina, "On Leave", "—", "—", "—", "0h", "Approved leave", "HR", "Approved", "Approved", False),
            (jacob, "Absent", "—", "—", "—", "0h", "No show", "HR", "Pending", "Pending", False),
            (mia, "On-Time", "08:45 AM", "05:00 PM", "8h 15m", "15m", "", "", "None", "None", False),
            (sara, "Late", "09:25 AM", "05:10 PM", "7h 45m", "0h", "Bus delayed", "Farah Nabila", "Pending", "Pending", False),
            (daniel, "On-Time", "09:00 AM", "05:00 PM", "8h", "0h", "", "", "None", "None", False),
            (kelvin, "On-Time", "08:40 AM", "01:00 PM", "4h 20m", "0h", "Part-time shift", "", "None", "None", False),
            (farah, "On-Time", "08:55 AM", "05:15 PM", "8h 20m", "20m", "", "", "None", "None", False),
            (manager_emp, "On-Time", "08:30 AM", "06:00 PM", "9h 30m", "1h 30m", "", "", "None", "None", False),
            (admin_emp, "On-Time", "08:20 AM", "05:40 PM", "9h 20m", "1h 20m", "", "", "None", "None", False),
        ]:
            AttendanceRecord.objects.create(
                employee=emp,
                date=today,
                clock_in=cin,
                clock_out=cout,
                duration=dur,
                overtime=ot,
                status=st,
                comment=comment,
                work_model=emp.work_model,
                is_correction=corr,
                forwarded_to=fwd or "None",
                forwarded_status=fstat,
                hr_approval_status=hstat,
            )
        # Extra history days
        for days_ago in (1, 2, 3):
            d = today - timedelta(days=days_ago)
            for emp in (olivia, ethan, mia, farah):
                AttendanceRecord.objects.create(
                    employee=emp,
                    date=d,
                    clock_in="09:00 AM",
                    clock_out="05:00 PM",
                    duration="8h",
                    overtime="0h",
                    status="On-Time",
                    work_model=emp.work_model,
                )

        LeaveRequest.objects.all().delete()
        leave_rows = [
            (olivia, "Annual", today + timedelta(10), today + timedelta(12), "3 days", "Family wedding", "Pending", "Marcus Brody"),
            (ethan, "Sick", today - timedelta(2), today - timedelta(1), "2 days", "Flu", "Approved", "Marcus Brody"),
            (anya, "Casual", today + timedelta(7), today + timedelta(7), "1 day", "Personal appointment", "Pending", "Marcus Brody"),
            (nora, "Annual", today + timedelta(14), today + timedelta(16), "3 days", "Family visit", "Pending", "Marcus Brody"),
            (lina, "Annual", today - timedelta(1), today + timedelta(4), "5 days", "Personal travel", "Approved", "HR"),
            (sara, "Casual", today + timedelta(5), today + timedelta(5), "1 day", "Appointment", "Pending", "Farah Nabila"),
            (jacob, "Sick", today, today, "1 day", "Not feeling well", "Rejected", "HR"),
            (mia, "Annual", today + timedelta(20), today + timedelta(24), "5 days", "Vacation", "Pending", "Davis Levin"),
            (daniel, "Other", today + timedelta(15), today + timedelta(15), "1 day", "Court date", "Pending", "Jacob Yuen"),
        ]
        for emp, typ, s, e, dur, reason, st, fwd in leave_rows:
            LeaveRequest.objects.create(
                employee=emp,
                leave_type=typ,
                start_date=s,
                end_date=e,
                duration=dur,
                reason=reason,
                status=st,
                forwarded_to=fwd,
            )

        PerformanceReview.objects.all().delete()
        for emp, scores, fb in [
            (olivia, (4, 5, 4, 4), "Strong campaign ownership."),
            (ethan, (5, 4, 5, 4), "Excellent design craft."),
            (anya, (4, 4, 3, 5), "Creative and collaborative."),
            (nora, (4, 4, 4, 4), "Reliable content delivery."),
            (mia, (5, 5, 4, 5), "Trusted HR partner."),
            (farah, (4, 5, 4, 5), "CX leadership growing fast."),
        ]:
            PerformanceReview.objects.create(
                employee=emp,
                reviewer=manager_user if emp.manager_id == manager_emp.id else admin,
                reliability=scores[0],
                punctuality=scores[1],
                task_completion=scores[2],
                behavior=scores[3],
                feedback=fb,
                period="Q3 2035",
            )

        Payslip.objects.all().delete()
        for emp, salary, allow, ot, inc, ded, total, st, period in [
            (olivia, "$3,200", "$200", "$80", "$100", "$120", "$3,460", "Paid", "May 2035"),
            (olivia, "$3,200", "$200", "$40", "$50", "$120", "$3,370", "Pending", "Jun 2035"),
            (ethan, "$3,800", "$150", "$0", "$200", "$140", "$4,010", "Paid", "May 2035"),
            (anya, "$2,400", "$100", "$0", "$50", "$80", "$2,470", "Paid", "May 2035"),
            (nora, "$2,900", "$120", "$60", "$80", "$100", "$3,060", "Draft", "Jun 2035"),
            (mia, "$3,100", "$180", "$0", "$100", "$110", "$3,270", "Paid", "May 2035"),
            (farah, "$3,500", "$200", "$100", "$150", "$130", "$3,820", "Pending", "Jun 2035"),
            (admin_emp, "$5,000", "$300", "$0", "$200", "$150", "$5,350", "Paid", "May 2035"),
            (manager_emp, "$4,500", "$250", "$120", "$180", "$160", "$4,890", "Paid", "May 2035"),
            (jacob, "$3,600", "$150", "$0", "$0", "$120", "$3,630", "Draft", "Jun 2035"),
            (daniel, "$3,400", "$140", "$40", "$60", "$110", "$3,530", "Pending", "Jun 2035"),
            (sara, "$1,200", "$50", "$0", "$0", "$40", "$1,210", "Paid", "May 2035"),
        ]:
            Payslip.objects.create(
                employee=emp,
                period_date=period,
                salary=salary,
                allowance=allow,
                overtime=ot,
                incentive=inc,
                deduction=ded,
                total=total,
                status=st,
            )

        CalendarEvent.objects.all().delete()
        for title, etype, day, time, loc, whom, vis, owner, related in [
            ("Weekly Team Sync", "Team", 20, "10:00 AM", "Meeting Room A", "Full team", "team", manager_user, None),
            ("1:1 Olivia", "1:1", 21, "02:00 PM", "Zoom", "Olivia Mason", "team", manager_user, olivia),
            ("Performance Check-in", "Review", 22, "11:30 AM", "HR Room 02", "Ethan Ray", "team", manager_user, ethan),
            ("Company Holiday", "Holiday", 24, "All day", "—", "Company-wide", "company", admin, None),
            ("Campaign Planning", "Team", 25, "09:30 AM", "Marketing Hub", "Full team", "team", manager_user, None),
            ("HR Policy Review", "Work", 18, "03:00 PM", "Board Room", "HR Team", "company", admin, None),
            ("Support Standup", "Team", 19, "09:00 AM", "CS Floor", "CS Team", "team", admin, farah),
            ("Olivia standup", "Work", 20, "09:30 AM", "Marketing Hub", "Self", "personal", olivia_user, olivia),
        ]:
            CalendarEvent.objects.create(
                title=title,
                event_type=etype,
                day=day,
                time=time,
                location=loc,
                with_whom=whom,
                visibility=vis,
                owner=owner,
                related_employee=related,
            )

        Message.objects.all().delete()
        Notification.objects.all().delete()
        Message.objects.create(
            sender=olivia_user,
            recipient=manager_user,
            subject="Leave request follow-up",
            body="Hi Marcus,\n\nJust confirming my leave dates for the family wedding.\n\nThanks,\nOlivia",
            unread=True,
            starred=True,
        )
        Message.objects.create(
            sender=manager_user,
            recipient=olivia_user,
            subject="Campaign brief",
            body="Hi Olivia,\n\nPlease review the July launch brief and share notes.\n\nMarcus",
            unread=False,
            starred=False,
        )
        Message.objects.create(
            sender=admin,
            recipient=manager_user,
            subject="Q3 headcount plan",
            body="Marcus — please submit the marketing hiring plan by Friday.",
            unread=True,
            starred=False,
        )
        Message.objects.create(
            sender=olivia_user,
            recipient=admin,
            subject="Document upload",
            body="Hi Davis, I uploaded my updated tax form in Personal Documents.",
            unread=True,
            starred=False,
        )
        Message.objects.create(
            sender=ethan_user,
            recipient=manager_user,
            subject="Design review ready",
            body="Hi Marcus,\n\nThe homepage redesign mocks are ready for your feedback.\n\nBest,\nEthan",
            unread=True,
            starred=False,
        )
        Message.objects.create(
            sender=nora_user,
            recipient=manager_user,
            subject="Content calendar update",
            body="Hi Marcus,\n\nUpdated June social calendar attached for approval.\n\nNora",
            unread=False,
            starred=False,
        )
        Message.objects.create(
            sender=anya_user,
            recipient=manager_user,
            subject="Asset pack delivery",
            body="Hi Marcus,\n\nBrand illustration pack for Q3 campaign is uploaded.\n\nAnya",
            unread=False,
            starred=True,
        )
        for user, title, body, cat in [
            (manager_user, "Leave pending approval", "Olivia Mason submitted an Annual leave request.", "leave"),
            (manager_user, "Attendance correction", "Ethan Ray requested a timesheet correction.", "attendance"),
            (admin, "Payroll draft ready", "June 2035 payroll drafts need review.", "payroll"),
            (admin, "New candidate", "Alex Candidate moved to Interview stage.", "recruitment"),
            (olivia_user, "Leave submitted", "Your Annual leave request is pending manager review.", "leave"),
            (olivia_user, "Payslip available", "May 2035 payslip is ready to download.", "payroll"),
        ]:
            Notification.objects.create(user=user, title=title, body=body, category=cat)

        JobPosting.objects.all().delete()
        Candidate.objects.all().delete()
        jobs = [
            ("Senior Marketing Specialist", "Marketing", "Hybrid", "Open", 1, "Lead campaign planning and brand storytelling."),
            ("UI Designer", "Product Design", "Remote", "Open", 2, "Own product surfaces and design system components."),
            ("HR Generalist", "Human Resources", "On-Site", "Draft", 1, "Support recruiting and employee relations."),
            ("Support Associate", "Customer Service", "On-Site", "Closed", 0, "Handle Tier-1 tickets and live chat."),
        ]
        job_objs = []
        for title, dept, loc, st, openings, desc in jobs:
            job_objs.append(
                JobPosting.objects.create(
                    title=title,
                    department=dept,
                    location=loc,
                    status=st,
                    openings=openings,
                    description=desc,
                )
            )
        for job, name, email, stage in [
            (job_objs[0], "Alex Candidate", "alex.candidate@example.com", "Interview"),
            (job_objs[0], "Priya Shah", "priya.shah@example.com", "Screening"),
            (job_objs[1], "Sam Ortiz", "sam.ortiz@example.com", "Applied"),
            (job_objs[1], "Nina Brooks", "nina.brooks@example.com", "Offer"),
            (job_objs[2], "Chris Park", "chris.park@example.com", "Applied"),
        ]:
            Candidate.objects.create(job=job, name=name, email=email, stage=stage)

        # Refresh department counts
        for dept in Department.objects.all():
            dept.member_count = Employee.objects.filter(department=dept).count()
            dept.save(update_fields=["member_count"])

        self.stdout.write(self.style.SUCCESS("Rich demo data seeded."))
        self.stdout.write("Password for all demo accounts: TeamHub@123")
        self.stdout.write("  Admin:    davis.levin@teamhub.corp")
        self.stdout.write("  Manager:  marcus.brody@teamhub.corp")
        self.stdout.write("  Employee: olivia.chen@teamhub.corp")
        self.stdout.write("  Team:     ethan.ray / anya.rodriguez / nora.chen @teamhub.corp")
        self.stdout.write(
            f"Counts — employees={Employee.objects.count()} attendance={AttendanceRecord.objects.count()} "
            f"leaves={LeaveRequest.objects.count()} payroll={Payslip.objects.count()} "
            f"jobs={JobPosting.objects.count()} candidates={Candidate.objects.count()}"
        )

    def _user(self, email, first, last, role, title, avatar):
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first,
                "last_name": last,
                "access_role": role,
                "role_title": title,
                "avatar": avatar,
            },
        )
        user.set_password(DEMO_PASSWORD)
        user.access_role = role
        user.role_title = title
        user.avatar = avatar
        user.first_name = first
        user.last_name = last
        user.save()
        return user

    def _emp(self, code, user, name, role, dept, avatar, manager, emp_type, model, status, join):
        emp, _ = Employee.objects.update_or_create(
            employee_code=code,
            defaults={
                "user": user,
                "name": name,
                "role": role,
                "department": dept,
                "avatar": avatar,
                "manager": manager,
                "employment_type": emp_type,
                "work_model": model,
                "status": status,
                "join_date": join,
            },
        )
        return emp
