interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, size = "md", className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm",
    lg: "w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl"
  };

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <span className="font-bold text-white">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}