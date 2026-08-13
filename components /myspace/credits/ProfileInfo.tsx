type ProfileInfoProps = {
  name: string;
  username: string;
  align?: "left" | "center";
  nameClassName?: string;
};

export function ProfileInfo({
  name,
  username,
  align = "left",
  nameClassName = "font-bold",
}: ProfileInfoProps) {
  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <p className={`text-text ${nameClassName}`}>{name}</p>

      {username && <p className="text-text-muted">{username}</p>}
    </div>
  );
}