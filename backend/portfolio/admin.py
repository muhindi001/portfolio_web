from django.contrib import admin
from django.utils.html import format_html
from .models import Resume, Profile, Contact, About, Skill, Project, ProjectCategory, DataScienceProject, WebDevelopmentProject


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ("name", "subtitle", "updated_at")
	fields = (
		"name",
		"subtitle",
		"description",
		"profile_image",
		"page_image",
	)


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
	list_display = ("__str__", "uploaded_at", "download_link")
	readonly_fields = ("download_link",)

	def download_link(self, obj):
		if not obj.file:
			return "-"
		return format_html('<a href="{}" download>Download</a>', obj.file.url)

	download_link.short_description = "Download"


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "subject", "created_at")
	readonly_fields = ("created_at",)
	fields = ("name", "email", "subject", "message", "created_at")
	search_fields = ("name", "email", "subject", "message")


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
	list_display = ("title", "updated_at")
	fields = ("title", "description", "tags", "image")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
	list_display = ("title", "updated_at")
	fields = ("title", "description", "tags", "image")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ("title", "category", "updated_at")
	list_filter = ("category",)
	fields = ("title", "description", "tags", "image", "category")


@admin.register(DataScienceProject)
class DataScienceProjectAdmin(admin.ModelAdmin):
	list_display = ("title", "updated_at")
	fields = ("title", "description", "tags", "image")
	def get_queryset(self, request):
		return super().get_queryset(request).filter(category=ProjectCategory.DATA_SCIENCE)

	def save_model(self, request, obj, form, change):
		obj.category = ProjectCategory.DATA_SCIENCE
		super().save_model(request, obj, form, change)


@admin.register(WebDevelopmentProject)
class WebDevelopmentProjectAdmin(admin.ModelAdmin):
	list_display = ("title", "updated_at")
	fields = ("title", "description", "tags", "image")
	def get_queryset(self, request):
		return super().get_queryset(request).filter(category=ProjectCategory.WEB_DEVELOPMENT)

	def save_model(self, request, obj, form, change):
		obj.category = ProjectCategory.WEB_DEVELOPMENT
		super().save_model(request, obj, form, change)
