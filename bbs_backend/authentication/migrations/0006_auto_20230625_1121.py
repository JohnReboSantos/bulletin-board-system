# Generated by Django 3.2.12 on 2023-06-25 11:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0005_auto_20230625_1120"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="about_myself",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="hometown",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="present_location",
            field=models.CharField(max_length=100),
        ),
    ]
