# Generated by Django 5.1.3 on 2024-11-12 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petcare', '0008_alter_owner_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='owner',
            name='cpf',
            field=models.CharField(max_length=11, unique=True),
        ),
        migrations.AlterField(
            model_name='owner',
            name='phone',
            field=models.CharField(max_length=11, null=True),
        ),
    ]