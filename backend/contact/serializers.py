import re

from rest_framework import serializers

from .models import ContactMessage

PHONE_CHARS = re.compile(r"^[0-9+\-\s()]+$")


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message"]

    def validate_name(self, value):
        value = " ".join(value.split())
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your name.")
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        value = value.strip()
        if not value:
            return value
        digits = re.sub(r"\D", "", value)
        if not PHONE_CHARS.match(value) or not 7 <= len(digits) <= 15:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    def validate_subject(self, value):
        value = " ".join(value.split())
        if len(value) < 3:
            raise serializers.ValidationError("Please enter a subject.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Please write a little more (at least 10 characters).")
        return value


class NewsletterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return value.strip().lower()