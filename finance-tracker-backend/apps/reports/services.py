from django.db.models import Sum
from apps.transactions.models import Transaction


def get_monthly_report_data(user, month, year):
    qs = Transaction.objects.filter(
        user=user, is_deleted=False, date__month=month, date__year=year
    ).select_related("category")

    total_income = qs.filter(type="income").aggregate(total=Sum("amount"))["total"] or 0
    total_expense = qs.filter(type="expense").aggregate(total=Sum("amount"))["total"] or 0

    transactions = list(
        qs.order_by("date").values(
            "date", "type", "category__name", "amount", "description"
        )
    )

    return {
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_savings": total_income - total_expense,
        "transactions": transactions,
    }


def get_annual_report_data(user, year):
    qs = Transaction.objects.filter(user=user, is_deleted=False, date__year=year)

    total_income = qs.filter(type="income").aggregate(total=Sum("amount"))["total"] or 0
    total_expense = qs.filter(type="expense").aggregate(total=Sum("amount"))["total"] or 0

    return {
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_savings": total_income - total_expense,
    }