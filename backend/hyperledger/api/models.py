from django.db import models
from django.contrib.auth.models import User


class Context(models.Model):
    title = models.TextField()
    initial_step = models.OneToOneField(
        to='Step',
        on_delete=models.CASCADE,
        related_name='context',
        default=None,
        null=True
    )
    start_date = models.DateField(default=None, null=True)

    def __str__(self):
        return self.title


class Step(models.Model):
    title = models.TextField()
    next_step = models.OneToOneField(
        to='self',
        on_delete=models.CASCADE,
        related_name='prev_step',
        default=None,
        null=True
    )
    start_date = models.DateField(default=None, null=True)
    end_date = models.DateField(default=None, null=True)
    manager = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='+',
        default=None
    )
    executor = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='+',
        default=None
    )

    def __str__(self):
        return self.title


class Requirement(models.Model):
    FILE = 'file'
    CHECKBOX = 'checkbox'
    TEXT = 'text'

    TYPE_CHOICES = [
        (FILE, 'File'),
        (CHECKBOX, 'Condition'),
        (TEXT, 'Text')
    ]

    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    name = models.TextField()
    done = models.DateField(default=None, null=True)
    step = models.ForeignKey(
        to=Step,
        on_delete=models.CASCADE,
        related_name='requirements',
        default=None
    )

    def __str__(self):
        return self.name
