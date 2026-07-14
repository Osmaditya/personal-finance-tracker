from django.db import migrations

DEFAULT_CATEGORIES = [
    ("Salary", "income"),
    ("Freelance", "income"),
    ("Investment", "income"),
    ("Food", "expense"),
    ("Travel", "expense"),
    ("Rent", "expense"),
    ("Utilities", "expense"),
    ("Shopping", "expense"),
    ("Entertainment", "expense"),
    ("Healthcare", "expense"),
]

def seed_categories(apps, schema_editor):
    Category = apps.get_model("categories", "Category")
    for name, type_ in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(name=name, type=type_, user=None, is_default=True)

def remove_categories(apps, schema_editor):
    Category = apps.get_model("categories", "Category")
    Category.objects.filter(is_default=True).delete()

class Migration(migrations.Migration):
    dependencies = [
        ("categories", "0001_initial"),
    ]
    operations = [
        migrations.RunPython(seed_categories, remove_categories),
    ]