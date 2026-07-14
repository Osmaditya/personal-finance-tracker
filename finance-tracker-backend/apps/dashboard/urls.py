from django.urls import path
from .views import SummaryView, MonthlyTrendView, CategoryBreakdownView

urlpatterns = [
    path("summary/", SummaryView.as_view(), name="dashboard-summary"),
    path("trends/", MonthlyTrendView.as_view(), name="dashboard-trends"),
    path("category-breakdown/", CategoryBreakdownView.as_view(), name="dashboard-category-breakdown"),
]