from rest_framework import serializers
from .models import Transaction
from apps.categories.models import Category

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "category", "category_name", "type",
            "amount", "description", "date",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
    
    def validate(self, attrs):
        # ensure category type matches transaction type (income category can't be used for an expense)
        category = attrs.get("category") or getattr(self.instance, "category", None)
        txn_type = attrs.get("type") or getattr(self.instance, "type", None)
        if category and txn_type and category.type != txn_type:
            raise serializers.ValidationError(
                {"category": f"This category is for '{category.type}', not '{txn_type}'."}
            )
        return attrs