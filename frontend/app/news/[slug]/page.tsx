import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleHeader from "../../components/ArticleHeader";
import BlogGrid from "../../components/BlogGrid";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { POSTS, getPostBySlug, getRelatedPosts } from "../../lib/news";

type PostDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Article not found | UNETI" };
  }

  return {
    title: `${post.title} | UNETI News`,
    description: post.excerpt,
  };
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const firstColumn = post.body.slice(0, 2);
  const secondColumn = post.body.slice(2);

  return (
    <>
      <SiteHeader />
      <main>
        <ArticleHeader post={post} />

        <section className="pb-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h4 className="alt-font text-dark-gray fw-600 ls-minus-1px w-90 md-w-100">
                  {post.excerpt}
                </h4>
              </div>
              <div className="col-lg-10 mb-6 sm-mb-35px">
                <div className="row">
                  <div className="col-lg-6 last-paragraph-no-margin md-mb-30px">
                    {firstColumn.map((paragraph) => (
                      <p key={paragraph} className="w-90 lg-w-100">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="col-lg-6 last-paragraph-no-margin">
                    {secondColumn.map((paragraph) => (
                      <p key={paragraph} className="w-90 lg-w-100">
                        {paragraph}
                      </p>
                    ))}
                    <blockquote className="border-left border-color-dark-gray ps-25px mt-30px">
                      <p className="fs-18 lh-30 text-dark-gray fw-500 mb-0">
                        “Education is the most powerful tool we can use to change the world.”
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
              <div className="col-lg-10">
                <div className="row align-items-center border-top border-bottom border-color-extra-medium-gray pt-20px pb-20px">
                  <div className="col-md-7 text-center text-md-start md-mb-15px">
                    <span className="d-inline-block fw-600 text-dark-gray me-10px">Tags:</span>
                    {post.tags.map((tag) => (
                      <a
                        href="/news"
                        key={tag}
                        className="d-inline-block fs-14 fw-600 text-uppercase border border-color-extra-medium-gray border-radius-30px ps-15px pe-15px pt-5px pb-5px me-5px mb-5px"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                  <div className="col-md-5 text-center text-md-end">
                    <div className="elements-social social-icon-style-02">
                      <ul className="small-icon dark d-inline-block">
                        <li>
                          <a className="facebook" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Compartir en Facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                          </a>
                        </li>
                        <li>
                          <a className="twitter" href="https://www.twitter.com/" target="_blank" rel="noreferrer" aria-label="Compartir en Twitter">
                            <i className="fa-brands fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a className="instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Compartir en Instagram">
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="bg-very-light-gray border-radius-6px p-40px sm-p-25px">
                  <div className="row align-items-center">
                    <div className="col-md-auto text-center mb-20px md-mb-0">
                      <img
                        src={post.author.avatar}
                        className="rounded-circle w-100px"
                        alt={post.author.name}
                      />
                    </div>
                    <div className="col-md text-center text-md-start last-paragraph-no-margin">
                      <span className="d-block alt-font fs-19 fw-600 text-dark-gray">
                        {post.author.name}
                      </span>
                      <span className="d-block fs-14 text-uppercase fw-600 mb-10px">
                        {post.category} · {post.readTime}
                      </span>
                      <p className="mb-0">
                        Periodista de la Dirección de Comunicaciones de UNETI. Cubre vida
                        universitaria, investigación y proyectos académicos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-tranquil-white">
          <div className="container">
            <div className="row justify-content-center align-items-center mb-4 text-center">
              <div className="col-12">
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Related articles
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <BlogGrid posts={relatedPosts} />
              </div>
            </div>
            <div className="row justify-content-center mt-5">
              <div className="col-auto">
                <a
                  href="/news"
                  className="btn btn-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text"
                >
                  <span>
                    <span className="btn-double-text" data-text="Volver a todas las noticias">
                      Volver a todas las noticias
                    </span>
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
