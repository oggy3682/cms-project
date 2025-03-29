from django.urls import path, include
from .views import check_user_exists, SignupView, user_login, profile_view  # ✅ Import SignupView

urlpatterns = [
    # ✅ Custom authentication endpoints
    path("check-user/", check_user_exists, name="check-user"),  
    path('signup/', SignupView.as_view(), name='signup'),     # ✅ Add signup route
    path("login/", user_login, name="login"),
    path("profile/", profile_view, name="profile"),
    # ✅ Third-party authentication endpoints (dj-rest-auth)
    path("", include("dj_rest_auth.urls")),  
    path("registration/", include("dj_rest_auth.registration.urls")),  
]

    