# Generated by Django 3.2.12 on 2023-06-25 11:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20230625_1106'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='gender',
            field=models.CharField(blank=True, default='https://example.com', max_length=10, null=True),
        ),
    ]