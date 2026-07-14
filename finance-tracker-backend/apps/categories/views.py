from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer

@api_view(["GET", "POST"])
@permission_classes([permissions.IsAuthenticated])
def category_list_create(request):
    """
    GET  /api/v1/categories/       -> list categories
    POST /api/v1/categories/       -> create a category
    """
    if request.method == "GET":
        categories = Category.objects.filter(
            Q(user=request.user) | Q(user__isnull=True)
        )
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == "POST":
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user = request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def category_detail(request, pk):
    """
    GET    /api/v1/categories/{id}/   -> retrieve one category
    PUT    /api/v1/categories/{id}/   -> full update
    PATCH  /api/v1/categories/{id}/   -> partial update
    DELETE /api/v1/categories/{id}/   -> delete
    """
    category = get_object_or_404(
        Category.objects.filter(Q(user = request.user) | Q(user__isnull=True)),
        pk=pk
    )
    
    if request.method == "GET":
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    if category.user is None and request.method in ['PUT', 'PATCH', 'DELETE']:
        return Response(
            {"detail": "Default categories cannot be modified or deleted."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    elif request.method in ["PUT", "PATCH"]:
        partial = request.method == "PATCH"
        serializer = CategorySerializer(category, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    elif request.method == "DELETE":
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)