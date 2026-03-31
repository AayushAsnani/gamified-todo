import { motion } from "framer-motion";

function Shop({ xp }) {
  return (
    <div className="shop">
      <div className="shop-header">
        <h2>Quest Shop</h2>
        <p className="shop-balance">
          Your balance: <span className="shop-xp">{xp} XP</span>
        </p>
      </div>

      <div className="shop-empty">
        <p>🏗️ Shop is under construction!</p>
        <p className="shop-empty-sub">New items coming soon. Keep earning XP!</p>
      </div>
    </div>
  );
}

export default Shop;
