export const KEY_INGREDIENTS_GLOSSARY: Record<string, Array<{ name: string; description: string; icon: string; subtype?: string }>> = {
  "deep-conditioning-hair-mask": [
    {
      name: "Cetearyl Alcohol",
      description: "A fatty alcohol that helps soften and smooth the hair, keeping the mask's texture rich and creamy.",
      icon: "🧪",
      subtype: "Softening Fatty Alcohol"
    },
    {
      name: "Myristyl Alcohol",
      description: "A conditioning agent that helps detangle hair and improve manageability without weighing it down.",
      icon: "🧴",
      subtype: "Detangling Conditioner"
    },
    {
      name: "Inositol",
      description: "Helps strengthen hair from within, supporting elasticity and reducing breakage over time.",
      icon: "🧬",
      subtype: "Strengthening B-Vitamin"
    },
    {
      name: "Polyquaternium-37",
      description: "A conditioning polymer that adds shine and smoothness while helping detangle the hair shaft.",
      icon: "✨",
      subtype: "Shine Conditioning Polymer"
    }
  ],
  "deep-hydrating-shampoo": [
    {
      name: "Aqua",
      description: "Simply water. It forms the base of the formula and helps everything else mix and work smoothly together.",
      icon: "💧",
      subtype: "Purified Water Base"
    },
    {
      name: "Sodium Cocoyl Isethionate",
      description: "Comes from coconut and cleans your hair gently. No harsh, stripped-out feeling after washing.",
      icon: "🥥",
      subtype: "Coconut-Derived Cleanser"
    },
    {
      name: "Cocamidopropyl Betaine",
      description: "Helps clean your hair and gives the shampoo a nice, soft lather you'll actually enjoy using.",
      icon: "🧼",
      subtype: "Gentle Lathering Agent"
    },
    {
      name: "Sodium Lauroamphoacetate",
      description: "Works alongside the other cleansers to lift away buildup, while still being gentle on your scalp.",
      icon: "💆‍♀️",
      subtype: "Scalp-Friendly Surfactant"
    },
    {
      name: "Sodium Hydroxymethylglycinate",
      description: "A mild preservative. Keeps the formula safe and fresh, wash after wash.",
      icon: "🍃",
      subtype: "Mild Safe Preservative"
    }
  ]
};

export const PRODUCT_CLAIMS: Record<string, Array<{ name: string; value: string }>> = {
  "deep-conditioning-hair-mask": [
    { name: "Cruelty-Free", value: "Yes - not tested on animals" },
    { name: "Formula", value: "Free from parabens, sulfates, and silicones" },
    { name: "Packaging", value: "Recyclable packaging" }
  ],
  "deep-hydrating-shampoo": [
    { name: "Silicone-Free", value: "Yes - formulated without silicones to allow real moisture absorption" },
    { name: "Sulfate-Free", value: "Yes - free from harsh sulfates" },
    { name: "Key Cleansing Source", value: "Coconut-derived (Sodium Cocoyl Isethionate)" }
  ]
};

export const OVERRIDE_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  "deep-hydrating-shampoo": [
    {
      question: "Is this shampoo safe to use on color-treated or blonde hair?",
      answer: "Yes, it's gentle enough for colored and blonde hair. Since it's free from harsh sulfates, it cleanses without stripping out color, making it a good shampoo for colored hair that fades easily."
    },
    {
      question: "I have a dry, itchy scalp. Will this actually help?",
      answer: "This is formulated as a shampoo for dry scalp, focusing on hydration instead of stripping your scalp's natural oils. Most people notice their scalp feels calmer and less tight after a few washes."
    },
    {
      question: "My hair is heat-damaged from styling. Can this shampoo repair it?",
      answer: "No shampoo can undo damage completely, but this one's built for damaged hair care, focusing on improving softness, manageability and appearance over time with regular use."
    },
    {
      question: "Why is silicone-free better for moisturizing hair?",
      answer: "Silicones coat the hair and can build up over time, blocking real moisture from getting in. That's why we kept this formula silicone-free, so it stays one of the better hydrating shampoo options for hair that actually needs to absorb moisture, not just look shiny on the surface."
    },
    {
      question: "How is this different from a regular moisturizing shampoo?",
      answer: "A lot of shampoos that claim to moisturize hair just add slip or shine on the surface. This one's designed to actually hydrate the hair shaft itself, which is what makes it a genuinely best hair care shampoo to moisturize hair without leaving it feeling heavy or weighed down."
    }
  ],
  "deep-conditioning-hair-mask": [
    {
      question: "Can I use this mask if I already deep condition every week?",
      answer: "Yes, and it's actually a good habit. This isn't a harsh treatment, so using a hydrating hair mask weekly won't overload your hair - it just keeps building on the moisture you're already putting in. If your hair is on the drier side, this dry hair mask can even become a twice-a-week step without causing buildup."
    },
    {
      question: "Will this weigh down fine or curly hair?",
      answer: "No. A lot of people avoid deep conditioning because they're scared of that heavy, greasy feeling - especially with curls. This hair mask for curly hair was made to hydrate without flattening texture. It's lightweight enough that fine hair stays bouncy, and curly hair keeps its shape instead of going limp."
    },
    {
      question: "How soon after bleaching can I start using it?",
      answer: "You can actually start right after your appointment, once your hair is fully rinsed and dry. Bleached hair loses a lot of its natural moisture and protein during the process, so reaching for a hair mask for bleached hair early on helps it recover instead of staying brittle for weeks."
    },
    {
      question: "Is this the same as a regular conditioner, just thicker?",
      answer: "Not really. Regular conditioner smooths the surface, but a hair repair mask is built to work deeper into the strand, targeting the damage conditioner can't reach. That's the real difference between a quick rinse-out and an actual damaged hair mask - one maintains, the other repairs."
    },
    {
      question: "My hair is damaged from heat styling, not color - will this still help?",
      answer: "Definitely. Heat damage and chemical damage show up differently, but they both leave hair dry and weak. This mask works as one of the best hair masks for dry damaged hair regardless of the cause, whether it's from a flat iron, bleach, or just years of everyday styling."
    }
  ]
};
