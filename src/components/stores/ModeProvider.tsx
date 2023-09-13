import { createSafeContext } from "../../utils/create-safe-context";
import { type Edge, type Node } from "reactflow";
import { NodeData } from "../FlowBuilder/types/Swagger";
import { useState } from "react";

type AppendNodeMode = {
  type: "append-node";
};
type AddNodeBetweenMode = {
  type: "add-node-between";
  edge: Edge;
};
type EditNodeMode = {
  type: "edit-node";
  node: Node<NodeData>;
};

export type Mode = AppendNodeMode | AddNodeBetweenMode | EditNodeMode;

const [ModeSafeProvider, useMode] = createSafeContext<{
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  reset: () => void;
  isAdd: boolean;
  isEdit: boolean;
}>({
  mode: { type: "append-node" },
  setMode: () => {},
  reset: () => {},
  isAdd: true,
  isEdit: false,
});
const DEFAULT: Mode = { type: "append-node" };
function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(DEFAULT);
  function reset() {
    setMode(DEFAULT);
  }

  const isAdd = mode.type === "append-node" || mode.type === "add-node-between";
  const isEdit = mode.type === "edit-node";
  return (
    <ModeSafeProvider value={{ mode, setMode, reset, isAdd, isEdit }}>
      {children}
    </ModeSafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ModeProvider, useMode };
