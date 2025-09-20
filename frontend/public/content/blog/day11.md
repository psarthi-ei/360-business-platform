365 Days of Stories – Day 11: Cracking the Ride Request Search Algorithm – Finding Requests for a Ride

After solving how to find a ride for a ride request, I realized that finding ride requests for a planned ride was a much harder problem.

I started researching existing solutions and dived deep into algorithms and research papers to figure out:

🚀 How do we efficiently find points (pickup/drop locations) along a route?

Step 1: Researching Spatial Algorithms
I read multiple research papers and algorithms related to spherical geometry and spatial search, including:

📖 Primitive operations in computational geometry
📖 Convex hull & Voronoi diagrams
📖 Shortest path algorithms for taxis
📖 Fast route planning algorithms

💡 It was overwhelming!
There was a ton of information, but I stayed focused on one goal:
✔ How to find relevant points along a given route?

Anything unrelated, I discarded—I didn’t need a PhD in computational geometry, just a practical solution!

Step 2: The Polygon Approach – First Breakthrough
Initially, I thought:
💡 If I could create a large polygon covering the entire route, I could find all ride requests within it.

So I tried:
✔ Creating a bounding box (polygon) around the entire route.
✔ Querying all ride requests within this polygon.
✔ Filtering requests that had the shortest pickup distance to the route.

🚧 Issue: If the ride route is 20-30 km long, the polygon would be too large, covering almost the entire city of Bangalore.
💡 This would return too many results, making the search inefficient.

Back to square one. I needed a better approach.

Step 3: Route Boxer – The Game-Changer
Then I came across a concept called "Route Boxer" in one of the research papers.

🚀 Breakthrough Idea:
✔ Instead of creating one large polygon, create multiple small rectangles along the route.
✔ Each rectangle covers a small section of the route.
✔ The width of the rectangles aligns with the maximum pickup distance a ride requestor is willing to travel.

💡 Why was this better?
✅ Instead of one huge search area, I now had multiple small search areas.
✅ Each rectangle could be queried independently, improving accuracy.
✅ The search only returned relevant ride requests near the route.

🚀 Now, the search process became simple:
1️⃣ Create small rectangles along the entire route.
2️⃣ Query all ride requests within those rectangles.
3️⃣ Match pickup and drop points based on time and availability.

🚀 Hooray! I had cracked the ride request search algorithm.

Step 4: The Road to Implementation
With ride search and request matching solved, I had:
✔ The design
✔ The core algorithm (No code)
✔ The technology decisions

But this wasn’t an overnight success—it took me exactly one month to complete (from 30th Sep to 29th Oct 2015).

💡 Next: The Journey of Coding Begins— Day 12.

How Important is Design and Core Algorithm Before Writing the First Line of Code?👇

hashtag#365DaysOfStories hashtag#Day11 hashtag#Entrepreneurship hashtag#StartupJourney hashtag#PersonalBrand hashtag#ElevateIdea