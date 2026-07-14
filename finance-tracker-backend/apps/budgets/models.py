from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.categories.models import Category


class Budget(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    year = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "category", "month", "year")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.category} - {self.month}/{self.year}"

    @property
    def spent(self):
        from apps.transactions.models import Transaction
        total = Transaction.objects.filter(
            user=self.user,
            category=self.category,
            type="expense",
            date__month=self.month,
            date__year=self.year,
            is_deleted=False,
        ).aggregate(total=models.Sum("amount"))["total"]
        return total or 0

    @property
    def remaining(self):
        return self.monthly_limit - self.spent

    @property
    def status(self):
        spent = self.spent
        if spent > self.monthly_limit:
            return "over"
        elif spent >= (self.monthly_limit * 9 / 10):
            return "warning"
        return "safe"