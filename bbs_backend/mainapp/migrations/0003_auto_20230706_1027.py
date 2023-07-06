# Generated by Django 3.2.12 on 2023-07-06 10:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_thread_sticky'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='moderator',
            name='user',
        ),
        migrations.RemoveField(
            model_name='poster',
            name='user',
        ),
        migrations.DeleteModel(
            name='Administrator',
        ),
        migrations.DeleteModel(
            name='Moderator',
        ),
        migrations.DeleteModel(
            name='Poster',
        ),
    ]