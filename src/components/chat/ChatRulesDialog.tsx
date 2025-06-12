
'use client';

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
import { Button } from "@/components/ui/button"; // Import Button

interface ChatRulesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const rules = [
  "No spamming",
  "No NSFW content",
  "Respect others",
  "No FUD or shilling unrelated projects",
  "English only",
];

export default function ChatRulesDialog({ isOpen, onOpenChange }: ChatRulesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card text-card-foreground border-border max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-primary text-center">Chat Rules</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground text-left pt-2">
            Please follow these rules to maintain a positive and respectful chat environment:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 px-2">
          <ul className="list-disc space-y-1.5 pl-5 text-foreground/90">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
        <AlertDialogFooter className="sm:justify-center"> {/* Center button on mobile */}
          <AlertDialogAction 
            asChild 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onOpenChange(false)}
          >
            <Button>I Understand</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
