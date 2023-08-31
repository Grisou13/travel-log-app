# 1. Home screen

N/A

# 1.1 Signup

N/A

# 1.2 Login

Here we don't handle the api response in case of failure very correctly, we just show an error alert saying there was an error...
Error handling here is not the best, we should have made better use of the api's responses.

# 2 Dashboard

Nota: if you ever want to come back to this screen and you are logged in, just click on the little van and it will get you back here


# 2.1 Create a new trip

Here we would've liked for the user to be able to input a budget and be able to use that for our trips

You can click on the map to add a place if you can't find anything from the text input!
This will be the same on every part of the app that requires you to add some location (adding a place to a trip later, for example)

# 3 My brand new trip

Here you can drag n drop the cards for the trip to re-order them.

From a ui percpective an icon or something to show the user we can do that would've been great.

Nota: you can notice an `edit infos` button, this toggels a form that allows you to update and change the title/description/startDate of your trip

# 3.1 Add a new place

You can click on the map to add a place if you can't find anything from the text input!

Navigation here is a bit weird because you are re-routed to a route with no background.

That is due to the link used and that routing should've been better thought through for this part.

Nota: you can notice an `edit infos` button, this toggels a form that allows you to update and change the title/description/startDate/pictureUrl of your place

# 3.2 Place list

Same as section #3

# 3.3 Trip map

A cool thing is that the line that is drawn is actually real life road travel.

Here, it would've been nice to be able to drag n drop the cards, but we didn't think it would be necessary since there is already the `place list` view to do so.

# 3.4 Trip overview

Here would've been great to add a couple of graphs and be able to make use of the `budget`.

For example, we would've seen that a calendar view with each stop could've been amazing.

# 4 Place detail

Uploading an image for a place is impossible, that could've been a great addition.

Using something like s3 uploads to do so.

# 4.1 Poi

Here the loading of poi's is done only with the trips location.

An interesting feature would've been to be able to follow the map to load more poi's, for now the user is blocked on the list that is returned from `openrouteservice`.

The poi search radius is ~10km^2 around the location of the place.
# 5 Settings

Settings could've been buffed up to contain even more stuff:
- poi loading area (define a maximum zone to load pois from)
- theme changing and what not
