import type { Post } from "../lib/news";

export default function BlogCard({ post }: { post: Post }) {
  const href = `/news/${post.slug}`;

  return (
    <div className="card border-0 border-radius-4px overflow-hidden box-shadow-large box-shadow-extra-large-hover">
      <div className="card-top d-flex align-items-center">
        <a href={href}>
          {/* TODO(WPGraphQL): avatar de author.node.avatar.url */}
          <img src={post.author.avatar} className="avtar" alt={post.author.name} />
        </a>
        <span className="fs-16">
          Por{" "}
          <a href={href} className="text-dark-gray fw-600">
            {post.author.name}
          </a>
        </span>
        <div className="like-count ms-auto fs-14">
          <a href={href} aria-label={`${post.likes} likes`}>
            <i className="fa-regular fa-heart text-red d-inline-block"></i>
            <span className="text-dark-gray fw-600">{post.likes}</span>
          </a>
        </div>
      </div>
      <div className="blog-image position-relative overflow-hidden">
        {/* TODO(WPGraphQL): featuredImage del post */}
        <a href={href}>
          <img src={post.image} alt={post.title} />
        </a>
      </div>
      <div className="card-body p-0">
        <div className="post-content p-11 md-p-9">
          <a
            href={href}
            className="card-title mb-10px fw-600 fs-19 lh-28 text-dark-gray d-inline-block"
          >
            {post.title}
          </a>
          <p className="mb-0">{post.excerpt}</p>
        </div>
      </div>
    </div>
  );
}

