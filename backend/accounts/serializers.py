from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User, MemberProfile


class MemberProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberProfile
        fields = [
            "gender",
            "date_of_birth",
            "address",
            "status",
            "created_at"
        ]
        read_only_fields = ["status", "created_at"]
    
class UserSerializer(serializers.ModelSerializer):
    """What we send back about a user. Never includes the password."""
    profile = MemberProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name",
                  "phone", "role", "is_active", "date_joined", "profile"]
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name",
                  "phone", "password", "password_confirm"]

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        validate_password(data["password"])
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        # role is NOT accepted from the client: self-registration is always MEMBER
        user = User(**validated_data, role=User.Role.MEMBER)
        user.set_password(password)  # hashes the password
        user.save()
        MemberProfile.objects.create(user=user)
        return user
    
class AdminMemberSerializer(serializers.ModelSerializer):
    profile = MemberProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "profile",
        ]
        read_only_fields = ["id", "role"]

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", {})

        user = User(**validated_data)
        user.set_unusable_password()
        user.role = User.Role.MEMBER
        user.save()

        profile_status = (
            MemberProfile.Status.ACTIVE
            if user.is_active
            else MemberProfile.Status.INACTIVE
        )

        MemberProfile.objects.create(
            user=user,
            status=profile_status,
            **profile_data
        )

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)

        instance.save()

        if profile_data is not None:
            profile = instance.profile

            for attribute, value in profile_data.items():
                setattr(profile, attribute, value)

            profile.save()

        # Keep profile status synchronized with account status
        instance.profile.status = (
            MemberProfile.Status.ACTIVE
            if instance.is_active
            else MemberProfile.Status.INACTIVE
        )
        instance.profile.save()

        return instance



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is deactivated.")
        data["user"] = user
        return data