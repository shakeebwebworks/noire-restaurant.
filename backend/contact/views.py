from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import NewsletterSubscriber
from .serializers import ContactMessageSerializer, NewsletterSerializer


class ContactCreateView(generics.CreateAPIView):
    """Public, create-only. Messages can never be read through the API."""

    serializer_class = ContactMessageSerializer
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Thank you. Your message has been sent."},
            status=status.HTTP_201_CREATED,
        )


class NewsletterSubscribeView(APIView):
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "newsletter"

    def post(self, request):
        serializer = NewsletterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sub, created = NewsletterSubscriber.objects.get_or_create(
            email=serializer.validated_data["email"]
        )
        if not created and not sub.is_active:
            sub.is_active = True
            sub.save(update_fields=["is_active"])
        # Same answer whether or not the email was already subscribed,
        # so the form cannot be used to check who is on the list.
        return Response(
            {"detail": "Thank you for subscribing."},
            status=status.HTTP_201_CREATED,
        )