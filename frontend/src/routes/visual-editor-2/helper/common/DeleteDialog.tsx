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

interface DeleteDialogProps {
	open: boolean;
	toBeDeleted: string;
	additionalDescription?: string;
	onOpenChange: (open: boolean) => void;
	onDelete: () => void;
}

export default function DeleteDialog(props: DeleteDialogProps) {
	return (
		<AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
			<AlertDialogContent
				onContextMenuCapture={(ev) => {
					ev.stopPropagation();
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This {props.toBeDeleted} will be deleted. This action cannot be undone.
						{props.additionalDescription && (
							<>
								<br />
								{props.additionalDescription}
							</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={props.onDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
