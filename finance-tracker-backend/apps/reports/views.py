from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from datetime import date
from django.http import HttpResponse
import csv
import io

from .services import get_monthly_report_data, get_annual_report_data

from openpyxl import Workbook
from openpyxl.styles import Font

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet





class MonthlyReportView(APIView):
    """GET /api/v1/reports/monthly/?month=&year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))
        data = get_monthly_report_data(request.user, month, year)
        return Response(data)


class AnnualReportView(APIView):
    """GET /api/v1/reports/annual/?year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        year = int(request.query_params.get("year", date.today().year))
        data = get_annual_report_data(request.user, year)
        return Response(data)
    
class ExportCSVView(APIView):
    """GET /api/v1/reports/export/csv/?month=&year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))
        data = get_monthly_report_data(request.user, month, year)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="report_{month}_{year}.csv"'

        writer = csv.writer(response)
        writer.writerow(["Date", "Type", "Category", "Amount", "Description"])
        for t in data["transactions"]:
            writer.writerow([t["date"], t["type"], t["category__name"], t["amount"], t["description"]])

        writer.writerow([])
        writer.writerow(["Total Income", data["total_income"]])
        writer.writerow(["Total Expense", data["total_expense"]])
        writer.writerow(["Net Savings", data["net_savings"]])

        return response
    


class ExportExcelView(APIView):
    """GET /api/v1/reports/export/excel/?month=&year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))
        data = get_monthly_report_data(request.user, month, year)

        wb = Workbook()
        ws = wb.active
        ws.title = f"Report {month}-{year}"

        headers = ["Date", "Type", "Category", "Amount", "Description"]
        ws.append(headers)
        for cell in ws[1]:
            cell.font = Font(bold=True)

        for t in data["transactions"]:
            ws.append([str(t["date"]), t["type"], t["category__name"], float(t["amount"]), t["description"]])

        ws.append([])
        ws.append(["Total Income", float(data["total_income"])])
        ws.append(["Total Expense", float(data["total_expense"])])
        ws.append(["Net Savings", float(data["net_savings"])])

        buffer = io.BytesIO()
        wb.save(buffer)
        buffer.seek(0)

        response = HttpResponse(
            buffer.read(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = f'attachment; filename="report_{month}_{year}.xlsx"'
        return response
    
    


class ExportPDFView(APIView):
    """GET /api/v1/reports/export/pdf/?month=&year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))
        data = get_monthly_report_data(request.user, month, year)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph(f"Monthly Report — {month}/{year}", styles["Title"]))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"Total Income: {data['total_income']}", styles["Normal"]))
        elements.append(Paragraph(f"Total Expense: {data['total_expense']}", styles["Normal"]))
        elements.append(Paragraph(f"Net Savings: {data['net_savings']}", styles["Normal"]))
        elements.append(Spacer(1, 20))

        table_data = [["Date", "Type", "Category", "Amount", "Description"]]
        for t in data["transactions"]:
            table_data.append([
                str(t["date"]), t["type"], t["category__name"],
                str(t["amount"]), t["description"] or "-",
            ])

        table = Table(table_data, repeatRows=1)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6366F1")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(table)

        doc.build(elements)
        buffer.seek(0)

        response = HttpResponse(buffer.read(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="report_{month}_{year}.pdf"'
        return response