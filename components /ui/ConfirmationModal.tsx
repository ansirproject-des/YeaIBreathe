type ConfirmationModalProps = {
  title: string,
  content: React.ReactNode,
}


export function ConfirmationModal({
  title,
  content,
}: ConfirmationModalProps) {
  return (
    <>
      <div className="w-full mb-6">
        <h3 className="text-xl text-text font-bold">{title}</h3>
      </div>

<div className="w-full flex flex-col mt-4 gap-1 text-text">
              {content}
          </div>
      
    </>
  );
}