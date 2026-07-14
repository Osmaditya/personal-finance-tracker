from django.urls import path
from .views import MonthlyReportView, AnnualReportView, ExportCSVView, ExportExcelView, ExportPDFView

urlpatterns = [
    path("monthly/", MonthlyReportView.as_view(), name="report-monthly"),
    path("annual/", AnnualReportView.as_view(), name="report-annual"),
    path("export/csv/", ExportCSVView.as_view(), name="export-csv"),
    path("export/excel/", ExportExcelView.as_view(), name="export-excel"),
    path("export/pdf/", ExportPDFView.as_view(), name="export-pdf"),
]