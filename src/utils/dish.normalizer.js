export function normalizeDishForMenu(dish) {
  const defaultVariant =
    dish.variants?.find((v) => v.isDefault) || dish.variants?.[0];

  const price = defaultVariant?.price ?? 0;

  return {
    id: dish._id,
    name: dish.name,
    description: dish.description,
    foodType: dish.foodType,

    imageUrl: dish.imageUrl,
    thumbnailUrl: dish.thumbnailUrl,

    arModel: dish.arModel || { isAvailable: false },

    variants: dish.variants || [],
    defaultVariant,
    startingPrice: price,

    // ✅ ADD THIS (FIX)
    price, // 👈 keeps cards working

    addOnGroups: Array.isArray(dish.addOnGroups)
      ? dish.addOnGroups.map((group) => ({
          id: group._id,
          name: group.name,
          required: group.required,
          minSelection: group.minSelection,
          maxSelection: group.maxSelection,
          addOns: Array.isArray(group.addOns)
            ? group.addOns.map((addon) => ({
                id: addon._id,
                name: addon.name,
                price: addon.price,
              }))
            : [],
        }))
      : [],

    tags: (dish.tagDetails || []).map((tag) => ({
      key: tag.key,
      name: tag.name,
      icon: tag.icon,
      color: tag.color,
    })),

    category: dish.categoryId
      ? {
          id: dish.categoryId._id,
          name: dish.categoryId.name,
          icon: dish.categoryId.icon,
        }
      : null,
  };
}
