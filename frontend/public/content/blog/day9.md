365 Days of Stories – Day 9: The Evolution of Ride Matching – Handling GPS Precision & Spherical Geometry

In Day 8, I talked about how I initially approached ride matching using simple geometry, assuming that roads were straight lines. But I quickly realized:

🚧 Roads aren’t straight.
🚧 GPS locations are precise.
🚧 The Earth isn’t flat.

Each of these brought new challenges, and I had to rethink my entire approach.

Step 3: The Lat/Lon Precision Problem – Why Exact Points Wouldn’t Match

Even if a pickup or drop point is theoretically on the same route, its latitude and longitude values won’t match exactly.

🚧 Issue:

Even if a point is just 1 meter away from the ride path, its lat, long values will be slightly different.
Since our logic was based on mathematical equations, a tiny variation in coordinates could cause a mismatch—even if the user was on the same road.
💡 Solution: Expand the Search Area
1️⃣ Instead of checking for an exact match, I created a 100m zone around each ride segment.
2️⃣ For each location, I calculated four new points—100 meters to the North, East, West, and South.
3️⃣ Using these, I formed a polygon around the route.
4️⃣ Now, instead of checking if a point is on the exact ride, I checked if the ride passes through this polygon.

🚀 This handled minor GPS variations, improving match accuracy.

But I still had one more problem…

Step 4: The Earth Isn’t Flat – Entering Spherical Geometry

Until now, I treated the world like a flat map, using X and Y coordinates as if I was plotting points on a piece of paper.

🚧 Issue: A straight line on a flat map doesn’t accurately represent a real-world path on a spherical planet.

💡 I needed to learn spherical geometry.
I started studying:
✔ How latitude and longitude work in relation to Earth’s curvature.
✔ What "degrees" mean in terms of real-world distances.
✔ How to calculate points at a specific distance and direction on a sphere.

At this point, my simple straight-line approach was no longer enough.

Step 5: How to Represent All Rides in the System?

🚧 Issue: Searching every ride one by one wasn’t scalable.

💡 New Approach: Represent Rides as a Global Network
Instead of treating rides as separate routes, I structured them into a network of ride segments:

1️⃣ Each ride is a collection of GPS points (nodes).
2️⃣ Each segment between two points is an edge.
3️⃣ Each edge stores ride details like ride ID, time, direction, and speed.
4️⃣ Vertices (junctions) link multiple rides together.

🚀 Now, instead of searching every ride one by one, I could query a structured network.

This meant:
✅ Finding ride matches faster.
✅ Handling millions of rides efficiently.
✅ Filtering rides based on real-world conditions.

I still had to crack the ride search algo, that's for tomorrow.

Have You Ever Faced Unexpected Complexity While Solving a Simple Problem?
Would love to hear your thoughts! 👇

hashtag#365DaysOfStories hashtag#Day9 hashtag#Entrepreneurship hashtag#StartupJourney hashtag#PersonalBrand hashtag#ElevateIdea