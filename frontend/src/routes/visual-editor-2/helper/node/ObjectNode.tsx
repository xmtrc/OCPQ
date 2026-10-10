import type { NodeProps, Node } from "@xyflow/react";
import type { ObjectNodeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { LuTrash } from "react-icons/lu";
import { useContext, useState } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { ObjectTypeChooser } from "@r4pm/components";
import { useOcelStats } from "@/hooks";
import { R4pmIsland } from "@/components/r4pm/R4pmIsland.tsx";
import RenameNodeDialog from "@/routes/visual-editor-2/helper/node/common/RenameNodeDialog.tsx";
import { defaultNodeData, OBJECT_NODE_TYPE } from "@/routes/visual-editor-2/helper/const.ts";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import NodeBox from "@/routes/visual-editor-2/helper/node/common/NodeBox.tsx";
import NodeEditButton from "@/routes/visual-editor-2/helper/node/common/NodeEditButton.tsx";

export default function ObjectNode({ data, id, selected }: NodeProps<Node<ObjectNodeData>>) {
	const { onNodeDataChange, ocelInfo } = useContext(VisualEditorContext);
	const ocelStats = useOcelStats();

	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [editAlertOpen, setEditAlertOpen] = useState(false);
	const [renameAlertOpen, setRenameAlertOpen] = useState(false);
	const [editTypes, setEditTypes] = useState<string[]>(data.objectTypes);

	return (
		<NodeBox
			id={id}
			flavor="object"
			selected={selected}
			color={data.color}
			isHandleOnTop={data.isHandleOnTop}
			isDisabled={data.isDisabled}
			className="w-52"
		>
			<ContextMenu>
				<ContextMenuTrigger
					onContextMenu={(ev) => {
						ev.stopPropagation();
					}}
					className="h-full w-full p-4"
				>
					<div className="flex justify-between border-b pb-2">
						<div className="font-semibold">{data.displayName}</div>
					</div>
					<div className="flex gap-2 pt-2">
						<div className="text-gray-600">
							<div className="flex flex-wrap gap-1 min-h-6 text-xs items-center">
								<div className="font-semibold">
									{data.objectTypes.length > 1 ? "Types: " : "Type: "}
									{data.objectTypes.length === 0 ? "none" : ""}
								</div>
								{data.objectTypes.map((objectType, index) => {
									return (
										<div key={index} className="py-1 px-2 bg-green-100 rounded-full">
											{objectType}
										</div>
									);
								})}
							</div>
						</div>
						<NodeEditButton
							flavor="object"
							isDisabled={data.isDisabled}
							onClick={() => setEditAlertOpen(true)}
						/>
					</div>
				</ContextMenuTrigger>
				<ContextMenuPortal>
					<ContextMenuContent>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">
							Filters and Constraints
						</div>
						<ContextMenuItem>Add Filter or Constraint</ContextMenuItem>
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
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setEditAlertOpen(true);
								}, 100);
							}}
						>
							Edit Object Types
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
							<LuTrash className="mr-1" /> Delete Object Node
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuPortal>
			</ContextMenu>
			<RenameNodeDialog
				open={renameAlertOpen}
				initialName={data.displayName ?? ""}
				defaultName={defaultNodeData[OBJECT_NODE_TYPE]().displayName}
				onOpenChange={setRenameAlertOpen}
				onRename={(newName) => {
					onNodeDataChange(id, {
						displayName: newName,
					});
				}}
			/>
			<AlertDialog open={editAlertOpen} onOpenChange={setEditAlertOpen}>
				<AlertDialogContent
					onContextMenuCapture={(ev) => {
						ev.stopPropagation();
					}}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{data.objectTypes.length === 0 ? "Add" : "Edit"} Object Types
						</AlertDialogTitle>
						<AlertDialogDescription>
							<span>
								Multiple types are considered with OR-semantics (e.g., an{" "}
								<span className="font-bold text-blue-600">A</span> or{" "}
								<span className="font-bold text-purple-600">B</span> object).
							</span>
						</AlertDialogDescription>
						{ocelInfo === undefined ? (
							<div className="pt-4">No OCEL Info available. Check backend and reload.</div>
						) : (
							<div className="pt-4">
								<R4pmIsland>
									<ObjectTypeChooser
										counts={
											ocelStats?.object_type_counts ??
											Object.fromEntries(ocelInfo.object_types.map((t) => [t.name, 0]))
										}
										value={new Set(editTypes)}
										onChange={(next) => setEditTypes([...next])}
										mode="multi"
										searchable
										showCutoff={false}
									/>
								</R4pmIsland>
							</div>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setEditTypes(data.objectTypes);
								setEditAlertOpen(false);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onNodeDataChange(id, {
									objectTypes: editTypes,
								});
								setEditAlertOpen(false);
							}}
						>
							{data.objectTypes.length === 0 ? "Add" : "Edit"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<DeleteDialog
				open={deleteAlertOpen}
				toBeDeleted={`node "${data.displayName || defaultNodeData[OBJECT_NODE_TYPE]().displayName}"`}
				onOpenChange={setDeleteAlertOpen}
				onDelete={() => onNodeDataChange(id, undefined)}
			/>
		</NodeBox>
	);
}
