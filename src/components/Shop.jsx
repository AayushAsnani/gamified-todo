import { useState } from "react";

/* ─── Crystal Packs ─── */
const CRYSTAL_PACKS = [
  {
    id: "pack-starter",
    name: "Starter Pouch",
    crystals: 5,
    xpCost: 20,
    emoji: "💎",
    tag: null,
  },
  {
    id: "pack-standard",
    name: "Crystal Bundle",
    crystals: 20,
    xpCost: 80,
    emoji: "💎💎",
    tag: null,
  },
  {
    id: "pack-premium",
    name: "Treasure Chest",
    crystals: 50,
    xpCost: 180,
    emoji: "💎💎💎",
    tag: "POPULAR",
  },
  {
    id: "pack-mega",
    name: "Dragon Hoard",
    crystals: 120,
    xpCost: 400,
    emoji: "🐉💎",
    tag: "BEST VALUE",
  },
];

/* ─── Clothing Items ─── */
const CLOTHING_CATEGORIES = [
  {
    id: "tshirts",
    label: "T-Shirts & Shirts",
    icon: "👕",
  },
  {
    id: "trousers",
    label: "Trousers & Pants",
    icon: "👖",
  },
];

const CLOTHING_ITEMS = [
  // ── T-Shirts & Shirts ──
  {
    id: "tshirt-crimson",
    category: "tshirts",
    name: "Crimson Blaze Tee",
    description: "A fiery red t-shirt that screams confidence.",
    cost: 10,
    emoji: "👕",
    colorName: "Crimson",
    colors: { body: "#e74c3c", sleeve: "#c0392b", collar: "#f1948a", badge: "#ff6b6b", hem: "#c0392b" },
  },
  {
    id: "tshirt-ocean",
    category: "tshirts",
    name: "Ocean Wave Tee",
    description: "Cool ocean blue for a calm, collected vibe.",
    cost: 10,
    emoji: "👕",
    colorName: "Ocean Blue",
    colors: { body: "#2980b9", sleeve: "#1a6fa0", collar: "#5dade2", badge: "#3498db", hem: "#1a6fa0" },
  },
  {
    id: "tshirt-emerald",
    category: "tshirts",
    name: "Emerald Forest Tee",
    description: "Deep green inspired by enchanted forests.",
    cost: 10,
    emoji: "👕",
    colorName: "Emerald",
    colors: { body: "#27ae60", sleeve: "#1e8449", collar: "#58d68d", badge: "#2ecc71", hem: "#1e8449" },
  },
  {
    id: "tshirt-sunset",
    category: "tshirts",
    name: "Sunset Glow Tee",
    description: "A warm orange that glows like the setting sun.",
    cost: 12,
    emoji: "👕",
    colorName: "Sunset Orange",
    colors: { body: "#e67e22", sleeve: "#ca6f1e", collar: "#f0b27a", badge: "#f39c12", hem: "#ca6f1e" },
  },
  {
    id: "shirt-midnight",
    category: "tshirts",
    name: "Midnight Formal Shirt",
    description: "A sleek dark navy button-down for formal quests.",
    cost: 20,
    emoji: "👔",
    colorName: "Midnight Navy",
    colors: { body: "#2c3e50", sleeve: "#1a252f", collar: "#5d6d7e", badge: "#34495e", hem: "#1a252f" },
    tag: "PREMIUM",
  },
  {
    id: "shirt-rose",
    category: "tshirts",
    name: "Rose Quartz Shirt",
    description: "A soft pink shirt with an elegant touch.",
    cost: 18,
    emoji: "👔",
    colorName: "Rose Pink",
    colors: { body: "#e91e63", sleeve: "#c2185b", collar: "#f48fb1", badge: "#f06292", hem: "#c2185b" },
  },
  {
    id: "tshirt-lavender",
    category: "tshirts",
    name: "Lavender Dream Tee",
    description: "Soft lavender for a magical, dreamy look.",
    cost: 12,
    emoji: "👕",
    colorName: "Lavender",
    colors: { body: "#9b59b6", sleeve: "#7d3c98", collar: "#c39bd3", badge: "#af7ac5", hem: "#7d3c98" },
  },
  {
    id: "shirt-gold",
    category: "tshirts",
    name: "Golden Champion Shirt",
    description: "A legendary gold shirt for top-tier adventurers.",
    cost: 35,
    emoji: "👔",
    colorName: "Royal Gold",
    colors: { body: "#d4a017", sleeve: "#b8860b", collar: "#f4d03f", badge: "#f1c40f", hem: "#b8860b" },
    tag: "LEGENDARY",
  },

  // ── Trousers & Pants ──
  {
    id: "pants-charcoal",
    category: "trousers",
    name: "Charcoal Joggers",
    description: "Classic dark joggers for everyday questing.",
    cost: 8,
    emoji: "👖",
    colorName: "Charcoal",
    colors: { waist: "#2d3436", buckle: "#ffeaa7", legL: "#636e72", legR: "#636e72", seam: "#576060" },
  },
  {
    id: "pants-indigo",
    category: "trousers",
    name: "Indigo Denim Jeans",
    description: "Deep indigo denim — a timeless classic.",
    cost: 12,
    emoji: "👖",
    colorName: "Indigo",
    colors: { waist: "#1a237e", buckle: "#c0c0c0", legL: "#283593", legR: "#283593", seam: "#1a237e" },
  },
  {
    id: "pants-khaki",
    category: "trousers",
    name: "Khaki Chinos",
    description: "Smart khaki chinos for a polished adventurer.",
    cost: 12,
    emoji: "👖",
    colorName: "Khaki",
    colors: { waist: "#8d6e63", buckle: "#ffeaa7", legL: "#a1887f", legR: "#a1887f", seam: "#8d6e63" },
  },
  {
    id: "pants-forest",
    category: "trousers",
    name: "Forest Cargo Pants",
    description: "Military-green cargos loaded with pockets.",
    cost: 15,
    emoji: "👖",
    colorName: "Forest Green",
    colors: { waist: "#2e7d32", buckle: "#ffeaa7", legL: "#388e3c", legR: "#388e3c", seam: "#2e7d32" },
  },
  {
    id: "pants-crimson",
    category: "trousers",
    name: "Crimson Sweats",
    description: "Bold red sweats for the daring quester.",
    cost: 10,
    emoji: "👖",
    colorName: "Crimson",
    colors: { waist: "#b71c1c", buckle: "#ffeaa7", legL: "#c62828", legR: "#c62828", seam: "#b71c1c" },
  },
  {
    id: "pants-royal",
    category: "trousers",
    name: "Royal Purple Trousers",
    description: "Regal purple pants fit for a quest king.",
    cost: 18,
    emoji: "👖",
    colorName: "Royal Purple",
    colors: { waist: "#4a148c", buckle: "#e1bee7", legL: "#6a1b9a", legR: "#6a1b9a", seam: "#4a148c" },
    tag: "PREMIUM",
  },
  {
    id: "pants-white",
    category: "trousers",
    name: "Arctic White Pants",
    description: "Clean white pants for the bold minimalist.",
    cost: 14,
    emoji: "👖",
    colorName: "Arctic White",
    colors: { waist: "#bdbdbd", buckle: "#ffeaa7", legL: "#e0e0e0", legR: "#e0e0e0", seam: "#bdbdbd" },
  },
  {
    id: "pants-obsidian",
    category: "trousers",
    name: "Obsidian Formal Trousers",
    description: "Sleek black formal trousers for the ultimate boss look.",
    cost: 25,
    emoji: "👖",
    colorName: "Obsidian Black",
    colors: { waist: "#1a1a2e", buckle: "#ffd700", legL: "#212121", legR: "#212121", seam: "#1a1a2e" },
    tag: "LEGENDARY",
  },
];

function Shop({ xp, crystals, onPurchase, onBuyCrystals, purchasedItems, equippedItems, onEquip }) {
  const [justBought, setJustBought] = useState(null);
  const [activeTab, setActiveTab] = useState("tshirts");
  const [justEquipped, setJustEquipped] = useState(null);

  function handleBuy(pack) {
    if (xp < pack.xpCost) return;
    onBuyCrystals(pack);
    setJustBought(pack.id);
    setTimeout(() => setJustBought(null), 1200);
  }

  function handleBuyItem(item) {
    if (crystals < item.cost) return;
    if (purchasedItems.includes(item.id)) return;
    onPurchase(item);
    setJustBought(item.id);
    setTimeout(() => setJustBought(null), 1200);
  }

  function handleEquip(item) {
    onEquip(item);
    setJustEquipped(item.id);
    setTimeout(() => setJustEquipped(null), 800);
  }

  const filteredItems = CLOTHING_ITEMS.filter(
    (item) => item.category === activeTab
  );

  // Determine which items are equipped
  const equippedTshirt = equippedItems?.tshirt || null;
  const equippedTrousers = equippedItems?.trousers || null;

  return (
    <div className="shop">
      <div className="shop-header">
        <h2>Quest Shop</h2>
        <div className="shop-balances">
          <p className="shop-balance">
            <span className="shop-xp">⚡ {xp} XP</span>
          </p>
          <p className="shop-balance">
            <span className="shop-crystals">💎 {crystals} Crystals</span>
          </p>
        </div>
      </div>

      {/* Crystal Exchange Section */}
      <section className="crystal-exchange">
        <div className="crystal-exchange-header">
          <h3>
            <span className="crystal-exchange-icon">💎</span>
            Crystal Exchange
          </h3>
          <p className="crystal-exchange-subtitle">
            Trade your hard-earned XP for precious crystals
          </p>
        </div>

        <div className="crystal-packs-grid">
          {CRYSTAL_PACKS.map((pack) => {
            const canAfford = xp >= pack.xpCost;
            const wasBought = justBought === pack.id;

            return (
              <div
                key={pack.id}
                className={`crystal-pack-card${!canAfford ? " is-locked" : ""}${wasBought ? " just-bought" : ""}`}
              >
                {pack.tag && (
                  <span className="crystal-pack-tag">{pack.tag}</span>
                )}
                <div className="crystal-pack-emoji">{pack.emoji}</div>
                <div className="crystal-pack-info">
                  <p className="crystal-pack-name">{pack.name}</p>
                  <p className="crystal-pack-amount">
                    {pack.crystals} Crystals
                  </p>
                </div>
                <div className="crystal-pack-footer">
                  <span className="crystal-pack-cost">
                    ⚡ {pack.xpCost} XP
                  </span>
                  <button
                    type="button"
                    className="crystal-buy-button"
                    disabled={!canAfford}
                    onClick={() => handleBuy(pack)}
                  >
                    {wasBought ? "✓ Bought!" : canAfford ? "Buy" : "Not enough XP"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Clothing Shop Section ─── */}
      <section className="clothing-shop">
        <div className="clothing-shop-header">
          <h3>
            <span className="clothing-shop-icon">🛍️</span>
            Wardrobe Shop
          </h3>
          <p className="clothing-shop-subtitle">
            Dress your avatar in style — spend crystals to unlock outfits
          </p>
        </div>

        {/* Category Tabs */}
        <div className="clothing-tabs">
          {CLOTHING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`clothing-tab${activeTab === cat.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <span className="clothing-tab-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Currently Equipped */}
        <div className="equipped-indicator">
          <span className="equipped-label">Currently Wearing:</span>
          {activeTab === "tshirts" && (
            <span className="equipped-item-name">
              {equippedTshirt
                ? CLOTHING_ITEMS.find((i) => i.id === equippedTshirt)?.name ?? "Default"
                : "Default Purple Tee"}
            </span>
          )}
          {activeTab === "trousers" && (
            <span className="equipped-item-name">
              {equippedTrousers
                ? CLOTHING_ITEMS.find((i) => i.id === equippedTrousers)?.name ?? "Default"
                : "Default Charcoal Joggers"}
            </span>
          )}
        </div>

        {/* Clothing Grid */}
        <div className="clothing-grid">
          {filteredItems.map((item) => {
            const owned = purchasedItems.includes(item.id);
            const canAfford = crystals >= item.cost;
            const wasBought = justBought === item.id;
            const wasEquipped = justEquipped === item.id;
            const isEquipped =
              (item.category === "tshirts" && equippedTshirt === item.id) ||
              (item.category === "trousers" && equippedTrousers === item.id);

            return (
              <div
                key={item.id}
                className={`clothing-card${owned ? " is-owned" : ""}${!owned && !canAfford ? " is-locked" : ""}${wasBought ? " just-bought" : ""}${isEquipped ? " is-equipped" : ""}`}
              >
                {item.tag && (
                  <span className="clothing-card-tag">{item.tag}</span>
                )}
                <div className="clothing-card-preview">
                  <div
                    className="clothing-swatch"
                    style={{
                      background: item.category === "tshirts"
                        ? `linear-gradient(135deg, ${item.colors.body}, ${item.colors.sleeve})`
                        : `linear-gradient(135deg, ${item.colors.legL}, ${item.colors.waist})`,
                    }}
                  >
                    <span className="clothing-swatch-emoji">{item.emoji}</span>
                  </div>
                  <span
                    className="clothing-color-dot"
                    style={{
                      background: item.category === "tshirts" ? item.colors.body : item.colors.legL,
                    }}
                  />
                </div>
                <div className="clothing-card-info">
                  <p className="clothing-card-name">{item.name}</p>
                  <p className="clothing-card-color">{item.colorName}</p>
                  <p className="clothing-card-desc">{item.description}</p>
                </div>
                <div className="clothing-card-footer">
                  {owned ? (
                    <>
                      <span className="clothing-owned-badge">✓ Owned</span>
                      <button
                        type="button"
                        className={`clothing-equip-button${isEquipped ? " is-equipped" : ""}${wasEquipped ? " just-equipped" : ""}`}
                        onClick={() => handleEquip(item)}
                        disabled={isEquipped}
                      >
                        {isEquipped ? "Wearing" : "Equip"}
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="clothing-card-cost">
                        💎 {item.cost}
                      </span>
                      <button
                        type="button"
                        className="clothing-buy-button"
                        disabled={!canAfford}
                        onClick={() => handleBuyItem(item)}
                      >
                        {wasBought
                          ? "✓ Purchased!"
                          : canAfford
                            ? "Buy"
                            : "Need Crystals"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export { CLOTHING_ITEMS };
export default Shop;
