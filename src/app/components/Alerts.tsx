import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {TrashIcon} from "@/app/components/Icons";
import {StateSetter} from "@/lib/types";
import {ReactElement} from "react";

function DeleteChat() {
    return <AlertDialog>
        <AlertDialogTrigger><TrashIcon/></AlertDialogTrigger>

        <AlertDialogContent className="w-[80%] rounded-lg">
            <AlertDialogHeader>
                <AlertDialogTitle className="w-full text-left font-normal text-sm">
                    Do you want to save this
                    conversation?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex w-full flex-row items-center justify-end gap-4">
                <AlertDialogCancel className="bg-transparent w-fit h-fit">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-[#00956b] w-fit h-fit">Save</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}

export function Dialog(
    {title, acceptText, rejectText, open, setOpen, onAccept, onReject, children}:
        {
            title: string,
            acceptText: string,
            rejectText: string,
            open: boolean,
            setOpen: StateSetter<boolean>,
            onAccept?: () => void,
            onReject?: () => void,
            children?: any
        }) {
    return <AlertDialog open={open} onOpenChange={e => setOpen(e)}>

        <AlertDialogContent className="w-[80%] rounded-lg inline-block">
            <AlertDialogHeader>
                <AlertDialogTitle className="w-full text-left font-normal text-sm">
                    {title}
                </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="w-full">
            {children}
            </div>
            <AlertDialogFooter className="flex w-full flex-row items-center justify-end gap-4">
                <AlertDialogCancel className="bg-transparent w-fit h-fit" onClick={onReject}>{rejectText}</AlertDialogCancel>
                <AlertDialogAction className="bg-[#00956b] w-fit h-fit" onClick={onAccept}>{acceptText}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}