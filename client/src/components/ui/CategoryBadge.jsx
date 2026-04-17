import { Link } from 'react-router-dom';
export default function CategoryBadge({ category = 'Other', clickable = true }) {
  const cls = `badge badge-${category}`;
  return clickable
    ? <Link to={`/blogs?category=${category}`} className={cls + ' hover:opacity-80 transition'}>{category}</Link>
    : <span className={cls}>{category}</span>;
}
