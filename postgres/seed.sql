BEGIN;

-- Clear existing data
TRUNCATE posts, comments RESTART IDENTITY CASCADE;

-- Seed posts
INSERT INTO posts (content, author, status) VALUES
('An in-depth analysis of modern web development trends', 'John Smith', 'published'),
('Understanding microservices architecture', 'Jane Doe', 'published'),
('The future of artificial intelligence', 'Michael Brown', 'published'),
('Best practices for database design', 'Sarah Wilson', 'published'),
('Getting started with Docker and Kubernetes', 'Robert Johnson', 'published'),
('Draft: Upcoming features in JavaScript 2024', 'Emily Davis', 'draft'),
('My thoughts on serverless architecture', 'David Miller', 'published'),
('Draft: Security best practices for web apps', 'Lisa Anderson', 'draft'),
('Understanding OAuth and JWT', 'James Wilson', 'published'),
('The rise of edge computing', 'Maria Garcia', 'published');

-- Seed comments
INSERT INTO comments (post_id, author, content) VALUES
(1, 'Alice Cooper', 'Great insights! This really helped me understand the current trends.'),
(1, 'Bob Wilson', 'Would love to see more examples about React frameworks.'),
(1, 'Charlie Brown', 'Very comprehensive analysis!'),
(2, 'Diana Prince', 'This cleared up a lot of my confusion about microservices.'),
(2, 'Edward Norton', 'Could you elaborate more on service discovery?'),
(2, 'Frank Castle', 'Great real-world examples!'),
(3, 'Grace Hopper', 'Fascinating perspective on AI development'),
(3, 'Henry Ford', 'The ethical considerations section was particularly interesting'),
(3, 'Irene Adler', 'Looking forward to part 2!'),
(4, 'Jack Sparrow', 'These database principles are timeless'),
(4, 'Kate Bishop', 'Would love to see PostgreSQL specific examples'),
(5, 'Liam Neeson', 'Finally understood how to properly use Docker volumes'),
(5, 'Mary Jane', 'The Kubernetes section was particularly helpful'),
(5, 'Nick Fury', 'Great introduction to containerization'),
(6, 'Oliver Queen', 'Cant wait to see the final version'),
(6, 'Peter Parker', 'The proposed array methods look promising'),
(7, 'Quinn Gray', 'Serverless changed how I think about scaling'),
(7, 'Rachel Green', 'Cost analysis section was eye-opening'),
(7, 'Steve Rogers', 'Great comparison with traditional architectures'),
(8, 'Tony Stark', 'Looking forward to the OWASP section'),
(8, 'Uma Thurman', 'Security is often overlooked, glad to see this covered'),
(9, 'Victor Stone', 'This made OAuth finally click for me'),
(9, 'Walter White', 'Great explanation of token handling'),
(9, 'Xavier Chen', 'The flow diagrams were very helpful'),
(10, 'Yoda Master', 'Edge computing is the future indeed'),
(10, 'Zelda Link', 'Great performance metrics!'),
(1, 'Adam West', 'Would love to see a follow-up article'),
(2, 'Bruce Wayne', 'The scalability section was enlightening'),
(3, 'Clark Kent', 'AI ethics need more attention'),
(8, 'Diana Ross', 'Security first, always!');

COMMIT;
