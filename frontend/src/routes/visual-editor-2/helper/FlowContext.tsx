import { createContext } from "react";
import type { Node, Edge, ReactFlowInstance } from "@xyflow/react";
import type { NodeDataTypes, EdgeDataTypes } from "@/routes/visual-editor-2/helper/flowTypes.ts";

export type TypedFlowInstance = ReactFlowInstance<Node<NodeDataTypes>, Edge<EdgeDataTypes>>;

export const FlowContext = createContext<{
	flowInstance: TypedFlowInstance | undefined;
	setInstance: (i: TypedFlowInstance | undefined) => unknown;
}>({
	flowInstance: undefined,
	setInstance: () => {},
});
