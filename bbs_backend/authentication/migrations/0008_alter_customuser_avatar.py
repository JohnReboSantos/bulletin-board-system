# Generated by Django 3.2.12 on 2023-06-28 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_customuser_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar',
            field=models.ImageField(blank=True, default='images/default.png', null=True, upload_to='avatars/'),
        ),
    ]
