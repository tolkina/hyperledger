# Generated by Django 2.2.2 on 2019-06-03 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20190603_2222'),
    ]

    operations = [
        migrations.AlterField(
            model_name='step',
            name='end_date',
            field=models.DateField(default=None, null=True),
        ),
    ]
