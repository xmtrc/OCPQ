import {NodeProps, Node} from "@xyflow/react";
import {ObjectNodeData} from "@/routes/visual-editor/helper/types.ts";
import {clsx} from "clsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";
import {LuPencil, LuTrash} from "react-icons/lu";
import {useContext, useState} from "react";
import {VisualEditorContext} from "@/routes/visual-editor/helper/VisualEditorContext.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import MultiSelect from "@/components/ui/multi-select.tsx";

export default function ObjectNode({data, id, selected, parentId}: NodeProps<Node<ObjectNodeData>>) {

    const {onNodeDataChange, ocelInfo} = useContext(VisualEditorContext);

    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [editAlertOpen, setEditAlertOpen] = useState(false);
    const [editTypes, setEditTypes] = useState<string[]>([])

    return (
        <div className={clsx(
            "border-2 shadow-lg text-sm text-start z-10 flex flex-col rounded-md relative min-h-20 w-60 bg-green-50",
            selected && "border-dashed",
        )}>
            <ContextMenu>
                <ContextMenuTrigger
                    onContextMenu={(ev) => {
                        ev.stopPropagation();
                    }}
                    className="h-full w-full p-4"
                >
                    <div className="flex justify-between border-b pb-2">
                        <div className="font-semibold">
                            {data.displayName}
                        </div>
                        <div className="text-gray-400 text-xs">
                            OID: {id.slice(0, 8)} <br/> PID: {parentId ? parentId?.slice(0, 8) : "root"}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <div className="text-gray-600">
                            <div className="flex flex-wrap gap-1 min-h-6 text-xs items-center">
                                <div className="font-semibold">
                                    {data.objectTypes.length > 1 ? "Types: " : "Type: "}
                                    {data.objectTypes.length === 0 ? "none" : "" }
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
                        <button
                            className="flex ml-auto self-end justify-center items-center size-6 rounded-full bg-green-100! p-1.5 hover:bg-green-200! transition"
                            onClick={() => {
                                setTimeout(() => {
                                    setEditAlertOpen(true);
                                }, 100);
                            }}
                        >
                            <LuPencil className="text-gray-600"/>
                        </button>
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
                            <LuTrash className="mr-1"/> Delete Object Node
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenuPortal>
            </ContextMenu>
            <AlertDialog open={editAlertOpen} onOpenChange={(op) => setDeleteAlertOpen(op)}>
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
                                    <span className="font-bold text-purple-600">B</span>{" "}
                                    object).
                                </span>
                        </AlertDialogDescription>
                        {ocelInfo === undefined
                            ? <div className="pt-4">
                                No OCEL Info available. Check backend and reload.
                            </div>
                            : <div className="pt-4">
                                <MultiSelect
                                    options={ocelInfo.object_types.map((value) => {
                                        return {
                                            value: value.name,
                                            label: value.name,
                                        };
                                    })}
                                    defaultValue={data.objectTypes}
                                    placeholder={""}
                                    onValueChange={(value) => {
                                        setEditTypes(value);
                                    }}
                                />
                            </div>
                        }
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
                                } satisfies ObjectNodeData);
                                setEditAlertOpen(false);
                            }}
                        >
                            {data.objectTypes.length === 0 ? "Add" : "Edit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={deleteAlertOpen} onOpenChange={(op) => setDeleteAlertOpen(op)}>
                <AlertDialogContent
                    onContextMenuCapture={(ev) => {
                        ev.stopPropagation();
                    }}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This node will be deleted. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onNodeDataChange(id, undefined);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
