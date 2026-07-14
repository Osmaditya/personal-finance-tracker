from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    spent = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id", "category", "category_name", "monthly_limit",
            "month", "year", "spent", "remaining", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_spent(self, obj):
        return obj.spent

    def get_remaining(self, obj):
        return obj.remaining

    def get_status(self, obj):
        return obj.status

    def validate_monthly_limit(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly limit must be greater than zero.")
        return value