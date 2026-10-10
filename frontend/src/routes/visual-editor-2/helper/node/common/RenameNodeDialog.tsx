import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useRef } from "react";

interface RenameNodeDialogProps {
	open: boolean;
	initialName: string;
	defaultName: string;
	onOpenChange: (open: boolean) => void;
	onRename: (newName: string) => void;
}

export default function RenameNodeDialog(props: RenameNodeDialogProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
			<AlertDialogContent
				onContextMenuCapture={(ev) => {
					ev.stopPropagation();
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>Rename Node</AlertDialogTitle>
					<AlertDialogDescription>Leave this empty to use the default name.</AlertDialogDescription>
				</AlertDialogHeader>
				<Input
					placeholder="Node Name"
					className="my-3"
					defaultValue={props.initialName}
					ref={inputRef}
				/>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => props.onRename(inputRef.current?.value.trim() || props.defaultName)}
					>
						Rename
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
