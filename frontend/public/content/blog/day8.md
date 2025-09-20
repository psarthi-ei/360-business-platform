365 Days of Stories – Day 8: The Evolution of Ride Matching – From Basic Geometry to Real-World Roads

Defining the Problem: What Is a Ride and a Ride Request?
Before solving the problem, I needed to define two key concepts:

✔ Ride – A car owner traveling from start point A to end point B following a specific route.
✔ Ride Request – Someone looking for a ride from pickup point P to drop point D.

🚀 The real challenge: When someone requests a ride, how do we determine if their pickup (P) and drop (D) points lie on the route that a car owner would take from A to B?

This seemed like a simple matching problem at first. If P and D fall on the same route as A to B, the ride request should be matched to the ride.

But reality? 🚧 Not that simple.

Step 1: Using a Basic Line Equation
My initial approach was based on simple geometry:
💡 If a ride follows a path from A to B, and we know the equation of this path, we can check if P and D fall on the same line.

Here’s how I structured the logic:

1️⃣ First, draw a line between the start and end points of a ride (A to B) based on latitude and longitude (lat, long).
2️⃣ Define an X and Y axis, where the X-axis passes through the center of the Earth horizontally, meeting Greenwich.
3️⃣ Convert lat, long of all points into degrees so they can be plotted on the coordinate system.
4️⃣ Now, plot the points on the X-Y axis defined in step 2.
5️⃣ Using these two points, find the equation of the line (first calculating the slope and then forming the equation)
6️⃣ Once the equation is determined, check if the pickup & drop points (P & D) exist on this line.

🚀 This seemed like a logical solution!

✅ The assumption: If a ride is represented by a line, and we can confirm that P and D exist on this line, the ride request matches the ride.

🚧 But as I tested this logic, I realized it wasn’t that simple…

Step 2: The Zig-Zag Challenge – Roads Are Not Straight
🚧 Issue: Roads aren’t straight like mathematical lines.

A ride isn’t a single straight path but a series of connected segments.
The route consists of turns, intersections, and multiple waypoints.
💡 New Thought: Instead of treating a ride as one long line, I needed to break it into smaller segments.

1️⃣ Each ride consists of multiple short straight-line segments connecting GPS points.
2️⃣ To determine whether the pickup and drop points of a ride request match an existing ride, I had to check whether they appeared along any of these smaller segments.

🚀 This seemed promising, but another issue came up.

At this stage, I thought I had cracked the problem. Break the ride into smaller parts, and the issue is solved.

But real-world GPS data created a new set of challenges, which I’ll cover tomorrow. 

Have You Ever Started with a Simple Idea That Became a Complex Engineering Problem?

Would love to hear your experiences in the comments! 👇

hashtag#365DaysOfStories hashtag#Day8 hashtag#Entrepreneurship hashtag#StartupJourney hashtag#PersonalBrand hashtag#ElevateIdea