import {
	type Node,
	type Edge,
	type EdgeProps,
	EdgeLabelRenderer,
	getBezierPath,
	useInternalNode,
	useReactFlow,
} from "@xyflow/react";
import { PredicateMode } from "@/routes/visual-editor-2/helper/types.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { LuTrash } from "react-icons/lu";
import { useContext, useState } from "react";
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
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { EVENT_NODE_TYPE, OBJECT_NODE_TYPE } from "@/routes/visual-editor-2/helper/const.ts";
import { Combobox } from "@/components/ui/combobox.tsx";
import FloatingEdge from "@/routes/visual-editor-2/helper/edge/common/FloatingEdge.tsx";
import { getEdgeParams } from "@/routes/visual-editor-2/helper/edge/common/floatingEdgeUtils.ts";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import type {
	ChildBindingSetEqualsData,
	EdgeDataTypes,
	NodeDataTypes,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";

export default function ChildBindingSetEqualsEdge(
	props: EdgeProps<Edge<ChildBindingSetEqualsData>>,
) {
	const { id, source, target, data } = props;
	const { onEdgeDataChange } = useContext(VisualEditorContext);

	const instance = useReactFlow<Node<NodeDataTypes>, Edge<EdgeDataTypes>>();
	const nodes = instance
		.getNodes()
		.filter((node) => node.type === EVENT_NODE_TYPE || node.type === OBJECT_NODE_TYPE);
	const options = nodes.map((node) => ({ value: node.id, label: node.id }));

	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [editAlertOpen, setEditAlertOpen] = useState(!data?.isInitialized);

	// TODO: fix
	const [mode, setMode] = useState(data?.mode);
	const [value, setValue] = useState<{
		projected: string;
		projectedEventNodeId: string;
	}>({
		projected: "false",
		projectedEventNodeId: "",
	});

	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

	const [_edgePath, labelX, labelY] = getBezierPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetPosition: targetPos,
		targetX: tx,
		targetY: ty,
	});

	return (
		<>
			<FloatingEdge {...props} />
			<EdgeLabelRenderer>
				<ContextMenu>
					<ContextMenuTrigger id={`edge-context-menu-${id}`}>
						<div
							style={{
								position: "absolute",
								transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
								fontSize: 12,
								pointerEvents: "all",
							}}
							className="nodrag nopan z-1002"
							onClick={() => {
								setTimeout(() => {
									setEditAlertOpen(true);
								}, 100);
							}}
						>
							<div className="flex items-center font-semibold text-sm w-fit min-w-6 h-6 px-2 rounded-full bg-yellow-100! hover:bg-yellow-200! transition">
								CBE {data?.mode}
							</div>
						</div>
					</ContextMenuTrigger>
					<ContextMenuPortal>
						<ContextMenuContent>
							<ContextMenuItem
								onSelect={() => {
									setTimeout(() => {
										setEditAlertOpen(true);
									}, 100);
								}}
							>
								Edit CBE {data?.mode}
							</ContextMenuItem>
							<div className="border-t my-1 mx-2"></div>
							<ContextMenuItem>Cancel</ContextMenuItem>
							<ContextMenuItem
								className="font-semibold text-red-400 focus:text-red-500"
								onSelect={() => {
									setTimeout(() => {
										setDeleteAlertOpen(true);
									}, 100);
								}}
							>
								<LuTrash className="mr-1" /> Delete CBE {data?.mode}
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenuPortal>
				</ContextMenu>
				<AlertDialog open={editAlertOpen} onOpenChange={(op) => setEditAlertOpen(op)}>
					<AlertDialogContent
						onContextMenuCapture={(ev) => {
							ev.stopPropagation();
						}}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{data?.isInitialized
									? `Edit Child Binding Size Equals ${data?.mode}`
									: "Add Child Binding Size Equals Relation"}
							</AlertDialogTitle>
							<AlertDialogDescription>
								<span>Use this relation as a filter or as a constraint.</span>
								<ToggleGroup
									className="justify-start my-3"
									type="single"
									value={mode}
									onValueChange={(v: PredicateMode) => setMode(v)}
								>
									<ToggleGroupItem value={PredicateMode.Filter} variant={"outline"}>
										Filter
									</ToggleGroupItem>
									<ToggleGroupItem value={PredicateMode.Constraint} variant={"outline"}>
										Constraint
									</ToggleGroupItem>
								</ToggleGroup>
								<span>Project this {data?.mode} to a child set.</span>
								<ToggleGroup
									className="justify-start my-3"
									type="single"
									value={value.projected}
									onValueChange={(v) =>
										setValue((oldValue) => {
											return {
												projected: v,
												projectedEventNodeId: oldValue.projectedEventNodeId,
											};
										})
									}
								>
									<ToggleGroupItem value={"true"} variant={"outline"}>
										Projected
									</ToggleGroupItem>
									<ToggleGroupItem value={"false"} variant={"outline"}>
										Not Projected
									</ToggleGroupItem>
								</ToggleGroup>
								<Combobox
									options={options}
									disabled={value.projected !== "true"}
									onChange={(newNode) =>
										setValue((oldValue) => {
											return {
												projected: oldValue.projected,
												projectedEventNodeId: newNode,
											};
										})
									}
									name={"Project"}
									value={value.projectedEventNodeId}
								/>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={() => {
									if (data?.isInitialized) {
										setEditAlertOpen(false);
									} else {
										onEdgeDataChange(id, undefined);
									}
								}}
							>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onEdgeDataChange(id, {
										mode: mode,
										isInitialized: true,
									});
									setEditAlertOpen(false);
								}}
							>
								{data?.isInitialized ? "Edit" : "Save"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<DeleteDialog
					open={deleteAlertOpen}
					toBeDeleted={`CBE ${data?.mode}`}
					onOpenChange={setDeleteAlertOpen}
					onDelete={() => onEdgeDataChange(id, undefined)}
				/>
			</EdgeLabelRenderer>
		</>
	);
}
