from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from Shop.models import Order
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from Admin.models import AdminKey, StaffKey

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Basic user info serializer (safe to expose)."""

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "billing_address",
        ]
        read_only_fields = ["user_id", "email", "user_type"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    key = serializers.CharField(write_only=True, required=False)  # optional, required for staff/admin

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "user_type", "key"]

    def validate(self, data):
        user_type = data.get("user_type", "customer")
        key = data.get("key", None)

        if user_type == "admin":
            if not key:
                raise serializers.ValidationError({"key": "Admin key is required."})
            try:
                admin_key = AdminKey.objects.get(key=key, used=False)
            except AdminKey.DoesNotExist:
                raise serializers.ValidationError({"key": "Invalid or already used admin key."})

        elif user_type == "staff":
            if not key:
                raise serializers.ValidationError({"key": "Staff key is required."})
            try:
                staff_key = StaffKey.objects.get(key=key, used=False)
            except StaffKey.DoesNotExist:
                raise serializers.ValidationError({"key": "Invalid or already used staff key."})

        return data

    def create(self, validated_data):
        key = validated_data.pop("key", None)
        user_type = validated_data.get("user_type", "customer")

        # Create the user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            user_type=user_type,
        )

        # Mark key as used if staff/admin
        if key and user_type == "admin":
            admin_key = AdminKey.objects.get(key=key)
            admin_key.used = True
            admin_key.save()
        elif key and user_type == "staff":
            staff_key = StaffKey.objects.get(key=key)
            staff_key.used = True
            staff_key.save()

        return user


class LoginSerializer(serializers.Serializer):
    """Handles login with email + password."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Authenticate directly with email (USERNAME_FIELD="email")
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        data["user"] = user
        return data


class ProfileSerializer(serializers.ModelSerializer):
    """Returns profile details + purchase history for customers."""
    purchase_history = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "billing_address",
            "purchase_history",
        ]
        read_only_fields = ["purchase_history", "email"]

    def get_purchase_history(self, obj):
        orders = Order.objects.filter(user=obj).order_by("-created_at")
        history = []

        for order in orders:
            items_data = []
            for item in order.items.all():  # assumes related_name="items" in OrderItem
                items_data.append({
                    "product": item.variant.product.name,
                    "variant": item.variant.size or "Default",
                    "quantity": item.quantity,
                    "price": item.variant.price,
                })

            history.append({
                "order_id": order.id,
                "status": order.status,
                "total_price": order.total_price,
                "created_at": order.created_at,
                "items": items_data,
            })

        return history

class SessionSerializer(serializers.ModelSerializer):
    blacklisted = serializers.SerializerMethodField()

    class Meta:
        model = OutstandingToken
        fields = ["id", "jti", "created_at", "expires_at", "blacklisted"]

    def get_blacklisted(self, obj):
        return BlacklistedToken.objects.filter(token=obj).exists()