from django.shortcuts import render
from rest_framework import viewsets
from .models import Requirement, Step, Context
from .serializers import UserSerializer, RequirementSerializer, StepSerializer, ContextSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from datetime import datetime


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class RequirementViewSet(viewsets.ModelViewSet):
    queryset = Requirement.objects.all()
    serializer_class = RequirementSerializer

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        requirement = self.get_object()
        requirement.done = datetime.now().date().isoformat()
        requirement.save()

        step = requirement.step
        step_requirements = step.requirements
        is_done = True

        for step_requirement in step_requirements.all():
            if step_requirement.done is None:
                is_done = False

        if is_done:
            next_step = step.next_step

            if next_step is not None:
                next_step.start_date = datetime.now().date().isoformat()
                next_step.save()

        return Response('Submitted')


class StepViewSet(viewsets.ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer

    @action(detail=True, methods=['POST'])
    def start(self, request, pk=None):
        context = self.get_object()
        context.start_date = datetime.now().date().isoformat()
        context.save()

        return Response('Started')
