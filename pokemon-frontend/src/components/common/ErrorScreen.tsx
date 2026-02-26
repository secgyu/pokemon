interface ErrorScreenProps {
  title?: string;
  message?: string;
}

export function ErrorScreen({ title = "로딩 실패", message }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-pixel text-sm text-[#cc0000]">{title}</p>
      {message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
