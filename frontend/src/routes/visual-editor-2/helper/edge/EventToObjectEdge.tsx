import {
	type Edge,
	EdgeLabelRenderer,
	type EdgeProps,
	getBezierPath,
	useInternalNode,
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
import { useContext, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input.tsx";
import FloatingEdge from "@/routes/visual-editor-2/helper/edge/common/FloatingEdge.tsx";
import { getEdgeParams } from "@/routes/visual-editor-2/helper/edge/common/floatingEdgeUtils.ts";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import type { EventToObjectEdgeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";

export default function EventToObjectEdge(props: EdgeProps<Edge<EventToObjectEdgeData>>) {
	const { id, source, target, data } = props;
	const { onEdgeDataChange } = useContext(VisualEditorContext);

	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [editAlertOpen, setEditAlertOpen] = useState(!data?.isInitialized);

	const [mode, setMode] = useState(data?.mode);
	const qualifierRef = useRef<HTMLInputElement>(null);

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
									setMode(data?.mode);
									setEditAlertOpen(true);
								}, 100);
							}}
						>
							<div className="flex items-center font-semibold text-sm w-fit min-w-6 h-6 px-2 rounded-full bg-blue-100! hover:bg-blue-200! transition">
								E2O {data?.mode}
								{data?.qualifier ? `: ${data.qualifier}` : ""}
							</div>
						</div>
					</ContextMenuTrigger>
					<ContextMenuPortal>
						<ContextMenuContent>
							<ContextMenuItem
								onSelect={() => {
									setTimeout(() => {
										setMode(data?.mode);
										setEditAlertOpen(true);
									}, 100);
								}}
							>
								Edit E2O {data?.mode}
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
								<LuTrash className="mr-1" /> Delete E2O {data?.mode}
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenuPortal>
				</ContextMenu>
				<AlertDialog open={editAlertOpen} onOpenChange={setEditAlertOpen}>
					<AlertDialogContent
						onContextMenuCapture={(ev) => {
							ev.stopPropagation();
						}}
						onEscapeKeyDown={() => !data?.isInitialized && onEdgeDataChange(id, undefined)}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{data?.isInitialized
									? `Edit Event to Object ${data?.mode}`
									: "Add Event to Object Relation"}
							</AlertDialogTitle>
							<AlertDialogDescription>
								<span>Use this relation as a filter or as a constraint.</span>
								<ToggleGroup
									className="justify-start my-3"
									type="single"
									value={mode}
									onValueChange={(v) => v && setMode(v as PredicateMode)}
								>
									<ToggleGroupItem value={PredicateMode.Filter} variant={"outline"}>
										Filter
									</ToggleGroupItem>
									<ToggleGroupItem value={PredicateMode.Constraint} variant={"outline"}>
										Constraint
									</ToggleGroupItem>
								</ToggleGroup>
								<span>Enter the qualifier below.</span>
								<Input
									placeholder="Qualifier"
									className="my-3"
									defaultValue={data?.qualifier ?? ""}
									ref={qualifierRef}
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
										qualifier: qualifierRef.current?.value.trim() ?? "",
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
					toBeDeleted={`E2O ${data?.mode}`}
					onOpenChange={setDeleteAlertOpen}
					onDelete={() => onEdgeDataChange(id, undefined)}
				/>
			</EdgeLabelRenderer>
		</>
	);
}
