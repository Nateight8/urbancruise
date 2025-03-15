import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

const nodeWidth = 320;
const nodeHeight = 100;

type LayoutDirection = "TB" | "LR";

/**
 * Function to calculate the layout of nodes and edges using Dagre.
 *
 * @param nodes - Array of React Flow nodes.
 * @param edges - Array of React Flow edges.
 * @param direction - Layout direction: "TB" for top-to-bottom or "LR" for left-to-right.
 * @returns Object containing updated nodes and edges with positions.
 */

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: LayoutDirection = "TB"
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({ rankdir: direction });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      throw new Error(`Node position not found for node: ${node.id}`);
    }
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
