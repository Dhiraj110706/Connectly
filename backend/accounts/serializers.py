# from rest_framework import serializers
# from django.contrib.auth import authenticate
# from .models import User

# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=8)
#     password2 = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password', 'password2', 'avatar')

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError("Passwords don't match")
#         return attrs

#     def create(self, validated_data):
#         validated_data.pop('password2')
#         user = User.objects.create_user(**validated_data)
#         return user

# class UserSerializer(serializers.ModelSerializer):
#     followers_count = serializers.ReadOnlyField()
#     following_count = serializers.ReadOnlyField()

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'avatar', 'bio', 'followers_count', 'following_count', 'created_at')

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def validate(self, attrs):
#         email = attrs.get('email')
#         password = attrs.get('password')

#         if email and password:
#             user = authenticate(username=email, password=password)
#             if not user:
#                 raise serializers.ValidationError('Invalid credentials')
#             if not user.is_active:
#                 raise serializers.ValidationError('User account is disabled')
#             attrs['user'] = user
#         else:
#             raise serializers.ValidationError('Email and password required')
#         return attrs

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'avatar')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', 'bio', 'followers_count', 'following_count', 'created_at')

        def get_is_following(self, obj):
            """Check if current user is following this user"""
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user.is_authenticated:
                return request.user.following.filter(id=obj.id).exists()
            return False

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                # Since USERNAME_FIELD is email, we authenticate with email directly
                user = authenticate(request=self.context.get('request'), username=email, password=password)
                if not user:
                    raise serializers.ValidationError('Invalid credentials')
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled')
                attrs['user'] = user
            except Exception as e:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Email and password required')
        return attrs
