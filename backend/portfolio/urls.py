from django.urls import path
from .views import home, profile, resume, resume_download, contact, about, skills, projects

urlpatterns = [
    path('', home),
    path('profile/', profile),
    path('resume/', resume),
    path('resume/download/', resume_download),
    path('contact/', contact),
    path('about/', about),
    path('skills/', skills),
    path('projects/', projects),
]