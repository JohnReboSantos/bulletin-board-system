# Generated by Django 3.2.12 on 2023-07-06 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_auto_20230706_1021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='gender',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='interests',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='website',
            field=models.URLField(blank=True, default='', null=True),
        ),
    ]