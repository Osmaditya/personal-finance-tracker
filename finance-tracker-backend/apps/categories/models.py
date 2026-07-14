from django.conf import settings
from django.db import models

# Create your models here.
class Category(models.Model):
    TYPE_CHOICES = [
        ("income", "Income"),
        ("expense", "Expense")
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories", null=True, blank=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default="#6366F1")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'name', 'type')
        ordering = ["name"]
    
    def __str__(self):
        return self.name