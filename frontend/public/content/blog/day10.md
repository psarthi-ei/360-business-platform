365 Days of Stories – Day 10: Cracking the Ride Search Algorithm - Matching Ride Requests to Rides

Once I structured rides as a graph network, the next challenge was finding matching rides for a ride request efficiently.

Step 1: Graph-Based Search

With rides stored as a Directed Acyclic Graph (DAG), I started with this approach:

1️⃣ Create a pickup zone (100-500m radius around the pickup location).
2️⃣ Identify all ride segments within this pickup zone.
3️⃣ Apply Dijkstra’s Algorithm to traverse routes.
4️⃣ Find edges that pass through the drop zone.
5️⃣ Extract rides that contain both pickup and drop points within time constraints.

🚀 At this point, I felt I had reasonable clarity on how to implement ride search.
But before diving into implementation, I had to figure out:
💡 How do we store ride data efficiently in the system?

Step 2: Storing Ride Data – Discovering MongoDB’s Geospatial Indexing

First I need to get route for a ride (collection of points). I explored Google Maps API for route data. It returned:
✔ GPS points (Lat, Lng, Time) between the start and end location.
✔ Turn-by-turn details of the journey.

Now, where to store this data?

💡 MongoDB’s spherical indexing was a breakthrough!
✔ Stores points as (Lat, Lng) coordinates.
✔ Supports searching for nearby points within a radius.
✔ Allows filtering based on time and availability.

🚀 This eliminated the need for graph traversal!

Step 3: The Ride Search Algorithm

With MongoDB, ride search became simple:

/*
 * Ride Search Logic:
 * 
 * - Get all rides near pickup location (with radius of lets say 100m)
 * - Get all rides near drop location (with radius of lets say 100m)
 * - Keep only rides present in both pickup & drop points
 * - Ensure pickup comes before drop (check ride direction)
 * - Remove unavailable rides
 * - Remaining rides are valid matches
 */

🚀 Hooray! I had cracked ride search.

I felt on top of the world, celebrating this breakthrough.

Step 4: Why Finding Ride Requests for a Ride is Harder

At this stage, my algorithm worked well for finding rides for a ride request.
🚧 Issue: What if I wanted to do the reverse?
💡 How do we find all matching ride requests for a ride that’s already planned?
📍 In my current approach, the pickup zone method wouldn’t work—because a ride consists of a collection of points forming a route.
📍 Instead of finding just one pickup and drop match, I needed to check all ride requests that could be fulfilled along the route.
📍 This turned out to be a much harder problem than just searching for a ride request.
🚀 That’s why finding an available cab near your location (like Uber) is easy, but cab-sharing is a much harder problem!

💡 Next, I had to rethink my approach to handling ride requests dynamically.

That’s what I tackled in Day 11.

Have You Ever Solved a Problem, Only to Find a Bigger One?
Would love to hear your experiences! 👇

hashtag#365DaysOfStories hashtag#Day10 hashtag#Entrepreneurship hashtag#StartupJourney hashtag#PersonalBrand hashtag#ElevateIdea