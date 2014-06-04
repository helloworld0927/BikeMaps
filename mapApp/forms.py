from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.bootstrap import Accordion, AccordionGroup
from crispy_forms.layout import Layout, Field

from mapApp.models import Incident

class IncidentForm(forms.ModelForm):
    helper = FormHelper()
    helper.form_tag = False # removes auto-inclusion of form tag in template

    helper.layout = Layout(
        Accordion(
            AccordionGroup(
                'Incident',
                Field('incident_date', id="incident_date", template='mapApp/util/datepicker.html'),
                Field('incident'),
                Field('injury'),
                # Field('injury_detail', placeholder='optional'),
                Field('trip_purpose'),
                Field('incident_detail', placeholder='optional'),
                Field('point', type="hidden", id="point"), # Coords passed after click on map from static/mapApp/js/map.js
            ),
            AccordionGroup(
                'Personal Details',
                Field('age'),
                Field('sex'),
                Field('regular_cyclist'),
                Field('helmet'),
            ),
            AccordionGroup(
                'Conditions',
                Field('road_conditions'),
                Field('sightlines'),
                Field('cars_on_roadside'),
                Field('bike_infrastructure'),
                Field('bike_lights'),
                Field('terrain'),
            ),
        )
    )

    class Meta:
        model = Incident