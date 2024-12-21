const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const samplePosts = [
  { content: 'First post content', author: 'John', status: 'published' },
  { content: 'Second post content', author: 'Jane', status: 'draft' },
];

const sampleComments = [
  { postId: 1, author: 'Alice', content: 'Great post!' },
  { postId: 1, author: 'Bob', content: 'Interesting read' },
  { postId: 2, author: 'Charlie', content: 'Nice draft' },
];

async function seedDatabase() {
  try {
    // Insert posts
    for (const post of samplePosts) {
      await pool.query(
        'INSERT INTO posts (content, author, status) VALUES ($1, $2, $3)',
        [post.content, post.author, post.status]
      );
    }

    // Insert comments
    for (const comment of sampleComments) {
      await pool.query(
        'INSERT INTO comments (post_id, author, content) VALUES ($1, $2, $3)',
        [comment.postId, comment.author, comment.content]
      );
    }

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

seedDatabase();
