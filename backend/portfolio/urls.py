from django.urls import path
from .views import (
    home,
    profile,
    resume,
    resume_download,
    contact,
    about,
    skills,
    projects,
    data_science_projects,
    web_development_projects,
)

urlpatterns = [
    path('', home),
    path('profile/', profile),
    path('resume/', resume),
    path('resume/download/', resume_download),
    path('contact/', contact),
    path('about/', about),
    path('skills/', skills),
    path('projects/', projects),
    path('projects/data-science/', data_science_projects),
    path('projects/web-development/', web_development_projects),
]