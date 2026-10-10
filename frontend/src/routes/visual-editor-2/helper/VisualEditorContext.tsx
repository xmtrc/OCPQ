import { createContext } from "react";
import type { OCELInfo } from "@/types/ocel.ts";
import type { EdgeDataTypes, NodeDataTypes } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import type { nodeTypes } from "@/routes/visual-editor-2/helper/const.ts";
import type { XYPosition } from "@xyflow/react";

export const VisualEditorContext = createContext<{
	ocelInfo?: OCELInfo;
	addNewNode: (
		type: keyof typeof nodeTypes,
		screenPos?: XYPosition,
		parentNodeId?: string,
	) => unknown;
	onNodeDataChange: (id: string, newData: Partial<NodeDataTypes> | undefined) => unknown;
	onEdgeDataChange: (id: string, newData: Partial<EdgeDataTypes> | undefined) => unknown;
}>({
	ocelInfo: undefined,
	addNewNode: () => {},
	onNodeDataChange: () => {},
	onEdgeDataChange: () => {},
});
