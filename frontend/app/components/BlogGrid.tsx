import type { Post } from "../lib/news";
import BlogCard from "./BlogCard";

export default function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <ul
      className="blog-masonry blog-wrapper grid-loading grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-1col xs-grid-1col gutter-extra-large"
      data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'
    >
      <li className="grid-sizer"></li>
      {posts.map((post) => (
        <li className="grid-item" key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
