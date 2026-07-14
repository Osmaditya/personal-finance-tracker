from django.urls import path
from .views import category_list_create, category_detail

urlpatterns = [
    path("", category_list_create, name="category-list-create"),
    path("<int:pk>/", category_detail, name="category-detail"),
]