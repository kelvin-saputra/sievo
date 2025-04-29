import { DeleteUserDTO } from "@/models/dto/user.dto";
import { UserSchema } from "@/models/schemas";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ActionCell({
  user,
  onDeleteUser,
}: {
  user: UserSchema;
  onDeleteUser: (data: DeleteUserDTO) => Promise<void>;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border shadow-md"
          >
            <DropdownMenuItem
              onClick={() => {
                console.log("View details for:", user.id);
              }}
              className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
            >
              Detail
            </DropdownMenuItem>
            {user.is_active && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-0 shadow-lg sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the
              user account and revoke all access permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-0 text-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const data = DeleteUserDTO.parse({
                  id: user.id,
                });
                onDeleteUser(data);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
