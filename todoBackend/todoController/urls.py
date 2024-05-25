from django.urls import path
from todoController.views import requestToApi,deleteTodo, getTodo, current_user,register,login_view,logout_view

urlpatterns = [
    path('', requestToApi),
    path('delete/<int:id>', deleteTodo),
    path('get/<int:id>', getTodo),
    path('getUser', current_user),
    path('register', register),
    path('login', login_view),
    path('logout', logout_view)
]
