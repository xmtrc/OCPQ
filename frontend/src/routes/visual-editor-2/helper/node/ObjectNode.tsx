import type { NodeProps, Node } from "@xyflow/react";
import type {
	ObjectNodeData,
	ObjectNodePredicate,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
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
import {
	defaultNodeData,
	defaultNodePredicateData,
	OBJECT_NODE_TYPE,
	predicateTypeShortLabels,
} from "@/routes/visual-editor-2/helper/const.ts";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import NodeBox from "@/routes/visual-editor-2/helper/node/common/NodeBox.tsx";
import NodeEditButton from "@/routes/visual-editor-2/helper/node/common/NodeEditButton.tsx";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import AttributeRangeDialog from "@/routes/visual-editor-2/helper/node/common/AttributeRangeDialog.tsx";
import type { OCELTypeAttribute } from "@/types/ocel.ts";
import NodePredicateLabel from "@/routes/visual-editor-2/helper/node/common/NodePredicateLabel.tsx";

export default function ObjectNode({ data, id, selected }: NodeProps<Node<ObjectNodeData>>) {
	const { onNodeDataChange, ocelInfo } = useContext(VisualEditorContext);
	const ocelStats = useOcelStats();

	type OpenDialog = "edit" | "rename" | "delete" | "oarEdit" | "oarDelete" | undefined;
	const [dialog, setDialog] = useState<OpenDialog>(undefined);

	const [editTypes, setEditTypes] = useState<string[]>(data.objectTypes);
	const [oarDraft, setOarDraft] = useState<ObjectNodePredicate>(
		defaultNodePredicateData[PredicateType.ObjectAttributeRange](),
	);

	// TODO: Refactor, looks ugly
	function getOcelEventAttributes() {
		const ocelAttributes: OCELTypeAttribute[] = [{ name: "ocel:id", type: "string" }];
		for (const eventType of data.objectTypes) {
			const ocelType = ocelInfo?.object_types.find(
				(ocelObjectType) => ocelObjectType.name === eventType,
			);
			if (!ocelType) continue;
			for (const ocelTypeAttribute of ocelType.attributes) {
				!ocelAttributes.find((ocelAttribute) => ocelAttribute.name === ocelTypeAttribute.name) &&
					ocelAttributes.push(ocelTypeAttribute);
			}
		}
		return ocelAttributes;
	}

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
			<div className="flex flex-col-reverse items-end absolute w-full bottom-full pb-0.5 nodrag -z-2">
				{data.predicates.map((predicate) => (
					<NodePredicateLabel
						key={predicate.id}
						predicate={predicate}
						disableEdit={false}
						onEdit={() => {
							setOarDraft(predicate);
							setDialog("oarEdit");
						}}
						onDelete={() => {
							setOarDraft(predicate);
							setDialog("oarDelete");
						}}
					/>
				))}
			</div>
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
							onClick={() => setDialog("edit")}
						/>
					</div>
				</ContextMenuTrigger>
				<ContextMenuPortal>
					<ContextMenuContent>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">
							Filters and Constraints
						</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setOarDraft(defaultNodePredicateData[PredicateType.ObjectAttributeRange]());
									setDialog("oarEdit");
								}, 100);
							}}
						>
							Add OAR Predicate
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Edit Node</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDialog("rename");
								}, 100);
							}}
						>
							Rename Node
						</ContextMenuItem>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDialog("edit");
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
									setDialog("delete");
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
				open={dialog === "rename"}
				initialName={data.displayName ?? ""}
				defaultName={defaultNodeData[OBJECT_NODE_TYPE]().displayName}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onRename={(newName) => {
					onNodeDataChange(id, {
						displayName: newName,
					});
				}}
			/>
			<AttributeRangeDialog
				open={dialog === "oarEdit"}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onSave={() => {
					if (!oarDraft.isInitialized) {
						const saveOar = {
							...oarDraft,
							isInitialized: true,
						} satisfies ObjectNodePredicate;
						onNodeDataChange(id, {
							predicates: [...data.predicates, saveOar],
						});
					} else {
						onNodeDataChange(id, {
							predicates: data.predicates.map((predicate) => {
								if (predicate.id === oarDraft.id) {
									return oarDraft;
								} else {
									return predicate;
								}
							}),
						});
					}
				}}
				predicateType={PredicateType.ObjectAttributeRange}
				predicateMode={oarDraft.mode}
				setPredicateMode={(predicateMode) =>
					setOarDraft((oldDraft) => ({
						...oldDraft,
						mode: predicateMode,
					}))
				}
				isInitialized={oarDraft.isInitialized}
				ocelAttributes={getOcelEventAttributes()}
				attribute={oarDraft.attribute}
				setAttribute={(attribute) =>
					setOarDraft((oldDraft) => ({
						...oldDraft,
						attribute: attribute,
					}))
				}
				timeMode={oarDraft.objectAttributeTimeMode}
				setTimeMode={(timeMode) =>
					setOarDraft((oldDraft) => ({ ...oldDraft, objectAttributeTimeMode: timeMode }))
				}
				attributeRange={oarDraft.range}
				setAttributeRange={(attributeRange) =>
					setOarDraft((oldDraft) => ({
						...oldDraft,
						range: attributeRange,
					}))
				}
			/>
			<AlertDialog open={dialog === "edit"} onOpenChange={(open) => !open && setDialog(undefined)}>
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
								setDialog(undefined);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onNodeDataChange(id, {
									objectTypes: editTypes,
								});
								setDialog(undefined);
							}}
						>
							{data.objectTypes.length === 0 ? "Add" : "Edit"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<DeleteDialog
				open={dialog === "delete"}
				toBeDeleted={`node "${data.displayName || defaultNodeData[OBJECT_NODE_TYPE]().displayName}"`}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => onNodeDataChange(id, undefined)}
			/>
			<DeleteDialog
				open={dialog === "oarDelete"}
				toBeDeleted={`${predicateTypeShortLabels[oarDraft.type]} ${oarDraft.mode}`}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => {
					onNodeDataChange(id, {
						predicates: data.predicates.filter((predicate) => predicate.id !== oarDraft.id),
					});
				}}
			/>
		</NodeBox>
	);
}
