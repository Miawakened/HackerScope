import styles from "./CommentList.module.css";
import Link from "next/link";

function CommentItem({ comment }) {
  return (
    <li className={styles.comment}>
      <p className={styles.meta}>
      <strong>
        {comment.by && comment.by !== "unknown" ? (
          <Link
            className={styles.authorLink}
            href={`/users/${encodeURIComponent(comment.by)}`}
          >
            {comment.by}
          </Link>
        ) : (
          comment.by
        )}
      </strong>
        {comment.score != null && <span>{comment.score} points</span>}
        <span>{comment.timeAgo}</span>
      </p>

      {comment.html ? (
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: comment.html }}
        />
      ) : (
        <p className={styles.text}>{comment.text}</p>
      )}

      {comment.replies?.length > 0 && (
        <ul className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem comment={reply} key={reply.id} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CommentList({ comments, commentCount }) {
  return (
    <section className={styles.section} aria-label="Story comments">
      <div className={styles.heading}>
        <h2>Comments ({commentCount})</h2>
      </div>

      {comments.length > 0 ? (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <CommentItem comment={comment} key={comment.id} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No comments are available for this story.</p>
      )}
    </section>
  );
}