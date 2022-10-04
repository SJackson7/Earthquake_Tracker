### Earthquake Tracker

For this assignment, I built a tool that visualizes earthquake data from the past seven days using GeoJSON data from the United States Geological Survey (USGS). Using leaflet and JavaScript, I designed a map that displays the earthquake occurrences using Mapbox to get several layers: satellite, light and dark modes. The display shows each earthquake location as a circle with a radius equal to its magnitude scaled by a flat value based on its magnitude versus the maximum possible magnitude value of ten. Each circle has a color representing its event significance, which per the USGS, is a value determined based on several factors including magnitude, maximum estimated intensity, felt reports and estimated impact. 

While the origin depth of an earthquake is a factor in determining impact, the deeper the earthquake, the less likely it will be felt. I chose significance since it is a better metric in my opinion of an earthquake’s overall potential impact. The legend displays the range of significance from 0 to 900+ and is color-coded based on a given earthquake. Additionally, clicking on an earthquake location will display the occurrence location, time the even occurred, magnitude, significance, and depth. 
The map also, as an option, displays the tectonic plates (yellow lines). Seeing the plates shows that most earthquakes occur along these fault lines. As of this submission, the United States had multiple earthquakes primarily along the California coast and Alaska but many of them were of low significance. 

Please note that due to an error while loading the tectonic plate JSON data from the URL, I downloaded the current data from the following website: https://github.com/fraxen/tectonicplates/blob/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_boundaries.json

#### Map Legend
![image](https://user-images.githubusercontent.com/104914008/193845514-995b7c6d-10d0-4d6f-be7f-18870babd42e.png)

#### Satelite View with Tectonic Plates
![image](https://user-images.githubusercontent.com/104914008/193714292-67dc2665-dbc9-4ea4-88eb-9f5502995a81.png)

#### Light Mode with Tectonic Plates
![image](https://user-images.githubusercontent.com/104914008/193714377-6e719c75-bd12-4688-b9b6-aa51c49b832f.png)

#### Dark Mode with Tectonic Plates
![image](https://user-images.githubusercontent.com/104914008/193714419-2db78c9b-f4dc-42f6-98ba-83f6ab97c948.png)

#### Satelite View with Earthquakes Only
![image](https://user-images.githubusercontent.com/104914008/193714476-d849ac70-6c66-4dcb-8a47-66c906b60aaf.png)

#### Satelite View Showing Earthquake Data with Popup
![image](https://user-images.githubusercontent.com/104914008/193714849-3a729f23-0ecb-400e-a113-c2a5939479ac.png)
