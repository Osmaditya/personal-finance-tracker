from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return self.username


class UserProfile(models.Model):
    CURRENCY_CHOICES =[
        ("INR", "₹ INR"),
        ("USD", "$ USD"),
        ("EUR", "€ EUR"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="INR")
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
