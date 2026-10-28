import news from "../data/news.json";
import copy from "../data/copy.json";
import Icon from "./Icon";

function NewsList({ items }) {
  return (
    <ul className="news-list">
      {items.map((item) => (
        <li key={`${item.isoDate}-${item.date}`}>
          <time className="news-date" dateTime={item.isoDate.slice(0, 7)}>
            {item.date}
          </time>
          <p className="news-copy">
            {item.content.map((segment, index) =>
              segment.href ? (
                <a
                  key={index}
                  href={segment.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {segment.text}
                </a>
              ) : (
                segment.text
              ),
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Sidebar({ mobile = false }) {
  const titleId = mobile ? "mobile-news-title" : "news-title";

  return (
    <aside
      className={`sidebar news-rail ${mobile ? "mobile-news" : "desktop-news"}`}
      aria-label="News and attending"
    >
      <section className="news-block" aria-labelledby={titleId}>
        <h2 className="news-heading" id={titleId}>
          {copy.news}
          <Icon name="radio" />
        </h2>
        <NewsList items={news.items} />
        <div className="news-archive-list" aria-label="Archived news">
          {news.archive.map((group) => (
            <details
              className="news-archive"
              key={group.year}
              aria-label={`${group.year} news`}
            >
              <summary>{group.year}</summary>
              <section
                className="news-archive-year"
                aria-label={`${group.year} news`}
              >
                <NewsList items={group.items} />
              </section>
            </details>
          ))}
        </div>
      </section>
    </aside>
  );
}
