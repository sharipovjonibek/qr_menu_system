from django.urls import path
from .views import StartSessionView,MenuView,ActiveSessionByTable

urlpatterns = [
    path('session/active/<int:table_number>',ActiveSessionByTable.as_view()),
    path('session/start',StartSessionView.as_view(),name='start-session'),
    path('menu/',MenuView.as_view(),name='menu')
]