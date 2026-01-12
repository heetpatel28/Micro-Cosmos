import { api } from "../services/api";
import { useGeneratorStore } from "../store/generatorStore";

export default function MotionButton() {
  const addLog = useGeneratorStore((s) => s.addLog);

  const generate = async () => {
    addLog("info", "Starting generation...");
    await api.post("/generate", {
      service: "shopping-cart",
      type: "backend",
      stack: "node",
      version: "20",
    });
  };

  return (
    <button
      onClick={generate}
      className="bg-cyan-500 px-6 py-3 rounded-lg text-black font-bold"
    >
      Generate Code
    </button>
  );
}
