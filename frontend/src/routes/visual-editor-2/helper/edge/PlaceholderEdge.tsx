import { type Edge, EdgeLabelRenderer, type EdgeProps } from "@xyflow/react";
import type { PlaceHolderEdgeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import QuantifiedObjectEdge from "@/routes/visual-editor/helper/QuantifiedObjectEdge.tsx";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { LuPen, LuTrash } from "react-icons/lu";

export default function PlaceholderEdge(props: EdgeProps<Edge<PlaceHolderEdgeData>>) {
	return (
		<>
			<QuantifiedObjectEdge {...props} />
			<EdgeLabelRenderer>
				<ContextMenu>
					<ContextMenuTrigger
						onContextMenu={(ev) => {
							ev.stopPropagation();
						}}
					>
						<div
							style={{
								position: "absolute",
								fontSize: 12,
								pointerEvents: "all",
							}}
							className="nodrag nopan flex flex-col items-center -mt-1"
						></div>
					</ContextMenuTrigger>
					<ContextMenuPortal>
						<ContextMenuContent>
							<ContextMenuItem>Cancel</ContextMenuItem>
							<ContextMenuItem>
								<LuPen className="mr-1" /> Edit Name
							</ContextMenuItem>
							<ContextMenuItem className="font-semibold text-red-400 focus:text-red-500">
								<LuTrash className="mr-1" /> Delete Edge
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenuPortal>
				</ContextMenu>
			</EdgeLabelRenderer>
		</>
	);
}
