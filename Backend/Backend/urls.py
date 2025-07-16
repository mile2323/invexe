from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
import os
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/purchases/', include('purchases.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/inventory/', include('inventory.urls')),
]

# Serve static files (React assets and others)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve Vite assets directly from frontend_build/assets
from django.views.static import serve as static_serve
urlpatterns += [
    re_path(r'^assets/(?P<path>.*)$', static_serve, {
        'document_root': os.path.join(settings.BASE_DIR, 'frontend_build/assets'),
    }),
]

# Fallback to index.html for client-side routing
urlpatterns += [
    re_path(r'^(?!static/|assets/).*$', TemplateView.as_view(template_name='index.html')),
]
