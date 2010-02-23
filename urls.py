from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    # Uncomment the next line to enable the admin:
    (r'^admin/(.*)', admin.site.root),
    # Static content
    (r'^$', 'IDE_Deployer.views.do_login'),
    (r'^logout/$', 'IDE_Deployer.views.do_logout'),
    (r'^resources/(.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    (r'^file/(?P<route>([\w\s,.]+\/)*[\w\s,.]+)$', 'IDE_Deployer.file.views.manageFile'),
    (r'^rename/(?P<route>([\w\s,.]+\/)*[\w\s,.]+)$', 'IDE_Deployer.file.views.renameFile'),
    (r'^delete/(?P<route>([\w\s,.]+\/)*[\w\s,.]+)$', 'IDE_Deployer.file.views.deleteFile'),
    (r'^projects/$', 'IDE_Deployer.file.views.listProjects'),
    (r'^templates/(?P<route>[\w\s,.]+)$', 'IDE_Deployer.file.views.listTemplates'),
    (r'^images/(?P<route>[\w\s,.]+)$', 'IDE_Deployer.file.views.listImages'),
    (r'^images/$', 'IDE_Deployer.file.views.saveImage'),
    (r'^import/$', 'IDE_Deployer.file.views.importFile'),
    (r'^wgt/(?P<route>[\w\s,.]+)$', 'IDE_Deployer.file.views.packGadget'),
)
