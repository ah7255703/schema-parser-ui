import type { Method, NodeData, TransformedPath } from "./types/Swagger";
import { useReactFlow, type Node, Edge } from "reactflow";
import { genId } from "./utils/genId";
import { MethodBtn } from "./MethodRenderer";
import { updateNodePositions } from "./utils/updateNodePosition";
import { Y } from "./consts";
import { useMode } from "../stores/ModeProvider";
import { useCallback } from "react";

export function PathButton({ path }: { path: TransformedPath }) {
  const { mode, reset } = useMode();
  const { setNodes, getNodes, setEdges } = useReactFlow<NodeData>();
  const nodes = getNodes();
  const appendNode = useCallback(
    (payload: NodeData) => {
      const id = genId();
      const newNode: Node = {
        id: id,
        type: "endpointNode",
        data: payload,
        draggable: false,
        position: { x: 0, y: Y * nodes.length },
      };
      setNodes((nds) => updateNodePositions([...nds, newNode], Y));
    },
    [nodes.length, setNodes]
  );

  function addNodeBetween(edge: Edge, payload: NodeData) {
    const targetNode = nodes.find((node) => node.id === edge.target);
    const sourceNode = nodes.find((node) => node.id === edge.source);
    if (!targetNode || !sourceNode) {
      return;
    }
    // delete the edge
    setEdges((eds) => eds.filter((ed) => ed.id !== edge.id));
    // add the new node
    const id = genId();
    const newNode: Node = {
      id: id,
      type: "endpointNode",
      data: payload,
      draggable: false,
      position: {
        x: 0,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
    };
    // put the new node in the middle of the two nodes that were connected (make sure the node is sorted in array too)
    const sourceIndex = nodes.findIndex((node) => node.id === sourceNode.id);
    const newNodes = nodes
      .slice(0, sourceIndex)
      .concat(newNode)
      .concat(nodes.slice(sourceIndex));
    setNodes(updateNodePositions(newNodes, Y));
  }
  function isPresentInNodes(method: Method) {
    return !!nodes.find((node) => {
      return (
        node.data.path === path.path &&
        node.data.method.toLowerCase() === method.toLowerCase()
      );
    })
  }
  return (
    <div>
      <div className="text-start h-full p-2 hover:bg-gray-100 transition-colors w-full">
        <span className="text-black/80 text-lg font-medium">{path.path}</span>
        <span className="flex w-full items-center gap-1 mt-2">
          {path.methods.map((method) => {
            return (
              <MethodBtn
                key={method.method}
                method={method.method}
                className="data-[present=true]:pointer-events-none data-[present=true]:opacity-50"
                data-present={isPresentInNodes(method.method)}
                onClick={() => {
                  if (isPresentInNodes(method.method)) {
                    return;
                  }
                  const newNode: NodeData = {
                    ...path,
                    ...method,
                  };
                  if (mode.type === "append-node") {
                    appendNode(newNode);
                  } else if (mode.type === "add-node-between") {
                    addNodeBetween(mode.edge, newNode);
                    reset();
                  }
                }}
              >
                {method.method.toUpperCase()}
              </MethodBtn>
            );
          })}
        </span>
      </div>
    </div>
  );
}