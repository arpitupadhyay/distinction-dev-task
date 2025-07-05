import { CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "./button";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const isSuccess = type === "success";
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-md ${
      isSuccess 
        ? "bg-green-50 border border-green-200 text-green-700" 
        : "bg-red-50 border border-red-200 text-red-700"
    }`}>
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`p-1 h-auto ${
            isSuccess 
              ? "text-green-600 hover:text-green-800 hover:bg-green-100" 
              : "text-red-600 hover:text-red-800 hover:bg-red-100"
          }`}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
} 