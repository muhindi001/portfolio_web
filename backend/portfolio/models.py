from django.db import models


class Profile(models.Model):
	"""Portfolio profile information."""
	name = models.CharField(max_length=200, default="Izengo Maganga")
	subtitle = models.CharField(max_length=200, default="Data Scientist")
	description = models.TextField(default="I'm a passionate front-end developer with one year of professional experience...")
	profile_image = models.ImageField(upload_to="profile/", null=True, blank=True)
	page_image = models.ImageField(upload_to="page/", null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Portfolio Profile"
		verbose_name_plural = "Portfolio Profile"

	def __str__(self):
		return self.name


class About(models.Model):
	"""Separate About section content."""
	title = models.CharField(max_length=255, default="Data Science with 1 Year of Experience")
	description = models.TextField(default="I’m a dedicated front-end developer with one year of experience creating professional, responsive web applications. My work focuses on delivering polished user interfaces and seamless user experiences using modern web technologies.")
	tags = models.CharField(max_length=500, default="React.js, Next.js, Bootstrap, JavaScript, CSS3, HTML5")
	image = models.ImageField(upload_to="about/", null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "About Content"
		verbose_name_plural = "About Content"

	def __str__(self):
		return self.title


class Resume(models.Model):
	"""Simple model to store an uploaded resume file."""
	file = models.FileField(upload_to="resumes/")
	uploaded_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.file.name.split("/")[-1]


class Contact(models.Model):
	"""Contact form submission."""
	name = models.CharField(max_length=200)
	email = models.EmailField()
	subject = models.CharField(max_length=255)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = "Contact Message"
		verbose_name_plural = "Contact Messages"

	def __str__(self):
		return f"{self.name} — {self.subject}"


class Skill(models.Model):
	"""Skill cards for portfolio skills."""
	title = models.CharField(max_length=200)
	description = models.TextField()
	tags = models.CharField(max_length=500, help_text="Comma-separated tags")
	image = models.ImageField(upload_to="skills/", null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Skill"
		verbose_name_plural = "Skills"

	def __str__(self):
		return self.title


class ProjectCategory(models.TextChoices):
	DATA_SCIENCE = "data_science", "Data Science"
	WEB_DEVELOPMENT = "web_development", "Web Development"


class Project(models.Model):
	"""Project cards for portfolio projects."""
	title = models.CharField(max_length=200)
	description = models.TextField()
	tags = models.CharField(max_length=500, help_text="Comma-separated tags")
	image = models.ImageField(upload_to="projects/", null=True, blank=True)
	category = models.CharField(
		max_length=20,
		choices=ProjectCategory.choices,
		default=ProjectCategory.DATA_SCIENCE,
	)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Project"
		verbose_name_plural = "Projects"
		ordering = ["-updated_at"]

	def __str__(self):
		return self.title


class DataScienceProject(Project):
	class Meta:
		proxy = True
		verbose_name = "Data Science Project"
		verbose_name_plural = "Data Science Projects"


class WebDevelopmentProject(Project):
	class Meta:
		proxy = True
		verbose_name = "Web Development Project"
		verbose_name_plural = "Web Development Projects"
