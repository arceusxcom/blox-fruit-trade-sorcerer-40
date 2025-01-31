import { useState } from "react";
import { FruitCard } from "@/components/FruitCard";
import { FruitSelector } from "@/components/FruitSelector";
import { TradeAnalysis } from "@/components/TradeAnalysis";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface Trade {
  fruits: Array<{
    name?: string;
    image?: string;
    price?: number;
    permanent?: number;
    isPhysical?: boolean;
  }>;
  total: number;
}

const Index = () => {
  const { toast } = useToast();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ side: "you" | "them"; index: number } | null>(
    null
  );

  const [yourTrade, setYourTrade] = useState<Trade>({
    fruits: Array(4).fill({}),
    total: 0,
  });

  const [theirTrade, setTheirTrade] = useState<Trade>({
    fruits: Array(4).fill({}),
    total: 0,
  });

  const handleSelect = (fruit: any) => {
    if (!selectedSlot) return;

    const { side, index } = selectedSlot;
    const trade = side === "you" ? yourTrade : theirTrade;
    const setTrade = side === "you" ? setYourTrade : setTheirTrade;

    const newFruits = [...trade.fruits];
    newFruits[index] = {
      name: fruit.name,
      image: fruit.image,
      price: fruit.physical,
      permanent: fruit.permanent,
      isPhysical: true,
    };

    // Check if all current slots are filled
    const allSlotsFilled = newFruits.every(fruit => fruit.name);
    if (allSlotsFilled) {
      newFruits.push({});
    }

    const newTotal = newFruits.reduce(
      (acc, fruit) => acc + (fruit.isPhysical ? (fruit.price || 0) : (fruit.permanent || 0)),
      0
    );

    setTrade({
      fruits: newFruits,
      total: newTotal,
    });
  };

  const handleRemove = (side: "you" | "them", index: number) => {
    const trade = side === "you" ? yourTrade : theirTrade;
    const setTrade = side === "you" ? setYourTrade : setTheirTrade;

    const newFruits = trade.fruits.filter((_, i) => i !== index);
    
    // Ensure there's always at least 4 slots
    while (newFruits.length < 4) {
      newFruits.push({});
    }

    const newTotal = newFruits.reduce(
      (acc, fruit) => acc + (fruit.isPhysical ? (fruit.price || 0) : (fruit.permanent || 0)),
      0
    );

    setTrade({
      fruits: newFruits,
      total: newTotal,
    });
  };

  const handleToggle = (side: "you" | "them", index: number) => (checked: boolean) => {
    const trade = side === "you" ? yourTrade : theirTrade;
    const setTrade = side === "you" ? setYourTrade : setTheirTrade;
    const fruit = trade.fruits[index];

    if (!fruit.name) return;

    const newFruits = [...trade.fruits];
    newFruits[index] = {
      ...fruit,
      isPhysical: !checked,
    };

    const newTotal = newFruits.reduce(
      (acc, fruit) => acc + (fruit.isPhysical ? (fruit.price || 0) : (fruit.permanent || 0)),
      0
    );

    setTrade({
      fruits: newFruits,
      total: newTotal,
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Blox Fruit Calculator
          </h1>
          <p className="text-white/60">Calculate and compare fruit trades with ease</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Your Trade */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">You</h2>
            <div className="grid grid-cols-2 gap-4">
              {yourTrade.fruits.map((fruit, index) => (
                <FruitCard
                  key={index}
                  {...fruit}
                  onToggle={handleToggle("you", index)}
                  onClick={() => {
                    setSelectedSlot({ side: "you", index });
                    setSelectorOpen(true);
                  }}
                  onRemove={fruit.name ? () => handleRemove("you", index) : undefined}
                />
              ))}
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-blox-panel">
              <span className="text-lg">PRICE:</span>
              <span className="text-xl text-green-400">
                ${yourTrade.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Their Trade */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Them</h2>
            <div className="grid grid-cols-2 gap-4">
              {theirTrade.fruits.map((fruit, index) => (
                <FruitCard
                  key={index}
                  {...fruit}
                  onToggle={handleToggle("them", index)}
                  onClick={() => {
                    setSelectedSlot({ side: "them", index });
                    setSelectorOpen(true);
                  }}
                  onRemove={fruit.name ? () => handleRemove("them", index) : undefined}
                />
              ))}
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-blox-panel">
              <span className="text-lg">PRICE:</span>
              <span className="text-xl text-green-400">
                ${theirTrade.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <TradeAnalysis yourTotal={yourTrade.total} theirTotal={theirTrade.total} />

        <FruitSelector
          open={selectorOpen}
          onOpenChange={setSelectorOpen}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );

};

export default Index;
