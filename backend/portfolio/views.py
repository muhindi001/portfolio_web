import os
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Resume, Profile, Contact, About, Skill, Project


@api_view(['GET'])
def home(request):
    return Response()


@api_view(['GET'])
def profile(request):
    profile_obj = Profile.objects.first()
    if not profile_obj:
        return Response({
            "name": "Izengo Maganga",
            "subtitle": "Data Scientist",
            "description": "I'm a passionate front-end developer...",
            "profile_image": None,
            "page_image": None,
        })

    profile_data = {
        "name": profile_obj.name,
        "subtitle": profile_obj.subtitle,
        "description": profile_obj.description,
        "profile_image": request.build_absolute_uri(profile_obj.profile_image.url) if profile_obj.profile_image else None,
        "page_image": request.build_absolute_uri(profile_obj.page_image.url) if profile_obj.page_image else None,
    }
    return Response(profile_data)


@api_view(['GET'])
def about(request):
    about_obj = About.objects.first()
    if not about_obj:
        return Response({
            "title": "Data Science with 1 Year of Experience",
            "description": "I’m a dedicated front-end developer with one year of experience creating professional, responsive web applications. My work focuses on delivering polished user interfaces and seamless user experiences using modern web technologies.",
            "tags": "React.js, Next.js, Bootstrap, JavaScript, CSS3, HTML5",
            "image": None,
        })

    about_data = {
        "title": about_obj.title,
        "description": about_obj.description,
        "tags": about_obj.tags,
        "image": request.build_absolute_uri(about_obj.image.url) if about_obj.image else None,
    }

    return Response(about_data)


@api_view(['GET'])
def skills(request):
	skill_objs = Skill.objects.all()
	if not skill_objs:
		return Response([
			{
				"title": "Django",
				"description": "Build modern, responsive web applications with Django.",
				"tags": ["Django", "Frontend", "Development"],
				"image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
			},
			{
				"title": "Bootstrap",
				"description": "Create responsive UI quickly using Bootstrap components.",
				"tags": ["Bootstrap", "Frontend", "Development"],
				"image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
			},
			{
				"title": "JavaScript",
				"description": "Implement interactive experiences with JavaScript.",
				"tags": ["JavaScript", "Frontend", "Development"],
				"image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
			},
		])

	skills_data = [
		{
			"title": skill.title,
			"description": skill.description,
			"tags": [tag.strip() for tag in skill.tags.split(',') if tag.strip()],
			"image": request.build_absolute_uri(skill.image.url) if skill.image else None,
		}
		for skill in skill_objs
	]
	return Response(skills_data)


@api_view(['GET'])
def projects(request):
	project_objs = Project.objects.all()
	if not project_objs:
		return Response([
			{
				"title": "Portfolio Website",
				"description": "A modern, responsive portfolio website built with Django and Bootstrap.",
				"tags": ["React", "Django", "Bootstrap"],
				"image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
				"category": "data_science",
			},
			{
				"title": "E-Commerce Platform",
				"description": "Full-stack e-commerce application with payment integration and admin dashboard.",
				"tags": ["Next.js", "Django", "Bootstrap"],
				"image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
				"category": "web_development",
			},
			{
				"title": "Task Management App",
				"description": "Real-time task management application with user authentication and team collaboration.",
				"tags": ["Node.js", "Django", "Bootstrap"],
				"image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
				"category": "data_science",
			},
		])

	projects_data = [
		{
			"title": project.title,
			"description": project.description,
			"tags": [tag.strip() for tag in project.tags.split(',') if tag.strip()],
			"image": request.build_absolute_uri(project.image.url) if project.image else None,
			"category": project.category,
		}
		for project in project_objs
	]
	return Response(projects_data)


@api_view(['GET'])
def data_science_projects(request):
	project_objs = Project.objects.filter(category='data_science')
	projects_data = [
		{
			"title": project.title,
			"description": project.description,
			"tags": [tag.strip() for tag in project.tags.split(',') if tag.strip()],
			"image": request.build_absolute_uri(project.image.url) if project.image else None,
			"category": project.category,
		}
		for project in project_objs
	]
	return Response(projects_data)


@api_view(['GET'])
def web_development_projects(request):
	project_objs = Project.objects.filter(category='web_development')
	projects_data = [
		{
			"title": project.title,
			"description": project.description,
			"tags": [tag.strip() for tag in project.tags.split(',') if tag.strip()],
			"image": request.build_absolute_uri(project.image.url) if project.image else None,
			"category": project.category,
		}
		for project in project_objs
	]
	return Response(projects_data)


@api_view(['GET'])
def resume(request):
    latest = Resume.objects.order_by('-uploaded_at').first()
    has_resume = bool(latest and latest.file)
    return Response({"has_resume": has_resume})


@api_view(['POST'])
def contact(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not name or not email or not subject or not message:
        return Response(
            {"detail": "Please provide name, email, subject, and message."},
            status=400,
        )

    contact_obj = Contact.objects.create(
        name=name,
        email=email,
        subject=subject,
        message=message,
    )

    return Response(
        {
            "id": contact_obj.id,
            "name": contact_obj.name,
            "email": contact_obj.email,
            "subject": contact_obj.subject,
            "message": contact_obj.message,
            "created_at": contact_obj.created_at,
        },
        status=201,
    )


@api_view(['GET'])
def resume_download(request):
    latest = Resume.objects.order_by('-uploaded_at').first()
    if not latest or not latest.file:
        return Response({"detail": "Resume unavailable."}, status=404)

    file_path = latest.file.path
    file_name = os.path.basename(file_path)
    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)