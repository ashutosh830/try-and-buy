export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow transition hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/640x480?text=Product"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-teal-300">{product.category}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{product.name}</h3>
          </div>
          <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-slate-950">
            Rs. {product.price}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-300">{product.description}</p>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{product.vendor?.shopName || product.vendor?.name}</span>
          <span>Stock: {product.inventoryCount}</span>
        </div>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product._id)}
            className="w-full rounded-2xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Add To Trial Cart
          </button>
        )}
      </div>
    </article>
  );
}
