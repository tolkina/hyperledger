from rest_framework import serializers
from .models import Requirement, Step, Context
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'first_name', 'last_name', 'email')


class RequirementSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Requirement
        fields = (
            'url', 'type', 'name', 'done', 'step'
        )


class StepSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Step
        fields = (
            'url', 'title', 'next_step', 'prev_step',
            'start_date', 'end_date', 'requirements', 'context',
            'manager', 'executor'
        )
        read_only_fields = ('requirements', 'prev_step','context',)


class ContextSerializer(serializers.HyperlinkedModelSerializer):
    current_step = serializers.SerializerMethodField()

    def get_current_step(self, context):
        step = context.initial_step

        while (
            step is not None and
            step.next_step is not None and
            step.next_step.started is not None
        ):
            step = step.next_step

        step_data = StepSerializer(step, context=self.context).data

        if 'url' in step_data:
            return step_data['url']
        else:
            return None

    class Meta:
        model = Context
        fields = ('url', 'title', 'initial_step', 'current_step', 'started')
