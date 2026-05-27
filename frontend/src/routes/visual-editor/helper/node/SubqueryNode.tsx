import {type Edge, Node, NodeProps, NodeResizeControl, useReactFlow} from "@xyflow/react";
import {
    EventNodeData, type EventTypeLinkData,
    type EventTypeNodeData,
    type GateNodeData,
    ObjectNodeData, SubqueryNodeData
} from "@/routes/visual-editor/helper/types.ts";
import {clsx} from "clsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {v4} from "uuid";
import {EVENT_NODE_TYPE, OBJECT_NODE_TYPE, SUBQUERY_NODE_TYPE} from "@/routes/visual-editor/helper/const.ts";
import {LuMoveDiagonal2, LuTrash} from "react-icons/lu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {VisualEditorContext} from "@/routes/visual-editor/helper/VisualEditorContext.tsx";

export default function SubqueryNode({data, id, selected, parentId}: NodeProps<Node<ObjectNodeData>>) {

    const instance = useReactFlow<Node<EventTypeNodeData | GateNodeData | EventNodeData | ObjectNodeData | SubqueryNodeData>, Edge<EventTypeLinkData>>();
    const {onNodeDataChange} = useContext(VisualEditorContext);

    const contextMenuPos = useRef<{ x: number; y: number }>({x: 0, y: 0});
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const addNewEventNode = useCallback(
        () => {
            instance.setNodes((nodes) => {
                return [
                    ...nodes,
                    {
                        id: v4(),
                        type: EVENT_NODE_TYPE,
                        position: {
                            x: contextMenuPos.current.x,
                            y: contextMenuPos.current.y,
                        },
                        data: {
                            displayName: "EventNode",
                            eventTypes: [],
                        } satisfies EventNodeData,
                        extent: "parent",
                        parentId: id,
                    },
                ];
            });
        },
        [instance],
    );

    const addNewObjectNode = useCallback(
        () => {
            instance.setNodes((nodes) => {
                return [
                    ...nodes,
                    {
                        id: v4(),
                        type: OBJECT_NODE_TYPE,
                        position: {
                            x: contextMenuPos.current.x,
                            y: contextMenuPos.current.y,
                        },
                        data: {
                            displayName: "ObjectNode",
                            objectTypes: [],
                        } satisfies ObjectNodeData,
                        extent: "parent",
                        parentId: id,
                    },
                ];
            });
        },
        [instance],
    );

    const addNewSubqueryNode = useCallback(
        () => {
            instance.setNodes((nodes) => {
                return [
                    ...nodes,
                    {
                        id: v4(),
                        type: SUBQUERY_NODE_TYPE,
                        resizing: true,
                        position: {
                            x: contextMenuPos.current.x,
                            y: contextMenuPos.current.y,
                        },
                        data: {
                            displayName: "SubqueryNode",
                        } satisfies SubqueryNodeData,
                        extent: "parent",
                        parentId: id,
                    },
                ];
            });
        },
        [instance],
    );

    return (
        <div className={clsx(
            "border-2 shadow-lg text-sm text-start z-10 flex flex-col rounded-md relative w-full h-full min-h-20 min-w-60 bg-red-50",
            selected && "border-dashed",
        )}>
            <NodeResizeControl
                className="flex justify-center items-center p-1.5 bg-red-100! hover:bg-red-200! transition"
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
                <LuMoveDiagonal2 className="text-gray-600"/>
            </NodeResizeControl>
            <ContextMenu>
                <ContextMenuTrigger
                    onContextMenu={(ev) => {
                        ev.stopPropagation();
                        contextMenuPos.current = {x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY};
                    }}
                    className="flex flex-col justify-between h-full w-full p-4"
                >
                    <div className="flex justify-between border-b pb-2">
                        <div className="font-semibold">
                            {data.displayName}
                        </div>
                        <div className="text-gray-400 text-xs">
                            SID: {id.slice(0, 8)} <br/> PID: {parentId ? parentId?.slice(0, 8) : "root"}
                        </div>
                    </div>
                    <div className="border-t pt-2 text-gray-600 font-semibold text-xs">
                        <div>Labels:</div>
                        <div>CEL:</div>
                        <div>CEL+:</div>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuPortal>
                    <ContextMenuContent>
                        <ContextMenuItem
                            onClick={() => {
                                addNewEventNode();
                            }}
                        >
                            Add Event Node
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => {
                                addNewObjectNode();
                            }}
                        >
                            Add Object Node
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => {
                                addNewSubqueryNode();
                            }}
                        >
                            Add Subquery Node
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
                            <LuTrash className="mr-1"/> Delete Subquery Node
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenuPortal>
            </ContextMenu>
            <AlertDialog open={deleteAlertOpen} onOpenChange={(op) => setDeleteAlertOpen(op)}>
                <AlertDialogContent
                    onContextMenuCapture={(ev) => {
                        ev.stopPropagation();
                    }}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This node and all contained nodes will be deleted. This
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
