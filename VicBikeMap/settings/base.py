"""
Django settings for VicBikeMap project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MIDDLEWARE_CLASSES = (
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'minidetector.Middleware'
)

ROOT_URLCONF = 'VicBikeMap.urls'

WSGI_APPLICATION = 'VicBikeMap.wsgi.application'

AUTH_USER_MODEL = 'spirit.User'
LOGIN_URL = 'userApp:login'
LOGIN_REDIRECT_URL = 'mapApp:index'

POSTGIS_VERSION = (2,1,3)

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Vancouver'

USE_I18N = True

USE_L10N = True

USE_TZ = False

# Application definitions
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # forum
    'spirit',

    # mapApp requirements
    'minidetector', # Mobile detector
    'django.contrib.gis',
    'djgeojson',
    'crispy_forms',
    'mapApp',
    'debug_toolbar',

    #blogApp and requirements
    'blogApp',
    'markdown_deux',

    # api requirements
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_gis',
    'rest_auth',
    'rest_auth.registration',

    # push notification requirement
    "push_notifications",

    #django-allauth requirements
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    # userApp requirements
    'userApp'
)

TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    "django.core.context_processors.request",

    # `allauth` specific context processors
    'allauth.account.context_processors.account',
    'allauth.socialaccount.context_processors.socialaccount'
)

CRISPY_TEMPLATE_PACK = 'bootstrap3'

SERIALIZATION_MODULES = {
    'geojson' : 'djgeojson.serializers'
}

STATIC_ROOT = os.path.join(BASE_DIR,'static')

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder'
]

MEDIA_ROOT = os.path.join(BASE_DIR,'media')

INTERNAL_IPS = ('127.0.0.1')

# Markdown styles
MARKDOWN_DEUX_STYLES = {
    "trusted": {
        "extras": {
            "code-friendly": None,
            "cuddled-lists": True,
        },
        # Allow raw HTML (WARNING: don't use this for user-generated
        # Markdown for your site!).
        "safe_mode": False,
    }
}

# Persistent login session config
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"

PUSH_NOTIFICATIONS_SETTINGS = {
        "GCM_API_KEY": "AIzaSyAAIoOHr1BA28ulBsWQ7FNWfCmPeZp-aaw",
        "APNS_CERTIFICATE": "/path/to/your/certificate.pem",
}

REST_SESSION_LOGIN = False

SITE_ID = 1

# Cross Origin Access Control
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = (
        'GET',
        'POST',
        'DELETE',
    )

CORS_ALLOW_HEADERS = (
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'X-CSRFToken'
)
