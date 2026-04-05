import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const products = [
    { img: "/kuvat/Whey.jpg", title: "Heraproteiini", rating: "★★★★★ (132)", price: "€22.90" },
    { img: "/kuvat/Pwo.jpg", title: "Tehonlisääjä", rating: "★★★★☆ (89)", price: "€17.90" },
    { img: "/kuvat/Bcaa.jpg", title: "BCAA", rating: "★★★★☆ (61)", price: "€14.90" },
    { img: "/kuvat/VitD.jpg", title: "D-vitamiini", rating: "★★★★★ (54)", price: "€9.90" },

  { img: "/kuvat/Whey.jpg", title: "Heraproteiini", rating: "★★★★★ (132)", price: "€22.90" },
  { img: "/kuvat/Pwo.jpg", title: "Tehonlisääjä", rating: "★★★★☆ (89)", price: "€17.90" },
  { img: "/kuvat/Bcaa.jpg", title: "BCAA", rating: "★★★★☆ (61)", price: "€14.90" },
  { img: "/kuvat/VitD.jpg", title: "D-vitamiini", rating: "★★★★★ (54)", price: "€9.90" },
  ];

  return (
    <section className="myydyimmat">
      {products.map((p, i) => (
        <ProductCard key={i} {...p} />
      ))}
    </section>
  );
}
