from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.transactions.models import Transaction
from apps.budgets.models import Budget
from .models import Notification


@receiver(post_save, sender=Transaction)
def check_budget_on_transaction_save(sender, instance, created, **kwargs):
    if instance.type != "expense" or instance.is_deleted:
        return

    budget = Budget.objects.filter(
        user=instance.user,
        category=instance.category,
        month=instance.date.month,
        year=instance.date.year,
    ).first()

    if not budget:
        return

    if budget.status == "over":
        # avoid spamming duplicate alerts for the same budget/month
        already_alerted = Notification.objects.filter(
            user=instance.user,
            type="budget_alert",
            message__icontains=f"{instance.category.name} ({budget.month}/{budget.year})",
        ).exists()

        if not already_alerted:
            Notification.objects.create(
                user=instance.user,
                type="budget_alert",
                message=(
                    f"You've exceeded your budget for {instance.category.name} "
                    f"({budget.month}/{budget.year}). "
                    f"Spent {budget.spent} of {budget.monthly_limit}."
                ),
            )