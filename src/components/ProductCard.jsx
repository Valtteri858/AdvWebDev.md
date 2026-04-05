export default function ProductCard({ img, title, rating, price }) {
  return (
    <article className="tuotekortti">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>{rating}</p>
      <strong>{price}</strong>
      <button>Osta</button>
    </article>
  );
}
