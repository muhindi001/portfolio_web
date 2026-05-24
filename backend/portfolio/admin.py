from django.contrib import admin
from django.utils.html import format_html
from .models import Resume, Profile, Contact, About, Skill, Project


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
	list_display = ("title", "updated_at")
	fields = ("title", "description", "tags", "image")
