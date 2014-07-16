from django.conf.urls import patterns, url

from mapApp import views



urlpatterns = patterns('',
	# Index page
	url(r'^$', views.index, name='index'),
	url(r'^(?P<lat>-?\d{1,3}\.?\d*)_(?P<lng>-?\d{1,3}\.?\d*)/(?P<zoom>\d+)/?$', views.index, name='index'),
	
	# About page
	url(r'^about/$', views.about, name='about'),

	# Called from user notifications list 
	url(r'^read_alert/(?P<alertID>\d+)/$', views.readAlertPoint, name='readAlertPoint'),

	# Called upon geometry object creation on map
	url(r'^incident_submit/$', views.postIncident, name='postIncident'),
	url(r'^route_submit/$', views.postRoute, name='postRoute'),
	url(r'^new_alert/$', views.postAlertPolygon, name='postAlertPolygon'),
	
	# Called from email form
	url(r'^contact/$', views.contact, name='contact'),
	
	# Called by admin data export button
	url(r'^incidents.json$', views.getIncidents, name='getIncidents'),

	# Called when user edits or deletes an alert area
	url(r'edit_alert_area/$', views.editAlertArea, name='editAlertArea')
)