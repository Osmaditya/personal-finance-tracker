from datetime import date
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.transactions.models import Transaction


class SummaryView(APIView):
    """GET /api/v1/dashboard/summary/?month=&year="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))

        qs = Transaction.objects.filter(
            user=request.user, is_deleted=False, date__month=month, date__year=year
        )

        total_income = qs.filter(type="income").aggregate(total=Sum("amount"))["total"] or 0
        total_expense = qs.filter(type="expense").aggregate(total=Sum("amount"))["total"] or 0

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "net_savings": total_income - total_expense,
            "month": month,
            "year": year,
        })


class MonthlyTrendView(APIView):
    """GET /api/v1/dashboard/trends/?year=  -> income & expense per month, for charting"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        year = int(request.query_params.get("year", date.today().year))

        qs = (
            Transaction.objects.filter(user=request.user, is_deleted=False, date__year=year)
            .annotate(month=TruncMonth("date"))
            .values("month", "type")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        # reshape into {month: {income, expense}}
        trends = {}
        for row in qs:
            m = row["month"].month
            trends.setdefault(m, {"month": m, "year": year, "income": 0, "expense": 0})
            trends[m][row["type"]] = row["total"]

        return Response(sorted(trends.values(), key=lambda x: x["month"]))


class CategoryBreakdownView(APIView):
    """GET /api/v1/dashboard/category-breakdown/?month=&year=&type=expense"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))
        txn_type = request.query_params.get("type", "expense")

        qs = (
            Transaction.objects.filter(
                user=request.user, is_deleted=False,
                date__month=month, date__year=year, type=txn_type,
            )
            .values("category__id", "category__name", "category__color")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        data = [
            {
                "category_id": row["category__id"],
                "category_name": row["category__name"],
                "color": row["category__color"],
                "total": row["total"],
            }
            for row in qs
        ]
        return Response(data)