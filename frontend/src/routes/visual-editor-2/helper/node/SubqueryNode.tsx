import { type Node, type NodeProps, NodeResizeControl } from "@xyflow/react";
import type { SubqueryNodeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useContext, useRef, useState } from "react";
import {
	defaultNodeData,
	EVENT_NODE_TYPE,
	OBJECT_NODE_TYPE,
	SUBQUERY_NODE_TYPE,
} from "@/routes/visual-editor-2/helper/const.ts";
import { LuMoveDiagonal2, LuTrash } from "react-icons/lu";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import RenameNodeDialog from "@/routes/visual-editor-2/helper/node/common/RenameNodeDialog.tsx";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import NodeBox from "@/routes/visual-editor-2/helper/node/common/NodeBox.tsx";
import { cn } from "@/lib/utils.ts";

export default function SubqueryNode({ data, id, selected }: NodeProps<Node<SubqueryNodeData>>) {
	const { addNewNode, onNodeDataChange } = useContext(VisualEditorContext);

	const contextMenuPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [renameAlertOpen, setRenameAlertOpen] = useState(false);

	return (
		<NodeBox
			id={id}
			flavor="subquery"
			selected={selected}
			color={data.color}
			isHandleOnTop={data.isHandleOnTop}
			isDisabled={data.isDisabled}
			className="w-full h-full min-w-60"
		>
			<NodeResizeControl
				className={cn(
					"flex justify-center items-center p-1.5 bg-red-100! hover:bg-red-200! transition",
					data.isDisabled && "bg-gray-300!",
				)}
				style={{
					border: "none",
					borderRadius: "100%",
					width: 24,
					height: 24,
					translate: "-166% -166%",
				}}
				minWidth={240}
				minHeight={80}
				autoScale={false}
			>
				<LuMoveDiagonal2 className="text-gray-600" />
			</NodeResizeControl>
			<ContextMenu>
				<ContextMenuTrigger
					onContextMenu={(ev) => {
						ev.stopPropagation();
						contextMenuPos.current = { x: ev.clientX, y: ev.clientY };
					}}
					className="flex flex-col justify-between h-full w-full p-4"
				>
					<div className="flex justify-between border-b pb-2">
						<div className="font-semibold">{data.displayName}</div>
					</div>
					<div className="border-t pt-2 text-gray-600 font-semibold text-xs">
						<div>Labels:</div>
						<div>CEL:</div>
						<div>CEL+:</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuPortal>
					<ContextMenuContent>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">
							Filters and Constraints
						</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {}, 100);
							}}
						>
							Add Filter or Constraint
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Add Nodes</div>
						<ContextMenuItem
							onClick={() => {
								addNewNode(EVENT_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Event Node
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								addNewNode(OBJECT_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Object Node
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								addNewNode(SUBQUERY_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Subquery Node
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Edit Node</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setRenameAlertOpen(true);
								}, 100);
							}}
						>
							Rename Node
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<ContextMenuItem>Cancel</ContextMenuItem>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDeleteAlertOpen(true);
								}, 100);
							}}
							className="font-semibold text-red-400 focus:text-red-500"
						>
							<LuTrash className="mr-1" /> Delete Subquery Node
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuPortal>
			</ContextMenu>
			<RenameNodeDialog
				open={renameAlertOpen}
				initialName={data.displayName ?? ""}
				defaultName={defaultNodeData[SUBQUERY_NODE_TYPE]().displayName}
				onOpenChange={setRenameAlertOpen}
				onRename={(newName) => {
					onNodeDataChange(id, {
						displayName: newName,
					});
				}}
			/>
			<DeleteDialog
				open={deleteAlertOpen}
				toBeDeleted={`node "${data.displayName || defaultNodeData[SUBQUERY_NODE_TYPE]().displayName}"`}
				additionalDescription="All nodes inside it will also be deleted."
				onOpenChange={setDeleteAlertOpen}
				onDelete={() => onNodeDataChange(id, undefined)}
			/>
		</NodeBox>
	);
}
