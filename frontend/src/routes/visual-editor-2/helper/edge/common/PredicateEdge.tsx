import {
	predicateTypeShortLabels,
	predicateTypeLabels,
	type edgeTypes,
} from "@/routes/visual-editor-2/helper/const.ts";
import { PredicateMode } from "@/routes/visual-editor-2/helper/types.ts";
import { type ReactNode, useContext, useState } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import {
	type Edge,
	EdgeLabelRenderer,
	type EdgeProps,
	getBezierPath,
	useInternalNode,
} from "@xyflow/react";
import { getEdgeParams } from "@/routes/visual-editor-2/helper/edge/common/floatingEdgeUtils.ts";
import FloatingEdge from "@/routes/visual-editor-2/helper/edge/common/FloatingEdge.tsx";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { LuTrash } from "react-icons/lu";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import type { EdgeDataTypes } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import type { VariantProps } from "class-variance-authority";
import PredicateLabel, {
	type predicateLabelVariants,
} from "@/routes/visual-editor-2/helper/common/PredicateLabel.tsx";

interface PredicateEdgeProps extends VariantProps<typeof predicateLabelVariants> {
	type: keyof typeof edgeTypes;
	label?: string;
	edgeProps: EdgeProps<Edge<EdgeDataTypes>>;
	onOpen?: () => void;
	onSave: (mode: PredicateMode) => void;
	children: ReactNode;
}

export default function PredicateEdge({
	type,
	flavor,
	label,
	edgeProps,
	onOpen,
	onSave,
	children,
}: PredicateEdgeProps) {
	const { id, source, target, data } = edgeProps;
	const { onEdgeDataChange } = useContext(VisualEditorContext);

	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [editAlertOpen, setEditAlertOpen] = useState(!data?.isInitialized);

	const [mode, setMode] = useState(data?.mode ?? PredicateMode.Filter);

	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return undefined;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

	const [_edgePath, labelX, labelY] = getBezierPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetPosition: targetPos,
		targetX: tx,
		targetY: ty,
	});

	const initEditAlert = () => {
		setTimeout(() => {
			onOpen?.();
			setMode(data?.mode ?? PredicateMode.Filter);
			setEditAlertOpen(true);
		}, 100);
	};

	return (
		<>
			<FloatingEdge {...edgeProps} />
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
							onClick={initEditAlert}
						>
							<PredicateLabel
								type={type}
								mode={data?.mode}
								flavor={flavor}
								color={data?.color}
								label={label}
							/>
						</div>
					</ContextMenuTrigger>
					<ContextMenuPortal>
						<ContextMenuContent>
							<ContextMenuItem onSelect={initEditAlert}>
								Edit {predicateTypeShortLabels[type]} {data?.mode}
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
								<LuTrash className="mr-1" /> Delete {predicateTypeShortLabels[type]} {data?.mode}
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
									? `Edit ${predicateTypeLabels[type]} ${data?.mode}`
									: `Add ${predicateTypeLabels[type]} Relation`}
							</AlertDialogTitle>
							<AlertDialogDescription>
								<span>Use this relation as a filter or as a constraint.</span>
							</AlertDialogDescription>
							<div className="text-sm text-muted-foreground">
								<ToggleGroup
									className="justify-start mb-3 mt-1"
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
								{children}
							</div>
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
									onSave(mode);
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
					toBeDeleted={`${predicateTypeShortLabels[type]} ${data?.mode}`}
					onOpenChange={setDeleteAlertOpen}
					onDelete={() => onEdgeDataChange(id, undefined)}
				/>
			</EdgeLabelRenderer>
		</>
	);
}
